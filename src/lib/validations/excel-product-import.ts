import { z } from "zod";

export const excelProductRowSchema = z.object({
  code: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toUpperCase(),
    z.string().min(2, "کد محصول الزامی است"),
  ),
  slug: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toLowerCase(),
    z.string().min(2, "اسلاگ محصول الزامی است"),
  ),
  title_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام فارسی الزامی است"),
  ),
  title_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام انگلیسی الزامی است"),
  ),
  title_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام عربی الزامی است"),
  ),
  description_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().optional(),
  ),
  description_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().optional(),
  ),
  description_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().optional(),
  ),
});

export type ExcelProductRow = z.infer<typeof excelProductRowSchema>;
