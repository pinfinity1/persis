// src/services/home.service.ts
import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export interface HomePageHeroDTO {
  tagline?: string;
  title: string;
  subtitle?: string;
  desktopPoster: string;
  desktopVideo?: string;
  mobilePoster: string;
  mobileVideo?: string;
}

export interface HomePageInfoCardsDTO {
  featuresImage?: string;
  maintenanceImage?: string;
  catalogsImage?: string;
  sampleImage?: string;
}

export interface HomePageDataDTO {
  hero: HomePageHeroDTO | null;
  infoCardsImages: HomePageInfoCardsDTO;
}

const extractUrl = (media: unknown): string | undefined => {
  if (!media) return undefined;
  if (typeof media === "object" && media !== null && "url" in media) {
    const url = (media as { url?: unknown }).url;
    return typeof url === "string" ? url : undefined;
  }
  if (typeof media === "string") return media;
  return undefined;
};

export const getHomePageDataService = cache(
  async (locale: "fa" | "en" | "ar" = "fa"): Promise<HomePageDataDTO> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const res = (await payload.findGlobal({
        slug: "home-page",
        locale,
        depth: 1,
      })) as unknown as Record<string, unknown>;

      if (!res) {
        return { hero: null, infoCardsImages: {} };
      }

      const hero: HomePageHeroDTO | null =
        res.title || res.desktopPoster || res.desktopVideo
          ? {
              tagline: (res.tagline as string) || undefined,
              title: (res.title as string) || "",
              subtitle: (res.subtitle as string) || undefined,
              desktopPoster:
                extractUrl(res.desktopPoster) || "/PersisQuartz-Red.png",
              desktopVideo: extractUrl(res.desktopVideo),
              mobilePoster:
                extractUrl(res.mobilePoster) ||
                extractUrl(res.desktopPoster) ||
                "/PersisQuartz-Red.png",
              mobileVideo: extractUrl(res.mobileVideo),
            }
          : null;

      const infoCards = (res.infoCardsImages as Record<string, unknown>) || {};

      return {
        hero,
        infoCardsImages: {
          featuresImage: extractUrl(infoCards.featuresImage),
          maintenanceImage: extractUrl(infoCards.maintenanceImage),
          catalogsImage: extractUrl(infoCards.catalogsImage),
          sampleImage: extractUrl(infoCards.sampleImage),
        },
      };
    } catch (error: unknown) {
      console.error("Error fetching HomePage data:", error);
      return { hero: null, infoCardsImages: {} };
    }
  },
);
