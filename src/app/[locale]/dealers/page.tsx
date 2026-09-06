import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getDealersService,
  getActiveProvincesService,
} from "@/services/dealer.service";
import { DealerFilterClient } from "@/components/dealers/dealer-filter-client";
import { DealerCard } from "@/components/dealers/dealer-card";
import SkeletonLoader from "@/components/products/skeleton-loader";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dealers" });

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

export default async function DealersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sParams = await searchParams;
  const currentLocale = locale as "fa" | "en" | "ar";

  const selectedProvince =
    typeof sParams.province === "string" ? sParams.province : undefined;

  const [dealers, provinces, t] = await Promise.all([
    getDealersService({ locale: currentLocale, province: selectedProvince }),
    getActiveProvincesService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "Dealers" }),
  ]);

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen space-y-12 select-none">
      <PageWatermarkHeader
        watermark="SHOWROOMS"
        title="Official Sales Network & Dealers"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border/20">
        <span className="text-xs uppercase tracking-widest text-primary block">
          {t("filterTag")}
        </span>
        {provinces.length > 0 && <DealerFilterClient provinces={provinces} />}
      </div>

      <Suspense fallback={<SkeletonLoader />}>
        {dealers.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </section>
        ) : (
          <div className="p-12 text-center bg-card border border-border/40 space-y-2">
            <p className="text-sm text-foreground font-medium">
              {t("noDealersFound")}
            </p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
