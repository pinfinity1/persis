import type { CollectionConfig } from "payload";

export const EmailAttachments: CollectionConfig = {
  slug: "email-attachments",
  lockDocuments: false,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Allows webhook to create attachments
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  labels: {
    singular: "Email Attachment",
    plural: "Email Attachments",
  },
  admin: {
    useAsTitle: "filename",
    group: "Communications",
    defaultColumns: ["filename", "mimeType", "filesize", "createdAt"],
    description: "Inbound and outbound email attachments stored in S3 object storage",
  },
  upload: {
    crop: false,
    focalPoint: false,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "text/csv",
    ],
  },
  fields: [
    {
      name: "originalName",
      type: "text",
      label: "نام اصلی فایل",
    },
    {
      name: "contentId",
      type: "text",
      label: "Content-ID (برای تصاویر درون خطی)",
      admin: {
        description: "جهت مپ کردن تصاویر inline ایمیل با تگ cid",
      },
    },
  ],
};
