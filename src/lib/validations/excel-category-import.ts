// src/lib/validations/excel-category-import.ts
import { z } from "zod";

export const excelCategoryRowSchema = z.object({
  slug: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toLowerCase(),
    z.string().min(2, "اسلاگ دسته‌بندی الزامی است"),
  ),

  order: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().default(0)),

  // عناوین ۳ زبانه
  title_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان فارسی الزامی است"),
  ),
  title_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان انگلیسی الزامی است"),
  ),
  title_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان عربی الزامی است"),
  ),
});

export type ExcelCategoryRow = z.infer<typeof excelCategoryRowSchema>;
