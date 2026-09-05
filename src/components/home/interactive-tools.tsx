import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MapPin } from "lucide-react";
import { QuickInquiryForm } from "./quick-inquiry-form";

export const InteractiveTools: React.FC = () => {
  const t = useTranslations("InteractiveTools");

  return (
    <section className="py-12 sm:py-20 bg-background border-b border-border/40 select-none">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-widest text-primary block mb-1.5 font-semibold">
            {t("tagline")}
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-foreground">
            {t("title")}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-card border border-border/60 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300">
            <div className="relative w-full h-52 bg-muted/20 p-4 flex items-center justify-center border-b border-border/40 overflow-hidden">
              <Image
                src="/iran-map.png"
                alt="Persis Quartz Dealer Network"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-4 opacity-80 dark:invert transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-6">
              <div className="space-y-3">
                <div className="p-2 bg-muted/50 w-fit border border-border/50 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-light text-foreground">
                  {t("dealerTitle")}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  {t("dealerDesc")}
                </p>
              </div>

              <Button
                asChild
                className="w-full sm:w-auto rounded-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider"
              >
                <Link
                  href="/dealers"
                  className="flex items-center justify-between gap-3"
                >
                  <span>{t("viewDealersBtn")}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-card border border-border/60 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-colors duration-300">
            <div className="space-y-1.5">
              <h4 className="text-lg sm:text-xl font-light text-foreground">
                {t("projectTitle")}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                {t("projectDesc")}
              </p>
            </div>
            {/* لود کردن فرم تماس تفکیک شده */}
            <QuickInquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
};
