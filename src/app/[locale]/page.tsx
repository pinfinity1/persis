// src/app/[locale]/page.tsx
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandIntro } from "@/components/home/brand-intro"; // <-- کامپوننت جدید
import { FeaturedProducts } from "@/components/home/featured-products";
import { InteractiveTools } from "@/components/home/interactive-tools";
import { QuickContactBanner } from "@/components/home/quick-contact-banner";
import { MOCK_PRODUCTS } from "@/lib/fake-products";
import { useLocale } from "next-intl";

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
      <FeaturedProducts products={productsForUi} />
      <InteractiveTools />
      <QuickContactBanner />
    </main>
  );
}
