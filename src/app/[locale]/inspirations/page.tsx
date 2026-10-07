import { getInspirationsService } from "@/services/inspiration.service";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { InspirationCard } from "@/components/inspirations/inspiration-card";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/services/product.service";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.inspirations",
  });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/inspirations`,
      languages: {
        fa: `${siteUrl}/fa/inspirations`,
        en: `${siteUrl}/en/inspirations`,
        ar: `${siteUrl}/ar/inspirations`,
        "x-default": `${siteUrl}/fa/inspirations`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/inspirations`,
      siteName: "Persis Quartz",
      type: "website",
      locale: locale === "fa" ? "fa_IR" : locale === "ar" ? "ar_AE" : "en_US",
    },
  };
}

export default async function InspirationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // هماهنگی واترمارک و عناوین با سیستم یکپارچه next-intl
  const t = await getTranslations({ locale, namespace: "Inspirations" });
  const inspirations = await getInspirationsService(locale as Locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";

  // GEO Schema ImageGallery
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: t("title"),
    url: `${siteUrl}/${locale}/inspirations`,
    publisher: {
      "@type": "Organization",
      name: "Persis Quartz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/PersisQuartz-Red.png`,
      },
    },
    image: inspirations.map((item) => ({
      "@type": "ImageObject",
      contentUrl: item.image.startsWith("http")
        ? item.image
        : `${siteUrl}${item.image}`,
      name: item.title,
      description: item.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto px-4 sm:px-12 py-20 sm:py-32 select-none">
        <PageWatermarkHeader
          watermark={t("watermark")}
          title={t("title")}
          className="mb-16 sm:mb-24"
        />

        {inspirations.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center border border-border/40 bg-card/20">
            <span className="text-sm text-muted-foreground font-light tracking-wide">
              {t("empty")}
            </span>
          </div>
        ) : (
          /* سیستم چیدمان Masonry با پرفورمنس بالا (بدون جاوااسکریپت) */
          <div className="columns-1 md:columns-2 gap-8 lg:gap-12 w-full">
            {inspirations.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-8 lg:mb-12">
                <InspirationCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
