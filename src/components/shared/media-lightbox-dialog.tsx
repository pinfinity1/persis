// src/components/shared/media-lightbox-dialog.tsx
"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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

    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      Math.abs(diffX) > minSwipeDistance
    ) {
      if (diffX > 0) {
        isRtl ? handlePrev() : handleNext();
      } else {
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

  if (!currentImage) return null;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        {/* لایه پس‌زمینه تیره که تمام ویوپورت را قفل می‌کند */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-md transition-opacity duration-200" />

        {/* کانتینر محتوا: فیکس روی 0,0 با عرض و ارتفاع کامل صفحه بدون مارجین اضافی */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed top-0 left-0 right-0 bottom-0 z-[9999] h-screen w-screen max-w-none bg-transparent flex flex-col justify-between p-4 sm:p-6 select-none outline-none focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            {title || "Image Viewer"}
          </DialogPrimitive.Title>

          {/* هدر */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 z-30">
            <div className="flex items-center gap-3 text-white">
              {title && (
                <span className="text-xs sm:text-sm font-light tracking-wide text-neutral-300">
                  {title}
                </span>
              )}
              {isGallery && (
                <span
                  dir="ltr"
                  className="text-xs tracking-widest text-primary border border-primary/40 px-2 py-0.5 font-mono"
                >
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              )}
            </div>

            <DialogPrimitive.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-none focus:outline-none"
                aria-label="Close"
              >
                <X className="size-6" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* استیج عکس اصلی */}
          <div
            className="relative flex-1 w-full my-2 flex items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
              <Image
                src={currentImage.url || "/PersisQuartz-Red.png"}
                alt={currentImage.alt || title || "View"}
                fill
                priority
                sizes="100vw"
                className="object-contain pointer-events-none select-none"
              />
            </div>

            {/* فلش‌های ناوبری */}
            {isGallery && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute start-2 sm:start-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 bg-black/60 hover:bg-primary border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-30 touch-manipulation focus:outline-none"
                  aria-label="Previous"
                >
                  {isRtl ? (
                    <ChevronRight className="size-5 sm:size-6" />
                  ) : (
                    <ChevronLeft className="size-5 sm:size-6" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute end-2 sm:end-6 top-1/2 -translate-y-1/2 size-10 sm:size-12 bg-black/60 hover:bg-primary border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-30 touch-manipulation focus:outline-none"
                  aria-label="Next"
                >
                  {isRtl ? (
                    <ChevronLeft className="size-5 sm:size-6" />
                  ) : (
                    <ChevronRight className="size-5 sm:size-6" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* نوار تامب‌نیل‌های افقی پایین */}
          {isGallery && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none z-30 shrink-0">
              {formattedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onIndexChange && onIndexChange(idx)}
                  className={`relative size-12 sm:size-14 shrink-0 overflow-hidden transition-all cursor-pointer focus:outline-none ${
                    currentIndex === idx
                      ? "ring-2 ring-primary opacity-100 scale-105"
                      : "opacity-35 hover:opacity-85"
                  }`}
                >
                  <Image
                    src={img.url || "/PersisQuartz-Red.png"}
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
