import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";

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

export const getDealersService = cache(
  async ({
    locale = "fa",
    province,
  }: GetDealersParams): Promise<DealerItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const where: Record<string, any> = {
        status: { equals: "published" },
      };

      if (province && province !== "all") {
        // جستجوی هوشمند: هم اسلاگ انگلیسی و هم نام فارسی را در دیتابیس چک می‌کند
        const match = IRAN_PROVINCES.find(
          (p) => p.slug === province || p.fa === province,
        );
        if (match) {
          where.or = [
            { province: { equals: match.slug } },
            { province: { equals: match.fa } },
          ];
        } else {
          where.province = { equals: province };
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
      console.error("Payload find error details in getDealersService:", error);
      return [];
    }
  },
);

export const getActiveProvincesService = cache(
  async (locale: "fa" | "en" | "ar" = "fa"): Promise<ProvinceOption[]> => {
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

      // ادغام هوشمند دیتای کثیف احتمالی (تهران و tehran یکی می‌شوند)
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
      console.error("Payload find error in getActiveProvincesService:", error);
      return [];
    }
  },
);
