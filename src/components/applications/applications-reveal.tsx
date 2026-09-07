// src/components/applications/applications-reveal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ApplicationsPageDataDTO } from "@/services/application.service";

interface ApplicationsRevealProps {
  data: ApplicationsPageDataDTO;
}

const SLIDE_DURATION = 400; // میلی‌ثانیه برای نمایش هر عکس در Intro

export const ApplicationsReveal: React.FC<ApplicationsRevealProps> = ({
  data,
}) => {
  const [phase, setPhase] = useState<"intro" | "grid">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = data.items;

  useEffect(() => {
    if (phase === "intro") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "grid" || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= items.length - 1) {
          clearInterval(timer);
          setPhase("grid");
          return prev;
        }
        return prev + 1;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [phase, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative min-h-[100dvh] w-full bg-background select-none">
      {/* ================= فاز اول: تمام‌صفحه اینترو ================= */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <button
              onClick={() => setPhase("grid")}
              className="absolute top-8 end-8 z-[60] text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
            >
              Skip Intro
            </button>

            {/* تک‌تک عکس‌ها سوار بر هم؛ فقط عکس فعال نمایش دارد */}
            {items.map((item, idx) => {
              const isActive = currentIndex === idx;
              return (
                <motion.div
                  key={`intro-${item.id}`}
                  layoutId={`app-img-${item.id}`}
                  className="absolute inset-0 h-full w-full"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 1.05,
                    zIndex: isActive ? 10 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= فاز دوم: چیدمان لندینگ ================= */}
      <div className="container mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-20">
        {/* بخش هدر صفحه لندینگ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: phase === "grid" ? 1 : 0,
            y: phase === "grid" ? 0 : 20,
          }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="max-w-3xl mb-12 sm:mb-16 space-y-3"
        >
          {data.tagline && (
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-primary shrink-0" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                {data.tagline}
              </span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-light text-foreground tracking-tight">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* گرید کارت‌های کاربری با انیمیشن Flip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={`grid-${item.id}`} className="group space-y-4">
              {/* کانتینر جایگاه نهایی تصویر */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/40 border border-border/50">
                <motion.div
                  layoutId={`app-img-${item.id}`}
                  className="absolute inset-0 w-full h-full"
                  transition={{
                    type: "spring",
                    stiffness: 65,
                    damping: 17,
                    delay: idx * 0.04,
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                </motion.div>
              </div>

              {/* عنوان و شرح متنی کارت */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: phase === "grid" ? 1 : 0,
                  y: phase === "grid" ? 0 : 15,
                }}
                transition={{ delay: 0.5 + idx * 0.08, duration: 0.5 }}
                className="flex items-start justify-between gap-4 pt-1"
              >
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
                <div className="shrink-0 size-9 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowUpRight className="size-4" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
