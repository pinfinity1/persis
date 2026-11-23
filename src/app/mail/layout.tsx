import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9b0737",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "https://persisquartz.com",
  ),
  title: "سامانه مکاتبات سازمانی | پرسیس کوارتز",
  description: "درگاه امن مدیریت، دریافت و ارسال نامه‌های الکترونیکی و مکاتبات رسمی شرکت پرسیس کوارتز",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased font-sans selection:bg-primary/25 selection:text-primary-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
