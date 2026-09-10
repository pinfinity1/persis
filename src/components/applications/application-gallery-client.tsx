// src/components/applications/application-gallery-client.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { MediaLightboxDialog } from "@/components/shared/media-lightbox-dialog";

interface ApplicationGalleryClientProps {
  title: string;
  gallery: string[];
}

export const ApplicationGalleryClient: React.FC<
  ApplicationGalleryClientProps
> = ({ title, gallery }) => {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    index: number;
  }>({
    isOpen: false,
    index: 0,
  });

  const openLightbox = (index: number) => {
    setLightboxState({ isOpen: true, index });
  };

  const closeLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <div
        className={`grid gap-4 sm:gap-6 ${
          gallery.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {gallery.map((imgSrc, imgIdx) => (
          <div
            key={imgIdx}
            onClick={() => openLightbox(imgIdx)}
            className="group relative aspect-[4/3] bg-card border border-border/60 hover:border-primary/80 transition-all duration-500 overflow-hidden cursor-pointer"
          >
            <Image
              src={imgSrc}
              alt={`${title} ${imgIdx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="size-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaLightboxDialog
        isOpen={lightboxState.isOpen}
        onClose={closeLightbox}
        title={title}
        images={gallery}
        currentIndex={lightboxState.index}
        onIndexChange={(newIdx) =>
          setLightboxState((prev) => ({ ...prev, index: newIdx }))
        }
      />
    </>
  );
};
