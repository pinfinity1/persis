// src/components/home/info-cards-stack.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type CardType = "features" | "maintenance" | "catalog" | "sample";

interface CardItem {
  id: number;
  type: CardType;
  categoryKey: string;
  titleKey: string;
  descKey: string;
  ctaKey?: string;
  link?: string;
  imageUrl: string;
}

const CARDS_DATA: CardItem[] = [
  {
    id: 1,
    type: "features",
    categoryKey: "card1Category",
    titleKey: "card1Title",
    descKey: "",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "maintenance",
    categoryKey: "card2Category",
    titleKey: "card2Title",
    descKey: "card2Desc",
    ctaKey: "card2Cta",
    link: "/care-and-maintenance",
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "catalog",
    categoryKey: "card3Category",
    titleKey: "card3Title",
    descKey: "card3Desc",
    ctaKey: "card3Cta",
    link: "/catalogs",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "sample",
    categoryKey: "card4Category",
    titleKey: "card4Title",
    descKey: "card4Desc",
    ctaKey: "card4Cta",
    link: "/contact?type=sample",
    imageUrl:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1000&auto=format&fit=crop",
  },
];

export const InfoCardsStack: React.FC = () => {
  const t = useTranslations("InfoCards");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [cards, setCards] = useState<CardItem[]>(CARDS_DATA);

  const handleNext = () => {
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setCards((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
  };

  const featuresList = [
    { label: t("featScratch"), icon: "/icons/scratch.png" },
    { label: t("featStain"), icon: "/icons/stain.png" },
    { label: t("featImpact"), icon: "/icons/impact.png" },
    { label: t("featImpermeable"), icon: "/icons/layerbarrier.png" },
    { label: t("featAntibacterial"), icon: "/icons/antibacterial.png" },
    { label: t("featEasyClean"), icon: "/icons/easyclean.png" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border/40 select-none overflow-hidden">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 max-w-4xl mx-auto">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-primary font-mono block mb-1">
              {t("tagline")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-foreground">
              {t("title")}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
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

        <div
          className="relative w-full max-w-4xl mx-auto h-[560px] sm:h-[460px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              const isFront = index === 0;

              const scale = 1 - index * 0.045;
              const translateY = index * 12;
              const translateZ = -index * 30;
              const opacity = index > 2 ? 0 : 1 - index * 0.18;

              return (
                <motion.div
                  key={card.id}
                  layout
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  initial={{
                    scale: 0.88,
                    opacity: 0,
                    y: 30,
                    rotateX: -10,
                  }}
                  animate={{
                    scale,
                    y: translateY,
                    z: translateZ,
                    opacity,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    zIndex: cards.length - index,
                  }}
                  exit={{
                    x: isRtl ? -420 : 420,
                    y: -20,
                    rotateY: isRtl ? -25 : 25,
                    rotateZ: isRtl ? -12 : 12,
                    opacity: 0,
                    scale: 0.85,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 22,
                    mass: 0.8,
                  }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 60) {
                      handleNext();
                    }
                  }}
                  onClick={isFront ? handleNext : undefined}
                  className={`absolute inset-0 w-full bg-card border border-border/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px] sm:min-h-[440px] rounded-none origin-bottom-center will-change-transform ${
                    isFront
                      ? "cursor-grab active:cursor-grabbing"
                      : "pointer-events-none"
                  }`}
                >
                  <div className="relative md:col-span-5 h-44 md:h-auto bg-muted overflow-hidden pointer-events-none">
                    <Image
                      src={card.imageUrl}
                      alt={t(card.titleKey as any)}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      priority={isFront}
                    />
                    <div className="absolute top-3 start-3 bg-background/90 backdrop-blur-md px-2.5 py-1 border border-border/50 text-[10px] font-mono tracking-widest uppercase text-foreground">
                      0{card.id} / 0{CARDS_DATA.length}
                    </div>
                  </div>

                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-card">
                    {card.type === "features" ? (
                      <div className="space-y-4 my-auto">
                        <div>
                          <span className="text-[11px] uppercase tracking-widest font-mono text-primary font-semibold block mb-1">
                            {t(card.categoryKey as any)}
                          </span>
                          <h4 className="text-lg sm:text-xl font-light text-foreground">
                            {t(card.titleKey as any)}
                          </h4>
                        </div>

                        {/* گرید افقی بدون بهم‌ریختگی */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-border/40">
                          {featuresList.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-muted/20 border border-border/40 flex items-center gap-2.5 group hover:border-primary/50 transition-colors h-14"
                            >
                              <div className="relative h-6 w-6 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  fill
                                  className="object-contain dark:invert"
                                />
                              </div>
                              <span className="text-[11px] sm:text-xs font-light text-foreground leading-tight line-clamp-2">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 my-auto">
                        <span className="text-[11px] uppercase tracking-widest font-mono text-primary font-semibold block">
                          {t(card.categoryKey as any)}
                        </span>
                        <h4 className="text-lg sm:text-2xl font-light text-foreground leading-snug">
                          {t(card.titleKey as any)}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                          {t(card.descKey as any)}
                        </p>

                        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                          <Button
                            asChild
                            variant="link"
                            className="p-0 h-auto text-xs tracking-wider uppercase text-foreground hover:text-primary gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={card.link || "#"}>
                              <span>{t(card.ctaKey as any)}</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
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
