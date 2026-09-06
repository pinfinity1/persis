"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { sendInquiryEmails } from "@/lib/email";
import xss from "xss";

export type ContactActionResult = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

// Strips all HTML tags safely without spinning up a heavy JSDOM instance
function sanitizeInput(val: string | undefined): string {
  if (!val) return "";
  return xss(val, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  }).trim();
}

export async function submitContactFormAction(
  rawData: unknown,
): Promise<ContactActionResult> {
  const result = contactFormSchema.safeParse(rawData);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) errors[String(err.path[0])] = err.message;
    });
    return { success: false, errors };
  }

  const validData = result.data;

  const basePayload = {
    type: validData.type,
    status: "new" as const,
    fullName: sanitizeInput(validData.fullName),
    email: validData.email ? sanitizeInput(validData.email) : "",
    phone: sanitizeInput(validData.phone),
    country: sanitizeInput(validData.country),
    message: sanitizeInput(validData.message),
  };

  let specificPayload = {};

  switch (validData.type) {
    case "sample":
      specificPayload = {
        city: sanitizeInput(validData.city),
        postalCode: sanitizeInput(validData.postalCode),
        address: sanitizeInput(validData.address),
        company: validData.company ? sanitizeInput(validData.company) : "",
        productCodes: validData.productCodes
          ? sanitizeInput(validData.productCodes)
          : "",
      };
      break;
    case "project":
      specificPayload = {
        company: sanitizeInput(validData.company),
        projectSize: validData.projectSize
          ? sanitizeInput(validData.projectSize)
          : "",
        productCodes: validData.productCodes
          ? sanitizeInput(validData.productCodes)
          : "",
        thickness: validData.thickness
          ? sanitizeInput(validData.thickness)
          : "",
        finish: validData.finish ? sanitizeInput(validData.finish) : "",
      };
      break;
    case "dealer":
      specificPayload = {
        company: sanitizeInput(validData.company),
        city: sanitizeInput(validData.city),
      };
      break;
  }

  const finalPayload = { ...basePayload, ...specificPayload };

  try {
    const payload = await getPayload({ config: configPromise });
    await payload.create({
      collection: "inquiries",
      data: finalPayload as any,
    });

    if (validData.email) {
      sendInquiryEmails(validData).catch((mailError) => {
        console.error("[EMAIL_ERROR] Failed to send email:", mailError);
      });
    }

    return { success: true };
  } catch (dbError: unknown) {
    console.error("[DB_ERROR] Failed to persist inquiry:", dbError);
    return { success: false, message: "serverError" };
  }
}
