// src/components/catalogs/catalog-pdf-reader.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  FileText,
  LayoutGrid,
  Loader2,
  ExternalLink,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/services/catalog.service";

interface CatalogPdfReaderProps {
  catalog: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function getSafeCatalogMediaUrl(
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

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  targetWidth: number;
  targetHeight: number;
  zoom: number;
  className?: string;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  targetWidth,
  targetHeight,
  zoom,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: RenderTask | null = null;

    const renderPage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setRendering(true);

      try {
        const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        // محاسبه مقیاس متناسب با فضای در دسترس (Fit inside stage)
        const scaleX = targetWidth / baseViewport.width;
        const scaleY = targetHeight / baseViewport.height;
        const fitScale = Math.max(0.2, Math.min(scaleX, scaleY)) * zoom;

        const viewport = page.getViewport({ scale: fitScale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;
        if (!isCancelled) {
          setRendering(false);
        }
      } catch (err) {
        const name =
          err && typeof err === "object" && "name" in err
            ? String((err as { name?: unknown }).name)
            : "";
        if (name !== "RenderingCancelledException" && !isCancelled) {
          setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, targetWidth, targetHeight, zoom]);

  return (
    <div
      className={cn(
        "relative bg-white shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden shrink-0",
        className,
      )}
    >
      <canvas ref={canvasRef} className="block" />
      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/20 backdrop-blur-[1px]">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

interface ThumbnailItemProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  isActive: boolean;
  onSelect: (page: number) => void;
  pageLabel: string;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({
  pdfDoc,
  pageNumber,
  isActive,
  onSelect,
  pageLabel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    let renderTask: RenderTask | null = null;

    const renderThumb = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const thumbWidth = 140;
        const scale = thumbWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        });
        await renderTask.promise;
      } catch {
        // ignore cancellation
      }
    };

    renderThumb();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDoc, pageNumber, isVisible]);

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={() => onSelect(pageNumber)}
      className={cn(
        "group flex flex-col items-center gap-1.5 p-2 border transition-all cursor-pointer w-full text-center",
        isActive
          ? "border-primary bg-primary/10"
          : "border-white/10 bg-neutral-900/60 hover:border-white/30",
      )}
    >
      <div className="w-full min-h-[100px] bg-neutral-900 flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full h-auto block" />
      </div>
      <span
        className={cn(
          "text-[10px] font-mono",
          isActive ? "text-primary font-semibold" : "text-neutral-400",
        )}
      >
        {pageLabel} {pageNumber}
      </span>
    </button>
  );
};

export const CatalogPdfReader: React.FC<CatalogPdfReaderProps> = ({
  catalog,
  isOpen,
  onClose,
}) => {
  const t = useTranslations("Catalogs");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const modalRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"single" | "spread">("single");
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  const pdfUrl = catalog ? getSafeCatalogMediaUrl(catalog.pdf_file) : "";
  const isDesktopSpread = viewMode === "spread" && stageSize.width >= 960;

  useEffect(() => {
    setMounted(true);
  }, []);

  // قفل اسکرول صفحه اصلی هنگام باز بودن مودال
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // پایش ابعاد استیج برای ریسپانسیو بودن دقیق در تمام نمایشگرها
  useEffect(() => {
    if (!isOpen) return;
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const paddingX = window.innerWidth < 640 ? 16 : 48;
      const paddingY = window.innerWidth < 640 ? 16 : 36;
      setStageSize({
        width: Math.max(240, el.clientWidth - paddingX),
        height: Math.max(240, el.clientHeight - paddingY),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen, showThumbnails]);

  // بارگذاری تدریجی PDF با Range Streaming (تکه‌های 64KB بدون دانلود کل ۳۰ مگابایت)
  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    let destroyed = false;
    let activeDoc: PDFDocumentProxy | null = null;
    let loadingTaskRef: { destroy: () => Promise<void> } | null = null;

    setPdfDoc(null);
    setNumPages(0);
    setCurrentPage(1);
    setLoadProgress(0);
    setLoadError(false);
    setZoom(1);

    const initPdf = async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        if (destroyed) return;

        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          disableAutoFetch: true,
          disableStream: false,
          rangeChunkSize: 65536,
        });
        loadingTaskRef = loadingTask;

        loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
          if (destroyed) return;
          if (progress.total > 0) {
            const pct = Math.min(
              99,
              Math.round((progress.loaded / progress.total) * 100),
            );
            setLoadProgress(pct);
          }
        };

        const doc = await loadingTask.promise;
        if (destroyed) {
          await doc.cleanup();
          await loadingTask.destroy();
          return;
        }

        activeDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoadProgress(100);
      } catch {
        if (!destroyed) {
          setLoadError(true);
        }
      }
    };

    initPdf();

    return () => {
      destroyed = true;
      if (activeDoc) {
        activeDoc.cleanup().catch(() => {});
      }
      if (loadingTaskRef) {
        loadingTaskRef.destroy().catch(() => {});
      }
    };
  }, [isOpen, pdfUrl]);

  // پیش‌واکشی صفحه بعدی در پس‌زمینه برای ورق زدن آنی (<30ms)
  useEffect(() => {
    if (!pdfDoc || !numPages) return;
    const nextIdx = currentPage + (isDesktopSpread ? 2 : 1);
    if (nextIdx <= numPages) {
      pdfDoc.getPage(nextIdx).catch(() => {});
    }
  }, [pdfDoc, currentPage, numPages, isDesktopSpread]);

  const goNext = useCallback(() => {
    setCurrentPage((prev) => {
      const step = isDesktopSpread && prev > 1 ? 2 : 1;
      return Math.min(prev + step, numPages || prev);
    });
  }, [isDesktopSpread, numPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((prev) => {
      const step = isDesktopSpread && prev > 2 ? 2 : 1;
      return Math.max(prev - step, 1);
    });
  }, [isDesktopSpread]);

  const toggleFullscreen = useCallback(() => {
    if (!modalRef.current) return;
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // کلیدهای میانبر کیبورد
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showThumbnails) {
          setShowThumbnails(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (isRtl) goNext();
        else goPrev();
      } else if (e.key === "ArrowRight") {
        if (isRtl) goPrev();
        else goNext();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(2.25, +(z + 0.25).toFixed(2)));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showThumbnails, isRtl, goNext, goPrev, onClose, toggleFullscreen]);

  // پشتیبانی از ژست Swipe در موبایل و تبلت
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || zoom > 1) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 48) {
      if (diff > 0) {
        if (isRtl) goPrev();
        else goNext();
      } else {
        if (isRtl) goNext();
        else goPrev();
      }
    }
    touchStartX.current = null;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: catalog?.title || "Persis Quartz", url });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!mounted || !isOpen || !catalog) return null;

  // محاسبه صفحات قابل نمایش در نمای تک‌صفحه یا دوصفحه‌ای
  const pagesToRender: number[] = [];
  if (pdfDoc && numPages > 0) {
    if (isDesktopSpread && currentPage > 1) {
      // صفحات زوج و فرد روبه‌روی هم
      const leftOrFirst = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      pagesToRender.push(leftOrFirst);
      if (leftOrFirst + 1 <= numPages) {
        pagesToRender.push(leftOrFirst + 1);
      }
    } else {
      pagesToRender.push(currentPage);
    }
  }

  const perPageTargetWidth =
    pagesToRender.length === 2
      ? Math.floor((stageSize.width - 16) / 2)
      : stageSize.width;

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] w-screen h-[100dvh] flex flex-col bg-neutral-950 text-neutral-100 select-none overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={catalog.title}
    >
      {/* هدر کنترل استودیو */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-neutral-950/95 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 z-30">
        {/* اطلاعات کاتالوگ */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThumbnails((v) => !v)}
            disabled={!pdfDoc}
            className={cn(
              "rounded-none h-9 px-2.5 text-xs border border-white/10 cursor-pointer",
              showThumbnails
                ? "bg-primary text-primary-foreground border-primary"
                : "text-neutral-300 hover:text-white hover:bg-white/10",
            )}
            title={t("thumbnails")}
          >
            <LayoutGrid className="size-4" />
            <span className="hidden md:inline ms-1.5">{t("thumbnails")}</span>
          </Button>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-light text-white truncate">
              {catalog.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-400">
              {catalog.year && <span className="font-mono">{catalog.year}</span>}
              {catalog.file_size_mb && (
                <span>• {t("fileSize", { size: catalog.file_size_mb })}</span>
              )}
            </div>
          </div>
        </div>

        {/* کنترل‌های زوم و نمای دوصفحه‌ای (دسکتاپ) */}
        <div className="hidden lg:flex items-center gap-1 bg-neutral-900 border border-white/10 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
            disabled={zoom <= 0.75}
            className="rounded-none h-7 w-7 p-0 text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title={t("zoomOut")}
          >
            <ZoomOut className="size-3.5" />
          </Button>
          <span className="text-[11px] font-mono text-neutral-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(2.25, +(z + 0.25).toFixed(2)))}
            disabled={zoom >= 2.25}
            className="rounded-none h-7 w-7 p-0 text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title={t("zoomIn")}
          >
            <ZoomIn className="size-3.5" />
          </Button>
          {zoom !== 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(1)}
              className="rounded-none h-7 w-7 p-0 text-primary hover:bg-white/10 cursor-pointer"
              title={t("fitWidth")}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          )}

          <div className="h-4 w-px bg-white/10 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setViewMode((m) => (m === "single" ? "spread" : "single"))
            }
            className={cn(
              "rounded-none h-7 px-2.5 text-[11px] gap-1.5 cursor-pointer",
              viewMode === "spread"
                ? "bg-white/15 text-white"
                : "text-neutral-400 hover:text-white hover:bg-white/10",
            )}
            title={viewMode === "single" ? t("spreadView") : t("singlePage")}
          >
            <BookOpen className="size-3.5" />
            <span>
              {viewMode === "single" ? t("spreadView") : t("singlePage")}
            </span>
          </Button>
        </div>

        {/* اکشن‌های سمت مقابل */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="rounded-none h-9 px-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title={t("share")}
          >
            {isCopied ? (
              <Check className="size-4 text-emerald-400" />
            ) : (
              <Share2 className="size-4" />
            )}
          </Button>

          {pdfUrl && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-none h-9 px-2.5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
              title={t("openNativeViewer")}
            >
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
          )}

          {pdfUrl && (
            <Button
              asChild
              size="sm"
              className="rounded-none h-9 px-3 sm:px-4 text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 tracking-wider uppercase"
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

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="rounded-none h-9 w-9 p-0 text-neutral-300 hover:text-white hover:bg-white/10 hidden sm:flex cursor-pointer"
            title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-none h-9 w-9 p-0 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10 ms-0.5 cursor-pointer"
            title={t("closeModal")}
            aria-label={t("closeModal")}
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {/* بدنه اصلی: دراور صفحات + بوم رندر */}
      <div className="flex-1 flex relative overflow-hidden min-h-0">
        {/* سایدبار بندانگشتی صفحات */}
        {showThumbnails && pdfDoc && numPages > 0 && (
          <aside className="absolute sm:relative inset-y-0 start-0 z-20 w-52 sm:w-56 bg-neutral-950/98 border-e border-white/10 overflow-y-auto p-3 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 sm:hidden">
              <span className="text-xs font-medium text-white">
                {t("thumbnails")} ({numPages})
              </span>
              <button
                type="button"
                onClick={() => setShowThumbnails(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pg) => (
                <ThumbnailItem
                  key={pg}
                  pdfDoc={pdfDoc}
                  pageNumber={pg}
                  isActive={pagesToRender.includes(pg)}
                  onSelect={(p) => {
                    setCurrentPage(p);
                    if (window.innerWidth < 640) setShowThumbnails(false);
                  }}
                  pageLabel={t("page")}
                />
              ))}
            </div>
          </aside>
        )}

        {/* بوم اصلی نمایش صفحه کاتالوگ */}
        <main
          ref={stageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "flex-1 relative bg-neutral-900/90 flex items-center justify-center p-2 sm:p-5 overflow-auto",
          )}
        >
          {/* نور محیطی لطیف */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,7,55,0.12)_0%,transparent_70%)] pointer-events-none"
          />

          {/* وضعیت خطا + Fallback دانلود مستقیم */}
          {loadError ? (
            <div className="relative z-10 max-w-md p-6 sm:p-8 bg-neutral-950 border border-white/15 text-center space-y-4">
              <FileText className="size-10 text-primary mx-auto" />
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {t("loadError")}
              </p>
              {pdfUrl && (
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Button
                    asChild
                    className="rounded-none h-10 px-5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5 me-1.5" />
                      <span>{t("openNativeViewer")}</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none h-10 px-5 text-xs border-white/20 text-white hover:bg-white/10"
                  >
                    <a
                      href={pdfUrl}
                      download={`${catalog.slug || "catalog"}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="size-3.5 me-1.5" />
                      <span>{t("download")}</span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ) : !pdfDoc ? (
            /* لودر تدریجی همراه با درصد پیشرفت واقعی */
            <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
              <Loader2 className="size-8 animate-spin text-primary" />
              <div className="space-y-2 w-56">
                <p className="text-xs font-light text-neutral-300">
                  {t("loadingViewer")}
                </p>
                <div className="h-1 w-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.max(8, loadProgress)}%` }}
                  />
                </div>
                {loadProgress > 0 && (
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    {loadProgress}%
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* صفحات رندرشده روی Canvas */
            <div
              dir="ltr"
              className="relative z-10 flex items-center justify-center gap-3 m-auto"
            >
              {pagesToRender.map((pg) => (
                <PdfPageCanvas
                  key={`page-${pg}`}
                  pdfDoc={pdfDoc}
                  pageNumber={pg}
                  targetWidth={perPageTargetWidth}
                  targetHeight={stageSize.height}
                  zoom={zoom}
                />
              ))}
            </div>
          )}

          {/* دکمه‌های شناور چپ و راست در دسکتاپ */}
          {pdfDoc && numPages > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage <= 1}
                aria-label={t("prev")}
                className="hidden sm:flex fixed start-4 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center bg-neutral-950/85 hover:bg-primary border border-white/15 text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer shadow-xl"
              >
                <PrevIcon className="size-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={
                  pagesToRender.includes(numPages) || currentPage >= numPages
                }
                aria-label={t("next")}
                className="hidden sm:flex fixed end-4 top-1/2 -translate-y-1/2 z-20 size-11 items-center justify-center bg-neutral-950/85 hover:bg-primary border border-white/15 text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer shadow-xl"
              >
                <NextIcon className="size-5" />
              </button>
            </>
          )}
        </main>
      </div>

      {/* فوتر ناوبری پایین (ریسپانسیو موبایل و دسکتاپ) */}
      {pdfDoc && numPages > 0 && (
        <footer className="h-14 px-4 sm:px-6 bg-neutral-950/95 border-t border-white/10 flex items-center justify-between gap-4 shrink-0 z-30">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentPage <= 1}
            className="rounded-none h-9 px-3 text-xs border-white/15 bg-neutral-900 text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            <PrevIcon className="size-4 sm:me-1" />
            <span className="hidden sm:inline">{t("prev")}</span>
          </Button>

          {/* کنترل زوم سریع در موبایل + شمارنده صفحه */}
          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
                className="p-1.5 text-neutral-400 hover:text-white"
                aria-label={t("zoomOut")}
              >
                <ZoomOut className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.25, +(z + 0.25).toFixed(2)))}
                className="p-1.5 text-neutral-400 hover:text-white"
                aria-label={t("zoomIn")}
              >
                <ZoomIn className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
              <span>{t("page")}</span>
              <span className="text-white font-semibold">
                {pagesToRender.length === 2
                  ? `${pagesToRender[0]}–${pagesToRender[1]}`
                  : currentPage}
              </span>
              <span className="text-neutral-500">{t("of")}</span>
              <span className="text-neutral-400">{numPages}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={
              pagesToRender.includes(numPages) || currentPage >= numPages
            }
            className="rounded-none h-9 px-3 text-xs border-white/15 bg-neutral-900 text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            <span className="hidden sm:inline">{t("next")}</span>
            <NextIcon className="size-4 sm:ms-1" />
          </Button>
        </footer>
      )}
    </div>,
    document.body,
  );
};
