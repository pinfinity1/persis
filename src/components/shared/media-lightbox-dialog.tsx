// src/components/shared/media-lightbox-dialog.tsx
"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale } from "next-intl";

export interface LightboxImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface MediaLightboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[] | string[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  title?: string;
}

export const MediaLightboxDialog: React.FC<MediaLightboxDialogProps> = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
  title,
}) => {
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const formattedImages: LightboxImage[] = images.map((img) =>
    typeof img === "string" ? { url: img, alt: title } : img,
  );

  const total = formattedImages.length;
  const isGallery = total > 1;
  const currentImage = formattedImages[currentIndex] || formattedImages[0];

  const handleNext = useCallback(() => {
    if (!isGallery || !onIndexChange) return;
    onIndexChange((currentIndex + 1) % total);
  }, [currentIndex, total, isGallery, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (!isGallery || !onIndexChange) return;
    onIndexChange((currentIndex - 1 + total) % total);
  }, [currentIndex, total, isGallery, onIndexChange]);

  // کنترل سوایپ لمسی دقیق و بدون تداخل با مرورگر
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const minSwipeDistance = 35;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartX.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // اطمینان از اینکه حرکت عمدتاً افقی بوده نه اسکرول عمودی
    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      Math.abs(diffX) > minSwipeDistance
    ) {
      if (diffX > 0) {
        // حرکت انگشت به سمت چپ
        isRtl ? handlePrev() : handleNext();
      } else {
        // حرکت انگشت به سمت راست
        isRtl ? handleNext() : handlePrev();
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!isGallery) return;
      if (e.key === "ArrowRight") {
        isRtl ? handlePrev() : handleNext();
      }
      if (e.key === "ArrowLeft") {
        isRtl ? handleNext() : handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isGallery, isRtl, handleNext, handlePrev, onClose]);

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-black data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[9999] h-screen w-screen bg-black flex flex-col justify-between p-3 sm:p-6 select-none outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        >
          <DialogPrimitive.Title className="sr-only">
            {title || "نمایش تصویر"}
          </DialogPrimitive.Title>

          {/* هدر لایت‌باکس */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 z-30">
            <div className="flex items-center gap-3 text-white">
              {title && (
                <span className="text-xs sm:text-sm font-light tracking-wide text-neutral-300">
                  {title}
                </span>
              )}
              {isGallery && (
                <span className="text-xs font-mono tracking-widest text-primary border border-primary/40 px-2 py-0.5">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
              aria-label="بستن"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* استیج اصلی با تاچ مستقیم touch-none برای فعال‌سازی کامل سوایپ لمسی */}
          <div
            className="relative flex-1 w-full my-2 flex items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title || "View"}
              fill
              priority
              sizes="100vw"
              className="object-contain pointer-events-none"
            />

            {/* فلش‌های ناوبری (قابل استفاده هم در دسکتاپ و هم در موبایل) */}
            {isGallery && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute start-2 sm:start-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 bg-black/60 active:bg-primary sm:hover:bg-primary border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-30 touch-manipulation"
                  aria-label="Previous"
                >
                  <ChevronRight className="size-5 sm:size-6 rtl:rotate-0 ltr:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute end-2 sm:end-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 bg-black/60 active:bg-primary sm:hover:bg-primary border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-30 touch-manipulation"
                  aria-label="Next"
                >
                  <ChevronLeft className="size-5 sm:size-6 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* ریل تامب‌نیل‌های افقی پایین */}
          {isGallery && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none z-30 shrink-0">
              {formattedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onIndexChange && onIndexChange(idx)}
                  className={`relative size-12 sm:size-14 shrink-0 overflow-hidden transition-all cursor-pointer touch-manipulation ${
                    currentIndex === idx
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-35 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
