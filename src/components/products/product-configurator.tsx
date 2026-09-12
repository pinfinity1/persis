// src/components/products/product-configurator.tsx
"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Box, MapPin, FileText, Share2, Check } from "lucide-react";
import type { ProductItemDTO } from "@/services/product.service";

interface ProductConfiguratorProps {
  product: ProductItemDTO;
  categoryTitle: string;
}

export function ProductConfigurator({
  product,
  categoryTitle,
}: ProductConfiguratorProps) {
  const t = useTranslations("ProductDetail");
  const [copied, setCopied] = useState(false);

  const sampleUrl = `/contact?type=sample&code=${encodeURIComponent(
    product.code || "",
  )}`;

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-[580px] select-none">
      <div className="space-y-7">
        {/* ۱. کد محصول و دکمه اشتراک‌گذاری */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/30">
          <span className="text-sm font-semibold tracking-wider text-primary">
            {t("codePrefix")} {product.code}
          </span>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
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

        {/* ۲. عنوان اسلب */}
        <div className="space-y-5">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-none">
            {product.title}
          </h1>

          {/* ۳. کادر مشخصات هویتی ۳ زبانه */}
          <div className="border-s-2 border-primary ps-5 py-3 space-y-2 bg-muted/10">
            {product.color_family?.title && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground">
                  {t("colorLabel")}:
                </span>
                <span className="text-xs font-medium text-foreground capitalize">
                  {product.color_family.title}
                </span>
              </div>
            )}

            {categoryTitle && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground">
                  {t("categoryLabel")}:
                </span>
                <span className="text-xs font-medium text-foreground">
                  {categoryTitle}
                </span>
              </div>
            )}
          </div>

          {/* ۴. متن کانسپت و معرفی محصول */}
          {product.description && (
            <p className="text-xs sm:text-sm font-light text-muted-foreground leading-loose text-justify pt-1 max-w-xl">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* ۵. دکمه‌های اقدام */}
      <div className="space-y-3 pt-6 border-t border-border/20 mt-auto">
        <Button
          asChild
          size="lg"
          className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs sm:text-sm tracking-wider uppercase font-medium shadow-xs"
        >
          <Link
            href={sampleUrl}
            className="flex items-center justify-center gap-3"
          >
            <Box className="h-4 w-4 shrink-0" />
            <div className="text-start">
              <span>{t("requestSample")}</span>
              <span className="block text-[10px] font-light opacity-80">
                {t("requestSampleDesc")}
              </span>
            </div>
          </Link>
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            className="w-full h-11 border-border hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
          >
            <Link
              href="/dealers"
              className="flex items-center justify-center gap-2"
            >
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{t("findDealer")}</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-11 border-border hover:bg-muted text-foreground rounded-none text-xs tracking-wider uppercase"
          >
            <Link
              href="/catalogs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{t("downloadSpecs")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
