// src/app/[locale]/about-persis/page.tsx
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

const FALLBACK_IMG = "/PersisQuartz-Red.png";

/**
 * کامپوننت پایدار جهت سنترسازی هندسی Placeholder لوگو در برابر عکس‌های واقعی
 */
const SmartMediaBox = ({
  src,
  alt,
  priority = false,
  aspectRatio = "aspect-[4/3]",
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: string;
  className?: string;
}) => {
  const isPlaceholder = !src || src === FALLBACK_IMG;

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden border border-border/50 flex items-center justify-center ${
        isPlaceholder ? "bg-muted/15" : "bg-muted/30"
      } ${className}`}
    >
      {isPlaceholder ? (
        <div className="relative w-2/3 h-2/5 flex items-center justify-center select-none pointer-events-none">
          <Image
            src={FALLBACK_IMG}
            alt="Persis Quartz Default"
            fill
            sizes="300px"
            className="object-contain opacity-25 grayscale contrast-50"
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-all duration-700"
        />
      )}
    </div>
  );
};

export default async function AboutPersisPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as "fa" | "en" | "ar") || "fa";

  const [data, t] = await Promise.all([
    getAboutPageDataService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "About" }),
  ]);

  const gallery = data.gallery.images;
  const mid = Math.ceil(gallery.length / 2);
  const galleryRow1 = gallery.slice(0, mid);
  const galleryRow2 = gallery.slice(mid).length
    ? gallery.slice(mid)
    : galleryRow1;

  return (
    <main className="min-h-screen bg-background select-none flex flex-col overflow-hidden">
      {/* 1. Header Hero with Watermark */}
      <section className="relative w-full pt-28 pb-14 sm:pt-36 sm:pb-20 bg-muted/20 border-b border-border/40 overflow-hidden select-none">
        <div
          aria-hidden="true"
          dir="ltr"
          className="absolute top-20 sm:top-24 bottom-0 inset-x-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.035] px-6 select-none"
        >
          <span className="text-[10vw] sm:text-[9vw] lg:text-[8vw] font-black uppercase tracking-tighter text-foreground leading-none whitespace-nowrap block text-center">
            PERSIS QUARTZ
          </span>
        </div>

        {/* نشانگر مرکزی با خطوط تراز */}
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-4 sm:pt-6">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 sm:w-8 bg-primary shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
              {t("brandLabel")}
            </span>
            <span className="h-px w-6 sm:w-8 bg-primary shrink-0" />
          </div>
        </div>
      </section>

      {/* 2. Vision Section */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-1.5 lg:space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
                {data.vision.tag || t("visionTag")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground leading-snug">
                {data.vision.title || t("visionTitle")}
              </h2>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
                {data.vision.desc1 || t("visionDesc1")}
              </p>
              <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
                {data.vision.desc2 || t("visionDesc2")}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <SmartMediaBox
              src={data.vision.imageUrl}
              alt={data.vision.title || "Persis Factory Vision"}
              priority={true}
              aspectRatio="aspect-[4/3] sm:aspect-square lg:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* 3. Infinite Seamless Marquee Showcase */}
      <section className="py-14 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/40 overflow-hidden select-none">
        <div className="container mx-auto px-6 sm:px-12 mb-10 text-center sm:text-start">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block mb-2">
            {data.gallery.tag || t("galleryTag")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-foreground">
            {data.gallery.title || t("galleryTitle")}
          </h2>
        </div>

        <div dir="ltr" className="flex flex-col gap-5 sm:gap-7 overflow-hidden">
          {/* ردیف اول: حرکت پیوسته به سمت چپ */}
          <div className="flex overflow-hidden w-full group">
            <div className="animate-marquee-left group-hover:[animation-play-state:paused] flex shrink-0">
              {galleryRow1.map((imgUrl, idx) => (
                <div
                  key={`r1-track1-${idx}`}
                  className="relative h-44 sm:h-60 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt="Material Gallery"
                    fill
                    sizes="400px"
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>

            {/* کپی دوم جهت تکمیل بی‌نقص چرخه بدون فلش */}
            <div
              aria-hidden="true"
              className="animate-marquee-left group-hover:[animation-play-state:paused] flex shrink-0"
            >
              {galleryRow1.map((imgUrl, idx) => (
                <div
                  key={`r1-track2-${idx}`}
                  className="relative h-44 sm:h-60 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt="Material Gallery"
                    fill
                    sizes="400px"
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ردیف دوم: حرکت پیوسته به سمت راست */}
          <div className="flex overflow-hidden w-full group">
            <div className="animate-marquee-right group-hover:[animation-play-state:paused] flex shrink-0">
              {galleryRow2.map((imgUrl, idx) => (
                <div
                  key={`r2-track1-${idx}`}
                  className="relative h-44 sm:h-60 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt="Material Gallery"
                    fill
                    sizes="400px"
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>

            {/* کپی دوم جهت تکمیل بی‌نقص چرخه بدون فلش */}
            <div
              aria-hidden="true"
              className="animate-marquee-right group-hover:[animation-play-state:paused] flex shrink-0"
            >
              {galleryRow2.map((imgUrl, idx) => (
                <div
                  key={`r2-track2-${idx}`}
                  className="relative h-44 sm:h-60 lg:h-72 w-64 sm:w-80 lg:w-96 shrink-0 mx-2 sm:mx-3 bg-card border border-border/50 overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt="Material Gallery"
                    fill
                    sizes="400px"
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship Section */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <SmartMediaBox
              src={data.craftsmanship.imageUrl}
              alt={data.craftsmanship.title || "Craftsmanship and Inspiration"}
              aspectRatio="aspect-[4/3] sm:aspect-[16/9] lg:aspect-square"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
            <div className="space-y-1.5 lg:space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
                {data.craftsmanship.tag || t("craftsmanshipTag")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground leading-snug">
                {data.craftsmanship.title || t("craftsmanshipTitle")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm lg:text-base font-light text-muted-foreground leading-relaxed text-justify">
              {data.craftsmanship.desc || t("craftsmanshipDesc")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
