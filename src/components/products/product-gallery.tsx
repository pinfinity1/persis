"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  mainThumbnailUrl: string;
  title: string;
  code: string;
}

export function ProductGallery({
  mainThumbnailUrl,
  title,
  code,
}: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || typeof window === "undefined" || window.innerWidth < 1024)
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="select-none w-full">
      <div
        className="relative aspect-[3/4] max-h-[640px] w-full bg-card border border-border/60 overflow-hidden shadow-xs lg:cursor-crosshair group"
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setIsZoomed(true);
          }
        }}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainThumbnailUrl}
          alt={`${title} (${code})`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-150 ease-out"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isZoomed ? "scale(2.2)" : "scale(1)",
          }}
        />

        {/* برچسب راهنمای هاور */}
        <div className="hidden lg:flex absolute bottom-4 end-4 bg-background/90 backdrop-blur-md px-2.5 py-1.5 border border-border/50 text-xs text-foreground items-center gap-1.5 shadow-sm pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
          <ZoomIn className="h-3.5 w-3.5 text-primary" />
          <span>Hover to Zoom</span>
        </div>
      </div>
    </div>
  );
}
