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

export interface BrandFeatureDTO {
  tag: string;
  title: string;
  desc: string;
}

export interface BrandIntroDTO {
  title: string;
  description: string;
  features: BrandFeatureDTO[];
}

export interface DynamicInfoCardDTO {
  id: string;
  cardType: "features" | "standard";
  category: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  link?: string;
  imageUrl?: string;
}

export interface InfoCardsSectionDTO {
  tagline: string;
  title: string;
  cards: DynamicInfoCardDTO[];
}

export interface HomePageDataDTO {
  hero: HomePageHeroDTO | null;
  brandIntro: BrandIntroDTO;
  infoCardsSection: InfoCardsSectionDTO;
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
    // پیش‌فرض‌های ۳ زبانه بخش Brand Intro
    const defaultBrandIntro: BrandIntroDTO = {
      title: "دقت مهندسی برای آفرینش زیبایی ماندگار",
      description:
        "تلفیق دانش مهندسی، فناوری پیشرفته و زیبایی‌شناسی معاصر برای خلق هارمونی در معماری مدرن.",
      features: [
        {
          tag: "01 / Engineering",
          title: "خلوص و دوام ساختاری",
          desc: "مقاومت بالا در برابر خط، خش و حرارت.",
        },
        {
          tag: "02 / Aesthetics",
          title: "زبان طراحی معاصر",
          desc: "خلق هارمونی و عمق بصری در فضا.",
        },
        {
          tag: "03 / Trust",
          title: "اصالت و استاندارد جهانی",
          desc: "تضمین بالاترین سطح کیفیت و پایداری.",
        },
      ],
    };

    // فال‌بک پیش‌فرض برای بخش Info Cards در صورت خالی بودن دیتابیس
    const defaultInfoCards: DynamicInfoCardDTO[] = [
      {
        id: "default-card-1",
        cardType: "features",
        category: "ویژگی‌های ساختاری",
        title: "مزایا و استانداردهای مهندسی Persis Quartz",
      },
      {
        id: "default-card-2",
        cardType: "standard",
        category: "نگهداری و مراقبت",
        title: "درخشش ماندگار با ساده‌ترین روش نظافت",
        description:
          "حفظ زیبایی بدون نیاز به مواد شوینده خاص، پولیش یا واکس؛ تنها با آب گرم و چند قطره شوینده ملایم روزمره.",
        ctaLabel: "راهنمای کامل نگهداری",
        link: "/care-and-maintenance",
      },
      {
        id: "default-card-3",
        cardType: "standard",
        category: "اسناد فنی",
        title: "کاتالوگ جامع و مشخصات مهندسی",
        description:
          "مشاهده ابعاد استاندارد اسلب‌ها (۳۲۰×۷۵ و ۳۲۰×۹۲ سانتی‌متر)، کاتالوگ رنگ‌بندی و کدهای اختصاصی برند.",
        ctaLabel: "دانلود کاتالوگ محصولات",
        link: "/catalogs",
      },
      {
        id: "default-card-4",
        cardType: "standard",
        category: "خدمات معماران",
        title: "درخواست نمونه محصول (Sample Box)",
        description:
          "ارسال پکیج نمونه‌های لمسی سنگ کوارتز ویژه معماران، طراحان و پروژه‌های ساختمانی جهت بررسی بافت و کیفیت از نزدیک.",
        ctaLabel: "ثبت سفارش Sample Box",
        link: "/contact?type=sample",
      },
    ];

    try {
      const payload = await getPayload({ config: configPromise });
      const res = (await payload.findGlobal({
        slug: "home-page",
        locale,
        depth: 1,
      })) as unknown as Record<string, unknown>;

      if (!res) {
        return {
          hero: null,
          brandIntro: defaultBrandIntro,
          infoCardsSection: {
            tagline: "PERSIS QUARTZ INSIGHTS",
            title: "معماری، کیفیت و خدمات Persis Quartz",
            cards: defaultInfoCards,
          },
        };
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

      const brandIntro: BrandIntroDTO = {
        title: (res.introTitle as string) || defaultBrandIntro.title,
        description:
          (res.introDescription as string) || defaultBrandIntro.description,
        features: [
          {
            tag: (res.feat1Tag as string) || defaultBrandIntro.features[0].tag,
            title:
              (res.feat1Title as string) || defaultBrandIntro.features[0].title,
            desc:
              (res.feat1Desc as string) || defaultBrandIntro.features[0].desc,
          },
          {
            tag: (res.feat2Tag as string) || defaultBrandIntro.features[1].tag,
            title:
              (res.feat2Title as string) || defaultBrandIntro.features[1].title,
            desc:
              (res.feat2Desc as string) || defaultBrandIntro.features[1].desc,
          },
          {
            tag: (res.feat3Tag as string) || defaultBrandIntro.features[2].tag,
            title:
              (res.feat3Title as string) || defaultBrandIntro.features[2].title,
            desc:
              (res.feat3Desc as string) || defaultBrandIntro.features[2].desc,
          },
        ],
      };

      // پردازش امن و پویا برای کارت‌های استک
      const rawCardsList = Array.isArray(res.infoCardsList)
        ? (res.infoCardsList as Array<Record<string, unknown>>)
        : [];

      let mappedCards: DynamicInfoCardDTO[] = [];

      if (rawCardsList.length > 0) {
        mappedCards = rawCardsList.map((c, index) => {
          const lType = (c.linkType as string) || "/catalogs";
          const finalLink =
            lType === "custom" ? (c.customLink as string) || "/" : lType;

          return {
            id: (c.id as string) || `card-${index + 1}`,
            cardType: c.cardType === "features" ? "features" : "standard",
            category: (c.category as string) || "",
            title: (c.title as string) || "",
            description: (c.description as string) || undefined,
            ctaLabel: (c.ctaLabel as string) || undefined,
            link: finalLink,
            imageUrl: extractUrl(c.image),
          };
        });
      } else {
        mappedCards = defaultInfoCards;
      }

      const infoCardsSection: InfoCardsSectionDTO = {
        tagline: (res.infoCardsTagline as string) || "PERSIS QUARTZ INSIGHTS",
        title:
          (res.infoCardsTitle as string) ||
          "معماری، کیفیت و خدمات Persis Quartz",
        cards: mappedCards,
      };

      return {
        hero,
        brandIntro,
        infoCardsSection,
      };
    } catch (error: unknown) {
      console.error("Error fetching HomePage data:", error);
      return {
        hero: null,
        brandIntro: defaultBrandIntro,
        infoCardsSection: {
          tagline: "PERSIS QUARTZ INSIGHTS",
          title: "معماری، کیفیت و خدمات Persis Quartz",
          cards: defaultInfoCards,
        },
      };
    }
  },
);
