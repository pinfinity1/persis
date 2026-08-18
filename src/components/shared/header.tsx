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
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryItem } from "@/services/product.service";

interface HeaderProps {
  categories?: CategoryItem[];
}

export const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
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

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { root: null, threshold: 0 },
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
    "text-xs uppercase tracking-wider font-medium transition-colors hover:opacity-80 py-2 px-3 rounded-md",
    isHomePage && !isScrolled
      ? "text-white hover:bg-white/10"
      : "text-foreground hover:bg-accent/50",
  );

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
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

          {/* ۲. منوی دسکتاپ (مگامنو دسته‌بندی‌ها) */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* دراپ‌داون دسته‌بندی‌ها */}
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
                className="w-[620px] p-6 border border-border/50 shadow-2xl bg-popover rounded-none space-y-4"
              >
                {/* هدر مگامنو */}
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-foreground font-semibold">
                      {t("collections")}
                    </span>
                  </div>
                  <Link
                    href="/products"
                    className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{t("viewAllProducts")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* کارت‌های کالکشن */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat, idx) => (
                    <Link
                      key={cat.id || idx}
                      href={`/products?category=${cat.slug}`}
                      className="group p-3.5 border border-border/40 hover:border-primary/60 bg-card/50 hover:bg-card transition-all flex flex-col justify-between min-h-[110px]"
                    >
                      <div>
                        <span className="text-[10px] text-primary block mb-1.5 font-bold">
                          0{idx + 1}
                        </span>
                        <h5 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                          {cat.title}
                        </h5>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 group-hover:text-foreground transition-colors pt-2 block">
                        Explore &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* کاربردها */}
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
                className="w-72 p-3 bg-popover border border-border/40 shadow-xl space-y-1 rounded-none"
              >
                <Link
                  href="/applications/kitchen"
                  className="flex flex-col gap-1 p-3 rounded-none hover:bg-muted/70 transition-colors"
                >
                  <span className="text-xs font-medium text-foreground">
                    {t("kitchenCountertops")}
                  </span>
                </Link>

                <div className="h-[1px] bg-border/40 my-1" />

                <Link
                  href="/applications/bathroom"
                  className="flex flex-col gap-1 p-3 rounded-none hover:bg-muted/70 transition-colors"
                >
                  <span className="text-xs font-medium text-foreground">
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

            <Link href="/about-persis" className={navLinkStyle}>
              {t("about")}
            </Link>
          </nav>

          {/* ۳. دکمه‌های اکشن (سرچ حذف شد) */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            {/* سوئیچر زبان */}
            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1 px-2 text-xs outline-none hidden sm:inline-flex rounded-none",
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
              <DropdownMenuContent
                align="end"
                className="min-w-[120px] rounded-none"
              >
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
                    <span className="uppercase text-[10px] text-muted-foreground">
                      {lang.code}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "lg:hidden p-2 focus:outline-none transition-colors rounded-none",
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
                className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close Mobile Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4">
              {/* بخش محصولات در موبایل */}
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
                  <div className="flex flex-col gap-2.5 pt-3 ps-4 text-sm font-light text-muted-foreground">
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 font-medium text-foreground hover:text-primary transition-colors border-b border-border/30 pb-2 mb-1"
                    >
                      <span>{t("viewAllProducts")}</span>
                      <ArrowIcon className="h-3.5 w-3.5 opacity-60 text-primary" />
                    </Link>

                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                      >
                        <span>{cat.title}</span>
                        <ArrowIcon className="h-3.5 w-3.5 opacity-40" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* کاربردها در موبایل */}
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
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground block">
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
                    "px-3 py-1.5 text-xs font-medium border transition-colors rounded-none",
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
