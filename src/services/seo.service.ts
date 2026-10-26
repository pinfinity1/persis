// src/services/seo.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export type StaticPageSeoKey =
  | "home"
  | "products"
  | "blog"
  | "catalogs"
  | "inspirations"
  | "applications"
  | "dealers"
  | "about"
  | "care"
  | "contact";

export interface SeoSettingsDTO {
  defaultOgImage: string | null;
  pages: Record<
    StaticPageSeoKey,
    { title: string | null; description: string | null }
  >;
}

export const getSeoSettingsService = (locale: "fa" | "en" | "ar") =>
  unstable_cache(
    async (): Promise<SeoSettingsDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });

        // رفع خطای تایپ‌اسکریپت با استفاده از تبدیل امن (Safe Casting)
        const rawData = (await (
          payload.findGlobal as unknown as (args: {
            slug: string;
            locale?: string;
            depth?: number;
          }) => Promise<unknown>
        )({
          slug: "seo-settings",
          locale,
          depth: 1,
        })) as Record<string, unknown>;

        const extractUrl = (media: unknown) => {
          if (!media) return null;
          if (typeof media === "string") return media;
          if (typeof media === "object" && media !== null && "url" in media) {
            return String((media as { url: unknown }).url);
          }
          return null;
        };

        const pages: Record<
          StaticPageSeoKey,
          { title: string | null; description: string | null }
        > = {
          home: {
            title: (rawData?.homeTitle as string) || null,
            description: (rawData?.homeDescription as string) || null,
          },
          products: {
            title: (rawData?.productsTitle as string) || null,
            description: (rawData?.productsDescription as string) || null,
          },
          blog: {
            title: (rawData?.blogTitle as string) || null,
            description: (rawData?.blogDescription as string) || null,
          },
          catalogs: {
            title: (rawData?.catalogsTitle as string) || null,
            description: (rawData?.catalogsDescription as string) || null,
          },
          inspirations: {
            title: (rawData?.inspirationsTitle as string) || null,
            description: (rawData?.inspirationsDescription as string) || null,
          },
          applications: {
            title: (rawData?.applicationsTitle as string) || null,
            description: (rawData?.applicationsDescription as string) || null,
          },
          dealers: {
            title: (rawData?.dealersTitle as string) || null,
            description: (rawData?.dealersDescription as string) || null,
          },
          about: {
            title: (rawData?.aboutTitle as string) || null,
            description: (rawData?.aboutDescription as string) || null,
          },
          care: {
            title: (rawData?.careTitle as string) || null,
            description: (rawData?.careDescription as string) || null,
          },
          contact: {
            title: (rawData?.contactTitle as string) || null,
            description: (rawData?.contactDescription as string) || null,
          },
        };

        return {
          defaultOgImage: extractUrl(rawData?.defaultOgImage),
          pages,
        };
      } catch (error) {
        console.error("Error fetching SEO settings:", error);
        return {
          defaultOgImage: null,
          pages: {} as Record<
            StaticPageSeoKey,
            { title: null; description: null }
          >,
        };
      }
    },
    ["global-seo-settings", locale],
    { revalidate: 86400, tags: ["seo-settings"] },
  )();
