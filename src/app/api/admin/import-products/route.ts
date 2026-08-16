// src/app/api/admin/import-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import { excelProductRowSchema } from "@/lib/validations/excel-product-import";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // ۱. بررسی دسترسی ادمین
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

    // ۲. بارگذاری کالکشن‌های رابطه‌ای
    const [categories, colors, veinPatterns, dimensions] = await Promise.all([
      payload.find({ collection: "categories", limit: 500 }),
      payload.find({ collection: "colors", limit: 500 }),
      payload.find({ collection: "vein-patterns", limit: 500 }),
      payload.find({ collection: "dimensions", limit: 500 }),
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
    const dimensionMap = new Map(
      dimensions.docs.map((d) => [d.slug.toLowerCase(), d.id]),
    );

    // ۳. پیمایش و پردازش ردیف‌ها
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

      // بررسی دسته‌بندی
      const categoryId = categoryMap.get(item.category_slug);
      if (!categoryId) {
        errors.push(
          `ردیف ${rowNum}: دسته‌بندی با اسلاگ "${item.category_slug}" یافت نشد. لطفاً ابتدا اکسل دسته‌بندی‌ها را آپلود کنید.`,
        );
        continue;
      }

      // طیف رنگی
      let colorId = colorMap.get(item.color_slug);
      if (!colorId) {
        const newColor = await payload.create({
          collection: "colors",
          data: { title: item.color_slug, slug: item.color_slug },
        });
        colorId = newColor.id;
        colorMap.set(item.color_slug, colorId);
      }

      // الگوی رگه
      const veinPatternId = item.vein_pattern_slug
        ? veinPatternMap.get(item.vein_pattern_slug)
        : undefined;

      // ابعاد اسلب
      const dimensionIds: (string | number)[] = [];
      if (item.dimension_slugs) {
        item.dimension_slugs.split(",").forEach((s) => {
          const id = dimensionMap.get(s.trim().toLowerCase());
          if (id) dimensionIds.push(id);
        });
      }

      const formattedThicknesses = item.thicknesses
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const formattedFinishes = item.finishes
        .split(",")
        .map((f) => f.trim().toLowerCase())
        .filter(Boolean);

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
        dimensions: dimensionIds.length > 0 ? dimensionIds : undefined,
        available_thicknesses: formattedThicknesses,
        custom_thickness_available: item.custom_thickness_available,
        finishes: formattedFinishes,
        is_in_stock: item.is_in_stock,
      };

      if (existing.docs.length > 0) {
        const productId = existing.docs[0].id;

        // ۱. بروزرسانی زبان فارسی (fa)
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

        // ۲. بروزرسانی زبان انگلیسی (en)
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

        // ۳. بروزرسانی زبان عربی (ar)
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
        // ۱. ایجاد اولیه با زبان فارسی (fa)
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

        // ۲. افزودن مقادیر انگلیسی (en)
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

        // ۳. افزودن مقادیر عربی (ar)
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
    console.error("Products Excel Import Error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش فایل محصولات", details: error.message },
      { status: 500 },
    );
  }
}
