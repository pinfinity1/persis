"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  posterUrl?: string;
  videoUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "دقت مهندسی برای آفرینش زیبایی ماندگار",
  subtitle = "سطوحی فراتر از یک پوشش؛ خلق هارمونی و اصالت در معماری مدرن",
  posterUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
  // لینک ویدیوی مستقیم و پایدار (MP4 مستقیم از Wikimedia Commons)
  videoUrl = "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm",
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && !hasVideoError) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay notice:", err);
      });
    }
  }, [hasVideoError]);

  return (
    <section className="relative h-screen h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white flex flex-col justify-end">
      {/* 1. LCP Priority Poster Image */}
      <Image
        src={posterUrl}
        alt="Persis Quartz Luxury Surface"
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-1000 ${
          isVideoLoaded && !hasVideoError ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. Background Video */}
      {!hasVideoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => {
            console.warn("Video failed to load. Falling back to poster image.");
            setHasVideoError(true);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlay ترکیبی بسیار ملایم */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />

      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-6 sm:px-12 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="max-w-3xl space-y-5 border-r border-white/20 pr-6 sm:pr-8"
        >
          {/* Eyebrow Label / Tagline */}
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-primary"></span>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-mono text-neutral-300 font-light">
              PERSIS QUARTZ SURFACE
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-[1.3] text-neutral-100 text-balance">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base font-light text-neutral-300/90 leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer group"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6 stroke-[1]" />
        </motion.div>
      </motion.div>
    </section>
  );
};
