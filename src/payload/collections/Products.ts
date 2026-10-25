// src/payload/collections/Products.ts
import { revalidateTag } from "next/cache";
import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  HeadingFeature,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  AlignFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  LinkFeature,
} from "@payloadcms/richtext-lexical";

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
      ({ doc, previousDoc }) => {
        try {
          revalidateTag("products");
          revalidateTag("home-page");
          revalidateTag("featured-products");
          revalidateTag("inspirations");

          if (doc?.slug) {
            revalidateTag(`product-${doc.slug}`);
          }

          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
            revalidateTag(`product-${previousDoc.slug}`);
          }
        } catch (err) {
          console.warn("Revalidate error on Products change:", err);
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag("products");
          revalidateTag("home-page");
          revalidateTag("featured-products");
          revalidateTag("inspirations");

          if (doc?.slug) {
            revalidateTag(`product-${doc.slug}`);
          }
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
      required: false,
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
        position: "sidebar",
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
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description:
          "انتخاب یا آپلود همزمان چند تصویر برای گالری اسلایدر (قابلیت درگ اند دراپ گروهی)",
      },
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
      admin: { description: "چکیده کوتاه متنی سنگ" },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          InlineCodeFeature(),
          AlignFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          LinkFeature({
            enabledCollections: ["products", "posts", "catalogs"],
          }),
        ],
      }),
      admin: {
        description:
          "متن کامل با دسترسی به تمام هدینگ‌های H1 تا H6 و استایل‌های نوشتاری",
      },
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
