// src/payload/globals/ProductsOrderSettings.ts
import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const ProductsOrderSettings: GlobalConfig = {
  slug: "products-order-settings",
  label: "Products Category Order",
  admin: {
    group: "Products",
    description:
      "Manage global display priority of products by arranging their categories.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("products");
          revalidateTag("featured-products");
          revalidateTag("home-page");
        } catch (err) {
          console.warn("Revalidate error on ProductsOrderSettings:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "categoryOrder",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      label: "Category Priority Order (Drag & Drop)",
      admin: {
        description:
          "Select and order categories from top to bottom. Products belonging to the first category will appear first on the website.",
      },
    },
  ],
};
