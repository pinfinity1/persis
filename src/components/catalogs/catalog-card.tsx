// src/components/catalogs/catalog-card.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/services/catalog.service";
import { CatalogViewerModal } from "./catalog-viewer-modal";

interface CatalogCardProps {
  catalog: CatalogItem;
}

function getSafeMediaUrl(
  media?: { url?: string | null } | string | null,
): string {
  if (!media) return "";
  const raw = typeof media === "object" ? media.url : media;
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return "";
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ catalog }) => {
  const t = useTranslations("Catalogs");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const coverUrl =
    getSafeMediaUrl(catalog.cover_image) || "/PersisQuartz-Red.png";
  const pdfUrl = getSafeMediaUrl(catalog.pdf_file);

  const typeTranslationKey =
    catalog.catalog_type &&
    ["full_catalog", "technical", "collection", "guide"].includes(
      catalog.catalog_type,
    )
      ? catalog.catalog_type
      : null;
  const typeLabel = typeTranslationKey ? t(typeTranslationKey) : null;

  return (
    <>
      <div className="group relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8 bg-card border border-border/70 hover:border-primary/50 transition-all duration-300 shadow-sm select-none">
        {/* قاب تصویر کاور کاتالوگ بدون کراپ شدن و با نسبت واقعی */}
        <div
          onClick={() => setIsViewerOpen(true)}
          className="relative w-48 sm:w-56 md:w-64 aspect-[1/1.414] shrink-0 bg-muted/20 border border-border/50 shadow-md overflow-hidden cursor-pointer group-hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src={coverUrl}
            alt={catalog.title || "Persis Quartz Catalog"}
            fill
            sizes="(max-width: 768px) 220px, 260px"
            className="object-contain p-1 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />

          {/* هاور ملایم دعوت به مشاهده */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-background/95 backdrop-blur-md px-3 py-1.5 text-xs text-foreground font-medium flex items-center gap-1.5 shadow-md">
              <Eye className="size-3.5 text-primary" />
              <span>{t("view")}</span>
            </span>
          </div>
        </div>

        {/* اطلاعات و توضیحات کاتالوگ */}
        <div className="flex-1 flex flex-col justify-between w-full space-y-4 text-start">
          <div className="space-y-3">
            {/* دسته‌بندی و سال انتشار */}
            <div className="flex items-center gap-2.5">
              {typeLabel && (
                <span className="text-[11px] font-medium text-primary tracking-wider uppercase">
                  {typeLabel}
                </span>
              )}
              {catalog.year && (
                <span className="text-xs text-muted-foreground font-mono">
                  • {catalog.year}
                </span>
              )}
              {catalog.file_size_mb && (
                <span className="text-xs text-muted-foreground font-mono">
                  • {t("fileSize", { size: catalog.file_size_mb })}
                </span>
              )}
            </div>

            {/* عنوان کاتالوگ */}
            <h2
              onClick={() => setIsViewerOpen(true)}
              className="text-xl sm:text-2xl font-light text-foreground group-hover:text-primary transition-colors cursor-pointer"
            >
              {catalog.title}
            </h2>

            {/* توضیحات واقعی کارفرما از CMS */}
            {catalog.description && (
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                {catalog.description}
              </p>
            )}
          </div>

          {/* دکمه‌های اقدام ساده، تمیز و استاندارد */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={() => setIsViewerOpen(true)}
              size="default"
              className="rounded-none h-10 px-5 text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 font-medium"
            >
              <Eye className="size-4" />
              <span>{t("view")}</span>
            </Button>

            {pdfUrl && (
              <Button
                asChild
                variant="outline"
                size="default"
                className="rounded-none h-10 px-5 text-xs tracking-wider uppercase border-border/80 hover:bg-muted text-foreground flex items-center gap-2"
              >
                <a
                  href={pdfUrl}
                  download={`${catalog.slug || "catalog"}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="size-4 text-muted-foreground" />
                  <span>{t("download")}</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* نمایشگر تمام‌صفحه فایل PDF کاتالوگ */}
      <CatalogViewerModal
        catalog={catalog}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};
