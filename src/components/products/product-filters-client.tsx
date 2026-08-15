"use client";

import React, { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { CategoryItem, ColorItem } from "@/services/product.service";

interface ProductFiltersClientProps {
  categories?: CategoryItem[];
  colors?: ColorItem[];
}

export const ProductFiltersClient: React.FC<ProductFiltersClientProps> = ({
  categories = [],
  colors = [],
}) => {
  const t = useTranslations("ProductsFilter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentCategory =
    searchParams.get("category") || searchParams.get("cat") || "";
  const currentColor = searchParams.get("color") || "";

  const activeFiltersCount = (currentCategory ? 1 : 0) + (currentColor ? 1 : 0);

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
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const filterContent = (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          {t("title")}
        </h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-primary gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t("reset")}</span>
          </Button>
        )}
      </div>

      {/* ۱. فیلتر پویا دسته‌بندی‌ها (سری‌ها) */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-primary font-semibold block">
          {t("collections")}
        </label>
        <div className="space-y-2">
          <button
            onClick={() => {
              updateFilters("category", "");
              setIsMobileOpen(false);
            }}
            className={`w-full text-start text-xs py-2.5 px-3 border transition-colors ${
              currentCategory === ""
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border/40 hover:border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("all")}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                updateFilters("category", cat.slug);
                setIsMobileOpen(false);
              }}
              className={`w-full text-start text-xs py-2.5 px-3 border transition-colors ${
                currentCategory === cat.slug
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border/40 hover:border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* ۲. فیلتر پویا طیف رنگی */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-primary font-semibold block">
            {t("colorFamily")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  updateFilters(
                    "color",
                    currentColor === color.slug ? "" : color.slug,
                  );
                  setIsMobileOpen(false);
                }}
                className={`text-xs py-2.5 px-2 border flex items-center justify-center gap-2 transition-colors ${
                  currentColor === color.slug
                    ? "border-primary bg-primary text-primary-foreground font-medium"
                    : "border-border/40 hover:border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {color.hex_code && (
                  <span
                    className="h-3 w-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: color.hex_code }}
                  />
                )}
                <span>{color.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="md:hidden mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="w-full h-11 justify-between text-xs tracking-wider uppercase rounded-none border-border/80 bg-card"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>{t("title")}</span>
          </span>
          {activeFiltersCount > 0 && (
            <span className="h-5 w-5 bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="bg-background border-t border-border/60 p-6 max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs uppercase tracking-widest text-primary">
                Filters
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      <div
        className={`hidden md:block space-y-8 bg-card border border-border/50 p-6 ${
          isPending ? "opacity-60 transition-opacity" : ""
        }`}
      >
        {filterContent}
      </div>
    </>
  );
};
