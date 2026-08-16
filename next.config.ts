import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      //دامنه اصلی سایت/پیلود (در زمان دیپلوی)
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
