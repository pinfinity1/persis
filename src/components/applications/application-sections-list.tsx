// src/components/applications/application-sections-list.tsx
import React from "react";
import type { ApplicationSectionDTO } from "@/services/application.service";
import { ApplicationGalleryClient } from "./application-gallery-client";

interface Props {
  sections: ApplicationSectionDTO[];
}

export const ApplicationSectionsList: React.FC<Props> = ({ sections }) => {
  return (
    <main className="container mx-auto px-4 sm:px-12 py-20 sm:py-32 space-y-24 sm:space-y-36 select-none">
      {sections.map((section) => (
        <section key={section.id} className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/40">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-primary font-bold">
                  {section.num}
                </span>
                <span className="h-px w-4 bg-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                  {section.enTag}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground tracking-tight">
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed text-justify pt-1">
                {section.desc}
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 lg:gap-4 shrink-0">
              {section.specs.map((sp, idx) => (
                <div
                  key={idx}
                  className={`p-3 bg-muted/20 border border-border/40 min-w-[130px] flex flex-col transition-colors ${
                    sp.val ? "justify-between space-y-1.5" : "justify-center"
                  }`}
                >
                  <span className="text-[11px] text-muted-foreground block font-light leading-snug">
                    {sp.label}
                  </span>
                  {sp.val && (
                    <span
                      dir="ltr"
                      className="text-xs font-mono font-medium text-foreground block text-start"
                    >
                      {sp.val}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* کامپوننت کلاینتی که فقط بخش گالری و تعاملات را هندل می‌کند */}
          <ApplicationGalleryClient
            title={section.title}
            gallery={section.gallery}
          />
        </section>
      ))}
    </main>
  );
};
