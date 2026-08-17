import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlugService,
  extractCategoryTitle,
  extractCategorySlug,
  getAllDimensionsService,
  getAllThicknessesService,
  getAllFinishesService,
} from "@/services/product.service";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductConfigurator } from "@/components/products/product-configurator";
import { ProductSpecsMatrix } from "@/components/products/product-specs-matrix";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlugService(
    slug,
    locale as "fa" | "en" | "ar",
  );

  if (!product) {
    return { title: "Product Not Found | Persis Quartz" };
  }

  const metaTitle =
    product.meta_title || `${product.title} (${product.code}) | Persis Quartz`;
  const metaDescription =
    product.meta_description ||
    product.description ||
    `اسلب سنگ کوارتز کد ${product.code}`;

  const imageFallback =
    typeof product.thumbnail === "object" && product.thumbnail?.url
      ? product.thumbnail.url
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : "/PersisQuartz-Red.png";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [imageFallback],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const currentLocale = locale as "fa" | "en" | "ar";

  const [product, allDimensions, allThicknesses, allFinishes] =
    await Promise.all([
      getProductBySlugService(slug, currentLocale),
      getAllDimensionsService(),
      getAllThicknessesService(),
      getAllFinishesService(currentLocale),
    ]);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ProductDetail" });
  const categoryTitle = extractCategoryTitle(product.category);
  const categorySlug = extractCategorySlug(product.category);

  const thumbnailUrl =
    typeof product.thumbnail === "object" && product.thumbnail?.url
      ? product.thumbnail.url
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : "/PersisQuartz-Red.png";

  const isRtl = locale === "fa" || locale === "ar";
  const BreadcrumbArrow = isRtl ? ChevronLeft : ChevronRight;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [thumbnailUrl],
    description: product.description,
    sku: product.code,
    category: categoryTitle,
    brand: {
      "@type": "Brand",
      name: "Persis Quartz",
    },
  };

  return (
    <main className="container mx-auto px-4 sm:px-12 py-24 sm:py-28 min-h-screen space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ۱. ناوبری و Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground pb-3 border-b border-border/30">
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("home")}
        </Link>
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          {t("products")}
        </Link>
        {categoryTitle && (
          <>
            <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40" />
            <Link
              href={`/products?category=${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryTitle}
            </Link>
          </>
        )}
        <BreadcrumbArrow className="h-3.5 w-3.5 opacity-40" />
        <span className="text-primary font-medium">{product.title}</span>
      </nav>

      {/* ۲. گالری و کانفیگوراتور داینامیک */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-6">
          <ProductGallery
            mainThumbnailUrl={thumbnailUrl}
            title={product.title}
            code={product.code}
            gallery={product.gallery}
          />
        </div>

        <div className="lg:col-span-6">
          <ProductConfigurator
            product={product}
            categoryTitle={categoryTitle}
            globalThicknesses={allThicknesses}
            globalFinishes={allFinishes}
          />
        </div>
      </div>

      {/* ۳. مشخصات مهندسی سراسری */}
      <ProductSpecsMatrix
        locale={locale}
        dimensions={allDimensions}
        thicknesses={allThicknesses}
        finishes={allFinishes.map((f) => f.title)}
      />
    </main>
  );
}
