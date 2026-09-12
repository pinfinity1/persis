// src/payload/collections/Products.ts
import { revalidateTag } from "next/cache";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    group: "Products",
    defaultColumns: ["title", "code", "category", "is_in_stock", "updatedAt"],
    components: {
      beforeListTable: [
        "@/components/admin/ExcelProductImportControl#ExcelProductImportControl",
      ],
    },
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Products:", err);
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("products");
        } catch (err) {
          console.warn("Revalidate error on Products delete:", err);
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
        description: "نام مدل سنگ (مثلاً: مه البرز / Alborz Mist)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "اسلاگ سئو برای URL (مثلاً: alborz-mist)",
      },
    },
    {
      name: "code",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "کد اختصاصی سنگ (مثلاً: PQ-202)",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { description: "سری/دسته‌بندی سنگ (تک‌رنگ، رگه‌دار، کالاکاتا)" },
    },
    {
      name: "color_family",
      type: "relationship",
      relationTo: "colors",
      required: true,
      admin: { description: "طیف رنگی اصلی سنگ" },
    },
    {
      name: "vein_pattern",
      type: "relationship",
      relationTo: "vein-patterns",
      admin: {
        description: "الگوی رگه (مثلاً رگه نازک، رگه ضخیم، ابر و بادی)",
      },
    },
    {
      name: "is_in_stock",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "فعال و در حال تولید (Active)", value: "active" },
        { label: "توقف تولید / آرشیو (Discontinued)", value: "discontinued" },
      ],
      admin: {
        description: "وضعیت تولید اسلب در کارخانه",
      },
    },
    {
      name: "is_featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "نمایش این محصول در بخش محصولات منتخب (صفحه اصلی)",
        position: "sidebar", // این گزینه چک‌باکس را در ستون کناری ادمین قرار می‌دهد تا در دسترس‌تر باشد
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: { description: "تصویر اصلی و تمام‌قد اسلب (Full Slab Scan)" },
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description: "گالری اسلایدر تصاویر (بافت نزدیک و اجرا در محیط)",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
          admin: { description: "توضیح تصویر (مثلاً: اجرا در کانتر آشپزخانه)" },
        },
      ],
    },
    {
      name: "thicknesses",
      type: "relationship",
      relationTo: "thicknesses",
      hasMany: true,
      admin: {
        description:
          "انتخاب ضخامت‌های استاندارد خط تولید برای این اسلب از کالکشن ضخامت‌ها",
      },
    },
    {
      name: "custom_thickness_available",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "امکان سفارش تولید با ضخامت خاص سفارشی (پیش‌فرض فعال)",
      },
    },
    {
      name: "finishes",
      type: "relationship",
      relationTo: "finishes",
      hasMany: true,
      admin: {
        description:
          "انتخاب پرداخت‌های سطحی قابل عرضه از بخش Attributes > Finishes",
      },
    },
    {
      name: "dimensions",
      type: "relationship",
      relationTo: "dimensions",
      hasMany: true,
      admin: {
        description: "ابعاد قابل عرضه اسلب (امکان انتخاب ابعاد جدید در آینده)",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "توضیحات معمارانه و سئومحور سنگ" },
    },
    {
      name: "meta_title",
      type: "text",
      localized: true,
      admin: { description: "عنوان متای سئو گوگل" },
    },
    {
      name: "meta_description",
      type: "textarea",
      localized: true,
      admin: { description: "توضیحات متای سئو گوگل" },
    },
  ],
};
