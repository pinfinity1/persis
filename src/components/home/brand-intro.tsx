// src/components/home/brand-intro.tsx
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const BrandIntro: React.FC = () => {
  const t = useTranslations("BrandIntro");

  return (
    <section className="py-20 sm:py-32 bg-background border-b border-border/40 relative overflow-hidden">
      {/* واترمارک محو با افکت بلور بسیار لایت (Soft Blur) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden">
        <div className="relative w-[120vw] sm:w-[90vw] lg:w-[75vw] h-[30vh] sm:h-[50vh] opacity-[0.06] grayscale blur-[4px]">
          <Image
            src="/PersisQuartz-Red.png"
            alt="Persis Quartz Background Logo"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* عنوان بیانیه‌ای برند */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground leading-relaxed sm:leading-tight tracking-tight">
            {t("tagline")}
          </h2>

          {/* توضیح کوتاه و دقیق */}
          <p className="text-sm sm:text-base font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>

          {/* دکمه‌های فراخوانی (CTA) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-none px-8 h-12 text-xs tracking-widest uppercase bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            >
              <Link href="/products" className="flex items-center gap-2">
                <span>{t("ctaProducts")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none px-8 h-12 text-xs tracking-widest uppercase border-border hover:bg-muted text-foreground transition-all duration-300"
            >
              <Link href="/catalogs">{t("ctaCatalogs")}</Link>
            </Button>
          </div>
        </div>

        {/* بخش آماری / ارزش‌های سه گانه */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 sm:pt-24 mt-16 border-t border-border/30 max-w-5xl mx-auto">
          <div className="group space-y-2 text-center sm:text-start">
            <span className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase group-hover:text-primary">
              01 / Material
            </span>
            <h4 className="text-sm font-medium text-foreground">
              {t("feature1Title")}
            </h4>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              {t("feature1Desc")}
            </p>
          </div>

          <div className="group space-y-2 text-center sm:text-start">
            <span className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase group-hover:text-primary">
              02 / Design
            </span>
            <h4 className="text-sm font-medium text-foreground">
              {t("feature2Title")}
            </h4>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              {t("feature2Desc")}
            </p>
          </div>

          <div className="group space-y-2 text-center sm:text-start">
            <span className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase group-hover:text-primary">
              03 / Guarantee
            </span>
            <h4 className="text-sm font-medium text-foreground">
              {t("feature3Title")}
            </h4>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              {t("feature3Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
