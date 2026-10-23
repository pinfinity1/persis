// src/components/products/skeleton-loader.tsx
import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="space-y-8 select-none">
      {/* ۱. نوار وضعیت بالا (تعداد محصولات و دکمه فیلتر) */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 bg-muted/40 border border-border/40 animate-pulse" />
          <div className="h-4 w-12 bg-muted/30 rounded-none animate-pulse" />
        </div>
        <div className="h-9 w-24 bg-muted/30 border border-border/60 animate-pulse" />
      </div>

      {/* ۲. گرید متقارن و یکسان با ProductGridClient */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 w-full">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col bg-card border border-border/50 overflow-hidden h-full animate-pulse"
          >
            {/* قاب اسلب سنگ با نسبت ۳:۴ مشابه کارت اصلی */}
            <div className="relative aspect-[3/4] w-full bg-muted/30 flex items-center justify-center p-3 sm:p-5">
              <div className="w-16 h-8 bg-muted/50 rounded-none opacity-40" />
            </div>

            {/* بخش فوتر مشخصات و دکمه گوشه */}
            <div className="p-3 sm:p-4 flex items-center justify-between gap-2 border-t border-border/30 flex-1 bg-card">
              <div className="space-y-2 min-w-0 flex-1">
                {/* شبیه‌ساز کد محصول PQ */}
                <div className="h-2.5 w-14 bg-muted/60 rounded-none" />
                {/* شبیه‌ساز نام محصول */}
                <div className="h-3.5 w-24 sm:w-32 bg-muted/80 rounded-none" />
              </div>

              {/* کادر مربعی دکمه ArrowUpRight گوشه */}
              <div className="hidden sm:block size-7 lg:size-8 bg-muted/40 border border-border/40 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
