"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface StudioPdfViewerProps {
  url: string;
  title?: string;
}

export default function StudioPdfViewer({ url, title }: StudioPdfViewerProps) {
  const t = useTranslations("Catalogs");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inputPage, setInputPage] = useState<string>("1");
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // آیکون‌ها و متدهای نویگیشن بر اساس جهت زبان
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const goNext = useCallback(() => {
    setPageNumber((p) => Math.min(p + 1, numPages || p));
  }, [numPages]);

  const goPrev = useCallback(() => {
    setPageNumber((p) => Math.max(p - 1, 1));
  }, []);

  // محاسبه ابعاد صفحه برای ریسپانسیو بودن
  useEffect(() => {
    const updateWidth = () => {
      if (mainAreaRef.current) {
        const padding = window.innerWidth < 640 ? 16 : 48;
        setContainerWidth(mainAreaRef.current.clientWidth - padding);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [showThumbnails]);

  useEffect(() => {
    setInputPage(String(pageNumber));
  }, [pageNumber]);

  // کنترل میانبرهای کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        isRtl ? goPrev() : goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        isRtl ? goNext() : goPrev();
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(s + 0.2, 2.5));
      } else if (e.key === "-") {
        setScale((s) => Math.max(s - 0.2, 0.6));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRtl, goNext, goPrev]);

  // کنترل Swipe لمسی برای موبایل
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1.1) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || scale > 1.1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        isRtl ? goPrev() : goNext();
      } else {
        isRtl ? goNext() : goPrev();
      }
    }
    touchStartX.current = null;
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(inputPage, 10);
    if (!isNaN(p) && p >= 1 && p <= numPages) {
      setPageNumber(p);
    } else {
      setInputPage(String(pageNumber));
    }
  };

  return (
    <div
      ref={containerRef}
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "relative flex flex-col w-full h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 p-0" : "",
      )}
    >
      {/* ۱. تولبار بالا */}
      <div className="h-12 sm:h-14 border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={cn(
              "rounded-none h-8 px-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800",
              showThumbnails && "bg-neutral-800 text-primary",
            )}
            title={t("toc")}
          >
            <LayoutGrid className="h-4 w-4 me-0 sm:me-1.5" />
            <span className="hidden sm:inline">{t("toc")}</span>
          </Button>

          {/* نویگیشن در تبلت و دسکتاپ */}
          <div className="hidden sm:flex items-center gap-1">
            <div className="h-4 w-px bg-neutral-800 mx-1" />
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pageNumber <= 1}
              onClick={goPrev}
              className="text-neutral-300 hover:text-white disabled:opacity-30"
              title={t("prev")}
            >
              <PrevIcon className="h-4 w-4" />
            </Button>

            <form
              onSubmit={handlePageJump}
              className="flex items-center gap-1 font-mono text-xs"
            >
              <Input
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={() => setInputPage(String(pageNumber))}
                className="w-10 h-7 text-center text-xs bg-neutral-950 border-neutral-700 text-white rounded-none p-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400 min-w-5">
                {numPages || "..."}
              </span>
            </form>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pageNumber >= numPages}
              onClick={goNext}
              className="text-neutral-300 hover:text-white disabled:opacity-30"
              title={t("next")}
            >
              <NextIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {title && (
          <div className="text-xs font-mono text-neutral-400 truncate max-w-[140px] sm:max-w-xs text-center">
            {title}
          </div>
        )}

        {/* اکشن‌های سمت راست (زوم، ریست و فول‌اسکرین) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:flex items-center bg-neutral-950 border border-neutral-800 px-1 py-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
              disabled={scale <= 0.6}
              className="text-neutral-400 hover:text-white"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] font-mono px-1.5 text-neutral-300 min-w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.min(s + 0.2, 2.5))}
              disabled={scale >= 2.5}
              className="text-neutral-400 hover:text-white"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setScale(1.0);
              setRotation(0);
            }}
            title={t("reset")}
            className="text-neutral-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="text-neutral-400 hover:text-white hidden sm:inline-flex"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleFullscreen}
            className="text-neutral-400 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* ۲. بدنه اصلی و رندر PDF */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* کشوی فهرست صفحات */}
        {showThumbnails && (
          <aside className="absolute sm:relative inset-y-0 start-0 w-60 sm:w-56 border-e border-neutral-800 bg-neutral-900/95 backdrop-blur-md overflow-y-auto p-3 space-y-3 shrink-0 z-30 animate-in slide-in-from-start duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                {t("pages")} ({numPages})
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowThumbnails(false)}
                className="text-neutral-400 sm:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {Array.from(new Array(numPages), (_, index) => {
              const pageIdx = index + 1;
              const isCurrent = pageNumber === pageIdx;
              return (
                <div
                  key={`thumb-${pageIdx}`}
                  onClick={() => {
                    setPageNumber(pageIdx);
                    if (window.innerWidth < 640) setShowThumbnails(false);
                  }}
                  className={cn(
                    "cursor-pointer border p-1 bg-neutral-950 transition-all flex flex-col items-center gap-1",
                    isCurrent
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-neutral-800 opacity-60 hover:opacity-100",
                  )}
                >
                  <Document file={url} loading={null}>
                    <Page
                      pageNumber={pageIdx}
                      width={140}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {pageIdx}
                  </span>
                </div>
              );
            })}
          </aside>
        )}

        {/* بوم لمسی و نمایش صفحه */}
        <main
          ref={mainAreaRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-8 bg-neutral-950"
        >
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex flex-col items-center gap-3 text-neutral-400 py-16">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="text-xs font-mono">{t("loadingPdf")}</span>
              </div>
            }
            error={
              <div className="text-xs text-destructive font-mono py-12">
                {t("pdfError")}
              </div>
            }
          >
            <div
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease-out",
              }}
              className="shadow-2xl border border-neutral-800 bg-white"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="max-w-full"
                width={Math.min(containerWidth, 800)}
              />
            </div>
          </Document>
        </main>
      </div>

      {/* ۳. فوتر راهنما در دسکتاپ */}
      <div className="hidden sm:flex h-7 border-t border-neutral-800/80 bg-neutral-900/60 px-4 items-center justify-between text-[10px] font-mono text-neutral-400 shrink-0">
        <span>{t("shortcutsHint")}</span>
        <span className="text-primary tracking-widest font-semibold uppercase">
          PERSIS QUARTZ STUDIO
        </span>
      </div>

      {/* ۴. نوار لمسی ورق زدن پایین در موبایل */}
      <div className="sm:hidden h-12 border-t border-neutral-800 bg-neutral-900/95 px-4 flex items-center justify-between shrink-0 z-20">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={goPrev}
          className="h-8 rounded-none border-neutral-700 bg-neutral-950 text-xs px-2.5"
        >
          <PrevIcon className="h-4 w-4 me-1" />
          <span>{t("prev")}</span>
        </Button>

        <span className="text-xs font-mono text-neutral-300">
          {pageNumber} <span className="text-neutral-500">/</span>{" "}
          {numPages || "..."}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber >= numPages}
          onClick={goNext}
          className="h-8 rounded-none border-neutral-700 bg-neutral-950 text-xs px-2.5"
        >
          <span>{t("next")}</span>
          <NextIcon className="h-4 w-4 ms-1" />
        </Button>
      </div>
    </div>
  );
}
