// src/components/shared/footer.tsx
"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { Mail, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800/60 sm:border-none pb-4 sm:pb-0 space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-semibold text-white uppercase tracking-widest text-start sm:cursor-default"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-200 sm:hidden",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "space-y-2.5 text-sm font-light text-neutral-400 transition-all",
          isOpen ? "block pt-2" : "hidden sm:block",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const Footer: React.FC = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      <div className="container mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* ستون برند (در همه سایزها ثابت و باز) */}
          <div className="lg:col-span-2 space-y-6 pb-6 sm:pb-0 border-b border-neutral-800 sm:border-none">
            <Logo variant="icon-white-bg" size={48} />
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm font-light">
              {t("description")}
            </p>
            <div className="text-xs text-neutral-500 font-mono space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                <span>{t("address")}</span>
              </p>
              <p dir="ltr" className="flex items-center gap-2 justify-start">
                <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                <span>{t("email")}</span>
              </p>
            </div>
          </div>

          {/* ستون ۱: کالکشن‌ها */}
          <FooterSection title={t("productsTitle")}>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products?cat=monocolor"
                  className="hover:text-white transition-colors"
                >
                  {t("monocolorSeries")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?cat=veined-effect"
                  className="hover:text-white transition-colors"
                >
                  {t("veinedEffectSeries")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?cat=calacatta"
                  className="hover:text-white transition-colors"
                >
                  {t("calacattaSeries")}
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* ستون ۲: دسترسی سریع */}
          <FooterSection title={t("quickLinksTitle")}>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/dealers"
                  className="hover:text-white transition-colors"
                >
                  {t("findDealers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogs"
                  className="hover:text-white transition-colors"
                >
                  {t("downloadCatalog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* ستون ۳: اطلاعات و قوانین */}
          <FooterSection title={t("infoAndLegalTitle")}>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        <Separator className="bg-neutral-800 my-8" />

        {/* بخش حقوق و شبکه‌های اجتماعی */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-light gap-6">
          <p>
            © {new Date().getFullYear()} Persis Quartz. {t("copyright")}
          </p>

          <div className="flex items-center gap-3">
            {/* اینستاگرام */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
              aria-label="Instagram"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            {/* لینکدین */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            {/* تلگرام */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
              aria-label="Telegram"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="22" x2="11" y1="2" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
