import { CollectionConfig } from "payload";

export const HeroBanner: CollectionConfig = {
  slug: "hero-banners",
  admin: {
    useAsTitle: "title",
    group: "Home Page",
    defaultColumns: ["title", "status", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ۱. اطلاعات متنی (۳ زبانه)
    {
      name: "tagline",
      type: "text",
      localized: true,
      defaultValue: "PERSIS QUARTZ",
      admin: {
        description: "متن کوچک بالای تیتر (مثال: PERSIS QUARTZ)",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "تیتر اصلی بنر",
      },
    },
    {
      name: "subtitle",
      type: "textarea",
      localized: true,
      admin: {
        description: "توضیحات تکمیلی زیر تیتر",
      },
    },

    // ۲. رسانه دسکتاپ (افقی)
    {
      type: "row",
      fields: [
        {
          name: "desktopPoster",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description: "تصویر دسکتاپ (۱۹۲۰ در ۱۰۸۰) - اجباری",
            width: "50%",
          },
        },
        {
          name: "desktopVideo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "ویدیوی دسکتاپ MP4 (اختیاری)",
            width: "50%",
          },
        },
      ],
    },

    // ۳. رسانه موبایل (عمودی)
    {
      type: "row",
      fields: [
        {
          name: "mobilePoster",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description: "تصویر موبایل (عمودی ۱۰۸۰ در ۱۹۲۰) - اجباری",
            width: "50%",
          },
        },
        {
          name: "mobileVideo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "ویدیوی موبایل MP4 (اختیاری)",
            width: "50%",
          },
        },
      ],
    },

    // ۴. وضعیت فعال/غیرفعال بودن
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "فعال روی سایت (Published)", value: "published" },
        { label: "پیش‌نویس / غیرفعال (Draft)", value: "draft" },
      ],
      admin: {
        description:
          "جهت نمایش این بنر در سایت، وضعیت را روی «فعال روی سایت» قرار دهید.",
      },
    },
  ],
};
