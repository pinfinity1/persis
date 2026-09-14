// src/services/about.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export interface AboutPageDTO {
  vision: {
    tag: string;
    title: string;
    desc1: string;
    desc2: string;
    imageUrl: string;
  };
  gallery: {
    tag: string;
    title: string;
    images: string[];
  };
  craftsmanship: {
    tag: string;
    title: string;
    desc: string;
    imageUrl: string;
  };
}

const FALLBACK_IMG = "/PersisQuartz-Red.png";

function extractUrl(media: unknown): string {
  if (!media) return FALLBACK_IMG;
  if (typeof media === "string" && media.trim().length > 0) return media.trim();
  if (typeof media === "object" && media !== null) {
    const obj = media as Record<string, unknown>;
    if (typeof obj.url === "string" && obj.url.trim().length > 0) {
      return obj.url.trim();
    }
  }
  return FALLBACK_IMG;
}

export async function getAboutPageDataService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<AboutPageDTO> {
  return unstable_cache(
    async (): Promise<AboutPageDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });

        const rawData = (await payload.findGlobal({
          slug: "about-page",
          locale,
          depth: 1,
        })) as unknown as Record<string, unknown>;

        let galleryUrls: string[] = [];
        if (
          Array.isArray(rawData?.galleryImages) &&
          rawData.galleryImages.length > 0
        ) {
          galleryUrls = rawData.galleryImages
            .map((item: unknown) => extractUrl(item))
            .filter((url: string) => url !== FALLBACK_IMG);
        }

        if (galleryUrls.length === 0) {
          const fallbackMedia = await payload.find({
            collection: "media",
            where: {
              mimeType: { contains: "image" },
            },
            limit: 12,
            depth: 0,
          });

          galleryUrls = fallbackMedia.docs
            .map((doc: unknown) => extractUrl(doc))
            .filter((url: string) => url !== FALLBACK_IMG);
        }

        if (galleryUrls.length === 0) {
          galleryUrls = Array(8).fill(FALLBACK_IMG);
        }

        return {
          vision: {
            tag: (rawData?.visionTag as string) || "",
            title: (rawData?.visionTitle as string) || "",
            desc1: (rawData?.visionDesc1 as string) || "",
            desc2: (rawData?.visionDesc2 as string) || "",
            imageUrl: extractUrl(rawData?.visionImage),
          },
          gallery: {
            tag: (rawData?.galleryTag as string) || "",
            title: (rawData?.galleryTitle as string) || "",
            images: galleryUrls,
          },
          craftsmanship: {
            tag: (rawData?.craftsmanshipTag as string) || "",
            title: (rawData?.craftsmanshipTitle as string) || "",
            desc: (rawData?.craftsmanshipDesc as string) || "",
            imageUrl: extractUrl(rawData?.craftsmanshipImage),
          },
        };
      } catch (error: unknown) {
        console.error("Critical error in getAboutPageDataService:", error);
        return {
          vision: {
            tag: "",
            title: "",
            desc1: "",
            desc2: "",
            imageUrl: FALLBACK_IMG,
          },
          gallery: { tag: "", title: "", images: Array(8).fill(FALLBACK_IMG) },
          craftsmanship: {
            tag: "",
            title: "",
            desc: "",
            imageUrl: FALLBACK_IMG,
          },
        };
      }
    },
    ["about-page-global-cache", locale],
    {
      revalidate: 86400,
      tags: ["about-page"],
    },
  )();
}
