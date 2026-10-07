// src/payload/collections/Inspirations.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Inspirations: CollectionConfig = {
  slug: "inspirations",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "space_type", "style", "updatedAt"],
    description:
      "گالری ایده‌ها و فضاهای طراحی معمارانه (همراه با هات‌اسپات و پالت هماهنگی متریال)",
  },
  access: {
    read: () => true,
  },
  lockDocuments: false,
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("inspirations");
        } catch (err) {
          console.warn("Revalidate error on Inspirations:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("inspirations");
        } catch (err) {
          console.warn("Revalidate error on Inspirations delete:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          "عنوان شاخص فضا یا پروژه (مثال: کانتر جزیره در آشپزخانه مدرن)",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "تصویر اصلی فضا (برای آشپزخانه نسبت افقی ۱۶:۹ و برای کانتر/روشویی عمودی ۴:۵ پیشنهاد می‌شود)",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "space_type",
          type: "select",
          required: true,
          admin: {
            width: "50%",
            description: "نوع کاربری و موقعیت قرارگیری سنگ در محیط",
          },
          options: [
            {
              label: "آشپزخانه و کانتر جزیره (Kitchen & Island)",
              value: "kitchen",
            },
            {
              label: "سرویس بهداشتی و روشویی (Bathroom & Vanity)",
              value: "bathroom",
            },
            {
              label: "فضای تجاری و لابی (Commercial & Lobby)",
              value: "commercial",
            },
            {
              label: "مبلمان و دکوراتیو (Furniture & Decor)",
              value: "furniture",
            },
          ],
        },
        {
          name: "style",
          type: "select",
          required: true,
          admin: {
            width: "50%",
            description:
              "سبک طراحی که در هاور تصویر به کاربر نمایش داده می‌شود",
          },
          options: [
            { label: "مینیمال (Minimalist)", value: "minimal" },
            { label: "مدرن (Modern)", value: "modern" },
            {
              label: "کلاسیک و نئوکلاسیک (Classic & Neoclassic)",
              value: "classic",
            },
            { label: "صنعتی (Industrial)", value: "industrial" },
          ],
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "توضیح کوتاه درباره ایده طراحی، نورپردازی و ترکیب سنگ با محیط",
      },
    },
    {
      name: "hotspots",
      type: "array",
      labels: {
        singular: "نقطه کلیک (Hotspot)",
        plural: "نقاط کلیک (Hotspots)",
      },
      admin: {
        description:
          "نقاط تعاملی روی عکس (کدام سنگ کجاست؟)؛ با هاور کاربر نام و کد اسلب باز شده و به صفحه محصول لینک می‌شود.",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          admin: {
            description: "اسلب استفاده‌شده در این نقطه از تصویر",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "x_percent",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                width: "50%",
                description:
                  "موقعیت افقی نقطه از چپ تصویر (۰ تا ۱۰۰ درصد - مثلاً ۵۰ یعنی وسط)",
              },
            },
            {
              name: "y_percent",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                width: "50%",
                description:
                  "موقعیت عمودی نقطه از بالای تصویر (۰ تا ۱۰۰ درصد - مثلاً ۷۰ یعنی پایین)",
              },
            },
          ],
        },
        {
          name: "application_label",
          type: "text",
          localized: true,
          admin: {
            description:
              "عنوان بخش کاربرد در پاپ‌آپ (مثال: کانترتاپ اصلی یا دیواره بین‌کابینتی)",
          },
        },
      ],
    },
    {
      name: "pairings",
      type: "array",
      labels: {
        singular: "متریال هماهنگ",
        plural: "پالت هماهنگی متریال",
      },
      admin: {
        description:
          "هارمونی متریال و رنگ؛ مشخص کنید این سنگ با چه چوب، فلز یا رنگی بهترین ترکیب را می‌سازد.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
          admin: {
            description:
              "نام متریال مکمل (مثال: کابینت چوب گردو / یراق‌آلات برنج مات)",
          },
        },
        {
          name: "color_hex",
          type: "text",
          admin: {
            description:
              "کد رنگی هگز برای دایره نمونه رنگ (اختیاری؛ مثال: #5c4033 یا #c5a059)",
          },
        },
      ],
    },
  ],
};
