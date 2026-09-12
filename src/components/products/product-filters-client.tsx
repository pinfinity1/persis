// src/components/products/product-filters-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { RotateCcw, SlidersHorizontal, Check, X } from "lucide-react";
import type {
  CategoryItem,
  ColorItem,
  VeinPatternItem,
} from "@/services/product.service";

interface ProductFiltersClientProps {
  categories?: CategoryItem[];
  colors?: ColorItem[];
  veinPatterns?: VeinPatternItem[];
}

export const ProductFiltersClient: React.FC<ProductFiltersClientProps> = ({
  categories = [],
  colors = [],
  veinPatterns = [],
}) => {
  const t = useTranslations("ProductsFilter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory =
    searchParams.get("category") || searchParams.get("cat") || "";
  const currentColor = searchParams.get("color") || "";
  const currentVeinPattern = searchParams.get("vein_pattern") || "";

  const activeFiltersCount =
    (currentCategory ? 1 : 0) +
    (currentColor ? 1 : 0) +
    (currentVeinPattern ? 1 : 0);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cat");

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    startTransition(() => {
      // اضافه شدن scroll: false بسیار حیاتی است
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      // اضافه شدن scroll: false
      router.push(pathname, { scroll: false });
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3.5 rounded-none border-border/80 hover:border-primary hover:bg-transparent text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer select-none"
        >
          <SlidersHorizontal className="size-3.5 text-primary" />
          <span>{t("title")}</span>
          {activeFiltersCount > 0 && (
            <span className="size-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[80vh] max-h-[580px] rounded-t-none border-t border-border/60 bg-background p-0 flex flex-col justify-between select-none"
      >
        {/* هدر یکپارچه و تمیز */}
        <SheetHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-4 bg-primary" />
            <SheetTitle className="text-xs uppercase tracking-[0.2em] text-primary font-bold m-0">
              {t("title")}
            </SheetTitle>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer border-s border-border/60 ps-3 ms-1"
              >
                <RotateCcw className="size-3" />
                <span>{t("reset")}</span>
              </button>
            )}
          </div>

          <SheetClose asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* محتوای فیلترها بدون دکمه‌های تکراری و مزاحم */}
        <div
          className={`overflow-y-auto px-6 py-6 flex-1 space-y-8 scrollbar-none ${
            isPending ? "opacity-50 transition-opacity" : ""
          }`}
        >
          {/* ۱. کالکشن‌ها و دسته‌بندی‌ها */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-foreground/80 font-medium block">
              {t("collections")}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateFilters("category", "")}
                className={`text-xs py-2 px-3.5 border transition-all duration-200 cursor-pointer ${
                  currentCategory === ""
                    ? "border-primary bg-primary text-primary-foreground font-medium shadow-xs"
                    : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-card"
                }`}
              >
                {t("all")}
              </button>

              {categories.map((cat) => {
                const isSelected = currentCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateFilters("category", cat.slug)}
                    className={`text-xs py-2 px-3.5 border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-medium shadow-xs"
                        : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-card"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۲. طیف رنگی بدون دایره hex_code */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-foreground/80 font-medium block">
                {t("colorFamily")}
              </span>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = currentColor === color.slug;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        updateFilters("color", isSelected ? "" : color.slug)
                      }
                      className={`text-xs py-2 px-3.5 border flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-card"
                      }`}
                    >
                      <span>{color.title}</span>
                      {isSelected && (
                        <Check className="size-3 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۳. الگوهای رگه */}
          {veinPatterns.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-foreground/80 font-medium block">
                {t("veinPattern")}
              </span>
              <div className="flex flex-wrap gap-2">
                {veinPatterns.map((pattern) => {
                  const isSelected = currentVeinPattern === pattern.slug;
                  return (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() =>
                        updateFilters(
                          "vein_pattern",
                          isSelected ? "" : pattern.slug,
                        )
                      }
                      className={`text-xs py-2 px-3.5 border flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-card"
                      }`}
                    >
                      <span>{pattern.title}</span>
                      {isSelected && (
                        <Check className="size-3 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* فوتر چسبان با دکمه تمیز مشاهده نتایج */}
        <div className="p-4 sm:p-5 border-t border-border/40 bg-card/60 backdrop-blur-sm shrink-0">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider font-medium cursor-pointer relative overflow-hidden"
          >
            {t("viewResults")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
