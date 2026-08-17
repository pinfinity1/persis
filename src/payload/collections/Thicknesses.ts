import { CollectionConfig } from "payload";

export const Thicknesses: CollectionConfig = {
  slug: "thicknesses",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  fields: [
    {
      name: "title",
      type: "text",
      required: true, // مثلاً: 12mm (1.2 cm) یا 20mm
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // مثلاً: 12mm یا 20mm
    },
  ],
};
