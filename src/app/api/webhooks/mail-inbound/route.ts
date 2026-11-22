import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import DOMPurify from "isomorphic-dompurify";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { transporter } from "@/lib/email";
import { escape } from "html-escaper";

interface InboundAttachmentPayload {
  filename: string;
  mimeType: string;
  contentBase64: string;
  contentId?: string;
}

interface InboundEmailPayload {
  messageId?: string;
  from: string;
  fromName?: string;
  to: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  subject?: string;
  date?: string;
  text?: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
  attachments?: InboundAttachmentPayload[];
}

/**
 * Extracts a clean email address from a string like "John Doe <john@example.com>"
 */
function extractEmailAddress(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim().toLowerCase();
  }
  return raw.replace(/["']/g, "").trim().toLowerCase();
}

/**
 * Timing-safe HMAC verification
 */
function verifyHmacSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  try {
    const computedHmac = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    const sigBuffer = Buffer.from(signatureHeader, "hex");
    const compBuffer = Buffer.from(computedHmac, "hex");

    if (sigBuffer.length !== compBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, compBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-email-signature");
    const secret = process.env.EMAIL_WEBHOOK_SECRET || "persisquartz-email-webhook-secret-change-in-prod";

    // Verify HMAC signature
    const isValid = verifyHmacSignature(rawBody, signature, secret);
    if (!isValid && process.env.NODE_ENV === "production") {
      console.error("[Mail Webhook] Invalid HMAC signature detected from:", req.headers.get("x-forwarded-for"));
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    const data: InboundEmailPayload = JSON.parse(rawBody);

    if (!data.from || !data.to) {
      return NextResponse.json({ error: "Missing required 'from' or 'to' fields" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Identify Target Mailbox
    const targetRecipient = extractEmailAddress(data.to);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let matchedMailbox: any = null;

    const exactMailbox = await payload.find({
      collection: "mailboxes",
      where: {
        address: { equals: targetRecipient },
        isActive: { equals: true },
      },
      limit: 1,
    });

    if (exactMailbox.docs.length > 0) {
      matchedMailbox = exactMailbox.docs[0];
    } else {
      // Check for Catch-All mailbox
      const catchAllMailbox = await payload.find({
        collection: "mailboxes",
        where: {
          isCatchAll: { equals: true },
          isActive: { equals: true },
        },
        limit: 1,
      });

      if (catchAllMailbox.docs.length > 0) {
        matchedMailbox = catchAllMailbox.docs[0];
      } else {
        // Auto-provision a new mailbox so no customer/client email is lost
        matchedMailbox = await payload.create({
          collection: "mailboxes",
          data: {
            name: targetRecipient.split("@")[0].toUpperCase(),
            address: targetRecipient,
            isActive: true,
            isCatchAll: false,
            description: "صندوق ایمیل ایجاد شده خودکار پس از دریافت پیام",
          },
        });
      }
    }

    // 2. Thread Resolution (RFC 5322 In-Reply-To / References)
    let threadId = data.messageId || `thread_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    if (data.inReplyTo) {
      const parentEmail = await payload.find({
        collection: "emails",
        where: {
          messageId: { equals: data.inReplyTo },
        },
        limit: 1,
      });
      if (parentEmail.docs.length > 0 && parentEmail.docs[0].threadId) {
        threadId = parentEmail.docs[0].threadId;
      }
    }

    // 3. Process & Upload Attachments to S3 / MinIO
    const attachmentDocIds: number[] = [];
    if (Array.isArray(data.attachments) && data.attachments.length > 0) {
      for (const att of data.attachments) {
        try {
          if (!att.contentBase64) continue;
          const fileBuffer = Buffer.from(att.contentBase64, "base64");
          const safeName = (att.filename || "attachment")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9.-]/g, "");

          const attachmentDoc = await payload.create({
            collection: "email-attachments",
            data: {
              originalName: att.filename,
              contentId: att.contentId || undefined,
            },
            file: {
              data: fileBuffer,
              name: safeName,
              mimetype: att.mimeType || "application/octet-stream",
              size: fileBuffer.length,
            },
          });
          attachmentDocIds.push(attachmentDoc.id);
        } catch (attErr) {
          console.error("[Mail Webhook] Error uploading attachment:", att.filename, attErr);
        }
      }
    }

    // 4. Sanitize HTML (DOMPurify protection against XSS)
    let sanitizedHtml: string | undefined = undefined;
    if (data.html) {
      sanitizedHtml = DOMPurify.sanitize(data.html, {
        FORBID_TAGS: ["script", "iframe", "object", "embed", "applet", "base"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
        ALLOW_DATA_ATTR: false,
      });
    }

    // 5. Store Email Document in Database
    const emailRecord = await payload.create({
      collection: "emails",
      data: {
        mailbox: matchedMailbox.id,
        direction: "inbound",
        status: "delivered",
        subject: data.subject || "(بدون موضوع)",
        from: data.from,
        fromName: data.fromName || undefined,
        to: data.to,
        cc: data.cc || undefined,
        bcc: data.bcc || undefined,
        replyTo: data.replyTo || undefined,
        bodyText: data.text || "",
        bodyHtml: sanitizedHtml || undefined,
        messageId: data.messageId || `<${Date.now()}.${crypto.randomBytes(6).toString("hex")}@persisquartz.com>`,
        inReplyTo: data.inReplyTo || undefined,
        threadId,
        isRead: false,
        isStarred: false,
        isArchived: false,
        isTrash: false,
        attachments: attachmentDocIds.length > 0 ? attachmentDocIds : undefined,
        sentAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      },
    });

    // 6. Forwarding Notification to Personal Email (if configured)
    if (matchedMailbox.forwardTo) {
      try {
        const personalEmail = matchedMailbox.forwardTo.trim();
        const safeSubject = escape(data.subject || "(بدون موضوع)");
        const safeSnippet = escape((data.text || "").slice(0, 350));

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Persis Quartz Mail" <info@persisquartz.com>`,
          to: personalEmail,
          subject: `[نوتیفیکیشن پیام جدید] ${safeSubject}`,
          html: `
            <div style="font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; background-color: #f7f7f7; padding: 20px;">
              <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 24px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #9b0737; margin-top: 0; font-size: 18px;">پیام جدید در صندوق ${matchedMailbox.address}</h3>
                <p style="font-size: 13px; color: #555; margin: 8px 0;"><strong>فرستنده:</strong> ${escape(data.from)}</p>
                <p style="font-size: 13px; color: #555; margin: 8px 0;"><strong>موضوع:</strong> ${safeSubject}</p>
                <div style="margin: 16px 0; padding: 14px; background: #fafafa; border: 1px solid #eeeeee; font-size: 13px; line-height: 1.6; color: #333; border-radius: 4px;">
                  ${safeSnippet}${data.text && data.text.length > 350 ? "..." : ""}
                </div>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="https://mail.persisquartz.com" style="background-color: #9b0737; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">ورود به وب‌میل و پاسخ به پیام</a>
                </div>
              </div>
            </div>
          `,
        });
      } catch (fwdErr) {
        console.error("[Mail Webhook] Forward notification error:", fwdErr);
      }
    }

    // 7. Auto-Reply to Sender (if configured on Mailbox or Global EmailSettings)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let emailSettings: any = null;
      try {
        emailSettings = await payload.findGlobal({ slug: "email-settings" });
      } catch {
        // fallback
      }

      const isAutoReplyActive = Boolean(matchedMailbox.enableAutoReply || emailSettings?.enableInboundAutoReply);
      const cleanSender = extractEmailAddress(data.from);

      // Prevent loops: don't auto-reply to no-reply, mailer-daemon, or internal domain
      const isLoop =
        cleanSender.includes("noreply") ||
        cleanSender.includes("mailer-daemon") ||
        cleanSender.includes("persisquartz.com");

      if (isAutoReplyActive && !isLoop && cleanSender) {
        const replySubject =
          matchedMailbox.autoReplySubject ||
          emailSettings?.inboundReplySubject ||
          "ایمیل شما دریافت شد | شرکت پرسیس کوارتز";

        const replyBodyText = (
          matchedMailbox.autoReplyBody ||
          emailSettings?.inboundReplyMessage ||
          "با سلام و احترام،\nپیام شما دریافت شد و در دست بررسی قرار گرفت."
        ).replace(/\n/g, "<br />");

        await transporter.sendMail({
          from: `"${matchedMailbox.name}" <${matchedMailbox.address}>`,
          to: cleanSender,
          subject: replySubject,
          html: `
            <div style="font-family: Arial, Tahoma, sans-serif; direction: rtl; text-align: right; background-color: #f7f7f7; padding: 24px; color: #222;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-top: 4px solid #9b0737; padding: 28px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #9b0737; margin-top: 0; font-size: 18px;">شرکت پرسیس کوارتز</h3>
                <div style="font-size: 14px; line-height: 1.8; color: #333;">
                  ${replyBodyText}
                </div>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;" />
                <p style="font-size: 12px; color: #888;">
                  این یک پیام خودکار جهت تایید دریافت ایمیل شماست. کارشناسان ما به زودی پاسخگوی شما خواهند بود.
                </p>
              </div>
            </div>
          `,
        });
      }
    } catch (autoReplyErr) {
      console.error("[Mail Webhook] Auto-reply error:", autoReplyErr);
    }

    return NextResponse.json({
      success: true,
      emailId: emailRecord.id,
      threadId: emailRecord.threadId,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[Mail Webhook] Ingestion failed:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
