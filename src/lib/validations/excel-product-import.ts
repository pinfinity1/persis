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
  category_slug: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toLowerCase(),
    z.string().min(1, "اسلاگ دسته‌بندی الزامی است"),
  ),
  color_slug: z.preprocess(
    (val) =>
      String(val ?? "")
        .trim()
        .toLowerCase(),
    z.string().min(1, "اسلاگ طیف رنگی الزامی است"),
  ),

  title_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام فارسی محصول الزامی است"),
  ),
  title_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام انگلیسی محصول الزامی است"),
  ),
  title_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "نام عربی محصول الزامی است"),
  ),

  vein_pattern_slug: z.preprocess(
    (val) => (val ? String(val).trim().toLowerCase() : undefined),
    z.string().optional(),
  ),

  is_in_stock: z.preprocess(
    (val) => {
      const s = String(val ?? "")
        .trim()
        .toLowerCase();
      if (s === "on_demand" || s === "discontinued") return s;
      return "in_stock";
    },
    z.enum(["in_stock", "on_demand", "discontinued"]).default("in_stock"),
  ),

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

export type ExcelProductRow = z.infer<typeof excelProductRowSchema>;
