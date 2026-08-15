import { CollectionConfig } from "payload";

export const Dimensions: CollectionConfig = {
  slug: "dimensions",
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
      admin: {
        description:
          "عنوان ابعاد اسلب (مثلاً: 320 × 75 cm یا 320 × 160 cm Jumbo)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // مثلا: 320x75
    },
  ],
};
