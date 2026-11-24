"use client";

import React, { useState, useRef, useEffect, useMemo, useTransition } from "react";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Search, MapPin, ChevronDown, Check, X, RotateCcw } from "lucide-react";
import { DealerCard } from "@/components/dealers/dealer-card";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";
import type { DealerItem, ProvinceOption } from "@/services/dealer.service";

interface DealersDirectoryClientProps {
  initialDealers: DealerItem[];
  provinces: ProvinceOption[];
  initialProvince?: string;
  initialSearch?: string;
}

export const DealersDirectoryClient: React.FC<DealersDirectoryClientProps> = ({
  initialDealers,
  provinces,
  initialProvince = "all",
  initialSearch = "",
}) => {
  const t = useTranslations("Dealers");
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [selectedProvince, setSelectedProvince] = useState<string>(
    initialProvince || "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");
  const [dropdownSearch, setDropdownSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بستن دراپ‌داون با کلیک به بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // هماهنگ‌سازی URL با State جاری بدون رفرش صفحه و بدون پرش (Zero Layout Shift)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (selectedProvince && selectedProvince !== "all") {
      params.set("province", selectedProvince);
    } else {
      params.delete("province");
    }

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    const newQuery = params.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

    window.history.replaceState(null, "", newUrl);
  }, [selectedProvince, searchQuery, pathname]);

  // استان فعال انتخاب‌شده
  const activeProvinceOption = useMemo(() => {
    if (!selectedProvince || selectedProvince === "all") return null;
    const lower = selectedProvince.toLowerCase();
    return provinces.find(
      (p) =>
        p.slug === lower ||
        p.fa === selectedProvince ||
        p.center === selectedProvince,
    );
  }, [provinces, selectedProvince]);

  // فیلتر داخلی لیست دراپ‌داون
  const filteredDropdownProvinces = useMemo(() => {
    if (!dropdownSearch.trim()) return provinces;
    const q = dropdownSearch.toLowerCase().trim();
    return provinces.filter((p) => {
      return (
        p.label.toLowerCase().includes(q) ||
        p.fa.includes(q) ||
        p.en.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.center && p.center.includes(q))
      );
    });
  }, [provinces, dropdownSearch]);

  // فیلتراسیون آنی و پرسرعت (<1ms)
  const filteredDealers = useMemo(() => {
    let result = initialDealers;

    // ۱. فیلتر بر اساس استان یا شهر
    if (selectedProvince && selectedProvince !== "all") {
      const lower = selectedProvince.toLowerCase();
      const match = IRAN_PROVINCES.find(
        (p) =>
          p.slug === lower ||
          p.fa === selectedProvince ||
          p.en.toLowerCase() === lower ||
          p.center === selectedProvince,
      );
      const targetSlug = match ? match.slug : lower;
      result = result.filter((d) => d.province === targetSlug);
    }

    // ۲. فیلتر بر اساس متن جستجو (شهر، عنوان، آدرس، تلفن)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qDigits = q.replace(/\D/g, "");

      result = result.filter((d) => {
        const titleMatch = d.title ? d.title.toLowerCase().includes(q) : false;
        const cityMatch = d.city ? d.city.toLowerCase().includes(q) : false;
        const addressMatch = d.address ? d.address.toLowerCase().includes(q) : false;
        const phoneMatch =
          qDigits && d.phone ? d.phone.replace(/\D/g, "").includes(qDigits) : false;
        const provinceMatch = d.province
          ? d.province.toLowerCase().includes(q)
          : false;

        return titleMatch || cityMatch || addressMatch || phoneMatch || provinceMatch;
      });
    }

    return result;
  }, [initialDealers, selectedProvince, searchQuery]);

  const handleSelectProvince = (slug: string) => {
    startTransition(() => {
      setSelectedProvince(slug);
    });
    setIsOpen(false);
    setDropdownSearch("");
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setSelectedProvince("all");
      setSearchQuery("");
      setDropdownSearch("");
    });
  };

  const selectedDisplayLabel = useMemo(() => {
    if (!activeProvinceOption) return t("allProvinces");
    if (
      activeProvinceOption.center &&
      activeProvinceOption.center !== activeProvinceOption.label
    ) {
      return `${activeProvinceOption.label} (${activeProvinceOption.center})`;
    }
    return activeProvinceOption.label;
  }, [activeProvinceOption, t]);

  const isFiltered = selectedProvince !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* نوار مینیمال فیلتر و جستجو بر اساس زبان طراحی Caesarstone / Breton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-3 border-b border-border/30">
        {/* جستجوی متنی مینیمال */}
        <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
          <Search className="absolute start-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 ps-6 pe-6 bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* فیلتر شهر/استان و وضعیت فعال */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* شمارنده و دکمه ریست مینیمال در صورت فعال بودن فیلتر */}
          {isFiltered && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-light">
              <span>{t("activeDealersCount", { count: filteredDealers.length })}</span>
              <span className="text-border/60">•</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>{t("clearFilter")}</span>
              </button>
            </div>
          )}

          {/* انتخابگر دراپ‌داون مینیمال با خط زیرین ظریف */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 pb-1 border-b border-border/60 hover:border-primary transition-colors outline-none cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 transition-transform group-hover:-translate-y-0.5" />
              <span className="text-xs font-light text-foreground max-w-[160px] sm:max-w-[190px] truncate">
                {selectedDisplayLabel}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* منوی بازشو دراپ‌داون با عمق و شیشه‌ای لوکس */}
            {isOpen && (
              <div className="absolute top-full end-0 sm:end-0 mt-2 w-64 bg-background/95 backdrop-blur-md border border-border/40 shadow-2xl z-50 rounded-none overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* جستجوی داخلی دراپ‌داون */}
                <div className="p-2 border-b border-border/20 bg-muted/10">
                  <div className="relative flex items-center">
                    <Search className="absolute start-2.5 h-3 w-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t("searchProvince")}
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      className="w-full h-8 ps-7 pe-2 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 border-none outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* لیست گزینه‌ها */}
                <ul className="max-h-60 overflow-y-auto py-1 scrollbar-none text-xs">
                  {/* همه استان‌ها */}
                  <li
                    onClick={() => handleSelectProvince("all")}
                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                      selectedProvince === "all"
                        ? "bg-primary/5 text-primary font-medium"
                        : "hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span>{t("allProvinces")}</span>
                    {selectedProvince === "all" && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </li>

                  {/* گزینه‌های استان/شهر */}
                  {filteredDropdownProvinces.length === 0 ? (
                    <li className="px-4 py-4 text-xs text-muted-foreground text-center">
                      {t("noResults")}
                    </li>
                  ) : (
                    filteredDropdownProvinces.map((prov) => {
                      const displayTitle =
                        prov.center && prov.center !== prov.label
                          ? `${prov.label} (${prov.center})`
                          : prov.label;
                      const isSelected = selectedProvince === prov.slug;

                      return (
                        <li
                          key={prov.slug}
                          onClick={() => handleSelectProvince(prov.slug)}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-primary/5 text-primary font-medium"
                              : "hover:bg-muted/40 text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{displayTitle}</span>
                            {typeof prov.dealerCount === "number" && (
                              <span className="text-[10px] text-muted-foreground font-light">
                                ({prov.dealerCount})
                              </span>
                            )}
                          </span>
                          {isSelected && (
                            <Check className="h-3 w-3 text-primary shrink-0" />
                          )}
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* شبکه نمایش کارت‌های نمایندگی‌ها (کاملاً ریسپانسیو) */}
      {filteredDealers.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </section>
      ) : (
        <div className="py-20 text-center space-y-4 border border-border/20 bg-card/20">
          <p className="text-sm font-medium text-foreground">
            {t("noDealersFound")}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-primary underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}
    </div>
  );
};
