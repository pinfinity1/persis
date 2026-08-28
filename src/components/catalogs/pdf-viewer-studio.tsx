"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
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
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inputPage, setInputPage] = useState<string>("1");
  const [pageWidth, setPageWidth] = useState<number>(600);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainViewerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // محاسبه خودکار عرض صفحه براساس ابعاد کانتینر در موبایل و دسکتاپ
  useEffect(() => {
    const updateDimensions = () => {
      if (!mainViewerRef.current) return;
      const containerW = mainViewerRef.current.clientWidth;
      const isMobile = window.innerWidth < 640;

      // در موبایل کل عرض منهای پدینگ، در دسکتاپ حداکثر ۷۶۰ پیکسل
      const targetW = isMobile
        ? Math.max(containerW - 32, 280)
        : Math.min(containerW - 80, 760);
      setPageWidth(targetW);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setInputPage(String(pageNumber));
  }, [pageNumber]);

  // کنترل سوایپ لمسی روی موبایل
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // کشیدن به چپ و راست (حداقل ۵۰ پیکسل جابه‌جایی)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // رفتن به صفحه بعد
        setPageNumber((p) => Math.min(p + 1, numPages || p));
      } else {
        // بازگشت به صفحه قبل
        setPageNumber((p) => Math.max(p - 1, 1));
      }
    }
    touchStartX.current = null;
  };

  // کنترل کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setPageNumber((p) => Math.min(p + 1, numPages || p));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setPageNumber((p) => Math.max(p - 1, 1));
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(s + 0.2, 2.5));
      } else if (e.key === "-") {
        setScale((s) => Math.max(s - 0.2, 0.6));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

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
      className={cn(
        "relative flex flex-col w-full h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 p-0" : "rounded-none",
      )}
    >
      {/* ۱. تولبار شیشه‌ای بالا (هماهنگ برای دسکتاپ و موبایل) */}
      <div className="h-12 sm:h-14 border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* دکمه تامب‌نیل */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={cn(
              "rounded-none h-8 px-2 sm:px-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800",
              showThumbnails && "bg-neutral-800 text-primary font-medium",
            )}
            title="فهرست صفحات"
          >
            <LayoutGrid className="h-4 w-4 sm:me-1.5" />
            <span className="hidden sm:inline">فهرست</span>
          </Button>

          {/* در دسکتاپ: کنترل صفحه در بالا */}
          <div className="hidden sm:flex items-center gap-1 border-s border-neutral-800 ps-2">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
              className="text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <form
              onSubmit={handlePageJump}
              className="flex items-center gap-1 font-mono text-xs"
            >
              <Input
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={() => setInputPage(String(pageNumber))}
                className="w-9 h-7 text-center text-xs bg-neutral-950 border-neutral-700 text-white rounded-none p-0"
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
              onClick={() => setPageNumber((p) => p + 1)}
              className="text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* عنوان کاتالوگ */}
        <div className="text-[11px] sm:text-xs font-mono text-neutral-400 truncate max-w-[140px] sm:max-w-xs">
          {title || "CATALOG VIEWER"}
        </div>

        {/* ابزارهای زوم و چرخش */}
        <div className="flex items-center gap-1">
          {/* زوم دسکتاپ و موبایل */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 px-0.5 py-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
              disabled={scale <= 0.6}
              className="text-neutral-400 hover:text-white disabled:opacity-20 size-6"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>

            <span className="text-[10px] sm:text-[11px] font-mono px-1.5 text-neutral-300 min-w-8 sm:min-w-11 text-center">
              {Math.round(scale * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setScale((s) => Math.min(s + 0.2, 2.5))}
              disabled={scale >= 2.5}
              className="text-neutral-400 hover:text-white disabled:opacity-20 size-6"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setScale(1.0);
              setRotation(0);
            }}
            title="ریست زوم"
            className="text-neutral-400 hover:text-white hover:bg-neutral-800 hidden sm:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="چرخش"
            className="text-neutral-400 hover:text-white hover:bg-neutral-800 hidden md:inline-flex"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleFullscreen}
            title="تمام صفحه"
            className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* ۲. بدنه نمایش PDF */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* سایدبار تامب‌نیل (در دسکتاپ از کنار / در موبایل کشوی تمام‌صفحه از پایین) */}
        {showThumbnails && (
          <aside className="fixed inset-x-0 bottom-0 top-12 z-30 sm:static sm:top-0 sm:inset-auto sm:w-56 border-e border-neutral-800 bg-neutral-900/98 backdrop-blur-xl sm:bg-neutral-900/95 overflow-y-auto p-4 space-y-3 shrink-0 animate-in slide-in-from-bottom sm:slide-in-from-start duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs uppercase font-mono tracking-widest text-primary font-semibold">
                صفحات کاتالوگ ({numPages})
              </span>
              <button
                onClick={() => setShowThumbnails(false)}
                className="p-1 text-neutral-400 hover:text-white sm:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 pt-2">
              {Array.from(new Array(numPages), (_, index) => {
                const pageIdx = index + 1;
                const isCurrent = pageNumber === pageIdx;
                return (
                  <div
                    key={`thumb-${pageIdx}`}
                    onClick={() => {
                      setPageNumber(pageIdx);
                      setShowThumbnails(false);
                    }}
                    className={cn(
                      "cursor-pointer border p-1 bg-neutral-950 transition-all flex flex-col items-center gap-1",
                      isCurrent
                        ? "border-primary ring-2 ring-primary/40 opacity-100"
                        : "border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100",
                    )}
                  >
                    <Document file={url} loading={null}>
                      <Page
                        pageNumber={pageIdx}
                        width={130}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                    <span className="text-[10px] font-mono text-neutral-400">
                      صفحه {pageIdx}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* بوم نمایش با پشتیبانی لمسی (Swipe) */}
        <main
          ref={mainViewerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-neutral-950/80"
        >
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex flex-col items-center gap-3 text-neutral-400 py-16">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            }
            error={
              <div className="text-xs text-destructive font-mono py-8">
                خطا در باز کردن فایل کاتالوگ.
              </div>
            }
          >
            <div
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease-out",
              }}
              className="shadow-2xl border border-neutral-800/80 bg-white"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="max-w-full"
                width={pageWidth}
              />
            </div>
          </Document>
        </main>
      </div>

      {/* ۳. کنترلر پایین مخصوص موبایل (Floating Mobile Pill Bar) */}
      <div className="sm:hidden border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="rounded-none h-8 px-3 text-xs bg-neutral-950 border-neutral-700 text-white disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4 me-1" />
          <span>قبلی</span>
        </Button>

        <span className="text-xs font-mono text-neutral-300">
          {pageNumber} <span className="text-neutral-500">/</span>{" "}
          {numPages || "..."}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="rounded-none h-8 px-3 text-xs bg-neutral-950 border-neutral-700 text-white disabled:opacity-30"
        >
          <span>بعدی</span>
          <ChevronLeft className="h-4 w-4 ms-1" />
        </Button>
      </div>
    </div>
  );
}
