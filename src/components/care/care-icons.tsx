// src/components/care/care-icons.tsx
"use client";

import React, { Suspense, lazy } from "react";
import type { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

const LUCIDE_NAME_MAP: Record<string, keyof typeof dynamicIconImports> = {
  droplets: "droplets",
  checkCheck: "check-check",
  shieldCheck: "shield",
  shieldAlert: "shield-alert",
  sparkles: "sparkles",
  brush: "brush",
  spray: "spray-can",
  utensils: "utensils",
  chefHat: "chef-hat",
  cookingPot: "cooking-pot",
  flame: "flame",
  heat: "thermometer-sun",
  scratch: "chef-hat",
  chemical: "flask-conical",
  impact: "shield-alert",
  hammer: "hammer",
  ban: "ban",
  balloon: "balloon",
  bicep: "biceps-flexed",
  bot: "bot",
  crown: "crown",
  castle: "castle",
  drama: "drama",
  ghost: "ghost",
  frown: "frown",
  meh: "meh",
  laugh: "laugh",
  smile: "smile",
  annoyed: "annoyed",
  smilePlus: "smile-plus",
  hand: "hand",
  handHelping: "hand-helping",
  heart: "heart",
  heartCrack: "heart-crack",
  heartPulse: "heart-pulse",
  leaf: "leaf",
  partyPopper: "party-popper",
  ribbon: "ribbon",
  salad: "salad",
  star: "star",
  starHalf: "star-half",
  starOff: "star-off",
  thumbsDown: "thumbs-down",
  thumbsUp: "thumbs-up",
  waves: "waves",
};

const iconComponentCache = new Map<
  string,
  React.LazyExoticComponent<React.ComponentType<LucideProps>>
>();

function getLazyIcon(iconName: keyof typeof dynamicIconImports) {
  let Component = iconComponentCache.get(iconName);
  if (!Component) {
    Component = lazy(dynamicIconImports[iconName]);
    iconComponentCache.set(iconName, Component);
  }
  return Component;
}

interface CareIconProps {
  name?: string;
  className?: string;
}

export const CareIcon: React.FC<CareIconProps> = ({
  name,
  className = "h-5 w-5 text-primary",
}) => {
  if (!name || name === "dot") {
    return <span className="size-2 rounded-full bg-primary block shrink-0" />;
  }

  const lucideIconName = LUCIDE_NAME_MAP[name];

  if (!lucideIconName || !dynamicIconImports[lucideIconName]) {
    return <span className="size-2 rounded-full bg-primary block shrink-0" />;
  }

  const DynamicIcon = getLazyIcon(lucideIconName);

  return (
    <Suspense
      fallback={
        <span className="size-2 rounded-full bg-primary/40 block shrink-0 animate-pulse" />
      }
    >
      <DynamicIcon className={className} />
    </Suspense>
  );
};

// نگه‌داشتن تابع قبلی برای سازگاری در جاهای دیگر
export function renderCareIcon(
  iconKey?: string,
  className = "h-5 w-5 text-primary",
) {
  return <CareIcon name={iconKey} className={className} />;
}
