import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const vazirmatn = localFont({
  src: [
    { path: "../assets/Vazir-Medium.woff2", weight: "300", style: "normal" },
    { path: "../assets/Vazir-Medium.woff2", weight: "400", style: "normal" },
    { path: "../assets/Vazir-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/Vazir-Bold.woff2", weight: "600", style: "normal" },
    { path: "../assets/Vazir-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/Vazir-Bold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../assets/Inter-Regular.woff2", weight: "300", style: "normal" },
    { path: "../assets/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/Inter-Regular.woff2", weight: "500", style: "normal" },
    { path: "../assets/Inter-Bold.woff2", weight: "600", style: "normal" },
    { path: "../assets/Inter-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/Inter-Bold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سامانه ایمیل سازمانی | Persis Quartz Webmail",
  description: "سامانه یکپارچه مدیریت، ارسال و دریافت ایمیل‌های سازمانی پرسیس کوارتز",
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
    >
      <body className="bg-background text-foreground antialiased font-sans selection:bg-primary/25 selection:text-primary-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
