// src/components/catalogs/catalog-lookbook-modal.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Grid,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/services/catalog.service";
import {
  PERSIS_MASTER_SPREADS,
  getSafeMediaUrl,
  type LookbookSpread,
} from "@/lib/catalog-lookbook-data";

interface CatalogLookbookModalProps {
  catalog: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CatalogLookbookModal: React.FC<CatalogLookbookModalProps> = ({
  catalog,
  isOpen,
  onClose,
}) => {
  const t = useTranslations("Catalogs");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  // Navigation and view state
  const [activeTab, setActiveTab] = useState<"interactive" | "document">("interactive");
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0);
  const [showOverviewGrid, setShowOverviewGrid] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const totalSpreads = PERSIS_MASTER_SPREADS.length;
  const currentSpread: LookbookSpread =
    PERSIS_MASTER_SPREADS[currentSpreadIndex] || PERSIS_MASTER_SPREADS[0];

  const pdfUrl = catalog ? getSafeMediaUrl(catalog.pdf_file) : "";
  const coverUrl = catalog ? getSafeMediaUrl(catalog.cover_image) : "";

  // Reset state when opening a new catalog
  useEffect(() => {
    if (isOpen) {
      setCurrentSpreadIndex(0);
      setZoomLevel(1);
      setActiveHotspotId(null);
      setActiveTab("interactive");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  const goNext = useCallback(() => {
    setCurrentSpreadIndex((prev) => Math.min(prev + 1, totalSpreads - 1));
    setZoomLevel(1);
    setActiveHotspotId(null);
  }, [totalSpreads]);

  const goPrev = useCallback(() => {
    setCurrentSpreadIndex((prev) => Math.max(prev - 1, 0));
    setZoomLevel(1);
    setActiveHotspotId(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (showOverviewGrid) {
          setShowOverviewGrid(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight") {
        // In RTL right arrow goes to previous; in LTR it goes next
        if (isRtl) {
          goPrev();
        } else {
          goNext();
        }
      } else if (e.key === "ArrowLeft") {
        // In RTL left arrow goes to next; in LTR it goes prev
        if (isRtl) {
          goNext();
        } else {
          goPrev();
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    },
    [isOpen, showOverviewGrid, isRtl, goNext, goPrev, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe Right
        if (isRtl) {
          goPrev();
        } else {
          goNext();
        }
      } else {
        // Swipe Left
        if (isRtl) {
          goNext();
        } else {
          goPrev();
        }
      }
    }
    touchStartXRef.current = null;
  };

  // Fullscreen toggle
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

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: catalog?.title || "Persis Quartz Catalog",
          url,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  if (!isOpen || !catalog) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950/98 backdrop-blur-2xl text-neutral-100 select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={catalog.title}
    >
      {/* ========================================================= */}
      {/* ۱. هدر معماری و کنترل‌های اختصاصی (Architectural Header Bar) */}
      {/* ========================================================= */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
        {/* برند و عنوان کاتالوگ */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-2 rounded-full bg-primary ring-4 ring-primary/20 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-primary">
                PERSIS QUARTZ • LOOKBOOK
              </span>
              <span className="hidden sm:inline-block text-neutral-600">•</span>
              <span className="hidden sm:inline-block text-[11px] text-neutral-400 font-light truncate max-w-[280px]">
                {catalog.title}
              </span>
            </div>
          </div>
        </div>

        {/* سوییچ تب تعاملی / سند پی‌دی‌اف */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 rounded-none">
          <button
            type="button"
            onClick={() => setActiveTab("interactive")}
            className={cn(
              "px-3 py-1 text-xs transition-colors tracking-wide flex items-center gap-1.5",
              activeTab === "interactive"
                ? "bg-neutral-800 text-white font-medium"
                : "text-neutral-400 hover:text-white",
            )}
          >
            <Sparkles className="size-3 text-primary" />
            <span>{t("interactiveSpreads")}</span>
          </button>
          {pdfUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("document")}
              className={cn(
                "px-3 py-1 text-xs transition-colors tracking-wide flex items-center gap-1.5",
                activeTab === "document"
                  ? "bg-neutral-800 text-white font-medium"
                  : "text-neutral-400 hover:text-white",
              )}
            >
              <FileText className="size-3" />
              <span>{t("viewDocument")}</span>
            </button>
          )}
        </div>

        {/* اکشن‌های تولبار (Grid, Zoom, Fullscreen, Close) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* دکمه فهرست / نمای کلی */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOverviewGrid((prev) => !prev)}
            className={cn(
              "rounded-none h-8 px-2 sm:px-3 text-xs border border-transparent transition-colors",
              showOverviewGrid
                ? "bg-neutral-800 border-neutral-700 text-white"
                : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
            )}
            title={t("overviewGrid")}
          >
            <Grid className="size-3.5 me-1 text-neutral-400" />
            <span className="hidden md:inline">{t("overviewGrid")}</span>
          </Button>

          {/* اشتراک‌گذاری */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="rounded-none h-8 px-2 sm:px-3 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white"
            title={t("shareSpread")}
          >
            {isCopied ? (
              <Check className="size-3.5 text-emerald-400 me-1" />
            ) : (
              <Share2 className="size-3.5 me-1 text-neutral-400" />
            )}
            <span className="hidden md:inline">
              {isCopied ? t("linkCopied") : t("shareSpread")}
            </span>
          </Button>

          {/* دکمه دانلود PDF مستقیم */}
          {pdfUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none h-8 px-2.5 text-xs bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
            >
              <a
                href={pdfUrl}
                download={`${catalog.slug || "persis-quartz-catalog"}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title={t("downloadPrintPdf")}
              >
                <Download className="size-3.5 sm:me-1.5" />
                <span className="hidden sm:inline">{t("download")}</span>
              </a>
            </Button>
          )}

          {/* فول‌اسکرین */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="hidden sm:flex rounded-none h-8 w-8 p-0 text-neutral-300 hover:bg-neutral-900 hover:text-white"
            title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>

          {/* دکمه بستن */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-none h-8 w-8 p-0 text-neutral-300 hover:bg-red-950/40 hover:text-red-400 ms-1 border border-neutral-800"
            title={t("closeModal")}
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* ۲. محتوای اصلی (بوم تعاملی یا پی‌دی‌اف داخلی) */}
      {/* ========================================================= */}
      <div
        className="flex-1 relative overflow-hidden flex"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === "interactive" ? (
          /* ======================================================= */
          /* ۲-الف: بوم استودیوی ژورنال تعاملی متریال (Editorial Stage) */
          /* ======================================================= */
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* ستون چپ/راست: استیج تصویر ماکرو و هات‌اسپات‌های سنگ */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-e border-neutral-900">
              {/* پس‌زمینه با افکت گرادینت لوکس برتون */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,7,55,0.08)_0%,transparent_75%)] pointer-events-none" />

              {/* کادر تصویر با مقیاس زوم */}
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="relative w-full h-full max-w-4xl max-h-[85vh] p-4 sm:p-8 flex items-center justify-center"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] shadow-2xl border border-neutral-800/80 bg-neutral-950 overflow-hidden group">
                  <Image
                    src={currentSpread.coverImage || coverUrl || "/PersisQuartz-Red.png"}
                    alt={currentSpread.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    priority
                    className="object-cover"
                  />

                  {/* شماره بخش و عنوان بالای تصویر */}
                  <div className="absolute top-3 start-3 sm:top-5 sm:start-5 z-20 bg-black/75 backdrop-blur-md px-3 py-1 border border-white/10 text-[10px] sm:text-xs tracking-widest uppercase font-mono text-neutral-300">
                    <span className="text-primary font-bold">
                      {String(currentSpread.spreadNumber).padStart(2, "0")}
                    </span>{" "}
                    / {String(totalSpreads).padStart(2, "0")} • {currentSpread.category}
                  </div>

                  {/* رندر هات‌اسپات‌های تعاملی روی اسلب */}
                  {currentSpread.hotspots?.map((spot) => {
                    const isActive = activeHotspotId === spot.id;
                    return (
                      <div
                        key={spot.id}
                        style={{
                          left: `${spot.xPercent}%`,
                          top: `${spot.yPercent}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspotId((prev) =>
                              prev === spot.id ? null : spot.id,
                            );
                          }}
                          className="relative flex items-center justify-center size-9 cursor-pointer group/pin focus:outline-none"
                          aria-label={spot.label}
                        >
                          <span className="animate-ping absolute inline-flex size-6 rounded-full bg-primary/60 opacity-80" />
                          <span className="relative flex items-center justify-center size-6 rounded-full bg-neutral-950/90 border border-primary text-white shadow-xl transition-transform duration-300 group-hover/pin:scale-125">
                            <span className="size-2 rounded-full bg-primary" />
                          </span>
                        </button>

                        {/* پاپ‌اور جزئیات اسلب */}
                        {isActive && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-full mb-3 start-1/2 -translate-x-1/2 w-64 bg-neutral-950/95 border border-neutral-700/80 p-3 shadow-2xl backdrop-blur-md z-40 text-start"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-[10px] text-primary uppercase tracking-widest font-mono">
                              <span>{spot.productCode || "PERSIS SLAB"}</span>
                              <span className="text-neutral-400">{spot.finish}</span>
                            </div>
                            <p className="text-xs font-light text-neutral-200 pt-1.5 leading-relaxed">
                              {spot.label}
                            </p>
                            <div className="pt-2 flex items-center justify-between">
                              <Link
                                href="/products"
                                className="text-[11px] text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                              >
                                <span>{t("viewSlab")}</span>
                                <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* شناور کنترل زوم در گوشه پایین تصویر */}
              <div className="absolute bottom-4 end-4 z-20 flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 p-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="size-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  title={t("zoomIn")}
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="size-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  title={t("zoomOut")}
                >
                  <ZoomOut className="size-3.5" />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="size-7 flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
                    title={t("zoomReset")}
                  >
                    <RotateCcw className="size-3" />
                  </button>
                )}
              </div>
            </div>

            {/* سایدبار ادیتوریال و مشخصات فنی سنگ (Editorial Spec Sidebar) */}
            <aside className="w-full lg:w-96 xl:w-[420px] bg-neutral-950 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto shrink-0 border-t lg:border-t-0 border-neutral-800">
              <div className="space-y-6">
                {/* برچسب کتگوری و شماره */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] tracking-widest uppercase font-mono">
                    <Sparkles className="size-3" />
                    <span>{currentSpread.category}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-light text-white leading-snug">
                    {currentSpread.title}
                  </h3>
                  <p className="text-xs text-primary/90 font-light">
                    {currentSpread.subtitle}
                  </p>
                </div>

                <div className="h-px w-full bg-neutral-800/80" />

                {/* شرح معمارانه متریال */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono block">
                    {t("toc")}
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {currentSpread.description}
                  </p>
                </div>

                {/* جدول مشخصات فنی اسلب */}
                <div className="space-y-3 pt-2 bg-neutral-900/60 border border-neutral-800/80 p-4">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-mono block">
                    ARCHITECTURAL SPECS
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">
                        ابعاد اسلب
                      </span>
                      <span className="text-neutral-200 font-medium">
                        {currentSpread.dimensions}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">
                        ضخامت استاندارد
                      </span>
                      <span className="text-neutral-200 font-medium">
                        {currentSpread.thickness}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500 text-[10px] block">
                        کد بافت و فرمولاسیون
                      </span>
                      <span className="text-primary font-mono text-xs">
                        {currentSpread.textureCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* اکشن‌های پایینی سایدبار */}
              <div className="pt-6 space-y-2 border-t border-neutral-800/80 mt-6">
                <Button
                  asChild
                  className="w-full rounded-none h-10 text-xs bg-primary text-primary-foreground hover:bg-primary/90 tracking-wider uppercase font-medium"
                >
                  <Link href="/contact">
                    <span>{t("orderSample")}</span>
                    <ArrowUpRight className="size-3.5 ms-1.5" />
                  </Link>
                </Button>
                {pdfUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-none h-9 text-xs border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                  >
                    <a
                      href={pdfUrl}
                      download={`${catalog.slug || "catalog"}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="size-3.5 me-1.5 text-neutral-400" />
                      <span>{t("downloadPrintPdf")}</span>
                    </a>
                  </Button>
                )}
              </div>
            </aside>
          </div>
        ) : (
          /* ======================================================= */
          /* ۲-ب: نمایشگر سند چاپی پی‌دی‌اف (Native High-Perf Frame) */
          /* ======================================================= */
          <div className="flex-1 w-full h-full bg-neutral-900 flex flex-col">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                title={catalog.title}
                className="w-full h-full border-0 bg-neutral-900"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <FileText className="size-12 text-neutral-600 mb-3" />
                <p className="text-sm font-light">{t("previewNotAvailable")}</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ۳. دراور نمای کلی و فهرست فصول (Overview Grid Drawer) */}
        {/* ========================================================= */}
        {showOverviewGrid && (
          <aside className="absolute inset-y-0 start-0 z-40 w-full sm:w-80 md:w-96 bg-neutral-950/98 border-e border-neutral-800 p-5 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-start duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-200">
                  {t("curatedChapters")} ({totalSpreads})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOverviewGrid(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* لیست اسلایدهای فصول */}
            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {PERSIS_MASTER_SPREADS.map((spread, index) => {
                const isCurrent = currentSpreadIndex === index;
                return (
                  <div
                    key={spread.id}
                    onClick={() => {
                      setCurrentSpreadIndex(index);
                      setShowOverviewGrid(false);
                      setActiveTab("interactive");
                    }}
                    className={cn(
                      "p-3 border cursor-pointer transition-all flex items-start gap-3",
                      isCurrent
                        ? "bg-primary/10 border-primary text-white"
                        : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white",
                    )}
                  >
                    <span className="text-xs font-mono text-primary font-bold pt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-medium truncate">
                        {spread.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 pt-0.5">
                        {spread.category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================= */}
      {/* ۴. نوار کنترل پایین (Floating Minimalist Dock Bar) */}
      {/* ========================================================= */}
      {activeTab === "interactive" && (
        <footer className="h-14 sm:h-16 px-4 sm:px-8 border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
          {/* دکمه قبلی */}
          <Button
            variant="outline"
            size="sm"
            disabled={currentSpreadIndex === 0}
            onClick={goPrev}
            className="rounded-none h-8 sm:h-9 px-3 text-xs bg-neutral-900 border-neutral-700 text-white disabled:opacity-30 hover:bg-neutral-800"
          >
            {isRtl ? (
              <ChevronRight className="size-4 me-1" />
            ) : (
              <ChevronLeft className="size-4 me-1" />
            )}
            <span>{t("prev")}</span>
          </Button>

          {/* شمارنده و نشانگر دات‌های صفحات */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {PERSIS_MASTER_SPREADS.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentSpreadIndex(idx)}
                  className={cn(
                    "size-2 transition-all rounded-full",
                    currentSpreadIndex === idx
                      ? "bg-primary w-6"
                      : "bg-neutral-700 hover:bg-neutral-500",
                  )}
                  aria-label={`Go to spread ${idx + 1}`}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-neutral-300">
              <span className="text-white font-bold">
                {String(currentSpreadIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-600 mx-1.5">/</span>
              <span className="text-neutral-400">
                {String(totalSpreads).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* دکمه بعدی */}
          <Button
            variant="outline"
            size="sm"
            disabled={currentSpreadIndex === totalSpreads - 1}
            onClick={goNext}
            className="rounded-none h-8 sm:h-9 px-3 text-xs bg-neutral-900 border-neutral-700 text-white disabled:opacity-30 hover:bg-neutral-800"
          >
            <span>{t("next")}</span>
            {isRtl ? (
              <ChevronLeft className="size-4 ms-1" />
            ) : (
              <ChevronRight className="size-4 ms-1" />
            )}
          </Button>
        </footer>
      )}
    </div>
  );
};
