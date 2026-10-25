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
    <div className="group relative flex flex-col bg-card border border-border/40 hover:border-primary/50 transition-all duration-500 select-none shadow-xs">
      {/* ۱. قاب تصویر فضا */}
      <div
        className={cn(
          "relative w-full bg-neutral-950 overflow-hidden",
          aspectRatioClass,
        )}
        onClick={() => setActiveSpot(null)}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
        />

        {/* برچسب سبک فضا */}
        <div className="absolute top-4 start-4 z-10 pointer-events-none">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/90 font-medium">
            {item.style}
          </span>
        </div>

        {/* ۲. هات‌اسپات‌های متصل به پین */}
        {item.hotspots.map((spot) => {
          const isActive = activeSpot === spot.id;

          // تعیین قرارگیری بالا یا پایین پین بر اساس موقعیت عمودی
          const placeBelow = spot.yPercent < 35;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
              onMouseEnter={() => setActiveSpot(spot.id)}
              onMouseLeave={() => setActiveSpot(null)}
              onClick={(e) => e.stopPropagation()}
            >
              {/* دکمه پین مرکزی با انیمیشن پالس */}
              <button
                type="button"
                onClick={() =>
                  setActiveSpot((prev) => (prev === spot.id ? null : spot.id))
                }
                className="relative flex items-center justify-center size-8 cursor-pointer focus:outline-none touch-manipulation group/pin"
                aria-label={spot.label || "Slab Hotspot"}
              >
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary/40 opacity-75" />
                <span className="relative flex items-center justify-center size-5 rounded-full bg-black/60 backdrop-blur-xs border border-white/60 shadow-lg transition-transform duration-300 group-hover/pin:scale-110">
                  <span className="size-2 rounded-full bg-primary ring-2 ring-white" />
                </span>
              </button>

              {/* پاپ‌آپ چسبیده و هم‌محور دقیقاً روی نقطه */}
              {isActive && spot.productSlug && (
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 z-30 w-44 sm:w-48 p-2.5 bg-neutral-950/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white pointer-events-auto animate-in fade-in zoom-in-95 duration-150",
                    placeBelow ? "top-full mt-2" : "bottom-full mb-2",
                  )}
                >
                  {/* فلش اشاره‌گر کوچک رو به پین */}
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 size-2 bg-neutral-950/90 border-white/15 rotate-45",
                      placeBelow
                        ? "-top-1 border-t border-s"
                        : "-bottom-1 border-b border-e",
                    )}
                  />

                  {spot.label && (
                    <span className="text-[10px] text-neutral-400 block mb-1 font-light truncate text-start">
                      {spot.label}
                    </span>
                  )}

                  <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-white/10">
                    <h4 className="text-xs font-medium text-white truncate">
                      {spot.productTitle}
                    </h4>
                    {spot.productCode && (
                      <span className="text-[10px] text-primary font-mono tracking-wider bg-primary/10 px-1 py-0.5 border border-primary/30 shrink-0">
                        {spot.productCode}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/products/${spot.productSlug}`}
                    className="mt-1.5 pt-0.5 flex items-center justify-between text-[10px] font-medium tracking-wider text-neutral-300 hover:text-primary transition-colors group/link"
                  >
                    <span>{t("viewSlab")}</span>
                    <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-primary" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ۳. بدنه محتوا و متون با استایل کلاس persis-prose */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-light text-foreground leading-snug tracking-tight">
            {item.title}
          </h3>

          {hasDescription ? (
            <div
              dir="auto"
              className="persis-prose text-neutral-600 dark:text-neutral-400"
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

        {/* ۴. پالت هارمونی متریال و رنگ معمارانه */}
        {item.pairings && item.pairings.length > 0 && (
          <div className="pt-5 border-t border-border/30 mt-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3 font-medium">
              {t("materialPalette")}
            </span>
            <div className="flex flex-wrap gap-2">
              {item.pairings.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 border border-border/40 text-[11px] text-foreground font-light hover:border-primary/40 transition-colors"
                >
                  {p.colorHex ? (
                    <span
                      className="size-2.5 rounded-full border border-black/20 shrink-0 shadow-xs"
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
