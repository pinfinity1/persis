import { notFound } from "next/navigation";
import { getPostBySlugService } from "@/services/post.service";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import type { Locale } from "@/services/product.service";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise });
    const posts = await payload.find({
      collection: "posts",
      limit: 100,
      depth: 0,
      where: { status: { equals: "published" } },
    });

    const locales = ["fa", "en", "ar"];
    const params = [];

    for (const post of posts.docs) {
      if (!post.slug) continue;
      for (const locale of locales) {
        params.push({ locale, slug: post.slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlugService(slug, locale as Locale);

  if (!post) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://persisquartz.com";
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  const rawCoverUrl =
    post.coverImage &&
    typeof post.coverImage === "object" &&
    "url" in post.coverImage
      ? post.coverImage.url
      : typeof post.coverImage === "string"
        ? post.coverImage
        : null;

  const coverUrl: string = rawCoverUrl || `${siteUrl}/PersisQuartz-Red.png`;

  return {
    title: `${post.title} | Persis Quartz`,
    description: post.excerpt || undefined,
    alternates: {
      canonical: postUrl,
      languages: {
        fa: `${siteUrl}/fa/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
        ar: `${siteUrl}/ar/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url: postUrl,
      siteName: "Persis Quartz",
      images: [{ url: coverUrl }],
      type: "article",
      locale: locale === "fa" ? "fa_IR" : locale === "ar" ? "ar_AE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [coverUrl],
    },
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // تعریف متغیر جهت متن
  const isRtl = locale === "fa" || locale === "ar";

  const t = await getTranslations({ locale, namespace: "Blog" });
  const post = await getPostBySlugService(slug, locale as Locale);

  if (!post) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://persisquartz.com";

  const coverUrl =
    post.coverImage &&
    typeof post.coverImage === "object" &&
    post.coverImage.url
      ? post.coverImage.url
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: locale,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${locale}/blog/${slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Persis Quartz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/PersisQuartz-Red.png`,
      },
    },
    image: coverUrl ? [coverUrl] : [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24 selection:bg-primary/20 selection:text-primary">
        {/* دکمه بازگشت به لیست مقالات */}
        <div className="mb-6 sm:mb-10 flex items-center select-none">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-0 ltr:rotate-180" />
            <span>{t("backToList")}</span>
          </Link>
        </div>

        {/* هدر و عنوان مقاله */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-foreground leading-snug sm:leading-tight tracking-tight text-balance">
            {post.title}
          </h1>
          <div className="mt-4 sm:mt-6 flex items-center gap-4 border-t border-border/40 pt-4 sm:pt-6 select-none">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-2.5">
              <span className="h-px w-4 sm:w-6 bg-primary shrink-0" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(
                    locale === "fa"
                      ? "fa-IR"
                      : locale === "ar"
                        ? "ar-SA"
                        : "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )
                : ""}
            </span>
          </div>
        </header>

        {/* تصویر شاخص بدون اسکیل در هاور */}
        {coverUrl && (
          <div className="relative aspect-[16/10] sm:aspect-[21/10] w-full mb-8 sm:mb-16 border border-border/40 overflow-hidden bg-muted">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* محتوای رندر شده استاندارد با پشتیبانی کامل از ترکیب فارسی و انگلیسی */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="w-full text-foreground space-y-6 text-start leading-relaxed [unicode-bidi:isolate]
            [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-foreground
            [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-border/40 [&_h2]:text-foreground
            [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-foreground
            [&_h4]:text-base sm:[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-foreground
            [&_p]:text-muted-foreground [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-[2.2] sm:[&_p]:leading-[2.4] [&_p]:font-light [&_p]:mb-4
            [&_strong]:font-bold [&_strong]:text-foreground [&_strong]:text-sm sm:[&_strong]:text-base
            [&_b]:font-bold [&_b]:text-foreground
            [&_em]:italic [&_em]:text-foreground/90
            [&_hr]:my-8 [&_hr]:border-border/40
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
            [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-4 [&_ol]:space-y-2
            [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-4 [&_ul]:space-y-2
            [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-muted-foreground [&_li]:leading-relaxed
            [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/20 [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:my-6 [&_blockquote]:text-foreground/90 [&_blockquote]:font-light [&_blockquote]:not-italic"
        >
          <RichText data={post.content} />
        </div>
      </article>
    </>
  );
}
