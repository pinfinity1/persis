import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const VeinPatterns: CollectionConfig = {
  slug: "vein-patterns",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("vein-patterns");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on VeinPatterns change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("vein-patterns");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on VeinPatterns delete:", err);
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
