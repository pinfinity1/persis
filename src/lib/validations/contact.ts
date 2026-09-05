import { z } from "zod";

const baseContactSchema = z.object({
  fullName: z.string().trim().min(2, "fullNameError").max(80, "fullNameMax"),
  email: z.string().trim().email("emailInvalid").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20, "phoneMax")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "phoneInvalidError"),
  country: z.string().trim().min(2, "countryError"),
  message: z.string().trim().min(5, "messageError").max(1500, "messageMax"),
});

export const contactFormSchema = z.discriminatedUnion("type", [
  baseContactSchema.extend({
    type: z.literal("general"),
  }),
  baseContactSchema.extend({
    type: z.literal("sample"),
    city: z.string().trim().min(2, "cityError"),
    postalCode: z.string().trim().min(5, "postalCodeError").max(20),
    address: z.string().trim().min(10, "addressError"),
    company: z.string().trim().optional(),
    productCodes: z.string().trim().optional(),
  }),
  baseContactSchema.extend({
    type: z.literal("project"),
    company: z.string().trim().min(2, "companyError"),
    projectSize: z.string().trim().optional(),
    productCodes: z.string().trim().optional(),
    thickness: z.string().trim().optional(),
    finish: z.string().trim().optional(),
  }),
  baseContactSchema.extend({
    type: z.literal("dealer"),
    company: z.string().trim().min(2, "companyError"),
    city: z.string().trim().min(2, "cityError"),
  }),
]);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const quickContactSchema = z.object({
  fullName: z.string().trim().min(2, "fullNameError").max(60),
  country: z.string().trim().min(2, "countryError"),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20)
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "phoneInvalidError"),
  message: z.string().trim().min(5, "messageError").max(500),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
