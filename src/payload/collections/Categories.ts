// src/payload/collections/Categories.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    group: "Products",
    defaultColumns: ["title", "order", "slug", "updatedAt"],
    components: {
      beforeListTable: [
        "@/components/admin/ExcelCategoryImportControl#ExcelCategoryImportControl",
      ],
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("categories");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Categories change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("categories");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Categories delete:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
