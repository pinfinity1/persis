// src/payload/collections/Posts.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "publishedAt", "updatedAt"],
    group: "Content",
    description:
      "مدیریت مقالات تخصصی معماری، مقایسه متریال‌ها و یادداشت‌های فنی",
  },
  access: {
    read: () => true,
  },
  lockDocuments: false,
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("posts");
        } catch (err) {
          console.warn("Revalidate error on Posts:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("posts");
        } catch (err) {
          console.warn("Revalidate error on Posts delete:", err);
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
        description: "عنوان کامل مقاله (در تگ H1 و متادیتای سئو قرار می‌گیرد)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "شناسه انگلیسی یکتا برای آدرس URL (فقط حروف کوچک انگلیسی و خط تیره؛ مانند: quartz-slab-guide)",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: {
        description: "تصویر شاخص بالای مقاله و کارت وبلاگ (نسبت ۱۶:۹ یا ۴:۳)",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "چکیده کوتاه (۱ الی ۲ خط) جهت نمایش در کارت وبلاگ و توضیحات سئو در گوگل",
      },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      required: true,
      admin: {
        description: "متن کامل مقاله همراه با تیترها، تصاویر و پاراگراف‌ها",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "Published (منتشر شده)", value: "published" },
        { label: "Draft (پیش‌نویس)", value: "draft" },
      ],
      admin: {
        position: "sidebar",
        description:
          "تنها مقالات در وضعیت Published در سایت و سایت‌مپ نمایش داده می‌شوند.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "تاریخ نمایش داده شده روی کارت مقاله و مبنای سورت زمانی",
      },
      defaultValue: () => new Date(),
    },
  ],
};
