// src/lib/catalog-lookbook-data.ts
import type { CatalogItem } from "@/services/catalog.service";

export interface LookbookHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  productSlug?: string;
  productCode?: string;
  finish?: string;
}

export interface LookbookSpread {
  id: string;
  spreadNumber: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  dimensions: string;
  thickness: string;
  textureCode: string;
  coverImage: string;
  macroImage?: string;
  hotspots?: LookbookHotspot[];
}

export interface CuratedChapter {
  id: string;
  titleFa: string;
  titleEn: string;
  titleAr: string;
  spreadIndex: number;
}

/**
 * کالکشن صفحات ژورنال اختصاصی معماری پرسیس کوارتز
 * الهام‌گرفته از استانداردهای ژورنال‌های سنگ Breton و Caesarstone
 */
export const PERSIS_MASTER_SPREADS: LookbookSpread[] = [
  {
    id: "spread-01",
    spreadNumber: 1,
    title: "Persis Quartz • Master Collection 2026",
    subtitle: "فناوری پیشرفته Breton ایتالیا و استاندارد جهانی سطوح کوارتز",
    category: "Master Edition",
    description:
      "تولیدشده با خلوص ۹۳٪ کریستال‌های طبیعی سیلیس و رزین‌های پلیمری زیست‌سازگار تحت فشار خلأ و ویبروکامپکشن انحصاری برتون ایتالیا. سطوحی کاملاً متراکم، فاقد هرگونه خلل و فرج و با مقاومت استثنایی در برابر لکه و ضربه.",
    dimensions: "۳۲۰ × ۱۶۰ سانتی‌متر (Mega Slab)",
    thickness: "۲۰ و ۳۰ میلی‌متر",
    textureCode: "PQ-TECH-BRETON",
    coverImage: "/PersisQuartz-Red.png",
    hotspots: [
      {
        id: "spot-breton-01",
        xPercent: 50,
        yPercent: 50,
        label: "اسلب مگاسایز پرسیس کوارتز با فینیش پولیش آینه‌ای",
        productSlug: "calacatta",
        productCode: "PQ-MASTER",
        finish: "Polished Super High Gloss",
      },
    ],
  },
  {
    id: "spread-02",
    spreadNumber: 2,
    title: "The Calacatta & Dramatic Veins",
    subtitle: "شکوه و پیوستگی رگه‌های در عمق، الهام‌گرفته از مرمرهای اصیل کارارا",
    category: "Veined & Marble Series",
    description:
      "تکنولوژی پیشرفته تزریق رگه‌های ممتد (Through-body Veining) امکان قرینه‌سازی بوک‌مچ (Bookmatched) را در جزایر عظیم آشپزخانه و وال‌پنل‌های پیوسته لابی بدون انقطاع بصری فراهم می‌سازد.",
    dimensions: "۳۲۰ × ۱۶۰ سانتی‌متر",
    thickness: "۲۰ و ۳۰ میلی‌متر",
    textureCode: "PQ-CALACATTA-SUPREMO",
    coverImage: "/PersisQuartz-Red.png",
    hotspots: [
      {
        id: "spot-calacatta-island",
        xPercent: 62,
        yPercent: 48,
        label: "صفحه جزیره کوارتز کلکته با رگه‌های متصل و فارسی‌بر",
        productSlug: "calacatta",
        productCode: "PQ-104",
        finish: "Polished 20mm",
      },
    ],
  },
  {
    id: "spread-03",
    spreadNumber: 3,
    title: "Monolithic Noir & Deep Charcoal",
    subtitle: "کنتراست دراماتیک، درخشش ماندگار و تیرگی ژرف برای فضاهای معمارانه مدرن",
    category: "Noir & Dark Series",
    description:
      "طیف سنگ‌های تیره پرسیس کوارتز با بالاترین مقاومت در برابر خط و خش و عدم تغییر رنگ در اثر تماس با اسیدهای خوراکی و پاک‌کننده‌های متداول، انتخابی بی‌رقیب برای صفحات تاپ و کانترهای تجاری است.",
    dimensions: "۳۲۰ × ۱۶۰ سانتی‌متر",
    thickness: "۲۰ میلی‌متر",
    textureCode: "PQ-MARQUINA-NOIR",
    coverImage: "/PersisQuartz-Red.png",
    hotspots: [
      {
        id: "spot-noir-counter",
        xPercent: 40,
        yPercent: 58,
        label: "رویه کابینت مارکینا نوآر با سطح مخملی نانو",
        productSlug: "marquina",
        productCode: "PQ-208",
        finish: "Velvet Matte",
      },
    ],
  },
  {
    id: "spread-04",
    spreadNumber: 4,
    title: "Urban Concrete & Matte Textures",
    subtitle: "توازن مینیمالیسم معاصر با بافت‌های بتنی نرم و پالوده",
    category: "Industrial & Concrete",
    description:
      "سطوحی با حس لامسه طبیعی و فاقد انعکاس زننده نور که در هماهنگی کامل با بتن اکسپوز، چوب طبیعی و فلزات مشکی در پروژه‌های مدرن معماری داخلی عمل می‌کنند.",
    dimensions: "۳۲۰ × ۱۶۰ سانتی‌متر",
    thickness: "۲۰ و ۳۰ میلی‌متر",
    textureCode: "PQ-BETON-GREY",
    coverImage: "/PersisQuartz-Red.png",
    hotspots: [
      {
        id: "spot-concrete-wall",
        xPercent: 55,
        yPercent: 42,
        label: "وال‌پنل بتن طوسی با بافت سافت‌مات",
        productSlug: "beton",
        productCode: "PQ-302",
        finish: "Honed Industrial",
      },
    ],
  },
  {
    id: "spread-05",
    spreadNumber: 5,
    title: "Technical Engineering & Edge Profiles",
    subtitle: "راهنمای ابزار لبه‌ها، جزئیات فارسی‌بر و استاندارد اتصالات سینک و گاز",
    category: "Technical Manual",
    description:
      "مشخصات فنی برش، خم و فارسی‌بر کردن (Mitered Edge) اسلب‌های پرسیس کوارتز، پروفیل‌های لبه استاندارد (Bullnose, Beveled, DuPont) و دیتیل‌های اجرای سینک‌های زیرکورین و بدون لبه.",
    dimensions: "ابعاد استاندارد ۳۲۰ × ۱۶۰ cm",
    thickness: "قابلیت ساخت تاپ‌های ۴۰ تا ۱۰۰ mm با فارسی‌بر",
    textureCode: "PQ-FABRICATION-SPEC",
    coverImage: "/PersisQuartz-Red.png",
    hotspots: [
      {
        id: "spot-miter-edge",
        xPercent: 48,
        yPercent: 65,
        label: "دیتیل اجرای لبه فارسی‌بر ۴۵ درجه بدون درز",
        productSlug: "spec",
        productCode: "PQ-EDGE-45",
        finish: "Seamless Miter",
      },
    ],
  },
];

export const CURATED_CHAPTERS: CuratedChapter[] = [
  {
    id: "ch-01",
    titleFa: "فناوری Breton",
    titleEn: "Breton Tech",
    titleAr: "تقنية بريتون",
    spreadIndex: 0,
  },
  {
    id: "ch-02",
    titleFa: "کالکشن کلکته",
    titleEn: "Calacatta Series",
    titleAr: "مجموعة كلكتا",
    spreadIndex: 1,
  },
  {
    id: "ch-03",
    titleFa: "کالکشن نوآر تیره",
    titleEn: "Noir & Dark",
    titleAr: "مجموعة نوار الداكنة",
    spreadIndex: 2,
  },
  {
    id: "ch-04",
    titleFa: "بافت‌های بتنی و صنعتی",
    titleEn: "Concrete & Matte",
    titleAr: "الأسطح الإسمنتية",
    spreadIndex: 3,
  },
  {
    id: "ch-05",
    titleFa: "دیتیل‌های مهندسی لبه‌ها",
    titleEn: "Edge Profiles & Specs",
    titleAr: "المواصفات الفنية والحواف",
    spreadIndex: 4,
  },
];

export function getSafeMediaUrl(
  media?: { url?: string | null } | string | null,
): string {
  if (!media) return "";
  const raw = typeof media === "object" ? media.url : media;
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return "";
}

export function buildFallbackCatalogItem(locale: string): CatalogItem {
  const isEn = locale === "en";
  const isAr = locale === "ar";

  return {
    id: "master-2026-flagship",
    title: isEn
      ? "Persis Quartz • Master Collection & Specifications 2026"
      : isAr
        ? "كتالوج ومواصفات پرسيس كوارتز الشاملة ۲۰۲۶"
        : "کاتالوگ جامع محصولات و مشخصات مهندسی پرسیس کوارتز ۲۰۲۶",
    slug: "persis-quartz-master-collection-2026",
    year: 2026,
    catalog_type: "full_catalog",
    description: isEn
      ? "Comprehensive architectural lookbook featuring mega slabs (320 × 160 cm), through-body veined collections, fabrication edge profiles, and international Bretonstone certifications."
      : isAr
        ? "دليل معماري شامل يضم الألواح الضخمة (۳۲۰ × ۱۶۰ سم)، ومجموعات العروق الممتدة، وتفاصيل الحواف الهندسية، وشهادات بريتون الإيطالية."
        : "ژورنال تخصصی و کاتالوگ جامع شامل اسلب‌های مگاسایز ۳۲۰ × ۱۶۰ سانتی‌متر، کالکشن‌های رگه‌دار در عمق، دیتیل‌های فارسی‌بر لبه‌ها و استاندارد انحصاری برتون ایتالیا.",
    cover_image: "/PersisQuartz-Red.png",
    pdf_file: "/sample-catalog.pdf",
    file_size_mb: 48,
    page_count: 56,
    status: "published",
  };
}
