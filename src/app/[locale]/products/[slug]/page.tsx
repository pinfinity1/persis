import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlugService,
  getAllDimensionsService,
  getAllThicknessesService,
  getAllFinishesService,
  type ProductItemDTO,
  type Locale,
} from "@/services/product.service";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductConfigurator } from "@/components/products/product-configurator";
import { ProductSpecsMatrix } from "@/components/products/product-specs-matrix";
import { ProductAppliedGallery } from "@/components/products/product-applied-gallery";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { safeJsonLdReplacer } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
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

// حل مشکل Property 'title' does not exist on type 'string'
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

export async function generateMetadata(
  { params }: ProductPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "fa";

  let product: ProductItemDTO | null = null;
  try {
    product = await getCachedProduct(slug, currentLocale);
  } catch (error) {
    console.error("Metadata error:", error);
  }

  if (!product) {
    return {
      title: "Product Not Found | Persis Quartz",
      robots: { index: false, follow: false },
    };
  }

  // حذف کامل اسامی فارسی برند و جایگزینی با Persis Quartz
  const metaTitle =
    product.meta_title || `${product.title} (${product.code}) | Persis Quartz`;
  const metaDescription =
    product.meta_description ||
    product.description ||
    `Engineered quartz slab model ${product.title} by Persis Quartz.`;
  const imageUrl = resolveMediaUrl(product.thumbnail);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/${currentLocale}/products/${slug}`,
      languages: {
        fa: `/fa/products/${slug}`,
        en: `/en/products/${slug}`,
        ar: `/ar/products/${slug}`,
        "x-default": `/fa/products/${slug}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `/${currentLocale}/products/${slug}`,
      siteName: "Persis Quartz",
      images: [{ url: imageUrl, width: 1200, height: 900, alt: product.title }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "fa";

  // رفع ارور Expected 1 arguments با پاس دادن currentLocale
  const [product, allDimensions, allThicknesses, allFinishes, t] =
    await Promise.all([
      getCachedProduct(slug, currentLocale),
      getAllDimensionsService(),
      getAllThicknessesService(),
      getAllFinishesService(currentLocale),
      getTranslations({ locale: currentLocale, namespace: "ProductDetail" }),
    ]);

  if (!product) {
    notFound();
  }

  const categoryTitle = product.category?.title || "";
  const categorySlug = product.category?.slug || "";
  const thumbnailUrl = resolveMediaUrl(product.thumbnail);

  const isRtl = currentLocale === "fa" || currentLocale === "ar";
  const BreadcrumbArrow = isRtl ? ChevronLeft : ChevronRight;

  const jsonLdPayload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [thumbnailUrl],
    description: product.description || "",
    sku: product.code,
    category: categoryTitle,
    brand: {
      "@type": "Brand",
      name: "Persis Quartz", // هاردکد شدن نام انگلیسی برای حفظ گراف هویتی
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      availability:
        product.is_in_stock === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/Discontinued",
    },
  };

  const resolvedDimensions = normalizeToStringArray(
    product.dimensions?.length ? product.dimensions : allDimensions,
  );
  const resolvedThicknesses = normalizeToStringArray(
    product.thicknesses?.length ? product.thicknesses : allThicknesses,
  );
  const resolvedFinishes = normalizeToStringArray(
    product.finishes?.length ? product.finishes : allFinishes,
  );

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
          gallery={product.gallery as any}
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
