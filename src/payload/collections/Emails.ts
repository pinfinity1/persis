import type { CollectionConfig } from "payload";

export const Emails: CollectionConfig = {
  slug: "emails",
  labels: {
    singular: "Email Message",
    plural: "Email Messages",
  },
  admin: {
    useAsTitle: "subject",
    group: "Communications",
    defaultColumns: [
      "subject",
      "from",
      "to",
      "mailbox",
      "direction",
      "status",
      "isRead",
      "createdAt",
    ],
    description: "Inbound and outbound corporate email messages and audit log",
  },
  access: {
    create: () => true, // Allowed for webhook and server actions
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "mailbox",
      type: "relationship",
      relationTo: "mailboxes",
      required: true,
      index: true,
      label: "صندوق ایمیل مربوطه",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "direction",
      type: "select",
      required: true,
      index: true,
      defaultValue: "inbound",
      options: [
        { label: "دریافتی (Inbound)", value: "inbound" },
        { label: "ارسالی (Outbound)", value: "outbound" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      index: true,
      defaultValue: "delivered",
      options: [
        { label: "تحویل داده شده / دریافت شد", value: "delivered" },
        { label: "ارسال موفق", value: "sent" },
        { label: "در صف ارسال", value: "pending" },
        { label: "خطا در ارسال", value: "failed" },
        { label: "پیش‌نویس (Draft)", value: "draft" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      defaultValue: "(بدون موضوع)",
      label: "موضوع ایمیل",
    },
    {
      name: "from",
      type: "text",
      required: true,
      index: true,
      label: "آدرس فرستنده (From)",
    },
    {
      name: "fromName",
      type: "text",
      label: "نام فرستنده",
    },
    {
      name: "to",
      type: "text",
      required: true,
      index: true,
      label: "آدرس گیرنده (To)",
    },
    {
      name: "cc",
      type: "text",
      label: "رونوشت (CC)",
    },
    {
      name: "bcc",
      type: "text",
      label: "رونوشت پنهان (BCC)",
    },
    {
      name: "replyTo",
      type: "text",
      label: "پاسخ به (Reply-To)",
    },
    {
      name: "bodyText",
      type: "textarea",
      label: "متن ساده (Plain Text)",
    },
    {
      name: "bodyHtml",
      type: "textarea",
      label: "محتوای HTML ایمیل (Sanitized)",
    },
    {
      name: "attachments",
      type: "relationship",
      relationTo: "email-attachments",
      hasMany: true,
      label: "فایل‌های ضمیمه",
    },
    {
      name: "messageId",
      type: "text",
      index: true,
      label: "شناسه یکتا (Message-ID RFC 5322)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "inReplyTo",
      type: "text",
      index: true,
      label: "در پاسخ به (In-Reply-To)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "threadId",
      type: "text",
      index: true,
      label: "شناسه مکالمه (Thread-ID)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isRead",
      type: "checkbox",
      defaultValue: false,
      index: true,
      label: "خوانده شده",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isStarred",
      type: "checkbox",
      defaultValue: false,
      index: true,
      label: "ستاره‌دار / مهم",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isArchived",
      type: "checkbox",
      defaultValue: false,
      index: true,
      label: "بایگانی شده",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isTrash",
      type: "checkbox",
      defaultValue: false,
      index: true,
      label: "زباله‌دان",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "errorMessage",
      type: "text",
      label: "پیام خطا (در صورت عدم ارسال)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sentAt",
      type: "date",
      index: true,
      label: "زمان ارسال / دریافت",
      admin: {
        position: "sidebar",
      },
    },
  ],
};
