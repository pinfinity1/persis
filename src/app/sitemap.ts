import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com"
).replace(/\/$/, "");

const LOCALES = ["fa", "en", "ar"] as const;

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/products",
    "/applications",
    "/care-and-maintenance",
    "/catalogs",
    "/dealers",
    "/about-persis",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of LOCALES) {
      const pathSuffix = route ? route : "";
      entries.push({
        url: `${BASE_URL}/${locale}${pathSuffix}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            fa: `${BASE_URL}/fa${pathSuffix}`,
            en: `${BASE_URL}/en${pathSuffix}`,
            ar: `${BASE_URL}/ar${pathSuffix}`,
            "x-default": `${BASE_URL}/fa${pathSuffix}`,
          },
        },
      });
    }
  }

  try {
    const payload = await getPayload({ config: configPromise });

    let page = 1;
    let hasNextPage = true;
    const batchLimit = 300;

    while (hasNextPage) {
      const productsBatch = await payload.find({
        collection: "products",
        limit: batchLimit,
        page,
        depth: 0,
        pagination: true,
        where: {
          is_in_stock: { equals: "active" },
        },
      });

      for (const product of productsBatch.docs) {
        const slug =
          typeof product.slug === "string" ? product.slug.trim() : "";
        if (!slug) continue;

        const rawDate = product.updatedAt ? String(product.updatedAt) : "";
        const parsedDate = rawDate ? new Date(rawDate) : new Date();
        const lastModified = isNaN(parsedDate.getTime())
          ? new Date()
          : parsedDate;

        for (const locale of LOCALES) {
          const route = `/products/${slug}`;
          entries.push({
            url: `${BASE_URL}/${locale}${route}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
            alternates: {
              languages: {
                fa: `${BASE_URL}/fa${route}`,
                en: `${BASE_URL}/en${route}`,
                ar: `${BASE_URL}/ar${route}`,
                "x-default": `${BASE_URL}/fa${route}`,
              },
            },
          });
        }
      }

      hasNextPage = productsBatch.hasNextPage;
      page += 1;
    }
  } catch {
    // Silent catch for build time without live DB
  }

  return entries;
}
