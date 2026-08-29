import { z } from "zod";

export const excelDealerRowSchema = z.object({
  province: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "استان الزامی است"),
  ),
  city_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "شهر فارسی الزامی است"),
  ),
  city_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "شهر انگلیسی الزامی است"),
  ),
  city_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(2, "شهر عربی الزامی است"),
  ),

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

  address_fa: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "آدرس فارسی الزامی است"),
  ),
  address_en: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "آدرس انگلیسی الزامی است"),
  ),
  address_ar: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "آدرس عربی الزامی است"),
  ),

  phone: z.preprocess(
    (val) => String(val ?? "").trim(),
    z.string().min(5, "شماره تماس الزامی است"),
  ),
  order: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }, z.number().default(0)),
});

export type ExcelDealerRow = z.infer<typeof excelDealerRowSchema>;
