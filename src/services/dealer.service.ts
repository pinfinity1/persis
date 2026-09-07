// src/services/dealer.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";
import { unstable_cache } from "next/cache";

export interface ProvinceOption {
  slug: string;
  label: string;
  fa: string;
  en: string;
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
  const safeProvince = province && province !== "all" ? province : "all";

  return unstable_cache(
    async (): Promise<DealerItem[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const where: Record<string, any> = {
          status: { equals: "published" },
        };

        if (safeProvince !== "all") {
          const match = IRAN_PROVINCES.find(
            (p) => p.slug === safeProvince || p.fa === safeProvince,
          );
          if (match) {
            where.or = [
              { province: { equals: match.slug } },
              { province: { equals: match.fa } },
            ];
          } else {
            where.province = { equals: safeProvince };
          }
        }

        const response = await payload.find({
          collection: "dealers",
          locale: (locale as "fa" | "en" | "ar") || "fa",
          limit: 100,
          where,
          sort: "order",
          depth: 0,
        });

        return (response.docs as unknown as DealerItem[]) || [];
      } catch (error) {
        console.error("Payload error in getDealersService:", error);
        return [];
      }
    },
    ["dealers-list-cache", locale, safeProvince],
    {
      revalidate: 86400, // 24 Hours
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
          limit: 200,
          where: { status: { equals: "published" } },
          depth: 0,
        });

        const rawSlugs = response.docs
          .map((doc: any) => doc.province)
          .filter(Boolean);
        const uniqueSlugs = Array.from(new Set(rawSlugs)) as string[];

        const provinceMap = new Map<string, ProvinceOption>();

        uniqueSlugs.forEach((slug) => {
          const match = IRAN_PROVINCES.find(
            (p) => p.slug === slug || p.fa === slug,
          );
          if (match) {
            provinceMap.set(match.slug, {
              slug: match.slug,
              label: match[locale] || match.fa,
              fa: match.fa,
              en: match.en,
            });
          } else {
            provinceMap.set(slug, { slug, label: slug, fa: slug, en: slug });
          }
        });

        return Array.from(provinceMap.values());
      } catch (error) {
        console.error("Payload error in getActiveProvincesService:", error);
        return [];
      }
    },
    ["active-provinces-cache", locale],
    {
      revalidate: 86400,
      tags: ["dealers"],
    },
  )();
}
