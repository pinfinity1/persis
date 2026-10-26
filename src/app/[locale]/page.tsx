// src/app/[locale]/page.tsx
import React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getHomePageDataService } from "@/services/home.service";
import { getFeaturedProductsService } from "@/services/product.service";
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InfoCardsStack } from "@/components/home/info-cards-stack";
import { InteractiveTools } from "@/components/home/interactive-tools";
import {
  generateStaticPageMetadata,
  getOrganizationSchema,
  getWebSiteSchema,
  safeJsonLdReplacer,
  type Locale,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  return generateStaticPageMetadata("home", currentLocale, "");
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as "fa" | "en" | "ar") || "fa";
  setRequestLocale(currentLocale);

  const [homeData, featuredProducts] = await Promise.all([
    getHomePageDataService(currentLocale),
    getFeaturedProductsService(currentLocale),
  ]);

  const homeGraph = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationSchema(), getWebSiteSchema(currentLocale)],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(homeGraph) }}
      />
      <HeroBanner heroData={homeData.hero} />
      <BrandIntro data={homeData.brandIntro} />
      {featuredProducts && featuredProducts.length > 0 && (
        <ProductShowcase products={featuredProducts} />
      )}
      <InfoCardsStack data={homeData.infoCardsSection} />
      <InteractiveTools />
    </main>
  );
}
