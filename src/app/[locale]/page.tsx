// src/app/[locale]/page.tsx
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InteractiveTools } from "@/components/home/interactive-tools";
import { InfoCardsStack } from "@/components/home/info-cards-stack";
import { getHeroBanners } from "@/lib/payload/hero";
import { getProductsService } from "@/services/product.service";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as "fa" | "en" | "ar";

  // فراخوانی همزمان بنرها و محصولات فعال از پیلود
  const [heroSlides, { data: products }] = await Promise.all([
    getHeroBanners(currentLocale),
    getProductsService({
      locale: currentLocale,
      page: 1,
      limit: 8,
    }),
  ]);

  return (
    <main className="min-h-screen bg-background font-sans">
      <HeroBanner slides={heroSlides as any} />
      <BrandIntro />
      <ProductShowcase products={products} />
      <InfoCardsStack />
      <InteractiveTools />
    </main>
  );
}
