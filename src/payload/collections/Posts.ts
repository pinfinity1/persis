// src/payload/collections/Posts.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "مقاله",
    plural: "مقالات و وبلاگ",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "publishedAt"],
    group: "Content",
  },
  access: {
    read: () => true, // خواندن برای عموم آزاد
  },
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
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "عنوان مقاله" },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "شناسه انگلیسی برای آدرس URL" },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: { description: "تصویر شاخص بالای مقاله" },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "چکیده کوتاه برای نمایش در کارت وبلاگ" },
    },
    {
      name: "content",
      type: "richText", // استفاده از همان lexicalEditor کانفیگ اصلی
      localized: true,
      required: true,
      admin: { description: "متن کامل مقاله" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "منتشر شده", value: "published" },
        { label: "پیش‌نویس", value: "draft" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
      defaultValue: () => new Date(),
    },
  ],
};
