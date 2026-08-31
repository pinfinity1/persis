import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export interface GetProductsParams {
  locale: "fa" | "en" | "ar";
  page?: number;
  limit?: number;
  category?: string;
  color?: string;
  vein_pattern?: string;
  sort?: string;
  search?: string;
}

export interface ProductMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next_page: boolean;
}

export interface CategoryItem {
  id: string;
  title: string;
  slug: string;
}

export interface ColorItem {
  id: string;
  title: string;
  slug: string;
  hex_code?: string;
}

export interface VeinPatternItem {
  id: string;
  title: string;
  slug: string;
}

export interface GalleryItem {
  image: { url: string; alt?: string } | string;
  caption?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  code: string;
  category: CategoryItem | string;
  color_family: ColorItem | string;
  vein_pattern?: VeinPatternItem | string;
  is_in_stock: "in_stock" | "on_demand" | "discontinued";
  is_featured?: boolean;
  thumbnail: { url: string; alt?: string } | string;
  gallery?: GalleryItem[];
  available_thicknesses?: string[];
  finishes?: string[];
  dimensions?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  specsSheetUrl?: string;
}

export function extractCategorySlug(
  category: CategoryItem | string | undefined,
): string {
  if (!category) return "";
  if (typeof category === "object") return category.slug || "";
  return category;
}

export function extractCategoryTitle(
  category: CategoryItem | string | undefined,
): string {
  if (!category) return "";
  if (typeof category === "object") return category.title || "";
  return category;
}

export const getProductsService = cache(
  async ({
    locale,
    page = 1,
    limit = 9,
    category,
    color,
    vein_pattern,
    sort = "-createdAt",
    search,
  }: GetProductsParams): Promise<{
    data: ProductItem[];
    meta: ProductMeta;
  }> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const where: Record<string, any> = {};

      if (category) {
        where["category.slug"] = { equals: category };
      }

      if (color) {
        where["color_family.slug"] = { equals: color };
      }

      if (vein_pattern) {
        where["vein_pattern.slug"] = { equals: vein_pattern };
      }

      if (search) {
        where.or = [{ title: { like: search } }, { code: { like: search } }];
      }

      const response = await payload.find({
        collection: "products",
        locale,
        page,
        limit,
        where,
        sort,
        depth: 2,
      });

      return {
        data: (response.docs as unknown as ProductItem[]) || [],
        meta: {
          current_page: response.page ?? 1,
          total_pages: response.totalPages ?? 1,
          total_items: response.totalDocs ?? 0,
          has_next_page: (response.page ?? 1) < (response.totalPages ?? 1),
        },
      };
    } catch (error) {
      console.error("Error fetching products from Payload CMS:", error);
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
  },
);

export const getProductBySlugService = cache(
  async (
    slug: string,
    locale: "fa" | "en" | "ar",
  ): Promise<ProductItem | null> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "products",
        locale,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      });

      if (response.docs && response.docs.length > 0) {
        return response.docs[0] as unknown as ProductItem;
      }
      return null;
    } catch (error) {
      console.error("Error fetching product by slug from Payload CMS:", error);
      return null;
    }
  },
);

export const getCategoriesService = cache(
  async (locale: "fa" | "en" | "ar"): Promise<CategoryItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "categories",
        locale,
        limit: 100,
        sort: "order",
      });

      return response.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
      }));
    } catch (error) {
      console.error("Error fetching categories from Payload CMS:", error);
      return [];
    }
  },
);

export const getColorsService = cache(
  async (locale: "fa" | "en" | "ar"): Promise<ColorItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "colors",
        locale,
        limit: 100,
      });

      return response.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        hex_code: doc.hex_code,
      }));
    } catch (error) {
      console.error("Error fetching colors from Payload CMS:", error);
      return [];
    }
  },
);

export const getVeinPatternsService = cache(
  async (locale: "fa" | "en" | "ar"): Promise<VeinPatternItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "vein-patterns",
        locale,
        limit: 100,
      });

      return response.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
      }));
    } catch (error) {
      console.error("Error fetching vein patterns from Payload CMS:", error);
      return [];
    }
  },
);

export const getAllDimensionsService = cache(async (): Promise<string[]> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const response = await payload.find({
      collection: "dimensions",
      limit: 50,
    });
    return response.docs.map((d: any) => d.title);
  } catch (error) {
    console.error("Error fetching dimensions:", error);
    return [];
  }
});

export const getAllThicknessesService = cache(async (): Promise<string[]> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const response = await payload.find({
      collection: "thicknesses" as any,
      limit: 50,
    });
    return response.docs.map((d: any) => d.slug || d.title);
  } catch (error) {
    console.error("Error fetching thicknesses:", error);
    return [];
  }
});

export const getAllFinishesService = cache(
  async (
    locale: "fa" | "en" | "ar",
  ): Promise<{ title: string; slug: string }[]> => {
    try {
      const payload = await getPayload({ config: configPromise });
      const response = await payload.find({
        collection: "finishes" as any,
        locale,
        limit: 50,
      });
      return response.docs.map((d: any) => ({
        title: d.title,
        slug: d.slug,
      }));
    } catch (error) {
      console.error("Error fetching finishes:", error);
      return [];
    }
  },
);

export const getFeaturedProductsService = cache(
  async (locale: "fa" | "en" | "ar"): Promise<ProductItem[]> => {
    try {
      const payload = await getPayload({ config: configPromise });

      const response = await payload.find({
        collection: "products",
        locale,
        limit: 6, // دقیقاً ۶ محصول را می‌گیرد
        where: {
          is_featured: { equals: true },
        },
        sort: "-updatedAt", // جدیدترین مواردی که تیک زده‌اید را اول می‌آورد
        depth: 2,
      });

      return (response.docs as unknown as ProductItem[]) || [];
    } catch (error) {
      console.error(
        "Error fetching featured products from Payload CMS:",
        error,
      );
      return [];
    }
  },
);
