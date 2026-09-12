import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Thicknesses: CollectionConfig = {
  slug: "thicknesses",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("thicknesses");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Thicknesses change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("thicknesses");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Thicknesses delete:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
