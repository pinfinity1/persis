"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CatalogItem } from "@/services/catalog.service";

const TYPE_LABELS: Record<string, string> = {
  full_catalog: "Full Catalog",
  technical: "Technical Specs",
  collection: "Collection Brochure",
  guide: "Care & Installation Guide",
};

export const CatalogCard: React.FC<{ catalog: CatalogItem }> = ({
  catalog,
}) => {
  const t = useTranslations("Catalogs");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const coverUrl =
    typeof catalog.cover_image === "object" && catalog.cover_image?.url
      ? catalog.cover_image.url
      : typeof catalog.cover_image === "string" && catalog.cover_image
        ? catalog.cover_image
        : "/PersisQuartz-Red.png";

  const pdfUrl =
    typeof catalog.pdf_file === "object" && catalog.pdf_file?.url
      ? catalog.pdf_file.url
      : typeof catalog.pdf_file === "string"
        ? catalog.pdf_file
        : "";

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${catalog.slug || "catalog"}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="group flex flex-row sm:flex-col bg-card border border-border/60 hover:border-primary/80 transition-all duration-300 overflow-hidden h-36 sm:h-auto select-none">
        {/* کاور */}
        <div className="relative w-28 sm:w-full shrink-0 sm:aspect-[4/3] overflow-hidden bg-muted/40 flex items-center justify-center">
          <Image
            src={coverUrl}
            alt={catalog.title || "Catalog"}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {catalog.file_size_mb && (
            <div className="absolute top-2 end-2 bg-background/90 backdrop-blur-md px-1.5 py-0.5 border border-border/50 text-[9px] sm:text-[10px] font-mono text-muted-foreground">
              {catalog.file_size_mb} MB
            </div>
          )}
        </div>

        {/* محتوا و دکمه‌ها */}
        <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between min-w-0">
          <div className="space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-primary font-mono block truncate">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="rounded-none text-[11px] sm:text-xs h-7 sm:h-9 flex-1 px-2 tracking-wider uppercase border-border/70 hover:bg-muted"
            >
              <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 me-1.5 text-muted-foreground" />
              <span>{t("view")}</span>
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              className="rounded-none text-[11px] sm:text-xs h-7 sm:h-9 flex-1 px-2 tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 me-1.5" />
              <span>{t("download")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* مدال پیش‌نمایش */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-5xl h-[85vh] flex flex-col p-4 sm:p-6 rounded-none bg-background">
          <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <DialogTitle className="text-sm sm:text-base font-normal truncate">
                {catalog.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {catalog.file_size_mb ? `${catalog.file_size_mb} MB` : ""}
              {catalog.page_count ? ` • ${catalog.page_count} Pages` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 w-full h-full bg-muted/20 border border-border/40 overflow-hidden relative mt-2">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title={catalog.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                {t("previewNotAvailable")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
