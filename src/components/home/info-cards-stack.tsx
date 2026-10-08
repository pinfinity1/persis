// src/components/home/info-cards-stack.tsx
"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { InfoCardsSectionDTO } from "@/services/home.service";

export interface InfoCardsStackProps {
  data?: InfoCardsSectionDTO | null;
}

const FALLBACK_IMG = "/PersisQuartz-Red.png";

export const InfoCardsStack: React.FC<InfoCardsStackProps> = ({ data }) => {
  const t = useTranslations("InfoCards");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // واکشی لیست کارت‌ها با پشتیبانی از هر تعداد کارت
  const cards = useMemo(() => {
    if (data?.cards && data.cards.length > 0) {
      return data.cards;
    }
    return [
      {
        id: "1",
        cardType: "features" as const,
        category: t("card1Category"),
        title: t("card1Title"),
      },
      {
        id: "2",
        cardType: "standard" as const,
        category: t("card2Category"),
        title: t("card2Title"),
        description: t("card2Desc"),
        ctaLabel: t("card2Cta"),
        link: "/care-and-maintenance",
      },
      {
        id: "3",
        cardType: "standard" as const,
        category: t("card3Category"),
        title: t("card3Title"),
        description: t("card3Desc"),
        ctaLabel: t("card3Cta"),
        link: "/catalogs",
      },
      {
        id: "4",
        cardType: "standard" as const,
        category: t("card4Category"),
        title: t("card4Title"),
        description: t("card4Desc"),
        ctaLabel: t("card4Cta"),
        link: "/contact?type=sample",
      },
    ];
  }, [data, t]);

  const totalCards = cards.length;

  const handleNext = useCallback(() => {
    if (totalCards <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    if (totalCards <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (isRtl) handlePrev();
        else handleNext();
      } else {
        if (isRtl) handleNext();
        else handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // محاسبه ۳ کارت برای افکت سه‌بعدی پشته (Stack Depth)
  const visibleCards = useMemo(() => {
    const depth = Math.min(3, totalCards);
    return Array.from({ length: depth }, (_, offset) => {
      const idx = (currentIndex + offset) % totalCards;
      const card = cards[idx];
      const validUrl =
        card?.imageUrl && card.imageUrl.trim() !== ""
          ? card.imageUrl
          : FALLBACK_IMG;
      const isPlaceholder = validUrl === FALLBACK_IMG;

      return {
        ...card,
        imageUrl: validUrl,
        isPlaceholder,
        stackPosition: offset,
      };
    });
  }, [currentIndex, cards, totalCards]);

  // ۶ شاخص فیزیکی و آزمایشگاهی سنگ کوارتز
  const featuresList = useMemo(
    () => [
      { label: t("featScratch"), icon: "/icons/scratch.png" },
      { label: t("featStain"), icon: "/icons/stain.png" },
      { label: t("featImpact"), icon: "/icons/impact.png" },
      { label: t("featImpermeable"), icon: "/icons/dense.png" },
      { label: t("featAntibacterial"), icon: "/icons/antibacterial.png" },
      { label: t("featEasyClean"), icon: "/icons/easyclean.png" },
    ],
    [t],
  );

  return (
    <section
      className="py-12 sm:py-20 lg:py-24 bg-background border-b border-border/40 select-none overflow-hidden"
      aria-label="Info Cards Stack"
    >
      <div className="container mx-auto px-4 sm:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 max-w-5xl mx-auto">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block mb-1 font-semibold">
              {data?.tagline || t("tagline")}
            </span>
            <h3 className="text-xl sm:text-3xl font-light text-foreground">
              {data?.title || t("title")}
            </h3>
          </div>

          {totalCards > 1 && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors cursor-pointer"
                aria-label="Previous Card"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors cursor-pointer"
                aria-label="Next Card"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
              </Button>
            </div>
          )}
        </div>

        <div
          className="relative w-full max-w-5xl mx-auto h-[540px] sm:h-[480px] md:h-[420px] flex items-center justify-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCards.map((card) => {
              const isFront = card.stackPosition === 0;
              const cardDisplayIndex =
                ((currentIndex + card.stackPosition) % totalCards) + 1;

              return (
                <motion.div
                  key={`${card.id}-${card.stackPosition}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{
                    y: card.stackPosition * 10,
                    scale: 1 - card.stackPosition * 0.035,
                    opacity: 1 - card.stackPosition * 0.18,
                    zIndex: totalCards - card.stackPosition,
                  }}
                  exit={{
                    x: isRtl ? -300 : 300,
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className={`absolute inset-0 w-full h-full bg-card border border-border shadow-xl overflow-hidden flex flex-col md:grid md:grid-cols-12 rounded-none origin-bottom ${
                    !isFront ? "pointer-events-none" : ""
                  }`}
                >
                  {/* قاب رسانه سمت چپ/بالای کارت */}
                  <div className="relative w-full h-[40%] md:h-full md:col-span-5 bg-muted/20 shrink-0 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-e border-border/40">
                    <Image
                      src={card.imageUrl || FALLBACK_IMG}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className={`transition-all duration-300 ${
                        card.isPlaceholder
                          ? "object-contain p-6 sm:p-10 dark:invert"
                          : "object-cover"
                      }`}
                      loading="lazy"
                    />

                    <div className="absolute top-2.5 start-2.5 sm:top-3 sm:start-3 bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border/60 text-[9px] sm:text-[10px] tracking-widest uppercase text-foreground z-10 font-mono">
                      {String(cardDisplayIndex).padStart(2, "0")} /{" "}
                      {String(totalCards).padStart(2, "0")}
                    </div>
                  </div>

                  {/* بدنه محتوایی کارت */}
                  <div className="h-[60%] md:h-full md:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto bg-card">
                    {card.cardType === "features" ? (
                      /* ۱. قالب کارت ویژگی‌های فنی سنگ کوارتز */
                      <div className="space-y-3 my-auto w-full">
                        <div>
                          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-semibold block mb-0.5">
                            {card.category}
                          </span>
                          <h4 className="text-base sm:text-xl lg:text-2xl font-light text-foreground leading-snug">
                            {card.title}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                          {featuresList.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2 sm:p-2.5 bg-muted/20 border border-border/40 flex items-center gap-2 group hover:border-primary/50 transition-colors"
                            >
                              <div className="relative h-4 w-4 sm:h-5 sm:w-5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  fill
                                  sizes="20px"
                                  className="object-contain dark:invert"
                                />
                              </div>
                              <span className="text-[10px] sm:text-xs font-light text-foreground leading-tight line-clamp-1">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* ۲. قالب استاندارد با متن توضیحات و لینک */
                      <div className="space-y-3 my-auto w-full">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-semibold block">
                          {card.category}
                        </span>
                        <h4 className="text-base sm:text-xl lg:text-2xl font-light text-foreground leading-snug">
                          {card.title}
                        </h4>
                        {card.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-3 sm:line-clamp-none text-justify">
                            {card.description}
                          </p>
                        )}

                        {card.link && (
                          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                            <Button
                              asChild
                              variant="link"
                              className="p-0 h-auto text-xs sm:text-sm tracking-wider uppercase text-foreground hover:text-primary gap-1.5 group/cta"
                            >
                              {card.link.startsWith("http://") ||
                              card.link.startsWith("https://") ? (
                                <a
                                  href={card.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span>{card.ctaLabel || t("card2Cta")}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                                </a>
                              ) : (
                                <Link href={card.link}>
                                  <span>{card.ctaLabel || t("card2Cta")}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                                </Link>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
