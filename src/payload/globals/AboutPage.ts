// src/payload/globals/AboutPage.ts
import { revalidateTag } from "next/cache";
import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "صفحه درباره ما (About Us)",
  admin: {
    group: "Pages",
    description: "مدیریت جامع رسانه‌ها، بیانیه‌ها و محتوای صفحه درباره پرسیس",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("about-page");
        } catch (err) {
          console.warn("Revalidate error on AboutPage change:", err);
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "بخش نخست (Intro / Overview)",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "visionTag",
                  type: "text",
                  label: "برچسب بالا (Tag)",
                  localized: true,
                  defaultValue: "چشم‌انداز و اصالت",
                  admin: { width: "50%" },
                },
                {
                  name: "visionTitle",
                  type: "text",
                  label: "تیتر بخش (Title)",
                  localized: true,
                  defaultValue: "تلفیق دانش، نوآوری و زیبایی‌شناسی",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "visionDesc1",
              type: "textarea",
              label: "پاراگراف اول",
              localized: true,
              defaultValue:
                "ما در تلاشیم تا به شرکتی پیشرو تبدیل شویم که همراه با مشتریان خود و با نگاهی مسئولانه، آینده‌ای نوآورانه و باارزش را در دنیای معماری و طراحی خلق می‌کند. موفقیت ما در گرو استعداد، تخصص و هم‌افزایی اعضای تیم است.",
            },
            {
              name: "visionDesc2",
              type: "textarea",
              label: "پاراگراف دوم",
              localized: true,
              defaultValue:
                "مسیر خود را در شهرکرد آغاز کردیم تا با بهره‌گیری از دانش مهندسی و متخصصان مجرب، سطوحی با کیفیت تولید کنیم. برند ما با تلفیق هنر و صنعت شکل گرفته است تا هارمونی ظریفی از استحکام بی‌نظیر و زیبایی چشم‌نواز را به فضای دکوراسیون شما هدیه دهد.",
            },
            {
              name: "visionImage",
              type: "upload",
              relationTo: "media",
              label: "تصویر بخش چشم‌انداز (عمودی یا 4:5)",
              admin: {
                description:
                  "پیشنهاد: نمای خط تولید پیشرفته یا بافت کلوزآپ اسلب",
              },
            },
          ],
        },

        // تب ۲: نوار اسکرول گالری (وسط صفحه)
        {
          label: "گالری متحرک (Gallery)",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "galleryTag",
                  type: "text",
                  label: "برچسب گالری",
                  localized: true,
                  defaultValue: "نمایشگاه متریال",
                  admin: { width: "50%" },
                },
                {
                  name: "galleryTitle",
                  type: "text",
                  label: "تیتر گالری",
                  localized: true,
                  defaultValue: "روایت بافت، نور و جزئیات مهندسی",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "galleryImages",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              label: "انتخاب بالک تصاویر گالری",
              admin: {
                description:
                  "تصاویر مورد نظر را از گالری مدیاهای موجود انتخاب یا آپلود کنید. ترتیب نمایش با درگ اند دراپ قابل تغییر است.",
              },
            },
          ],
        },

        // تب ۳: هنر مهندسی و کاربرد (بخش پایین صفحه)
        {
          label: "بخش دوم (Craftsmanship)",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "craftsmanshipTag",
                  type: "text",
                  label: "برچسب بخش",
                  localized: true,
                  defaultValue: "طراحی و مهندسی",
                  admin: { width: "50%" },
                },
                {
                  name: "craftsmanshipTitle",
                  type: "text",
                  label: "تیتر بخش",
                  localized: true,
                  defaultValue: "الهام‌گرفته از طبیعت، ساخته‌شده برای زندگی",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "craftsmanshipDesc",
              type: "textarea",
              label: "متن کامل توضیحات",
              localized: true,
              defaultValue:
                "هر اسلب پرسیس کوارتز، بازتابی از شکوه طبیعت است که با دقت مهندسی بازآفرینی شده است. از رگه‌های ظریف و باشکوه کالاکاتا تا عمق رنگ‌های یکدست و مینیمال، محصولات ما با هدف پاسخگویی به پیچیده‌ترین نیازهای معماری داخلی و ارتقای سطح کیفی فضاهای مسکونی و تجاری طراحی می‌شوند. ما سنگ را نه به عنوان یک مصالح، بلکه به عنوان بوم نقاشی معماری می‌بینیم.",
            },
            {
              name: "craftsmanshipImage",
              type: "upload",
              relationTo: "media",
              label: "تصویر بخش ساخت و طراحی (افقی یا مربعی)",
              admin: {
                description:
                  "پیشنهاد: اجرای سنگ در کانتر لوکس آشپزخانه یا فضاهای مدرن",
              },
            },
          ],
        },
      ],
    },
  ],
};
