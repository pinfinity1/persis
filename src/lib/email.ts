import nodemailer from "nodemailer";
import { escape } from "html-escaper";
import type { ContactFormValues } from "@/lib/validations/contact";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
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

export async function sendInquiryEmails(data: ContactFormValues) {
  const fromEmail =
    process.env.SMTP_FROM || `"Persis Quartz" <noreply@persisquartz.com>`;

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
  ].filter(Boolean);

  // Escaping all dynamic inputs to prevent Stored XSS in email clients
  const safeFullName = escape(data.fullName || "");
  const safeEmail = escape(data.email || "");
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
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
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
        <div style="margin-top: 20px; padding: 16px; background-color: #fcfcfc; border: 1px solid #eeeeee;">
          <strong style="display: block; margin-bottom: 8px; color: #444;">متن پیام / شرح نیاز:</strong>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, Tahoma, sans-serif; background-color: #f7f7f7; padding: 24px; color: #1e1e1e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px;">
        <h2 style="color: #9b0737; margin-top: 0;">Persis Quartz</h2>
        <p>Dear ${safeFullName},</p>
        <p>Thank you for reaching out to us regarding <strong>${TYPE_TITLE_MAP[data.type]}</strong>.</p>
        <p>We have successfully received your message. Our technical and sales representatives are reviewing your requirements and will contact you shortly.</p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #777;">
          Persis Quartz • Engineered Stone Surfaces<br />
          Industrial Zone 3, Shahrekord, Iran<br />
          Tel: +98 38 3228 1752 | Web: persisquartz.com
        </p>
      </div>
    </div>
  `;

  const sendPromises: Promise<any>[] = [
    transporter.sendMail({
      from: fromEmail,
      to: managementRecipients,
      subject: `[Persis Portal] ${TYPE_TITLE_MAP[data.type]} - ${safeFullName}`,
      html: internalHtml,
    }),
  ];

  if (data.email) {
    sendPromises.push(
      transporter.sendMail({
        from: fromEmail,
        to: data.email,
        subject: "We received your inquiry | Persis Quartz",
        html: customerHtml,
      }),
    );
  }

  await Promise.allSettled(sendPromises);
}
