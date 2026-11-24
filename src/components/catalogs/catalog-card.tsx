// src/components/catalogs/catalog-card.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eye, Download, Maximize2, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogCoverMedia, CatalogItem } from "@/services/catalog.service";
import {
  CatalogPdfReader,
  getSafeCatalogMediaUrl,
} from "./catalog-pdf-reader";

interface CatalogCardProps {
  catalog: CatalogItem;
  priority?: boolean;
}

function resolveCoverProps(cover: CatalogCoverMedia | string | undefined) {
  if (!cover || typeof cover === "string") {
    const safe = getSafeCatalogMediaUrl(cover) || "/PersisQuartz-Red.png";
    return { url: safe, width: 1200, height: 800, alt: "Persis Quartz Catalog" };
  }

  const cardOrDesktop = cover.sizes?.desktop || cover.sizes?.card;
  const preferredUrl =
    getSafeCatalogMediaUrl(cardOrDesktop?.url) ||
    getSafeCatalogMediaUrl(cover.url) ||
    "/PersisQuartz-Red.png";

  return {
    url: preferredUrl,
    width: cardOrDesktop?.width || cover.width || 1200,
    height: cardOrDesktop?.height || cover.height || 800,
    alt: cover.alt || "Persis Quartz Catalog",
  };
}

export const CatalogCard: React.FC<CatalogCardProps> = ({
  catalog,
  priority = false,
}) => {
  const t = useTranslations("Catalogs");
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const cover = resolveCoverProps(catalog.cover_image);
  const pdfUrl = getSafeCatalogMediaUrl(catalog.pdf_file);

  const typeTranslationKey =
    catalog.catalog_type &&
    ["full_catalog", "technical", "collection", "guide"].includes(
      catalog.catalog_type,
    )
      ? catalog.catalog_type
      : null;
  const typeLabel = typeTranslationKey ? t(typeTranslationKey) : null;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: catalog.title, url });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <article className="group flex flex-col justify-between h-full bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 select-none overflow-hidden">
        {/* قاب کاور یکدست با نورپردازی هم‌رنگ خود کاور (بدون کراپ و بدون کادر سیاه اضافی) */}
        <div
          onClick={() => setIsReaderOpen(true)}
          className="relative aspect-[4/3] w-full bg-neutral-950 border-b border-border/40 overflow-hidden cursor-pointer flex items-center justify-center p-4 sm:p-5 group/stage"
        >
          {/* پس‌زمینه بلور و ملایم از خود کاور برای تطبیق طبیعی هر نسبت ابعادی */}
          <Image
            src={cover.url}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover scale-110 blur-2xl opacity-35 pointer-events-none select-none"
          />

          {/* تصویر اصلی کاور بدون هیچ‌گونه برش */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image
              src={cover.url}
              alt={catalog.title || cover.alt}
              width={cover.width}
              height={cover.height}
              priority={priority}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="w-auto max-w-full max-h-full h-auto object-contain shadow-[0_14px_36px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover/stage:scale-[1.03]"
            />
          </div>

          {/* برچسب سال و حجم فایل در گوشه‌های بالا */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
            {catalog.year ? (
              <span className="bg-neutral-950/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white tracking-wider">
                {catalog.year}
              </span>
            ) : (
              <span />
            )}

            {catalog.file_size_mb && (
              <span className="bg-neutral-950/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] text-neutral-200">
                {t("fileSize", { size: catalog.file_size_mb })}
              </span>
            )}
          </div>

          {/* دعوت ظریف به باز کردن تمام‌صفحه روی هاور */}
          <div className="absolute bottom-3 end-3 z-20 opacity-0 translate-y-1 group-hover/stage:opacity-100 group-hover/stage:translate-y-0 transition-all duration-300 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] text-white tracking-wide shadow-md">
              <Maximize2 className="size-3 text-primary" />
              <span>{t("previewFullscreen")}</span>
            </span>
          </div>
        </div>

        {/* بدنه کارت با چیدمان هم‌تراز */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5 text-start">
          <div className="space-y-2.5">
            {typeLabel && (
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-px w-4 bg-primary shrink-0 transition-all duration-300 group-hover:w-7"
                />
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary truncate">
                  {typeLabel}
                </span>
              </div>
            )}

            <h2
              onClick={() => setIsReaderOpen(true)}
              className="text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2 min-h-[3.25rem]"
            >
              {catalog.title}
            </h2>

            {catalog.description && (
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-2 min-h-[2.5rem]">
                {catalog.description}
              </p>
            )}
          </div>

          {/* ردیف متادیتا و دکمه‌های اقدام هم‌سطح */}
          <div className="space-y-3 pt-4 border-t border-border/30 mt-auto">
            {catalog.page_count && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("pagesCount", { count: catalog.page_count })}</span>
                <span className="font-mono">PDF</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsReaderOpen(true)}
                size="sm"
                className="flex-1 h-10 rounded-none text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 font-medium cursor-pointer"
              >
                <Eye className="size-3.5" />
                <span>{t("view")}</span>
              </Button>

              {pdfUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-none text-xs tracking-wider uppercase border-border/80 hover:border-foreground hover:bg-transparent text-foreground flex items-center justify-center gap-1.5"
                >
                  <a
                    href={pdfUrl}
                    download={`${catalog.slug || "catalog"}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                    <span>{t("download")}</span>
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="h-10 w-10 rounded-none border-border/60 hover:border-foreground hover:bg-transparent text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title={isCopied ? t("copied") : t("share")}
                aria-label={t("share")}
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Share2 className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </article>

      <CatalogPdfReader
        catalog={catalog}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
      />
    </>
  );
};
