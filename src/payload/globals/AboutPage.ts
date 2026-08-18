import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    group: "Pages",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "visionImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "تصویر بخش چشم‌انداز و اصالت (Vision Image)",
      },
    },
    {
      name: "craftsmanshipImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "تصویر بخش طراحی و الهام (Craftsmanship Image)",
      },
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description: "تصاویر گالری متحرک نوار اسکرول افقی",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
