// src/components/shared/media-lightbox-dialog.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface LightboxImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface MediaLightboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[] | string[];
  currentIndex: number;
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
  // استانداردسازی ورودی به آرایه‌ای از شیء LightboxImage
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

  // کنترل ناوبری با کلیدهای جهت‌نما کیبورد
  useEffect(() => {
    if (!isOpen || !isGallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isGallery, handleNext, handlePrev]);

  if (total === 0 || !currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[96vw] lg:max-w-6xl p-0 bg-black/95 border-neutral-800 rounded-none overflow-hidden outline-none"
      >
        <DialogTitle className="sr-only">
          {title || currentImage.caption || "نمایش تصویر با ابعاد کامل"}
        </DialogTitle>

        <div className="relative w-full h-[85vh] sm:h-[88vh] flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* هدر دیالوگ شامل عنوان و دکمه بستن */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white z-20">
            <div className="flex items-center gap-3">
              {title && (
                <span className="text-xs sm:text-sm font-light text-neutral-300">
                  {title}
                </span>
              )}
              {isGallery && (
                <span className="text-[11px] font-mono tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                  0{currentIndex + 1} / 0{total}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="بستن پنجره"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* فریم سنترال تصویر با کادربندی بهینه */}
          <div className="relative flex-1 w-full my-auto overflow-hidden flex items-center justify-center">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title || "Media View"}
              fill
              priority
              sizes="95vw"
              className="object-contain"
            />

            {/* فلش‌های ناوبری فقط در صورت گالری بودن رندر می‌شوند */}
            {isGallery && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 size-9 sm:size-11 rounded-none bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-colors cursor-pointer z-20"
                  aria-label="تصویر قبلی"
                >
                  <ChevronRight className="size-5 rtl:rotate-0 ltr:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 size-9 sm:size-11 rounded-none bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-colors cursor-pointer z-20"
                  aria-label="تصویر بعدی"
                >
                  <ChevronLeft className="size-5 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* نوار پایین: توضیح زیر تصویر + تامب‌نیل‌های کوچک در صورت گالری بودن */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
            <p className="text-xs text-neutral-400 font-light truncate max-w-md">
              {currentImage.caption || currentImage.alt}
            </p>

            {isGallery && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {formattedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onIndexChange && onIndexChange(idx)}
                    className={`relative size-10 sm:size-12 shrink-0 border overflow-hidden transition-all cursor-pointer ${
                      currentIndex === idx
                        ? "border-primary ring-1 ring-primary"
                        : "border-white/20 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Thumb ${idx + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
