"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface CategoryData {
  id: string;
  title: string;
  desc: string;
  images: string[];
}

interface LandingStageProps {
  categories: CategoryData[];
  selectedCatId: string;
  onSelectCategory: (id: string) => void;
  emblaRef: (node: HTMLDivElement | null) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const LandingStage: React.FC<LandingStageProps> = ({
  categories,
  selectedCatId,
  onSelectCategory,
  emblaRef,
  onPrev,
  onNext,
}) => {
  const activeCategory =
    categories.find((c) => c.id === selectedCatId) || categories[0];

  return (
    <div className="container mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-20 min-h-screen flex flex-col justify-between select-none">
      {/* هدر صفحه لندینگ */}
      <div className="mb-8 space-y-2 text-center sm:text-start">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-widest text-primary font-medium">
          <span className="h-px w-6 bg-primary inline-block" />
          <span>کاربردهای مهندسی‌شده</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-light text-foreground tracking-tight">
          فضاهای خلق‌شده با پرسیس کوارتز
        </h1>
      </div>

      {/* اسلایدر افقی وسط صفحه */}
      <div className="relative w-full my-auto py-4">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ms-4 items-center">
            {activeCategory.images.map((imgSrc, idx) => (
              <div
                key={idx}
                className="flex-[0_0_88%] sm:flex-[0_0_65%] lg:flex-[0_0_50%] ps-4 min-w-0"
              >
                <div className="relative aspect-[16/10] w-full border border-border/60 overflow-hidden bg-muted group">
                  <Image
                    src={imgSrc}
                    alt={activeCategory.title}
                    fill
                    sizes="(max-width: 1024px) 88vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* دکمه‌های ناوبری اسلایدر افقی */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="size-10 border border-border/60 flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="size-10 border border-border/60 flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      </div>

      {/* تب‌های دسته‌بندی و توضیحات متنی */}
      <div className="pt-8 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-5 py-2.5 text-xs tracking-wider border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-medium shadow-sm"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-6 space-y-2 text-start">
            <h3 className="text-base sm:text-lg font-medium text-foreground">
              {activeCategory.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-xl text-justify">
              {activeCategory.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
