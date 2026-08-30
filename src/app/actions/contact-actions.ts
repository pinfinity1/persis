"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { sendInquiryEmails } from "@/lib/email";
import DOMPurify from "isomorphic-dompurify"; // برای امنیت و پاکسازی تگ‌های مخرب

export type ContactActionResult = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitContactFormAction(
  rawData: ContactFormValues,
): Promise<ContactActionResult> {
  // ۱. اعتبارسنجی تایتپ‌اسکریپت و Zod
  const result = contactFormSchema.safeParse(rawData);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) errors[String(err.path[0])] = err.message;
    });
    return { success: false, errors };
  }

  const validData = result.data;

  // ۲. مپ کردن امن دیتا بر اساس نوع درخواست
  const safePayload: any = {
    type: validData.type,
    status: "new",
    fullName: DOMPurify.sanitize(validData.fullName),
    email: DOMPurify.sanitize(validData.email || ""),
    phone: DOMPurify.sanitize(validData.phone),
    country: DOMPurify.sanitize(validData.country),
    message: DOMPurify.sanitize(validData.message),
  };

  // فقط فیلدهای مجاز هر تایپ ثبت می‌شوند
  if (validData.type === "sample") {
    safePayload.city = DOMPurify.sanitize(validData.city);
    safePayload.postalCode = DOMPurify.sanitize(validData.postalCode);
    safePayload.address = DOMPurify.sanitize(validData.address);
    safePayload.company = DOMPurify.sanitize(validData.company || "");
    safePayload.productCodes = DOMPurify.sanitize(validData.productCodes || "");
  } else if (validData.type === "project") {
    safePayload.company = DOMPurify.sanitize(validData.company);
    safePayload.projectSize = DOMPurify.sanitize(validData.projectSize || "");
    safePayload.productCodes = DOMPurify.sanitize(validData.productCodes || "");
    safePayload.thickness = DOMPurify.sanitize(validData.thickness || "");
    safePayload.finish = DOMPurify.sanitize(validData.finish || "");
  } else if (validData.type === "dealer") {
    safePayload.company = DOMPurify.sanitize(validData.company);
    safePayload.city = DOMPurify.sanitize(validData.city);
  }

  try {
    const payload = await getPayload({ config: configPromise });
    await payload.create({
      collection: "inquiries" as any,
      data: safePayload,
    });

    if (validData.email) {
      try {
        await sendInquiryEmails(validData);
      } catch (mailError) {
        console.error("Email delivery failed, but DB saved:", mailError);
      }
    }

    return { success: true };
  } catch (dbError: any) {
    console.error("Database persistence error:", dbError);
    return { success: false, message: "serverError" };
  }
}
