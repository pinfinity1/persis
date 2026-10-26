// src/components/inspirations/inspiration-card.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, X, Sparkles, Layers, Box } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { InspirationItemDTO } from "@/services/inspiration.service";

export const InspirationCard: React.FC<{ item: InspirationItemDTO }> = ({
  item,
}) => {
  const t = useTranslations("Inspirations");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hasDescription = Boolean(item.description);

  const isWide =
    item.spaceType === "kitchen" || item.spaceType === "commercial";
  const aspectRatioClass = isWide
    ? "aspect-[16/10] sm:aspect-[16/9]"
    : "aspect-[4/3] sm:aspect-[3/4]";

  const handleMouseEnterSpot = (id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveSpot(id);
  };

  const handleMouseLeaveSpot = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveSpot(null);
    }, 200);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* ۱. کارت مینیمال و لوکس در صفحه لیست گالری ایده‌ها          */}
      {/* ========================================================= */}
      <div
        onClick={() => setIsDialogOpen(true)}
        className="group relative flex flex-col bg-card border border-border/40 hover:border-primary/60 transition-all duration-500 cursor-pointer overflow-hidden shadow-xs hover:shadow-xl select-none"
      >
        {/* قاب تصویر اصلی */}
        <div
          className={cn(
            "relative w-full bg-neutral-950 overflow-hidden",
            aspectRatioClass,
          )}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* لایه تیره گرادینت برای خوانایی متون */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* پلاک سبک معماری در بالا */}
          <div className="absolute top-4 start-4 z-10">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/90 font-medium">
              {item.style}
            </span>
          </div>

          {/* تعداد اسلب‌های به‌کاررفته در تصویر */}
          {item.hotspots.length > 0 && (
            <div className="absolute top-4 end-4 z-10">
              <span className="px-2.5 py-1 bg-primary/80 backdrop-blur-md text-[10px] text-primary-foreground font-mono font-medium flex items-center gap-1.5 shadow-sm">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                <span>{item.hotspots.length} اسلب</span>
              </span>
            </div>
          )}

          {/* عنوان شناور روی عکس در پایین */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10 flex items-end justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-light text-white tracking-tight leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-neutral-300 font-light tracking-wide flex items-center gap-1.5 opacity-90">
                <Sparkles className="size-3 text-primary shrink-0" />
                <span>مشاهده جزئیات فضا و متریال‌ها</span>
              </p>
            </div>

            <div className="size-8 sm:size-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* پالت هارمونی رنگ و متریال در نوار زیرین کارت */}
        {item.pairings && item.pairings.length > 0 && (
          <div className="px-5 py-3.5 bg-card border-t border-border/30 flex items-center justify-between gap-3 overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium shrink-0">
              {t("materialPalette")}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {item.pairings.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 border border-border/40 text-[10px] text-foreground font-light shrink-0"
                >
                  {p.colorHex ? (
                    <span
                      className="size-2 rounded-full border border-black/20 shrink-0 shadow-2xs"
                      style={{ backgroundColor: p.colorHex }}
                    />
                  ) : (
                    <span className="size-1.5 rounded-full bg-primary/70 shrink-0" />
                  )}
                  <span className="truncate max-w-[100px]">{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ۲. دیالوگ سینمایی معمارانه (Immersive Architectural Modal)  */}
      {/* ========================================================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="p-0 max-w-6xl w-[96vw] max-h-[92vh] sm:max-h-[88vh] bg-neutral-950 text-white border border-white/15 overflow-hidden flex flex-col rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* هدر بالایی دیالوگ */}
          <div className="px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-5 bg-primary shrink-0" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
                {item.style} • {item.spaceType.toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* بدنه دو ستونه دیالوگ (اسپلیت اسکرین) */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* ستون راست / تعاملی عکس با هات‌اسپات‌ها (۷ ستون در دسکتاپ) */}
            <div
              className="lg:col-span-7 relative bg-neutral-900 min-h-[380px] sm:min-h-[460px] lg:min-h-full flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-e border-white/10"
              onClick={() => setActiveSpot(null)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />

              {/* هات‌اسپات‌های پین‌شده روی تصویر */}
              {item.hotspots.map((spot) => {
                const isActive = activeSpot === spot.id;
                const placeBelow = spot.yPercent < 45;

                return (
                  <div
                    key={spot.id}
                    style={{
                      left: `${spot.xPercent}%`,
                      top: `${spot.yPercent}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                    onMouseEnter={() => handleMouseEnterSpot(spot.id)}
                    onMouseLeave={handleMouseLeaveSpot}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* دکمه پین مرکزی با انیمیشن پالس */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSpot((prev) =>
                          prev === spot.id ? null : spot.id,
                        )
                      }
                      className="relative flex items-center justify-center size-9 cursor-pointer focus:outline-none touch-manipulation group/pin"
                      aria-label={spot.label || "Slab Hotspot"}
                    >
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary/50 opacity-75" />
                      <span className="relative flex items-center justify-center size-5 rounded-full bg-black/80 backdrop-blur-xs border border-white/70 shadow-lg transition-transform duration-300 group-hover/pin:scale-110">
                        <span className="size-2 rounded-full bg-primary ring-2 ring-white" />
                      </span>
                    </button>

                    {/* پاپ‌اور متصل با پل ایمن */}
                    {isActive && spot.productSlug && (
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 z-30 pointer-events-auto",
                          placeBelow ? "top-full pt-2" : "bottom-full pb-2",
                        )}
                        onMouseEnter={() => handleMouseEnterSpot(spot.id)}
                        onMouseLeave={handleMouseLeaveSpot}
                      >
                        <div className="relative w-48 sm:w-52 p-3 bg-neutral-950/95 backdrop-blur-xl border border-white/20 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150">
                          <div
                            className={cn(
                              "absolute left-1/2 -translate-x-1/2 size-2 bg-neutral-950 border-white/20 rotate-45 pointer-events-none",
                              placeBelow
                                ? "-top-1 border-t border-s"
                                : "-bottom-1 border-b border-e",
                            )}
                          />

                          {spot.label && (
                            <span className="text-[10px] text-neutral-400 block mb-1 font-light leading-tight truncate text-start">
                              {spot.label}
                            </span>
                          )}

                          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/10">
                            <h4 className="text-xs sm:text-sm font-medium text-white truncate">
                              {spot.productTitle}
                            </h4>
                            {spot.productCode && (
                              <span className="text-[10px] text-primary font-mono tracking-wider bg-primary/10 px-1.5 py-0.5 border border-primary/30 shrink-0">
                                {spot.productCode}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/products/${spot.productSlug}`}
                            className="mt-2 flex items-center justify-between text-[11px] font-medium tracking-wider text-neutral-300 hover:text-primary transition-colors group/link cursor-pointer"
                          >
                            <span>{t("viewSlab")}</span>
                            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-primary" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ستون چپ / محتوای معماری و لیست سنگ‌ها (۵ ستون در دسکتاپ) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto space-y-8 bg-neutral-950">
              <div className="space-y-6">
                <DialogTitle className="text-xl sm:text-2xl font-light text-white leading-snug tracking-tight text-start">
                  {item.title}
                </DialogTitle>

                {/* شرح کامل ایده معماری با استایل یکپارچه persis-prose */}
                {hasDescription ? (
                  <div
                    dir="auto"
                    className="persis-prose text-neutral-300 text-start leading-relaxed text-xs sm:text-sm"
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

                {/* لیست اسلب‌های به‌کاررفته در این فضا با لینک مستقیم */}
                {item.hotspots.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block font-medium flex items-center gap-2">
                      <Layers className="size-3.5 text-primary" />
                      <span>اسلب‌های طراحی‌شده در این فضا</span>
                    </span>

                    <div className="space-y-2">
                      {item.hotspots.map((spot) => (
                        <div
                          key={spot.id}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-medium text-white block">
                              {spot.productTitle}
                            </span>
                            {spot.label && (
                              <span className="text-[10px] text-neutral-400 font-light block">
                                {spot.label}
                              </span>
                            )}
                          </div>

                          {spot.productSlug && (
                            <Link
                              href={`/products/${spot.productSlug}`}
                              className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all"
                            >
                              <span>{t("viewSlab")}</span>
                              <ArrowUpRight className="size-3" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* پالت هارمونی متریال و رنگ مکمل */}
              {item.pairings && item.pairings.length > 0 && (
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-medium flex items-center gap-2">
                    <Box className="size-3.5 text-primary" />
                    <span>{t("materialPalette")}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.pairings.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-neutral-200 font-light"
                      >
                        {p.colorHex ? (
                          <span
                            className="size-2.5 rounded-full border border-black/30 shrink-0 shadow-xs"
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
        </DialogContent>
      </Dialog>
    </>
  );
};
