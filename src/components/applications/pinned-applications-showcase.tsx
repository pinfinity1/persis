// src/components/applications/pinned-applications-showcase.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";

export interface ShowcaseItem {
  id: string;
  tag: string;
  imageUrl: string;
}

interface PinnedApplicationsShowcaseProps {
  items: ShowcaseItem[];
}

export const PinnedApplicationsShowcase: React.FC<
  PinnedApplicationsShowcaseProps
> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = items.length;
  const [activeIndex, setActiveIndex] = useState(0);

  // ردیابی اسکرول محلی کل ارتفاع بخش چسبنده
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // نگاشت اسکرول خطی به مراحل گسسته (Discrete Snaps)
  const discreteProgress = useTransform(scrollYProgress, (progress) => {
    if (totalItems <= 1) return 0;
    const step = 1 / (totalItems - 1);
    const targetIndex = Math.round(progress / step);
    return Math.min(Math.max(targetIndex, 0), totalItems - 1);
  });

  // اعمال Easing فیزیکی شبیه Embla
  const smoothIndex = useSpring(discreteProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.6,
  });

  // محاسبه ترنزفرم Y بر مبنای ایندکس فنری شده
  const yOffset = useTransform(smoothIndex, (val) => `-${val * 100}%`);

  // به‌روزرسانی ایندکس فعال برای دات‌ها و بج تگ
  useEffect(() => {
    const unsubscribe = discreteProgress.on("change", (latest) => {
      setActiveIndex(Math.round(latest));
    });
    return () => unsubscribe();
  }, [discreteProgress]);

  if (!items || totalItems === 0) return null;

  const scrollToSlide = (idx: number) => {
    if (!containerRef.current) return;
    const containerTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY;
    const totalScrollableDistance =
      containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll =
      containerTop + (idx / (totalItems - 1)) * totalScrollableDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    // محاسبه دقیق بر مبنای 90dvh برای هندل صحیح آدرس‌بار مرورگرهای موبایل
    <div
      ref={containerRef}
      style={{ height: `calc(${totalItems * 100}dvh)` }}
      className="relative w-full select-none bg-black"
    >
      {/* پین شدن به سقف ویوپورت با ارتفاع داینامیک */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden z-[70] bg-black">
        {/* کانتینر اسلایدها با ترنزفرم بهینه‌شده روی GPU */}
        <motion.div
          style={{ y: yOffset }}
          className="relative w-full h-full flex flex-col will-change-transform"
        >
          {items.map((item, index) => {
            const isPlaceholder =
              !item.imageUrl ||
              item.imageUrl === "/PersisQuartz-Red.png" ||
              item.imageUrl.trim().length === 0;

            return (
              <div
                key={item.id}
                className="relative flex-[0_0_100%] w-full h-full overflow-hidden flex items-center justify-center bg-neutral-950"
              >
                {isPlaceholder ? (
                  /* سنترسازی هندسی و متقارن لوگو در زمان نبود تصویر */
                  <div className="relative w-48 sm:w-64 md:w-80 h-24 sm:h-32 flex items-center justify-center pointer-events-none select-none">
                    <Image
                      src="/PersisQuartz-Red.png"
                      alt={item.tag}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 250px, 350px"
                      className="object-contain opacity-100"
                    />
                  </div>
                ) : (
                  /* تصویر واقعی با کادربندی فول‌کاور */
                  <Image
                    src={item.imageUrl}
                    alt={item.tag}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover pointer-events-none"
                  />
                )}

                {/* گرادینت تاریک تراز با کادر */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />
              </div>
            );
          })}
        </motion.div>

        {/* تگ تک‌خطی مینیمال، درشت و خوانا با لایه مات بلوری */}
        <div className="absolute bottom-14 sm:bottom-20 start-6 sm:start-16 lg:start-24 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={items[activeIndex]?.id || activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                dir="ltr"
                className="inline-flex items-center gap-3.5 px-5 py-3 sm:px-6 sm:py-3.5 bg-black/65 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <span className="size-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm sm:text-lg md:text-xl tracking-[0.2em] text-white font-semibold uppercase">
                  {items[activeIndex]?.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* دات‌های ناوبری کناری */}
        <div className="absolute end-6 sm:end-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-auto">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={activeIndex === idx}
              className={`transition-all duration-500 rounded-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeIndex === idx
                  ? "h-8 sm:h-10 w-1 sm:w-1.5 bg-primary shadow-[0_0_12px_rgba(155,7,55,0.7)]"
                  : "h-1.5 w-1 sm:w-1.5 bg-white/30 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* برچسب راهنمای پایین */}
        <div
          dir="ltr"
          className="absolute bottom-6 end-6 sm:end-12 z-20 text-[10px] uppercase tracking-[0.25em] text-white/40 hidden sm:block pointer-events-none"
        >
          SCROLL TO EXPLORE
        </div>
      </div>
    </div>
  );
};
