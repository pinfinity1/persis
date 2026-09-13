// src/app/[locale]/catalogs/page.tsx
import React from "react";
import type { Metadata } from "next";
import { getGroupedCatalogsService } from "@/services/catalog.service";
import { CatalogCard } from "@/components/catalogs/catalog-card";
import { getTranslations } from "next-intl/server";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import {
  generateSeoMetadata,
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
  const t = await getTranslations({
    locale: currentLocale,
    namespace: "Metadata",
  });

  return generateSeoMetadata({
    title: t("catalogs.title"),
    description: t("catalogs.description"),
    locale: currentLocale,
    path: "/catalogs",
  });
}

export default async function CatalogsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  const [groupedCatalogs, t, tMeta] = await Promise.all([
    getGroupedCatalogsService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "Catalogs" }),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
  ]);

  const years = Object.keys(groupedCatalogs)
    .map(Number)
    .sort((a, b) => b - a);

  // ایجاد لیست تمام کاتالوگ‌ها جهت ساخت Schema
  const allCatalogs = Object.values(groupedCatalogs).flat();

  const catalogsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tMeta("catalogs.title"),
    description: tMeta("catalogs.description"),
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
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen space-y-12 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(catalogsSchema) }}
      />

      <PageWatermarkHeader
        watermark="PUBLICATIONS"
        title="Official Catalogs & Tech Specs"
      />

      {years.length > 0 ? (
        <div className="space-y-12 sm:space-y-20">
          {years.map((year) => (
            <section key={year} className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 pb-2">
                <span className="text-xl sm:text-3xl font-light text-primary">
                  {year}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest pt-1">
                  Collection & Manuals
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {groupedCatalogs[year].map((catalog) => (
                  <CatalogCard key={catalog.id} catalog={catalog} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-20 text-center bg-card border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            {t("noCatalogsFound")}
          </p>
        </div>
      )}
    </main>
  );
}
