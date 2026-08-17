import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import { excelProductRowSchema } from "@/lib/validations/excel-product-import";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "عدم دسترسی! لطفاً وارد پنل ادمین شوید." },
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

    const [categories, colors, veinPatterns] = await Promise.all([
      payload.find({ collection: "categories", limit: 500 }),
      payload.find({ collection: "colors", limit: 500 }),
      payload.find({ collection: "vein-patterns", limit: 500 }),
    ]);

    const categoryMap = new Map(
      categories.docs.map((c) => [c.slug.toLowerCase(), c.id]),
    );
    const colorMap = new Map(
      colors.docs.map((c) => [c.slug.toLowerCase(), c.id]),
    );
    const veinPatternMap = new Map(
      veinPatterns.docs.map((v) => [v.slug.toLowerCase(), v.id]),
    );

    for (let index = 0; index < rawData.length; index++) {
      const rowNum = index + 2;
      const row = rawData[index];

      if (!row.code && !row.slug && !row.title_fa) continue;

      const parseResult = excelProductRowSchema.safeParse(row);
      if (!parseResult.success) {
        const errorMsgs = parseResult.error.errors
          .map((e) => e.message)
          .join(" | ");
        errors.push(`ردیف ${rowNum}: ${errorMsgs}`);
        continue;
      }

      const item = parseResult.data;

      const categoryId = categoryMap.get(item.category_slug);
      if (!categoryId) {
        errors.push(
          `ردیف ${rowNum} (${item.code}): دسته‌بندی "${item.category_slug}" در دیتابیس یافت نشد.`,
        );
        continue;
      }

      const colorId = colorMap.get(item.color_slug);
      if (!colorId) {
        errors.push(
          `ردیف ${rowNum} (${item.code}): رنگ "${item.color_slug}" در دیتابیس یافت نشد.`,
        );
        continue;
      }

      let veinPatternId = undefined;
      if (item.vein_pattern_slug) {
        veinPatternId = veinPatternMap.get(item.vein_pattern_slug);
        if (!veinPatternId) {
          errors.push(
            `ردیف ${rowNum} (${item.code}): الگوی رگه "${item.vein_pattern_slug}" در دیتابیس یافت نشد.`,
          );
          continue;
        }
      }

      const existing = await payload.find({
        collection: "products",
        where: {
          or: [
            { code: { equals: item.code } },
            { slug: { equals: item.slug } },
          ],
        },
        limit: 1,
      });

      const baseData: any = {
        code: item.code,
        slug: item.slug,
        category: categoryId,
        color_family: colorId,
        vein_pattern: veinPatternId || null,
        is_in_stock: item.is_in_stock,
      };

      if (existing.docs.length > 0) {
        const productId = existing.docs[0].id;
        await payload.update({
          collection: "products",
          id: productId,
          locale: "fa",
          data: {
            ...baseData,
            title: item.title_fa,
            description: item.description_fa,
            meta_title: item.meta_title_fa,
            meta_description: item.meta_description_fa,
          },
        });
        await payload.update({
          collection: "products",
          id: productId,
          locale: "en",
          data: {
            title: item.title_en,
            description: item.description_en,
            meta_title: item.meta_title_en,
            meta_description: item.meta_description_en,
          },
        });
        await payload.update({
          collection: "products",
          id: productId,
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
        const createdDoc = await payload.create({
          collection: "products",
          locale: "fa",
          data: {
            ...baseData,
            title: item.title_fa,
            description: item.description_fa,
            meta_title: item.meta_title_fa,
            meta_description: item.meta_description_fa,
          },
        });
        await payload.update({
          collection: "products",
          id: createdDoc.id,
          locale: "en",
          data: {
            title: item.title_en,
            description: item.description_en,
            meta_title: item.meta_title_en,
            meta_description: item.meta_description_en,
          },
        });
        await payload.update({
          collection: "products",
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
    return NextResponse.json(
      { error: "خطا در پردازش فایل محصولات", details: error.message },
      { status: 500 },
    );
  }
}
