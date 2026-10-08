// src/payload/globals/HomePage.ts
import { revalidateTag } from "next/cache";
import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: {
    group: "Pages",
    description: "مدیریت یکپارچه هیرو بنر، رسانه‌ها و بخش‌های صفحه نخست",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("home-page");
        } catch (err) {
          console.warn("Revalidate error on HomePage:", err);
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // تب ۱: هیرو بنر
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

        // تب ۲: معرفی برند با مقادیر پیش‌فرض
        {
          label: "معرفی برند (Brand Intro)",
          description: "مدیریت متون معرفی اولیه و ارزش‌های سه‌گانه برند",
          fields: [
            {
              name: "introTitle",
              type: "text",
              label: "تیتر اصلی معرفی",
              localized: true,
              defaultValue: "دقت مهندسی برای آفرینش زیبایی ماندگار",
              admin: {
                description: "تیتر بزرگ بالای توضیحات برند",
              },
            },
            {
              name: "introDescription",
              type: "textarea",
              label: "متن توضیحات",
              localized: true,
              defaultValue:
                "تلفیق دانش مهندسی، فناوری پیشرفته و زیبایی‌شناسی معاصر برای خلق هارمونی در معماری مدرن.",
              admin: {
                description:
                  "متن ۱ الی ۲ خطی برای توصیف ارزش‌های برند زیر تیتر اصلی",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "feat1Tag",
                  type: "text",
                  label: "برچسب ویژگی اول",
                  localized: true,
                  defaultValue: "01 / Engineering",
                  admin: { width: "50%" },
                },
                {
                  name: "feat1Title",
                  type: "text",
                  label: "عنوان ویژگی اول",
                  localized: true,
                  defaultValue: "خلوص و دوام ساختاری",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "feat1Desc",
              type: "textarea",
              label: "توضیح ویژگی اول",
              localized: true,
              defaultValue: "مقاومت بالا در برابر خط، خش و حرارت.",
            },
            {
              type: "row",
              fields: [
                {
                  name: "feat2Tag",
                  type: "text",
                  label: "برچسب ویژگی دوم",
                  localized: true,
                  defaultValue: "02 / Aesthetics",
                  admin: { width: "50%" },
                },
                {
                  name: "feat2Title",
                  type: "text",
                  label: "عنوان ویژگی دوم",
                  localized: true,
                  defaultValue: "زبان طراحی معاصر",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "feat2Desc",
              type: "textarea",
              label: "توضیح ویژگی دوم",
              localized: true,
              defaultValue: "خلق هارمونی و عمق بصری در فضا.",
            },
            {
              type: "row",
              fields: [
                {
                  name: "feat3Tag",
                  type: "text",
                  label: "برچسب ویژگی سوم",
                  localized: true,
                  defaultValue: "03 / Trust",
                  admin: { width: "50%" },
                },
                {
                  name: "feat3Title",
                  type: "text",
                  label: "عنوان ویژگی سوم",
                  localized: true,
                  defaultValue: "اصالت و استاندارد جهانی",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "feat3Desc",
              type: "textarea",
              label: "توضیح ویژگی سوم",
              localized: true,
              defaultValue: "تضمین بالاترین سطح کیفیت و پایداری.",
            },
          ],
        },

        // تب ۳: کارت‌های تعاملی پشته‌ای (کاملاً پویا با قابلیت اضافه/حذف نامحدود)
        {
          label: "کارت‌های تعاملی (Info Cards)",
          description: "مدیریت پویا و نامحدود کارت‌های استک و ارزش‌های برند",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "infoCardsTagline",
                  type: "text",
                  label: "برچسب بالای بخش (Tagline)",
                  localized: true,
                  defaultValue: "PERSIS QUARTZ INSIGHTS",
                  admin: { width: "50%" },
                },
                {
                  name: "infoCardsTitle",
                  type: "text",
                  label: "تیتر اصلی بخش (Title)",
                  localized: true,
                  defaultValue: "معماری، کیفیت و خدمات Persis Quartz",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "infoCardsList",
              type: "array",
              label: "لیست کارت‌های پشته‌ای (Info Cards Stack)",
              labels: {
                singular: "کارت",
                plural: "کارت‌ها",
              },
              admin: {
                description:
                  "می‌توانید به تعداد دلخواه کارت اضافه، حذف یا جابجا کنید. کارت اول به‌صورت پیش‌فرض کارت مشخصات فنی با آیکون است.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "cardType",
                      type: "select",
                      label: "نوع طراحی کارت",
                      defaultValue: "standard",
                      required: true,
                      options: [
                        {
                          label: "طراحی محتوایی و دکمه‌دار (استاندارد)",
                          value: "standard",
                        },
                        {
                          label: "طراحی مشخصات فنی و آیکون‌ها (ویژه کوارتز)",
                          value: "features",
                        },
                      ],
                      admin: { width: "50%" },
                    },
                    {
                      name: "image",
                      type: "upload",
                      relationTo: "media",
                      label: "تصویر کارت",
                      required: false,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "category",
                      type: "text",
                      label: "عنوان دسته‌بندی بالای کارت",
                      localized: true,
                      required: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "title",
                      type: "text",
                      label: "تیتر اصلی کارت",
                      localized: true,
                      required: true,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "متن توضیحات کارت",
                  localized: true,
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.cardType !== "features",
                    description: "متن ۱ الی ۳ خطی معرفی و توضیحات کارت",
                  },
                },
                {
                  type: "row",
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.cardType !== "features",
                  },
                  fields: [
                    {
                      name: "ctaLabel",
                      type: "text",
                      label: "متن دکمه لینک (CTA)",
                      localized: true,
                      defaultValue: "مشاهده بیشتر",
                      admin: { width: "50%" },
                    },
                    {
                      name: "linkType",
                      type: "select",
                      label: "صفحه مقصد لینک",
                      defaultValue: "/catalogs",
                      options: [
                        {
                          label: "صفحه نگهداری و مراقبت",
                          value: "/care-and-maintenance",
                        },
                        {
                          label: "صفحه کاتالوگ‌ها و اسناد",
                          value: "/catalogs",
                        },
                        {
                          label: "درخواست سمپل باکس",
                          value: "/contact?type=sample",
                        },
                        {
                          label: "استعلام پروژه",
                          value: "/contact?type=project",
                        },
                        {
                          label: "شبکه عاملیت‌ها و نمایندگی‌ها",
                          value: "/dealers",
                        },
                        { label: "کاتالوگ محصولات", value: "/products" },
                        {
                          label: "ایده‌های طراحی (Inspirations)",
                          value: "/inspirations",
                        },
                        { label: "لینک سفارشی", value: "custom" },
                      ],
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "customLink",
                  type: "text",
                  label: "آدرس لینک سفارشی (URL)",
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.linkType === "custom",
                    description: "مثال: /about-persis یا https://instagram.com",
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
