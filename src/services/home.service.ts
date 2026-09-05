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

const extractUrl = (media: any): string | undefined => {
  if (!media) return undefined;
  if (typeof media === "object" && media?.url) return media.url;
  if (typeof media === "string") return media;
  return undefined;
};

export const getHomePageDataService = cache(
  async (locale: "fa" | "en" | "ar" = "fa"): Promise<HomePageDataDTO> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const res: any = await payload.findGlobal({
        slug: "home-page",
        locale,
        depth: 1,
      });

      if (!res) {
        return { hero: null, infoCardsImages: {} };
      }

      const hero: HomePageHeroDTO | null = res.title
        ? {
            tagline: res.tagline || undefined,
            title: res.title,
            subtitle: res.subtitle || undefined,
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

      const infoCards = res.infoCardsImages || {};

      return {
        hero,
        infoCardsImages: {
          featuresImage: extractUrl(infoCards.featuresImage),
          maintenanceImage: extractUrl(infoCards.maintenanceImage),
          catalogsImage: extractUrl(infoCards.catalogsImage),
          sampleImage: extractUrl(infoCards.sampleImage),
        },
      };
    } catch (error) {
      console.error("Error fetching HomePage data:", error);
      return { hero: null, infoCardsImages: {} };
    }
  },
);
