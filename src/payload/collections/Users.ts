import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    description: "مدیریت حساب کاربری ادمین",
  },
  auth: {
    // تنظیمات قفل شدن حساب در صورت ورود ناموفق متوالی
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // ۱۰ دقیقه قفل در صورت ۵ بار اشتباه
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "نام",
    },
  ],
};
