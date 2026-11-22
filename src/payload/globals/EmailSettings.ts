// src/payload/globals/EmailSettings.ts
import type { GlobalConfig } from "payload";

export const EmailSettings: GlobalConfig = {
  slug: "email-settings",
  label: "تنظیمات و قالب‌های ایمیل",
  admin: {
    group: "سامانه ایمیل",
    description: "مدیریت قالب‌های پاسخ خودکار به مشتریان و نوتیفیکیشن‌های فرم‌های تماس",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // تب ۱: پاسخ خودکار فرم‌های تماس با ما (Contact Forms)
        {
          label: "قالب پاسخ فرم‌های تماس با ما",
          description: "تنظیم متن ایمیلی که بلافاصله پس از ثبت فرم تماس یا سمپل باکس برای مشتری ارسال می‌شود.",
          fields: [
            {
              name: "enableContactAutoReply",
              type: "checkbox",
              defaultValue: true,
              label: "فعال بودن ارسال پاسخ تاییدیه به مشتری",
            },
            {
              name: "contactReplySubject",
              type: "text",
              required: true,
              defaultValue: "پیام شما در پرسیس کوارتز دریافت شد",
              label: "موضوع ایمیل پاسخ (Subject)",
              admin: {
                description: "متغیر مجاز: {name} جهت قرار دادن نام مشتری",
              },
            },
            {
              name: "contactReplyHeading",
              type: "text",
              required: true,
              defaultValue: "درخواست شما با موفقیت ثبت شد",
              label: "عنوان بالای ایمیل (Heading)",
            },
            {
              name: "contactReplyMessage",
              type: "textarea",
              required: true,
              defaultValue:
                "با سپاس از ارتباط شما با شرکت پرسیس کوارتز. درخواست شما با موفقیت به دپارتمان مربوطه ارجاع گردید و کارشناسان فنی و بازرگانی ما در اسرع وقت جهت هماهنگی با شما تماس خواهند گرفت.",
              label: "متن پیام پاسخ به مشتری (Body Message)",
              admin: {
                description: "می‌توانید متن را آزادانه به هر صورت که مایلید تغییر دهید.",
              },
            },
            {
              name: "contactReplyFooter",
              type: "textarea",
              defaultValue:
                "پرسیس کوارتز • تولیدکننده سطوح مهندسی‌شده سنگ کوارتز\nتلفن: ۰۳۸-۳۲۲۸۱۷۵۲ | وب‌سایت: persisquartz.com",
              label: "پاورقی و اطلاعات تماس انتهای ایمیل",
            },
          ],
        },

        // تب ۲: پاسخ خودکار ایمیل‌های دریافتی مستقیم (Inbound Email Auto-Reply)
        {
          label: "پاسخ خودکار ایمیل‌های ورودی (Auto-Responder)",
          description: "پاسخ خودکار عمومی هنگامی که مشتری مستقیماً به یکی از ایمیل‌های سازمانی پیام می‌فرستد.",
          fields: [
            {
              name: "enableInboundAutoReply",
              type: "checkbox",
              defaultValue: false,
              label: "فعال‌سازی پاسخ خودکار برای ایمیل‌های ورودی",
              admin: {
                description: "در صورت فعال بودن، پس از دریافت هر ایمیل، یک پاسخ خودکار تاییدیه برای فرستنده ارسال می‌شود.",
              },
            },
            {
              name: "inboundReplySubject",
              type: "text",
              defaultValue: "ایمیل شما دریافت شد | شرکت پرسیس کوارتز",
              label: "موضوع پاسخ خودکار",
            },
            {
              name: "inboundReplyMessage",
              type: "textarea",
              defaultValue:
                "با سلام و احترام،\n\nایمیل شما با موفقیت دریافت شد و در دست بررسی دپارتمان مربوطه قرار گرفت. کارشناسان ما به زودی پاسخگوی شما خواهند بود.\n\nبا تشکر\nتیم پشتیبانی پرسیس کوارتز",
              label: "متن پیام پاسخ خودکار",
            },
          ],
        },

        // تب ۳: ایمیل‌های دریافت نوتیفیکیشن ادمین
        {
          label: "دریافت‌کنندگان هشدار ادمین",
          description: "مشخص کنید فرم‌های ثبت‌شده سایت به کدام ایمیل‌ها ارسال شوند.",
          fields: [
            {
              name: "adminNotificationEmails",
              type: "text",
              defaultValue: "sales@persisquartz.com, info@persisquartz.com",
              label: "لیست ایمیل‌های دریافت نوتیفیکیشن (جدا شده با کاما)",
              admin: {
                description: "مثال: ceo@persisquartz.com, sales@persisquartz.com",
              },
            },
          ],
        },
      ],
    },
  ],
};
