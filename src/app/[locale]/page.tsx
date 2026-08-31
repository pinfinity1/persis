import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InteractiveTools } from "@/components/home/interactive-tools";
import { InfoCardsStack } from "@/components/home/info-cards-stack";
import { getHeroBannersService } from "@/services/hero.service";
import { getFeaturedProductsService } from "@/services/product.service";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as "fa" | "en" | "ar";

  const [heroSlides, featuredProducts] = await Promise.all([
    getHeroBannersService(currentLocale),
    getFeaturedProductsService(currentLocale),
  ]);

  return (
    <main className="min-h-screen bg-background font-sans">
      <HeroBanner slides={heroSlides as any} />
      <BrandIntro />
      {featuredProducts.length > 0 && (
        <ProductShowcase products={featuredProducts} />
      )}
      <InfoCardsStack />
      <InteractiveTools />
    </main>
  );
}
