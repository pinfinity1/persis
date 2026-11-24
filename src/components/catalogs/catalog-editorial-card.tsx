// src/components/catalogs/catalog-editorial-card.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/services/catalog.service";
import { getSafeMediaUrl } from "@/lib/catalog-lookbook-data";

interface CatalogEditorialCardProps {
  catalog: CatalogItem;
  onOpenLookbook: (catalog: CatalogItem) => void;
}

const TYPE_TRANSLATION_KEYS: Record<string, string> = {
  full_catalog: "typeFull",
  technical: "typeTechnical",
  collection: "typeCollection",
  guide: "typeGuide",
};

export const CatalogEditorialCard: React.FC<CatalogEditorialCardProps> = ({
  catalog,
  onOpenLookbook,
}) => {
  const t = useTranslations("Catalogs");

  const coverUrl =
    getSafeMediaUrl(catalog.cover_image) || "/PersisQuartz-Red.png";
  const pdfUrl = getSafeMediaUrl(catalog.pdf_file);

  const typeKey = TYPE_TRANSLATION_KEYS[catalog.catalog_type];
  const typeLabel = typeKey ? t(typeKey) : catalog.catalog_type;

  return (
    <article className="group relative flex flex-col bg-card border border-border/70 hover:border-primary/60 transition-all duration-500 overflow-hidden select-none shadow-xs hover:shadow-md">
      {/* قاب کاور به سبک مونوگراف معماری */}
      <div
        onClick={() => onOpenLookbook(catalog)}
        className="relative w-full aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-muted/30 cursor-pointer"
      >
        {/* خط عطف ظریف کتاب در سمت شروع */}
        <div className="absolute inset-y-0 start-0 w-2 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />

        <Image
          src={coverUrl}
          alt={catalog.title || "Persis Quartz Publication"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* لایه اطلاعات بالای عکس */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <span className="bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border/60 text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-primary font-medium">
            {catalog.year || new Date().getFullYear()}
          </span>

          {catalog.file_size_mb && (
            <span className="bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border/60 text-[9px] sm:text-[10px] font-mono text-muted-foreground">
              {catalog.file_size_mb} MB
            </span>
          )}
        </div>

        {/* روکش هاور با دعوت به باز کردن */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="bg-background/95 backdrop-blur-md px-3.5 py-1.5 border border-border/80 text-xs text-foreground font-medium flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <BookOpen className="size-3.5 text-primary" />
            <span>{t("view")}</span>
          </div>
        </div>
      </div>

      {/* محتوا و مشخصات ادیتوریال */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between min-w-0 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-primary font-mono block truncate">
            {typeLabel}
          </span>
          <h3
            onClick={() => onOpenLookbook(catalog)}
            className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {catalog.title}
          </h3>
          {catalog.description && (
            <p className="text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed pt-0.5">
              {catalog.description}
            </p>
          )}
        </div>

        {/* متادیتا و دکمه‌های اقدام دوگانه */}
        <div className="space-y-2.5 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>
              {catalog.page_count
                ? t("pagesCount", { count: catalog.page_count })
                : "EDITION 2026"}
            </span>
            <span className="uppercase text-primary font-medium">BRETON TECH</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* دکمه کاوش آنلاین در ژورنال */}
            <Button
              onClick={() => onOpenLookbook(catalog)}
              size="sm"
              className="rounded-none text-[11px] sm:text-xs h-8 sm:h-9 px-2 tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1 font-medium"
            >
              <BookOpen className="size-3 sm:size-3.5" />
              <span>{t("view")}</span>
            </Button>

            {/* دکمه دانلود PDF مستقیم */}
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={!pdfUrl}
              className="rounded-none text-[11px] sm:text-xs h-8 sm:h-9 px-2 tracking-wider uppercase border-border/80 hover:bg-muted text-foreground flex items-center justify-center gap-1"
            >
              <a
                href={pdfUrl || "#"}
                download={`${catalog.slug || "catalog"}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="size-3 sm:size-3.5 text-muted-foreground" />
                <span>{t("download")}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
