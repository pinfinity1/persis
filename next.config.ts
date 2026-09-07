import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "persisquartz.com" },
      { protocol: "https", hostname: "www.persisquartz.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withPayload(withNextIntl(nextConfig));
