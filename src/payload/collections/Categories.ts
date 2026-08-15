import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    group: "Catalog",
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
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "meta_title",
      type: "text",
      localized: true,
    },
    {
      name: "meta_description",
      type: "textarea",
      localized: true,
    },
  ],
};
