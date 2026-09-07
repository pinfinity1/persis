// src/payload/globals/ApplicationsPage.ts
import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const ApplicationsPage: GlobalConfig = {
  slug: "applications-page",
  label: "صفحه کاربردها (Applications)",
  admin: {
    group: "Pages",
    description: "مدیریت اسلایدها و بخش‌های تعاملی صفحه کاربردها",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("applications-page");
        } catch (err) {
          console.warn("Revalidate error on ApplicationsPage:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "tagline",
      type: "text",
      label: "برچسب بالا (Tagline)",
      localized: true,
      defaultValue: "کاربردهای معمارانه",
    },
    {
      name: "title",
      type: "text",
      label: "تیتر اصلی صفحه",
      localized: true,
      defaultValue: "گستره بی‌پایان کاربری در معماری مدرن",
    },
    {
      name: "subtitle",
      type: "textarea",
      label: "توضیح کوتاه زیر تیتر",
      localized: true,
      defaultValue:
        "از سطوح یکپارچه آشپزخانه تا پروژه‌های عظیم تجاری؛ دوام، ایمنی و زیبایی را با پرسیس کوارتز تجربه کنید.",
    },
    {
      name: "items",
      type: "array",
      label: "آیتم‌های کاربرد (هم برای Intro تمام‌صفحه و هم برای گرید نهایی)",
      minRows: 1,
      defaultValue: [
        {
          title: "صفحات رویه کابینت و جزیره آشپزخانه",
          desc: "مقاومت استثنایی در برابر حرارت، لکه‌های سخت و خط و خش ناشی از کاربری روزمره.",
        },
        {
          title: "روشویی و محیط‌های مرطوب و بهداشتی",
          desc: "ساختار نفوذناپذیر و آنتی‌باکتریال ایده‌آل برای محیط‌های مرطوب، بدون ایجاد قارچ و رسوب.",
        },
        {
          title: "کانترهای تجاری و فضاهای درمانی",
          desc: "بالاترین سطح بهداشت و دوام ترافیکی برای پروژه‌های اداری، بیمارستانی و کلینیک‌ها.",
        },
        {
          title: "دیوارپوش و المان‌های دکوراتیو",
          desc: "هارمونی لوکس و یکپارچه در سطوح عمودی با بازتاب چشم‌نواز نور طبیعی و مصنوعی.",
        },
      ],
      fields: [
        {
          name: "title",
          type: "text",
          label: "عنوان کاربرد",
          localized: true,
          required: true,
        },
        {
          name: "desc",
          type: "textarea",
          label: "شرح کاربرد",
          localized: true,
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "تصویر اصلی (کیفیت بالا برای تمام‌صفحه و گرید)",
          required: true,
        },
      ],
    },
  ],
};
