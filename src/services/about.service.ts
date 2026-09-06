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
    const obj = media as Record<string, any>;
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

        const rawData: any = await payload.findGlobal({
          slug: "about-page",
          locale,
          depth: 1, // حتماً Depth 1 برای Populate شدن مدیاها الزامی است
        });

        // ۱. استخراج تصاویر گالری انتخاب‌شده توسط ادمین
        let galleryUrls: string[] = [];
        if (
          Array.isArray(rawData?.galleryImages) &&
          rawData.galleryImages.length > 0
        ) {
          galleryUrls = rawData.galleryImages
            .map((item: any) => extractUrl(item))
            .filter((url: string) => url !== FALLBACK_IMG);
        }

        // ۲. فال‌بک خودکار گالری در صورت خالی بودن انتخاب ادمین
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
            .map((doc: any) => extractUrl(doc))
            .filter((url: string) => url !== FALLBACK_IMG);
        }

        if (galleryUrls.length === 0) {
          galleryUrls = Array(8).fill(FALLBACK_IMG);
        }

        return {
          vision: {
            tag: rawData?.visionTag || "",
            title: rawData?.visionTitle || "",
            desc1: rawData?.visionDesc1 || "",
            desc2: rawData?.visionDesc2 || "",
            imageUrl: extractUrl(rawData?.visionImage),
          },
          gallery: {
            tag: rawData?.galleryTag || "",
            title: rawData?.galleryTitle || "",
            images: galleryUrls,
          },
          craftsmanship: {
            tag: rawData?.craftsmanshipTag || "",
            title: rawData?.craftsmanshipTitle || "",
            desc: rawData?.craftsmanshipDesc || "",
            imageUrl: extractUrl(rawData?.craftsmanshipImage),
          },
        };
      } catch (error) {
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
    ["about-page-global-cache", locale], // رفع باگ: اضافه شدن locale به کلید کش
    {
      revalidate: 86400,
      tags: ["about-page"],
    },
  )();
}
