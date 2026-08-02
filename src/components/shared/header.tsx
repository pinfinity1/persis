// src/components/shared/header.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Menu,
  X,
  PhoneCall,
  Search,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileAppsOpen, setIsMobileAppsOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === "/" || pathname === `/${locale}`;
  const isRtl = locale === "fa" || locale === "ar";

  // قفل کردن اسکرول صفحه هنگام باز بودن کشوی موبایل
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // سنجش اسکرول با IntersectionObserver و useRef
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // اگر المان بالای صفحه دیده می‌شود => isScrolled = false (هدر شفاف)
        // اگر المان بالای صفحه از دید خارج شد => isScrolled = true (هدر کدر/تیره)
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      },
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [isHomePage]);

  const handleLanguageChange = (newLocale: "fa" | "en" | "ar") => {
    router.replace(pathname, { locale: newLocale });
  };

  const languages = [
    { code: "fa", label: "فارسی" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ] as const;

  const navLinkStyle = cn(
    "text-sm font-medium transition-colors hover:opacity-80 py-2 px-3 rounded-md",
    isHomePage && !isScrolled
      ? "text-white hover:bg-white/10"
      : "text-foreground hover:bg-accent/50",
  );

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* المان مرزی سنجش اسکرول - قرارگیری در بالای جریان DOM */}
      {isHomePage && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
        />
      )}

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500",
          isHomePage && !isScrolled
            ? "bg-transparent border-transparent text-white"
            : "border-b border-border/40 bg-background/95 backdrop-blur-md text-foreground shadow-sm",
        )}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-12">
          {/* ۱. لوگو */}
          <Logo variant="full" className="w-36 sm:w-44" />

          {/* ۲. منوی دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-1">
            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger
                className={cn(
                  navLinkStyle,
                  "flex items-center gap-1.5 outline-none cursor-pointer",
                )}
              >
                <span>{t("products")}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[560px] p-5 grid grid-cols-3 gap-4 border border-border/40 shadow-xl bg-popover"
              >
                <Link
                  href="/products?cat=monocolor"
                  className="group p-2.5 rounded-md hover:bg-muted/60 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground block mb-1">
                      01
                    </span>
                    <h5 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t("monocolorSeries")}
                    </h5>
                    <p className="text-[11px] text-muted-foreground font-light leading-relaxed mt-1.5">
                      {t("monocolorDesc")}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/products?cat=veined-effect"
                  className="group p-2.5 rounded-md hover:bg-muted/60 transition-colors flex flex-col justify-between border-x border-border/30 px-3"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground block mb-1">
                      02
                    </span>
                    <h5 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t("veinedEffectSeries")}
                    </h5>
                    <p className="text-[11px] text-muted-foreground font-light leading-relaxed mt-1.5">
                      {t("veinedEffectDesc")}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/products?cat=calacatta"
                  className="group p-2.5 rounded-md hover:bg-muted/60 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground block mb-1">
                      03
                    </span>
                    <h5 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t("calacattaSeries")}
                    </h5>
                    <p className="text-[11px] text-muted-foreground font-light leading-relaxed mt-1.5">
                      {t("calacattaDesc")}
                    </p>
                  </div>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger
                className={cn(
                  navLinkStyle,
                  "flex items-center gap-1.5 outline-none cursor-pointer",
                )}
              >
                <span>{t("applications")}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-72 p-3 bg-popover border border-border/40 shadow-xl space-y-1"
              >
                <Link
                  href="/applications/kitchen"
                  className="flex flex-col gap-1 p-3 rounded-md hover:bg-muted/70 transition-colors"
                >
                  <span className="text-xs font-semibold text-foreground">
                    {t("kitchenCountertops")}
                  </span>
                </Link>

                <div className="h-[1px] bg-border/40 my-1" />

                <Link
                  href="/applications/bathroom"
                  className="flex flex-col gap-1 p-3 rounded-md hover:bg-muted/70 transition-colors"
                >
                  <span className="text-xs font-semibold text-foreground">
                    {t("vanitiesAndBathrooms")}
                  </span>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dealers" className={navLinkStyle}>
              {t("dealers")}
            </Link>

            <Link href="/catalogs" className={navLinkStyle}>
              {t("catalogs")}
            </Link>

            <Link href="/care-and-maintenance" className={navLinkStyle}>
              {t("careAndMaintenance")}
            </Link>

            <Link href="/about" className={navLinkStyle}>
              {t("about")}
            </Link>
          </nav>

          {/* ۳. دکمه‌های اکشن */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:text-foreground",
                isHomePage &&
                  !isScrolled &&
                  "text-white hover:bg-white/10 hover:text-white",
              )}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "hover:text-foreground hidden sm:inline-flex",
                isHomePage &&
                  !isScrolled &&
                  "text-white hover:bg-white/10 hover:text-white",
              )}
              title={t("contactUs")}
            >
              <Link href="/contact">
                <PhoneCall className="h-4 w-4" />
              </Link>
            </Button>

            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1 px-2 font-mono text-xs outline-none hidden sm:inline-flex",
                    isHomePage &&
                      !isScrolled &&
                      "text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Globe className="h-3.5 w-3.5 opacity-80" />
                  <span className="uppercase font-bold">{locale}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "justify-between text-xs cursor-pointer",
                      locale === lang.code && "font-bold text-primary",
                    )}
                  >
                    {lang.label}
                    <span className="uppercase font-mono text-[10px] text-muted-foreground">
                      {lang.code}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* دکمه منوی همبرگری موبایل */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "lg:hidden p-2 focus:outline-none transition-colors rounded-md",
                isHomePage && !isScrolled
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-accent",
              )}
              aria-label="Open Mobile Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ۴. کشوی موبایل */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div
          className={cn(
            "absolute top-0 bottom-0 w-[85%] max-w-md bg-background border-e border-border/40 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
            isRtl ? "right-0" : "left-0",
            isMobileMenuOpen
              ? "translate-x-0"
              : isRtl
                ? "translate-x-full"
                : "-translate-x-full",
          )}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-6">
              <Logo variant="full" className="w-32" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close Mobile Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4">
              <div className="border-b border-border/50 pb-3">
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="flex items-center justify-between w-full py-2 text-base font-medium text-foreground text-start"
                >
                  <span>{t("products")}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isMobileProductsOpen && "rotate-180",
                    )}
                  />
                </button>

                {isMobileProductsOpen && (
                  <div className="flex flex-col gap-3 pt-3 ps-4 text-sm font-light text-muted-foreground">
                    <Link
                      href="/products?cat=monocolor"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                    >
                      <span>{t("monocolorSeries")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                    </Link>

                    <Link
                      href="/products?cat=veined-effect"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                    >
                      <span>{t("veinedEffectSeries")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                    </Link>

                    <Link
                      href="/products?cat=calacatta"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                    >
                      <span>{t("calacattaSeries")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-b border-border/50 pb-3">
                <button
                  onClick={() => setIsMobileAppsOpen(!isMobileAppsOpen)}
                  className="flex items-center justify-between w-full py-2 text-base font-medium text-foreground text-start"
                >
                  <span>{t("applications")}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isMobileAppsOpen && "rotate-180",
                    )}
                  />
                </button>

                {isMobileAppsOpen && (
                  <div className="flex flex-col gap-3 pt-3 ps-4 text-sm font-light text-muted-foreground">
                    <Link
                      href="/applications/kitchen"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                    >
                      <span>{t("kitchenCountertops")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                    </Link>

                    <Link
                      href="/applications/bathroom"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                    >
                      <span>{t("vanitiesAndBathrooms")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/dealers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors"
              >
                {t("dealers")}
              </Link>

              <Link
                href="/catalogs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors"
              >
                {t("catalogs")}
              </Link>

              <Link
                href="/care-and-maintenance"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors"
              >
                {t("careAndMaintenance")}
              </Link>

              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-foreground py-2 border-b border-border/50 hover:text-primary transition-colors"
              >
                {t("about")}
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-semibold text-primary py-2"
              >
                {t("contactUs")}
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-border/60 space-y-3 mt-6">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono block">
              زبان / Language
            </span>
            <div className="flex items-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium border transition-colors rounded-sm",
                    locale === lang.code
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
