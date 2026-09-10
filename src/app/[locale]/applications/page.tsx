// src/app/[locale]/applications/page.tsx
import React from "react";
import type { Metadata } from "next";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { PinnedApplicationsShowcase } from "@/components/applications/pinned-applications-showcase";
import { ApplicationSectionsList } from "@/components/applications/application-sections-list";
import { getApplicationsPageDataService } from "@/services/application.service";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "fa"
        ? "کاربردها و فضاهای معماری | پرسیس کوارتز"
        : "Architectural Applications | Persis Quartz",
    description:
      "بررسی مشخصات فنی و کاربری اسلب‌های مهندسی‌شده پرسیس کوارتز در فضاهای مسکونی، محیط‌های بهداشتی، و پروژه‌های پرتردد تجاری.",
  };
}

export default async function ApplicationsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as "fa" | "en" | "ar") || "fa";

  const data = await getApplicationsPageDataService(currentLocale);

  return (
    <div className="relative min-h-screen bg-background">
      {/* هدر و مانیفست ادیتوریال */}
      <div className="container mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-16 sm:pb-20 select-none">
        <PageWatermarkHeader
          watermark="APPLICATIONS"
          title="Architectural Use Cases & Spaces"
        />

        <div className="pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-4 text-start">
            <div dir="ltr" className="flex items-center justify-start gap-3">
              <span className="h-px w-6 bg-primary shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-mono font-medium">
                {data.header.tag}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-[1.3]">
              {data.header.title}
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pt-8 text-start">
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed border-s-2 border-primary/30 ps-4 text-justify">
              {data.header.desc}
            </p>
          </div>
        </div>
      </div>

      {/* شوکیس پین‌شده */}
      {data.showcase.length > 0 && (
        <PinnedApplicationsShowcase items={data.showcase} />
      )}

      {/* لیست بخش‌های کاربری */}
      {data.sections.length > 0 && (
        <ApplicationSectionsList sections={data.sections} />
      )}
    </div>
  );
}
