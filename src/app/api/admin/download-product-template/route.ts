import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const sampleData = [
    {
      code: "1101",
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
        "الهام‌گرفته از صخره‌های گچی سپید داور انگلستان؛ سفید یکدست، خالص و بدون تخلخل با بالاترین درخشش نوری مناسب آشپزخانه‌ها و فضاهای مینیمال مدرن.",
      description_en:
        "Pure, seamless solid white quartz surface inspired by the iconic White Cliffs of Dover. Engineered for maximum stain resistance and modern architectural spaces.",
      description_ar:
        "سطح كوارتز نقي وموحد بالكامل مستوحى من منحدرات دوفر البيضاء الشهيرة. مثالي للمساحات المعمارية الحديثة والمطابخ الفاخرة.",
      meta_title_fa:
        "اسلب سنگ کوارتز سفید ساده داور (Dover 1101) | پرسیس کوارتز",
      meta_title_en: "Dover Pure White Quartz Slab (1101) | Persis Quartz",
      meta_title_ar: "لوح كوارتز دوفر الأبيض النقي (1101) | برسيس كوارتز",
      meta_description_fa:
        "بررسی مشخصات فنی و سفارش سنگ کوارتز سفید یکدست و بدون رگه داور کد 1101. مقاوم در برابر خط و خش و لکه مناسب صفحه کابینت و کانترتاپ.",
      meta_description_en:
        "Explore Dover 1101 solid white engineered quartz slab. Non-porous, highly durable surface for modern kitchen islands and vanity tops.",
      meta_description_ar:
        "اكتشف مواصفات لوح الكوارتز الأبيض النقي دوفر 1101 غير المسامي والمقاوم للبقع والخدوش لأسطح المطابخ العصرية.",
    },
    {
      code: "1606",
      slug: "eclipse",
      category_slug: "monocolor",
      color_slug: "black",
      title_fa: "اکلیپس",
      title_en: "Eclipse",
      title_ar: "إكليبس",
      vein_pattern_slug: "solid",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "مشکی عمیق، مخملی و خالص؛ تجلی تاریکی مطلق خورشیدگرفتگی در معماری مدرن با سطحی کاملاً متراکم و مقاوم در برابر لکه.",
      description_en:
        "Deep, velvety, pure black quartz capturing the stark drama of a total solar eclipse. Non-porous surface engineered for high-traffic luxury interiors.",
      description_ar:
        "أسود نقي وفاخر مستوحى من ظاهرة كسوف الشمس الكلي، يمنح المساحات المعمارية عمقاً وأناقة لا مثيل لها.",
      meta_title_fa:
        "اسلب سنگ کوارتز مشکی ساده اکلیپس (Eclipse 1606) | پرسیس کوارتز",
      meta_title_en: "Eclipse Solid Black Quartz Slab (1606) | Persis Quartz",
      meta_title_ar: "لوح كوارتز إكليبس الأسود النقي (1606) | برسيس كوارتز",
      meta_description_fa:
        "خرید و مشخصات اسلب کوارتز مشکی خالص اکلیپس کد 1606. سطح یکپارچه، ضد خط و خش و لکه مناسب کانترتاپ و جزیره مدرن.",
      meta_description_en:
        "Discover Eclipse 1606 pure solid black quartz slab. Highly durable, non-porous engineered surface for sleek modern spaces.",
      meta_description_ar:
        "تصفح مواصفات لوح الكوارتز الأسود الأحادي إكليبس 1606 المقاوم للبقع والخدوش للمطابخ والجزر العصرية.",
    },
    {
      code: "2106",
      slug: "aland",
      category_slug: "veined-effect",
      color_slug: "white",
      title_fa: "الند",
      title_en: "Aland",
      title_ar: "ألاند",
      vein_pattern_slug: "cloudy",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "الهام‌گرفته از نخستین پرتوهای سیمین بامداد؛ سپید با سایه‌روشن‌های ابر و بادی نرم و مه‌آلود که جلوه‌ای روشن و سیال به فضا می‌بخشد.",
      description_en:
        "Inspired by the first radiant gleam of dawn; soft misty white with gentle cloudy transitions creating a serene, luminous ambiance.",
      description_ar:
        "مستوحى من أول خيوط فجر الصباح؛ أبيض سحابي ناعم بتدرجات ضبابية تضفي إشراقاً وسكينة على المكان.",
      meta_title_fa:
        "اسلب سنگ کوارتز سفید ابر و بادی الند (Aland 2106) | پرسیس کوارتز",
      meta_title_en: "Aland Cloudy White Quartz Slab (2106) | Persis Quartz",
      meta_title_ar: "لوح كوارتز ألاند الأبيض السحابي (2106) | برسيس كوارتز",
      meta_description_fa:
        "مشخصات و قیمت سنگ کوارتز سفید ابروبادی الند کد 2106. بافت مه‌آلود و طبیعی با دوام مهندسی‌شده مناسب کانتر و صفحات روشویی.",
      meta_description_en:
        "Explore Aland 2106 misty white cloudy quartz surfaces. Non-porous, elegant engineered stone for modern residential design.",
      meta_description_ar:
        "اكتشف أسطح كوارتز ألاند 2106 ذات التأثير السحابي الأبيض الناعم المقاومة للبكتيريا والحرارة لأسطح المطابخ.",
    },
    {
      code: "2601",
      slug: "caspian",
      category_slug: "veined-effect",
      color_slug: "black",
      title_fa: "کاسپین",
      title_en: "Caspian",
      title_ar: "كاسبيان",
      vein_pattern_slug: "cloudy",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "مشکی رمزآلود با امواج و هاله‌های ابر و بادی دودی؛ تداعی‌گر خروش شبانه و عمق بی‌پایان کهن‌ترین دریای زمین.",
      description_en:
        "Mysterious deep black infused with subtle smoky cloudy textures, echoing the midnight depths of the Caspian Sea.",
      description_ar:
        "أسود غامض بتدرجات سحابية دخانية هادئة تجسد عمق وأمواج بحر قزوين في هدوء الليل.",
      meta_title_fa:
        "اسلب سنگ کوارتز مشکی ابر و بادی کاسپین (Caspian 2601) | پرسیس کوارتز",
      meta_title_en: "Caspian Cloudy Black Quartz Slab (2601) | Persis Quartz",
      meta_title_ar: "لوح كوارتز كاسبيان الأسود السحابي (2601) | برسيس كوارتز",
      meta_description_fa:
        "خرید اسلب کوارتز مشکی بافت‌دار و ابر و بادی کاسپین کد 2601. بافت مدرن، ضد جذب لکه مناسب دکوراسیون و جزیره لوکس.",
      meta_description_en:
        "Discover Caspian 2601 cloudy black quartz slab. Dense, durable, stain-resistant surface for contemporary statement islands.",
      meta_description_ar:
        "تسوق أسطح كوارتز كاسبيان 2601 بتأثيرات سحابية سوداء فاخرة ومقاومة عالية للصدمات للمشاريع الراقية.",
    },
    {
      code: "3106",
      slug: "arctic",
      category_slug: "calacatta",
      color_slug: "white",
      title_fa: "آرکتیک",
      title_en: "Arctic",
      title_ar: "آركتيك",
      vein_pattern_slug: "subtle-vein",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "سفید یخی و درخشان با رگه‌های نازک و ظریف مشکی؛ تلاقی کنتراست مینیمال و خطوط ظریف کالاکاتا در پهنه‌ای ابدی از نور.",
      description_en:
        "Crisp crystalline white background traced with fine, delicate black veins, redefining modern minimalist Calacatta elegance.",
      description_ar:
        "أبيض بلوري ناصع بتعريقات سوداء دقيقة وناعمة تمنح تصاميم كالاكاتا لمسة عصرية فائقة النقاء.",
      meta_title_fa:
        "اسلب سنگ کوارتز کالاکاتا آرکتیک رگه مشکی (Arctic 3106) | پرسیس کوارتز",
      meta_title_en:
        "Arctic Calacatta Fine Black Vein Quartz (3106) | Persis Quartz",
      meta_title_ar:
        "لوح كوارتز كالاكاتا آركتيك بتعريقات سوداء دقيقة (3106) | برسيس كوارتز",
      meta_description_fa:
        "بررسی و سفارش اسلب کوارتز سفید رگه مشکی آرکتیک کد 3106 طرح کالاکاتا. مقاوم در برابر خط و خش مناسب کانترتاپ معمارانه.",
      meta_description_en:
        "Explore Arctic 3106 white quartz with fine black veins. Premium Calacatta design for sophisticated kitchen countertops.",
      meta_description_ar:
        "اكتشف لوح الكوارتز كالاكاتا آركتيك 3106 بتعريقات سوداء رفيعة لأسطح المطابخ والجزر المعمارية الفاخرة.",
    },
    {
      code: "3108",
      slug: "zarshouran",
      category_slug: "calacatta",
      color_slug: "white",
      title_fa: "زرشوران",
      title_en: "Zarshouran",
      title_ar: "زرشوران",
      vein_pattern_slug: "subtle-vein",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "زمینه سپید شاهانه با رگه‌های مویی و درخشان طلایی؛ الهام‌گرفته از شکوه کهن رگه‌های زرین معادن زرشوران.",
      description_en:
        "Opulent white background enriched with delicate golden veins, capturing the prestige and warmth of precious mineral treasures.",
      description_ar:
        "خلفية بيضاء ملكية مزدانة بتعريقات ذهبية دقيقة وساحرة تجسد فخامة الذهب وبريق كالاكاتا الكلاسيكي.",
      meta_title_fa:
        "اسلب سنگ کوارتز کالاکاتا زرشوران رگه طلایی (Zarshouran 3108) | پرسیس کوارتز",
      meta_title_en:
        "Zarshouran Calacatta Gold Fine Vein Quartz (3108) | Persis Quartz",
      meta_title_ar:
        "لوح كوارتز كالاكاتا زرشوران بتعريقات ذهبية (3108) | برسيس كوارتز",
      meta_description_fa:
        "خرید اسلب کوارتز سفید رگه طلایی زرشوران کد 3108 طرح کالاکاتا. لوکس و نفوذناپذیر مناسب صفحات بین‌کابینتی و کانترتاپ.",
      meta_description_en:
        "Discover Zarshouran 3108 white quartz with subtle gold veins. High-performance Calacatta surface for timeless interiors.",
      meta_description_ar:
        "تصفح أسطح كوارتز كالاكاتا زرشوران 3108 بتعريقات ذهبية دقيقة ومقاومة عالية للبقع للمطابخ الحديثة.",
    },
    {
      code: "3301",
      slug: "hengam",
      category_slug: "calacatta",
      color_slug: "grey",
      title_fa: "هنگام",
      title_en: "Hengam",
      title_ar: "هنغام",
      vein_pattern_slug: "subtle-vein",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "طوسی نقره‌ای و باوقار با رگه‌های نازک و درخشان سپید؛ تداعی‌گر انعکاس تلالو مهتاب بر آب‌های صخره‌ای جزیره هنگام.",
      description_en:
        "Sophisticated silver-grey background interlaced with fine white veins, evoking the moonlit shoreline of Hengam Island.",
      description_ar:
        "رمادي فضي أنيق تتخلله تعريقات بيضاء دقيقة ومضيئة مستوحاة من انعكاس ضوء القمر على شواطئ جزيرة هنگام.",
      meta_title_fa:
        "اسلب سنگ کوارتز طوسی رگه سفید هنگام (Hengam 3301) | پرسیس کوارتز",
      meta_title_en:
        "Hengam Grey Fine White Vein Quartz (3301) | Persis Quartz",
      meta_title_ar:
        "لوح كوارتز هنغام الرمادي بتعريقات بيضاء (3301) | برسيس كوارتز",
      meta_description_fa:
        "مشخصات و قیمت سنگ کوارتز طوسی رگه سفید هنگام کد 3301 طرح کالاکاتا. مقاوم در برابر حرارت و لکه مناسب دکوراسیون و آشپزخانه مدرن.",
      meta_description_en:
        "Explore Hengam 3301 grey engineered quartz with subtle white veining. Durable, architectural surface for islands and vanity tops.",
      meta_description_ar:
        "اكتشف أسطح كوارتز هنغام 3301 الرمادية بتعريقات بيضاء ناعمة وغير مسامية لأسطح المطابخ العصرية.",
    },
    {
      code: "3601",
      slug: "zagros",
      category_slug: "calacatta",
      color_slug: "black",
      title_fa: "زاگرس",
      title_en: "Zagros",
      title_ar: "زاغروس",
      vein_pattern_slug: "subtle-vein",
      dimension_slugs: "320x75,320x92",
      thicknesses: "12mm,20mm,30mm",
      custom_thickness_available: "true",
      finishes: "polished,honed",
      is_in_stock: "in_stock",
      description_fa:
        "مشکی عمیق و پرابهت با خطوط رگه نازک سفید و برفی؛ الهام‌گرفته از شکاف‌های صخره‌ای و ستیغ‌های برفی رشته‌کوه زاگرس.",
      description_en:
        "Majestic deep black matrix crossed by crisp white linear veining, capturing the stark beauty of snow-crested Zagros peaks.",
      description_ar:
        "أسود عميق ومهيب بتعريقات بيضاء دقيقة تشبه قمم جبال زاغروس المكسوة بالثلوج، يمنح المكان فخامة استثنائية.",
      meta_title_fa:
        "اسلب سنگ کوارتز مشکی رگه سفید زاگرس (Zagros 3601) | پرسیس کوارتز",
      meta_title_en:
        "Zagros Black Fine White Vein Quartz (3601) | Persis Quartz",
      meta_title_ar:
        "لوح كوارتز زاغروس الأسود بتعريقات بيضاء (3601) | برسيس كوارتز",
      meta_description_fa:
        "خرید اسلب کوارتز مشکی رگه سفید زاگرس کد 3601 طرح کالاکاتا. کنتراست لوکس، بدون تخلخل و ضد خش مناسب کانترتاپ و جزیره.",
      meta_description_en:
        "Discover Zagros 3601 black quartz with sharp white veins. Premium luxury Calacatta stone for high-end residential interiors.",
      meta_description_ar:
        "تسوق أسطح كوارتز زاغروس 3601 السوداء بتعريقات بيضاء فاخرة ومقاومة للبقع والحرارة للمشاريع المعمارية.",
    },
  ];

  const guideData = [
    {
      "نام ستون (Header)": "code",
      وضعیت: "اجباری",
      توضیح:
        "کد اختصاصی سنگ در کاتالوگ (مانند 1101، 1606، 3106). کلید اصلی برای آپدیت خودکار است.",
      "نمونه مقدار مجاز": "1101 - 2106 - 3108",
    },
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      توضیح:
        "شناسه انگلیسی محصول برای آدرس URL صفحه (فقط حروف کوچک و خط تیره).",
      "نمونه مقدار مجاز": "dover یا eclipse یا aland",
    },
    {
      "نام ستون (Header)": "category_slug",
      وضعیت: "اجباری",
      توضیح:
        "یکی از اسلاگ‌های تعریف شده دسته‌بندی‌ها (monocolor, veined-effect, calacatta).",
      "نمونه مقدار مجاز": "monocolor یا veined-effect یا calacatta",
    },
    {
      "نام ستون (Header)": "color_slug",
      وضعیت: "اجباری",
      توضیح: "طیف رنگی پایه سنگ جهت فیلتر شدن در کاتالوگ سایت.",
      "نمونه مقدار مجاز": "white یا black یا grey",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      توضیح: "نام مدل سنگ به ۳ زبان فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "داور / Dover / دوفر",
    },
    {
      "نام ستون (Header)": "vein_pattern_slug",
      وضعیت: "اختیاری",
      توضیح:
        "نوع بافت رگه‌ها (solid برای ساده، cloudy برای ابروبادی، subtle-vein برای رگه نازک).",
      "نمونه مقدار مجاز": "solid یا cloudy یا subtle-vein",
    },
    {
      "نام ستون (Header)": "dimension_slugs",
      وضعیت: "اختیاری",
      توضیح: "ابعاد اسلب (جداشده با کاما).",
      "نمونه مقدار مجاز": "320x75,320x92",
    },
    {
      "نام ستون (Header)": "thicknesses",
      وضعیت: "اجباری",
      توضیح: "ضخامت‌های استاندارد تولیدی (جداشده با کاما).",
      "نمونه مقدار مجاز": "12mm,20mm,30mm",
    },
    {
      "نام ستون (Header)": "custom_thickness_available",
      وضعیت: "اجباری",
      توضیح: "امکان سفارش تولید با ضخامت دلخواه پروژه.",
      "نمونه مقدار مجاز": "true یا false",
    },
    {
      "نام ستون (Header)": "finishes",
      وضعیت: "اجباری",
      توضیح: "نوع پرداخت سطح سنگ (جداشده با کاما).",
      "نمونه مقدار مجاز": "polished,honed",
    },
    {
      "نام ستون (Header)": "is_in_stock",
      وضعیت: "اجباری",
      توضیح:
        "وضعیت موجودی کالا (in_stock موجود، on_demand سفارشی، discontinued توقف تولید).",
      "نمونه مقدار مجاز": "in_stock",
    },
    {
      "نام ستون (Header)": "description_fa / description_en / description_ar",
      وضعیت: "اجباری",
      توضیح: "متن معرفی و کانسپت سنگ به ۳ زبان.",
      "نمونه مقدار مجاز": "الهام‌گرفته از صخره‌های...",
    },
    {
      "نام ستون (Header)": "meta_title_fa / meta_title_en / meta_title_ar",
      وضعیت: "اجباری",
      توضیح: "عنوان سئو گوگل صفحه به ۳ زبان.",
      "نمونه مقدار مجاز": "اسلب سنگ کوارتز سفید ساده داور | پرسیس کوارتز",
    },
    {
      "نام ستون (Header)":
        "meta_description_fa / meta_description_en / meta_description_ar",
      وضعیت: "اجباری",
      توضیح: "خلاصه توضیحات گوگل زیر عنوان به ۳ زبان.",
      "نمونه مقدار مجاز": "بررسی مشخصات فنی و سفارش سنگ کوارتز...",
    },
    {
      "نام ستون (Header)": "تصاویر و عکس‌ها",
      وضعیت: "در پنل ادمین",
      توضیح:
        "عکس‌ها در فایل اکسل قرار نمی‌گیرند. پس از آپلود، وارد ویرایش هر محصول در پنل پیلود شده و عکس‌ها را آپلود کنید.",
      "نمونه مقدار مجاز": "در داشبورد پیلود",
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
