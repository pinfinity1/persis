"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, MapPin, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProvinceOption } from "@/services/dealer.service";

interface DealerFilterProps {
  provinces: ProvinceOption[];
}

export const DealerFilterClient: React.FC<DealerFilterProps> = ({
  provinces,
}) => {
  const t = useTranslations("Dealers");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProvinceSlug = searchParams.get("province") || "all";
  const selectedProvince = provinces.find(
    (p) => p.slug === currentProvinceSlug,
  );

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

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("province");
    } else {
      params.set("province", slug);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setIsOpen(false);
    setSearchQuery("");
  };

  // جستجوی پیشرفته: سرچ همزمان در لیبل جاری، کلمه فارسی، کلمه انگلیسی و اسلاگ
  const filteredProvinces = provinces.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      p.label.toLowerCase().includes(query) ||
      p.fa.includes(query) ||
      p.en.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className={`relative w-full md:w-56 ${isPending ? "opacity-50" : ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pb-2 border-b border-border/60 hover:border-primary transition-colors outline-none group cursor-pointer"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:-translate-y-0.5" />
          <span className="text-sm font-light text-foreground truncate">
            {currentProvinceSlug === "all"
              ? t("allProvinces")
              : selectedProvince?.label || currentProvinceSlug}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 w-full mt-1 bg-background border border-border/40 shadow-2xl z-50 rounded-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1 border-b border-border/30 bg-muted/10">
            <div className="relative flex items-center">
              <Search className="absolute start-3 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("searchProvince")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 ps-9 border-transparent shadow-none focus-visible:ring-0 text-xs bg-transparent"
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto py-1 scrollbar-none">
            <li
              onClick={() => handleSelect("all")}
              className={`px-4 py-3 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                currentProvinceSlug === "all"
                  ? "bg-primary/5 text-primary font-medium"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <span>{t("allProvinces")}</span>
              {currentProvinceSlug === "all" && (
                <Check className="h-3.5 w-3.5" />
              )}
            </li>

            {filteredProvinces.length === 0 ? (
              <li className="px-4 py-4 text-xs text-muted-foreground text-center">
                {t("noResults")}
              </li>
            ) : (
              filteredProvinces.map((prov) => (
                <li
                  key={prov.slug}
                  onClick={() => handleSelect(prov.slug)}
                  className={`px-4 py-3 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    currentProvinceSlug === prov.slug
                      ? "bg-primary/5 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>{prov.label}</span>
                  {currentProvinceSlug === prov.slug && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
