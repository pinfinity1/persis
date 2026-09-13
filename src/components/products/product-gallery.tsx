// src/components/products/product-gallery.tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rafId = useRef<number | null>(null);

  const isPlaceholder =
    !mainThumbnailUrl || mainThumbnailUrl === "/PersisQuartz-Red.png";

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isPlaceholder || !imageRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transformOrigin = `${x}% ${y}%`;
        }
      });
    },
    [isPlaceholder],
  );

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="select-none w-full">
      <div
        className={`relative aspect-[3/4] max-h-[640px] w-full border border-border/60 overflow-hidden shadow-xs group ${
          isPlaceholder
            ? "bg-muted/15 flex items-center justify-center cursor-default"
            : "bg-card lg:cursor-crosshair"
        }`}
        onMouseEnter={() => {
          if (
            !isPlaceholder &&
            typeof window !== "undefined" &&
            window.matchMedia("(pointer: fine)").matches
          ) {
            setIsZoomed(true);
          }
        }}
        onMouseLeave={() => {
          setIsZoomed(false);
          if (imageRef.current) {
            imageRef.current.style.transformOrigin = "center center";
          }
        }}
        onMouseMove={handleMouseMove}
      >
        <Image
          ref={imageRef}
          src={mainThumbnailUrl || "/PersisQuartz-Red.png"}
          alt={`${title} (${code})`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`will-change-transform ${
            isPlaceholder
              ? "object-contain p-12 sm:p-16 pointer-events-none"
              : "object-cover"
          } ${
            isZoomed
              ? "scale-[2.2] transition-transform duration-75 ease-out"
              : "scale-100 transition-transform duration-300 ease-out"
          }`}
        />

        {!isPlaceholder && (
          <div className="hidden lg:flex absolute bottom-4 end-4 bg-background/90 backdrop-blur-md px-2.5 py-1.5 border border-border/50 text-xs text-foreground items-center gap-1.5 shadow-sm pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
            <ZoomIn className="h-3.5 w-3.5 text-primary" />
            <span>Hover to Zoom</span>
          </div>
        )}
      </div>
    </div>
  );
}
