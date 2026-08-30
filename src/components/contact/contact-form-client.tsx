"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { submitContactFormAction } from "@/app/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Loader2,
  Send,
  Box,
  Building2,
  Users,
  MessageSquare,
} from "lucide-react";

export function ContactFormClient() {
  const t = useTranslations("ContactPage");
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const initialType =
    (searchParams.get("type") as ContactFormValues["type"]) || "general";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      type: ["sample", "project", "dealer", "general"].includes(initialType)
        ? initialType
        : "general",
      fullName: "",
      email: "",
      phone: "",
      country: "",
      message: "",
      city: "",
      postalCode: "",
      address: "",
      company: "",
      productCodes: "",
      projectSize: "",
      thickness: "",
      finish: "",
    } as any,
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (selectedType === "sample" || selectedType === "project") {
      const code = searchParams.get("code");
      const thick = searchParams.get("thickness");
      if (code) setValue("productCodes" as any, code);
      if (thick) setValue("thickness" as any, thick);
    }
  }, [selectedType, searchParams, setValue]);

  const onSubmit = (data: ContactFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const response = await submitContactFormAction(data);
      if (response.success) {
        setIsSuccess(true);
        reset();
      } else {
        setServerError(response.message || "serverError");
      }
    });
  };

  const typeTabs = [
    { id: "general", label: t("tabGeneral"), icon: MessageSquare },
    { id: "sample", label: t("tabSample"), icon: Box },
    { id: "project", label: t("tabProject"), icon: Building2 },
    { id: "dealer", label: t("tabDealer"), icon: Users },
  ] as const;

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 sm:p-12 bg-card border border-primary/30 text-center space-y-4"
      >
        <div className="mx-auto w-14 h-14 bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-light text-foreground">
          {t("successTitle")}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
          {t("successMessage")}
        </p>
        <Button
          variant="outline"
          className="mt-2 rounded-none h-11 px-8 uppercase tracking-wider text-xs border-border"
          onClick={() => setIsSuccess(false)}
        >
          {t("submitAnother")}
        </Button>
      </motion.div>
    );
  }

  const FieldWrapper = ({
    name,
    label,
    required = false,
    type = "text",
    placeholder = "",
    span = 1,
    isTextarea = false,
  }: any) => (
    <div
      className={`space-y-1.5 ${span === 2 ? "sm:col-span-2" : "sm:col-span-1"}`}
    >
      <label
        htmlFor={name}
        className="text-xs font-medium text-foreground block"
      >
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          isTextarea ? (
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              className={`rounded-none bg-background text-xs resize-none min-h-[110px] transition-colors ${(errors as any)[name] ? "border-destructive focus-visible:ring-destructive" : "border-border/60 focus-visible:border-primary"}`}
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              dir={type === "email" || type === "tel" ? "ltr" : "auto"}
              placeholder={placeholder}
              className={`rounded-none h-11 bg-background text-xs transition-colors ${(errors as any)[name] ? "border-destructive focus-visible:ring-destructive" : "border-border/60 focus-visible:border-primary"}`}
            />
          )
        }
      />
      {(errors as any)[name] && (
        <span className="text-[10px] text-destructive block mt-1">
          {t((errors as any)[name].message)}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* تب‌ها: اسکرول افقی نرم در موبایل + گرید چهار ستونه در دسکتاپ */}
      <div className="overflow-x-auto pb-1.5 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="flex sm:grid sm:grid-cols-4 gap-1.5 border border-border/40 p-1 bg-muted/20 min-w-[500px] sm:min-w-0">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  reset({
                    type: tab.id,
                    fullName: "",
                    email: "",
                    phone: "",
                    country: "",
                    message: "",
                  } as any);
                }}
                className={`relative flex-1 py-3 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-0 bg-card border border-border shadow-xs"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span
                    className={`text-[11px] uppercase tracking-wider whitespace-nowrap ${isSelected ? "font-bold" : "font-normal"}`}
                  >
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {serverError && (
        <div className="p-3.5 bg-destructive/10 border-s-2 border-destructive text-destructive text-xs">
          {t(serverError as any)}
        </div>
      )}

      {/* فیلدها */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper name="fullName" label={t("fullNameLabel")} required />
          <FieldWrapper name="email" label={t("emailLabel")} type="email" />
          <FieldWrapper
            name="phone"
            label={t("phoneLabel")}
            type="tel"
            placeholder="+98..."
            required
          />
          <FieldWrapper name="country" label={t("countryLabel")} required />

          <AnimatePresence mode="popLayout">
            {selectedType === "sample" && (
              <motion.div
                key="sample"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/30 mt-1"
              >
                <FieldWrapper name="city" label="شهر / استان" required />
                <FieldWrapper
                  name="postalCode"
                  label="کد پستی (۱۰ رقمی)"
                  required
                />
                <FieldWrapper
                  name="productCodes"
                  label={t("productCodesLabel")}
                  placeholder="e.g. 1101, 3106"
                />
                <FieldWrapper
                  name="company"
                  label={t("companyLabel")}
                  placeholder="دفتر معماری / شرکت"
                />
                <FieldWrapper
                  name="address"
                  label={t("addressLabel")}
                  span={2}
                  required
                />
              </motion.div>
            )}

            {selectedType === "project" && (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/30 mt-1"
              >
                <FieldWrapper
                  name="company"
                  label={t("companyLabel")}
                  required
                />
                <FieldWrapper
                  name="projectSize"
                  label="متراژ حدودی (متر مربع)"
                />
                <FieldWrapper
                  name="productCodes"
                  label={t("productCodesLabel")}
                  placeholder="e.g. 1101, 3106"
                  span={2}
                />
              </motion.div>
            )}

            {selectedType === "dealer" && (
              <motion.div
                key="dealer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/30 mt-1"
              >
                <FieldWrapper
                  name="company"
                  label={t("companyLabel")}
                  required
                />
                <FieldWrapper
                  name="city"
                  label="شهر و استان مورد تقاضا"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FieldWrapper
            name="message"
            label={t("messageLabel")}
            isTextarea
            span={2}
            required
          />
        </div>

        <div className="pt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-10 h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider transition-all"
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
    </div>
  );
}
