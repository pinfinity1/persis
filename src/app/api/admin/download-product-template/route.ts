// src/app/api/admin/download-product-template/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const sampleData = [
    {
      code: "1101",
      slug: "dover",
      title_fa: "داور",
      title_en: "Dover",
      title_ar: "دوفر",
      description_fa:
        "الهام‌گرفته از صخره‌های گچی سپید داور انگلستان؛ سفید یکدست، خالص و بدون تخلخل با بالاترین درخشش نوری مناسب آشپزخانه‌ها و فضاهای مینیمال مدرن.",
      description_en:
        "Pure, seamless solid white quartz surface inspired by the iconic White Cliffs of Dover. Engineered for maximum stain resistance and modern architectural spaces.",
      description_ar:
        "سطح كوارتز نقي وموحد بالكامل مستوحى من منحدرات دوفر البيضاء الشهيرة. مثالي للمساحات المعمارية الحديثة والمطابخ الفاخرة.",
    },
    {
      code: "2106",
      slug: "aland",
      title_fa: "الند",
      title_en: "Aland",
      title_ar: "ألاند",
      description_fa:
        "الهام‌گرفته از نخستین پرتوهای سیمین بامداد؛ سپید با سایه‌روشن‌های ابر و بادی نرم و مه‌آلود که جلوه‌ای روشن و سیال به فضا می‌بخشد.",
      description_en:
        "Inspired by the first radiant gleam of dawn; soft misty white with gentle cloudy transitions creating a serene, luminous ambiance.",
      description_ar:
        "مستوحى من أول خيوط فجر الصباح؛ أبيض سحابي ناعم بتدرجات ضبابية تضفي إشراقاً وسكينة على المكان.",
    },
    {
      code: "3106",
      slug: "arctic",
      title_fa: "آرکتیک",
      title_en: "Arctic",
      title_ar: "آركتيك",
      description_fa:
        "سفید یخی و درخشان با رگه‌های نازک و ظریف مشکی؛ تلاقی کنتراست مینیمال و خطوط ظریف کالاکاتا در پهنه‌ای ابدی از نور.",
      description_en:
        "Crisp crystalline white background traced with fine, delicate black veins, redefining modern minimalist Calacatta elegance.",
      description_ar:
        "أبيض بلوري ناصع بتعريقات سوداء دقيقة وناعمة تمنح تصاميم كالاكاتا لمسة عصرية فائقة النقاء.",
    },
  ];

  const guideData = [
    {
      "نام ستون (Header)": "code",
      وضعیت: "اجباری",
      توضیح:
        "کد اختصاصی سنگ در کارخانه (مانند 1101 یا 2106). کلید اصلی یکتا برای درج یا به‌روزرسانی هوشمند است.",
      "نمونه مقدار مجاز": "1101 یا 2106",
    },
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      توضیح:
        "شناسه انگلیسی سنگ در آدرس وب‌سایت (تنها حروف کوچک انگلیسی و بدون فاصله).",
      "نمونه مقدار مجاز": "dover یا aland",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      توضیح: "نام تجاری طرح به تفکیک زبان‌های فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "الند / Aland / ألاند",
    },
    {
      "نام ستون (Header)": "description_fa / description_en / description_ar",
      وضعیت: "اختیاری",
      توضیح: "متن کانسپت، روایت بصری و ویژگی‌های معماری سنگ به ۳ زبان.",
      "نمونه مقدار مجاز": "الهام‌گرفته از صخره‌های...",
    },
    {
      "نام ستون (Header)": "دسته‌بندی، رنگ و الگو",
      وضعیت: "در پنل ادمین",
      توضیح:
        "پس از بارگذاری اکسل، وارد ویرایش هر محصول شده و دسته‌بندی، طیف رنگ و الگوی رگه را از منوی کشویی متصل انتخاب فرمایید.",
      "نمونه مقدار مجاز": "داشبورد ادمین",
    },
    {
      "نام ستون (Header)": "ابعاد، ضخامت و فینیش",
      وضعیت: "استاندارد کارخانه",
      توضیح:
        "ابعاد و ضخامت‌های تولیدی به صورت خودکار با استانداردهای خط تولید مقداردهی می‌شوند و نیازی به ورود در اکسل ندارند.",
      "نمونه مقدار مجاز": "-",
    },
  ];

  const workbook = XLSX.utils.book_new();

  const worksheetData = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheetData, "Products Template");

  const worksheetGuide = XLSX.utils.json_to_sheet(guideData);
  XLSX.utils.book_append_sheet(
    workbook,
    worksheetGuide,
    "راهنمای تکمیل (Guide)",
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="PersisQuartz_Products_Template.xlsx"',
    },
  });
}
