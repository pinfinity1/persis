import React from "react";
import { Link } from "@/i18n/routing";
import { Home, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-24 select-none">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-black text-muted-foreground/10 tracking-tighter">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold bg-background/80 px-4 py-1 border border-border/40">
              Page Not Found
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">
            صفحه مورد نظر یافت نشد
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            آدرس وارد شده تغییر کرده یا به طور موقت از دسترس خارج شده است.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>صفحه اصلی</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-card/50 text-foreground text-xs font-medium tracking-wider uppercase hover:border-primary/50 transition-colors"
          >
            <Layers className="h-4 w-4" />
            <span>مشاهده کاتالوگ اسلب‌ها</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
