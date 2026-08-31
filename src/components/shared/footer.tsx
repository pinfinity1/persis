"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { useTranslations } from "next-intl";
import { Mail, MapPin, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/services/product.service";

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-900 sm:border-none pb-4 sm:pb-0 space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-semibold text-white uppercase tracking-widest text-start sm:cursor-default"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-500 transition-transform duration-200 sm:hidden",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "space-y-3 text-sm font-light text-neutral-400 transition-all",
          isOpen ? "block pt-2" : "hidden sm:block",
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface FooterProps {
  categories?: CategoryItem[];
}

export const Footer: React.FC<FooterProps> = ({ categories = [] }) => {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-900 select-none">
      <div className="container mx-auto px-6 sm:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* بخش معرفی برند */}
          <div className="lg:col-span-4 space-y-8 pb-8 sm:pb-0 border-b border-neutral-900 sm:border-none">
            <Logo
              variant="full"
              className="w-40 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
            />
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm font-light">
              {t("description")}
            </p>
            <div className="text-xs text-neutral-500 space-y-3 pt-2">
              <p className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>{t("address")}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                <span dir="ltr">{t("phone")}</span>
              </p>
              <a
                href={`mailto:${t("email")}`}
                dir="ltr"
                className="flex items-center gap-3 justify-start hover:text-white transition-colors w-fit"
              >
                <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                <span>{t("email")}</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

          {/* ستون ۱: کالکشن‌ها (داینامیک از دیتابیس) */}
          <div className="lg:col-span-2">
            <FooterSection title={t("productsTitle")}>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="hover:text-white transition-colors block"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li>
                    <Link
                      href="/products"
                      className="hover:text-white transition-colors block"
                    >
                      {t("allProducts")}
                    </Link>
                  </li>
                )}
              </ul>
            </FooterSection>
          </div>

          {/* ستون ۲: منابع و کاتالوگ */}
          <div className="lg:col-span-2">
            <FooterSection title={t("resourcesTitle")}>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/catalogs"
                    className="hover:text-white transition-colors block"
                  >
                    {t("downloadCatalog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/care-and-maintenance"
                    className="hover:text-white transition-colors block"
                  >
                    {t("careAndMaintenance")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dealers"
                    className="hover:text-white transition-colors block"
                  >
                    {t("findDealers")}
                  </Link>
                </li>
              </ul>
            </FooterSection>
          </div>

          {/* ستون ۳: شرکت و پشتیبانی */}
          <div className="lg:col-span-2">
            <FooterSection title={t("companyTitle")}>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about-persis"
                    className="hover:text-white transition-colors block"
                  >
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors block"
                  >
                    {t("contactUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact?type=sample"
                    className="hover:text-white transition-colors block"
                  >
                    {t("requestSample")}
                  </Link>
                </li>
              </ul>
            </FooterSection>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-900 mb-8" />

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between text-xs text-neutral-500 font-light gap-6">
          <p className="tracking-wide">
            © {new Date().getFullYear()} Persis Quartz. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
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

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
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
