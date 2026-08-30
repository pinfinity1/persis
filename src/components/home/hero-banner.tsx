"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { HeroSlideData, MediaFile } from "@/types/hero";

interface HeroBannerProps {
  slides?: HeroSlideData[];
}

const getMediaUrl = (media?: MediaFile | string | null): string | undefined => {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  return media.url;
};

export const HeroBanner: React.FC<HeroBannerProps> = ({ slides = [] }) => {
  const t = useTranslations("Hero");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const currentSlide = slides[0];

  const mediaUrls = useMemo(() => {
    const desktopPoster = getMediaUrl(currentSlide?.desktopPoster);
    const mobilePoster =
      getMediaUrl(currentSlide?.mobilePoster) || desktopPoster;
    const desktopVideo = getMediaUrl(currentSlide?.desktopVideo);
    const mobileVideo = getMediaUrl(currentSlide?.mobileVideo) || desktopVideo;

    return {
      desktopPoster,
      mobilePoster,
      desktopVideo,
      mobileVideo,
    };
  }, [currentSlide]);

  const hasVideo = Boolean(mediaUrls.desktopVideo || mediaUrls.mobileVideo);
  const hasCustomMedia = Boolean(
    mediaUrls.desktopPoster ||
    mediaUrls.mobilePoster ||
    mediaUrls.desktopVideo ||
    mediaUrls.mobileVideo,
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
        console.warn("Autoplay error:", err);
      }
    };

    playVideo(desktopVideoRef.current);
    playVideo(mobileVideoRef.current);
  }, [hasVideo, hasVideoError, mediaUrls.desktopVideo, mediaUrls.mobileVideo]);

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

  const tagline = currentSlide?.tagline || t("tagline");
  const title = currentSlide?.title || t("title");
  const subtitle = currentSlide?.subtitle || t("subtitle");

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white flex flex-col justify-end select-none">
      {/* ۱. پس‌زمینه پیش‌فرض در صورت نبود مدیا */}
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

      {/* ۲. پوستر دسکتاپ (افقی) */}
      {mediaUrls.desktopPoster && (
        <Image
          src={mediaUrls.desktopPoster}
          alt="Persis Quartz Surface"
          fill
          priority
          sizes="100vw"
          className={`hidden md:block object-cover transition-opacity duration-700 ${
            isVideoLoaded && !hasVideoError && mediaUrls.desktopVideo
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
      )}

      {/* ۳. پوستر موبایل (عمودی) */}
      {mediaUrls.mobilePoster && (
        <Image
          src={mediaUrls.mobilePoster}
          alt="Persis Quartz Surface Mobile"
          fill
          priority
          sizes="100vw"
          className={`block md:hidden object-cover transition-opacity duration-700 ${
            isVideoLoaded && !hasVideoError && mediaUrls.mobileVideo
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
      )}

      {/* ۴. ویدیوهای پس‌زمینه */}
      {mediaUrls.desktopVideo && !hasVideoError && (
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
          <source src={mediaUrls.desktopVideo} type="video/mp4" />
        </video>
      )}

      {mediaUrls.mobileVideo && !hasVideoError && (
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
          <source src={mediaUrls.mobileVideo} type="video/mp4" />
        </video>
      )}

      {/* ۵. لایه‌های سایه و گرادیانت خوانایی متون */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

      {/* ۶. محتوای متنی */}
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

          <p className="text-xs sm:text-base font-light text-neutral-300/90 leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ۷. راهنمای اسکرول به پایین */}
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
