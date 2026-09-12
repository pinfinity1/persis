// src/app/api/admin/import-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import {
  excelProductRowSchema,
  type ExcelProductRow,
} from "@/lib/validations/excel-product-import";

export const maxDuration = 120;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const BATCH_SIZE = 25;

export async function POST(req: NextRequest) {
  const correlationId = crypto.randomUUID();

  try {
    const payload = await getPayload({ config: configPromise });

    // 1. احراز هویت ادمین
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. ورود ادمین الزامی است." },
        { status: 401 },
      );
    }

    // 2. دریافت و بررسی فایل
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

    // 3. پارس بافر اکسل
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName || !workbook.Sheets[sheetName]) {
      return NextResponse.json(
        { error: "فایل اکسل ارسالی فاقد شیت معتبر است." },
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

    // 4. اعتبارسنجی ردیف‌ها با Zod
    const validRows: { rowNum: number; data: ExcelProductRow }[] = [];
    const validationErrors: string[] = [];
    const codesInSheet = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const rowNum = i + 2;
      const row = rawRows[i];

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
      if (codesInSheet.has(item.code)) {
        validationErrors.push(
          `ردیف ${rowNum}: کد تکراری "${item.code}" در فایل اکسل یافت شد.`,
        );
        continue;
      }

      codesInSheet.add(item.code);
      validRows.push({ rowNum, data: item });
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "اعتبارسنجی فایل با خطا مواجه شد. هیچ تغییری اعمال نگردید.",
          details: validationErrors.slice(0, 50),
          totalErrors: validationErrors.length,
        },
        { status: 422 },
      );
    }

    // 5. بررسی و دریافت شناسه‌های موجود بر اساس Code برای پیشگیری از N+1 Query
    const existingProductsRes = await payload.find({
      collection: "products",
      where: {
        code: { in: Array.from(codesInSheet) },
      },
      limit: validRows.length,
      depth: 0,
      pagination: false,
    });

    const existingProductMap = new Map<string, string | number>(
      existingProductsRes.docs.map((doc: any) => [doc.code, doc.id]),
    );

    let createdCount = 0;
    let updatedCount = 0;
    const executionErrors: string[] = [];

    // 6. درج و به‌روزرسانی دسته‌ای اتمیک (Chunked Atomic Execution)
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const chunk = validRows.slice(i, i + BATCH_SIZE);

      const chunkPromises = chunk.map(async ({ rowNum, data: item }) => {
        const productData = {
          code: item.code,
          slug: item.slug,
          title: {
            fa: item.title_fa,
            en: item.title_en,
            ar: item.title_ar,
          },
          description: {
            fa: item.description_fa || "",
            en: item.description_en || "",
            ar: item.description_ar || "",
          },
        };

        const existingId = existingProductMap.get(item.code);

        if (existingId) {
          await payload.update({
            collection: "products",
            id: existingId,
            locale: "all",
            req,
            data: productData as any,
          });
          return "updated";
        } else {
          await payload.create({
            collection: "products",
            locale: "all",
            req,
            data: {
              ...productData,
              is_in_stock: "in_stock",
              available_thicknesses: ["12mm", "20mm"],
              finishes: ["polished"],
            } as any,
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
          executionErrors.push(
            `ردیف ${rowNum}: ${res.reason?.message || "خطای پایگاه‌داده"}`,
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
        failedCount: executionErrors.length,
        errors: executionErrors,
      },
    });
  } catch (error: any) {
    console.error("Critical error in import-products route:", error);
    return NextResponse.json(
      { error: "پردازش فایل با خطای سیستمی مواجه شد.", details: error.message },
      { status: 500 },
    );
  }
}
