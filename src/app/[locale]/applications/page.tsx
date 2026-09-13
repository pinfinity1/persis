// src/app/[locale]/applications/page.tsx
import React from "react";
import type { Metadata } from "next";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { PinnedApplicationsShowcase } from "@/components/applications/pinned-applications-showcase";
import { ApplicationSectionsList } from "@/components/applications/application-sections-list";
import { getApplicationsPageDataService } from "@/services/application.service";
import { getTranslations } from "next-intl/server";
import {
  generateSeoMetadata,
  safeJsonLdReplacer,
  type Locale,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";
  const t = await getTranslations({
    locale: currentLocale,
    namespace: "Metadata",
  });

  return generateSeoMetadata({
    title: t("applications.title"),
    description: t("applications.description"),
    locale: currentLocale,
    path: "/applications",
  });
}

export default async function ApplicationsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  const [data, tMeta] = await Promise.all([
    getApplicationsPageDataService(currentLocale),
    getTranslations({ locale: currentLocale, namespace: "Metadata" }),
  ]);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tMeta("applications.title"),
    description: tMeta("applications.description"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.sections.map((sec, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: sec.title,
        description: sec.desc,
      })),
    },
  };

  return (
    <div className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(appSchema) }}
      />

      <div className="container mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-16 sm:pb-20 select-none">
        <PageWatermarkHeader
          watermark="APPLICATIONS"
          title="Architectural Use Cases & Spaces"
        />

        <div className="pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-4 text-start">
            <div dir="ltr" className="flex items-center justify-start gap-3">
              <span className="h-px w-6 bg-primary shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
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

      {data.showcase.length > 0 && (
        <PinnedApplicationsShowcase items={data.showcase} />
      )}

      {data.sections.length > 0 && (
        <ApplicationSectionsList sections={data.sections} />
      )}
    </div>
  );
}
