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
    const obj = media as Record<string, unknown>;
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
        const rawData = (await payload.findGlobal({
          slug: "applications-page",
          locale,
          depth: 1,
        })) as Record<string, unknown>;

        const rawShowcase = Array.isArray(rawData?.showcaseItems)
          ? rawData.showcaseItems
          : [];
        const showcase: ShowcaseSlideDTO[] = rawShowcase.map(
          (item: Record<string, unknown>, idx: number) => {
            const desktopUrl = extractUrl(item.desktopImage);
            const mobileUrl = extractUrl(item.mobileImage);
            return {
              id: (item.id as string) || `slide-${idx + 1}`,
              tag: (item.tag as string) || "",
              desktopImageUrl: desktopUrl,
              mobileImageUrl:
                mobileUrl !== FALLBACK_IMG ? mobileUrl : desktopUrl,
            };
          },
        );

        const rawSections = Array.isArray(rawData?.sections)
          ? rawData.sections
          : [];
        const sections: ApplicationSectionDTO[] = rawSections.map(
          (sec: Record<string, unknown>, idx: number) => {
            const rawSpecs = Array.isArray(sec.specs) ? sec.specs : [];
            const rawGallery = Array.isArray(sec.gallery) ? sec.gallery : [];

            return {
              id: (sec.id as string) || `sec-${idx + 1}`,
              num: (sec.num as string) || `0${idx + 1}`,
              enTag: (sec.enTag as string) || "",
              title: (sec.title as string) || "",
              desc: (sec.desc as string) || "",
              specs: rawSpecs.map((sp: Record<string, unknown>) => ({
                label: (sp.label as string) || "",
                val: (sp.val as string) || undefined,
              })),
              gallery: rawGallery.map((g: unknown) => extractUrl(g)),
            };
          },
        );

        return {
          header: {
            tag: (rawData?.headerTag as string) || "SPATIAL INTEGRATION",
            title:
              (rawData?.headerTitle as string) ||
              "سطوحی فراتر از یک پوشش؛ خلق هارمونی در معماری معاصر",
            desc:
              (rawData?.headerDesc as string) ||
              "تلفیق زیبایی بصری با مقاومت ساختاری؛ امکان خلق فضاهایی منحصربه‌فرد و هماهنگ با سبک‌های متنوع، از محیط‌های خانگی تا فضاهای عمومی و بهداشتی.",
          },
          showcase,
          sections,
        };
      } catch (error: unknown) {
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
