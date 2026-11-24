// src/components/catalogs/catalogs-directory-client.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/services/catalog.service";
import { CatalogCard } from "./catalog-card";

interface CatalogsDirectoryClientProps {
  initialCatalogs: CatalogItem[];
}

export const CatalogsDirectoryClient: React.FC<CatalogsDirectoryClientProps> = ({
  initialCatalogs,
}) => {
  const t = useTranslations("Catalogs");
  const [activeType, setActiveType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // شناسایی دسته‌بندی‌هایی که واقعاً دارای کاتالوگ هستند
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    initialCatalogs.forEach((c) => {
      if (c.catalog_type) types.add(c.catalog_type);
    });
    return Array.from(types);
  }, [initialCatalogs]);

  // فیلتر آنی در حافظه (<1ms)
  const filteredCatalogs = useMemo(() => {
    let result = initialCatalogs;

    if (activeType !== "all") {
      result = result.filter((item) => item.catalog_type === activeType);
    }

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

  const showFilterBar =
    initialCatalogs.length > 2 || availableTypes.length > 1;

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      {/* نوار فیلتر و جستجو تنها زمانی نمایش داده می‌شود که کاتالوگ‌های متنوع وجود داشته باشند */}
      {showFilterBar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          {availableTypes.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveType("all")}
                className={cn(
                  "px-3.5 py-1.5 text-xs tracking-wider uppercase font-medium transition-colors border rounded-none cursor-pointer",
                  activeType === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
                )}
              >
                {t("all")}
              </button>
              {availableTypes.map((type) => {
                const label = t.has(type) ? t(type) : type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={cn(
                      "px-3.5 py-1.5 text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-colors border rounded-none cursor-pointer",
                      activeType === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {initialCatalogs.length > 2 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="rounded-none ps-9 h-9 text-xs bg-background/60 border-border/70"
              />
            </div>
          )}
        </div>
      )}

      {/* گرید یکدست و منظم کارت‌های کاتالوگ در موبایل، تبلت و دسکتاپ */}
      {filteredCatalogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCatalogs.map((catalog, idx) => (
            <CatalogCard
              key={catalog.id}
              catalog={catalog}
              priority={idx < 3}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-16 text-center bg-card/50 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            {t("noCatalogsFound")}
          </p>
        </div>
      )}
    </div>
  );
};
