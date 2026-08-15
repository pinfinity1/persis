import { CollectionConfig } from "payload";

export const Colors: CollectionConfig = {
  slug: "colors",
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
      localized: true, // نام رنگ (مثلاً: سفید، مشکی، آبی سورمه‌ای)
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true, // برای URL فیلتر (مثلاً: white, black, navy-blue)
    },
    {
      name: "hex_code",
      type: "text",
      admin: {
        description:
          "کد رنگی جهت نمایش دایره رنگ در فیلتر سایت (مثلاً: #FFFFFF)",
      },
    },
  ],
};
