// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
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
  title: "Persis Quartz | سطوح مهندسی‌شده کوارتز",
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
  const dir = locale === "en" ? "ltr" : "rtl";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${vazirmatn.variable} ${inter.variable}`}
    >
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
