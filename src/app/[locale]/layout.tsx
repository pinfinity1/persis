// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getCategoriesService } from "@/services/product.service";
import "../globals.css";

const vazirmatn = localFont({
  src: [
    { path: "../assets/Vazir-Medium.woff2", weight: "400", style: "normal" },
    { path: "../assets/Vazir-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../assets/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/Inter-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  ),
  title: "Persis Quartz",
  description:
    "تولیدکننده سطوح کوارتز مهندسی‌شده با استانداردهای جهانی؛ تلفیقی از استحکام بی‌نظیر و زیبایی معماری.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  // دریافت مستقیم دسته‌بندی‌های پویا از دیتابیس
  const categories = await getCategoriesService(locale as "fa" | "en" | "ar");

  return (
    <html
      lang={locale}
      dir={locale === "en" ? "ltr" : "rtl"}
      className={`${vazirmatn.variable} ${inter.variable}`}
    >
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header categories={categories} />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
