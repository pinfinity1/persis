// src/lib/validations/contact.ts
import { z } from "zod";

export const quickContactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "نام و نام خانوادگی باید حداقل ۲ حرف باشد." }),
  phone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "لطفاً یک شماره موبایل معتبر (مثال: 09123456789) وارد کنید.",
    }),
  message: z.string().min(10, { message: "متن پیام باید حداقل ۱۰ حرف باشد." }),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
