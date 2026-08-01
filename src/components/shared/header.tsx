// src/components/shared/header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, PhoneCall, Search, ChevronDown } from "lucide-react";
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

  const isHomePage = pathname === "/" || pathname === `/${locale}`;
  const isRtl = locale === "fa" || locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        isHomePage && !isScrolled
          ? "bg-transparent border-transparent text-white"
          : "border-b border-border/40 bg-background/95 backdrop-blur-md text-foreground shadow-sm",
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-12">
        {/* ۱. لوگو */}
        <Logo variant="full" className="w-36 sm:w-44" />

        {/* ۲. منوی دسکتاپ (دقت کامل در RTL/LTR) */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Dropdown محصولات */}
          <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
            <DropdownMenuTrigger
              className={cn(
                navLinkStyle,
                "flex items-center gap-1.5 outline-none",
              )}
            >
              <span>{t("products")}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[560px] p-5 grid grid-cols-3 gap-4 border border-border/40 shadow-xl bg-popover"
            >
              {/* Monocolor */}
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

              {/* Veined Effect */}
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

              {/* Calacatta */}
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

          {/* Dropdown کاربردها */}
          {/* Dropdown کاربردها (با ارتفاع متناسب، جادار و لوکس) */}
          <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
            <DropdownMenuTrigger
              className={cn(
                navLinkStyle,
                "flex items-center gap-1.5 outline-none",
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

        {/* ۳. دکمه‌ها و انتخاب زبان */}
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

          {/* زبان */}
          <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 px-2 font-mono text-xs outline-none",
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

          {/* دکمه منو موبایل */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* ۴. منوی تمیز موبایل */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-6 space-y-4 text-foreground animate-in slide-in-from-top duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <div className="border-b border-border/40 pb-2">
              <button
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-start"
              >
                <span>{t("products")}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-muted-foreground",
                    isMobileProductsOpen && "rotate-180",
                  )}
                />
              </button>

              {isMobileProductsOpen && (
                <div className="flex flex-col gap-1.5 pr-3 pl-3 pt-2 pb-2 bg-muted/40 rounded-md mt-1 font-light text-xs">
                  <Link
                    href="/products?cat=monocolor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 text-foreground hover:text-primary transition-colors"
                  >
                    {t("monocolorSeries")}
                  </Link>

                  <Link
                    href="/products?cat=veined-effect"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 text-foreground hover:text-primary transition-colors"
                  >
                    {t("veinedEffectSeries")}
                  </Link>

                  <Link
                    href="/products?cat=calacatta"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 text-foreground hover:text-primary transition-colors"
                  >
                    {t("calacattaSeries")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/applications"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-border/40"
            >
              {t("applications")}
            </Link>

            <Link
              href="/dealers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-border/40"
            >
              {t("dealers")}
            </Link>

            <Link
              href="/catalogs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-border/40"
            >
              {t("catalogs")}
            </Link>

            <Link
              href="/care-and-maintenance"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-border/40"
            >
              {t("careAndMaintenance")}
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-border/40"
            >
              {t("about")}
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold py-3 text-primary"
            >
              {t("contactUs")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
