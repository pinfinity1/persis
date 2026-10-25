// src/payload/collections/Posts.ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";
import {
  lexicalEditor,
  HeadingFeature,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  UploadFeature,
  InlineToolbarFeature,
} from "@payloadcms/richtext-lexical";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "publishedAt", "updatedAt"],
    group: "Content",
    description:
      "مدیریت مقالات تخصصی معماری، مقایسه متریال‌ها و یادداشت‌های فنی",
  },
  access: {
    read: () => true,
  },
  lockDocuments: false,
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        try {
          revalidateTag("posts");
          if (doc?.slug) revalidateTag(`post-${doc.slug}`);
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
            revalidateTag(`post-${previousDoc.slug}`);
          }
        } catch (err) {
          console.warn("Revalidate error on Posts change:", err);
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidateTag("posts");
          if (doc?.slug) revalidateTag(`post-${doc.slug}`);
        } catch (err) {
          console.warn("Revalidate error on Posts delete:", err);
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
        description: "عنوان کامل مقاله",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "شناسه انگلیسی یکتا برای آدرس URL",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: {
        description: "تصویر شاخص بالای مقاله و کارت وبلاگ",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description: "چکیده کوتاه (۱ الی ۲ خط) جهت سئو و کارت‌ها",
      },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          InlineToolbarFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "caption",
                    type: "text",
                    label: "توضیح زیر تصویر (کپشن)",
                  },
                ],
              },
            },
          }),
          LinkFeature({
            enabledCollections: ["products", "posts", "catalogs"],
          }),
        ],
      }),
      admin: {
        description:
          "متن کامل مقاله با امکان درج هدینگ‌های H2/H3، لیست‌های عددی و بالت، نقل‌قول و تصاویر بین‌متنی",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "Published (منتشر شده)", value: "published" },
        { label: "Draft (پیش‌نویس)", value: "draft" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
      defaultValue: () => new Date(),
    },
  ],
};
