import { z } from "zod";

// ۱. فیلدهایی که در تمام فرم‌ها مشترک هستند
const baseContactSchema = z.object({
  fullName: z.string().trim().min(2, "fullNameError").max(80, "fullNameMax"),
  email: z.string().trim().email("emailInvalid").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20, "phoneMax")
    .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "phoneInvalidError"),
  country: z.string().trim().min(2, "countryError"),
  message: z.string().trim().min(5, "messageError").max(1500, "messageMax"),
});

// ۲. ساختار شرطی و چندریختی (Discriminated Union)
export const contactFormSchema = z.discriminatedUnion("type", [
  // الف: تماس عمومی (فقط فیلدهای پایه)
  baseContactSchema.extend({
    type: z.literal("general"),
  }),

  // ب: سمپل باکس (نیاز به شهر، کد پستی دقیق و آدرس)
  baseContactSchema.extend({
    type: z.literal("sample"),
    city: z.string().trim().min(2, "cityError"),
    postalCode: z.string().trim().min(5, "postalCodeError").max(20),
    address: z.string().trim().min(10, "addressError"),
    company: z.string().trim().optional(),
    productCodes: z.string().trim().optional(), // کدهای سنگ درخواستی
  }),

  // ج: پروژه‌های معماری (نیاز به نام شرکت و اطلاعات فنی)
  baseContactSchema.extend({
    type: z.literal("project"),
    company: z.string().trim().min(2, "companyError"),
    projectSize: z.string().trim().optional(),
    productCodes: z.string().trim().optional(),
    thickness: z.string().trim().optional(),
    finish: z.string().trim().optional(),
  }),

  // د: اخذ نمایندگی (فقط شهر و نام شرکت - بدون نیاز به کد سنگ یا کدپستی)
  baseContactSchema.extend({
    type: z.literal("dealer"),
    company: z.string().trim().min(2, "companyError"),
    city: z.string().trim().min(2, "cityError"),
  }),
]);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ... (کد quickContactSchema را دست نخورده در انتهای فایل نگه دارید)
export const quickContactSchema = z.object({
  fullName: z.string().trim().min(2, "fullNameError").max(60),
  country: z.string().trim().min(2, "countryError"),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20)
    .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "phoneInvalidError"),
  message: z.string().trim().min(5, "messageError").max(500),
});
export type QuickContactValues = z.infer<typeof quickContactSchema>;
