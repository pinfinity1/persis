// src/services/application.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export interface ShowcaseSlideDTO {
  id: string;
  tag: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
}

export interface SectionSpecDTO {
  label: string;
  val?: string;
}

export interface ApplicationSectionDTO {
  id: string;
  num: string;
  enTag: string;
  title: string;
  desc: string;
  specs: SectionSpecDTO[];
  gallery: string[];
}

export interface ApplicationsPageFullDTO {
  header: {
    tag: string;
    title: string;
    desc: string;
  };
  showcase: ShowcaseSlideDTO[];
  sections: ApplicationSectionDTO[];
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
): Promise<ApplicationsPageFullDTO> {
  return unstable_cache(
    async (): Promise<ApplicationsPageFullDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const rawData: any = await payload.findGlobal({
          slug: "applications-page",
          locale,
          depth: 1,
        });

        const showcase: ShowcaseSlideDTO[] = Array.isArray(
          rawData?.showcaseItems,
        )
          ? rawData.showcaseItems.map((item: any, idx: number) => {
              const desktopUrl = extractUrl(item.desktopImage);
              const mobileUrl = extractUrl(item.mobileImage);
              return {
                id: item.id || `slide-${idx + 1}`,
                tag: item.tag || "",
                desktopImageUrl: desktopUrl,
                // فال‌بک هوشمند: اگر عکس موبایل آپلود نشد، از عکس دسکتاپ استفاده کن
                mobileImageUrl:
                  mobileUrl !== FALLBACK_IMG ? mobileUrl : desktopUrl,
              };
            })
          : [];

        const sections: ApplicationSectionDTO[] = Array.isArray(
          rawData?.sections,
        )
          ? rawData.sections.map((sec: any, idx: number) => ({
              id: sec.id || `sec-${idx + 1}`,
              num: sec.num || `0${idx + 1}`,
              enTag: sec.enTag || "",
              title: sec.title || "",
              desc: sec.desc || "",
              specs: Array.isArray(sec.specs)
                ? sec.specs.map((sp: any) => ({
                    label: sp.label || "",
                    val: sp.val || undefined,
                  }))
                : [],
              gallery: Array.isArray(sec.gallery)
                ? sec.gallery.map((g: any) => extractUrl(g))
                : [],
            }))
          : [];

        return {
          header: {
            tag: rawData?.headerTag || "SPATIAL INTEGRATION",
            title:
              rawData?.headerTitle ||
              "سطوحی فراتر از یک پوشش؛ خلق هارمونی در معماری معاصر",
            desc:
              rawData?.headerDesc ||
              "تلفیق زیبایی بصری با مقاومت ساختاری؛ امکان خلق فضاهایی منحصربه‌فرد و هماهنگ با سبک‌های متنوع، از محیط‌های خانگی تا فضاهای عمومی و بهداشتی.",
          },
          showcase,
          sections,
        };
      } catch (error) {
        console.error("Error in getApplicationsPageDataService:", error);
        return {
          header: {
            tag: "SPATIAL INTEGRATION",
            title: "سطوحی فراتر از یک پوشش؛ خلق هارمونی در معماری معاصر",
            desc: "تلفیق زیبایی بصری با مقاومت ساختاری؛ امکان خلق فضاهایی منحصربه‌فرد و هماهنگ با سبک‌های متنوع.",
          },
          showcase: [],
          sections: [],
        };
      }
    },
    ["applications-page-full-cache", locale],
    {
      revalidate: 86400,
      tags: ["applications-page"],
    },
  )();
}
