// src/lib/seo.ts
import type { Metadata } from "next";

export type Locale = "fa" | "en" | "ar";

interface GenerateSeoOptions {
  title: string;
  description?: string;
  locale: Locale;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

const BRAND_NAME = "Persis Quartz";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com"
).replace(/\/$/, "");
const DEFAULT_OG_IMAGE = "/PersisQuartz-Red.png";

// ۱. تولیدکننده متادیتای سئو و OpenGraph برای کلیه صفحات با جلوگیری از تکرار نام برند
export function generateSeoMetadata({
  title,
  description,
  locale,
  image,
  path = "",
  noIndex = false,
}: GenerateSeoOptions): Metadata {
  const cleanTitle = title.trim();

  // حذف هرگونه تکرار قبلی نام برند از انتهای عنوان ورودی (مانند ترجمه‌های fa.json)
  const brandRegex = new RegExp(`(\\s*[-|–—:]\\s*)?${BRAND_NAME}\\s*$`, "i");
  const baseTitle = cleanTitle.replace(brandRegex, "").trim();
  const fullTitle = baseTitle ? `${baseTitle} | ${BRAND_NAME}` : BRAND_NAME;

  const defaultDescriptions: Record<Locale, string> = {
    fa: "تولیدکننده انواع اسلب‌های مهندسی‌شده سنگ کوارتز Persis Quartz با بالاترین استانداردهای معماری، جذب آب صفر و مقاومت سطحی فوق‌العاده.",
    en: "Persis Quartz; Manufacturer of premium engineered quartz surfaces and architectural slabs with zero water absorption and unmatched durability.",
    ar: "Persis Quartz؛ الشركة المصنعة لأرقى ألواح الكوارتز الهندسية والأسطح المعمارية الفاخرة ذات المقاومة العالية.",
  };

  const finalDescription = (description || defaultDescriptions[locale]).trim();
  const finalImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${SITE_URL}/${locale}${cleanPath}`;

  return {
    title: fullTitle,
    description: finalDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fa: `${SITE_URL}/fa${cleanPath}`,
        en: `${SITE_URL}/en${cleanPath}`,
        ar: `${SITE_URL}/ar${cleanPath}`,
        "x-default": `${SITE_URL}/fa${cleanPath}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: baseTitle || BRAND_NAME,
        },
      ],
      locale: locale === "fa" ? "fa_IR" : locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
      site: "@persisquartz",
      creator: "@persisquartz",
    },
  };
}

// ۲. متادیتای اختصاصی صفحه محصولات (slug)
interface ProductMetadataParams {
  product: {
    title: string;
    code: string;
    description?: string | null;
    thumbnail?: string | null;
    slug: string;
  };
  locale: Locale;
}

export function generateProductSeoMetadata({
  product,
  locale,
}: ProductMetadataParams): Metadata {
  const titles: Record<Locale, string> = {
    fa: `${product.title} (${product.code})`,
    en: `${product.title} (${product.code})`,
    ar: `${product.title} (${product.code})`,
  };

  const descriptions: Record<Locale, string> = {
    fa:
      product.description ||
      `بررسی مشخصات فنی، ابعاد استاندارد و کاربردهای اسلب مهندسی‌شده ${product.title} با کد اختصاصی ${product.code} از Persis Quartz.`,
    en:
      product.description ||
      `Technical specifications, standard dimensions, and architectural applications for ${product.title} (${product.code}) engineered quartz slab by Persis Quartz.`,
    ar:
      product.description ||
      `المواصفات الفنية والأبعاد والتطبيقات المعمارية للوح الكوارتز ${product.title} كود ${product.code} من Persis Quartz.`,
  };

  return generateSeoMetadata({
    title: titles[locale],
    description: descriptions[locale],
    locale,
    image: product.thumbnail || undefined,
    path: `/products/${product.slug}`,
  });
}

// ۳. تابع ایمن‌ساز JSON-LD در برابر حملات XSS و خطاهای کاراکتر
export function safeJsonLdReplacer(
  data: Record<string, unknown> | Array<Record<string, unknown>>,
): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// ۴. گراف هویتی سازمان برای موتورهای هوش مصنوعی (GEO)
export function getOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/PersisQuartz-Red.png`,
      caption: BRAND_NAME,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+98-38-3228-1752",
        contactType: "customer service",
        areaServed: ["IR", "AE", "OM", "QA", "KW"],
        availableLanguage: ["Persian", "English", "Arabic"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Phase 3, Andisheh 6, Industrial Zone",
      addressLocality: "Shahrekord",
      addressRegion: "Chaharmahal and Bakhtiari",
      addressCountry: "IR",
    },
  };
}

// ۵. اسکیمای WebSite (برای صفحه اصلی)
export function getWebSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: BRAND_NAME,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ۶. اسکیما استاندارد Breadcrumb
export function getBreadcrumbSchema(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

// ۷. اسکیما غنی محصول (Product Schema) متصل به گراف هویت برند
export function getProductSchema({
  product,
  categoryTitle,
  dimensions = [],
  thicknesses = [],
  locale,
}: {
  product: {
    title: string;
    code: string;
    slug: string;
    description?: string | null;
    thumbnail?: string | null;
    is_in_stock?: string;
  };
  categoryTitle?: string;
  dimensions?: string[];
  thicknesses?: string[];
  locale: Locale;
}) {
  const productUrl = `${SITE_URL}/${locale}/products/${product.slug}`;
  const imageUrl = product.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${SITE_URL}${product.thumbnail.startsWith("/") ? "" : "/"}${product.thumbnail}`
    : `${SITE_URL}/PersisQuartz-Red.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: `${product.title} (${product.code})`,
    image: [imageUrl],
    description:
      product.description ||
      `Persis Quartz engineered slab model ${product.title}`,
    sku: product.code,
    mpn: product.code,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
      "@id": `${SITE_URL}/#organization`,
    },
    category: categoryTitle || "Engineered Quartz Stone",
    material: "93% Natural Quartz Stone & Engineered Polymer Resin",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Standard Dimensions",
        value:
          dimensions.length > 0
            ? dimensions.join(", ")
            : "320 x 75 cm, 320 x 92 cm",
      },
      {
        "@type": "PropertyValue",
        name: "Standard Thicknesses",
        value:
          thicknesses.length > 0
            ? thicknesses.join(", ")
            : "12mm, 14mm, 16mm, 18mm, 20mm",
      },
      {
        "@type": "PropertyValue",
        name: "Mohs Hardness",
        value: "7 Mohs",
      },
      {
        "@type": "PropertyValue",
        name: "Water Absorption",
        value: "0.03%",
      },
    ],
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: "0",
      priceStatus: "https://schema.org/PriceOnApplication",
      availability:
        product.is_in_stock === "discontinued"
          ? "https://schema.org/Discontinued"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
        "@id": `${SITE_URL}/#organization`,
      },
    },
  };
}
