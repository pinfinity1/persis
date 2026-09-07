// src/components/care/routine-accordion.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderCareIcon } from "@/components/care/care-icons";
import type { CareStepDTO } from "@/services/care.service";

interface RoutineAccordionProps {
  sectionTag: string;
  sectionTitle: string;
  items: CareStepDTO[];
  mediaSrc?: string | null;
}

export const RoutineAccordion: React.FC<RoutineAccordionProps> = ({
  sectionTag,
  sectionTitle,
  items,
  mediaSrc,
}) => {
  const [openId, setOpenId] = useState<string>(items[0]?.id || "");
  const isPlaceholder = !mediaSrc || mediaSrc === "/PersisQuartz-Red.png";

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <section className="container mx-auto px-6 sm:px-12 pt-20 sm:pt-24">
      <div className="mb-10 space-y-1">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary block">
          {sectionTag}
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-foreground">
          {sectionTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ۱. کادر مدیا همراه با سنترسازی هندسی شیک در حالت Placeholder */}
        <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
          <div
            className={cn(
              "relative aspect-[4/3] sm:aspect-square w-full border border-border/60 overflow-hidden flex items-center justify-center transition-all duration-300",
              isPlaceholder ? "bg-muted/15" : "bg-muted/40",
            )}
          >
            {isPlaceholder ? (
              <div className="relative w-3/5 h-2/5 flex items-center justify-center pointer-events-none select-none">
                <Image
                  src="/PersisQuartz-Red.png"
                  alt="Persis Quartz Brand Logo"
                  fill
                  sizes="320px"
                  className="object-contain opacity-25 grayscale contrast-75"
                />
              </div>
            ) : (
              <Image
                src={mediaSrc}
                alt="Care and Maintenance"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </div>

        {/* ۲. لیست آکاردئون‌ها با قابلیت رندر تمامی آیکون‌ها و نقطه لوکس */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const stepDisplayNumber =
              item.stepNumber || `STEP ${String(index + 1).padStart(2, "0")}`;

            return (
              <div
                key={item.id}
                className={cn(
                  "border bg-card transition-colors duration-200",
                  isOpen
                    ? "border-primary/60"
                    : "border-border/60 hover:border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-start gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={cn(
                        "size-10 shrink-0 border flex items-center justify-center transition-colors",
                        isOpen
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-primary border-border/50",
                      )}
                    >
                      {renderCareIcon(
                        item.iconName,
                        cn(
                          "h-4 w-4",
                          isOpen ? "text-primary-foreground" : "text-primary",
                        ),
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-mono">
                        {stepDisplayNumber}
                      </span>
                      <h3 className="text-sm sm:text-base font-medium text-foreground truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-200 ease-in-out px-5 sm:px-6",
                    isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] pb-0 opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-light text-muted-foreground leading-relaxed pt-2 border-t border-border/30 text-justify">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
