// src/components/home/brand-intro.tsx
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { BrandIntroDTO } from "@/services/home.service";

interface BrandIntroProps {
  data?: BrandIntroDTO | null;
}

export const BrandIntro: React.FC<BrandIntroProps> = ({ data }) => {
  const t = useTranslations("BrandIntro");

  const title = data?.title || t("tagline");
  const description = data?.description || t("description");

  const features =
    data?.features && data.features.length === 3
      ? data.features
      : [
          {
            tag: t("feature1Tag"),
            title: t("feature1Title"),
            desc: t("feature1Desc"),
          },
          {
            tag: t("feature2Tag"),
            title: t("feature2Title"),
            desc: t("feature2Desc"),
          },
          {
            tag: t("feature3Tag"),
            title: t("feature3Title"),
            desc: t("feature3Desc"),
          },
        ];

  return (
    <section className="py-20 sm:py-32 bg-background border-b border-border/40 relative overflow-hidden select-none">
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
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground leading-relaxed sm:leading-tight tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

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

        {/* بخش ارزش‌های سه‌گانه */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 sm:pt-24 mt-16 border-t border-border/30 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group space-y-2 text-center sm:text-start"
            >
              <span className="text-[11px] tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">
                {feature.tag}
              </span>
              <h4 className="text-sm font-medium text-foreground">
                {feature.title}
              </h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
