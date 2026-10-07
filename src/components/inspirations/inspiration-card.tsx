"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { InspirationItemDTO } from "@/services/inspiration.service";

export const InspirationCard: React.FC<{ item: InspirationItemDTO }> = ({
  item,
}) => {
  const t = useTranslations("Inspirations");
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  // منطق نسبت تصویر ترکیبی (افقی ۱۶:۹ برای آشپزخانه/تجاری، عمودی ۴:۵ برای بقیه)
  const isWide =
    item.spaceType === "kitchen" || item.spaceType === "commercial";
  const aspectRatioClass = isWide
    ? "aspect-[4/3] sm:aspect-[16/9]"
    : "aspect-[4/5] sm:aspect-[3/4]";

  // دریافت اولین اسلب به‌کار‌رفته برای نمایش در حالت هاور
  const primaryProduct = item.hotspots[0]?.productCode || null;

  return (
    <div className="group relative flex flex-col bg-card/40 border border-border/40 hover:border-primary/50 transition-all duration-700 overflow-hidden">
      {/* 1. قاب تصویر با نسبت متغیر */}
      <div
        className={cn(
          "relative w-full bg-muted overflow-hidden",
          aspectRatioClass,
        )}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />

        {/* 2. پرده هاور لوکس تاریک (نمایش نام سبک و کد اسلب) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex flex-col items-center justify-center text-white z-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium border-b border-white/30 pb-2 mb-2">
            {item.style}
          </span>
          {primaryProduct && (
            <span className="text-xs sm:text-sm font-light tracking-wide flex items-center gap-2">
              <Search className="size-3.5" />
              {primaryProduct}
            </span>
          )}
        </div>

        {/* 3. هات‌اسپات‌های تعاملی (Shop the Look) */}
        {item.hotspots.map((spot) => (
          <div
            key={spot.id}
            style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            onMouseEnter={() => setActiveSpot(spot.id)}
            onMouseLeave={() => setActiveSpot(null)}
          >
            <div className="relative flex items-center justify-center size-6 cursor-pointer outline-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full size-2 bg-white shadow-lg border border-neutral-300" />
            </div>

            {/* پاپ‌آپ محصول در هاور */}
            {activeSpot === spot.id && spot.productSlug && (
              <div
                className={cn(
                  "absolute z-30 w-52 p-4 bg-background/95 backdrop-blur-md border border-border/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-auto",
                  spot.yPercent > 80 ? "bottom-full mb-3" : "top-full mt-3",
                  spot.xPercent > 80
                    ? "end-0"
                    : spot.xPercent < 20
                      ? "start-0"
                      : "-translate-x-1/2 start-1/2",
                )}
              >
                {spot.label && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1.5 font-light">
                    {spot.label}
                  </span>
                )}
                <h4 className="text-sm font-medium text-foreground truncate">
                  {spot.productTitle}
                </h4>
                {spot.productCode && (
                  <span className="text-[11px] text-primary font-mono block mt-1">
                    {spot.productCode}
                  </span>
                )}
                <Link
                  href={`/products/${spot.productSlug}`}
                  className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] uppercase tracking-widest text-primary hover:text-foreground transition-colors group/link"
                >
                  <span>{t("viewSlab")}</span>
                  <ArrowUpRight className="size-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. بخش اطلاعات و مودبرد متریال */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-6">
        <div>
          <h3 className="text-lg lg:text-xl font-medium text-foreground mb-3 leading-snug">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed text-justify">
              {item.description}
            </p>
          )}
        </div>

        {/* 5. مودبرد هارمونی متریال */}
        {item.pairings.length > 0 && (
          <div className="pt-5 border-t border-border/20">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium block mb-3">
              {t("materialPalette")}
            </span>
            <div className="flex flex-wrap gap-2">
              {item.pairings.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border border-border/40 text-[11px] text-foreground font-light shadow-sm"
                >
                  {p.colorHex && (
                    <span
                      className="size-3 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: p.colorHex }}
                    />
                  )}
                  <span>{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
