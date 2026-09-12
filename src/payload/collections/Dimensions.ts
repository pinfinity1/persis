import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Dimensions: CollectionConfig = {
  slug: "dimensions",
  admin: {
    useAsTitle: "title",
    group: "Attributes",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("dimensions");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Dimensions change:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("dimensions");
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Dimensions delete:", err);
        }
      },
    ],
  },
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
      unique: true,
    },
  ],
};
