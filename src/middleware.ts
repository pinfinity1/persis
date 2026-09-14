// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // هدایت دامنه .ir به .com به صورت دائمی (SEO 301)
  if (host.includes("persisquartz.ir")) {
    const targetUrl = new URL(request.url);
    targetUrl.host = "persisquartz.com";
    targetUrl.protocol = "https:";
    targetUrl.port = "";

    return NextResponse.redirect(targetUrl.toString(), 301);
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
