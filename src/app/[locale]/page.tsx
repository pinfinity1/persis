// src/app/[locale]/page.tsx
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InteractiveTools } from "@/components/home/interactive-tools";
import { MOCK_PRODUCTS } from "@/lib/fake-products";
import { useLocale } from "next-intl";
import { InfoCardsStack } from "@/components/home/info-cards-stack";
import { getHeroBanners } from "@/lib/payload/hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // دریافت اسلایدهای هیرو به صورت متناسب با زبان فعلی کاربر از پیلود
  const heroSlides = await getHeroBanners(locale);

  const productsForUi = MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    title: p.title[locale as "fa" | "en"] || p.title.fa,
    code: p.code,
    category: p.category,
    color: p.color,
    imageUrl: p.imageUrl,
    slug: p.slug,
  }));

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* پاس دادن داده‌های پیلود به کامپوننت هیرو */}
      <HeroBanner slides={heroSlides as any} />
      <BrandIntro />
      <ProductShowcase products={productsForUi} />
      <InfoCardsStack />
      <InteractiveTools />
    </main>
  );
}
