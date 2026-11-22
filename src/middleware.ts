// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // هدایت دامنه .ir یا دامنه‌های دارای www به دامنه اصلی (SEO 301 Canonicalization)
  if (host.includes("persisquartz.ir") || host.startsWith("www.persisquartz.com")) {
    const targetUrl = new URL(request.url);
    targetUrl.host = "persisquartz.com";
    targetUrl.protocol = "https:";
    targetUrl.port = "";

    return NextResponse.redirect(targetUrl.toString(), 301);
  }

  // مدیریت ساب‌دامین اختصاصی وب‌میل (mail.persisquartz.com)
  if (host.startsWith("mail.persisquartz.com") || host.startsWith("mail.localhost")) {
    const url = request.nextUrl.clone();
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/mail";
    } else if (!url.pathname.startsWith("/mail") && !url.pathname.startsWith("/api")) {
      url.pathname = `/mail${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // اگر مستقیماً به روت وب‌میل دسترسی داشته باشند، میدل‌ور چندزبانه اجرا نشود
  if (request.nextUrl.pathname.startsWith("/mail")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // جلوگیری از اجرای میدل‌ور روی فایل‌های استاتیک، مدیا و مسیرهای اختصاصی ادمین
    "/((?!api|_next/static|_next/image|persis-cp|admin|favicon.ico|.*\\..*).*)",
    "/",
    "/(fa|en|ar)/:path*",
  ],
};
