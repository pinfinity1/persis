import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import { excelCategoryRowSchema } from "@/lib/validations/excel-category-import";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // احراز هویت ادمین
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "عدم دسترسی! لطفاً ابتدا وارد پنل ادمین شوید." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "فایلی دریافت نشد." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: "",
    });

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

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

      const item = parseResult.data;

      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: item.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const catId = existing.docs[0].id;

        // بروزرسانی فارسی
        await payload.update({
          collection: "categories",
          id: catId,
          locale: "fa",
          data: {
            title: item.title_fa,
            slug: item.slug,
            order: item.order,
            description: item.description_fa,
            meta_title: item.meta_title_fa,
            meta_description: item.meta_description_fa,
          },
        });

        // بروزرسانی انگلیسی
        await payload.update({
          collection: "categories",
          id: catId,
          locale: "en",
          data: {
            title: item.title_en,
            description: item.description_en,
            meta_title: item.meta_title_en,
            meta_description: item.meta_description_en,
          },
        });

        // بروزرسانی عربی
        await payload.update({
          collection: "categories",
          id: catId,
          locale: "ar",
          data: {
            title: item.title_ar,
            description: item.description_ar,
            meta_title: item.meta_title_ar,
            meta_description: item.meta_description_ar,
          },
        });

        updatedCount++;
      } else {
        // ایجاد جدید پایه فارسی
        const createdDoc = await payload.create({
          collection: "categories",
          locale: "fa",
          data: {
            title: item.title_fa,
            slug: item.slug,
            order: item.order,
            description: item.description_fa,
            meta_title: item.meta_title_fa,
            meta_description: item.meta_description_fa,
          },
        });

        // افزودن انگلیسی
        await payload.update({
          collection: "categories",
          id: createdDoc.id,
          locale: "en",
          data: {
            title: item.title_en,
            description: item.description_en,
            meta_title: item.meta_title_en,
            meta_description: item.meta_description_en,
          },
        });

        // افزودن عربی
        await payload.update({
          collection: "categories",
          id: createdDoc.id,
          locale: "ar",
          data: {
            title: item.title_ar,
            description: item.description_ar,
            meta_title: item.meta_title_ar,
            meta_description: item.meta_description_ar,
          },
        });

        createdCount++;
      }
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
    console.error("Categories Excel Import Error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش فایل دسته‌بندی‌ها", details: error.message },
      { status: 500 },
    );
  }
}
