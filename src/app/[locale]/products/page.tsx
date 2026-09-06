import React, { Suspense } from "react";
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

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title:
      locale === "fa"
        ? "محصولات و اسلب‌های سنگ کوارتز | پرسیس کوارتز"
        : "Quartz Stone Products & Slabs | Persis Quartz",
    description:
      "مشاهده و بررسی انواع اسلب‌های سنگ کوارتز مهندسی‌شده پرسیس کوارتز در طرح‌ها و کدهای مختلف برای کارهای ساختمانی و معماری.",
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sParams = await searchParams;

  const currentLocale = locale as "fa" | "en" | "ar";

  const rawCategory = sParams.category || sParams.cat;
  const category = typeof rawCategory === "string" ? rawCategory : undefined;
  const color = typeof sParams.color === "string" ? sParams.color : undefined;
  const vein_pattern =
    typeof sParams.vein_pattern === "string" ? sParams.vein_pattern : undefined;
  const search =
    typeof sParams.search === "string" ? sParams.search : undefined;

  // فراخوانی هم‌زمان دسته‌بندی‌ها، رنگ‌ها و الگوهای رگه از پایگاه‌داده
  const [
    { data: initialProducts, meta: initialMeta },
    categories,
    colors,
    veinPatterns,
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
  ]);

  return (
    <main className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen select-none">
      <PageWatermarkHeader
        watermark="COLLECTION"
        title="Persis Quartz Catalog"
        className="mb-12"
      />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 shrink-0">
          <ProductFiltersClient
            categories={categories}
            colors={colors}
            veinPatterns={veinPatterns}
          />
        </aside>

        <section className="flex-1 w-full">
          <Suspense fallback={<SkeletonLoader />}>
            <ProductGridClient
              initialProducts={initialProducts}
              initialMeta={initialMeta}
              category={category}
              color={color}
              search={search}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
