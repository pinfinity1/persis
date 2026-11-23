"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { z } from "zod";
import {
  WebmailService,
  type GetEmailsFilter,
  type SendEmailInput,
} from "@/services/webmail.service";
import {
  verifyPassword,
  createWebmailToken,
  setWebmailSessionCookie,
  clearWebmailSessionCookie,
  getWebmailSession,
} from "@/lib/webmail-auth";

export async function getMailboxesAction() {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "احراز هویت نشده است.", data: [] };
    }

    const mailboxes = await WebmailService.getMailboxes();
    let filtered = mailboxes;
    if (session.role !== "admin") {
      filtered = mailboxes.filter((m) => m.id === session.mailboxId);
    }

    return {
      success: true,
      data: filtered.map((m) => ({
        id: m.id,
        name: m.name,
        address: m.address,
        isCatchAll: m.isCatchAll,
      })),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در دریافت لیست صندوق‌های ایمیل";
    return { success: false, error: msg, data: [] };
  }
}

export async function getEmailsAction(filters: GetEmailsFilter = {}) {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "نشست شما منقضی شده است.", docs: [], totalDocs: 0 };
    }

    const safeFilters = { ...filters };
    if (session.role !== "admin") {
      safeFilters.mailboxId = session.mailboxId;
    }

    const result = await WebmailService.getEmails(safeFilters);
    return {
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در دریافت پیام‌ها";
    return { success: false, error: msg, docs: [], totalDocs: 0 };
  }
}

export async function getEmailDetailAction(id: number) {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "احراز هویت نشده است.", email: null };
    }

    const email = await WebmailService.getEmailById(id);
    if (!email) {
      return { success: false, error: "ایمیل یافت نشد.", email: null };
    }

    if (session.role !== "admin") {
      const mId = typeof email.mailbox === "object" ? email.mailbox.id : email.mailbox;
      if (mId !== session.mailboxId) {
        return { success: false, error: "شما مجوز دسترسی به این پیام را ندارید.", email: null };
      }
    }

    return { success: true, email };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در بارگذاری ایمیل";
    return { success: false, error: msg, email: null };
  }
}

export async function sendEmailAction(input: SendEmailInput) {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "احراز هویت انجام نشده است. لطفاً ابتدا وارد شوید." };
    }

    if (session.role !== "admin" && input.mailboxId !== session.mailboxId) {
      return { success: false, error: "شما تنها مجاز به ارسال ایمیل از صندوق اختصاصی خود هستید." };
    }

    if (!input.mailboxId || !input.to || !input.subject) {
      return { success: false, error: "لطفاً صندوق فرستنده، آدرس گیرنده و موضوع را تکمیل فرمایید." };
    }

    const res = await WebmailService.sendEmail(input);
    revalidatePath("/mail");
    return { ...res };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در ارسال ایمیل";
    return { success: false, error: msg };
  }
}

export async function markAsReadAction(emailId: number) {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "نشست شما منقضی شده است." };
    }
    await WebmailService.markAsRead(emailId);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در ثبت وضعیت خوانده شده";
    return { success: false, error: msg };
  }
}

export async function toggleReadAction(emailId: number, isRead: boolean) {
  try {
    const session = await getWebmailSession();
    if (!session) {
      return { success: false, error: "نشست شما منقضی شده است." };
    }
    await WebmailService.toggleRead(emailId, isRead);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در تغییر وضعیت خوانده شده";
    return { success: false, error: msg };
  }
}

export async function toggleStarAction(emailId: number, isStarred: boolean) {
  try {
    await WebmailService.toggleStar(emailId, isStarred);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در تغییر وضعیت ستاره";
    return { success: false, error: msg };
  }
}

export async function moveToTrashAction(emailId: number) {
  try {
    await WebmailService.moveToTrash(emailId);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در انتقال به زباله‌دان";
    return { success: false, error: msg };
  }
}

export async function restoreEmailAction(emailId: number) {
  try {
    await WebmailService.restoreFromTrash(emailId);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در بازگردانی ایمیل";
    return { success: false, error: msg };
  }
}

export async function deletePermanentlyAction(emailId: number) {
  try {
    await WebmailService.deletePermanently(emailId);
    revalidatePath("/mail");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطا در حذف دائم ایمیل";
    return { success: false, error: msg };
  }
}

const WebmailLoginSchema = z.object({
  address: z.string().email("آدرس ایمیل وارد شده معتبر نیست.").trim().toLowerCase(),
  password: z.string().min(1, "رمز عبور را وارد نمایید."),
});

/**
 * Webmail Login Server Action
 */
export async function webmailLoginAction(input: { address: string; password: string }) {
  try {
    const validated = WebmailLoginSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "اطلاعات ورودی نامعتبر است.",
      };
    }

    const { address, password } = validated.data;
    const payload = await getPayload({ config: configPromise });

    // 1. First, check Mailboxes collection
    const mailboxRes = await payload.find({
      collection: "mailboxes",
      where: {
        address: { equals: address },
        isActive: { equals: true },
      },
      limit: 1,
    });

    if (mailboxRes.docs.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mb: any = mailboxRes.docs[0];
      if (mb.webmailPassword) {
        const isMatch = await verifyPassword(password, mb.webmailPassword);
        if (isMatch) {
          const token = createWebmailToken({
            mailboxId: mb.id,
            address: mb.address,
            name: mb.name,
            role: "mailbox",
          });
          await setWebmailSessionCookie(token);
          revalidatePath("/mail");
          return { success: true };
        }
      }
    }

    // 2. Second, check if Super Admin login via Users collection
    try {
      const userRes = await payload.login({
        collection: "users",
        data: {
          email: address,
          password,
        },
      });

      if (userRes && userRes.user) {
        const token = createWebmailToken({
          mailboxId: 0,
          address: userRes.user.email,
          name: (userRes.user as { name?: string }).name || "مدیر ارشد سیستم",
          role: "admin",
        });
        await setWebmailSessionCookie(token);
        revalidatePath("/mail");
        return { success: true };
      }
    } catch {
      // Admin login failed
    }

    return {
      success: false,
      error: "آدرس ایمیل سازمانی یا رمز عبور وارد شده اشتباه است.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "خطای غیرمنتظره در احراز هویت";
    return { success: false, error: msg };
  }
}

/**
 * Webmail Logout Server Action
 */
export async function webmailLogoutAction() {
  await clearWebmailSessionCookie();
  revalidatePath("/mail");
  return { success: true };
}
