import nodemailer from "nodemailer";
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

  // استخراج امن فیلدهای اختصاصی بر اساس نوع درخواست (Type Guarding)
  let extraDetailsHtml = "";

  if (data.type === "sample") {
    extraDetailsHtml = `
      ${data.company ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شرکت / دفتر:</td><td style="padding: 8px 0; font-weight: bold;">${data.company}</td></tr>` : ""}
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شهر:</td><td style="padding: 8px 0; font-weight: bold;">${data.city}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کد پستی:</td><td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${data.postalCode}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">آدرس پستی:</td><td style="padding: 8px 0; font-weight: bold;">${data.address}</td></tr>
      ${data.productCodes ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کدهای درخواستی:</td><td style="padding: 8px 0; font-weight: bold;">${data.productCodes}</td></tr>` : ""}
    `;
  } else if (data.type === "project") {
    extraDetailsHtml = `
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شرکت معماری / کارفرما:</td><td style="padding: 8px 0; font-weight: bold;">${data.company}</td></tr>
      ${data.projectSize ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">متراژ حدودی:</td><td style="padding: 8px 0; font-weight: bold;">${data.projectSize}</td></tr>` : ""}
      ${data.productCodes ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">کدهای مدنظر:</td><td style="padding: 8px 0; font-weight: bold;">${data.productCodes}</td></tr>` : ""}
      ${data.thickness ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">ضخامت:</td><td style="padding: 8px 0; font-weight: bold;">${data.thickness}</td></tr>` : ""}
      ${data.finish ? `<tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">فینیش:</td><td style="padding: 8px 0; font-weight: bold;">${data.finish}</td></tr>` : ""}
    `;
  } else if (data.type === "dealer") {
    extraDetailsHtml = `
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">نام مجموعه / فروشگاه:</td><td style="padding: 8px 0; font-weight: bold;">${data.company}</td></tr>
      <tr style="border-bottom: 1px solid #eeeeee;"><td style="padding: 8px 0; color: #666;">شهر و استان مورد تقاضا:</td><td style="padding: 8px 0; font-weight: bold;">${data.city}</td></tr>
    `;
  }

  const internalHtml = `
    <div style="font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; background-color: #f7f7f7; padding: 24px; color: #1e1e1e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="color: #9b0737; margin-top: 0; font-size: 20px;">${TYPE_TITLE_MAP[data.type]}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">نام و نام خانوادگی:</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.fullName}</td>
          </tr>
          ${
            data.email
              ? `
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">پست الکترونیک:</td>
            <td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${data.email}</td>
          </tr>`
              : ""
          }
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">شماره تماس:</td>
            <td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${data.phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 8px 0; color: #666;">کشور:</td>
            <td style="padding: 8px 0; font-weight: bold;">${data.country}</td>
          </tr>
          ${extraDetailsHtml}
        </table>
        <div style="margin-top: 20px; padding: 16px; background-color: #fcfcfc; border: 1px solid #eeeeee;">
          <strong style="display: block; margin-bottom: 8px; color: #444;">متن پیام / شرح نیاز:</strong>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, Tahoma, sans-serif; background-color: #f7f7f7; padding: 24px; color: #1e1e1e;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px;">
        <h2 style="color: #9b0737; margin-top: 0;">Persis Quartz</h2>
        <p>Dear ${data.fullName},</p>
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
      subject: `[Persis Portal] ${TYPE_TITLE_MAP[data.type]} - ${data.fullName}`,
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
