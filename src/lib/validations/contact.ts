import { z } from "zod";
import xss from "xss";

// Transformer declarations ensuring total sanitization against Stored XSS
const sanitizedString = (min: number, max: number, errorKey: string) =>
  z
    .string()
    .trim()
    .min(min, errorKey)
    .max(max, errorKey)
    .transform((val) =>
      xss(val, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script", "style", "iframe"],
      }).trim(),
    );

const optionalSanitizedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((val) => {
      if (!val) return "";
      return xss(val, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script", "style", "iframe"],
      }).trim();
    });

const baseContactSchema = z.object({
  fullName: sanitizedString(2, 80, "fullNameError"),
  email: z.string().trim().email("emailInvalid").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20, "phoneMax")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "phoneInvalidError"),
  country: sanitizedString(2, 60, "countryError"),
  message: sanitizedString(5, 1500, "messageError"),
});

export const contactFormSchema = z.discriminatedUnion("type", [
  baseContactSchema.extend({
    type: z.literal("general"),
  }),
  baseContactSchema.extend({
    type: z.literal("sample"),
    city: sanitizedString(2, 60, "cityError"),
    postalCode: z.string().trim().min(5, "postalCodeError").max(20),
    address: sanitizedString(10, 300, "addressError"),
    company: optionalSanitizedString(100),
    productCodes: optionalSanitizedString(100),
  }),
  baseContactSchema.extend({
    type: z.literal("project"),
    company: sanitizedString(2, 100, "companyError"),
    projectSize: optionalSanitizedString(50),
    productCodes: optionalSanitizedString(100),
    thickness: optionalSanitizedString(50),
    finish: optionalSanitizedString(50),
  }),
  baseContactSchema.extend({
    type: z.literal("dealer"),
    company: sanitizedString(2, 100, "companyError"),
    city: sanitizedString(2, 60, "cityError"),
  }),
]);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Quick inquiry schema for homepage interactive form
export const quickContactSchema = z.object({
  fullName: sanitizedString(2, 60, "fullNameError"),
  country: sanitizedString(2, 60, "countryError"),
  phone: z
    .string()
    .trim()
    .min(7, "phoneError")
    .max(20, "phoneMax")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "phoneInvalidError"),
  message: sanitizedString(5, 500, "messageError"),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
