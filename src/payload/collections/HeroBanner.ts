import { CollectionConfig } from "payload";

export const HeroBanner: CollectionConfig = {
  slug: "hero-banners",
  admin: {
    useAsTitle: "title",
    group: "Home Page",
    defaultColumns: ["title", "order", "status", "updatedAt"],
  },
  access: {
    read: () => true, // دسترسی عمومی برای خواندن در فرانت‌‌اند
  },
  fields: [
    // --- ۱. اطلاعات متنی (چندزبانه) ---
    {
      name: "tagline",
      type: "text",
      localized: true,
      defaultValue: "PERSIS QUARTZ",
      admin: {
        description: "متن کوچک بالای تیتر (مانند PERSIS QUARTZ)",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "تیتر اصلی اسلاید",
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

    // --- ۲. رسانه‌های دسکتاپ (Desktop Media) ---
    {
      type: "row", // قرارگیری فیلدها کنار هم در پنل ادمین
      fields: [
        {
          name: "desktopPoster",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "پوستر دسکتاپ (مهم برای SEO و حالت لودینگ/اینترنت ضعیف)",
          },
        },
        {
          name: "desktopVideo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "ویدیو پس‌زمینه دسکتاپ (اختیاری)",
          },
        },
      ],
    },

    // --- ۳. رسانه‌های موبایل (Mobile Media) ---
    {
      type: "row",
      fields: [
        {
          name: "mobilePoster",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description: "پوستر موبایل (حالت عمودی)",
          },
        },
        {
          name: "mobileVideo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "ویدیو پس‌زمینه موبایل (اختیاری)",
          },
        },
      ],
    },

    // --- ۴. دکمه/لینک اختیاری (Optional CTA) ---
    {
      type: "row",
      fields: [
        {
          name: "ctaText",
          type: "text",
          localized: true,
          admin: {
            description: "متن دکمه (اگر خالی باشد، دکمه نمایش داده نمی‌شود)",
          },
        },
        {
          name: "ctaLink",
          type: "text",
          admin: {
            description: "لینک هدف دکمه (مثلاً products/ یا contact/)",
          },
        },
      ],
    },

    // --- ۵. تنظیمات نمایش و دیزاین ---
    {
      type: "row",
      fields: [
        {
          name: "overlayOpacity",
          type: "number",
          min: 0,
          max: 100,
          defaultValue: 40,
          admin: {
            description: "میزان تیرگی لایه روی ویدیو/عکس (درصد از ۰ تا ۱۰۰)",
          },
        },
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          admin: {
            description:
              "ترتیب نمایش اسلایدها (اعداد کوچک‌تر اول نمایش داده می‌شوند)",
          },
        },
        {
          name: "status",
          type: "select",
          defaultValue: "published",
          options: [
            { label: "منتشر شده (Published)", value: "published" },
            { label: "پیش‌نویس (Draft)", value: "draft" },
          ],
        },
      ],
    },
  ],
};
