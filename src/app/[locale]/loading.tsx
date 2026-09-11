"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background select-none">
      <div className="relative flex flex-col items-center gap-6">
        {/* ۱. هاله نوری امبینت پس‌زمینه پشت آیکون P */}
        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.15],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 size-28 rounded-full bg-primary/30 blur-2xl pointer-events-none"
        />

        {/* ۲. آیکون تک‌حرفی P کاملاً صلب و شارپ */}
        <div className="relative size-11 flex items-center justify-center">
          <Image
            src="/logo-Red.png"
            alt="Persis Quartz Loading"
            fill
            priority
            sizes="44px"
            className="object-contain"
          />
        </div>

        {/* ۳. سیستم ترازسنجی خطی مهندسی */}
        <div className="relative flex items-center justify-center w-24">
          {/* نشانگر شروع تراز (تیک ظریف چپ) */}
          <span className="size-1 rounded-full bg-border shrink-0 opacity-60" />

          {/* ریل مویی اصلی */}
          <div className="relative flex-1 h-px bg-border/40 overflow-hidden mx-1.5">
            {/* هاله پس‌زمینه محو پرتو */}
            <motion.div
              className="absolute top-0 bottom-0 w-12 -left-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-[1px]"
              animate={{
                left: ["-60%", "160%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* هسته تیز پرتو نوری (Laser Core) */}
            <motion.div
              className="absolute top-0 bottom-0 w-6 -left-6 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_6px_var(--color-primary)]"
              animate={{
                left: ["-40%", "140%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </div>

          {/* نشانگر پایان تراز (تیک ظریف راست) */}
          <span className="size-1 rounded-full bg-border shrink-0 opacity-60" />
        </div>
      </div>
    </div>
  );
}
