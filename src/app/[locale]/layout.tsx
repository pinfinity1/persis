import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";

// تنظیم فونت‌ها
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Persis Quartz",
  description: "Multilingual Corporate Website",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // در Next.js 15 پارامترها به صورت Promise هستند
  const { locale } = await params;

  // بررسی معتبر بودن زبان
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // دریافت ترجمه‌ها برای کامپوننت‌های کلاینت
  const messages = await getMessages();

  // تعیین جهت و فونت بر اساس زبان
  const dir = locale === "en" ? "ltr" : "rtl";
  const fontClass = locale === "en" ? inter.variable : vazirmatn.variable;

  return (
    <html lang={locale} dir={dir} className={fontClass}>
      {/* استفاده از کلاس font-sans برای اعمال فونتی که در متغیر تنظیم شده */}
      <body className="antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
