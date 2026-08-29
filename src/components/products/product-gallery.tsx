"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/services/product.service";
import { ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductGalleryProps {
  mainThumbnailUrl: string;
  title: string;
  code: string;
  gallery?: GalleryItem[];
}

export function ProductGallery({
  mainThumbnailUrl,
  title,
  code,
  gallery = [],
}: ProductGalleryProps) {
  const t = useTranslations("ProductDetail");

  const images = [
    { url: mainThumbnailUrl, caption: `${title} (${code})` },
    ...gallery.map((g) => ({
      url:
        typeof g.image === "object" && g.image?.url
          ? g.image.url
          : typeof g.image === "string"
            ? g.image
            : mainThumbnailUrl,
      caption: g.caption || title,
    })),
  ].filter((img) => Boolean(img.url));

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIdx] || {
    url: "/PersisQuartz-Red.png",
    caption: title,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // زوم فقط در مانیتورهای دسکتاپ عمل میکند
    if (!isZoomed || typeof window === "undefined" || window.innerWidth < 1024)
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsZoomed(true);
    }
  };

  return (
    <div className="space-y-4 select-none lg:sticky lg:top-28">
      {/* فریم اصلی اسلب (نسبت ۳ به ۴) */}
      <div
        className="relative aspect-[3/4] w-full bg-card border border-border/60 overflow-hidden shadow-sm lg:cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.caption}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-150 ease-out"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isZoomed ? "scale(2.2)" : "scale(1)",
          }}
        />

        {/* نشانگر قابلیت زوم فقط برای دسکتاپ */}
        <div className="hidden lg:flex absolute bottom-4 end-4 bg-background/90 backdrop-blur-md px-2.5 py-1.5 border border-border/50 text-xs text-foreground items-center gap-1.5 shadow-sm">
          <ZoomIn className="h-3.5 w-3.5 text-primary" />
          <span>Hover to Zoom</span>
        </div>
      </div>

      {/* تصاویر بندانگشتی تنها در صورت وجود بیش از یک تصویر رندر میشوند */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setIsZoomed(false);
              }}
              className={`relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 border transition-all overflow-hidden bg-muted/30 cursor-pointer ${
                selectedIdx === idx
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/60 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                sizes="80px"
                className="object-cover"
              />
              <span className="absolute bottom-1 end-1 bg-black/70 text-white text-[10px] px-1.5">
                0{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
