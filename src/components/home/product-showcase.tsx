"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components/products/product-card";
import type { ProductItem } from "@/services/product.service";

interface ProductShowcaseProps {
  products: any[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
}) => {
  const t = useTranslations("FeaturedProducts");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    direction: isRtl ? "rtl" : "ltr",
    containScroll: false,
    breakpoints: {
      "(min-width: 640px)": {
        align: "start",
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

  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border/40 overflow-hidden">
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

      <div className="w-full sm:container sm:mx-auto sm:px-12">
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-4 sm:gap-6">
            {displayProducts.map((product) => {
              // ساخت شیء استاندارد ProductItem برای کامپوننت یکپارچه ProductCard
              const formattedProduct: ProductItem = {
                id: product.id,
                title: product.title,
                slug: product.slug,
                code: product.code,
                category: product.category,
                color_family: product.color,
                is_in_stock: "in_stock",
                thumbnail: { url: product.imageUrl, alt: product.title },
              };

              return (
                <div
                  key={product.id}
                  className="flex-[0_0_80%] sm:flex-[0_0_300px] lg:flex-[0_0_320px] min-w-0"
                >
                  <ProductCard product={formattedProduct} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
