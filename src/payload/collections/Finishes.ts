import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Finishes: CollectionConfig = {
  slug: "finishes",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("finishes");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Finishes change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("finishes");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Finishes delete:", err);
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
