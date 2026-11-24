// src/components/catalogs/catalogs-directory-client.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, RotateCcw, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/services/catalog.service";
import { CatalogEditorialCard } from "./catalog-editorial-card";
import { CatalogLookbookModal } from "./catalog-lookbook-modal";

interface CatalogsDirectoryClientProps {
  initialCatalogs: CatalogItem[];
}

type CatalogFilterType = "all" | "full_catalog" | "technical" | "collection" | "guide";

export const CatalogsDirectoryClient: React.FC<CatalogsDirectoryClientProps> = ({
  initialCatalogs,
}) => {
  const t = useTranslations("Catalogs");

  const [activeType, setActiveType] = useState<CatalogFilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem | null>(null);

  // فیلترهای تب‌بندی دسته‌ها
  const filterTabs: Array<{ id: CatalogFilterType; labelKey: string }> = [
    { id: "all", labelKey: "allTypes" },
    { id: "full_catalog", labelKey: "typeFull" },
    { id: "technical", labelKey: "typeTechnical" },
    { id: "collection", labelKey: "typeCollection" },
    { id: "guide", labelKey: "typeGuide" },
  ];

  // فیلترینگ این‌مموری فوق سریع (<1ms)
  const filteredCatalogs = useMemo(() => {
    let result = initialCatalogs;

    // ۱. فیلتر نوع کاتالوگ
    if (activeType !== "all") {
      result = result.filter((item) => item.catalog_type === activeType);
    }

    // ۲. فیلتر جستجوی متنی
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const yearMatch = String(item.year || "").includes(q);
        return titleMatch || descMatch || yearMatch;
      });
    }

    return result;
  }, [initialCatalogs, activeType, searchQuery]);

  // دسته‌بندی بر اساس سال انتشار
  const groupedByYear = useMemo(() => {
    return filteredCatalogs.reduce(
      (acc, catalog) => {
        const year = catalog.year || new Date().getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(catalog);
        return acc;
      },
      {} as Record<number, CatalogItem[]>,
    );
  }, [filteredCatalogs]);

  const sortedYears = useMemo(() => {
    return Object.keys(groupedByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedByYear]);

  const handleResetFilters = () => {
    setActiveType("all");
    setSearchQuery("");
  };

  return (
    <section className="space-y-8 select-none">
      {/* ========================================================= */}
      {/* تولبار فیلترها و نوار جستجو (Ultra-Minimalist Toolbar) */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/50">
        {/* تب‌های دسته‌بندی */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all duration-200 border rounded-none cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
                )}
              >
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {/* فیلد جستجوی زنده */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="rounded-none ps-9 pe-8 h-9 text-xs bg-background/60 border-border/70 focus-visible:ring-primary/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground font-mono"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* گرید کاتالوگ‌های فیلترشده بر اساس سال انتشار */}
      {/* ========================================================= */}
      {sortedYears.length > 0 ? (
        <div className="space-y-14 sm:space-y-20">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-6">
              {/* هدر سال */}
              <div className="flex items-baseline gap-3 pb-2 border-b border-border/30">
                <span className="text-2xl sm:text-3xl font-light text-primary font-mono">
                  {year}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-mono">
                  ARCHITECTURAL PUBLICATIONS & SPECS
                </span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">
                  ({groupedByYear[year].length})
                </span>
              </div>

              {/* کارت‌های مونوگراف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {groupedByYear[year].map((catalog) => (
                  <CatalogEditorialCard
                    key={catalog.id}
                    catalog={catalog}
                    onOpenLookbook={(item) => setSelectedCatalog(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* وضعیت عدم یافتن نتیجه */
        <div className="p-12 sm:p-20 text-center bg-card/60 border border-border/50 space-y-4">
          <FileText className="size-10 text-muted-foreground/50 mx-auto" />
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-medium text-foreground">
              {t("noCatalogsFound")}
            </h4>
            <p className="text-xs text-muted-foreground font-light">
              عبارت دیگری را جستجو کرده یا فیلتر دسته‌بندی را تغییر دهید.
            </p>
          </div>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="rounded-none text-xs gap-1.5 border-border/80"
          >
            <RotateCcw className="size-3 text-muted-foreground" />
            <span>{t("resetFilters")}</span>
          </Button>
        </div>
      )}

      {/* ========================================================= */}
      {/* مودال ریدر اختصاصی ادیتوریال برای کارت انتخاب‌شده */}
      {/* ========================================================= */}
      <CatalogLookbookModal
        catalog={selectedCatalog}
        isOpen={Boolean(selectedCatalog)}
        onClose={() => setSelectedCatalog(null)}
      />
    </section>
  );
};
