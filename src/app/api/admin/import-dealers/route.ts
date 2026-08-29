import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import { excelDealerRowSchema } from "@/lib/validations/excel-dealer-import";
import { normalizeProvinceToSlug } from "@/lib/constants/provinces";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json({ error: "عدم دسترسی!" }, { status: 401 });
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

      if (!row.province && !row.title_fa && !row.phone) continue;

      const parseResult = excelDealerRowSchema.safeParse(row);
      if (!parseResult.success) {
        const errorMsgs = parseResult.error.errors
          .map((e) => e.message)
          .join(" | ");
        errors.push(`ردیف ${rowNum}: ${errorMsgs}`);
        continue;
      }

      const item = parseResult.data;
      const provinceSlug = normalizeProvinceToSlug(item.province);

      const existing = await payload.find({
        collection: "dealers" as any,
        where: { phone: { equals: item.phone } },
        limit: 1,
      });

      const commonData = {
        province: provinceSlug,
        phone: item.phone,
        order: item.order,
        status: "published" as const,
      };

      if (existing.docs.length > 0) {
        const dealerId = existing.docs[0].id;
        await payload.update({
          collection: "dealers" as any,
          id: dealerId,
          locale: "fa",
          data: {
            ...commonData,
            title: item.title_fa,
            city: item.city_fa,
            address: item.address_fa,
          },
        });
        await payload.update({
          collection: "dealers" as any,
          id: dealerId,
          locale: "en",
          data: {
            title: item.title_en,
            city: item.city_en,
            address: item.address_en,
          },
        });
        await payload.update({
          collection: "dealers" as any,
          id: dealerId,
          locale: "ar",
          data: {
            title: item.title_ar,
            city: item.city_ar,
            address: item.address_ar,
          },
        });
        updatedCount++;
      } else {
        const createdDoc = await payload.create({
          collection: "dealers" as any,
          locale: "fa",
          data: {
            ...commonData,
            title: item.title_fa,
            city: item.city_fa,
            address: item.address_fa,
          },
        });
        await payload.update({
          collection: "dealers" as any,
          id: createdDoc.id,
          locale: "en",
          data: {
            title: item.title_en,
            city: item.city_en,
            address: item.address_en,
          },
        });
        await payload.update({
          collection: "dealers" as any,
          id: createdDoc.id,
          locale: "ar",
          data: {
            title: item.title_ar,
            city: item.city_ar,
            address: item.address_ar,
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
      { error: "خطا در پردازش فایل", details: error.message },
      { status: 500 },
    );
  }
}
