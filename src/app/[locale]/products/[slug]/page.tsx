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

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const getCachedProduct = cache(async (slug: string, locale: Locale) => {
  return await getProductBySlugService(slug, locale);
});

function safeJsonLdReplacer(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function resolveMediaUrl(
  thumbnailUrl: string | undefined,
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

  const metaTitle =
    product.meta_title || `${product.title} (${product.code}) | Persis Quartz`;
  const metaDescription =
    product.meta_description ||
    product.description ||
    `اسلب سنگ کوارتز کد ${product.code}`;

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
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `/${currentLocale}/products/${slug}`,
      siteName: "Persis Quartz",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 900,
          alt: product.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "fa";

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
      name: "Persis Quartz",
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

  const resolvedDimensions =
    Array.isArray(product.dimensions) && product.dimensions.length > 0
      ? product.dimensions
      : allDimensions;

  const resolvedThicknesses =
    Array.isArray(product.thicknesses) && product.thicknesses.length > 0
      ? product.thicknesses
      : allThicknesses;

  const resolvedFinishes =
    Array.isArray(product.finishes) && product.finishes.length > 0
      ? product.finishes
      : allFinishes.map((f) => f.title);

  return (
    <main className="container mx-auto px-4 sm:px-12 py-24 sm:py-28 min-h-screen space-y-14">
      {/* ۱. سئوی ساختاریافته */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(jsonLdPayload) }}
      />

      {/* ۲. مسیر ناوبری (Breadcrumbs) */}
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

      {/* ۳. اسلب اصلی با زوم + بخش تنظیمات B2B محصول */}
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

      {/* ۴. گالری افقی تصاویر اجرا شده در محیط (دقیقاً زیر گرید بالا و بالای مشخصات) */}
      <ProductAppliedGallery title={product.title} gallery={product.gallery} />

      {/* ۵. ماتریس مشخصات مهندسی سنگ */}
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
