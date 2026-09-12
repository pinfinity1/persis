// src/app/api/admin/import-categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import {
  excelCategoryRowSchema,
  type ExcelCategoryRow,
} from "@/lib/validations/excel-category-import";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Limit
const BATCH_SIZE = 50;

export async function POST(req: NextRequest) {
  const correlationId = crypto.randomUUID();

  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Authorization
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 },
      );
    }

    // 2. Request Guard
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "فایلی دریافت نشد." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم فایل بیش از سقف مجاز (۵ مگابایت) است." },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: "فایل اکسل خالی است." },
        { status: 400 },
      );
    }

    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(
      workbook.Sheets[sheetName],
      { defval: "" },
    );

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

    // 3. Pre-flight Validation & Slug Extraction
    const validRows: { rowNum: number; data: ExcelCategoryRow }[] = [];
    const slugsToLookup = new Set<string>();

    for (let index = 0; index < rawData.length; index++) {
      const rowNum = index + 2;
      const row = rawData[index];

      if (!row.slug && !row.title_fa) continue;

      const parseResult = excelCategoryRowSchema.safeParse(row);
      if (!parseResult.success) {
        const errorMsgs = parseResult.error.errors
          .map((e) => e.message)
          .join(" | ");
        errors.push(`ردیف ${rowNum}: ${errorMsgs}`);
        continue;
      }

      validRows.push({ rowNum, data: parseResult.data });
      slugsToLookup.add(parseResult.data.slug);
    }

    // Single Batch Query to eliminate N+1 DB roundtrips
    const existingCatsRes = await payload.find({
      collection: "categories",
      where: {
        slug: { in: Array.from(slugsToLookup) },
      },
      limit: slugsToLookup.size,
      depth: 0,
      pagination: false,
    });

    const existingCatMap = new Map<string, string | number>(
      existingCatsRes.docs.map((doc: any) => [doc.slug, doc.id]),
    );

    // 4. Batch Atomic Execution
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const chunk = validRows.slice(i, i + BATCH_SIZE);

      const chunkPromises = chunk.map(async ({ rowNum, data: item }) => {
        // Atomic payload with locale: 'all'
        const atomicPayload = {
          slug: item.slug,
          order: item.order,
          title: {
            fa: item.title_fa,
            en: item.title_en,
            ar: item.title_ar,
          },
        };

        const existingId = existingCatMap.get(item.slug);

        if (existingId) {
          await payload.update({
            collection: "categories",
            id: existingId,
            locale: "all",
            req,
            data: atomicPayload as any,
          });
          return "updated";
        } else {
          await payload.create({
            collection: "categories",
            locale: "all",
            req,
            data: atomicPayload as any,
          });
          return "created";
        }
      });

      const settledChunk = await Promise.allSettled(chunkPromises);

      settledChunk.forEach((res, index) => {
        if (res.status === "fulfilled") {
          if (res.value === "created") createdCount++;
          if (res.value === "updated") updatedCount++;
        } else {
          const rowNum = chunk[index].rowNum;
          errors.push(
            `ردیف ${rowNum}: ${res.reason?.message || "خطای ثبت در پایگاه‌داده"}`,
          );
        }
      });

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
    console.error(
      JSON.stringify({
        level: "CRITICAL",
        module: "api.admin.import-categories",
        correlationId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json(
      { error: "خطا در پردازش فایل دسته‌بندی‌ها", details: error.message },
      { status: 500 },
    );
  }
}
