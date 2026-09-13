import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/*?*search=",
          "/*?*category=",
          "/*?*color=",
          "/*?*vein_pattern=",
        ],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: [
          "/",
          "/products/*",
          "/applications",
          "/care-and-maintenance",
          "/catalogs",
          "/about-persis",
          "/dealers",
        ],
        disallow: ["/admin/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
