import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import { excelProductRowSchema } from "@/lib/validations/excel-product-import";

// Helper: Fetch limited related docs (Safe for small collections like categories/colors)
async function fetchDictionaryDocs(payload: any, collection: string) {
  let hasNextPage = true;
  let page = 1;
  const docs = [];

  while (hasNextPage) {
    const res = await payload.find({ collection, limit: 500, page, depth: 0 });
    docs.push(...res.docs);
    hasNextPage = res.hasNextPage;
    page++;
  }
  return docs;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Authentication & Authorization
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin privileges required." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // 2. Memory-conscious buffering
    const arrayBuffer = await file.arrayBuffer();

    // Warn: XLSX.read is synchronous and blocks the event loop.
    // In a hyper-scale env, this should be offloaded to a Worker Thread or replaced with a stream parser (e.g. exceljs).
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: "",
    });

    // 3. Fetch ONLY Dictionaries (Categories, Colors, Vein Patterns)
    const [categories, colors, veinPatterns] = await Promise.all([
      fetchDictionaryDocs(payload, "categories"),
      fetchDictionaryDocs(payload, "colors"),
      fetchDictionaryDocs(payload, "vein-patterns"),
    ]);

    const categoryMap = new Map(
      categories.map((c) => [c.slug.toLowerCase(), c.id]),
    );
    const colorMap = new Map(colors.map((c) => [c.slug.toLowerCase(), c.id]));
    const veinPatternMap = new Map(
      veinPatterns.map((v) => [v.slug.toLowerCase(), v.id]),
    );

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

    // 4. Pre-fetch ONLY existing products that are in the uploaded Excel file (O(1) Memory Fix)
    const uploadedCodes = Array.from(
      new Set(
        rawData.map((r) => String(r.code).trim().toUpperCase()).filter(Boolean),
      ),
    );
    const uploadedSlugs = Array.from(
      new Set(
        rawData.map((r) => String(r.slug).trim().toLowerCase()).filter(Boolean),
      ),
    );

    const existingProductsRes = await payload.find({
      collection: "products",
      where: {
        or: [{ code: { in: uploadedCodes } }, { slug: { in: uploadedSlugs } }],
      },
      limit: uploadedCodes.length + uploadedSlugs.length,
      depth: 0,
      pagination: false, // Fetch all matching in one query
    });

    const existingCodes = new Map(
      existingProductsRes.docs.map((p: any) => [p.code, p.id]),
    );
    const existingSlugs = new Map(
      existingProductsRes.docs.map((p: any) => [p.slug, p.id]),
    );

    // 5. Processing Batch Setup
    const BATCH_SIZE = 50;

    for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
      const batch = rawData.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (row, batchIndex) => {
        const rowNum = i + batchIndex + 2;

        if (!row.code && !row.slug && !row.title_fa) return null;

        const parseResult = excelProductRowSchema.safeParse(row);
        if (!parseResult.success) {
          throw new Error(
            `Row ${rowNum}: ${parseResult.error.errors.map((e) => e.message).join(" | ")}`,
          );
        }

        const item = parseResult.data;
        const categoryId = categoryMap.get(item.category_slug);
        const colorId = colorMap.get(item.color_slug);

        if (!categoryId)
          throw new Error(
            `Row ${rowNum} (${item.code}): Category "${item.category_slug}" not found.`,
          );
        if (!colorId)
          throw new Error(
            `Row ${rowNum} (${item.code}): Color "${item.color_slug}" not found.`,
          );

        let veinPatternId = null;
        if (item.vein_pattern_slug) {
          veinPatternId = veinPatternMap.get(item.vein_pattern_slug);
          if (!veinPatternId)
            throw new Error(
              `Row ${rowNum} (${item.code}): Vein Pattern "${item.vein_pattern_slug}" not found.`,
            );
        }

        // 6. Leverage payload's `locale: 'all'` to perform a Single Atomic DB Operation
        const payloadData = {
          code: item.code,
          slug: item.slug,
          category: categoryId,
          color_family: colorId,
          vein_pattern: veinPatternId,
          is_in_stock: item.is_in_stock,
          title: {
            fa: item.title_fa,
            en: item.title_en,
            ar: item.title_ar,
          },
          description: {
            fa: item.description_fa,
            en: item.description_en,
            ar: item.description_ar,
          },
          meta_title: {
            fa: item.meta_title_fa,
            en: item.meta_title_en,
            ar: item.meta_title_ar,
          },
          meta_description: {
            fa: item.meta_description_fa,
            en: item.meta_description_en,
            ar: item.meta_description_ar,
          },
        };

        const existingId =
          existingCodes.get(item.code) || existingSlugs.get(item.slug);

        if (existingId) {
          await payload.update({
            collection: "products",
            id: existingId,
            req, // Passing req propagates transaction context if invoked upstream
            locale: "all",
            data: payloadData as any,
          });
          return { type: "updated" };
        } else {
          await payload.create({
            collection: "products",
            req,
            locale: "all",
            data: payloadData as any,
          });
          return { type: "created" };
        }
      });

      // Execute batch concurrently and handle localized failures gracefully
      const results = await Promise.allSettled(batchPromises);

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          if (result.value.type === "created") createdCount++;
          if (result.value.type === "updated") updatedCount++;
        } else if (result.status === "rejected") {
          errors.push(result.reason.message);
        }
      });

      // Yield Event Loop: Crucial for Node.js health under heavy I/O
      await new Promise((resolve) => setImmediate(resolve));
    }

    return NextResponse.json({
      success: true,
      summary: {
        createdCount,
        updatedCount,
        failedCount: errors.length,
        errors,
      },
    });
  } catch (error: any) {
    // Structured Logging
    console.error(
      JSON.stringify({
        level: "CRITICAL",
        message: "Product Import Failed",
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json(
      {
        error: "Internal Server Error during processing. Check system logs.",
      },
      { status: 500 },
    );
  }
}
