// src/app/[locale]/products/page.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  getProductsService,
  getCategoriesService,
  getColorsService,
  getVeinPatternsService,
} from "@/services/product.service";
import ProductGridClient from "@/components/products/product-grid-client";
import { ProductFiltersClient } from "@/components/products/product-filters-client";
import SkeletonLoader from "@/components/products/skeleton-loader";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import {
  generateSeoMetadata,
  safeJsonLdReplacer,
  getBreadcrumbSchema,
  type Locale,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    title: t("products.title"),
    description: t("products.description"),
    locale: currentLocale,
    path: "/products",
  });
}

// کامپوننت داخلی و نامرئی جهت فچ دیتای سنگین و اسکیما در پس‌زمینه
async function ProductsDataWrapper({
  locale,
  searchParamsPromise,
}: {
  locale: Locale;
  searchParamsPromise: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const sParams = await searchParamsPromise;

  const rawCategory = sParams.category || sParams.cat;
  const category = typeof rawCategory === "string" ? rawCategory : undefined;
  const color = typeof sParams.color === "string" ? sParams.color : undefined;
  const vein_pattern =
    typeof sParams.vein_pattern === "string" ? sParams.vein_pattern : undefined;
  const search =
    typeof sParams.search === "string" ? sParams.search : undefined;

  const [
    { data: initialProducts, meta: initialMeta },
    categories,
    colors,
    veinPatterns,
    totalBaseResult,
    tMeta,
  ] = await Promise.all([
    getProductsService({
      locale,
      page: 1,
      limit: 9,
      category,
      color,
      vein_pattern,
      search,
    }),
    getCategoriesService(locale),
    getColorsService(locale),
    getVeinPatternsService(locale),
    getProductsService({
      locale,
      limit: 1,
    }),
    getTranslations({ locale, namespace: "Metadata" }),
  ]);

  // ساخت Breadcrumb Schema
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: tMeta("home.title"), path: "" },
      { name: tMeta("products.title"), path: "/products" },
    ],
    locale,
  );

  // ساخت Collection Schema
  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tMeta("products.title"),
    description: tMeta("products.description"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: initialProducts.map((product, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com"}/${locale}/products/${product.slug}`,
      })),
    },
  };

  const jsonLdPayload = [breadcrumbSchema, productsSchema];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLdPayload) }}
      />
      <ProductGridClient
        initialProducts={initialProducts}
        initialMeta={initialMeta}
        totalCatalogCount={totalBaseResult.meta.total_items}
        category={category}
        color={color}
        search={search}
        filterControl={
          <ProductFiltersClient
            categories={categories}
            colors={colors}
            veinPatterns={veinPatterns}
          />
        }
      />
    </>
  );
}

// کامپوننت اصلی که بلافاصله به کاربر پاسخ داده و اسکلتون را نشان می‌دهد
export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen select-none">
      <PageWatermarkHeader
        watermark="COLLECTION"
        title="Persis Quartz Catalog"
        className="mb-8"
      />

      <section className="w-full">
        <Suspense fallback={<SkeletonLoader />}>
          <ProductsDataWrapper
            locale={currentLocale}
            searchParamsPromise={searchParams}
          />
        </Suspense>
      </section>
    </main>
  );
}
