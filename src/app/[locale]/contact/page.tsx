import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactFormClient } from "@/components/contact/contact-form-client";
import {
  Phone,
  Mail,
  Factory,
  Clock,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/PersisQuartz-Red.png"],
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <main className="min-h-screen bg-background pt-28 sm:pt-36 pb-20 select-none">
      <div className="container mx-auto px-4 sm:px-12 space-y-10 sm:space-y-14">
        {/* واترمارک معمارانه هدر */}
        <div
          dir="ltr"
          className="relative pt-4 pb-2 overflow-hidden border-b border-border/30"
        >
          <span className="text-4xl sm:text-7xl lg:text-9xl font-black text-foreground/[0.03] uppercase tracking-tighter leading-none block">
            CONTACT
          </span>
          <div className="absolute bottom-4 start-0 z-10 flex items-center gap-3">
            <span className="h-px w-6 bg-primary" />
            <h1 className="text-[10px] sm:text-[11px] tracking-[0.25em] text-primary uppercase m-0 leading-none font-medium">
              Client Services & Global Inquiries
            </h1>
          </div>
        </div>

        {/* گرید تقارن‌دار اسپلیت اسکرین */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ستون اطلاعات ارتباطی و کارخانه */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-light text-foreground">
                {t("infoTitle")}
              </h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {t("infoDesc")}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* کارخانه */}
              <div className="p-4 bg-card border border-border/50 space-y-2 group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 text-primary">
                  <Factory className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                    {t("factoryTitle")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {t("factoryAddress")}
                </p>
              </div>

              {/* تلفن کارخانه */}
              <div className="p-4 bg-card border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                      {t("phoneTitle")}
                    </span>
                    <a
                      href="tel:+983832281752"
                      dir="ltr"
                      className="text-xs text-foreground hover:text-primary transition-colors"
                    >
                      +98 38 3228 1752
                    </a>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </div>

              {/* ایمیل مرکزی */}
              <div className="p-4 bg-card border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                      {t("emailTitle")}
                    </span>
                    <a
                      href="mailto:info@persisquartz.com"
                      dir="ltr"
                      className="text-xs text-foreground hover:text-primary transition-colors"
                    >
                      info@persisquartz.com
                    </a>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </div>
            </div>
          </div>

          {/* ستون فرم و تعاملات */}
          {/* ستون فرم و تعاملات با لودینگ آیکون‌دار */}
          <div className="lg:col-span-8 bg-card border border-border/60 p-5 sm:p-8 shadow-sm">
            <Suspense
              fallback={
                <div className="h-96 flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground">
                  <div className="relative size-10 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                    <span className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                </div>
              }
            >
              <ContactFormClient />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
