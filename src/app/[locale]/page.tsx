import { getHomePageDataService } from "@/services/home.service";
import { getFeaturedProductsService } from "@/services/product.service";
import { HeroBanner } from "@/components/home/hero-banner";
import { InfoCardsStack } from "@/components/home/info-cards-stack";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InteractiveTools } from "@/components/home/interactive-tools";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as "fa" | "en" | "ar") || "fa";

  // دو واکشی موازی و پرسرعت سروری
  const [homeData, featuredProducts] = await Promise.all([
    getHomePageDataService(currentLocale),
    getFeaturedProductsService(currentLocale),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <HeroBanner heroData={homeData.hero} />
      <BrandIntro />
      <ProductShowcase products={featuredProducts} />
      <InfoCardsStack images={homeData.infoCardsImages} />
      <InteractiveTools />
    </main>
  );
}
