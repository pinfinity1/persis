import type { CollectionConfig } from "payload";
import { hashPassword } from "@/lib/webmail-auth";
import { transporter } from "@/lib/email";
import { escape } from "html-escaper";

export const Mailboxes: CollectionConfig = {
  slug: "mailboxes",
  admin: {
    useAsTitle: "address",
    group: "سامانه ایمیل",
    defaultColumns: ["name", "address", "forwardTo", "isActive", "isCatchAll", "updatedAt"],
    description: "مدیریت آدرس‌ها و اینباکس‌های رسمی شرکت (مانند ceo@persisquartz.com)",
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "نام نمایشی / عنوان بخش",
      admin: {
        description: "مثال: احسان سامانی (مدیریت)، فروش و بازرگانی",
      },
    },
    {
      name: "address",
      type: "email",
      required: true,
      unique: true,
      index: true,
      label: "آدرس ایمیل سازمانی",
      admin: {
        description: "مثال: ehsan@persisquartz.com یا ceo@persisquartz.com",
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value),
        ],
      },
    },
    {
      name: "forwardTo",
      type: "text",
      label: "ایمیل شخصی کارشناس جهت فوروارد و نوتیفیکیشن",
      admin: {
        description: "مثال: reza.sales@gmail.com - پیام‌های دریافتی فوراً برای این ایمیل هم ارسال می‌شوند تا روی گوشی نوتیف دریافت کند.",
      },
    },
    {
      name: "webmailPassword",
      type: "text",
      label: "رمز عبور ورود به وب‌میل (Webmail Password)",
      admin: {
        description: "رمز اختصاصی جهت لاگین کارشناس به mail.persisquartz.com. در صورت عدم تغییر، دست نخورده باقی بگذارید.",
      },
      hooks: {
        beforeChange: [
          async ({ value, originalDoc }) => {
            if (typeof value === "string" && value.trim()) {
              if (!value.startsWith("$scrypt$")) {
                return await hashPassword(value.trim());
              }
              return value;
            }
            return originalDoc?.webmailPassword || null;
          },
        ],
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      label: "فعال بودن اینباکس",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "isCatchAll",
      type: "checkbox",
      defaultValue: false,
      label: "دریافت ایمیل‌های عمومی (Catch-All)",
      admin: {
        position: "sidebar",
        description: "در صورت فعال بودن، هر ایمیلی به دامنه‌ای که ثبت نشده به این صندوق هدایت می‌شود.",
      },
    },
    {
      name: "assignedUsers",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      label: "کاربران مجاز برای دسترسی و ارسال",
      admin: {
        description: "مشخص کنید چه افرادی در پنل اجازه دارند با این آدرس ایمیل ارسال یا ایمیل‌ها را مشاهده کنند.",
      },
    },
    {
      name: "enableAutoReply",
      type: "checkbox",
      defaultValue: false,
      label: "ارسال پاسخ خودکار اختصاصی برای این صندوق",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "autoReplySubject",
      type: "text",
      label: "موضوع پاسخ خودکار اختصاصی",
      admin: {
        condition: (data) => Boolean(data?.enableAutoReply),
      },
    },
    {
      name: "autoReplyBody",
      type: "textarea",
      label: "متن پیام پاسخ خودکار اختصاصی",
      admin: {
        condition: (data) => Boolean(data?.enableAutoReply),
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "توضیحات داخلی",
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Send Onboarding Welcome Email if created and forwardTo exists
        if (operation === "create" && doc.forwardTo && !req?.context?.skipWelcomeEmail) {
          try {
            const portalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";
            const webmailUrl = portalUrl.includes("localhost")
              ? "http://mail.localhost:3000"
              : "https://mail.persisquartz.com";

            transporter
              .sendMail({
                from: `"سامانه ایمیل پرسیس کوارتز" <${process.env.SMTP_USER || "info@persisquartz.com"}>`,
                to: doc.forwardTo,
                subject: `اطلاعات دسترسی به ایمیل سازمانی پرسیس کوارتز | ${doc.address}`,
                html: `
                  <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Tahoma, sans-serif; background-color: #0f1117; color: #f3f4f6; padding: 32px 20px; line-height: 1.8;">
                    <div style="max-width: 540px; margin: 0 auto; background-color: #171923; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                      <div style="background-color: #9B0737; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px; font-weight: bold;">PERSIS QUARTZ</h1>
                        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 12px;">سامانه یکپارچه ارتباطات و ایمیل سازمانی</p>
                      </div>
                      <div style="padding: 28px;">
                        <h2 style="color: #ffffff; font-size: 16px; margin-top: 0;">با سلام و احترام، جناب/سرکار ${escape(doc.name)}</h2>
                        <p style="color: #d1d5db; font-size: 13px;">حساب ایمیل سازمانی اختصاصی شما در شرکت پرسیس کوارتز با موفقیت ایجاد گردید. از این پس می‌توانید جهت برقراری مکاتبات رسمی از اطلاعات زیر استفاده نمایید:</p>
                        
                        <div style="background-color: #202433; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; margin: 20px 0;">
                          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr>
                              <td style="color: #9ca3af; padding: 6px 0; width: 130px;">آدرس سامانه وب‌میل:</td>
                              <td style="color: #f3f4f6; padding: 6px 0; font-weight: bold;"><a href="${webmailUrl}" style="color: #f43f5e; text-decoration: none;">${webmailUrl.replace(/^https?:\/\//, "")}</a></td>
                            </tr>
                            <tr>
                              <td style="color: #9ca3af; padding: 6px 0;">آدرس ایمیل سازمانی:</td>
                              <td style="color: #f3f4f6; padding: 6px 0; font-weight: bold; font-family: monospace;" dir="ltr">${escape(doc.address)}</td>
                            </tr>
                            <tr>
                              <td style="color: #9ca3af; padding: 6px 0;">وضعیت حساب:</td>
                              <td style="color: #10b981; padding: 6px 0;">فعال و آماده استفاده</td>
                            </tr>
                          </table>
                        </div>

                        <p style="color: #9ca3af; font-size: 12px; margin-bottom: 24px;">
                          رمز عبور ورود توسط مدیر سیستم/فناوری اطلاعات به شما ابلاغ شده است. در صورت نیاز به تغییر یا فراموشی رمز، با واحد فناوری اطلاعات شرکت در تماس باشید.
                        </p>

                        <div style="text-align: center;">
                          <a href="${webmailUrl}" style="display: inline-block; background-color: #9B0737; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px 28px; border-radius: 10px; text-decoration: none;">ورود به سامانه ایمیل سازمانی</a>
                        </div>
                      </div>
                      <div style="background-color: #12141c; padding: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #6b7280;">
                        این پیام به صورت سیستمی برای ایمیل پشتیبان شما ارسال شده است • شرکت پرسیس کوارتز
                      </div>
                    </div>
                  </div>
                `,
              })
              .catch((err) => {
                console.error("[Mailbox Hook] Error sending onboarding welcome email:", err);
              });
          } catch (e) {
            console.error("[Mailbox Hook] Welcome email dispatch failure:", e);
          }
        }
      },
    ],
  },
};
