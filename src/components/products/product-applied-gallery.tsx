"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useLocale } from "next-intl";
import { ChevronRight, ChevronLeft, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaLightboxDialog } from "@/components/shared/media-lightbox-dialog";
import type { GalleryItemDTO } from "@/services/product.service";

interface ProductAppliedGalleryProps {
  title: string;
  gallery: GalleryItemDTO[];
}

export const ProductAppliedGallery: React.FC<ProductAppliedGalleryProps> = ({
  title,
  gallery = [],
}) => {
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    direction: isRtl ? "rtl" : "ltr",
    duration: 30,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIdx = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIdx);

    const activeThumb = thumbRefs.current[newIdx];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <section className="space-y-4 pt-12 sm:pt-16 border-t border-border/40 select-none">
        {/* هدر مینیمال: فقط تگ بالایی و نویگیشن با شمارنده واحد */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-primary" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary font-bold">
              SPATIAL APPLICATION
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-foreground font-bold text-sm">
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>
              <span className="opacity-30">/</span>
              <span>{String(gallery.length).padStart(2, "0")}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="h-8 w-8 rounded-none border-border/60 hover:border-primary hover:bg-transparent transition-colors touch-manipulation"
                aria-label="Previous slide"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="h-8 w-8 rounded-none border-border/60 hover:border-primary hover:bg-transparent transition-colors touch-manipulation"
                aria-label="Next slide"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
              </Button>
            </div>
          </div>
        </div>

        {/* گرید استیج و تامب‌نیل‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-stretch">
          {/* ستون تامب‌نیل‌ها (بدون بوردر سنگین و بدون شماره‌های اضافه) */}
          <div className="order-2 lg:order-1 lg:col-span-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-none lg:max-h-[520px] scrollbar-none pb-1 lg:pb-0 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {gallery.map((item, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  thumbRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => scrollTo(idx)}
                className={`relative flex-[0_0_84px] sm:flex-[0_0_104px] lg:flex-none aspect-[16/11] overflow-hidden transition-all duration-300 cursor-pointer touch-manipulation shrink-0 ${
                  selectedIndex === idx
                    ? "opacity-100 ring-1 ring-primary"
                    : "opacity-35 hover:opacity-75"
                }`}
              >
                <Image
                  src={item.url}
                  alt={`Thumb ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 90px, (max-width: 1024px) 110px, 160px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* استیج اصلی کروسل */}
          <div className="order-1 lg:order-2 lg:col-span-10 relative bg-neutral-950 border border-border/60 overflow-hidden group">
            <div
              ref={emblaRef}
              className="overflow-hidden h-full cursor-grab active:cursor-grabbing"
            >
              <div className="flex h-full">
                {gallery.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative flex-[0_0_100%] min-w-0 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/10] w-full cursor-pointer touch-pan-y"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <Image
                      src={item.url}
                      alt={`${title} space ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 85vw"
                      className="object-cover pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* دکمه تمام‌صفحه ثابت روی کل استیج (دیگر همراه با اسلاید حرکت نمی‌کند) */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 end-3 sm:top-5 sm:end-5 size-9 sm:size-10 bg-black/65 hover:bg-primary border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-30 touch-manipulation"
              aria-label="Full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* پجینیشن خطی عمودی متصل به لبه با پس‌زمینه بلور */}
            {gallery.length > 1 && (
              <div className="absolute end-0 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <div className="flex flex-col gap-2 sm:gap-2.5 py-3 sm:py-4 px-1.5 sm:px-2 bg-black/55 backdrop-blur-md border-s border-y border-white/15 shadow-xl">
                  {gallery.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollTo(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`transition-all duration-300 rounded-none cursor-pointer focus:outline-none touch-manipulation ${
                        selectedIndex === idx
                          ? "h-6 sm:h-9 w-1 sm:w-1.5 bg-primary shadow-[0_0_10px_rgba(155,7,55,0.9)]"
                          : "h-2 w-1 sm:w-1.5 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* دیالوگ لایت‌باکس با تاچ نیتیو موبایل */}
      <MediaLightboxDialog
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={gallery}
        currentIndex={selectedIndex}
        onIndexChange={(idx) => {
          setSelectedIndex(idx);
          scrollTo(idx);
        }}
        title={title}
      />
    </>
  );
};
