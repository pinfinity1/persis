// src/services/webmail.service.ts
import { getPayload, type Where } from "payload";
import configPromise from "@/payload.config";
import nodemailer, { type Transporter } from "nodemailer";
import crypto from "crypto";

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export interface SendEmailInput {
  mailboxId: number;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  replyToEmailId?: number;
}

export interface GetEmailsFilter {
  mailboxId?: number;
  folder?: "inbox" | "sent" | "starred" | "trash" | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export class WebmailService {
  /**
   * Fetch all active mailboxes
   */
  static async getMailboxes() {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "mailboxes",
      where: {
        isActive: { equals: true },
      },
      sort: "address",
      limit: 100,
    });
    return result.docs;
  }

  /**
   * Fetch emails with filtering, pagination and folder support
   */
  static async getEmails(filters: GetEmailsFilter = {}) {
    const payload = await getPayload({ config: configPromise });
    const { mailboxId, folder = "inbox", search, page = 1, limit = 25 } = filters;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions: any[] = [];

    // Mailbox scoping
    if (mailboxId) {
      andConditions.push({ mailbox: { equals: mailboxId } });
    }

    // Folder filtering
    if (folder === "inbox") {
      andConditions.push(
        { direction: { equals: "inbound" } },
        { isTrash: { not_equals: true } },
        { isArchived: { not_equals: true } }
      );
    } else if (folder === "sent") {
      andConditions.push(
        { direction: { equals: "outbound" } },
        { isTrash: { not_equals: true } }
      );
    } else if (folder === "starred") {
      andConditions.push(
        { isStarred: { equals: true } },
        { isTrash: { not_equals: true } }
      );
    } else if (folder === "trash") {
      andConditions.push({ isTrash: { equals: true } });
    }

    // Text Search
    if (search && search.trim()) {
      const q = search.trim();
      andConditions.push({
        or: [
          { subject: { contains: q } },
          { from: { contains: q } },
          { to: { contains: q } },
          { bodyText: { contains: q } },
        ],
      });
    }

    const where: Where = andConditions.length > 0 ? { and: andConditions } : {};

    const result = await payload.find({
      collection: "emails",
      where,
      sort: "-sentAt",
      page,
      limit,
      depth: 2,
    });

    return result;
  }

  /**
   * Get email details and mark as read
   */
  static async getEmailById(id: number) {
    const payload = await getPayload({ config: configPromise });
    const email = await payload.findByID({
      collection: "emails",
      id,
      depth: 2,
    });

    if (email && !email.isRead) {
      await payload.update({
        collection: "emails",
        id,
        data: { isRead: true },
      });
      email.isRead = true;
    }

    return email;
  }

  /**
   * Outbound Email Dispatcher with RFC 5322 compliance
   */
  static async sendEmail(input: SendEmailInput) {
    const payload = await getPayload({ config: configPromise });

    // 1. Validate Mailbox
    const mailbox = await payload.findByID({
      collection: "mailboxes",
      id: input.mailboxId,
    });

    if (!mailbox || !mailbox.isActive) {
      throw new Error("صندوق ایمیل انتخاب شده معتبر یا فعال نیست.");
    }

    // 2. Thread & Reference resolution if replying
    let inReplyTo: string | undefined = undefined;
    let references: string | undefined = undefined;
    let threadId = `thread_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    if (input.replyToEmailId) {
      try {
        const parent = await payload.findByID({
          collection: "emails",
          id: input.replyToEmailId,
        });
        if (parent) {
          inReplyTo = parent.messageId || undefined;
          references = parent.inReplyTo
            ? `${parent.inReplyTo} ${parent.messageId}`
            : parent.messageId || undefined;
          if (parent.threadId) {
            threadId = parent.threadId;
          }
        }
      } catch (err) {
        console.warn("[WebmailService] Could not resolve parent email references:", err);
      }
    }

    const generatedMessageId = `<${Date.now()}.${crypto.randomBytes(8).toString("hex")}@persisquartz.com>`;

    // 3. Create Draft/Pending record
    const emailDoc = await payload.create({
      collection: "emails",
      data: {
        mailbox: mailbox.id,
        direction: "outbound",
        status: "pending",
        subject: input.subject || "(بدون موضوع)",
        from: `"${mailbox.name}" <${mailbox.address}>`,
        fromName: mailbox.name,
        to: input.to,
        cc: input.cc || undefined,
        bcc: input.bcc || undefined,
        bodyText: input.bodyText || "",
        bodyHtml: input.bodyHtml || `<p style="font-family: sans-serif; white-space: pre-wrap;">${input.bodyText || ""}</p>`,
        messageId: generatedMessageId,
        inReplyTo,
        threadId,
        isRead: true,
        isTrash: false,
        isStarred: false,
        isArchived: false,
        sentAt: new Date().toISOString(),
      },
    });

    // 4. Async Dispatch via SMTP
    try {
      await transporter.sendMail({
        from: `"${mailbox.name}" <${mailbox.address}>`,
        to: input.to,
        cc: input.cc || undefined,
        bcc: input.bcc || undefined,
        replyTo: mailbox.address,
        subject: input.subject,
        text: input.bodyText || "",
        html: input.bodyHtml || input.bodyText || "",
        headers: {
          "Message-ID": generatedMessageId,
          ...(inReplyTo ? { "In-Reply-To": inReplyTo } : {}),
          ...(references ? { References: references } : {}),
        },
      });

      await payload.update({
        collection: "emails",
        id: emailDoc.id,
        data: { status: "sent" },
      });

      return { success: true, emailId: emailDoc.id, threadId };
    } catch (sendErr: unknown) {
      const errMessage = sendErr instanceof Error ? sendErr.message : "SMTP transport failure";
      console.error("[WebmailService] Outbound SMTP error:", errMessage);

      await payload.update({
        collection: "emails",
        id: emailDoc.id,
        data: {
          status: "failed",
          errorMessage: errMessage,
        },
      });

      throw new Error(`خطا در ارسال ایمیل: ${errMessage}`);
    }
  }

  /**
   * Toggle star status
   */
  static async toggleStar(emailId: number, isStarred: boolean) {
    const payload = await getPayload({ config: configPromise });
    return payload.update({
      collection: "emails",
      id: emailId,
      data: { isStarred },
    });
  }

  /**
   * Move email to trash
   */
  static async moveToTrash(emailId: number) {
    const payload = await getPayload({ config: configPromise });
    return payload.update({
      collection: "emails",
      id: emailId,
      data: { isTrash: true },
    });
  }

  /**
   * Restore email from trash
   */
  static async restoreFromTrash(emailId: number) {
    const payload = await getPayload({ config: configPromise });
    return payload.update({
      collection: "emails",
      id: emailId,
      data: { isTrash: false },
    });
  }

  /**
   * Permanently delete email
   */
  static async deletePermanently(emailId: number) {
    const payload = await getPayload({ config: configPromise });
    return payload.delete({
      collection: "emails",
      id: emailId,
    });
  }
}
