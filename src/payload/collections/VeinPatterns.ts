import { CollectionConfig } from "payload";

export const VeinPatterns: CollectionConfig = {
  slug: "vein-patterns",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true, // مثلاً: رگه ظریف و مویی، رگه پهن و چشم‌نواز، ابر و بادی
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // برای استفاده در فیلترهای URL
    },
  ],
};
