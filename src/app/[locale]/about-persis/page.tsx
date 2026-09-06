import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAboutPageDataService } from "@/services/about.service";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/PersisQuartz-Red.png"],
    },
  };
}

const getMediaDetails = (media?: any, fallback = "/PersisQuartz-Red.png") => {
  let url = fallback;
  if (typeof media === "object" && media?.url) url = media.url;
  else if (typeof media === "string" && media) url = media;

  const isPlaceholder = url === fallback;
  return { url, isPlaceholder };
};

export default async function AboutPersisPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  const pageData = await getAboutPageDataService();

  const visionMedia = getMediaDetails(pageData?.visionImage);
  const craftsmanshipMedia = getMediaDetails(pageData?.craftsmanshipImage);

  // استخراج تصاویر گالری از دیتابیس یا استفاده از فال‌بک پیش‌فرض
  const dynamicGallery = pageData?.gallery?.length
    ? pageData.gallery.map((item: any) => getMediaDetails(item.image).url)
    : Array(8).fill("/PersisQuartz-Red.png");

  const mid = Math.ceil(dynamicGallery.length / 2);
  const galleryRow1 = dynamicGallery.slice(0, mid);
  const galleryRow2 = dynamicGallery.slice(mid).length
    ? dynamicGallery.slice(mid)
    : galleryRow1;

  return (
    <main className="min-h-screen bg-background select-none flex flex-col overflow-hidden">
      {/* 1. Header */}
      <div className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-2 select-none">
        <PageWatermarkHeader
          watermark="PERSIS QUARTZ"
          title={t("brandLabel")}
        />
      </div>

      {/* 2. Vision */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-1.5 lg:space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
                {t("visionTag")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground leading-snug">
                {t("visionTitle")}
              </h2>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
                {t("visionDesc1")}
              </p>
              <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
                {t("visionDesc2")}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] bg-muted/30 w-full overflow-hidden border border-border/50 flex items-center justify-center">
              <Image
                src={visionMedia.url}
                alt="Persis Factory and Innovation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`transition-all duration-700 ${
                  visionMedia.isPlaceholder
                    ? "object-contain p-16 opacity-20 grayscale"
                    : "object-cover grayscale hover:grayscale-0"
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Marquee Gallery */}
      <section className="py-14 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/40 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-12 mb-10 text-center sm:text-start">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block mb-2">
            {t("galleryTag")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-foreground">
            {t("galleryTitle")}
          </h2>
        </div>

        <div dir="ltr" className="flex flex-col gap-4 sm:gap-6">
          <div className="flex w-[200%] sm:w-[150%] lg:w-[120%] animate-marquee-left hover:[animation-play-state:paused]">
            {[...galleryRow1, ...galleryRow1].map((imgUrl, idx) => (
              <div
                key={`row1-${idx}`}
                className="relative h-40 sm:h-56 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={imgUrl}
                  alt="Persis Quartz Gallery Image"
                  fill
                  sizes="400px"
                  className={
                    imgUrl === "/PersisQuartz-Red.png"
                      ? "object-contain p-8 opacity-20 grayscale"
                      : "object-cover"
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex w-[200%] sm:w-[150%] lg:w-[120%] animate-marquee-right hover:[animation-play-state:paused] -ml-[100%] sm:-ml-[50%] lg:-ml-[20%]">
            {[...galleryRow2, ...galleryRow2].map((imgUrl, idx) => (
              <div
                key={`row2-${idx}`}
                className="relative h-40 sm:h-56 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={imgUrl}
                  alt="Persis Quartz Gallery Image"
                  fill
                  sizes="400px"
                  className={
                    imgUrl === "/PersisQuartz-Red.png"
                      ? "object-contain p-8 opacity-20 grayscale"
                      : "object-cover"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-square bg-muted/40 border border-border/50 p-6 lg:p-8 flex items-center justify-center overflow-hidden">
            <Image
              src={craftsmanshipMedia.url}
              alt="Craftsmanship and Inspiration"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`transition-all duration-700 ${
                craftsmanshipMedia.isPlaceholder
                  ? "object-contain p-16 opacity-20 grayscale"
                  : "object-cover"
              }`}
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
            <div className="space-y-1.5 lg:space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
                {t("craftsmanshipTag")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground leading-snug">
                {t("craftsmanshipTitle")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
              {t("craftsmanshipDesc")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
