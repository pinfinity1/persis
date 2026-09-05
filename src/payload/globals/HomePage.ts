// src/payload/globals/HomePage.ts
import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "صفحه اصلی (Home Page)",
  admin: {
    group: "Pages",
    description: "مدیریت یکپارچه هیرو بنر، رسانه‌ها و بخش‌های صفحه نخست",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // تب اول: هیرو بنر
        {
          label: "هیرو بنر (Hero Banner)",
          description: "مدیریت ویدیو، تصاویر پوستر و متون بالای صفحه نخست",
          fields: [
            {
              name: "tagline",
              type: "text",
              label: "برچسب بالای تیتر (Tagline)",
              localized: true,
              defaultValue: "PERSIS QUARTZ",
              admin: {
                description: "متن کوچک بالای تیتر (مثال: PERSIS QUARTZ)",
              },
            },
            {
              name: "title",
              type: "text",
              label: "تیتر اصلی بنر (Title)",
              localized: true,
              admin: {
                description: "تیتر بزرگ و معمارانه هیرو بنر",
              },
            },
            {
              name: "subtitle",
              type: "textarea",
              label: "زیرتیتر / توضیحات تکمیلی (Subtitle)",
              localized: true,
              admin: {
                description: "توضیح کوتاه ۱ تا ۲ خطی زیر تیتر اصلی",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "desktopPoster",
                  type: "upload",
                  relationTo: "media",
                  label: "پوستر دسکتاپ (Landscape)",
                  admin: {
                    description:
                      "تصویر افقی دسکتاپ با نسبت 16:9 (پیشنهادی: 1920x1080)",
                    width: "50%",
                  },
                },
                {
                  name: "desktopVideo",
                  type: "upload",
                  relationTo: "media",
                  label: "ویدیوی دسکتاپ (MP4)",
                  admin: {
                    description:
                      "ویدیوی بدون صدا و بهینه‌شده برای دسکتاپ (اختیاری)",
                    width: "50%",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "mobilePoster",
                  type: "upload",
                  relationTo: "media",
                  label: "پوستر موبایل (Portrait)",
                  admin: {
                    description:
                      "تصویر عمودی موبایل با نسبت 9:16 (پیشنهادی: 1080x1920)",
                    width: "50%",
                  },
                },
                {
                  name: "mobileVideo",
                  type: "upload",
                  relationTo: "media",
                  label: "ویدیوی موبایل (MP4)",
                  admin: {
                    description:
                      "ویدیوی عمودی موبایل جهت بهینه‌سازی بارگذاری (اختیاری)",
                    width: "50%",
                  },
                },
              ],
            },
          ],
        },

        // تب دوم: کارت‌های معرفی ارزش‌های برند
        {
          label: "کارت‌های تعاملی (Info Cards)",
          description:
            "تصاویر چهارگانه کارت‌های ویژگی‌ها، نگهداری، کاتالوگ و سمپل",
          fields: [
            {
              name: "infoCardsImages",
              type: "group",
              label: "تصاویر کارت‌های استک",
              fields: [
                {
                  name: "featuresImage",
                  type: "upload",
                  relationTo: "media",
                  label: "۱. تصویر کارت مشخصات فنی (Features)",
                  admin: {
                    description:
                      "پیشنهاد: کلوزآپ بافت کوارتز یا تست‌های آزمایشگاهی",
                  },
                },
                {
                  name: "maintenanceImage",
                  type: "upload",
                  relationTo: "media",
                  label: "۲. تصویر کارت مراقبت و نگهداری (Maintenance)",
                  admin: {
                    description: "پیشنهاد: فضای آشپزخانه تمیز و کانترتاپ لوکس",
                  },
                },
                {
                  name: "catalogsImage",
                  type: "upload",
                  relationTo: "media",
                  label: "۳. تصویر کارت کاتالوگ‌ها (Catalogs)",
                  admin: {
                    description: "پیشنهاد: ژورنال معماری یا کاتالوگ بازشده",
                  },
                },
                {
                  name: "sampleImage",
                  type: "upload",
                  relationTo: "media",
                  label: "۴. تصویر کارت سمپل باکس (Sample Box)",
                  admin: {
                    description: "پیشنهاد: پالت یا جعبه نمونه‌سنگ‌های لوکس",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
