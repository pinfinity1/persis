// src/app/mail/page.tsx
import React from "react";
import { WebmailService } from "@/services/webmail.service";
import WebmailClient, {
  type MailboxItem,
  type EmailItem,
} from "@/components/webmail/webmail-client";
import WebmailLoginForm from "@/components/webmail/webmail-login-form";
import { getWebmailSession, hashPassword } from "@/lib/webmail-auth";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export const dynamic = "force-dynamic";

export default async function MailPage() {
  // 1. Check Session Auth Gate
  const session = await getWebmailSession();
  if (!session) {
    return <WebmailLoginForm />;
  }

  const payload = await getPayload({ config: configPromise });

  // 2. Fetch Mailboxes
  let mailboxesDocs = await WebmailService.getMailboxes();

  // If no mailboxes exist yet, auto-seed standard enterprise mailboxes
  if (mailboxesDocs.length === 0) {
    const defaultBoxes = [
      { name: "مدیریت ارشد (CEO)", address: "ceo@persisquartz.com", isCatchAll: false },
      { name: "احسان سامانی", address: "ehsan@persisquartz.com", isCatchAll: false },
      { name: "فروش و بازرگانی", address: "sales@persisquartz.com", isCatchAll: false },
      { name: "پشتیبانی و اطلاعات عمومی", address: "info@persisquartz.com", isCatchAll: true },
    ];

    const defaultHashedPassword = await hashPassword("Persis2026!");

    for (const b of defaultBoxes) {
      await payload.create({
        collection: "mailboxes",
        context: { skipWelcomeEmail: true },
        data: {
          name: b.name,
          address: b.address,
          isActive: true,
          isCatchAll: b.isCatchAll,
          webmailPassword: defaultHashedPassword,
          description: "صندوق ایمیل پیش‌فرض سازمانی",
        },
      });
    }

    mailboxesDocs = await WebmailService.getMailboxes();
  } else {
    // If any existing mailbox lacks a webmailPassword, initialize with default password
    for (const mb of mailboxesDocs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(mb as any).webmailPassword) {
        const defaultHashedPassword = await hashPassword("Persis2026!");
        await payload.update({
          collection: "mailboxes",
          id: mb.id,
          context: { skipWelcomeEmail: true },
          data: {
            webmailPassword: defaultHashedPassword,
          },
        });
      }
    }
  }

  // Filter mailboxes based on session role (Multi-tenant mailbox isolation)
  let allowedMailboxes = mailboxesDocs;
  if (session.role !== "admin") {
    allowedMailboxes = mailboxesDocs.filter((m) => m.id === session.mailboxId);
  }

  // 3. Fetch Initial Emails scoped to role
  const emailsResult = await WebmailService.getEmails({
    mailboxId: session.role !== "admin" ? session.mailboxId : undefined,
    folder: "inbox",
    limit: 50,
  });

  const mailboxes: MailboxItem[] = allowedMailboxes.map((m) => ({
    id: m.id,
    name: m.name,
    address: m.address,
    isCatchAll: m.isCatchAll,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emails: EmailItem[] = (emailsResult.docs as any[]) || [];

  return (
    <WebmailClient
      initialMailboxes={mailboxes}
      initialEmails={emails}
      session={session}
    />
  );
}
