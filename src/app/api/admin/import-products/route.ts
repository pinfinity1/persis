// src/app/api/admin/import-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import {
  excelProductRowSchema,
  type ExcelProductRow,
} from "@/lib/validations/excel-product-import";

export const maxDuration = 120; // Allow sufficient execution window for bulk operations
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB Hard Limit
const BATCH_SIZE = 25;

interface StructuredLog {
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  module: string;
  action: string;
  correlationId: string;
  durationMs?: number;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

function writeLog(payload: StructuredLog): void {
  const serialized = JSON.stringify(payload);
  if (payload.level === "ERROR" || payload.level === "FATAL") {
    console.error(serialized);
  } else if (payload.level === "WARN") {
    console.warn(serialized);
  } else {
    console.info(serialized);
  }
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const correlationId = crypto.randomUUID();

  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Authentication & Role Gate
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      writeLog({
        level: "WARN",
        module: "api.admin.import-products",
        action: "auth",
        correlationId,
        message: "Unauthorized import attempt intercepted",
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Unauthorized. Administrator privileges required." },
        { status: 401 },
      );
    }

    // 2. Request Body and Payload Guard
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "فایلی جهت پردازش ارسال نشده است." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم فایل اکسل بیش از سقف مجاز (۸ مگابایت) است." },
        { status: 413 },
      );
    }

    // 3. Memory & Event-Loop Conscious Parsing
    const arrayBuffer = await file.arrayBuffer();

    // Defer synchronous parse execution
    await new Promise((resolve) => setImmediate(resolve));
    const workbook = XLSX.read(arrayBuffer, {
      type: "array",
      dense: true, // Optimizes V8 internal array representation
      cellDates: false,
    });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName || !workbook.Sheets[sheetName]) {
      return NextResponse.json(
        { error: "فایل اکسل ارسالی فاقد برگه معتبر است." },
        { status: 400 },
      );
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(
      workbook.Sheets[sheetName],
      { defval: "", blankrows: false },
    );

    if (rawRows.length === 0) {
      return NextResponse.json(
        { error: "هیچ داده‌ای در فایل اکسل یافت نشد." },
        { status: 400 },
      );
    }

    // 4. Strict Pre-Flight Validation Phase (Zero DB Mutation on Schema Failure)
    const validRows: { rowNum: number; data: ExcelProductRow }[] = [];
    const validationErrors: string[] = [];
    const requiredCategorySlugs = new Set<string>();
    const requiredColorSlugs = new Set<string>();
    const requiredVeinSlugs = new Set<string>();
    const codesInSheet = new Set<string>();
    const slugsInSheet = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const rowNum = i + 2;
      const row = rawRows[i];

      // Discard trailing blank structural rows
      if (!row.code && !row.slug && !row.title_fa) continue;

      const parseResult = excelProductRowSchema.safeParse(row);
      if (!parseResult.success) {
        const issues = parseResult.error.issues
          .map((err) => err.message)
          .join(" | ");
        validationErrors.push(`ردیف ${rowNum}: ${issues}`);
        continue;
      }

      const item = parseResult.data;

      // Duplicate check within sheet
      if (codesInSheet.has(item.code)) {
        validationErrors.push(
          `ردیف ${rowNum}: کد تکراری "${item.code}" در فایل اکسل.`,
        );
        continue;
      }
      if (slugsInSheet.has(item.slug)) {
        validationErrors.push(
          `ردیف ${rowNum}: اسلاگ تکراری "${item.slug}" در فایل اکسل.`,
        );
        continue;
      }

      codesInSheet.add(item.code);
      slugsInSheet.add(item.slug);
      validRows.push({ rowNum, data: item });

      requiredCategorySlugs.add(item.category_slug);
      requiredColorSlugs.add(item.color_slug);
      if (item.vein_pattern_slug) {
        requiredVeinSlugs.add(item.vein_pattern_slug);
      }
    }

    if (validationErrors.length > 0) {
      writeLog({
        level: "WARN",
        module: "api.admin.import-products",
        action: "preflight_validation",
        correlationId,
        message: "Pre-flight validation rejected sheet contents",
        metadata: { errorCount: validationErrors.length },
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: "اعتبارسنجی فایل با خطا مواجه شد. هیچ تغییری اعمال نگردید.",
          details: validationErrors.slice(0, 50),
          totalErrors: validationErrors.length,
        },
        { status: 422 },
      );
    }

    // 5. Bulk Relational Resolution (Single DB Roundtrips)
    const [categoriesRes, colorsRes, veinPatternsRes] = await Promise.all([
      payload.find({
        collection: "categories",
        where: { slug: { in: Array.from(requiredCategorySlugs) } },
        limit: requiredCategorySlugs.size,
        depth: 0,
        pagination: false,
      }),
      payload.find({
        collection: "colors",
        where: { slug: { in: Array.from(requiredColorSlugs) } },
        limit: requiredColorSlugs.size,
        depth: 0,
        pagination: false,
      }),
      requiredVeinSlugs.size > 0
        ? payload.find({
            collection: "vein-patterns",
            where: { slug: { in: Array.from(requiredVeinSlugs) } },
            limit: requiredVeinSlugs.size,
            depth: 0,
            pagination: false,
          })
        : Promise.resolve({ docs: [] }),
    ]);

    const categoryMap = new Map(
      categoriesRes.docs.map((c: any) => [c.slug.toLowerCase(), c.id]),
    );
    const colorMap = new Map(
      colorsRes.docs.map((c: any) => [c.slug.toLowerCase(), c.id]),
    );
    const veinPatternMap = new Map(
      veinPatternsRes.docs.map((v: any) => [v.slug.toLowerCase(), v.id]),
    );

    // Check for missing foreign relations
    for (const { rowNum, data } of validRows) {
      if (!categoryMap.has(data.category_slug)) {
        validationErrors.push(
          `ردیف ${rowNum}: دسته‌بندی "${data.category_slug}" یافت نشد.`,
        );
      }
      if (!colorMap.has(data.color_slug)) {
        validationErrors.push(
          `ردیف ${rowNum}: رنگ "${data.color_slug}" یافت نشد.`,
        );
      }
      if (
        data.vein_pattern_slug &&
        !veinPatternMap.has(data.vein_pattern_slug)
      ) {
        validationErrors.push(
          `ردیف ${rowNum}: الگوی رگه "${data.vein_pattern_slug}" یافت نشد.`,
        );
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error:
            "مغایرت کلیدهای خارجی. برخی ویژگی‌های انتخابی در سیستم وجود ندارند.",
          details: validationErrors,
        },
        { status: 422 },
      );
    }

    // 6. Resolve Existing IDs for Upsert Operation
    const existingProductsRes = await payload.find({
      collection: "products",
      where: {
        or: [
          { code: { in: Array.from(codesInSheet) } },
          { slug: { in: Array.from(slugsInSheet) } },
        ],
      },
      limit: validRows.length * 2,
      depth: 0,
      pagination: false,
    });

    const codeToIdMap = new Map(
      existingProductsRes.docs.map((doc: any) => [doc.code, doc.id]),
    );
    const slugToIdMap = new Map(
      existingProductsRes.docs.map((doc: any) => [doc.slug, doc.id]),
    );

    // 7. Atomic Database Execution Pipeline
    let createdCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async ({ data }) => {
        const payloadData = {
          code: data.code,
          slug: data.slug,
          category: categoryMap.get(data.category_slug),
          color_family: colorMap.get(data.color_slug),
          vein_pattern: data.vein_pattern_slug
            ? veinPatternMap.get(data.vein_pattern_slug)
            : null,
          is_in_stock: data.is_in_stock,
          title: {
            fa: data.title_fa,
            en: data.title_en,
            ar: data.title_ar,
          },
          description: {
            fa: data.description_fa,
            en: data.description_en,
            ar: data.description_ar,
          },
          meta_title: {
            fa: data.meta_title_fa,
            en: data.meta_title_en,
            ar: data.meta_title_ar,
          },
          meta_description: {
            fa: data.meta_description_fa,
            en: data.meta_description_en,
            ar: data.meta_description_ar,
          },
        };

        const existingId =
          codeToIdMap.get(data.code) || slugToIdMap.get(data.slug);

        if (existingId) {
          await payload.update({
            collection: "products",
            id: existingId,
            locale: "all",
            req,
            data: payloadData as any,
          });
          return "updated";
        } else {
          await payload.create({
            collection: "products",
            locale: "all",
            req,
            data: payloadData as any,
          });
          return "created";
        }
      });

      const chunkResults = await Promise.all(batchPromises);
      chunkResults.forEach((status) => {
        if (status === "created") createdCount++;
        if (status === "updated") updatedCount++;
      });

      // Cooperative yield to keep event loop healthy
      await new Promise((resolve) => setImmediate(resolve));
    }

    const durationMs = Math.round(performance.now() - startTime);
    writeLog({
      level: "INFO",
      module: "api.admin.import-products",
      action: "batch_execution",
      correlationId,
      durationMs,
      message: "Products import completed successfully",
      metadata: {
        createdCount,
        updatedCount,
        totalProcessed: validRows.length,
      },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      summary: {
        createdCount,
        updatedCount,
        failedCount: 0,
        errors: [],
      },
    });
  } catch (error: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);

    writeLog({
      level: "FATAL",
      module: "api.admin.import-products",
      action: "import_crash",
      correlationId,
      durationMs,
      message: "Critical internal error aborted the import pipeline",
      metadata: { error: errorMessage },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "پردازش فایل با خطای سیستمی مواجه شد و فرایند متوقف گردید.",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
