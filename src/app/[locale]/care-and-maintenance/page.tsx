import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  RoutineAccordion,
  type StepItem,
} from "@/components/care/routine-accordion";
import {
  ChefHat,
  ThermometerSun,
  TestTubeDiagonal,
  ShieldAlert,
  ArrowUpRight,
  FileText,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareMaintenance" });

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

export default async function CareAndMaintenancePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareMaintenance" });

  const engineeredFeatures = [
    { label: t("featScratch"), icon: "/icons/scratch.png" },
    { label: t("featStain"), icon: "/icons/stain.png" },
    { label: t("featImpact"), icon: "/icons/impact.png" },
    { label: t("featImpermeable"), icon: "/icons/dense.png" },
    { label: t("featAntibacterial"), icon: "/icons/antibacterial.png" },
    { label: t("featEasyClean"), icon: "/icons/easyclean.png" },
  ];

  const routineSteps: StepItem[] = [
    {
      id: "step-1",
      stepNumber: t("step1Tag"),
      title: t("firstCleanTitle"),
      desc: t("firstCleanDesc"),
      iconName: "CheckCheck",
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

  return (
    <main className="min-h-screen bg-background pb-20 sm:pb-32 select-none">
      {/* 1. Header Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-muted/20 border-b border-border/40 overflow-hidden">
        <div
          aria-hidden="true"
          dir="ltr"
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] select-none"
        >
          <span className="text-[13.5vw] font-black uppercase tracking-tighter text-foreground leading-none whitespace-nowrap block">
            MAINTENANCE
          </span>
        </div>

        <div className="container mx-auto px-6 sm:px-12 relative z-10 text-center max-w-4xl space-y-5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-primary" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
              {t("tagline")}
            </span>
            <span className="h-px w-6 bg-primary" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
            {t("title")}
          </h1>

          <p className="text-xs sm:text-base font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* 2. Material DNA Grid */}
      <section className="container mx-auto px-6 sm:px-12 pt-16 sm:pt-20">
        <div className="mb-8 space-y-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
            {t("sectionDnaTag")}
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-foreground">
            {t("featuresSectionTitle")}
          </h2>
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

      {/* 3. Routine Accordion */}
      <RoutineAccordion
        sectionTag={t("sectionRoutineTag")}
        sectionTitle={t("routineSectionTitle")}
        items={routineSteps}
        mediaSrc="/PersisQuartz-Red.png"
      />

      {/* 4. Dark Preventive Rules Box */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="flex gap-5 items-start p-6 bg-neutral-900/50 border border-neutral-800/80">
              <div className="shrink-0 p-3 bg-neutral-900 border border-neutral-700/60 text-neutral-300">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                  {t("scratchProtTitle")}
                </h4>
                <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
                  {t("scratchProtDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start p-6 bg-neutral-900/50 border border-neutral-800/80">
              <div className="shrink-0 p-3 bg-neutral-900 border border-neutral-700/60 text-neutral-300">
                <ThermometerSun className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                  {t("heatProtTitle")}
                </h4>
                <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
                  {t("heatProtDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start p-6 bg-neutral-900/50 border border-neutral-800/80">
              <div className="shrink-0 p-3 bg-neutral-900 border border-neutral-700/60 text-neutral-300">
                <TestTubeDiagonal className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                  {t("chemicalsProtTitle")}
                </h4>
                <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
                  {t("chemicalsProtDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start p-6 bg-neutral-900/50 border border-neutral-800/80">
              <div className="shrink-0 p-3 bg-neutral-900 border border-neutral-700/60 text-neutral-300">
                <ShieldAlert className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-white tracking-wide">
                  {t("edgesProtTitle")}
                </h4>
                <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
                  {t("edgesProtDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
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
