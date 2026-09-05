// src/components/home/info-cards-stack.tsx
"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type CardType = "features" | "maintenance" | "catalog" | "sample";

interface CardDefinition {
  id: number;
  type: CardType;
  categoryKey:
    "card1Category" | "card2Category" | "card3Category" | "card4Category";
  titleKey: "card1Title" | "card2Title" | "card3Title" | "card4Title";
  descKey?: "card2Desc" | "card3Desc" | "card4Desc";
  ctaKey?: "card2Cta" | "card3Cta" | "card4Cta";
  link?: string;
  imageKey:
    "featuresImage" | "maintenanceImage" | "catalogsImage" | "sampleImage";
}

const STATIC_CARDS: readonly CardDefinition[] = [
  {
    id: 1,
    type: "features",
    categoryKey: "card1Category",
    titleKey: "card1Title",
    imageKey: "featuresImage",
  },
  {
    id: 2,
    type: "maintenance",
    categoryKey: "card2Category",
    titleKey: "card2Title",
    descKey: "card2Desc",
    ctaKey: "card2Cta",
    link: "/care-and-maintenance",
    imageKey: "maintenanceImage",
  },
  {
    id: 3,
    type: "catalog",
    categoryKey: "card3Category",
    titleKey: "card3Title",
    descKey: "card3Desc",
    ctaKey: "card3Cta",
    link: "/catalogs",
    imageKey: "catalogsImage",
  },
  {
    id: 4,
    type: "sample",
    categoryKey: "card4Category",
    titleKey: "card4Title",
    descKey: "card4Desc",
    ctaKey: "card4Cta",
    link: "/contact?type=sample",
    imageKey: "sampleImage",
  },
] as const;

export interface InfoCardsStackProps {
  images?: {
    featuresImage?: string;
    maintenanceImage?: string;
    catalogsImage?: string;
    sampleImage?: string;
  };
}

const FALLBACK_IMG = "/PersisQuartz-Red.png";

export const InfoCardsStack: React.FC<InfoCardsStackProps> = ({ images }) => {
  const t = useTranslations("InfoCards");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const totalCards = STATIC_CARDS.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
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
        isRtl ? handlePrev() : handleNext();
      } else {
        isRtl ? handleNext() : handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const visibleCards = useMemo(() => {
    return [0, 1, 2].map((offset) => {
      const idx = (currentIndex + offset) % totalCards;
      const def = STATIC_CARDS[idx];
      const rawUrl = images?.[def.imageKey];
      const isPlaceholder = !rawUrl || rawUrl === FALLBACK_IMG;

      return {
        ...def,
        imageUrl: isPlaceholder ? FALLBACK_IMG : rawUrl,
        isPlaceholder,
        stackPosition: offset,
      };
    });
  }, [currentIndex, images, totalCards]);

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
        {/* هدر بخش و دکمه‌های ناوبری */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 max-w-5xl mx-auto">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block mb-1 font-semibold">
              {t("tagline")}
            </span>
            <h3 className="text-xl sm:text-3xl font-light text-foreground">
              {t("title")}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors"
              aria-label="Previous Card"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-none border-border hover:bg-muted h-9 w-9 sm:h-10 sm:w-10 transition-colors"
              aria-label="Next Card"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-0 ltr:rotate-180" />
            </Button>
          </div>
        </div>

        {/* محفظه استک کارت‌ها: ارتفاع تطبیقی برای دسکتاپ و موبایل بدون بیرون‌زدگی */}
        <div
          className="relative w-full max-w-5xl mx-auto h-[540px] sm:h-[480px] md:h-[420px] flex items-center justify-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCards.map((card) => {
              const isFront = card.stackPosition === 0;

              return (
                <motion.div
                  key={card.id}
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
                  {/* بخش تصویر: ارتفاع فیکس ۴۰٪ در موبایل برای باز گذاشتن فضا برای متن */}
                  <div className="relative w-full h-[40%] md:h-full md:col-span-5 bg-muted/20 shrink-0 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-e border-border/40">
                    <Image
                      src={card.imageUrl}
                      alt={t(card.titleKey)}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className={`transition-all duration-300 ${
                        card.isPlaceholder
                          ? "object-contain p-6 sm:p-10 dark:invert"
                          : "object-cover"
                      }`}
                      loading="lazy"
                    />

                    {/* بج شماره کارت */}
                    <div className="absolute top-2.5 start-2.5 sm:top-3 sm:start-3 bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border/60 text-[9px] sm:text-[10px] tracking-widest uppercase font-mono text-foreground z-10">
                      0{card.id} / 0{totalCards}
                    </div>
                  </div>

                  {/* بخش محتوا: ۶۰٪ ارتفاع در موبایل همراه با اسکرول احتیاطی بدون بریدگی */}
                  <div className="h-[60%] md:h-full md:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto bg-card">
                    {card.type === "features" ? (
                      <div className="space-y-3 my-auto w-full">
                        <div>
                          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-semibold block mb-0.5">
                            {t(card.categoryKey)}
                          </span>
                          <h4 className="text-base sm:text-xl lg:text-2xl font-light text-foreground leading-snug">
                            {t(card.titleKey)}
                          </h4>
                        </div>

                        {/* گرید ویژگی‌ها با فونت و پدینگ متناسب با موبایل */}
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
                      <div className="space-y-3 my-auto w-full">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-semibold block">
                          {t(card.categoryKey)}
                        </span>
                        <h4 className="text-base sm:text-xl lg:text-2xl font-light text-foreground leading-snug">
                          {t(card.titleKey)}
                        </h4>
                        {card.descKey && (
                          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
                            {t(card.descKey)}
                          </p>
                        )}

                        {card.ctaKey && card.link && (
                          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                            <Button
                              asChild
                              variant="link"
                              className="p-0 h-auto text-xs sm:text-sm tracking-wider uppercase text-foreground hover:text-primary gap-1.5"
                            >
                              <Link href={card.link}>
                                <span>{t(card.ctaKey)}</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
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
