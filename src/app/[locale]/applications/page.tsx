"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { IntroFullSlider } from "@/components/applications/intro-full-slider";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";

// ۱. عکس‌های کاملاً مستقل تیزر اینترو (بدون وابستگی به داده‌های پایین)
const INTRO_TEASER_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1920&auto=format&fit=crop",
];

// ۲. دسته‌بندی‌های کاربرد (مشابه الگوی بخش‌بندی کاتالوگ با گالری‌های مجزا)
const APPLICATION_SECTIONS = [
  {
    id: "kitchen",
    tag: "فضاهای مسکونی",
    title: "صفحات رویه کابینت، کانتر و جزیره آشپزخانه",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "vanity",
    tag: "محیط‌های بهداشتی",
    title: "روشویی، دیوارپوش حمام و سرویس‌های مستر",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "commercial",
    tag: "پروژه‌های عمومی و درمانی",
    title: "کانترهای تجاری، میزهای آزمایشگاهی و لابی",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

export default function ApplicationsPage() {
  const [phase, setPhase] = useState<"intro" | "landing">("intro");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const arrivedAtLastSlideTimeRef = useRef<number>(0);

  // کروسل عمودی اینترو
  const [introEmblaRef, introEmblaApi] = useEmblaCarousel(
    {
      axis: "y",
      loop: false,
      duration: 35,
    },
    [WheelGesturesPlugin()],
  );

  const onSelectIntro = useCallback(() => {
    if (!introEmblaApi) return;
    const currentSnap = introEmblaApi.selectedScrollSnap();
    setSelectedIndex(currentSnap);

    if (currentSnap === INTRO_TEASER_IMAGES.length - 1) {
      arrivedAtLastSlideTimeRef.current = Date.now();
    }
  }, [introEmblaApi]);

  useEffect(() => {
    if (!introEmblaApi) return;
    introEmblaApi.on("select", onSelectIntro);
    onSelectIntro();
    return () => {
      introEmblaApi.off("select", onSelectIntro);
    };
  }, [introEmblaApi, onSelectIntro]);

  // لیسنر انتقال با اسکرول از عکس آخر
  useEffect(() => {
    if (phase === "landing") return;

    const handleWheelTransition = (e: WheelEvent) => {
      const isLastSlide = selectedIndex === INTRO_TEASER_IMAGES.length - 1;
      if (!isLastSlide || e.deltaY <= 25) return;

      const timeSinceArrival = Date.now() - arrivedAtLastSlideTimeRef.current;
      if (timeSinceArrival > 650) {
        setPhase("landing");
      }
    };

    window.addEventListener("wheel", handleWheelTransition, { passive: true });
    return () => window.removeEventListener("wheel", handleWheelTransition);
  }, [phase, selectedIndex]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* ================= اینترو تمام‌صفحه ================= */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro-slider-wrapper"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(6px)",
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-50 overflow-hidden bg-black"
          >
            <IntroFullSlider
              emblaRef={introEmblaRef}
              emblaApi={introEmblaApi}
              images={INTRO_TEASER_IMAGES}
              selectedIndex={selectedIndex}
              onSkip={() => setPhase("landing")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= محتوای عمودی لندینگ پیج ================= */}
      <motion.main
        animate={{
          opacity: phase === "landing" ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-24 space-y-20 sm:space-y-32 select-none"
      >
        {/* واترمارک و هدر اصلی صفحه */}
        <PageWatermarkHeader
          watermark="APPLICATIONS"
          title="Architectural Use Cases & Spaces"
        />

        {/* لیست عمودی بخش‌ها مشابه ساختار سالانه کاتالوگ */}
        <div className="space-y-24 sm:space-y-36">
          {APPLICATION_SECTIONS.map((section, idx) => (
            <section key={section.id} className="space-y-8 sm:space-y-10">
              {/* هدر بخش و توضیحات */}
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-light text-primary">
                    0{idx + 1}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground pt-0.5">
                    {section.tag}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground tracking-tight">
                  {section.title}
                </h2>
              </div>

              {/* گرید گالری متقارن و چشم‌نواز تصاویر */}
              <div
                className={`grid gap-4 sm:gap-6 ${
                  section.gallery.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {section.gallery.map((imgSrc, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="group relative aspect-[4/3] bg-card border border-border/60 hover:border-primary/60 transition-all duration-500 overflow-hidden"
                  >
                    <Image
                      src={imgSrc}
                      alt={`${section.title} ${imgIdx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
