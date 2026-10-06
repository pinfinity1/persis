import { getPublishedPostsService } from "@/services/post.service";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/services/product.service";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.blog" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";

  return {
    title: `${t("title")}`,
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        fa: `${siteUrl}/fa/blog`,
        en: `${siteUrl}/en/blog`,
        ar: `${siteUrl}/ar/blog`,
        "x-default": `${siteUrl}/fa/blog`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/blog`,
      siteName: "Persis Quartz",
      type: "website",
      locale: locale === "fa" ? "fa_IR" : locale === "ar" ? "ar_AE" : "en_US",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = await getPublishedPostsService(locale as Locale);

  return (
    <main className="container mx-auto px-4 sm:px-12 py-20 sm:py-32 select-none">
      <PageWatermarkHeader
        watermark={t("watermark")}
        title={t("title")}
        className="mb-16 sm:mb-24"
      />

      {posts.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center border border-border/40 bg-card/20">
          <span className="text-sm text-muted-foreground font-light tracking-wide">
            {t("empty")}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-card/40 hover:bg-card border border-border/40 hover:border-primary/50 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-muted overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground/30 font-mono tracking-[0.3em]">
                    PERSIS QUARTZ
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-lg lg:text-xl font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-4">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-border/20 flex items-center">
                  <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="h-px w-4 bg-primary transition-all duration-500 group-hover:w-8" />
                    {t("readMore")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
