// src/components/shared/header.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Logs,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export interface HeaderCategoryItem {
  id?: string | number;
  title: string;
  slug: string;
}

interface HeaderProps {
  categories?: HeaderCategoryItem[];
}

export const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === "/" || pathname === `/${locale}`;
  const isRtl = locale === "fa" || locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
    return () => observer.disconnect();
  }, [isHomePage]);

  const handleLanguageChange = (newLocale: "fa" | "en" | "ar") => {
    router.replace(pathname, { locale: newLocale });
  };

  const languages = [
    { code: "fa", label: "فارسی" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ] as const;

  const navLinkStyle = (isActive: boolean) =>
    cn(
      "text-xs uppercase tracking-wider font-normal whitespace-nowrap transition-all duration-200 py-2 px-2.5 xl:px-3.5 border border-transparent rounded-none",
      isActive && "border-b-primary font-medium text-primary",
      isHomePage && !isScrolled
        ? isActive
          ? "border-b-white text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
        : isActive
          ? "border-b-primary text-primary"
          : "text-foreground/80 hover:text-foreground hover:bg-muted/40",
    );

  return (
    <>
      {isHomePage && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-10 pointer-events-none"
        />
      )}

      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 select-none",
          isHomePage && !isScrolled
            ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-transparent text-white"
            : "border-b border-border/50 bg-background/95 backdrop-blur-md text-foreground shadow-xs",
        )}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8 xl:px-12">
          {/* ۱. لوگو */}
          <Logo variant="full" className="w-32 sm:w-40 xl:w-44 shrink-0" />

          {/* ۲. منوی دسکتاپ */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {/* مگامنو محصولات */}
            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger
                className={cn(
                  navLinkStyle(pathname.startsWith("/products")),
                  "flex items-center gap-1.5 outline-none cursor-pointer group",
                )}
              >
                <span>{t("products")}</span>
                <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[660px] p-6 border border-border/60 bg-popover/98 backdrop-blur-md rounded-none shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 duration-200"
              >
                {/* هدر مگامنو */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/40">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs uppercase tracking-widest text-foreground font-semibold">
                      {t("collections")}
                    </span>
                  </div>
                  <Link
                    href="/products"
                    className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{t("viewAllProducts")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                  </Link>
                </div>

                {/* کارت‌های کالکشن */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat, idx) => (
                    <Link
                      key={cat.id || idx}
                      href={`/products?category=${cat.slug}`}
                      className="group/card p-4 border border-border/50 hover:border-primary/80 bg-card/40 hover:bg-card transition-all duration-300 flex flex-col justify-between min-h-[115px]"
                    >
                      <div>
                        <span className="text-[10px] text-primary block mb-2 font-bold">
                          0{idx + 1}
                        </span>
                        <h5 className="text-xs font-medium text-foreground group-hover/card:text-primary transition-colors leading-snug">
                          {cat.title}
                        </h5>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 group-hover/card:text-foreground transition-colors pt-3 block">
                        Explore &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* لینک‌های تکی مستقیم */}
            <Link
              href="/applications"
              className={navLinkStyle(pathname.startsWith("/applications"))}
            >
              {t("applications")}
            </Link>

            <Link
              href="/dealers"
              className={navLinkStyle(pathname.startsWith("/dealers"))}
            >
              {t("dealers")}
            </Link>

            <Link
              href="/catalogs"
              className={navLinkStyle(pathname.startsWith("/catalogs"))}
            >
              {t("catalogs")}
            </Link>

            <Link
              href="/care-and-maintenance"
              className={navLinkStyle(
                pathname.startsWith("/care-and-maintenance"),
              )}
            >
              {t("careAndMaintenance")}
            </Link>

            <Link
              href="/about-persis"
              className={navLinkStyle(pathname.startsWith("/about-persis"))}
            >
              {t("about")}
            </Link>
          </nav>

          {/* ۳. دکمه‌های اکشن دسکتاپ */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-9 w-9 transition-colors",
                isHomePage && !isScrolled
                  ? "text-white hover:bg-white/10 hover:text-white"
                  : "text-foreground hover:bg-muted hover:text-foreground",
              )}
              title={t("contactUs")}
            >
              <Link href="/contact">
                <PhoneCall className="h-4 w-4" />
              </Link>
            </Button>

            {/* تغییر زبان */}
            <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 px-3 h-9 text-xs outline-none hidden sm:inline-flex rounded-none border transition-colors",
                    isHomePage && !isScrolled
                      ? "text-white border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40"
                      : "text-foreground border-border/50 hover:border-border",
                  )}
                >
                  <Globe className="h-3.5 w-3.5 opacity-80" />
                  <span className="uppercase font-bold tracking-wider">
                    {locale}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-[130px] rounded-none border border-border/60 bg-popover shadow-xl p-1"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "justify-between text-xs cursor-pointer py-2 px-3 rounded-none",
                      locale === lang.code &&
                        "bg-primary/10 text-primary font-semibold",
                    )}
                  >
                    <span>{lang.label}</span>
                    <span className="uppercase text-[10px] text-muted-foreground">
                      {lang.code}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ۴. منوی ریسپانسیو موبایل */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "lg:hidden p-2 rounded-none transition-colors focus:outline-none",
                    isHomePage && !isScrolled
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-muted",
                  )}
                  aria-label="Open Mobile Menu"
                >
                  <Logs className="h-6 w-6" />
                </button>
              </SheetTrigger>

              <SheetContent
                side={isRtl ? "right" : "left"}
                showCloseButton={false} // بستن دکمه دیفالت جهت کنترل دقیق پوزیشن و استایل
                className="w-[88%] sm:max-w-md p-0 flex flex-col justify-between bg-background border-border/50 rounded-none h-full"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* بخش اول: هدر دراور موبایل (کاملاً ثابت) */}
                <div className="h-20 shrink-0 px-6 flex items-center justify-between border-b border-border/40">
                  <Logo variant="full" className="w-32" />
                  <SheetClose asChild>
                    <button
                      className="size-9 flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                      aria-label="Close Mobile Menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </SheetClose>
                </div>

                {/* بخش دوم: بدنه منوها (تنها بخش اسکرول‌خورده) */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 divide-y divide-border/20 scrollbar-none">
                  {/* محصولات موبایل */}
                  <div className="pt-2 pb-3">
                    <button
                      onClick={() =>
                        setIsMobileProductsOpen(!isMobileProductsOpen)
                      }
                      className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-foreground text-start group cursor-pointer"
                    >
                      <span className="group-hover:text-primary transition-colors">
                        {t("products")}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-300",
                          isMobileProductsOpen && "rotate-180 text-primary",
                        )}
                      />
                    </button>

                    {isMobileProductsOpen && (
                      <div className="flex flex-col gap-2 pt-2 ps-3 pe-1 border-s border-border/40 mt-1">
                        <Link
                          href="/products"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-xs font-semibold text-primary hover:underline transition-colors"
                        >
                          <span>{t("viewAllProducts")}</span>
                          <ArrowIcon className="h-3.5 w-3.5" />
                        </Link>

                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>{cat.title}</span>
                            <ArrowIcon className="h-3 w-3 opacity-30" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* سایر لینک‌های ناوبری موبایل */}
                  <div className="space-y-1 pt-3">
                    <Link
                      href="/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-sm text-foreground/90 hover:text-primary transition-colors",
                        pathname.startsWith("/applications") &&
                          "text-primary font-semibold",
                      )}
                    >
                      {t("applications")}
                    </Link>

                    <Link
                      href="/dealers"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-sm text-foreground/90 hover:text-primary transition-colors",
                        pathname.startsWith("/dealers") &&
                          "text-primary font-semibold",
                      )}
                    >
                      {t("dealers")}
                    </Link>

                    <Link
                      href="/catalogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-sm text-foreground/90 hover:text-primary transition-colors",
                        pathname.startsWith("/catalogs") &&
                          "text-primary font-semibold",
                      )}
                    >
                      {t("catalogs")}
                    </Link>

                    <Link
                      href="/care-and-maintenance"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-sm text-foreground/90 hover:text-primary transition-colors",
                        pathname.startsWith("/care-and-maintenance") &&
                          "text-primary font-semibold",
                      )}
                    >
                      {t("careAndMaintenance")}
                    </Link>

                    <Link
                      href="/about-persis"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-sm text-foreground/90 hover:text-primary transition-colors",
                        pathname.startsWith("/about-persis") &&
                          "text-primary font-semibold",
                      )}
                    >
                      {t("about")}
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 text-sm font-semibold text-primary"
                    >
                      {t("contactUs")}
                    </Link>
                  </div>
                </div>

                {/* بخش سوم: فوتر دراور موبایل (کاملاً ثابت) */}
                <div className="shrink-0 p-6 border-t border-border/40 bg-muted/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Language / زبان
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "py-2 text-xs transition-all rounded-none border",
                          locale === lang.code
                            ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "border-border/60 bg-background text-muted-foreground hover:border-border hover:text-foreground",
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};
