// src/payload/collections/Media.ts
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "mimeType", "filesize", "updatedAt"],
  },
  upload: {
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 225,
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        formatOptions: { format: "webp", options: { quality: 85 } },
      },
      {
        name: "desktop",
        width: 1920,
        height: 1440,
        formatOptions: { format: "webp", options: { quality: 88 } },
      },
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ],
  },
  hooks: {
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === "create" && args.req?.file) {
          const file = args.req.file;
          const safeFileName = file.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9.-]/g, "");
          file.name = safeFileName;
        }
        return args;
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description:
          "عنوان/متن جایگزین تصویر برای سئو و موتورهای جستجو (مثال: اسلب پرسیس کوارتز)",
      },
    },
  ],
};
