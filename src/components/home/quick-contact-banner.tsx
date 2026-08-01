// src/components/home/quick-contact-banner.tsx
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quickContactSchema,
  type QuickContactValues,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export const QuickContactBanner: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<QuickContactValues>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: QuickContactValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/leads/quick-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-secondary/40 py-20 border-y border-border/50">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* متن توضیحات */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              مشاوره اختصاصی
            </span>
            <h3 className="text-3xl font-light text-foreground sm:text-4xl leading-tight">
              نیاز به راهنمایی در انتخاب سنگ مناسب دارید؟
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              کارشناسان ما آماده ارائه مشاوره تخصصی برای پروژه‌های شما هستند.
              فرم را تکمیل کنید تا با شما تماس بگیریم.
            </p>
          </div>

          {/* فرم اصلی بر اساس ساختار Shadcn Controller & Field */}
          <div className="lg:col-span-7 bg-card border border-border p-8 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="text-emerald-600 font-medium text-lg">
                  درخواست شما با موفقیت ثبت شد.
                </div>
                <p className="text-xs text-muted-foreground">
                  کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-none"
                  onClick={() => setIsSuccess(false)}
                >
                  ثبت درخواست جدید
                </Button>
              </div>
            ) : (
              <form
                id="quick-contact-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* نام و نام خانوادگی */}
                    <Controller
                      name="fullName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            نام و نام خانوادگی *
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="مثال: علی محمدی"
                            autoComplete="name"
                            className="rounded-none h-11"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* شماره همراه */}
                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            شماره همراه *
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="09123456789"
                            dir="ltr"
                            className="rounded-none h-11 text-right"
                            autoComplete="tel"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  {/* توضیحات/پیام */}
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          پیام یا توضیحات پروژه *
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="توضیحات کوتاه درباره متراژ، کاربری یا سوالات شما..."
                          rows={4}
                          className="rounded-none resize-none"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* دکمه ثبت */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                    >
                      {isSubmitting
                        ? "در حال ارسال..."
                        : "ارسال درخواست مشاوره"}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
