// src/payload/collections/Inspirations.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";
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
  UnorderedListFeature,
  OrderedListFeature,
  LinkFeature,
} from "@payloadcms/richtext-lexical";

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
        description: "عنوان شاخص فضا یا ایده",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "تصویر اصلی فضا",
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
            description: "نوع کاربری سنگ در محیط",
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
            description: "سبک طراحی معمارانه فضا",
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
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature({
            enabledCollections: ["products", "posts", "catalogs"],
          }),
        ],
      }),
      admin: {
        description:
          "شرح معمارانه ایده، امکان استفاده از تمام هدینگ‌ها (H1 تا H6) و ابزارهای نگارش متن",
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
        description: "نقاط تعاملی اسلب‌ها بر روی عکس",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          admin: {
            description: "اسلب استفاده‌شده در این نقطه",
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
                description: "موقعیت افقی نقطه از چپ (۰ تا ۱۰۰)",
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
                description: "موقعیت عمودی نقطه از بالا (۰ تا ۱۰۰)",
              },
            },
          ],
        },
        {
          name: "application_label",
          type: "text",
          localized: true,
          admin: {
            description: "عنوان کاربرد سنگ (مثال: رویه جزیره و بین‌کابینتی)",
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
        description: "پالت ترکیب متریال و رنگ مکمل",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: "نام متریال (مثال: صندلی چوب گردو)",
          },
        },
        {
          name: "color_hex",
          type: "text",
          label: "کد رنگی",
          defaultValue: "#c5a059",
          admin: {
            components: {
              Field: "@/components/admin/ColorPickerField#ColorPickerField",
            },
          },
        },
      ],
    },
  ],
};
