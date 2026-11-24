// src/components/catalogs/catalog-hero-featured.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Download,
  Sparkles,
  Maximize2,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/services/catalog.service";
import { getSafeMediaUrl } from "@/lib/catalog-lookbook-data";
import { CatalogLookbookModal } from "./catalog-lookbook-modal";

interface CatalogHeroFeaturedProps {
  flagshipCatalog: CatalogItem;
}

export const CatalogHeroFeatured: React.FC<CatalogHeroFeaturedProps> = ({
  flagshipCatalog,
}) => {
  const t = useTranslations("Catalogs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const coverUrl =
    getSafeMediaUrl(flagshipCatalog.cover_image) || "/PersisQuartz-Red.png";
  const pdfUrl = getSafeMediaUrl(flagshipCatalog.pdf_file);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: flagshipCatalog.title,
          url,
        });
        return;
      } catch {
        // fallback to clipboard
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
      <section className="relative overflow-hidden border border-border/70 bg-card/60 backdrop-blur-md select-none transition-all duration-500 hover:border-primary/50 shadow-sm">
        {/* گرادینت پس‌زمینه لطیف لوکس */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-72 h-72 bg-neutral-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ستون چپ: اطلاعات ادیتوریال و تایپوگرافی */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            {/* بچ‌ها و وضعیت */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] sm:text-xs tracking-widest uppercase font-mono font-medium">
                <Sparkles className="size-3" />
                <span>{t("featuredTag")}</span>
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-mono border-s border-border/60 ps-2.5">
                {t("featuredEdition")}
              </span>
            </div>

            {/* تیتر شاخص */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-[1.15]">
                {flagshipCatalog.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
                {flagshipCatalog.description || t("heroSubtitle")}
              </p>
            </div>

            {/* گرید ویژگی‌های مهندسی اسلب‌ها */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-border/50 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  ابعاد اسلب‌ها
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  ۳۲۰ × ۱۶۰ cm
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  ضخامت استاندارد
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  ۲۰ و ۳۰ mm
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  تکنولوژی تولید
                </span>
                <span className="text-primary font-medium text-xs sm:text-sm font-mono">
                  Bretonstone®
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  خلوص کوارتز
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  ۹۳٪ سیلیس
                </span>
              </div>
            </div>

            {/* دکمه‌های اکشن لوکس */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="rounded-none h-12 px-6 text-xs sm:text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-transform active:scale-[0.99]"
              >
                <BookOpen className="size-4" />
                <span>{t("exploreLookbook")}</span>
              </Button>

              {pdfUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-none h-12 px-6 text-xs sm:text-sm tracking-wider uppercase border-border/80 hover:bg-muted text-foreground flex items-center justify-center gap-2"
                >
                  <a
                    href={pdfUrl}
                    download={`${flagshipCatalog.slug || "persis-quartz-catalog"}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="size-4 text-muted-foreground" />
                    <span>{t("downloadPrintPdf")}</span>
                    {flagshipCatalog.file_size_mb && (
                      <span className="text-[10px] text-muted-foreground font-mono ms-1">
                        ({flagshipCatalog.file_size_mb} MB)
                      </span>
                    )}
                  </a>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-none h-12 w-12 border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground hidden sm:flex shrink-0"
                title={t("shareSpread")}
              >
                {isCopied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Share2 className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* ستون راست: ماک‌آپ سه‌بعدی مجله و کاور ژورنال */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div
              onClick={() => setIsModalOpen(true)}
              className="group relative cursor-pointer w-60 sm:w-72 lg:w-80 aspect-[3/4] transition-all duration-700 ease-out"
            >
              {/* سایه عمقی زیر کتاب */}
              <div className="absolute -inset-2 bg-primary/15 rounded-none blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* عطف و استراکچر ۳ بعدی کتاب */}
              <div className="relative w-full h-full bg-neutral-900 border border-neutral-700/80 shadow-2xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                {/* خط عطف سمت راست/چپ بر اساس جهت */}
                <div className="absolute inset-y-0 start-0 w-3 bg-gradient-to-r from-black/60 to-transparent z-20 pointer-events-none" />

                <Image
                  src={coverUrl}
                  alt={flagshipCatalog.title}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* روکش تیره و دکمه باز کردن سریع */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-end">
                    <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-primary">
                      LOOKBOOK • 2026
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-mono block">
                      CLICK TO OPEN
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                      <span>{t("exploreLookbook")}</span>
                      <Maximize2 className="size-3 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* مودال ریدر اختصاصی */}
      <CatalogLookbookModal
        catalog={flagshipCatalog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
