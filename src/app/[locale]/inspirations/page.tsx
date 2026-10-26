// src/app/[locale]/inspirations/page.tsx
import React from "react";
import type { Metadata } from "next";
import { getInspirationsService } from "@/services/inspiration.service";
import { getSeoSettingsService } from "@/services/seo.service";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { InspirationCard } from "@/components/inspirations/inspiration-card";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  generateStaticPageMetadata,
  safeJsonLdReplacer,
  extractPlainTextFromLexical,
  type Locale,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  return generateStaticPageMetadata(
    "inspirations",
    currentLocale,
    "/inspirations",
  );
}

export default async function InspirationsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";
  setRequestLocale(currentLocale);

  const [t, inspirations, seoSettings] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: "Inspirations" }),
    getInspirationsService(currentLocale),
    getSeoSettingsService(currentLocale),
  ]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";

  // ساخت اسکیمای استاندارد متصل به سئوی متمرکز پیلود
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: seoSettings.pages.inspirations.title || "Persis Quartz Inspirations",
    description: seoSettings.pages.inspirations.description || "",
    url: `${siteUrl}/${currentLocale}/inspirations`,
    publisher: {
      "@type": "Organization",
      name: "Persis Quartz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/PersisQuartz-Red.png`,
      },
    },
    image: inspirations.map((item) => ({
      "@type": "ImageObject",
      contentUrl: item.image.startsWith("http")
        ? item.image
        : `${siteUrl}${item.image}`,
      name: item.title,
      description: extractPlainTextFromLexical(item.description) || item.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLd) }}
      />
      <main className="container mx-auto px-4 sm:px-12 py-20 sm:py-32 select-none">
        <PageWatermarkHeader
          watermark={t("watermark")}
          title={t("title")}
          className="mb-16 sm:mb-24"
        />

        {inspirations.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center border border-border/40 bg-card/20">
            <span className="text-sm text-muted-foreground font-light tracking-wide">
              {t("empty")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 w-full">
            {inspirations.map((item) => (
              <InspirationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
