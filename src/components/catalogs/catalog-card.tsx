// src/components/catalogs/catalog-card.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/services/catalog.service";

const TYPE_LABELS: Record<string, string> = {
  full_catalog: "Full Catalog",
  technical: "Technical Specs",
  collection: "Collection Brochure",
  guide: "Care & Installation Guide",
};

function getSafeUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return "";
}

export const CatalogCard: React.FC<{ catalog: CatalogItem }> = ({
  catalog,
}) => {
  const t = useTranslations("Catalogs");

  const coverUrl =
    getSafeUrl(
      typeof catalog.cover_image === "object" && catalog.cover_image?.url
        ? catalog.cover_image.url
        : typeof catalog.cover_image === "string"
          ? catalog.cover_image
          : null,
    ) || "/PersisQuartz-Red.png";

  const pdfUrl = getSafeUrl(
    typeof catalog.pdf_file === "object" && catalog.pdf_file?.url
      ? catalog.pdf_file.url
      : typeof catalog.pdf_file === "string"
        ? catalog.pdf_file
        : null,
  );

  return (
    <div className="group flex flex-row sm:flex-col bg-card border border-border/60 hover:border-primary/80 transition-all duration-300 overflow-hidden h-36 sm:h-auto select-none">
      {/* کاور کاتالوگ */}
      <div className="relative w-28 sm:w-full shrink-0 sm:aspect-[4/3] overflow-hidden bg-muted/40 flex items-center justify-center">
        <Image
          src={coverUrl}
          alt={catalog.title || "Catalog"}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {catalog.file_size_mb && (
          <div className="absolute top-2 end-2 bg-background/90 backdrop-blur-md px-1.5 py-0.5 border border-border/50 text-[9px] sm:text-[10px] text-muted-foreground">
            {catalog.file_size_mb} MB
          </div>
        )}
      </div>

      {/* محتوا و دکمه‌ها */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between min-w-0">
        <div className="space-y-1">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-primary block truncate">
            {TYPE_LABELS[catalog.catalog_type] ||
              catalog.catalog_type ||
              "Documentation"}
          </span>
          <h4 className="text-xs sm:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {catalog.title}
          </h4>
          {catalog.description && (
            <p className="hidden sm:block text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed pt-1">
              {catalog.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2 pt-2 sm:pt-3 border-t border-border/40">
          {/* دکمه مشاهده در مرورگر */}
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={!pdfUrl}
            className="rounded-none text-[11px] sm:text-xs h-7 sm:h-9 flex-1 px-2 tracking-wider uppercase border-border/70 hover:bg-muted"
          >
            <a
              href={pdfUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 me-1.5 text-muted-foreground" />
              <span>{t("view")}</span>
            </a>
          </Button>

          {/* دکمه دانلود امن */}
          <Button
            asChild
            size="sm"
            disabled={!pdfUrl}
            className="rounded-none text-[11px] sm:text-xs h-7 sm:h-9 flex-1 px-2 tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a
              href={pdfUrl || "#"}
              download={`${catalog.slug || "catalog"}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 me-1.5" />
              <span>{t("download")}</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
