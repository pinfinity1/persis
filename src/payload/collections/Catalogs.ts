import { revalidateTag } from "next/cache";
import type { CollectionConfig } from "payload";

export const Catalogs: CollectionConfig = {
  slug: "catalogs",
  admin: {
    useAsTitle: "title",
    group: "Publications",
    defaultColumns: ["title", "year", "catalog_type", "file_size_mb", "status"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("catalogs");
        } catch (err) {
          console.warn("Revalidate error on Catalogs:", err);
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
      admin: {
        description:
          "عنوان کاتالوگ (مثلاً: کاتالوگ جامع اسلب‌ها / مشخصات فنی و دیتیل)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "year",
          type: "number",
          required: true,
          defaultValue: new Date().getFullYear(),
          admin: {
            description: "سال انتشار (مانند 2026 یا 2025)",
            width: "50%",
          },
        },
        {
          name: "catalog_type",
          type: "select",
          required: true,
          defaultValue: "full_catalog",
          options: [
            {
              label: "کاتالوگ جامع محصولات (Full Catalog)",
              value: "full_catalog",
            },
            {
              label: "مشخصات فنی و مهندسی (Technical Specs)",
              value: "technical",
            },
            {
              label: "بروشور اختصاصی کالکشن (Collection Brochure)",
              value: "collection",
            },
            {
              label: "راهنمای نصب و نگهداری (Care & Installation)",
              value: "guide",
            },
          ],
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "cover_image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "pdf_file",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "file_size_mb",
          type: "number",
          required: true,
          admin: {
            description: "حجم فایل (MB)",
            width: "50%",
          },
        },
        {
          name: "page_count",
          type: "number",
          admin: {
            description: "تعداد صفحات (اختیاری)",
            width: "50%",
          },
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
