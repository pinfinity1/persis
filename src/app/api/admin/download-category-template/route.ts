import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // ۱. شیت داده‌های اصلی
  const sampleData = [
    {
      slug: "monocolor",
      order: 1,
      title_fa: "سری تک‌رنگ و ساده",
      title_en: "Monocolor & Solid Series",
      title_ar: "سلسلة الألوان الأحادية",
      description_fa:
        "سطوح خالص، یکدست و مینیمال بدون رگه؛ بازتاب نور و یکپارچگی در طراحی مدرن.",
      description_en:
        "Pure, seamless solid surfaces designed for pure minimalist elegance.",
      description_ar:
        "أسطح نقية وموحدة بالكامل تعكس بساطة التصميم المعماري الحديث.",
      meta_title_fa: "اسلب کوارتز تک‌رنگ و ساده | پرسیس کوارتز",
      meta_title_en: "Monocolor Quartz Slabs | Persis Quartz",
      meta_title_ar: "ألواح الكوارتز أحادية اللون | برسيس كوارتز",
      meta_description_fa:
        "خرید و بررسی انواع اسلب سنگ کوارتز خالص و تک‌رنگ برای آشپزخانه و فضاهای مدرن.",
      meta_description_en:
        "Browse and select pure solid tone engineered quartz surfaces.",
      meta_description_ar:
        "استكشف أرقى ألواح الكوارتز أحادية اللون الفاخرة لأسطح المطابخ والمشاريع الحديثة.",
    },
    {
      slug: "veined-effect",
      order: 2,
      title_fa: "سری ابر و بادی (بافت‌دار)",
      title_en: "Veined & Cloudy Series",
      title_ar: "سلسلة التموجات السحابية",
      description_fa:
        "همنشینی سایه‌روشن‌های نرم، محو و بافت‌های مه‌آلود؛ الهام‌گرفته از حرکت ابرها و آرامش طبیعت.",
      description_en:
        "Soft misty nuances and subtle blended cloudy textures inspired by serene natural landscapes.",
      description_ar:
        "أنماط ناعمة وتدرجات ضبابية وسحابية مستوحاة من هدوء وجمال الطبيعة.",
      meta_title_fa: "اسلب کوارتز ابر و بادی و بافت‌دار | پرسیس کوارتز",
      meta_title_en: "Cloudy & Soft Veined Quartz Slabs | Persis Quartz",
      meta_title_ar: "ألواح الكوارتز السحابية والناعمة | برسيس كوارتز",
      meta_description_fa:
        "مجموعه سنگ‌های کوارتز مهندسی‌شده با بافت ابر و بادی، لطیف و سایه‌روشن‌های طبیعی.",
      meta_description_en:
        "Explore premium cloudy-effect and soft blended texture engineered quartz surfaces.",
      meta_description_ar:
        "تصفح مجموعة أسطح الكوارتز بتأثيرات سحابية وتموجات ضبابية ناعمة وعصرية.",
    },
    {
      slug: "calacatta",
      order: 3,
      title_fa: "سری رگه‌دار (کالاکاتا)",
      title_en: "Calacatta Veined Series",
      title_ar: "سلسلة التعريقات (كالاكاتا)",
      description_fa:
        "خطوط شاخص، جسورانه و رگه‌های پهن دراماتیک؛ تداعی‌گر وقار و اصالت مرمر طبیعی.",
      description_en:
        "Dramatic, bold, and expressive veining on pure backgrounds capturing the timeless majesty of natural marble.",
      description_ar:
        "خطوط عريضة وجريئة بتعريقات بارزة ومتميزة تجسد فخامة وأصالة الرخام الإيطالي الفاخر.",
      meta_title_fa: "اسلب کوارتز رگه‌دار کالاکاتا | پرسیس کوارتز",
      meta_title_en: "Calacatta Bold Veined Quartz Slabs | Persis Quartz",
      meta_title_ar: "ألواح كوارتز كالاكاتا ذات التعريقات | برسيس كوارتز",
      meta_description_fa:
        "انواع اسلب کوارتز رگه‌دار لوکس طرح کالاکاتا با رگه‌های معمارانه برای جزیره و کانترتاپ.",
      meta_description_en:
        "Premium Calacatta-inspired engineered quartz surfaces with prominent, luxury marble veining.",
      meta_description_ar:
        "تصاميم كالاكاتا الفاخرة بتعريقات ذهبية ورمادية مميزة لأسطح المطابخ والجزر العصرية.",
    },
  ];

  // ۲. شیت راهنمای فارسی
  const guideData = [
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "شناسه انگلیسی دسته‌بندی در آدرس صفحه سایت (فقط حروف کوچک انگلیسی و بدون فاصله).",
      "نمونه مقدار مجاز": "monocolor یا veined-effect یا calacatta",
    },
    {
      "نام ستون (Header)": "order",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "ترتیب و اولویت نمایش در منوی سایت (عدد ۱ اولویت اول، عدد ۲ اولویت دوم و...).",
      "نمونه مقدار مجاز": "1 یا 2 یا 3",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "نام دسته‌بندی به تفکیک زبان‌های فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "سری تک‌رنگ / Monocolor / سلسلة الألوان الأحادية",
    },
    {
      "نام ستون (Header)": "description_fa / description_en / description_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "متن معرفی کانسپت و ویژگی‌های این کالکشن برای نمایش در هدر صفحه دسته‌بندی به ۳ زبان.",
      "نمونه مقدار مجاز": "سطوح خالص و بدون رگه...",
    },
    {
      "نام ستون (Header)": "meta_title_fa / meta_title_en / meta_title_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "عنوان صفحه دسته‌بندی در نتایج جستجوی گوگل (سئو) به ۳ زبان (حداکثر ۶۰ کاراکتر).",
      "نمونه مقدار مجاز": "اسلب کوارتز تک‌رنگ و ساده | پرسیس کوارتز",
    },
    {
      "نام ستون (Header)":
        "meta_description_fa / meta_description_en / meta_description_ar",
      وضعیت: "اجباری",
      "توضیح ساده و روان":
        "خلاصه توضیحات گوگل زیر عنوان در نتایج سرچ (سئو) به ۳ زبان (بین ۱۲۰ تا ۱۶۰ کاراکتر).",
      "نمونه مقدار مجاز": "خرید و بررسی انواع اسلب سنگ کوارتز خالص...",
    },
  ];

  const workbook = XLSX.utils.book_new();

  // افزودن شیت داده اصلی
  const worksheetData = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheetData, "Categories Template");

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
        'attachment; filename="PersisQuartz_Categories_Template.xlsx"',
    },
  });
}
