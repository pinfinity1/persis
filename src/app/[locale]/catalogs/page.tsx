// src/app/[locale]/catalogs/page.tsx
import React from "react";
import type { Metadata } from "next";
import { getGroupedCatalogsService, type CatalogItem } from "@/services/catalog.service";
import { getSeoSettingsService } from "@/services/seo.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { CatalogHeroFeatured } from "@/components/catalogs/catalog-hero-featured";
import { CatalogsDirectoryClient } from "@/components/catalogs/catalogs-directory-client";
import { buildFallbackCatalogItem } from "@/lib/catalog-lookbook-data";
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

  const [groupedCatalogs, tMeta, seoSettings] = await Promise.all([
    getGroupedCatalogsService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
    getSeoSettingsService(currentLocale),
  ]);

  // ایجاد لیست مسطح تمام کاتالوگ‌ها
  const dbCatalogs: CatalogItem[] = Object.values(groupedCatalogs).flat();

  // در صورت خالی بودن دیتابیس، از کاتالوگ جامع استاندارد برند استفاده می‌شود
  const allCatalogs: CatalogItem[] =
    dbCatalogs.length > 0
      ? dbCatalogs
      : [buildFallbackCatalogItem(currentLocale)];

  // انتخاب کاتالوگ پرچم‌دار جهت نمایش در هیرو سکشن
  const flagshipCatalog =
    allCatalogs.find((c) => c.catalog_type === "full_catalog") ||
    allCatalogs[0];

  const catalogsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seoSettings.pages.catalogs.title || "Persis Quartz Publications",
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
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-24 min-h-screen space-y-12 sm:space-y-16 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(catalogsSchema) }}
      />

      {/* عنوان و واترمارک لوکس بالای صفحه */}
      <PageWatermarkHeader
        watermark="LOOKBOOK"
        title={seoSettings.pages.catalogs.title || tMeta("catalogs.title")}
      />

      {/* کاتالوگ شاخص سال (Featured Master Lookbook Showcase) */}
      <CatalogHeroFeatured flagshipCatalog={flagshipCatalog} />

      {/* آرشیو و دایرکتوری انتشارات با فیلتر آنی */}
      <CatalogsDirectoryClient initialCatalogs={allCatalogs} />
    </main>
  );
}
