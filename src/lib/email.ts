// src/lib/email.ts
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { escape } from "html-escaper";
import type { ContactFormValues } from "@/lib/validations/contact";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

// Sanitizer to eliminate SMTP Header Injection (strips carriage returns & line feeds)
function sanitizeHeader(val: string): string {
  return val.replace(/[\r\n\t]/g, " ").trim();
}

// Singleton transporter configured with robust connection pooling
export const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const TYPE_TITLE_MAP: Record<ContactFormValues["type"], string> = {
  sample: "درخواست سمپل باکس و نمونه اسلب",
  project: "استعلام پروژه و تامین متریال",
  dealer: "تقاضای اخذ عاملیت و نمایندگی",
  general: "تماس عمومی و پشتیبانی",
};

export interface EmailDispatchResult {
  internalSent: boolean;
  customerSent: boolean;
  errors: string[];
}

export async function sendInquiryEmails(
  data: ContactFormValues,
): Promise<EmailDispatchResult> {
  const result: EmailDispatchResult = {
    internalSent: false,
    customerSent: false,
    errors: [],
  };

  // 1. Fetch dynamic Email Settings from Payload CMS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let emailSettings: any = null;
  try {
    const payload = await getPayload({ config: configPromise });
    emailSettings = await payload.findGlobal({ slug: "email-settings" });
  } catch (err) {
    console.warn("[sendInquiryEmails] Could not load email-settings global:", err);
  }

  const fromEmail =
    process.env.SMTP_FROM || `"Persis Quartz" <info@persisquartz.com>`;

  let departmentEmail = process.env.EMAIL_SALES || "sales@persisquartz.com";
  if (data.type === "dealer") {
    departmentEmail =
      process.env.EMAIL_MANAGEMENT || "management@persisquartz.com";
  } else if (data.type === "general") {
    departmentEmail = process.env.EMAIL_SUPPORT || "info@persisquartz.com";
  }

  const managementRecipients = [
    departmentEmail,
    process.env.EMAIL_ADMIN || "admin@persisquartz.com",
  ];

  if (emailSettings?.adminNotificationEmails) {
    const customRecipients = String(emailSettings.adminNotificationEmails)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    managementRecipients.push(...customRecipients);
  }

  const uniqueManagementRecipients = Array.from(new Set(managementRecipients.filter(Boolean)));

  // Deep sanitization against XSS in clients and Header Injection
  const safeFullName = escape(data.fullName || "");
  const safeHeaderName = sanitizeHeader(data.fullName || "");
  const safeEmail = data.email ? sanitizeHeader(data.email) : "";
  const safePhone = escape(data.phone || "");
  const safeCountry = escape(data.country || "");
  const safeMessage = escape(data.message || "");

  let extraDetailsHtml = "";

  if (data.type === "sample") {
    const safeCompany = data.company ? escape(data.company) : "";
    const safeCity = escape(data.city || "");
    const safePostal = escape(data.postalCode || "");
    const safeAddress = escape(data.address || "");
    const safeProductCodes = data.productCodes ? escape(data.productCodes) : "";

    extraDetailsHtml = `
      ${safeCompany ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شرکت / دفتر:</td><td style="padding: 8px 0; font-weight: bold;">${safeCompany}</td></tr>` : ""}
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شهر:</td><td style="padding: 8px 0; font-weight: bold;">${safeCity}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کد پستی:</td><td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${safePostal}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">آدرس پستی:</td><td style="padding: 8px 0; font-weight: bold;">${safeAddress}</td></tr>
      ${safeProductCodes ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کدهای درخواستی:</td><td style="padding: 8px 0; font-weight: bold;">${safeProductCodes}</td></tr>` : ""}
    `;
  } else if (data.type === "project") {
    const safeCompany = escape(data.company || "");
    const safeSize = data.projectSize ? escape(data.projectSize) : "";
    const safeProductCodes = data.productCodes ? escape(data.productCodes) : "";
    const safeThickness = data.thickness ? escape(data.thickness) : "";
    const safeFinish = data.finish ? escape(data.finish) : "";

    extraDetailsHtml = `
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شرکت معماری / کارفرما:</td><td style="padding: 8px 0; font-weight: bold;">${safeCompany}</td></tr>
      ${safeSize ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">متراژ حدودی:</td><td style="padding: 8px 0; font-weight: bold;">${safeSize}</td></tr>` : ""}
      ${safeProductCodes ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کدهای مدنظر:</td><td style="padding: 8px 0; font-weight: bold;">${safeProductCodes}</td></tr>` : ""}
      ${safeThickness ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">ضخامت:</td><td style="padding: 8px 0; font-weight: bold;">${safeThickness}</td></tr>` : ""}
      ${safeFinish ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">فینیش:</td><td style="padding: 8px 0; font-weight: bold;">${safeFinish}</td></tr>` : ""}
    `;
  } else if (data.type === "dealer") {
    const safeCompany = escape(data.company || "");
    const safeCity = escape(data.city || "");

    extraDetailsHtml = `
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">نام مجموعه / فروشگاه:</td><td style="padding: 8px 0; font-weight: bold;">${safeCompany}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شهر و استان مورد تقاضا:</td><td style="padding: 8px 0; font-weight: bold;">${safeCity}</td></tr>
    `;
  }

  const internalHtml = `
    <div style="font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; background-color: #f7f7f7; padding: 24px; color: #1e1e1e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-radius: 4px;">
        <h2 style="color: #9b0737; margin-top: 0; font-size: 20px;">${TYPE_TITLE_MAP[data.type]}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">نام و نام خانوادگی:</td>
            <td style="padding: 8px 0; font-weight: bold;">${safeFullName}</td>
          </tr>
          ${
            safeEmail
              ? `
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">پست الکترونیک:</td>
            <td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${safeEmail}</td>
          </tr>`
              : ""
          }
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">شماره تماس:</td>
            <td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${safePhone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">کشور:</td>
            <td style="padding: 8px 0; font-weight: bold;">${safeCountry}</td>
          </tr>
          ${extraDetailsHtml}
        </table>
        <div style="margin-top: 20px; padding: 16px; background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 4px;">
          <strong style="display: block; margin-bottom: 8px; color: #444;">متن پیام / شرح نیاز:</strong>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    </div>
  `;

  // 2. Dynamic Customer Response Template (from CMS or Fallback)
  const shouldSendCustomer = emailSettings ? emailSettings.enableContactAutoReply !== false : true;
  const customerSubject = (
    emailSettings?.contactReplySubject || "پیام شما در پرسیس کوارتز دریافت شد"
  ).replace("{name}", safeFullName);

  const customerHeading =
    emailSettings?.contactReplyHeading || "درخواست شما با موفقیت ثبت شد";

  const customerBodyText = (
    emailSettings?.contactReplyMessage ||
    "با سپاس از ارتباط شما با شرکت پرسیس کوارتز. درخواست شما با موفقیت ثبت شد و کارشناسان ما به زودی با شما تماس خواهند گرفت."
  )
    .replace("{name}", safeFullName)
    .replace(/\n/g, "<br />");

  const customerFooterText = (
    emailSettings?.contactReplyFooter ||
    "پرسیس کوارتز • تولیدکننده سطوح مهندسی‌شده سنگ کوارتز\nتلفن: ۰۳۸-۳۲۲۸۱۷۵۲ | وب‌سایت: persisquartz.com"
  ).replace(/\n/g, "<br />");

  const customerHtml = `
    <div style="font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; background-color: #f7f7f7; padding: 24px; color: #1e1e1e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-radius: 4px;">
        <h2 style="color: #9b0737; margin-top: 0; font-size: 20px;">${customerHeading}</h2>
        <p style="font-size: 15px; font-weight: bold; color: #333;">جناب آقای / سرکار خانم ${safeFullName} گرامی،</p>
        <p style="font-size: 14px; line-height: 1.8; color: #444;">${customerBodyText}</p>
        <div style="margin: 20px 0; padding: 12px 16px; background-color: #fafafa; border-right: 3px solid #9b0737; font-size: 13px; color: #555;">
          <strong>موضوع ثبت‌شده:</strong> ${TYPE_TITLE_MAP[data.type]}
        </div>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #777; line-height: 1.6;">
          ${customerFooterText}
        </p>
      </div>
    </div>
  `;

  // Dispatch internal alert
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: uniqueManagementRecipients,
      replyTo: safeEmail || undefined,
      subject: `[Persis Portal] ${TYPE_TITLE_MAP[data.type]} - ${safeHeaderName}`,
      html: internalHtml,
    });
    result.internalSent = true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    result.errors.push(`Internal notification error: ${errorMsg}`);
  }

  // Dispatch customer acknowledgement if enabled and email provided
  if (safeEmail && shouldSendCustomer) {
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: safeEmail,
        subject: customerSubject,
        html: customerHtml,
      });
      result.customerSent = true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      result.errors.push(`Customer acknowledgment error: ${errorMsg}`);
    }
  }

  return result;
}
