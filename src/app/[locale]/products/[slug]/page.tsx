import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlugService,
  extractCategoryTitle,
} from "@/services/product.service";
import { ProductGallery } from "@/components/products/product-gallery";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Box } from "lucide-react";

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

  return {
    title: `${product.title} (${product.code}) | Persis Quartz`,
    description: product.description || `اسلب سنگ کوارتز کد ${product.code}`,
    openGraph: {
      title: `${product.title} - ${product.code}`,
      description: product.description,
      images: [
        typeof product.thumbnail === "object"
          ? product.thumbnail.url
          : product.thumbnail,
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlugService(
    slug,
    locale as "fa" | "en" | "ar",
  );
  const t = await getTranslations({ locale, namespace: "ProductDetail" });

  if (!product) {
    notFound();
  }

  const thumbnailUrl =
    typeof product.thumbnail === "object" && product.thumbnail?.url
      ? product.thumbnail.url
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop";

  const categoryTitle = extractCategoryTitle(product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [thumbnailUrl],
    description: product.description,
    sku: product.code,
    brand: {
      "@type": "Brand",
      name: "Persis Quartz",
    },
  };

  return (
    <main className="container mx-auto px-4 sm:px-12 py-24 sm:py-28 min-h-screen space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6">
          <ProductGallery
            mainThumbnailUrl={thumbnailUrl}
            title={product.title}
            gallery={product.gallery}
          />
        </div>

        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono tracking-widest text-primary uppercase border border-primary/30 px-2 py-0.5">
                {product.code}
              </span>
              {categoryTitle && (
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {categoryTitle}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-light text-foreground">
              {product.title}
            </h1>
          </div>

          <p className="text-sm font-light text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6 border-y border-border/40 py-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground block">
                {t("thicknesses")}:
              </label>
              <div className="flex items-center gap-2">
                {(
                  product.available_thicknesses || ["12mm", "20mm", "30mm"]
                ).map((thick) => (
                  <span
                    key={thick}
                    className="text-xs font-mono border border-border px-3 py-1.5 bg-card text-foreground"
                  >
                    {thick}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground block">
                {t("finishes")}:
              </label>
              <div className="flex items-center gap-2">
                {(product.finishes || ["polished", "honed"]).map((fin) => (
                  <span
                    key={fin}
                    className="text-xs font-mono uppercase border border-border px-3 py-1.5 bg-card text-foreground"
                  >
                    {fin}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* اکشن‌های اصلی با پشتیبانی کامل ترجمه */}
          <div className="space-y-3 pt-2">
            <Button
              asChild
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs tracking-wider uppercase font-medium"
            >
              <Link
                href={`/contact?type=sample&code=${product.code}`}
                className="flex items-center justify-center gap-2"
              >
                <Box className="h-4 w-4" />
                <span>{t("requestSample")}</span>
              </Link>
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-border hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
              >
                <Link
                  href="/dealers"
                  className="flex items-center justify-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{t("findDealer")}</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-border hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
              >
                <a
                  href={product.specsSheetUrl || "/catalogs"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>{t("downloadSpecs")}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
