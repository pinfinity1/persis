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

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sParams = await searchParams;

  const currentLocale = (locale as Locale) || "fa";

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
      locale: currentLocale,
      page: 1,
      limit: 9,
      category,
      color,
      vein_pattern,
      search,
    }),
    getCategoriesService(currentLocale),
    getColorsService(currentLocale),
    getVeinPatternsService(currentLocale),
    getProductsService({
      locale: currentLocale,
      limit: 1,
    }),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
  ]);

  // تولید Breadcrumb Schema با استفاده از تابع موجود در seo.ts
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: tMeta("home.title"), path: "" },
      { name: tMeta("products.title"), path: "/products" },
    ],
    currentLocale,
  );

  // تولید Collection Schema شامل اسلب‌های بارگذاری شده برای درک بهتر موتورهای AI
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com"}/${currentLocale}/products/${product.slug}`,
      })),
    },
  };

  // ارسال آرایه از اسکیماها به تابع ایمن‌ساز شما
  const jsonLdPayload = [breadcrumbSchema, productsSchema];

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLdPayload) }}
      />

      <PageWatermarkHeader
        watermark="COLLECTION"
        title="Persis Quartz Catalog"
        className="mb-8"
      />

      <section className="w-full">
        <Suspense fallback={<SkeletonLoader />}>
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
        </Suspense>
      </section>
    </main>
  );
}
