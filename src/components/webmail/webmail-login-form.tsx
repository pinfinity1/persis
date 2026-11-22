// src/components/webmail/webmail-login-form.tsx
"use client";

import React, { useState, useTransition } from "react";
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { webmailLoginAction } from "@/app/actions/mail-actions";

export default function WebmailLoginForm() {
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!address.trim() || !password) {
      setErrorMessage("لطفاً آدرس ایمیل سازمانی و رمز عبور را وارد فرمایید.");
      return;
    }

    startTransition(async () => {
      const res = await webmailLoginAction({ address: address.trim(), password });
      if (!res.success) {
        setErrorMessage(res.error || "خطا در احراز هویت. اطلاعات ورود معتبر نیست.");
      }
      // If success, server action revalidates /mail and Next.js re-renders the page as authenticated!
    });
  };

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 selection:bg-primary/25 selection:text-primary-foreground font-sans text-foreground overflow-hidden"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute -top-40 -start-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -end-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* Card Header & Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-8 ring-primary/10">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            PERSIS QUARTZ
          </h1>
          <p className="mt-1 text-xs font-medium text-primary uppercase tracking-widest">
            سامانه ایمیل یکپارچه سازمانی
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            جهت دسترسی به صندوق مکاتبات رسمی، با مشخصات حساب کاربری خود وارد شوید.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive animate-in fade-in zoom-in-95 duration-150">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Address Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                آدرس ایمیل سازمانی
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@persisquartz.com"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  dir="ltr"
                  autoFocus
                  className="w-full rounded-xl border border-input bg-background py-2.5 ps-10 pe-3 text-xs text-foreground placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                />
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  رمز عبور وب‌میل
                </label>
                <span className="text-[11px] text-muted-foreground">
                  تعریف‌شده توسط مدیر سیستم
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background py-2.5 ps-10 pe-3 text-xs text-foreground placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                />
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>در حال بررسی اعتبار...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>ورود امن به سامانه</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>رمزنگاری سرتاسری و نشست امن مبتنی بر استاندارد SHA-256</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Persis Quartz. کلیه حقوق محفوظ است.</p>
        </div>
      </div>
    </div>
  );
}
