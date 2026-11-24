// src/services/dealer.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";

export interface ProvinceOption {
  slug: string;
  label: string;
  fa: string;
  en: string;
  center?: string;
  dealerCount?: number;
}

export interface DealerItem {
  id: string;
  title: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  order?: number;
  status?: "published" | "draft";
}

export interface GetDealersParams {
  locale: "fa" | "en" | "ar";
  province?: string;
}

export async function getDealersService({
  locale = "fa",
  province,
}: GetDealersParams): Promise<DealerItem[]> {
  const rawProvince = province && province !== "all" ? province : "all";
  const safeProvince =
    rawProvince !== "all" ? decodeURIComponent(rawProvince).trim() : "all";

  return unstable_cache(
    async (): Promise<DealerItem[]> => {
      try {
        const payload = await getPayload({ config: configPromise });

        const whereClause: Where = {
          status: { equals: "published" },
        };

        if (safeProvince !== "all") {
          const lower = safeProvince.toLowerCase();
          const match = IRAN_PROVINCES.find(
            (p) =>
              p.slug === lower ||
              p.fa === safeProvince ||
              p.en.toLowerCase() === lower ||
              p.ar === safeProvince ||
              p.center === safeProvince ||
              p.centerEn.toLowerCase() === lower ||
              p.centerAr === safeProvince,
          );

          if (match) {
            // انطباق دقیق با نوع دیتابیسی ENUM (فقط اسلاگ انگلیسی در ستون enum_dealers_province معتبر است)
            whereClause.province = { equals: match.slug };
          } else {
            // اگر ورودی با هیچ اسلاگ یا شهری همخوانی نداشت، برای جلوگیری از خطای دیتابیس آرایه خالی برمی‌گردانیم
            return [];
          }
        }

        const response = await payload.find({
          collection: "dealers",
          locale: (locale as "fa" | "en" | "ar") || "fa",
          limit: 200,
          where: whereClause,
          sort: "order",
          depth: 0,
        });

        return (response.docs as unknown as DealerItem[]) || [];
      } catch (error: unknown) {
        console.error("Payload error in getDealersService:", error);
        return [];
      }
    },
    ["dealers-list-cache-v3", locale, safeProvince],
    {
      revalidate: 86400,
      tags: ["dealers"],
    },
  )();
}

export async function getActiveProvincesService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<ProvinceOption[]> {
  return unstable_cache(
    async (): Promise<ProvinceOption[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const response = await payload.find({
          collection: "dealers",
          limit: 300,
          where: { status: { equals: "published" } },
          depth: 0,
        });

        // محاسبه تعداد نمایندگی‌های فعال به تفکیک استان
        const countMap = new Map<string, number>();
        for (const doc of response.docs) {
          if (doc.province) {
            countMap.set(doc.province, (countMap.get(doc.province) || 0) + 1);
          }
        }

        const provinceMap = new Map<string, ProvinceOption>();

        countMap.forEach((count, slug) => {
          const lower = slug.toLowerCase();
          const match = IRAN_PROVINCES.find(
            (p) =>
              p.slug === lower ||
              p.fa === slug ||
              p.en.toLowerCase() === lower ||
              p.center === slug,
          );

          if (match) {
            provinceMap.set(match.slug, {
              slug: match.slug,
              label: match[locale] || match.fa,
              fa: match.fa,
              en: match.en,
              center: match.center,
              dealerCount: count,
            });
          } else {
            provinceMap.set(slug, {
              slug,
              label: slug,
              fa: slug,
              en: slug,
              dealerCount: count,
            });
          }
        });

        return Array.from(provinceMap.values());
      } catch (error: unknown) {
        console.error("Payload error in getActiveProvincesService:", error);
        return [];
      }
    },
    ["active-provinces-cache-v3", locale],
    {
      revalidate: 86400,
      tags: ["dealers"],
    },
  )();
}
