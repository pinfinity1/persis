// src/payload/collections/Media.ts
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true, // دسترسی عمومی برای خواندن تصاویر/ویدیوها در فرانت‌‌اند
  },
  upload: {
    staticDir: "media", // پوشه ذخیره‌سازی محلی فایل‌ها
    adminThumbnail: "card",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "desktop",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*", "video/mp4", "video/webm"], // پشتیبانی از عکس و ویدیو
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: {
        description: "متن جایگزین تصویر برای سئو (Alt Text)",
      },
    },
  ],
};
