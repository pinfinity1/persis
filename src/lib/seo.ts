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
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";
const DEFAULT_OG_IMAGE = "/PersisQuartz-Red.png";

// ۱. تابع پایه: برای همه صفحات عمومی سایت
export function generateSeoMetadata({
  title,
  description,
  locale,
  image,
  path = "",
  noIndex = false,
}: GenerateSeoOptions): Metadata {
  const cleanTitle = title.trim();
  const fullTitle = `${cleanTitle} | ${BRAND_NAME}`;

  const defaultDescriptions: Record<Locale, string> = {
    fa: "تولیدکننده انواع اسلب‌های مهندسی‌شده سنگ کوارتز با بالاترین استانداردهای معماری و دوام ساختاری.",
    en: "Manufacturer of premium engineered quartz surfaces and architectural slabs.",
    ar: "الشركة المصنعة لأرقى ألواح الكوارتز الهندسية والأسطح المعمارية الفاخرة.",
  };

  const finalDescription = (description || defaultDescriptions[locale]).trim();
  const finalImage = image || DEFAULT_OG_IMAGE;
  const canonicalUrl = `${SITE_URL}/${locale}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title: fullTitle,
    description: finalDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fa: `${SITE_URL}/fa${path}`,
        en: `${SITE_URL}/en${path}`,
        ar: `${SITE_URL}/ar${path}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
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
          alt: cleanTitle,
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
    },
  };
}

// ۲. تابع اختصاصی محصولات: برای صفحه [slug]
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
    fa: `اسلب کوارتز ${product.title} (${product.code})`,
    en: `${product.title} Quartz Slab (${product.code})`,
    ar: `لوح كوارتز ${product.title} (${product.code})`,
  };

  const descriptions: Record<Locale, string> = {
    fa:
      product.description ||
      `بررسی مشخصات فنی، ابعاد و استانداردهای اسلب سنگ کوارتز ${product.title} با کد اختصاصی ${product.code}.`,
    en:
      product.description ||
      `Technical specifications, dimensions, and architectural applications for ${product.title} (${product.code}) engineered quartz slab.`,
    ar:
      product.description ||
      `المواصفات الفنية والأبعاد والتطبيقات المعمارية للوح الكوارتز ${product.title} كود ${product.code}.`,
  };

  return generateSeoMetadata({
    title: titles[locale],
    description: descriptions[locale],
    locale,
    image: product.thumbnail || undefined,
    path: `/products/${product.slug}`,
  });
}
