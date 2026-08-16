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
    <main className="container mx-auto px-4 sm:px-12 py-24 sm:py-28 min-h-screen">
      <div
        dir="ltr"
        className="relative mb-12 pt-4 pb-2 select-none overflow-hidden"
      >
        <h1 className="sr-only">اسلب‌های سنگ کوارتز پرسیس کوارتز</h1>
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-foreground/[0.04] uppercase tracking-tighter leading-none">
          COLLECTION
        </h1>

        <div className="absolute bottom-2 start-0 z-10 flex items-center gap-3">
          <span className="h-px w-6 bg-primary" />
          <span className="text-[11px] font-mono tracking-[0.3em] text-primary uppercase">
            Persis Quartz Catalog
          </span>
        </div>
      </div>

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
