// src/components/home/hero-banner.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HomePageHeroDTO } from "@/services/home.service";

interface HeroBannerProps {
  heroData?: HomePageHeroDTO | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ heroData }) => {
  const t = useTranslations("Hero");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const desktopPoster = heroData?.desktopPoster;
  const mobilePoster = heroData?.mobilePoster || desktopPoster;
  const desktopVideo = heroData?.desktopVideo;
  const mobileVideo = heroData?.mobileVideo || desktopVideo;

  const hasVideo = Boolean(desktopVideo || mobileVideo);
  const hasCustomMedia = Boolean(
    desktopPoster || mobilePoster || desktopVideo || mobileVideo,
  );

  useEffect(() => {
    if (!hasVideo || hasVideoError) return;

    const playVideo = async (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return;
      try {
        videoEl.muted = true;
        videoEl.defaultMuted = true;
        videoEl.load();
        await videoEl.play();
        setIsVideoLoaded(true);
      } catch (err) {
        console.warn("Autoplay was prevented or failed:", err);
      }
    };

    playVideo(desktopVideoRef.current);
    playVideo(mobileVideoRef.current);
  }, [hasVideo, hasVideoError, desktopVideo, mobileVideo]);

  const handleLoadedData = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setHasVideoError(true);
  }, []);

  const handleScrollDown = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  const tagline = heroData?.tagline || t("tagline");
  const title = heroData?.title || t("title");
  const subtitle = heroData?.subtitle || t("subtitle");

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white flex flex-col justify-end select-none">
      {/* ۱. پس‌زمینه پیش‌فرض در صورت نبود رسانه سفارشی */}
      {!hasCustomMedia && (
        <div className="absolute inset-0 bg-radial from-neutral-900 via-neutral-950 to-black flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          <div className="relative w-52 sm:w-64 h-42 opacity-50">
            <Image
              src="/PersisQuartz-Red.png"
              alt="Persis Quartz Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* ۲. پوستر دسکتاپ */}
      {desktopPoster && (
        <Image
          src={desktopPoster}
          alt="Persis Quartz Surface"
          fill
          priority
          sizes="100vw"
          className={`hidden md:block object-cover transition-opacity duration-700 ${
            isVideoLoaded && !hasVideoError && desktopVideo
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
      )}

      {/* ۳. پوستر موبایل */}
      {mobilePoster && (
        <Image
          src={mobilePoster}
          alt="Persis Quartz Surface Mobile"
          fill
          priority
          sizes="100vw"
          className={`block md:hidden object-cover transition-opacity duration-700 ${
            isVideoLoaded && !hasVideoError && mobileVideo
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
      )}

      {/* ۴. ویدیو دسکتاپ */}
      {desktopVideo && !hasVideoError && (
        <video
          ref={desktopVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleLoadedData}
          onError={handleVideoError}
          className={`hidden md:block absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={desktopVideo} type="video/mp4" />
        </video>
      )}

      {/* ۵. ویدیو موبایل */}
      {mobileVideo && !hasVideoError && (
        <video
          ref={mobileVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleLoadedData}
          onError={handleVideoError}
          className={`block md:hidden absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={mobileVideo} type="video/mp4" />
        </video>
      )}

      {/* ۶. گرادیانت جهت خوانایی متن */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

      {/* ۷. متون هیرو */}
      <div className="container relative z-10 mx-auto px-6 sm:px-12 pb-20 sm:pb-28">
        <div className="max-w-3xl space-y-4 border-s border-white/20 ps-6 sm:ps-8">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-primary" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300 font-light">
              {tagline}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-[1.3] text-neutral-100 text-balance">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-base font-light text-neutral-300/90 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ۸. آیکون اسکرول */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer"
        onClick={handleScrollDown}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6 stroke-[1]" />
        </motion.div>
      </div>
    </section>
  );
};
