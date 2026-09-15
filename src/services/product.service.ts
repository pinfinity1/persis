// src/services/product.service.ts
import "server-only";
import { getPayload, type Where } from "payload";
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
  category?: LookupItem;
  color_family?: LookupItem;
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

function resolveLookupItem(raw: unknown): LookupItem | undefined {
  if (!raw) return undefined;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      id: String(obj.id ?? ""),
      title: String(obj.title || obj.slug || ""),
      slug: String(obj.slug ?? ""),
    };
  }
  if (typeof raw === "string" || typeof raw === "number") {
    return {
      id: String(raw),
      title: "",
      slug: "",
    };
  }
  return undefined;
}

function mapProductDocToDTO(raw: unknown): ProductItemDTO {
  const doc = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;

  const category = resolveLookupItem(doc.category);
  const colorFamily = resolveLookupItem(doc.color_family);
  const veinPattern = resolveLookupItem(doc.vein_pattern);

  const rawGallery = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery: GalleryItemDTO[] = rawGallery.map((g: unknown) => {
    const item = (g && typeof g === "object" ? g : {}) as Record<
      string,
      unknown
    >;
    const imgObj =
      item.image && typeof item.image === "object"
        ? (item.image as Record<string, unknown>)
        : undefined;

    return {
      url: resolveMediaUrl(item.image),
      alt: imgObj?.alt ? String(imgObj.alt) : "",
      caption: item.caption ? String(item.caption) : undefined,
    };
  });

  const rawThicknesses = Array.isArray(doc.thicknesses) ? doc.thicknesses : [];
  const thicknesses: string[] = rawThicknesses.map((t: unknown) => {
    if (t && typeof t === "object") {
      const obj = t as Record<string, unknown>;
      return String(obj.title || obj.slug || "");
    }
    return String(t ?? "");
  });

  const rawFinishes = Array.isArray(doc.finishes) ? doc.finishes : [];
  const finishes: string[] = rawFinishes.map((f: unknown) => {
    if (f && typeof f === "object") {
      const obj = f as Record<string, unknown>;
      return String(obj.title || obj.slug || "");
    }
    return String(f ?? "");
  });

  const rawDimensions = Array.isArray(doc.dimensions) ? doc.dimensions : [];
  const dimensions: string[] = rawDimensions.map((d: unknown) => {
    if (d && typeof d === "object") {
      const obj = d as Record<string, unknown>;
      return String(obj.title || obj.slug || "");
    }
    return String(d ?? "");
  });

  return {
    id: String(doc.id ?? ""),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    code: String(doc.code ?? ""),
    category: category || { id: "", title: "", slug: "" },
    color_family: colorFamily,
    vein_pattern: veinPattern,
    is_in_stock: doc.is_in_stock === "discontinued" ? "discontinued" : "active",
    is_featured: Boolean(doc.is_featured),
    thumbnail: resolveMediaUrl(doc.thumbnail),
    gallery,
    thicknesses,
    custom_thickness_available:
      typeof doc.custom_thickness_available === "boolean"
        ? doc.custom_thickness_available
        : true,
    finishes,
    dimensions,
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

  const andConditions: Where[] = [];

  if (params.category && params.category !== "all") {
    andConditions.push({
      "category.slug": { equals: params.category.trim().toLowerCase() },
    });
  }

  if (params.color && params.color !== "all") {
    andConditions.push({
      "color_family.slug": { equals: params.color.trim().toLowerCase() },
    });
  }

  if (params.vein_pattern && params.vein_pattern !== "all") {
    andConditions.push({
      "vein_pattern.slug": {
        equals: params.vein_pattern.trim().toLowerCase(),
      },
    });
  }

  if (sanitizedSearch) {
    andConditions.push({
      or: [
        { code: { like: sanitizedSearch } },
        { title: { like: sanitizedSearch } },
      ],
    });
  }

  const where: Where = andConditions.length > 0 ? { and: andConditions } : {};

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
      depth: 1,
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

// --- Cached Service Layer ---

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

export const getCategoriesService = (locale: Locale) =>
  unstable_cache(
    async (): Promise<LookupItem[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const response = await payload.find({
          collection: "categories",
          locale,
          limit: 100,
          sort: "order",
          depth: 0,
        });

        return response.docs.map((doc) => {
          const rawDoc = doc as unknown as Record<string, unknown>;
          return {
            id: String(rawDoc.id ?? ""),
            title: String(rawDoc.title || rawDoc.slug || ""),
            slug: String(rawDoc.slug ?? ""),
          };
        });
      } catch {
        return [];
      }
    },
    ["attributes-categories-cache", locale],
    { revalidate: TTL.STATIC_SEC, tags: ["categories"] },
  )();

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

        return res.docs.map((doc) => ({
          id: String(doc.id ?? ""),
          title: String(doc.title ?? ""),
          slug: String(doc.slug ?? ""),
        }));
      } catch (error: unknown) {
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

        return res.docs.map((doc) => ({
          id: String(doc.id ?? ""),
          title: String(doc.title ?? ""),
          slug: String(doc.slug ?? ""),
        }));
      } catch (error: unknown) {
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

      return response.docs.map((d) => String(d.title ?? ""));
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
        collection: "thicknesses",
        limit: 50,
        depth: 0,
      });
      return response.docs.map((d) => String(d.slug || d.title || ""));
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
        collection: "finishes",
        locale,
        limit: 50,
        depth: 0,
      });
      return response.docs.map((d) => ({
        title: String(d.title ?? ""),
        slug: String(d.slug ?? ""),
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
