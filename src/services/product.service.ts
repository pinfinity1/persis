// src/services/product.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

// --- Domain & DTO Contracts ---

export type Locale = "fa" | "en" | "ar";

export interface GetProductsParams {
  locale: Locale;
  page?: number;
  limit?: number;
  category?: string;
  color?: string;
  vein_pattern?: string;
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
  search?: string;
}

export interface ProductMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next_page: boolean;
}

export interface LookupItem {
  id: string;
  title: string;
  slug: string;
  hex_code?: string;
}

export interface GalleryItemDTO {
  url: string;
  alt: string;
  caption?: string;
}

export interface CategoryItem {
  id: string | number;
  title: string;
  slug: string;
  order?: number;
  description?: string;
}
export interface ColorItem {
  id: string;
  title: string;
  slug: string;
}

export interface VeinPatternItem {
  id: string;
  title: string;
  slug: string;
}

export interface ProductItemDTO {
  id: string;
  title: string;
  slug: string;
  code: string;
  category: LookupItem;
  color_family: LookupItem;
  vein_pattern?: LookupItem;
  is_in_stock: "active" | "discontinued";
  is_featured: boolean;
  thumbnail: string;
  gallery: GalleryItemDTO[];
  thicknesses: string[];
  custom_thickness_available?: boolean;
  finishes: string[];
  dimensions: string[];
  description?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface ProductsResponseDTO {
  data: ProductItemDTO[];
  meta: ProductMeta;
}

// --- Constants & Security Boundaries ---

const TTL = {
  STATIC_SEC: 86400, // 24 Hours
  DYNAMIC_SEC: 1800, // 30 Minutes
} as const;

const MAX_SEARCH_LENGTH = 50;
const DEFAULT_PAGE_LIMIT = 9;
const MAX_PAGE_LIMIT = 48;

// --- Sanitization & Utility Helpers ---

function sanitizeSearchTerm(input?: string): string | undefined {
  if (!input) return undefined;

  // Moving the hyphen to the very end or escaping it avoids character-range collision
  const sanitized = input
    .trim()
    .replace(/[^\p{L}\p{N}\s_\-]/gu, "")
    .slice(0, MAX_SEARCH_LENGTH);

  return sanitized.length > 0 ? sanitized : undefined;
}

function resolveMediaUrl(
  media: unknown,
  fallback = "/PersisQuartz-Red.png",
): string {
  if (!media) return fallback;
  if (typeof media === "string") return media;
  if (typeof media === "object" && media !== null && "url" in media) {
    const url = (media as { url?: unknown }).url;
    if (typeof url === "string" && url.trim().length > 0) return url;
  }
  return fallback;
}

function mapProductDocToDTO(doc: any): ProductItemDTO {
  return {
    id: String(doc.id),
    title: String(doc.title || ""),
    slug: String(doc.slug || ""),
    code: String(doc.code || ""),
    category: {
      id: String(doc.category?.id || ""),
      title: String(doc.category?.title || ""),
      slug: String(doc.category?.slug || ""),
    },
    color_family: {
      id: String(doc.color_family?.id || ""),
      title: String(doc.color_family?.title || ""),
      slug: String(doc.color_family?.slug || ""),
    },
    vein_pattern: doc.vein_pattern
      ? {
          id: String(doc.vein_pattern.id || ""),
          title: String(doc.vein_pattern.title || ""),
          slug: String(doc.vein_pattern.slug || ""),
        }
      : undefined,
    is_in_stock: doc.is_in_stock || "active",
    is_featured: Boolean(doc.is_featured),
    thumbnail: resolveMediaUrl(doc.thumbnail),
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map((g: any) => ({
          url: resolveMediaUrl(g.image),
          alt:
            typeof g.image === "object" && g.image?.alt
              ? String(g.image.alt)
              : "",
          caption: g.caption ? String(g.caption) : undefined,
        }))
      : [],
    thicknesses: Array.isArray(doc.thicknesses)
      ? doc.thicknesses.map((t: any) =>
          typeof t === "object" ? String(t.title || t.slug) : String(t),
        )
      : [],
    custom_thickness_available: doc.custom_thickness_available ?? true, // <-- باگ برطرف شد
    finishes: Array.isArray(doc.finishes)
      ? doc.finishes.map((f: any) =>
          typeof f === "object" ? String(f.title || f.slug) : String(f),
        )
      : [],
    dimensions: Array.isArray(doc.dimensions)
      ? doc.dimensions.map((d: any) =>
          typeof d === "object" ? String(d.title || d.slug) : String(d),
        )
      : [],
    description: doc.description ? String(doc.description) : undefined,
    meta_title: doc.meta_title ? String(doc.meta_title) : undefined,
    meta_description: doc.meta_description
      ? String(doc.meta_description)
      : undefined,
  };
}

// --- Data Access Layer ---

async function executeProductsQuery(
  params: GetProductsParams,
): Promise<ProductsResponseDTO> {
  const payload = await getPayload({ config: configPromise });
  const sanitizedSearch = sanitizeSearchTerm(params.search);

  const where: Record<string, any> = {};

  if (params.category && params.category !== "all") {
    where["category.slug"] = { equals: params.category.trim().toLowerCase() };
  }

  if (params.color && params.color !== "all") {
    where["color_family.slug"] = { equals: params.color.trim().toLowerCase() };
  }

  if (params.vein_pattern && params.vein_pattern !== "all") {
    where["vein_pattern.slug"] = {
      equals: params.vein_pattern.trim().toLowerCase(),
    };
  }

  if (sanitizedSearch) {
    where.or = [
      { code: { like: sanitizedSearch } },
      { title: { like: sanitizedSearch } },
    ];
  }

  // Deterministic sorting map to prevent SQL injection or arbitrary fields
  let sortField = "-createdAt";
  if (params.sort === "oldest") sortField = "createdAt";
  if (params.sort === "title_asc") sortField = "title";
  if (params.sort === "title_desc") sortField = "-title";

  const limit = Math.min(
    Math.max(params.limit ?? DEFAULT_PAGE_LIMIT, 1),
    MAX_PAGE_LIMIT,
  );
  const page = Math.max(params.page ?? 1, 1);

  try {
    const result = await payload.find({
      collection: "products",
      locale: params.locale,
      page,
      limit,
      where,
      sort: sortField,
      depth: 1, // Depth 1 resolves immediate Lookup relationships cleanly
      pagination: true,
    });

    return {
      data: result.docs.map(mapProductDocToDTO),
      meta: {
        current_page: result.page ?? 1,
        total_pages: result.totalPages ?? 1,
        total_items: result.totalDocs ?? 0,
        has_next_page: (result.page ?? 1) < (result.totalPages ?? 1),
      },
    };
  } catch (err: unknown) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        module: "product.service",
        action: "executeProductsQuery",
        error: err instanceof Error ? err.message : String(err),
        params,
        timestamp: new Date().toISOString(),
      }),
    );
    return {
      data: [],
      meta: {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        has_next_page: false,
      },
    };
  }
}

// --- Cached Service Layer (Singleton Closures) ---

const cachedPaginatedProducts = unstable_cache(
  async (
    locale: Locale,
    page: number,
    limit: number,
    category: string,
    color: string,
    vein_pattern: string,
    sort: string,
  ) => {
    return executeProductsQuery({
      locale,
      page,
      limit,
      category: category === "all" ? undefined : category,
      color: color === "all" ? undefined : color,
      vein_pattern: vein_pattern === "all" ? undefined : vein_pattern,
      sort: sort as GetProductsParams["sort"],
    });
  },
  ["products-catalog-cache"],
  {
    revalidate: TTL.DYNAMIC_SEC,
    tags: ["products"],
  },
);

export async function getProductsService(
  params: GetProductsParams,
): Promise<ProductsResponseDTO> {
  const sanitizedSearch = sanitizeSearchTerm(params.search);

  // Searches must intentionally bypass read caches to avoid unbounded key growth
  if (sanitizedSearch) {
    return executeProductsQuery({ ...params, search: sanitizedSearch });
  }

  return cachedPaginatedProducts(
    params.locale,
    Math.max(params.page ?? 1, 1),
    Math.min(Math.max(params.limit ?? DEFAULT_PAGE_LIMIT, 1), MAX_PAGE_LIMIT),
    params.category ?? "all",
    params.color ?? "all",
    params.vein_pattern ?? "all",
    params.sort ?? "newest",
  );
}

export const getProductBySlugService = (slug: string, locale: Locale) =>
  unstable_cache(
    async (): Promise<ProductItemDTO | null> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const result = await payload.find({
          collection: "products",
          locale,
          where: { slug: { equals: slug.trim().toLowerCase() } },
          limit: 1,
          depth: 2,
        });

        if (!result.docs || result.docs.length === 0) return null;
        return mapProductDocToDTO(result.docs[0]);
      } catch (err: unknown) {
        console.error("getProductBySlugService error:", err);
        return null;
      }
    },
    ["product-detail-by-slug", slug, locale],
    {
      revalidate: TTL.STATIC_SEC,
      tags: ["products", `product-${slug}`],
    },
  )();

// --- Fast Attribute Services ---

export const getCategoriesService = unstable_cache(
  async (locale: Locale): Promise<LookupItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "categories",
        locale,
        limit: 100,
        sort: "order",
        depth: 0,
      });

      return response.docs.map((doc: any) => ({
        id: String(doc.id),
        title: String(doc.title),
        slug: String(doc.slug),
      }));
    } catch {
      return [];
    }
  },
  ["attributes-categories-cache"],
  { revalidate: TTL.STATIC_SEC, tags: ["categories"] },
);

export async function getColorsService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<ColorItem[]> {
  return unstable_cache(
    async (): Promise<ColorItem[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
          collection: "colors",
          locale,
          limit: 100,
          depth: 0,
        });

        return res.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title || "",
          slug: doc.slug || "",
          hex_code: doc.hex_code || undefined,
        }));
      } catch (error) {
        console.error("Error fetching colors in service:", error);
        return [];
      }
    },
    ["colors-cache", locale],
    {
      revalidate: 86400,
      tags: ["colors"],
    },
  )();
}

export async function getVeinPatternsService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<VeinPatternItem[]> {
  return unstable_cache(
    async (): Promise<VeinPatternItem[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
          collection: "vein-patterns",
          locale,
          limit: 100,
          depth: 0,
        });

        return res.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title || "",
          slug: doc.slug || "",
        }));
      } catch (error) {
        console.error("Error fetching vein patterns in service:", error);
        return [];
      }
    },
    ["vein-patterns-cache", locale],
    {
      revalidate: 86400,
      tags: ["vein-patterns"],
    },
  )();
}

export const getAllDimensionsService = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "dimensions",
        limit: 50,
        depth: 0,
      });
      return response.docs.map((d: any) => String(d.title || ""));
    } catch {
      return [];
    }
  },
  ["attributes-dimensions-cache"],
  { revalidate: TTL.STATIC_SEC, tags: ["dimensions"] },
);

export const getAllThicknessesService = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "thicknesses" as any,
        limit: 50,
        depth: 0,
      });
      return response.docs.map((d: any) => String(d.slug || d.title || ""));
    } catch {
      return [];
    }
  },
  ["attributes-thicknesses-cache"],
  { revalidate: TTL.STATIC_SEC, tags: ["thicknesses"] },
);

export const getAllFinishesService = unstable_cache(
  async (locale: Locale): Promise<{ title: string; slug: string }[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "finishes" as any,
        locale,
        limit: 50,
        depth: 0,
      });
      return response.docs.map((d: any) => ({
        title: String(d.title || ""),
        slug: String(d.slug || ""),
      }));
    } catch {
      return [];
    }
  },
  ["attributes-finishes-cache"],
  { revalidate: TTL.STATIC_SEC, tags: ["finishes"] },
);

export const getFeaturedProductsService = unstable_cache(
  async (locale: Locale): Promise<ProductItemDTO[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "products",
        locale,
        limit: 6,
        where: { is_featured: { equals: true } },
        sort: "-updatedAt",
        depth: 1,
      });

      return response.docs.map(mapProductDocToDTO);
    } catch {
      return [];
    }
  },
  ["featured-products-cache"],
  { revalidate: TTL.DYNAMIC_SEC, tags: ["products", "featured-products"] },
);
