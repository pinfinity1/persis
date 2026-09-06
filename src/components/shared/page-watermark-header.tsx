import React from "react";
import { cn } from "@/lib/utils";

export interface PageWatermarkHeaderProps {
  watermark: string;
  title: string;
  asHeading?: "h1" | "h2" | "h3";
  className?: string;
}

export const PageWatermarkHeader: React.FC<PageWatermarkHeaderProps> = ({
  watermark,
  title,
  asHeading: HeadingTag = "h1",
  className,
}) => {
  return (
    <div
      dir="ltr"
      className={cn(
        "relative py-4 select-none overflow-hidden border-b border-border/30",
        className,
      )}
    >
      {/* واترمارک کم‌رنگ بزرگ */}
      <span
        aria-hidden="true"
        className="text-4xl sm:text-7xl lg:text-9xl font-black text-foreground/[0.03] uppercase tracking-tighter leading-none block select-none pointer-events-none"
      >
        {watermark}
      </span>

      {/* عنوان اصلی همراه با خط نشانگر قرمز */}
      <div className="absolute bottom-4 start-0 z-10 flex items-center gap-3">
        <span className="h-px w-6 bg-primary shrink-0" aria-hidden="true" />
        <HeadingTag className="text-[10px] sm:text-[11px] tracking-[0.25em] text-primary uppercase m-0 leading-none font-medium">
          {title}
        </HeadingTag>
      </div>
    </div>
  );
};
