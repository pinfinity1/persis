import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Maximize2,
  Layers,
  Sparkles,
  Utensils,
  Bath,
  Building2,
} from "lucide-react";

interface ProductSpecsMatrixProps {
  locale: string;
  dimensions?: string[];
  thicknesses?: string[];
  finishes?: string[];
}

export async function ProductSpecsMatrix({
  locale,
  dimensions = [],
  thicknesses = [],
  finishes = [],
}: ProductSpecsMatrixProps) {
  const tDetail = await getTranslations({ locale, namespace: "ProductDetail" });
  const tInfo = await getTranslations({ locale, namespace: "InfoCards" });

  const sortedThicknesses = [...thicknesses].sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10),
  );

  const techDetails = [
    {
      icon: Maximize2,
      title: tDetail("specDimensionsTitle"),
      desc: dimensions.length > 0 ? dimensions.join("   |   ") : "—",
      isLtr: true,
    },
    {
      icon: Layers,
      title: tDetail("specThicknessTitle"),
      desc:
        sortedThicknesses.length > 0 ? sortedThicknesses.join("   |   ") : "—",
      isLtr: true,
    },
    {
      icon: Sparkles,
      title: tDetail("specFinishesTitle"),
      desc: finishes.length > 0 ? finishes.join("   |   ") : "—",
      isLtr: false,
    },
  ];

  const featuresList = [
    { label: tInfo("featScratch"), icon: "/icons/scratch.png" },
    { label: tInfo("featStain"), icon: "/icons/stain.png" },
    { label: tInfo("featImpact"), icon: "/icons/impact.png" },
    { label: tInfo("featImpermeable"), icon: "/icons/dense.png" },
    { label: tInfo("featAntibacterial"), icon: "/icons/antibacterial.png" },
    { label: tInfo("featEasyClean"), icon: "/icons/easyclean.png" },
  ];

  const applications = [
    {
      title: tDetail("appKitchen"),
      desc: tDetail("appKitchenDesc"),
      icon: Utensils,
    },
    {
      title: tDetail("appVanity"),
      desc: tDetail("appVanityDesc"),
      icon: Bath,
    },
    {
      title: tDetail("appCommercial"),
      desc: tDetail("appCommercialDesc"),
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-16 pt-12 border-t border-border/40">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-primary font-bold block">
            {tDetail("techTitle")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-foreground">
            {tDetail("techSubtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {techDetails.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-card border border-border/50 space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="p-2.5 bg-muted/40 w-fit border border-border/40 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {item.title}
                  </h3>
                  <p
                    dir={item.isLtr ? "ltr" : undefined}
                    className={`text-sm text-primary font-medium tracking-wide ${
                      item.isLtr ? "text-start" : ""
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {featuresList.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-muted/20 border border-border/40 flex flex-col items-center text-center gap-3 group hover:border-primary/50 hover:bg-card transition-all"
          >
            <div className="relative h-8 w-8 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <Image
                src={item.icon}
                alt={item.label}
                fill
                className="object-contain dark:invert"
              />
            </div>
            <span className="text-xs font-light text-foreground leading-snug">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-primary" />
          <h2 className="text-xl sm:text-2xl font-light text-foreground">
            {tDetail("applicationsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {applications.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-card border border-border/50 space-y-3.5 hover:border-primary/60 transition-all group"
              >
                <div className="p-3 bg-muted/40 w-fit border border-border/40 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-foreground">
                    {app.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
