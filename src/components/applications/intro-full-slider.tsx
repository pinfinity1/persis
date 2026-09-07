"use client";

import React from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";
import { Button } from "@/components/ui/button";

interface IntroFullSliderProps {
  emblaRef: (node: HTMLDivElement | null) => void;
  emblaApi: EmblaCarouselType | undefined;
  images: string[];
  selectedIndex: number;
  onSkip: () => void;
}

export const IntroFullSlider: React.FC<IntroFullSliderProps> = ({
  emblaRef,
  emblaApi,
  images,
  selectedIndex,
  onSkip,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* دکمه اختصاصی رد کردن با استایل برند */}
      <div className="absolute top-8 end-8 z-30 pointer-events-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSkip}
          className="rounded-none h-9 px-5 bg-black/40 backdrop-blur-md border-white/20 hover:border-primary text-white hover:text-white hover:bg-primary/50 text-xs tracking-wider uppercase transition-all cursor-pointer"
        >
          رد کردن اینترو
        </Button>
      </div>

      {/* کروسل عمودی */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex flex-col h-full">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] w-full h-full overflow-hidden"
            >
              <Image
                src={src}
                alt={`Intro slide ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* نشانگرهای نقطه‌ای مینیمال */}
      <div className="absolute end-6 sm:end-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-auto">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              selectedIndex === idx
                ? "h-8 w-1.5 bg-primary"
                : "h-1.5 w-1.5 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`اسلاید شماره ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
