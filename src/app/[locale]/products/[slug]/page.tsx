// src/app/[locale]/products/[slug]/page.tsx
import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlugService,
  getAllDimensionsService,
  getAllThicknessesService,
  getAllFinishesService,
  type ProductItemDTO,
  type Locale,
  type GalleryItemDTO,
} from "@/services/product.service";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductConfigurator } from "@/components/products/product-configurator";
import { ProductSpecsMatrix } from "@/components/products/product-specs-matrix";
import { ProductAppliedGallery } from "@/components/products/product-applied-gallery";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  generateProductSeoMetadata,
  getProductSchema,
  getBreadcrumbSchema,
  safeJsonLdReplacer,
} from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ۱. پیش‌رندر و پیش‌تولید تمام اسلاگ‌ها در زمان بیلد جهت باز شدن کاملاً آنی صفحات
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise });
    const products = await payload.find({
      collection: "products",
      limit: 500,
      depth: 0,
      pagination: false,
      where: {
        is_in_stock: { equals: "active" },
      },
    });

    const locales: Locale[] = ["fa", "en", "ar"];

    return products.docs.flatMap((doc) =>
      locales.map((locale) => ({
        locale,
        slug: doc.slug,
      })),
    );
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}

const getCachedProduct = cache(async (slug: string, locale: Locale) => {
  return await getProductBySlugService(slug, locale);
});

function resolveMediaUrl(
  thumbnailUrl: string | undefined | null,
  fallback = "/PersisQuartz-Red.png",
): string {
  if (
    !thumbnailUrl ||
    typeof thumbnailUrl !== "string" ||
    thumbnailUrl.trim().length === 0
  ) {
    return fallback;
  }
  return thumbnailUrl;
}

function normalizeToStringArray(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null && "title" in item) {
        return String((item as Record<string, unknown>).title || "");
      }
      return "";
    })
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "fa";

  let product: ProductItemDTO | null = null;
  try {
    product = await getCachedProduct(slug, currentLocale);
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  if (!product) {
    return {
      title: "Product Not Found | Persis Quartz",
      robots: { index: false, follow: false },
    };
  }

  return generateProductSeoMetadata({
    product: {
      title: product.title,
      code: product.code,
      description: product.description,
      thumbnail: resolveMediaUrl(product.thumbnail),
      slug: product.slug,
    },
    locale: currentLocale,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "fa";

  // بهینه‌سازی: واکشی هم‌زمان محصول و ترجمه‌ها؛ کوئری‌های عمومی در صورت نیاز اجرا می‌شوند
  const [product, t, tMeta] = await Promise.all([
    getCachedProduct(slug, currentLocale),
    getTranslations({ locale: currentLocale, namespace: "ProductDetail" }),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
  ]);

  if (!product) {
    notFound();
  }

  // جلوگیری از اجرای کوئری‌های تکراری در صورتی که سنگ مشخصات اختصاصی خود را دارد
  const [fallbackDimensions, fallbackThicknesses, fallbackFinishes] =
    await Promise.all([
      !product.dimensions?.length
        ? getAllDimensionsService()
        : Promise.resolve([]),
      !product.thicknesses?.length
        ? getAllThicknessesService()
        : Promise.resolve([]),
      !product.finishes?.length
        ? getAllFinishesService(currentLocale)
        : Promise.resolve([]),
    ]);

  const categoryTitle = product.category?.title || "";
  const categorySlug = product.category?.slug || "";
  const thumbnailUrl = resolveMediaUrl(product.thumbnail);

  const isRtl = currentLocale === "fa" || currentLocale === "ar";
  const BreadcrumbArrow = isRtl ? ChevronLeft : ChevronRight;

  const resolvedDimensions = normalizeToStringArray(
    product.dimensions?.length ? product.dimensions : fallbackDimensions,
  );
  const resolvedThicknesses = normalizeToStringArray(
    product.thicknesses?.length ? product.thicknesses : fallbackThicknesses,
  );
  const resolvedFinishes = normalizeToStringArray(
    product.finishes?.length ? product.finishes : fallbackFinishes,
  );

  // ۱. ساختاربندی Breadcrumb Schema
  const breadcrumbItems = [
    { name: tMeta("home.title"), path: "" },
    { name: tMeta("products.title"), path: "/products" },
  ];
  if (categoryTitle && categorySlug) {
    breadcrumbItems.push({
      name: categoryTitle,
      path: `/products?category=${categorySlug}`,
    });
  }
  breadcrumbItems.push({
    name: product.title,
    path: `/products/${product.slug}`,
  });

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems, currentLocale);

  // ۲. ساختاربندی جامع Product Schema
  const productSchema = getProductSchema({
    product: {
      title: product.title,
      code: product.code,
      slug: product.slug,
      description: product.description,
      thumbnail: thumbnailUrl,
      is_in_stock: product.is_in_stock,
    },
    categoryTitle,
    dimensions: resolvedDimensions,
    thicknesses: resolvedThicknesses,
    locale: currentLocale,
  });

  const jsonLdPayload = [breadcrumbSchema, productSchema];

  return (
    <main className="container mx-auto px-4 sm:px-12 py-24 sm:py-28 min-h-screen space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLdPayload) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-muted-foreground pb-3 border-b border-border/30"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("home")}
        </Link>
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40 shrink-0" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          {t("products")}
        </Link>
        {categoryTitle && categorySlug && (
          <>
            <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40 shrink-0" />
            <Link
              href={`/products?category=${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryTitle}
            </Link>
          </>
        )}
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40 shrink-0" />
        <span className="text-primary font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <ProductGallery
            mainThumbnailUrl={thumbnailUrl}
            title={product.title}
            code={product.code}
          />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <ProductConfigurator
            product={product}
            categoryTitle={categoryTitle}
          />
        </div>
      </div>

      {product.gallery && product.gallery.length > 0 && (
        <ProductAppliedGallery
          title={product.title}
          gallery={product.gallery as GalleryItemDTO[]}
        />
      )}

      <ProductSpecsMatrix
        locale={currentLocale}
        dimensions={resolvedDimensions}
        thicknesses={resolvedThicknesses}
        finishes={resolvedFinishes}
        customThicknessAvailable={product.custom_thickness_available}
      />
    </main>
  );
}
