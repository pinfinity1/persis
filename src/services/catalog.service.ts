import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export interface CatalogItem {
  id: string;
  title: string;
  slug: string;
  year: number;
  catalog_type: "full_catalog" | "technical" | "collection" | "guide";
  description?: string;
  cover_image: { url: string; alt?: string } | string;
  pdf_file: { url: string; filename?: string } | string;
  file_size_mb: number;
  page_count?: number;
  status: "published" | "draft";
}

export const getGroupedCatalogsService = cache(
  async (
    locale: "fa" | "en" | "ar",
  ): Promise<Record<number, CatalogItem[]>> => {
    try {
      const payload = await getPayload({ config: configPromise });

      const response = await payload.find({
        collection: "catalogs",
        locale,
        limit: 100,
        where: {
          status: { equals: "published" },
        },
        sort: "-year",
        depth: 2,
      });

      const docs = (response.docs as unknown as CatalogItem[]) || [];

      // گروه بندی سالیانه
      return docs.reduce(
        (acc, catalog) => {
          const year = catalog.year || new Date().getFullYear();
          if (!acc[year]) acc[year] = [];
          acc[year].push(catalog);
          return acc;
        },
        {} as Record<number, CatalogItem[]>,
      );
    } catch (error) {
      console.error("Error fetching grouped catalogs:", error);
      return {};
    }
  },
);
