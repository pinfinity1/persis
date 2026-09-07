// src/services/application.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export interface ApplicationItemDTO {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
}

export interface ApplicationsPageDataDTO {
  tagline: string;
  title: string;
  subtitle: string;
  items: ApplicationItemDTO[];
}

const FALLBACK_IMG = "/PersisQuartz-Red.png";

function extractUrl(media: unknown): string {
  if (!media) return FALLBACK_IMG;
  if (typeof media === "string" && media.trim().length > 0) return media.trim();
  if (typeof media === "object" && media !== null) {
    const obj = media as Record<string, any>;
    if (typeof obj.url === "string" && obj.url.trim().length > 0) {
      return obj.url.trim();
    }
  }
  return FALLBACK_IMG;
}

export async function getApplicationsPageDataService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<ApplicationsPageDataDTO> {
  return unstable_cache(
    async (): Promise<ApplicationsPageDataDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const rawData: any = await payload.findGlobal({
          slug: "applications-page",
          locale,
          depth: 1, // واکشی خودکار اطلاعات مربوط به تصویر
        });

        const items: ApplicationItemDTO[] = Array.isArray(rawData?.items)
          ? rawData.items.map((item: any, idx: number) => ({
              id: item.id || `app-${idx + 1}`,
              title: item.title || "",
              desc: item.desc || "",
              imageUrl: extractUrl(item.image),
            }))
          : [];

        return {
          tagline: rawData?.tagline || "",
          title: rawData?.title || "",
          subtitle: rawData?.subtitle || "",
          items,
        };
      } catch (error) {
        console.error("Error fetching ApplicationsPage data:", error);
        return {
          tagline: "",
          title: "",
          subtitle: "",
          items: [],
        };
      }
    },
    ["applications-page-global-cache", locale],
    {
      revalidate: 86400,
      tags: ["applications-page"],
    },
  )();
}
