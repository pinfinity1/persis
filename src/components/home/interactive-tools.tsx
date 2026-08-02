// src/components/home/interactive-tools.tsx
"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  quickContactSchema,
  type QuickContactValues,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpRight,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export const InteractiveTools: React.FC = () => {
  const t = useTranslations("InteractiveTools");
  const locale = useLocale();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // useRef جهت مدیریت امن تایمر و جلوگیری از Memory Leak در هنگام unmount
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickContactValues>({
    resolver: zodResolver(quickContactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      country: locale === "fa" ? "ایران" : "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = useCallback(
    async (data: QuickContactValues) => {
      if (cooldown || isSubmitting) return;

      setIsSubmitting(true);
      setCooldown(true);

      const sanitizedData = {
        fullName: data.fullName.trim().replace(/[<>]/g, ""),
        country: data.country.trim().replace(/[<>]/g, ""),
        phone: data.phone.trim().replace(/[^0-9+]/g, ""),
        message: data.message.trim().replace(/[<>]/g, ""),
        locale,
      };

      try {
        const response = await fetch("/api/v1/leads/quick-contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify(sanitizedData),
        });

        if (response.ok) {
          setIsSuccess(true);
          reset();
        }
      } catch (error) {
        console.error("Error submitting project inquiry:", error);
      } finally {
        setIsSubmitting(false);
        timerRef.current = setTimeout(() => setCooldown(false), 5000);
      }
    },
    [cooldown, isSubmitting, reset, locale],
  );

  return (
    <section className="py-10 sm:py-16 bg-background border-b border-border/40 select-none overflow-hidden">
      <div className="container mx-auto px-4 sm:px-12">
        {/* عنوان بخش */}
        <div className="max-w-3xl mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-mono block mb-1">
            {t("tagline")}
          </span>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-light text-foreground">
            {t("title")}
          </h3>
        </div>

        {/* گرید اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* کارت ۱: شبکه فروش و نقشه ایران (واضح، محوشدگی لبه پایین و بدون خط جداکننده) */}
          <div className="lg:col-span-5 bg-card border border-border/60 flex flex-col justify-between hover:border-primary/40 transition-colors duration-500 rounded-none overflow-hidden relative group">
            {/* بخش نقشه ایران - شفافیت عالی، انیمیشن هاور و گرادینت نرم */}
            <div className="relative w-full h-48 sm:h-56 lg:h-52 bg-muted/30 p-4 flex items-center justify-center overflow-hidden">
              <Image
                src="/iran-map.png"
                alt="Persis Quartz Dealer Network Iran Map"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-2 opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale dark:invert"
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </div>

            {/* محتوای متنی کارت ۱ */}
            <div className="p-5 sm:p-7 pt-2 flex flex-col justify-between flex-1 space-y-6 z-10">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-2 bg-muted/60 w-fit border border-border/50 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>

                <h4 className="text-base sm:text-lg lg:text-xl font-light text-foreground leading-snug">
                  {t("dealerTitle")}
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  {t("dealerDesc")}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider transition-all"
                >
                  <Link
                    href="/dealers"
                    className="flex items-center justify-between gap-3"
                  >
                    <span>{t("viewDealersBtn")}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* کارت ۲: فرم درخواست مشاوره پروژه */}
          <div className="lg:col-span-7 bg-card border border-border/60 p-5 sm:p-7 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors duration-300 rounded-none">
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg lg:text-xl font-light text-foreground">
                {t("projectTitle")}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                {t("projectDesc")}
              </p>
            </div>

            <div className="pt-2">
              {isSuccess ? (
                <div className="p-6 bg-muted/30 border border-emerald-600/30 text-center space-y-2 my-auto">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" />
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    {t("successMessage")}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-light">
                    {t("successSubtext")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-none text-xs h-8"
                    onClick={() => setIsSuccess(false)}
                  >
                    {t("newRequestBtn")}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-3"
                >
                  {/* ردیف ۱: نام و کشور */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {/* نام و نام خانوادگی */}
                    <div className="flex flex-col relative pb-5">
                      <label
                        htmlFor="fullName"
                        className="text-[11px] font-normal text-foreground mb-1 block"
                      >
                        {t("fullNameLabel")} *
                      </label>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            maxLength={60}
                            className={`rounded-none h-10 bg-background text-xs transition-colors ${
                              errors.fullName
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            }`}
                          />
                        )}
                      />
                      {errors.fullName && (
                        <span className="absolute bottom-0 start-0 text-[10px] text-destructive font-light leading-none">
                          {t("fullNameError")}
                        </span>
                      )}
                    </div>

                    {/* کشور / شهر */}
                    <div className="flex flex-col relative pb-5">
                      <label
                        htmlFor="country"
                        className="text-[11px] font-normal text-foreground mb-1 block"
                      >
                        {t("countryLabel")} *
                      </label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="country"
                            type="text"
                            maxLength={50}
                            className={`rounded-none h-10 bg-background text-xs transition-colors ${
                              errors.country
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            }`}
                          />
                        )}
                      />
                      {errors.country && (
                        <span className="absolute bottom-0 start-0 text-[10px] text-destructive font-light leading-none">
                          {t("countryError")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ردیف ۲: شماره همراه */}
                  <div className="flex flex-col relative pb-5">
                    <label
                      htmlFor="phone"
                      className="text-[11px] font-normal text-foreground mb-1 block"
                    >
                      {t("phoneLabel")} *
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="+98..."
                          dir="ltr"
                          maxLength={20}
                          onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/[^0-9+]/g, "");
                          }}
                          className={`rounded-none h-10 bg-background text-xs transition-colors placeholder:text-muted-foreground/30 ${
                            errors.phone
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          autoComplete="tel"
                        />
                      )}
                    />
                    {errors.phone && (
                      <span className="absolute bottom-0 start-0 text-[10px] text-destructive font-light leading-none">
                        {t("phoneError")}
                      </span>
                    )}
                  </div>

                  {/* توضیحات پروژه */}
                  <div className="flex flex-col relative pb-5">
                    <label
                      htmlFor="message"
                      className="text-[11px] font-normal text-foreground mb-1 block"
                    >
                      {t("messageLabel")} *
                    </label>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="message"
                          maxLength={500}
                          className={`rounded-none bg-background resize-none text-xs h-20 min-h-[80px] transition-colors ${
                            errors.message
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                        />
                      )}
                    />
                    {errors.message && (
                      <span className="absolute bottom-0 start-0 text-[10px] text-destructive font-light leading-none">
                        {t("messageError")}
                      </span>
                    )}
                  </div>

                  {/* دکمه ارسال */}
                  <div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || cooldown}
                      className="w-full sm:w-auto px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-xs uppercase tracking-wider transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>{t("submitBtn")}</span>
                          <Send className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
