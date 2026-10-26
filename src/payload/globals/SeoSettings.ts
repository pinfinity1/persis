// src/payload/globals/SeoSettings.ts
import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

// تابع کمکی برای تزریق پیش‌فرض‌های ۳ زبانه به صورت خودکار
const loc = (fa: string, en: string, ar: string) => {
  return ({ locale }: { locale?: string }) => {
    if (locale === "en") return en;
    if (locale === "ar") return ar;
    return fa;
  };
};

export const SeoSettings: GlobalConfig = {
  slug: "seo-settings",
  label: "Global SEO & Metadata",
  admin: {
    group: "Settings",
    description: "مدیریت جامع متادیتای سئو، عنوان‌ها و توضیحات صفحات ثابت سایت",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("seo-settings");
        } catch (err) {
          console.warn("Revalidate error on SeoSettings:", err);
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "تنظیمات پایه (Fallback)",
          description:
            "در صورت خالی بودن سایر تب‌ها، این مقادیر نمایش داده می‌شوند.",
          fields: [
            {
              name: "defaultOgImage",
              type: "upload",
              relationTo: "media",
              label: "تصویر پیش‌فرض اشتراک‌گذاری (Default OG Image)",
            },
          ],
        },
        {
          label: "صفحه اصلی (Home)",
          fields: [
            {
              name: "homeTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "سطوح مهندسی‌شده سنگ کوارتز",
                "Engineered Quartz Stone Surfaces",
                "أسطح حجر الكوارتز الهندسية",
              ),
            },
            {
              name: "homeDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "تولیدکننده انواع اسلب‌های مهندسی‌شده سنگ کوارتز پرسیس با بالاترین استانداردهای معماری، مقاومت سطحی فوق‌العاده و جذب آب صفر.",
                "Manufacturer of Persis engineered quartz slabs with the highest architectural standards, exceptional surface resistance, and zero water absorption.",
                "الشركة المصنعة لألواح حجر الكوارتز الهندسية من برسيس بأعلى المعايير المعمارية، ومقاومة سطحية استثنائية، وامتصاص صفر للماء.",
              ),
            },
          ],
        },
        {
          label: "کاتالوگ محصولات (Products)",
          fields: [
            {
              name: "productsTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "کاتالوگ و کالکشن جامع اسلب‌های کوارتز",
                "Comprehensive Quartz Slabs Catalog & Collection",
                "كتالوج ومجموعة شاملة لألواح الكوارتز",
              ),
            },
            {
              name: "productsDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "مشاهده، فیلتر و بررسی طیف رنگی، ضخامت‌ها و کدهای سنگ کوارتز مهندسی‌شده مناسب آشپزخانه و فضاهای لوکس.",
                "View, filter, and explore the color range, thicknesses, and codes of engineered quartz stones suitable for kitchens and luxury spaces.",
                "عرض وتصفية واستكشاف نطاق الألوان والسماكات ورموز حجر الكوارتز الهندسي المناسب للمطابخ والمساحات الفاخرة.",
              ),
            },
          ],
        },
        {
          label: "کاربردها (Applications)",
          fields: [
            {
              name: "applicationsTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "کاربردها و راهکارهای طراحی فضا",
                "Applications and Space Design Solutions",
                "التطبيقات وحلول تصميم المساحات",
              ),
            },
            {
              name: "applicationsDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "بررسی فنی استانداردهای استفاده از اسلب‌های پرسیس کوارتز در کانترتاپ، سرویس‌های بهداشتی و پروژه‌های پرتردد.",
                "Technical review of standards for using Persis Quartz slabs in countertops, bathrooms, and high-traffic projects.",
                "مراجعة فنية لمعايير استخدام ألواح برسيس كوارتز في أسطح العمل والحمامات والمشاريع ذات الازدحام الشديد.",
              ),
            },
          ],
        },
        {
          label: "ایده‌ها (Inspirations)",
          fields: [
            {
              name: "inspirationsTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "ایده‌های طراحی و فضاسازی معمارانه",
                "Design Inspirations and Architectural Spaces",
                "إلهامات التصميم والمساحات المعمارية",
              ),
            },
            {
              name: "inspirationsDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "مجموعه کانسپت‌ها و فضاهای اجراشده با اسلب‌های کوارتز مهندسی‌شده در آشپزخانه، جزیره، روشویی و فضاهای لوکس.",
                "A collection of concepts and implemented spaces with engineered quartz slabs in kitchens, islands, vanities, and luxury spaces.",
                "مجموعة من المفاهيم والمساحات المنفذة بألواح الكوارتز الهندسية في المطابخ والجزر والمغاسل والمساحات الفاخرة.",
              ),
            },
          ],
        },
        {
          label: "وبلاگ (Blog)",
          fields: [
            {
              name: "blogTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "وبلاگ و مقالات تخصصی معماری",
                "Blog and Specialized Architectural Articles",
                "مدونة ومقالات معمارية متخصصة",
              ),
            },
            {
              name: "blogDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "تازه‌ترین مقالات معماری، مقایسه تخصصی متریال‌ها، راهنمای انتخاب اسلب‌های کوارتز و استانداردهای طراحی داخلی مدرن.",
                "Latest architectural articles, specialized material comparisons, guides for choosing quartz slabs, and modern interior design standards.",
                "أحدث المقالات المعمارية، ومقارنات المواد المتخصصة، وأدلة لاختيار ألواح الكوارتز، ومعايير التصميم الداخلي الحديث.",
              ),
            },
          ],
        },
        {
          label: "درباره ما (About)",
          fields: [
            {
              name: "aboutTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "پیشگام در نوآوری و مهندسی سنگ",
                "Pioneer in Stone Innovation and Engineering",
                "رائدة في ابتكار وهندسة الحجر",
              ),
            },
            {
              name: "aboutDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "آشنایی با خط تولید پیشرفته، اهداف، استانداردها و روایت خلق هارمونی میان هنر و صنعت در تولید سنگ‌های کوارتز پرسیس.",
                "Learn about our advanced production line, goals, standards, and the story of creating harmony between art and industry in Persis quartz stones.",
                "تعرف على خط الإنتاج المتقدم لدينا، والأهداف، والمعايير، وقصة خلق التناغم بين الفن والصناعة في إنتاج حجر الكوارتز من برسيس.",
              ),
            },
          ],
        },
        {
          label: "مستندات (Catalogs)",
          fields: [
            {
              name: "catalogsTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "کاتالوگ‌ها و مستندات فنی و مهندسی",
                "Catalogs and Technical Documentation",
                "الكتالوجات والوثائق الفنية والهندسية",
              ),
            },
            {
              name: "catalogsDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "دانلود آنلاین کاتالوگ سالانه، مشخصات آزمون‌های فیزیکی و شیمیایی و راهنماهای نصب اسلب‌های کوارتز.",
                "Download the annual catalog, physical and chemical test specifications, and installation guides for quartz slabs online.",
                "قم بتنزيل الكتالوج السنوي ومواصفات الاختبارات الفيزيائية والكيميائية وأدلة تركيب ألواح الكوارتز عبر الإنترنت.",
              ),
            },
          ],
        },
        {
          label: "نگهداری (Care)",
          fields: [
            {
              name: "careTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "دستورالعمل نگهداری و مراقبت تخصصی",
                "Specialized Care and Maintenance Instructions",
                "تعليمات العناية والصيانة المتخصصة",
              ),
            },
            {
              name: "careDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "راهنمای جامع نظافت روزمره، مقابله با لکه‌های سرسخت و الزامات حفظ دوام و درخشش دائمی سطوح کوارتز.",
                "Comprehensive guide for daily cleaning, dealing with stubborn stains, and requirements to maintain the durability and permanent shine of quartz surfaces.",
                "دليل شامل للتنظيف اليومي، والتعامل مع البقع العنيدة، ومتطلبات الحفاظ على المتانة واللمعان الدائم لأسطح الكوارتز.",
              ),
            },
          ],
        },
        {
          label: "عاملیت‌ها (Dealers)",
          fields: [
            {
              name: "dealersTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "شبکه عاملیت‌ها و شوروم‌های رسمی",
                "Official Dealers and Showrooms Network",
                "شبكة الوكلاء وصالات العرض الرسمية",
              ),
            },
            {
              name: "dealersDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "یافتن نزدیک‌ترین نمایندگی مجاز و مراکز رسمی عرضه و نصب اسلب‌های پرسیس کوارتز در سراسر کشور.",
                "Find the nearest authorized dealer and official centers for the supply and installation of Persis Quartz slabs nationwide.",
                "ابحث عن أقرب وكيل معتمد والمراكز الرسمية لتوريد وتركيب ألواح برسيس كوارتز في جميع أنحاء البلاد.",
              ),
            },
          ],
        },
        {
          label: "تماس با ما (Contact)",
          fields: [
            {
              name: "contactTitle",
              type: "text",
              localized: true,
              label: "Meta Title",
              defaultValue: loc(
                "تماس با ما | خدمات مشتریان و پشتیبانی پروژه‌ها",
                "Contact Us | Customer Service & Project Support",
                "اتصل بنا | خدمة العملاء ودعم المشاريع",
              ),
            },
            {
              name: "contactDescription",
              type: "textarea",
              localized: true,
              label: "Meta Description",
              defaultValue: loc(
                "پل‌های ارتباطی کارخانه، دفتر مرکزی و تیم مهندسی پرسیس کوارتز جهت مشاوره تخصصی، ثبت سفارش و استعلام پروژه‌ها.",
                "Communication channels for the factory, head office, and Persis Quartz engineering team for expert consultation, ordering, and project inquiries.",
                "قنوات الاتصال بالمصنع والمكتب الرئيسي وفريق هندسة برسيس كوارتز للحصول على استشارات متخصصة وتسجيل الطلبات واستفسارات المشاريع.",
              ),
            },
          ],
        },
      ],
    },
  ],
};
