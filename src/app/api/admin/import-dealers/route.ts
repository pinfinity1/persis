// src/app/api/admin/import-dealers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import * as XLSX from "xlsx";
import {
  excelDealerRowSchema,
  type ExcelDealerRow,
} from "@/lib/validations/excel-dealer-import";
import { normalizeProvinceToSlug } from "@/lib/constants/provinces";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Limit
const BATCH_SIZE = 50;

export async function POST(req: NextRequest) {
  const correlationId = crypto.randomUUID();

  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Authentication & Role Gate
    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 },
      );
    }

    // 2. Multi-part Body Validation
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file attached." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit." },
        { status: 413 },
      );
    }

    // 3. Buffer and Parse
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: "Excel sheet is empty." },
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

    // 4. Pre-fetch in single query to eliminate N+1 latency bottleneck
    const validRows: { rowNum: number; data: ExcelDealerRow }[] = [];
    const phonesToLookup = new Set<string>();

    for (let index = 0; index < rawData.length; index++) {
      const rowNum = index + 2;
      const row = rawData[index];

      // Skip fully empty trailing rows
      if (!row.province && !row.title_fa && !row.phone) continue;

      const parseResult = excelDealerRowSchema.safeParse(row);
      if (!parseResult.success) {
        const errorMsgs = parseResult.error.errors
          .map((e) => e.message)
          .join(" | ");
        errors.push(`ردیف ${rowNum}: ${errorMsgs}`);
        continue;
      }

      validRows.push({ rowNum, data: parseResult.data });
      phonesToLookup.add(parseResult.data.phone);
    }

    // Bulk resolve existing IDs by unique phone identifier
    const existingDealersRes = await payload.find({
      collection: "dealers" as any,
      where: {
        phone: { in: Array.from(phonesToLookup) },
      },
      limit: phonesToLookup.size,
      depth: 0,
      pagination: false,
    });

    const existingDealerMap = new Map<string, string | number>(
      existingDealersRes.docs.map((doc: any) => [doc.phone, doc.id]),
    );

    // 5. Chunked Atomic Processing
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const chunk = validRows.slice(i, i + BATCH_SIZE);

      const chunkPromises = chunk.map(async ({ rowNum, data: item }) => {
        const provinceSlug = normalizeProvinceToSlug(item.province);

        // Atomic multi-locale payload structure
        const atomicPayload = {
          province: provinceSlug,
          phone: item.phone,
          order: item.order,
          status: "published" as const,
          title: {
            fa: item.title_fa,
            en: item.title_en,
            ar: item.title_ar,
          },
          city: {
            fa: item.city_fa,
            en: item.city_en,
            ar: item.city_ar,
          },
          address: {
            fa: item.address_fa,
            en: item.address_en,
            ar: item.address_ar,
          },
        };

        const existingId = existingDealerMap.get(item.phone);

        if (existingId) {
          await payload.update({
            collection: "dealers" as any,
            id: existingId,
            locale: "all",
            req,
            data: atomicPayload as any,
          });
          return "updated";
        } else {
          await payload.create({
            collection: "dealers" as any,
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
            `ردیف ${rowNum}: ${res.reason?.message || "خطای پایگاه‌داده"}`,
          );
        }
      });

      // Cooperative yielding to prevent event-loop lockup
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
        module: "api.admin.import-dealers",
        correlationId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json(
      { error: "پردازش فایل با خطای سیستمی مواجه شد.", details: error.message },
      { status: 500 },
    );
  }
}
