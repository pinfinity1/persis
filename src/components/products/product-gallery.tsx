"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/services/product.service";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  mainThumbnailUrl: string;
  title: string;
  gallery?: GalleryItem[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainThumbnailUrl,
  title,
  gallery = [],
}) => {
  const images = [
    { url: mainThumbnailUrl, caption: title },
    ...gallery.map((g) => ({
      url:
        typeof g.image === "object" && g.image?.url
          ? g.image.url
          : typeof g.image === "string"
            ? g.image
            : mainThumbnailUrl,
      caption: g.caption || title,
    })),
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = images[selectedIdx] || images[0];

  return (
    <div className="space-y-4 select-none">
      {/* تصویر اصلی با نسبت اسلب واقعی (3:4) و افکت Zoom */}
      <div
        className="relative aspect-[3/4] w-full bg-muted border border-border/50 overflow-hidden cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.caption}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-transform duration-700 ease-out ${
            isZoomed ? "scale-150" : "group-hover:scale-105"
          }`}
        />

        <div className="absolute bottom-4 end-4 bg-background/80 backdrop-blur-md p-2 border border-border/40 text-foreground">
          <ZoomIn className="h-4 w-4" />
        </div>

        {activeImage.caption && (
          <div className="absolute bottom-4 start-4 bg-background/90 backdrop-blur-md px-3 py-1.5 border border-border/40 text-[11px] font-mono text-foreground">
            {activeImage.caption}
          </div>
        )}
      </div>

      {/* تصاویر کوچک (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative h-20 w-16 shrink-0 border transition-all overflow-hidden ${
                selectedIdx === idx
                  ? "border-primary ring-1 ring-primary"
                  : "border-border/50 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
