import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export interface GetProductsParams {
  locale: "fa" | "en" | "ar";
  page?: number;
  limit?: number;
  category?: string;
  color?: string;
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
  is_in_stock: "in_stock" | "on_demand" | "discontinued";
  thumbnail: { url: string; alt?: string } | string;
  gallery?: GalleryItem[];
  available_thicknesses?: string[];
  finishes?: string[];
  dimensions?: string;
  description?: string;
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

export async function getProductsService({
  locale,
  page = 1,
  limit = 9,
  category,
  color,
  sort = "-createdAt",
  search,
}: GetProductsParams): Promise<{ data: ProductItem[]; meta: ProductMeta }> {
  try {
    const payload = await getPayload({ config: configPromise });
    const where: Record<string, any> = {};

    if (category) {
      where["category.slug"] = { equals: category };
    }

    if (color) {
      where["color_family.slug"] = { equals: color };
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
}

export async function getProductBySlugService(
  slug: string,
  locale: "fa" | "en" | "ar",
): Promise<ProductItem | null> {
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
}

export async function getCategoriesService(
  locale: "fa" | "en" | "ar",
): Promise<CategoryItem[]> {
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
}

export async function getColorsService(
  locale: "fa" | "en" | "ar",
): Promise<ColorItem[]> {
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
}
