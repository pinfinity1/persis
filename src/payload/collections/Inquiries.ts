import type { CollectionConfig } from "payload";

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  admin: {
    useAsTitle: "fullName",
    group: "Leads & Requests",
    defaultColumns: [
      "fullName",
      "type",
      "email",
      "phone",
      "status",
      "createdAt",
    ],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "تماس عمومی و پشتیبانی", value: "general" },
        { label: "درخواست سمپل باکس", value: "sample" },
        { label: "استعلام پروژه و متریال", value: "project" },
        { label: "اخذ عاملیت و نمایندگی", value: "dealer" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      required: true,
      options: [
        { label: "جدید / بررسی نشده", value: "new" },
        { label: "در حال بررسی", value: "in_progress" },
        { label: "پاسخ داده شده / تکمیل", value: "resolved" },
        { label: "بایگانی شده", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },

    // اطلاعات هویتی و تماس پایه (همیشه نمایش داده می‌شوند)
    {
      type: "row",
      fields: [
        {
          name: "fullName",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "email",
          type: "text",
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "phone",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "country",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },

    // موقعیت و هویت تجاری (شهر، شرکت و کد پستی)
    {
      type: "row",
      admin: {
        condition: (data) =>
          data?.type === "sample" ||
          data?.type === "dealer" ||
          data?.type === "project",
      },
      fields: [
        {
          name: "company",
          type: "text",
          label: "نام مجموعه / شرکت / دفتر",
          admin: { width: "50%" },
        },
        {
          name: "city",
          type: "text",
          label: "شهر / استان",
          admin: {
            width: "50%",
            condition: (data) =>
              data?.type === "sample" || data?.type === "dealer",
          },
        },
      ],
    },

    // فیلدهای پستی سمپل باکس
    {
      type: "row",
      admin: {
        condition: (data) => data?.type === "sample",
      },
      fields: [
        {
          name: "postalCode",
          type: "text",
          label: "کد پستی (۱۰ رقمی)",
          admin: { width: "100%" },
        },
      ],
    },
    {
      name: "address",
      type: "textarea",
      label: "آدرس پستی دقیق",
      admin: {
        condition: (data) => data?.type === "sample",
      },
    },

    // فیلدهای متراژ، کدهای درخواستی و مشخصات فنی پروژه
    {
      type: "row",
      admin: {
        condition: (data) =>
          data?.type === "sample" || data?.type === "project",
      },
      fields: [
        {
          name: "productCodes",
          type: "text",
          label: "کدهای سنگ درخواستی",
          admin: { width: "50%" },
        },
        {
          name: "projectSize",
          type: "text",
          label: "متراژ حدودی پروژه (متر مربع)",
          admin: {
            width: "50%",
            condition: (data) => data?.type === "project",
          },
        },
      ],
    },
    {
      type: "row",
      admin: {
        condition: (data) => data?.type === "project",
      },
      fields: [
        {
          name: "thickness",
          type: "text",
          label: "ضخامت",
          admin: { width: "50%" },
        },
        {
          name: "finish",
          type: "text",
          label: "فینیش / پرداخت",
          admin: { width: "50%" },
        },
      ],
    },

    // متن پیام نهایی
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
};
