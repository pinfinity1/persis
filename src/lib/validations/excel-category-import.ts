import { z } from "zod";

export const excelCategoryRowSchema = z.object({
  slug: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toLowerCase(),
    z.string().min(2, "اسلاگ دسته‌بندی الزامی است"),
  ),

  order: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number({ required_error: "ترتیب اولویت الزامی است" }),
  ),

  // عناوین ۳ زبانه
  title_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان فارسی دسته‌بندی الزامی است"),
  ),
  title_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان انگلیسی دسته‌بندی الزامی است"),
  ),
  title_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "عنوان عربی دسته‌بندی الزامی است"),
  ),

  // توضیحات ۳ زبانه
  description_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات فارسی الزامی است"),
  ),
  description_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات انگلیسی الزامی است"),
  ),
  description_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات عربی الزامی است"),
  ),

  // عنوان سئو ۳ زبانه (Meta Title)
  meta_title_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "عنوان سئو فارسی الزامی است"),
  ),
  meta_title_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "عنوان سئو انگلیسی الزامی است"),
  ),
  meta_title_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "عنوان سئو عربی الزامی است"),
  ),

  // توضیحات سئو ۳ زبانه (Meta Description)
  meta_description_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات سئو فارسی الزامی است"),
  ),
  meta_description_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات سئو انگلیسی الزامی است"),
  ),
  meta_description_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(10, "توضیحات سئو عربی الزامی است"),
  ),
});

export type ExcelCategoryRow = z.infer<typeof excelCategoryRowSchema>;
