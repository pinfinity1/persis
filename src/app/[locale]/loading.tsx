"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background select-none">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute size-24 sm:size-28 rounded-full bg-primary/30 blur-2xl pointer-events-none"
        />

        {/* لوگوی بدون پس‌زمینه با انیمیشن پالس لوکس */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative size-16 sm:size-20"
        >
          <Image
            src="/logo-Red.png"
            alt="Persis Quartz Loading"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
