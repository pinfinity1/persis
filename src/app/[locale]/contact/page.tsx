// src/app/[locale]/contact/page.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactFormClient } from "@/components/contact/contact-form-client";
import { Phone, Mail, Factory, ArrowUpRight } from "lucide-react";
import { PageWatermarkHeader } from "@/components/shared/page-watermark-header";
import { getSeoSettingsService } from "@/services/seo.service";
import { getContactPageDataService } from "@/services/contact.service";
import {
  generateStaticPageMetadata,
  getOrganizationSchema,
  safeJsonLdReplacer,
  type Locale,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";

  return generateStaticPageMetadata("contact", currentLocale, "/contact");
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || "fa";
  setRequestLocale(currentLocale);

  const [t, tMeta, seoSettings, contactData] = await Promise.all([
    getTranslations({
      locale: currentLocale,
      namespace: "ContactPage",
    }),
    getTranslations({
      locale: currentLocale,
      namespace: "Metadata",
    }),
    getSeoSettingsService(currentLocale),
    getContactPageDataService(currentLocale),
  ]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name:
      seoSettings.pages.contact.title ||
      contactData.title ||
      "Persis Quartz",
    description:
      seoSettings.pages.contact.description ||
      contactData.infoDesc ||
      "",
    mainEntity: getOrganizationSchema(),
  };

  const cleanFactoryPhone = (
    contactData.phoneNumber || "+98 38 3228 1752"
  ).replace(/\s+/g, "");

  return (
    <main className="min-h-screen bg-background pt-28 sm:pt-36 pb-20 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(contactSchema) }}
      />

      <div className="container mx-auto px-4 sm:px-12 space-y-10 sm:space-y-14">
        <PageWatermarkHeader
          watermark={contactData.watermark || "CONTACT"}
          title={
            contactData.title ||
            seoSettings.pages.contact.title ||
            tMeta("contact.title")
          }
        />

        {/* گرید تقارن‌دار اسپلیت اسکرین */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ستون اطلاعات ارتباطی و کارخانه */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-light text-foreground">
                {contactData.infoTitle || t("infoTitle")}
              </h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {contactData.infoDesc || t("infoDesc")}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* کارخانه */}
              <div className="p-4 bg-card border border-border/50 space-y-2 group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 text-primary">
                  <Factory className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                    {contactData.factoryTitle || t("factoryTitle")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {contactData.factoryAddress || t("factoryAddress")}
                </p>
              </div>

              {/* تلفن کارخانه */}
              <div className="p-4 bg-card border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                      {contactData.phoneTitle || t("phoneTitle")}
                    </span>
                    <a
                      href={`tel:${cleanFactoryPhone}`}
                      dir="ltr"
                      className="text-xs text-foreground hover:text-primary transition-colors"
                    >
                      {contactData.phoneNumber || "+98 38 3228 1752"}
                    </a>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </div>

              {/* ایمیل مرکزی */}
              <div className="p-4 bg-card border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                      {contactData.emailTitle || t("emailTitle")}
                    </span>
                    <a
                      href={`mailto:${contactData.emailAddress || "info@persisquartz.com"}`}
                      dir="ltr"
                      className="text-xs text-foreground hover:text-primary transition-colors"
                    >
                      {contactData.emailAddress || "info@persisquartz.com"}
                    </a>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </div>

              {/* دفاتر و شعب دیگر در صورت تعریف توسط کارفرما */}
              {contactData.additionalOffices &&
                contactData.additionalOffices.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    {contactData.additionalOffices.map((office) => (
                      <div
                        key={office.id}
                        className="p-4 bg-card border border-border/50 space-y-2 group hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-primary">
                          <Factory className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                            {office.title}
                          </span>
                        </div>
                        {office.address && (
                          <p className="text-xs text-muted-foreground font-light leading-relaxed">
                            {office.address}
                          </p>
                        )}
                        {office.phone && (
                          <div className="flex items-center gap-2 pt-1 text-xs">
                            <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                            <a
                              href={`tel:${office.phone.replace(/\s+/g, "")}`}
                              dir="ltr"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {office.phone}
                            </a>
                          </div>
                        )}
                        {office.email && (
                          <div className="flex items-center gap-2 pt-0.5 text-xs">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <a
                              href={`mailto:${office.email}`}
                              dir="ltr"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {office.email}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* ستون فرم و تعاملات با لودینگ آیکون‌دار */}
          <div className="lg:col-span-8 bg-card border border-border/60 p-5 sm:p-8 shadow-sm">
            <Suspense
              fallback={
                <div className="h-96 flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground">
                  <div className="relative size-10 flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                    <span className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                </div>
              }
            >
              <ContactFormClient formTexts={contactData.formTexts} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
