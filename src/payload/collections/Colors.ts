import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Colors: CollectionConfig = {
  slug: "colors",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("colors");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Colors change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("colors");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Colors delete:", err);
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
