// src/payload/globals/ApplicationsPage.ts
import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const ApplicationsPage: GlobalConfig = {
  slug: "applications-page",
  label: "صفحه کاربردها (Applications)",
  admin: {
    group: "Pages",
    description: "مدیریت شوکیس، مانیفست و بخش‌های کاربردی معماری",
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
      type: "tabs",
      tabs: [
        {
          label: "مانیفست هدر (Header Narrative)",
          fields: [
            {
              name: "headerTag",
              type: "text",
              label: "برچسب کوچک انگلیسی",
              defaultValue: "SPATIAL INTEGRATION",
            },
            {
              name: "headerTitle",
              type: "text",
              label: "تیتر اصلی مانیفست",
              localized: true,
              required: true,
              defaultValue:
                "سطوحی فراتر از یک پوشش؛ خلق هارمونی در معماری معاصر",
            },
            {
              name: "headerDesc",
              type: "textarea",
              label: "متن توضیح مانیفست",
              localized: true,
              required: true,
              defaultValue:
                "تلفیق زیبایی بصری با مقاومت ساختاری؛ امکان خلق فضاهایی منحصربه‌فرد و هماهنگ با سبک‌های متنوع، از محیط‌های خانگی تا فضاهای عمومی و بهداشتی.",
            },
          ],
        },
        {
          label: "شوکیس چسبنده (Pinned Showcase)",
          fields: [
            {
              name: "showcaseItems",
              type: "array",
              label: "اسلایدهای شوکیس عمودی",
              minRows: 1,
              defaultValue: [
                { tag: "KITCHEN & COUNTERTOPS" },
                { tag: "BATH & WELLNESS" },
                { tag: "COMMERCIAL & TRAFFIC" },
                { tag: "ARCHITECTURAL FACADES" },
              ],
              fields: [
                {
                  name: "tag",
                  type: "text",
                  label: "تگ تکی و خوانا (انگلیسی)",
                  required: true,
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: "تصویر تمام‌صفحه",
                  required: false, // رفع ارور اعتبارسنجی دیتابیس
                },
              ],
            },
          ],
        },
        {
          label: "بخش‌های کاربری (Application Sections)",
          fields: [
            {
              name: "sections",
              type: "array",
              label: "کاربردهای معماری با گالری و مشخصات",
              minRows: 1,
              defaultValue: [
                {
                  num: "01",
                  enTag: "RESIDENTIAL & CULINARY",
                  title: "صفحات رویه کابینت، کانتر و جزیره آشپزخانه",
                  desc: "سطوح پرسیس کوارتز مقاومت بالایی در برابر خط و خش ابزارهای تیز، شوک حرارتی غیرمستقیم و نفوذ لکه‌های قهوه و چربی دارند. ساختار متراکم و بدون درز این سنگ‌ها، استانداردی بی‌نقص برای تماس با مواد غذایی ایجاد می‌کند.",
                  specs: [
                    { label: "سختی سطحی", val: "7 Mohs" },
                    { label: "جذب آب", val: "۰.۰۳٪ (نفوذناپذیر)" },
                    { label: "ضخامت استاندارد" },
                  ],
                },
                {
                  num: "02",
                  enTag: "BATH & HYGIENIC WELLNESS",
                  title: "روشویی، سرویس‌های مستر و محیط‌های مرطوب",
                  desc: "فرآیند تولید در شرایط خلأ مانع از ایجاد تخلخل میکروسکوپی در بافت سنگ می‌شود. عدم جذب رطوبت امکان تشکیل باکتری، رسوبات آهکی آب و کپک را از بین برده و پاکسازی آن تنها با آب و شوینده‌های ملایم میسر است.",
                  specs: [
                    { label: "مقاومت بیولوژیک", val: "آنتی‌باکتریال ۱۰۰٪" },
                    {
                      label: "پایداری شیمیایی",
                      val: "خنثی در برابر شوینده‌ها",
                    },
                    { label: "قابلیت ساختاری", val: "روشویی یکپارچه و CNC" },
                  ],
                },
                {
                  num: "03",
                  enTag: "HIGH-TRAFFIC & CLINICAL",
                  title: "کانترهای تجاری، کفپوش‌های پرتردد و فضاهای درمانی",
                  desc: "طراحی‌شده برای مراکز خرید، ایستگاه‌های مترو، بیمارستان‌ها و فرودگاه‌ها. این محصول با مقاومت فشاری و سایشی بالا، ثبات براقیت در درازمدت و فقدان ترکیبات فرار آلی سمی، گزینه‌ای پایدار برای مقیاس‌های سنگین است.",
                  specs: [
                    { label: "مقاومت فشاری", val: "150 - 240 MPa" },
                    { label: "مقاومت سایشی" },
                    { label: "ترکیبات فرار", val: "VOC Free" },
                  ],
                },
              ],
              fields: [
                {
                  name: "num",
                  type: "text",
                  label: "شماره ردیف",
                  required: true,
                },
                {
                  name: "enTag",
                  type: "text",
                  label: "برچسب انگلیسی",
                  required: true,
                },
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
                  label: "توضیح کاربری",
                  localized: true,
                  required: true,
                },
                {
                  name: "specs",
                  type: "array",
                  label: "مشخصات و متادیتا",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      label: "عنوان ویژگی",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "val",
                      type: "text",
                      label: "مقدار شاخص (اختیاری)",
                    },
                  ],
                },
                {
                  name: "gallery",
                  type: "upload",
                  relationTo: "media",
                  hasMany: true,
                  label: "تصاویر گالری بخش",
                  required: false, // رفع ارور اعتبارسنجی دیتابیس
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
