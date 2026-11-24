// src/components/catalogs/catalog-viewer-modal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/services/catalog.service";

interface CatalogViewerModalProps {
  catalog: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function getSafeMediaUrl(
  media?: { url?: string | null } | string | null,
): string {
  if (!media) return "";
  const raw = typeof media === "object" ? media.url : media;
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return "";
}

export const CatalogViewerModal: React.FC<CatalogViewerModalProps> = ({
  catalog,
  isOpen,
  onClose,
}) => {
  const t = useTranslations("Catalogs");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pdfUrl = catalog ? getSafeMediaUrl(catalog.pdf_file) : "";

  // قفل اسکرول صفحه هنگام باز بودن مودال
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // بستن با کلید Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // کنترل حالت تمام‌صفحه
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  if (!isOpen || !catalog) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-neutral-100 select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={catalog.title}
    >
      {/* هدر بالای نمایشگر */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="size-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-medium text-white truncate">
              {catalog.title}
            </h2>
            {catalog.file_size_mb && (
              <span className="text-[11px] text-neutral-400 font-mono">
                {t("fileSize", { size: catalog.file_size_mb })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* دانلود مستقیم PDF */}
          {pdfUrl && (
            <Button
              asChild
              size="sm"
              className="rounded-none h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
            >
              <a
                href={pdfUrl}
                download={`${catalog.slug || "catalog"}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">{t("download")}</span>
              </a>
            </Button>
          )}

          {/* باز کردن در تب جدید (به‌ویژه برای مرورگرهای موبایل) */}
          {pdfUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none h-8 px-2.5 text-xs border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hidden sm:flex"
            >
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="باز کردن در تب مرورگر"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}

          {/* تمام‌صفحه */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="rounded-none h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800 hidden sm:flex"
            title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>

          {/* بستن */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-none h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800 ms-1"
            title={t("closeModal")}
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {/* بوم نمایش فایل PDF */}
      <div className="flex-1 w-full h-full bg-neutral-950 relative overflow-hidden flex flex-col">
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={catalog.title}
            className="w-full h-full border-0 bg-neutral-900"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400 space-y-3">
            <FileText className="size-12 text-neutral-600" />
            <p className="text-sm font-light">{t("noCatalogsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
