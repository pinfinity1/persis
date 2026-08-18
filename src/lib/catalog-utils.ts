// src/lib/catalog-utils.ts
export interface CategoryItemLike {
  id?: string;
  title?: string;
  slug?: string;
}

export function extractCategorySlug(
  category: CategoryItemLike | string | undefined,
): string {
  if (!category) return "";
  if (typeof category === "object") return category.slug || "";
  return category;
}

export function extractCategoryTitle(
  category: CategoryItemLike | string | undefined,
): string {
  if (!category) return "";
  if (typeof category === "object") return category.title || "";
  return category;
}
