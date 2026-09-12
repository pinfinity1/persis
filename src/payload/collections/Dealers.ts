// src/payload/collections/Dealers.ts
import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";
import { IRAN_PROVINCES } from "@/lib/constants/provinces";

export const Dealers: CollectionConfig = {
  slug: "dealers",
  admin: {
    useAsTitle: "title",
    group: "Sales Network",
    defaultColumns: ["title", "province", "city", "phone", "status"],
    components: {
      beforeListTable: [
        "@/components/admin/ExcelDealerImportControl#ExcelDealerImportControl",
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
          revalidateTag("dealers");
        } catch (err) {
          console.warn("Revalidate error on Dealers:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("dealers");
        } catch (err) {
          console.warn("Revalidate error on Dealers delete:", err);
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
