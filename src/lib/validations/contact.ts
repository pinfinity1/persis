// src/lib/validations/contact.ts
import { z } from "zod";

export const quickContactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "fullNameError" }) // کلید ترجمه برای Zod
    .max(60),
  country: z.string().min(2, { message: "countryError" }),
  phone: z
    .string()
    .min(7, { message: "phoneError" })
    .max(20)
    .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
      message: "phoneInvalidError",
    }),
  message: z.string().min(5, { message: "messageError" }).max(500),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
