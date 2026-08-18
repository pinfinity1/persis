"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCheck, Droplets, ShieldCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCheck: CheckCheck,
  droplets: Droplets,
  shieldCheck: ShieldCheck,
};

export interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  iconName: "CheckCheck" | "droplets" | "shieldCheck";
}

interface RoutineAccordionProps {
  sectionTag: string;
  sectionTitle: string;
  items: StepItem[];
  mediaSrc?: string;
}

export const RoutineAccordion: React.FC<RoutineAccordionProps> = ({
  sectionTag,
  sectionTitle,
  items,
  mediaSrc = "/PersisQuartz-Red.png",
}) => {
  const [openId, setOpenId] = useState<string>(items[0]?.id || "");

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 w-full">
          <div className="relative aspect-[4/3] sm:aspect-square w-full bg-muted/40 border border-border/60 overflow-hidden">
            <Image
              src={mediaSrc}
              alt="Persis Quartz Routine Care"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const Icon = ICON_MAP[item.iconName] || Droplets;

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
                        "p-2.5 shrink-0 border transition-colors",
                        isOpen
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-primary border-border/50",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                        {item.stepNumber}
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
                    <p className="text-xs sm:text-sm font-light text-muted-foreground leading-relaxed pt-2 border-t border-border/30">
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
