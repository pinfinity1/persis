// src/components/home/product-showcase.tsx
"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export interface Product {
  id: string;
  title: string;
  code: string;
  category: string;
  color: string;
  imageUrl: string;
  slug: string;
}

interface ProductShowcaseProps {
  products: Product[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
}) => {
  const t = useTranslations("FeaturedProducts");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  // تنظیمات بهینه و واکنش‌گرا مستقیم در خود Embla بدون نیاز به Stateهای React
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center", // پیش‌فرض برای موبایل: کارت وسط صفحه قرار می‌گیرد
    direction: isRtl ? "rtl" : "ltr",
    containScroll: false,
    breakpoints: {
      "(min-width: 640px)": {
        align: "start", // برای تبلت و دسکتاپ: کارت‌ها از ابتدا تراز می‌شوند
        containScroll: "trimSnaps",
      },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // محدودیت به ۸ محصول اصلی
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border/40 overflow-hidden">
      {/* کانتینر هدر و دکمه‌ها - دقیقاً تراز با کل سایت */}
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-primary font-mono block mb-1.5">
              {t("tagline")}
            </span>
            <h3 className="text-2xl sm:text-4xl font-light text-foreground">
              {t("title")}
            </h3>
          </div>

          {/* CTA & Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none px-4 sm:px-5 h-9 sm:h-10 text-xs tracking-wider uppercase border-border hover:bg-muted text-foreground transition-all duration-300"
            >
              <Link href="/products" className="inline-flex items-center gap-2">
                <span>{t("viewAll")}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </Link>
            </Button>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors"
                aria-label="Next Slide"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ریل اسلایدر */}
      <div className="w-full sm:container sm:mx-auto sm:px-12">
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_80%] sm:flex-[0_0_300px] lg:flex-[0_0_320px] min-w-0"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group relative flex flex-col bg-card overflow-hidden border border-border/50 hover:border-primary/60 transition-all duration-300 h-full select-none"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted pointer-events-none">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 300px, 320px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 flex-grow border-t border-border/30">
                    <div>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono block">
                        {product.code}
                      </span>
                      <h4 className="text-sm sm:text-base font-medium text-foreground mt-0.5 group-hover:text-primary transition-colors">
                        {product.title}
                      </h4>
                    </div>

                    {/* دکمه اکشن - فقط در دسکتاپ هنگام هاور، در موبایل مخفی */}
                    <div className="hidden sm:flex shrink-0 h-9 w-9 border border-primary bg-primary text-primary-foreground items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
