// src/payload/globals/ContactPage.ts
import { revalidateTag } from "next/cache";
import type { GlobalConfig } from "payload";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: {
    group: "Pages",
    description: "مدیریت اطلاعات تماس، آدرس کارخانه و دفاتر و متون صفحه تماس",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("contact-page");
        } catch (err) {
          console.warn("Revalidate error on ContactPage:", err);
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // تب ۱: اطلاعات تماس مرکزی و کارخانه
        {
          label: "اطلاعات تماس و کارخانه (Main Contact)",
          description: "مدیریت آدرس، تلفن، ایمیل و تیترهای صفحه تماس",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "watermark",
                  type: "text",
                  label: "متن واترمارک پس‌زمینه (Watermark)",
                  defaultValue: "CONTACT",
                  admin: { width: "50%" },
                },
                {
                  name: "title",
                  type: "text",
                  label: "تیتر اصلی هدر صفحه",
                  localized: true,
                  defaultValue: "تماس با ما",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "infoTitle",
                  type: "text",
                  label: "تیتر بخش اطلاعات تماس",
                  localized: true,
                  defaultValue: "دفتر مرکزی و کارخانه",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "infoDesc",
              type: "textarea",
              label: "توضیحات بخش اطلاعات تماس",
              localized: true,
              defaultValue:
                "برای هماهنگی جلسات حضوری، بازدید از شوروم کارخانه و یا دریافت مشاوره‌های تخصصی معماری، از طریق راه‌های زیر با ما در ارتباط باشید.",
            },
            {
              type: "row",
              fields: [
                {
                  name: "factoryTitle",
                  type: "text",
                  label: "عنوان بلوک کارخانه",
                  localized: true,
                  defaultValue: "آدرس کارخانه",
                  admin: { width: "50%" },
                },
                {
                  name: "factoryAddress",
                  type: "textarea",
                  label: "آدرس دقیق کارخانه",
                  localized: true,
                  defaultValue:
                    "شهرکرد، قطب صنعتی، فاز ۳، اندیشه ۶، پلاک ۳۶۹",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "phoneTitle",
                  type: "text",
                  label: "عنوان تلفن تماس",
                  localized: true,
                  defaultValue: "تلفن تماس مستقیم",
                  admin: { width: "50%" },
                },
                {
                  name: "phoneNumber",
                  type: "text",
                  label: "شماره تلفن",
                  defaultValue: "+98 38 3228 1752",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "emailTitle",
                  type: "text",
                  label: "عنوان ایمیل",
                  localized: true,
                  defaultValue: "پست الکترونیک سازمانی",
                  admin: { width: "50%" },
                },
                {
                  name: "emailAddress",
                  type: "text",
                  label: "آدرس ایمیل",
                  defaultValue: "info@persisquartz.com",
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },

        // تب ۲: دفاتر و شعب تکمیلی (اختیاری)
        {
          label: "دفاتر و شعب تکمیلی (Offices)",
          description:
            "در صورت نیاز می‌توانید دفاتر فروش یا شوروم‌های دیگر اضافه نمایید",
          fields: [
            {
              name: "additionalOffices",
              type: "array",
              label: "لیست دفاتر و شعب",
              labels: {
                singular: "دفتر / شعبه",
                plural: "دفاتر و شعب",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "title",
                      type: "text",
                      label: "عنوان شعبه یا دفتر",
                      localized: true,
                      required: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "phone",
                      type: "text",
                      label: "شماره تلفن",
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "address",
                      type: "textarea",
                      label: "آدرس",
                      localized: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "email",
                      type: "text",
                      label: "ایمیل (اختیاری)",
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // تب ۳: تنظیمات متون فرم
        {
          label: "تنظیمات عناوین فرم (Form Labels)",
          description: "شخصی‌سازی عناوین تب‌های فرم و پیام ثبت موفق",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "tabGeneral",
                  type: "text",
                  label: "عنوان تب تماس عمومی",
                  localized: true,
                  defaultValue: "تماس عمومی",
                  admin: { width: "50%" },
                },
                {
                  name: "tabSample",
                  type: "text",
                  label: "عنوان تب درخواست سمپل",
                  localized: true,
                  defaultValue: "درخواست سمپل",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "tabProject",
                  type: "text",
                  label: "عنوان تب استعلام پروژه",
                  localized: true,
                  defaultValue: "استعلام پروژه",
                  admin: { width: "50%" },
                },
                {
                  name: "tabDealer",
                  type: "text",
                  label: "عنوان تب اخذ عاملیت",
                  localized: true,
                  defaultValue: "اخذ عاملیت",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "successTitle",
                  type: "text",
                  label: "عنوان پیام موفقیت",
                  localized: true,
                  defaultValue: "با تشکر از پیام شما",
                  admin: { width: "50%" },
                },
                {
                  name: "submitAnotherBtn",
                  type: "text",
                  label: "متن دکمه ثبت درخواست جدید",
                  localized: true,
                  defaultValue: "ثبت درخواست دیگر",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "successMessage",
              type: "textarea",
              label: "متن کامل پیام موفقیت",
              localized: true,
              defaultValue:
                "درخواست شما دریافت شد و پس از بررسی توسط دپارتمان مربوطه، در اسرع وقت با شما تماس خواهیم گرفت.",
            },
          ],
        },
      ],
    },
  ],
};
