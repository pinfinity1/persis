// src/components/home/interactive-tools.tsx
"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export const InteractiveTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDealerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dealers?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1: Dealers Locator */}
          <div className="bg-card border border-border p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                DEALERS LOCATOR
              </span>
              <h3 className="text-2xl font-light text-foreground">
                یافتن نزدیک‌ترین نمایندگی
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                جهت مشاهده نزدیک‌ترین شوروم و خرید حضوری محصولات برند پرسیس
                کوارتز، شهر یا کدپستی خود را وارد کنید.
              </p>
            </div>

            <form onSubmit={handleDealerSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="نام شهر یا کد پستی..."
                className="flex-1 bg-background border border-input px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Button type="submit" className="rounded-none px-6">
                جستجو
              </Button>
            </form>
          </div>

          {/* Card 2: Request a Sample */}
          <div className="bg-card border border-border p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                SAMPLES
              </span>
              <h3 className="text-2xl font-light text-foreground">
                درخواست نمونه محصول (Sample Box)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                برای معماران و طراحان داخلی؛ دریافت پکیج لمسی نمونه کوارتز جهت
                بررسی کیفیت، رنگ و بافت متریال از نزدیک.
              </p>
            </div>

            <div>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 h-auto"
              >
                <Link href="/contact?type=sample">ثبت سفارش نمونه</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
