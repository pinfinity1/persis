import { CollectionConfig } from "payload";

export const Finishes: CollectionConfig = {
  slug: "finishes",
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
      localized: true, // مثلاً: براق (Polished)
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // مثلاً: polished
    },
  ],
};
