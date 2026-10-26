// src/components/inspirations/inspiration-card.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, X } from "lucide-react";
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

  // نسبت ۱۶ به ۱۰ برای کادر اولیه در صفحه گالری
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
      {/* ۱. کارت صفحه گالری: مینیمال، بدون اسکیل، با پالت رپ‌شده      */}
      {/* ========================================================= */}
      <div
        onClick={() => setIsDialogOpen(true)}
        className="group relative flex flex-col bg-card border border-border/50 hover:border-foreground/30 transition-colors duration-300 cursor-pointer overflow-hidden select-none"
      >
        {/* قاب تصویر فضا */}
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
            className="object-cover"
          />

          {/* گرادینت ثابت و تاریک در پایین عکس برای وضوح عنوان */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* تگ سبک معماری فضا در گوشه بالا */}
          <div className="absolute top-4 start-4 z-10 pointer-events-none">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/90 font-medium">
              {item.style}
            </span>
          </div>

          {/* عنوان فضا در پایین تصویر */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10">
            <h3 className="text-base sm:text-lg lg:text-xl font-light text-white tracking-tight leading-snug">
              {item.title}
            </h3>
          </div>
        </div>

        {/* پالت متریال در نوار زیرین (چندخطی تمیز بدون اسکرول بار) */}
        {item.pairings && item.pairings.length > 0 && (
          <div className="p-4 sm:p-5 bg-card border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium shrink-0">
              {t("materialPalette")}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {item.pairings.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 border border-border/40 text-[11px] text-foreground font-light"
                >
                  {p.colorHex ? (
                    <span
                      className="size-2 rounded-full border border-black/20 shrink-0"
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

      {/* ========================================================= */}
      {/* ۲. دیالوگ سینمایی بزرگ دسکتاپ و ریسپانسیو موبایل            */}
      {/* ========================================================= */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="p-0 !max-w-[94vw] !w-[94vw] h-[90vh] max-h-[90vh] bg-neutral-950 text-white border border-white/15 overflow-hidden flex flex-col rounded-none shadow-2xl sm:!max-w-[94vw]"
        >
          {/* هدر مینیمال بالای مودال */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-neutral-950 shrink-0 z-30">
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
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* بدنه دو ستونه (اسپلیت اسکرین وسیع) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden min-h-0">
            {/* ستون عکس با هات‌اسپات‌ها (۸ ستون در دسکتاپ = ۶۶٪ کل عرض) */}
            <div
              className="lg:col-span-8 relative bg-neutral-900 w-full h-[50vh] sm:h-[60vh] lg:h-full overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-e border-white/10"
              onClick={() => setActiveSpot(null)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 68vw"
                className="object-cover"
                priority
              />

              {/* نقاط تعاملی هات‌اسپات */}
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
                    {/* پین شیشه‌ای مدرن */}
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
                      <span className="relative flex items-center justify-center size-5 rounded-full bg-black/80 backdrop-blur-xs border border-white/70 shadow-lg">
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
                            <ArrowUpRight className="size-3.5 text-primary" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ستون محتوا و مشخصات متریال (۴ ستون در دسکتاپ = ۳۴٪ عرض) */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-8 bg-neutral-950">
              <div className="space-y-6">
                <DialogTitle className="text-xl sm:text-2xl font-light text-white leading-snug tracking-tight text-start">
                  {item.title}
                </DialogTitle>

                {/* شرح معماری فضا با کلاس persis-prose */}
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

                {/* لیست اختصاصی اسلب‌های این فضا */}
                {item.hotspots.length > 0 && (
                  <div className="space-y-3 pt-5 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block font-medium">
                      اسلب‌های استفاده‌شده
                    </span>

                    <div className="space-y-2">
                      {item.hotspots.map((spot) => (
                        <div
                          key={spot.id}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10"
                        >
                          <div className="space-y-0.5 min-w-0 pe-2">
                            <span className="text-xs font-medium text-white block truncate">
                              {spot.productTitle}
                            </span>
                            {spot.label && (
                              <span className="text-[10px] text-neutral-400 font-light block truncate">
                                {spot.label}
                              </span>
                            )}
                          </div>

                          {spot.productSlug && (
                            <Link
                              href={`/products/${spot.productSlug}`}
                              className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1 shrink-0 transition-colors"
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

              {/* پالت هارمونی کامل در انتهای ستون مشخصات */}
              {item.pairings && item.pairings.length > 0 && (
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block mb-3 font-medium">
                    {t("materialPalette")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.pairings.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-neutral-200 font-light"
                      >
                        {p.colorHex ? (
                          <span
                            className="size-2 rounded-full border border-black/30 shrink-0"
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
