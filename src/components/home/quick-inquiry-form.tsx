"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import {
  quickContactSchema,
  type QuickContactValues,
} from "@/lib/validations/contact";
import { submitContactFormAction } from "@/app/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const QuickInquiryForm: React.FC = () => {
  const t = useTranslations("InteractiveTools");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";

  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<QuickContactValues>({
    resolver: zodResolver(quickContactSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      country: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (values: QuickContactValues) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitContactFormAction({
        type: "general",
        ...values,
      });

      if (res.success) {
        setIsSuccess(true);
        reset();
      } else {
        setServerError(res.message || "serverError");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="p-6 sm:p-8 bg-muted/20 border border-primary/30 text-center space-y-3 my-auto">
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto stroke-[1.5]" />
        <p className="text-sm font-medium text-foreground">
          {t("successMessage")}
        </p>
        <p className="text-xs text-muted-foreground font-light">
          {t("successSubtext")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 rounded-none text-xs border-border"
          onClick={() => setIsSuccess(false)}
        >
          {t("newRequestBtn")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div className="p-3 bg-destructive/10 border-s-2 border-destructive text-destructive text-xs">
          {t(serverError as any)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* نام و نام خانوادگی */}
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="text-xs font-medium text-foreground block"
          >
            {t("fullNameLabel")} <span className="text-primary">*</span>
          </label>
          <Input
            id="fullName"
            dir={isRtl ? "rtl" : "ltr"}
            placeholder={t("fullNamePlaceholder")}
            {...register("fullName")}
            disabled={isPending}
            className={`rounded-none h-10 bg-background text-xs placeholder:text-muted-foreground/40 ${
              errors.fullName
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border/60"
            }`}
          />
          {errors.fullName && (
            <span className="text-[10px] text-destructive block">
              {t(errors.fullName.message as any)}
            </span>
          )}
        </div>

        {/* کشور / منطقه */}
        <div className="space-y-1.5">
          <label
            htmlFor="country"
            className="text-xs font-medium text-foreground block"
          >
            {t("countryLabel")} <span className="text-primary">*</span>
          </label>
          <Input
            id="country"
            dir={isRtl ? "rtl" : "ltr"}
            placeholder={t("countryPlaceholder")}
            {...register("country")}
            disabled={isPending}
            className={`rounded-none h-10 bg-background text-xs placeholder:text-muted-foreground/40 ${
              errors.country
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border/60"
            }`}
          />
          {errors.country && (
            <span className="text-[10px] text-destructive block">
              {t(errors.country.message as any)}
            </span>
          )}
        </div>
      </div>

      {/* شماره تماس همراه با Hint و تراز ثابت LTR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="phone"
            className="text-xs font-medium text-foreground block"
          >
            {t("phoneLabel")} <span className="text-primary">*</span>
          </label>
          <span className="text-[10px] text-muted-foreground/70 font-light">
            {t("phoneHint")}
          </span>
        </div>
        <Input
          id="phone"
          type="tel"
          dir="ltr"
          placeholder={t("phonePlaceholder")}
          disabled={isPending}
          {...register("phone")}
          className={`rounded-none h-10 bg-background text-xs font-mono text-start tracking-wider placeholder:tracking-normal placeholder:font-mono placeholder:text-muted-foreground/40 ${
            errors.phone
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border/60"
          }`}
        />
        {errors.phone && (
          <span className="text-[10px] text-destructive block">
            {t(errors.phone.message as any)}
          </span>
        )}
      </div>

      {/* شرح درخواست */}
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="text-xs font-medium text-foreground block"
        >
          {t("messageLabel")} <span className="text-primary">*</span>
        </label>
        <Textarea
          id="message"
          rows={3}
          dir={isRtl ? "rtl" : "ltr"}
          placeholder={t("messagePlaceholder")}
          disabled={isPending}
          {...register("message")}
          className={`rounded-none bg-background text-xs resize-none min-h-[85px] placeholder:text-muted-foreground/40 ${
            errors.message
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border/60"
          }`}
        />
        {errors.message && (
          <span className="text-[10px] text-destructive block">
            {t(errors.message.message as any)}
          </span>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending || !isValid}
          className="w-full sm:w-auto px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-xs uppercase tracking-wider transition-all disabled:opacity-70"
        >
          {isPending ? (
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
  );
};
