"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Box, MapPin, FileText, Share2, Check, Clock } from "lucide-react";
import type { ProductItem } from "@/services/product.service";

interface ProductConfiguratorProps {
  product: ProductItem;
  categoryTitle: string;
}

export function ProductConfigurator({
  product,
  categoryTitle,
}: ProductConfiguratorProps) {
  const t = useTranslations("ProductDetail");

  // صد در صد داینامیک: فقط خواندن از دیتابیس بدون هیچ‌گونه مقدار ثابت
  const thicknesses = product.available_thicknesses || [];
  const finishes = product.finishes || [];

  const [selectedThickness, setSelectedThickness] = useState(
    thicknesses[0] || "",
  );
  const [selectedFinish, setSelectedFinish] = useState(finishes[0] || "");
  const [copied, setCopied] = useState(false);

  // اطمینان از هماهنگی State اولیه با دیتای دریافتی
  useEffect(() => {
    if (thicknesses.length > 0 && !selectedThickness)
      setSelectedThickness(thicknesses[0]);
    if (finishes.length > 0 && !selectedFinish) setSelectedFinish(finishes[0]);
  }, [thicknesses, finishes, selectedThickness, selectedFinish]);

  const sampleUrl = `/contact?type=sample&code=${encodeURIComponent(
    product.code || "",
  )}&thickness=${encodeURIComponent(
    selectedThickness || "",
  )}&finish=${encodeURIComponent(selectedFinish || "")}`;

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isStockAvailable = product.is_in_stock === "in_stock";

  return (
    <div className="space-y-8">
      {/* هدر، کد سنگ و اشتراک‌گذاری */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-primary border border-primary/30 bg-primary/5 px-2.5 py-1">
              کد {product.code}
            </span>
            {categoryTitle && (
              <span className="text-xs text-muted-foreground border border-border/50 px-2 py-1">
                {categoryTitle}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                <span className="text-primary font-medium">{t("copied")}</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>{t("share")}</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
          {product.title}
        </h1>
      </div>

      {/* معرفی کانسپت سنگ */}
      {product.description && (
        <p className="text-sm font-light text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      )}

      {/* انتخابگر ضخامت و فینیش سطح (رندر کاندیشنال بر اساس وجود دیتا) */}
      {(thicknesses.length > 0 || finishes.length > 0) && (
        <div className="space-y-5 border-y border-border/50 py-6 bg-card/30 p-4">
          {/* ضخامت */}
          {thicknesses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-medium">
                  {t("thickness")}
                </span>
                <span className="text-primary font-bold">
                  {selectedThickness}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {thicknesses.map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setSelectedThickness(th)}
                    className={`py-2 px-4 text-xs border transition-all text-center cursor-pointer ${
                      selectedThickness === th
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                        : "border-border/60 bg-card hover:border-border text-foreground"
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* نوع فینیش */}
          {finishes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-medium">
                  {t("finish")}
                </span>
                <span className="text-primary font-bold uppercase">
                  {selectedFinish}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {finishes.map((fn) => (
                  <button
                    key={fn}
                    type="button"
                    onClick={() => setSelectedFinish(fn)}
                    className={`py-2 px-4 text-xs uppercase border transition-all text-center flex items-center gap-1.5 cursor-pointer ${
                      selectedFinish === fn
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                        : "border-border/60 bg-card hover:border-border text-foreground"
                    }`}
                  >
                    <span>{fn}</span>
                    {selectedFinish === fn && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* دکمه‌های اقدام B2B */}
      <div className="space-y-3 pt-2">
        <Button
          asChild
          size="lg"
          className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-sm tracking-wider uppercase font-medium shadow-sm"
        >
          <Link
            href={sampleUrl}
            className="flex items-center justify-center gap-3"
          >
            <Box className="h-5 w-5 shrink-0" />
            <div className="text-start">
              <span>{t("requestSample")}</span>
              <span className="block text-[11px] font-light opacity-90">
                {t("requestSampleDesc")}
              </span>
            </div>
          </Link>
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            className="w-full h-12 border-border/80 hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
          >
            <Link
              href="/dealers"
              className="flex items-center justify-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{t("findDealer")}</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-12 border-border/80 hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
          >
            <a
              href="/catalogs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{t("downloadSpecs")}</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
