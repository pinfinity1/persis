import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // ۱. شیت داده‌های اصلی (تک‌محصول داور)
  const sampleData = [
    {
      code: "PQ-101",
      slug: "dover",
      category_slug: "monocolor",
      color_slug: "white",
      title_fa: "داور",
      title_en: "Dover",
      title_ar: "دوفر",
      vein_pattern_slug: "solid",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "الهام‌گرفته از صخره‌های گچی سپید دوور انگلستان؛ سفید یکدست، خالص و بدون تخلخل با بالاترین درخشش نوری مناسب آشپزخانه‌ها و فضاهای مینیمال مدرن.",
      description_en:
        "Pure, seamless solid white quartz surface inspired by the iconic White Cliffs of Dover. Engineered for maximum stain resistance and modern architectural spaces.",
      description_ar:
        "سطح كوارتز نقي وموحد بالكامل مستوحى من منحدرات دوفر البيضاء الشهيرة. مثالي للمساحات المعمارية الحديثة والمطابخ الفاخرة.",
      meta_title_fa:
        "اسلب سنگ کوارتز سفید ساده داور (Dover PQ-101) | پرسیس کوارتز",
      meta_title_en: "Dover Pure White Quartz Slab (PQ-101) | Persis Quartz",
      meta_title_ar: "لوح كوارتز دوفر الأبيض النقي (PQ-101) | برسيس كوارتز",
      meta_description_fa:
        "بررسی مشخصات فنی و سفارش سنگ کوارتز سفید یکدست و بدون رگه داور کد PQ-101. مقاوم در برابر خط و خش و لکه مناسب صفحه کابینت و کانترتاپ.",
      meta_description_en:
        "Explore Dover PQ-101 solid white engineered quartz slab. Non-porous, highly durable surface for modern kitchen islands and vanity tops.",
      meta_description_ar:
        "اكتشف مواصفات لوح الكوارتز الأبيض النقي دوفر PQ-101 غير المسامي والمقاوم للبقع والخدوش لأسطح المطابخ العصرية.",
    },
  ];

  // ۲. شیت راهنمای جامع فارسی
  const guideData = [
    {
      "نام ستون (Header)": "code",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "کد اختصاصی سنگ در کاتالوگ. اگر محصول قبلاً ثبت شده باشد با این کد آپدیت می‌شود.",
      "نمونه مقدار مجاز": "PQ-101 یا PQ-202",
    },
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "شناسه انگلیسی محصول برای آدرس صفحه اینترنتی (فقط حروف کوچک و خط تیره بدون فاصله).",
      "نمونه مقدار مجاز": "dover یا alborz-mist",
    },
    {
      "نام ستون (Header)": "category_slug",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "اسلاگ یکی از دسته‌بندی‌های تعریف‌شده در شیت دسته‌بندی‌ها.",
      "نمونه مقدار مجاز": "monocolor یا veined-effect یا calacatta",
    },
    {
      "نام ستون (Header)": "color_slug",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "طیف رنگی پایه سنگ جهت فیلتر شدن در کاتالوگ سایت.",
      "نمونه مقدار مجاز": "white یا black یا grey یا beige",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "نام مدل سنگ به ۳ زبان فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "داور / Dover / دوفر",
    },
    {
      "نام ستون (Header)": "vein_pattern_slug",
      وضعیت: "اختیاری",
      "توضیح ساده و روان": "نوع بافت رگه‌های سنگ.",
      "نمونه مقدار مجاز":
        "solid (ساده) / cloudy (ابربادی) / subtle-vein (رگه نازک) / dramatic-vein (رگه ضخیم)",
    },
    {
      "نام ستون (Header)": "dimension_slugs",
      وضعیت: "اختیاری",
      "توضیح ساده و روان":
        "ابعاد قابل سفارش اسلب (چند مورد را با کاما انگلیسی جدا کنید).",
      "نمونه مقدار مجاز": "320x75,320x92",
    },
    {
      "نام ستون (Header)": "thicknesses",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "ضخامت‌های استاندارد موجود سنگ (جداشده با کاما).",
      "نمونه مقدار مجاز": "12mm,20mm یا 12mm,20mm,30mm",
    },
    {
      "نام ستون (Header)": "custom_thickness_available",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "آیا امکان سفارش ضخامت دلخواه برای پروژه‌ها وجود دارد؟",
      "نمونه مقدار مجاز": "true (بله) یا false (خیر)",
    },
    {
      "نام ستون (Header)": "finishes",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "نوع پرداخت سطح سنگ (جداشده با کاما).",
      "نمونه مقدار مجاز": "polished (براق) / honed (مات) / textured (بافت‌دار)",
    },
    {
      "نام ستون (Header)": "is_in_stock",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "وضعیت تامین و انبار سنگ.",
      "نمونه مقدار مجاز":
        "in_stock (موجود) / on_demand (سفارشی) / discontinued (توقف تولید)",
    },
    {
      "نام ستون (Header)": "description_fa / description_en / description_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "توضیحات و متن معرفی داستانی و معماری سنگ در صفحه محصول به ۳ زبان.",
      "نمونه مقدار مجاز": "الهام‌گرفته از صخره‌های گچی سپید...",
    },
    {
      "نام ستون (Header)": "meta_title_fa / meta_title_en / meta_title_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "عنوان صفحه محصول در گوگل (سئو) به ۳ زبان.",
      "نمونه مقدار مجاز": "اسلب سنگ کوارتز سفید ساده داور | پرسیس کوارتز",
    },
    {
      "نام ستون (Header)":
        "meta_description_fa / meta_description_en / meta_description_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان": "خلاصه سئو گوگل در نتایج سرچ به ۳ زبان.",
      "نمونه مقدار مجاز": "مشخصات و قیمت اسلب کوارتز سفید داور...",
    },
    {
      "نام ستون (Header)": "تصاویر و عکس‌ها",
      وضعیت: "در پنل ادمین",
      "توضیح ساده و روان":
        "عکس‌ها در فایل اکسل قرار نمی‌گیرند. پس از آپلود اکسل، وارد پنل شده و اسکن سنگ و گالری را آپلود نمایید.",
      "نمونه مقدار مجاز": "تنظیم در داشبورد پیلود",
    },
  ];

  const workbook = XLSX.utils.book_new();

  // افزودن شیت داده اصلی
  const worksheetData = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheetData, "Products Template");

  // افزودن شیت راهنما
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
