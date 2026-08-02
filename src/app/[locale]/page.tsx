import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro";
import { ProductShowcase } from "@/components/home/product-showcase";
import { InteractiveTools } from "@/components/home/interactive-tools";
import { QuickContactBanner } from "@/components/home/quick-contact-banner";
import { MOCK_PRODUCTS } from "@/lib/fake-products";
import { useLocale } from "next-intl";
import { InfoCardsStack } from "@/components/home/info-cards-stack";

export default function HomePage() {
  const locale = useLocale() as "fa" | "en";

  const productsForUi = MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    title: p.title[locale] || p.title.fa,
    code: p.code,
    category: p.category,
    color: p.color,
    imageUrl: p.imageUrl,
    slug: p.slug,
  }));

  return (
    <main className="min-h-screen bg-background font-sans">
      <HeroBanner />
      <BrandIntro />
      <ProductShowcase products={productsForUi} />
      <InfoCardsStack />
      <InteractiveTools />
      <QuickContactBanner />
    </main>
  );
}
