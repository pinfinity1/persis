// src/app/[locale]/care-and-maintenance/page.tsx
import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { RoutineAccordion } from "@/components/care/routine-accordion";
import { getCarePageDataService } from "@/services/care.service";
import { CareIcon } from "@/components/care/care-icons";
import { ArrowUpRight, FileText } from "lucide-react";
import {
  safeJsonLdReplacer,
  generateSeoMetadata,
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
    title: t("care.title"),
    description: t("care.description"),
    locale: currentLocale,
    path: "/care-and-maintenance",
  });
}

export default async function CareAndMaintenancePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  const [t, careData] = await Promise.all([
    getTranslations({ locale: currentLocale, namespace: "CareMaintenance" }),
    getCarePageDataService(currentLocale),
  ]);

  const engineeredFeatures = [
    { label: t("featScratch"), icon: "/icons/scratch.png" },
    { label: t("featStain"), icon: "/icons/stain.png" },
    { label: t("featImpact"), icon: "/icons/impact.png" },
    { label: t("featImpermeable"), icon: "/icons/dense.png" },
    { label: t("featAntibacterial"), icon: "/icons/antibacterial.png" },
    { label: t("featEasyClean"), icon: "/icons/easyclean.png" },
  ];

  const defaultRoutineSteps = [
    {
      id: "step-1",
      stepNumber: t("step1Tag"),
      title: t("firstCleanTitle"),
      desc: t("firstCleanDesc"),
      iconName: "checkCheck",
    },
    {
      id: "step-2",
      stepNumber: t("step2Tag"),
      title: t("dailyCareTitle"),
      desc: t("dailyCareDesc"),
      iconName: "droplets",
    },
    {
      id: "step-3",
      stepNumber: t("step3Tag"),
      title: t("stainsTitle"),
      desc: t("stainsDesc"),
      iconName: "shieldCheck",
    },
  ];

  const defaultRules = [
    {
      id: "rule-1",
      title: t("scratchProtTitle"),
      desc: t("scratchProtDesc"),
      iconType: "scratch",
    },
    {
      id: "rule-2",
      title: t("heatProtTitle"),
      desc: t("heatProtDesc"),
      iconType: "heat",
    },
    {
      id: "rule-3",
      title: t("chemicalsProtTitle"),
      desc: t("chemicalsProtDesc"),
      iconType: "chemical",
    },
    {
      id: "rule-4",
      title: t("edgesProtTitle"),
      desc: t("edgesProtDesc"),
      iconType: "impact",
    },
  ];

  const finalRoutineSteps =
    careData.steps.length > 0 ? careData.steps : defaultRoutineSteps;
  const finalRules = careData.rules.length > 0 ? careData.rules : defaultRules;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...finalRoutineSteps.map((step) => ({
        "@type": "Question",
        name: step.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: step.desc,
        },
      })),
      ...finalRules.map((rule) => ({
        "@type": "Question",
        name: rule.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: rule.desc,
        },
      })),
    ],
  };

  return (
    <main className="min-h-screen bg-background pb-20 sm:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(faqJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-12 pt-28 sm:pt-36 pb-2">
        <PageWatermarkHeader watermark="MAINTENANCE" title={t("tagline")} />
      </div>

      <section className="container mx-auto px-6 sm:px-12 pt-16 sm:pt-20">
        <div className="mb-8 space-y-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
            {t("sectionDnaTag")}
          </span>
          <h1 className="text-xl sm:text-2xl font-light text-foreground">
            {t("featuresSectionTitle")}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {engineeredFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-card border border-border/60 flex flex-col items-center text-center gap-3.5 group hover:border-primary/60 transition-all duration-300"
            >
              <div className="relative h-9 w-9 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  sizes="36px"
                  className="object-contain dark:invert"
                />
              </div>
              <span className="text-xs font-light text-foreground leading-snug">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <RoutineAccordion
        sectionTag={t("sectionRoutineTag")}
        sectionTitle={t("routineSectionTitle")}
        items={finalRoutineSteps}
        mediaSrc={careData.mediaSrc}
      />

      <section className="container mx-auto px-6 sm:px-12 pt-20 sm:pt-24">
        <div className="bg-neutral-950 text-neutral-200 border border-neutral-800 p-8 sm:p-14 lg:p-16">
          <div className="max-w-2xl mb-12 sm:mb-16 space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
              {t("sectionRulesTag")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
              {t("dosAndDontsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {finalRules.map((rule) => (
              <div
                key={rule.id}
                className="flex gap-5 items-start p-6 bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <div className="shrink-0 size-11 bg-neutral-900 border border-neutral-700/60 flex items-center justify-center">
                  <CareIcon
                    name={rule.iconType}
                    className="h-5 w-5 text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-medium text-white tracking-wide">
                    {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed text-justify">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 sm:px-12 pt-16 sm:pt-20">
        <div className="p-8 sm:p-12 bg-card border border-border/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-lg sm:text-xl font-medium text-foreground">
              {t("ctaTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-xl">
              {t("ctaDesc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none text-xs uppercase tracking-wider h-11 px-6 border-border hover:bg-muted"
            >
              <Link href="/catalogs" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{t("ctaCatalogBtn")}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="rounded-none text-xs uppercase tracking-wider h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <span>{t("ctaContactBtn")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
