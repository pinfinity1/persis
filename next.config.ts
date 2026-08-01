import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ۱. دامنه‌های تست خارج (مثل Unsplash)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // ۲. توسعه لوکال Payload (localhost)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      // ۳. اگر از 127.0.0.1 در لوکال استفاده می‌کنی
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      // ۴. دامنه اصلی سایت/پیلود (در زمان دیپلوی)
      /*
      {
        protocol: "https",
        hostname: "persisquartz.com",
      },
      */
    ],
  },
};

export default withPayload(withNextIntl(nextConfig));
