// src/components/webmail/webmail-login-form.tsx
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { webmailLoginAction } from "@/app/actions/mail-actions";

export default function WebmailLoginForm() {
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await webmailLoginAction({ address, password });
      if (!res.success) {
        setErrorMessage(res.error || "نام کاربری یا رمز عبور نامعتبر است.");
      }
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
      {/* Ambient Lighting & Architectural Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(155,7,55,0.18),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl"
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            title="بازگشت به صفحه اصلی پرسیس کوارتز"
            className="group mb-6 inline-flex transition-transform hover:scale-105 duration-300"
          >
            <Image
              src="/PersisQuartz-Red.svg"
              alt="لوگوی پرسیس کوارتز"
              width={190}
              height={67}
              priority
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
            سامانه مکاتبات سازمانی
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
            درگاه یکپارچه مدیریت ارتباطات، ارسال و دریافت نامه‌های الکترونیکی
            رسمی شرکت
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full rounded-2xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive transition-all"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="webmail-email-input"
                className="block text-xs font-semibold text-foreground select-none"
              >
                آدرس ایمیل سازمانی
              </label>
              <div className="relative">
                <input
                  id="webmail-email-input"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="info@persisquartz.com"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  dir="ltr"
                  autoFocus
                  className="w-full h-11 rounded-xl border border-input bg-background/80 ps-10 pe-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 font-sans"
                />
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="webmail-password-input"
                className="block text-xs font-semibold text-foreground select-none"
              >
                رمز عبور وب‌میل
              </label>
              <div className="relative">
                <input
                  id="webmail-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full h-11 rounded-xl border border-input bg-background/80 ps-10 pe-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 font-sans"
                />
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"
                  }
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !address.trim() || !password.trim()}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال بررسی اعتبار سنجی...</span>
                </>
              ) : (
                <span>ورود به صندوق ایمیل</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-center gap-2 text-muted-foreground text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>نشست امن و احراز هویت رمزنگاری‌شده سازمانی</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>بازگشت به پورتال اصلی وب‌سایت</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 duration-200" />
          </Link>
          <p className="text-[11px] text-muted-foreground/70">
            © ۲۰۲۶ پرسیس کوارتز • کلیه حقوق محفوظ است.
          </p>
        </div>
      </div>
    </main>
  );
}
