// src/app/[locale]/catalogs/page.tsx
import React from "react";
import type { Metadata } from "next";
import { getGroupedCatalogsService, type CatalogItem } from "@/services/catalog.service";
import { getSeoSettingsService } from "@/services/seo.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { CatalogsDirectoryClient } from "@/components/catalogs/catalogs-directory-client";
import {
  generateStaticPageMetadata,
  safeJsonLdReplacer,
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

  return generateStaticPageMetadata("catalogs", currentLocale, "/catalogs");
}

export default async function CatalogsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";
  setRequestLocale(currentLocale);

  const [groupedCatalogs, t, tMeta, seoSettings] = await Promise.all([
    getGroupedCatalogsService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "Catalogs" }),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
    getSeoSettingsService(currentLocale),
  ]);

  // واکشی کاتالوگ‌های منتشر شده از دیتابیس
  const allCatalogs: CatalogItem[] = Object.values(groupedCatalogs).flat();

  const catalogsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seoSettings.pages.catalogs.title || t("title"),
    description: seoSettings.pages.catalogs.description || "",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allCatalogs.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "DigitalDocument",
          name: cat.title,
          description: cat.description || cat.title,
          fileFormat: "application/pdf",
        },
      })),
    },
  };

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-24 min-h-screen space-y-10 sm:space-y-12 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(catalogsSchema) }}
      />

      {/* هدر رسمی و واتر‌مارک صفحه */}
      <PageWatermarkHeader
        watermark="PUBLICATIONS"
        title={seoSettings.pages.catalogs.title || tMeta("catalogs.title")}
      />

      {/* نمایش تمیز و شیک کاتالوگ‌های واقعی کارفرما */}
      <CatalogsDirectoryClient initialCatalogs={allCatalogs} />
    </main>
  );
}
