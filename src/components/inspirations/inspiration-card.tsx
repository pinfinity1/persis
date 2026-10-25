// src/components/inspirations/inspiration-card.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { InspirationItemDTO } from "@/services/inspiration.service";

export const InspirationCard: React.FC<{ item: InspirationItemDTO }> = ({
  item,
}) => {
  const t = useTranslations("Inspirations");
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  const isWide =
    item.spaceType === "kitchen" || item.spaceType === "commercial";
  const aspectRatioClass = isWide
    ? "aspect-[16/10] sm:aspect-[16/9]"
    : "aspect-[4/3] sm:aspect-[3/4]";

  const hasDescription = Boolean(item.description);

  return (
    <div className="group relative flex flex-col bg-card border border-border/50 hover:border-primary/60 transition-all duration-300 select-none">
      {/* ۱. قاب تصویر فضا */}
      <div
        className={cn(
          "relative w-full bg-muted/30 overflow-hidden",
          aspectRatioClass,
        )}
        onClick={() => setActiveSpot(null)}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* برچسب سبک فضا */}
        <div className="absolute top-3.5 start-3.5 z-10 pointer-events-none">
          <span className="px-2.5 py-1 bg-black/65 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-widest text-white/90 font-medium">
            {item.style}
          </span>
        </div>

        {/* ۲. هات‌اسپات‌های تعاملی با کنترل محدوده امن کادر */}
        {item.hotspots.map((spot) => {
          const isActive = activeSpot === spot.id;
          const openToBottom = spot.yPercent < 60;
          const alignEnd = spot.xPercent > 65;
          const alignStart = spot.xPercent < 35;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              onMouseEnter={() => setActiveSpot(spot.id)}
              onMouseLeave={() => setActiveSpot(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveSpot((prev) => (prev === spot.id ? null : spot.id))
                }
                className="relative flex items-center justify-center size-8 cursor-pointer focus:outline-none touch-manipulation group/btn"
                aria-label={spot.label || "Slab Hotspot"}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-60" />
                <span className="relative inline-flex rounded-full size-3 bg-white shadow-md border-2 border-primary transition-transform group-hover/btn:scale-125" />
              </button>

              {/* پاپ‌آپ متصل به نقطه بدون خروج از کادر */}
              {isActive && spot.productSlug && (
                <div
                  className={cn(
                    "absolute z-30 w-48 sm:w-56 p-3 bg-background/95 backdrop-blur-md border border-border/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-auto",
                    openToBottom ? "top-full mt-2" : "bottom-full mb-2",
                    alignStart
                      ? "start-0 translate-x-0"
                      : alignEnd
                        ? "end-0 translate-x-0"
                        : "start-1/2 -translate-x-1/2",
                  )}
                >
                  {spot.label && (
                    <span className="text-[10px] text-muted-foreground block mb-1 font-light leading-tight truncate">
                      {spot.label}
                    </span>
                  )}
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {spot.productTitle}
                    </h4>
                    {spot.productCode && (
                      <span className="text-[11px] text-primary font-mono shrink-0">
                        {spot.productCode}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/products/${spot.productSlug}`}
                    className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] uppercase tracking-wider text-primary hover:text-foreground transition-colors group/link"
                  >
                    <span>{t("viewSlab")}</span>
                    <ArrowUpRight className="size-3 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ۳. بدنه متن و توضیحات معمارانه */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-foreground leading-snug">
            {item.title}
          </h3>

          {hasDescription ? (
            <div
              dir="auto"
              className="text-start leading-relaxed [unicode-bidi:isolate]
                [&_p]:text-muted-foreground [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-[2.1] sm:[&_p]:leading-[2.3] [&_p]:font-light [&_p]:mb-2.5
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_b]:font-semibold [&_b]:text-foreground
                [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
                [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:my-2 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:my-2 [&_ol]:space-y-1
                [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-muted-foreground"
            >
              {typeof item.description === "string" ? (
                <p>{item.description}</p>
              ) : (
                <RichText
                  data={
                    item.description as React.ComponentProps<
                      typeof RichText
                    >["data"]
                  }
                />
              )}
            </div>
          ) : null}
        </div>

        {/* ۴. پالت هارمونی متریال و رنگ */}
        {item.pairings && item.pairings.length > 0 && (
          <div className="pt-4 border-t border-border/30 mt-auto">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2.5 font-medium">
              {t("materialPalette")}
            </span>
            <div className="flex flex-wrap gap-2">
              {item.pairings.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/30 border border-border/50 text-[11px] text-foreground font-light shadow-2xs"
                >
                  {p.colorHex ? (
                    <span
                      className="size-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: p.colorHex }}
                    />
                  ) : (
                    <span className="size-1.5 rounded-full bg-primary/70 shrink-0" />
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
