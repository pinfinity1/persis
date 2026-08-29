import React from "react";
import { MapPin, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DealerItem } from "@/services/dealer.service";

interface DealerCardProps {
  dealer: DealerItem;
}

export function DealerCard({ dealer }: DealerCardProps) {
  return (
    <div className="group flex flex-col justify-between h-full p-6 sm:p-8 bg-card/40 hover:bg-card border border-border/40 hover:border-primary/50 transition-all duration-300">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="h-px w-4 bg-primary transition-all duration-300 group-hover:w-7" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-primary">
            {dealer.city}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-medium text-foreground leading-snug min-h-[3.25rem] flex items-start mb-3">
          {dealer.title}
        </h3>

        <p className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed min-h-[3rem]">
          <MapPin className="h-4 w-4 text-primary/70 shrink-0 mt-0.5" />
          <span>{dealer.address}</span>
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-border/20">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto h-11 px-6 rounded-none border-border/60 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground text-foreground text-xs tracking-widest uppercase transition-all duration-300"
        >
          <a
            href={`tel:${dealer.phone}`}
            className="flex items-center justify-center gap-2.5"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span dir="ltr" className="text-sm tracking-wider">
              {dealer.phone}
            </span>
          </a>
        </Button>
      </div>
    </div>
  );
}
