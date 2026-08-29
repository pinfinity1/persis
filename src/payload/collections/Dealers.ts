import type { CollectionConfig } from "payload";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";

export const Dealers: CollectionConfig = {
  slug: "dealers",
  admin: {
    useAsTitle: "title",
    group: "Catalog",
    defaultColumns: ["title", "province", "city", "phone"],
    components: {
      beforeListTable: [
        "@/components/admin/ExcelDealerImportControl#ExcelDealerImportControl",
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
      type: "row",
      fields: [
        {
          name: "province",
          type: "select",
          required: true,
          index: true,
          options: IRAN_PROVINCES.map((p) => ({
            label: `${p.fa} (${p.en})`,
            value: p.slug,
          })),
          admin: { width: "50%" },
        },
        {
          name: "city",
          type: "text",
          required: true,
          localized: true,
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "address",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "phone",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "منتشر شده (Published)", value: "published" },
        { label: "پیش‌نویس (Draft)", value: "draft" },
      ],
    },
  ],
};
