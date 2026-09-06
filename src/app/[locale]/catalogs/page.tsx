import React from "react";
import type { Metadata } from "next";
import { getGroupedCatalogsService } from "@/services/catalog.service";
import { CatalogCard } from "@/components/catalogs/catalog-card";
import { getTranslations } from "next-intl/server";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "fa"
        ? "کاتالوگ‌ها و مستندات فنی | پرسیس کوارتز"
        : "Catalogs & Technical Documentation | Persis Quartz",
    description:
      "دانلود مستقیم و مشاهده آنلاین کاتالوگ‌های سالانه و راهنماهای مهندسی پرسیس کوارتز.",
  };
}

export default async function CatalogsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale as "fa" | "en" | "ar";

  const groupedCatalogs = await getGroupedCatalogsService(currentLocale);
  const years = Object.keys(groupedCatalogs)
    .map(Number)
    .sort((a, b) => b - a);

  const t = await getTranslations({
    locale: currentLocale,
    namespace: "Catalogs",
  });

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen space-y-12 select-none">
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

              {/* گریدبندی عمودی: ۴ ستون در دسکتاپ تا عرض کارت‌ها کش نیاید */}
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
