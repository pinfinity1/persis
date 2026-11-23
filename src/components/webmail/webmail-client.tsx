// src/components/webmail/webmail-client.tsx
"use client";

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Inbox,
  Send,
  Star,
  Trash2,
  Mail,
  Search,
  Plus,
  RefreshCw,
  Reply,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  sendEmailAction,
  toggleStarAction,
  moveToTrashAction,
  restoreEmailAction,
  deletePermanentlyAction,
  getEmailsAction,
  webmailLogoutAction,
} from "@/app/actions/mail-actions";
import type { WebmailSessionPayload } from "@/lib/webmail-auth";
import {
  parseAndCleanMime,
  isRawMimeMultipart,
  stripMimeHeadersAndDelimiters,
  extractCleanSnippet,
} from "@/lib/mime-parser";

export interface MailboxItem {
  id: number;
  name: string;
  address: string;
  isCatchAll?: boolean | null;
}

export interface AttachmentItem {
  id: number;
  originalName?: string | null;
  filename?: string | null;
  filesize?: number | null;
  mimeType?: string | null;
  url?: string | null;
}

export interface EmailItem {
  id: number;
  mailbox: number | MailboxItem;
  direction: "inbound" | "outbound";
  status: "delivered" | "sent" | "pending" | "failed" | "draft";
  subject: string;
  from: string;
  fromName?: string | null;
  to: string;
  cc?: string | null;
  bodyText?: string | null;
  bodyHtml?: string | null;
  messageId?: string | null;
  threadId?: string | null;
  isRead?: boolean | null;
  isStarred?: boolean | null;
  isTrash?: boolean | null;
  sentAt?: string | null;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments?: any;
}

interface WebmailClientProps {
  initialMailboxes: MailboxItem[];
  initialEmails: EmailItem[];
  session: WebmailSessionPayload;
}

export default function WebmailClient({
  initialMailboxes,
  initialEmails,
  session,
}: WebmailClientProps) {
  const [mailboxes] = useState<MailboxItem[]>(initialMailboxes);
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [selectedMailboxId, setSelectedMailboxId] = useState<number | null>(
    session.role !== "admin" ? session.mailboxId : null
  );
  const [currentFolder, setCurrentFolder] = useState<"inbox" | "sent" | "starred" | "trash">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(
    initialEmails.length > 0 ? initialEmails[0].id : null
  );

  const [isPending, startTransition] = useTransition();

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeFromId, setComposeFromId] = useState<number>(
    mailboxes.length > 0 ? mailboxes[0].id : 1
  );
  const [composeTo, setComposeTo] = useState("");
  const [composeCc, setComposeCc] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | undefined>(undefined);
  const [composeStatus, setComposeStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  // Filter Emails
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      // 1. Mailbox Filter
      if (selectedMailboxId !== null) {
        const itemMbId =
          typeof item.mailbox === "object" ? item.mailbox.id : item.mailbox;
        if (itemMbId !== selectedMailboxId) return false;
      }

      // 2. Folder Filter
      if (currentFolder === "inbox") {
        if (item.direction !== "inbound" || item.isTrash) return false;
      } else if (currentFolder === "sent") {
        if (item.direction !== "outbound" || item.isTrash) return false;
      } else if (currentFolder === "starred") {
        if (!item.isStarred || item.isTrash) return false;
      } else if (currentFolder === "trash") {
        if (!item.isTrash) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const cleanSnippet = extractCleanSnippet(item.bodyText || item.bodyHtml, 300).toLowerCase();
        const matchSubject = item.subject?.toLowerCase().includes(query);
        const matchFrom = item.from?.toLowerCase().includes(query);
        const matchTo = item.to?.toLowerCase().includes(query);
        const matchBody = cleanSnippet.includes(query);
        if (!matchSubject && !matchFrom && !matchTo && !matchBody) return false;
      }

      return true;
    });
  }, [emails, selectedMailboxId, currentFolder, searchQuery]);

  // Selected Email
  const selectedEmail = useMemo(() => {
    return emails.find((e) => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  // Parsed and Cleaned Content for Reader Pane
  const resolvedContent = useMemo(() => {
    if (!selectedEmail) return { html: null, text: "" };

    // 1. If clean HTML exists, use it
    if (selectedEmail.bodyHtml && selectedEmail.bodyHtml.trim()) {
      return { html: selectedEmail.bodyHtml, text: "" };
    }

    // 2. If bodyText contains raw MIME boundaries, unpack dynamically
    const rawText = selectedEmail.bodyText || "";
    if (isRawMimeMultipart(rawText)) {
      const parsed = parseAndCleanMime(rawText);
      if (parsed.html) {
        return { html: parsed.html, text: "" };
      }
      return { html: null, text: parsed.text };
    }

    // 3. Normal clean text
    return {
      html: null,
      text: stripMimeHeadersAndDelimiters(rawText),
    };
  }, [selectedEmail]);

  // Refresh Emails from Server
  const handleRefresh = (
    targetFolder: "inbox" | "sent" | "starred" | "trash" = currentFolder,
    targetMailboxId: number | null = selectedMailboxId
  ) => {
    startTransition(async () => {
      const res = await getEmailsAction({
        folder: targetFolder,
        mailboxId: targetMailboxId || undefined,
      });
      if (res.success && res.docs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEmails(res.docs as any);
        if (res.docs.length > 0) {
          const currentStillExists = res.docs.some((e: { id: number }) => e.id === selectedEmailId);
          if (!currentStillExists) {
            setSelectedEmailId(res.docs[0].id);
          }
        } else {
          setSelectedEmailId(null);
        }
      }
    });
  };

  // Folder Select Handler
  const handleFolderSelect = (folder: "inbox" | "sent" | "starred" | "trash") => {
    setCurrentFolder(folder);
    handleRefresh(folder, selectedMailboxId);
  };

  // Mailbox Select Handler
  const handleMailboxSelect = (mbId: number | null) => {
    setSelectedMailboxId(mbId);
    handleRefresh(currentFolder, mbId);
  };

  // Toggle Star
  const handleToggleStar = async (emailId: number, currentStar: boolean) => {
    const nextStar = !currentStar;
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isStarred: nextStar } : e))
    );
    await toggleStarAction(emailId, nextStar);
  };

  // Move to Trash
  const handleTrash = async (emailId: number) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isTrash: true } : e))
    );
    if (selectedEmailId === emailId) {
      const remaining = filteredEmails.filter((e) => e.id !== emailId);
      setSelectedEmailId(remaining.length > 0 ? remaining[0].id : null);
    }
    await moveToTrashAction(emailId);
  };

  // Restore from Trash
  const handleRestore = async (emailId: number) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isTrash: false } : e))
    );
    await restoreEmailAction(emailId);
  };

  // Delete Permanently
  const handleDeletePermanently = async (emailId: number) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId));
    if (selectedEmailId === emailId) {
      setSelectedEmailId(null);
    }
    await deletePermanentlyAction(emailId);
  };

  // Open Reply with Clean Quotation
  const handleReply = (email: EmailItem) => {
    setReplyingToId(email.id);
    const mId = typeof email.mailbox === "object" ? email.mailbox.id : email.mailbox;
    if (mId) setComposeFromId(mId);

    const target = email.direction === "inbound" ? email.from : email.to;
    setComposeTo(target);
    setComposeSubject(
      email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`
    );

    // Clean body for reply quote (strip all MIME boundaries)
    const rawQuote = isRawMimeMultipart(email.bodyText || "")
      ? parseAndCleanMime(email.bodyText || "").text
      : email.bodyText || "";
    const cleanQuote = stripMimeHeadersAndDelimiters(rawQuote);

    setComposeBody(
      `\n\n--- در تاریخ ${email.sentAt ? new Date(email.sentAt).toLocaleString("fa-IR") : email.createdAt}، ${email.from} نوشت: ---\n> ${cleanQuote.replace(/\n/g, "\n> ")}`
    );
    setIsComposeOpen(true);
  };

  // Submit Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeFromId) {
      setComposeStatus({
        type: "error",
        message: "لطفاً اطلاعات گیرنده، فرستنده و موضوع را تکمیل فرمایید.",
      });
      return;
    }

    setComposeStatus({ type: "loading", message: "در حال ارسال پیام..." });

    const res = await sendEmailAction({
      mailboxId: composeFromId,
      to: composeTo,
      cc: composeCc || undefined,
      subject: composeSubject,
      bodyText: composeBody,
      replyToEmailId: replyingToId,
    });

    if (res.success) {
      setComposeStatus({
        type: "success",
        message: "پیام با موفقیت ارسال شد.",
      });
      setTimeout(() => {
        setIsComposeOpen(false);
        setComposeStatus({ type: "idle" });
        setComposeTo("");
        setComposeCc("");
        setComposeSubject("");
        setComposeBody("");
        setReplyingToId(undefined);
        setCurrentFolder("sent");
        handleRefresh("sent", selectedMailboxId);
      }, 700);
    } else {
      setComposeStatus({
        type: "error",
        message: res.error || "خطا در ارتباط با سرور ارسال ایمیل",
      });
    }
  };

  // Unread Count
  const unreadCount = useMemo(() => {
    return emails.filter((e) => e.direction === "inbound" && !e.isRead && !e.isTrash).length;
  }, [emails]);

  return (
    <div
      dir="rtl"
      className="flex h-screen w-screen overflow-hidden bg-background font-sans text-foreground antialiased selection:bg-primary/25 selection:text-primary-foreground"
    >
      {/* =========================================================================
          1. NAVIGATION SIDEBAR (Caesarstone / Breton Luxury Minimalist)
         ========================================================================= */}
      <aside className="flex w-64 flex-col border-e border-border/80 bg-card/90 backdrop-blur-md shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/70 px-5">
          <Link
            href="/"
            title="بازگشت به سایت پرسیس کوارتز"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <Image
              src="/PersisQuartz-Red.png"
              alt="Persis Quartz"
              width={130}
              height={32}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            وب‌میل
          </span>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setReplyingToId(undefined);
              setComposeTo("");
              setComposeCc("");
              setComposeSubject("");
              setComposeBody("");
              setIsComposeOpen(true);
            }}
            aria-label="نگارش پیام جدید"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>نگارش پیام جدید</span>
          </button>
        </div>

        {/* Mailbox Selector */}
        <div className="px-4 pb-3">
          <label 
            htmlFor="mailbox-select" 
            className="mb-1.5 block text-[11px] font-semibold tracking-wide text-muted-foreground select-none"
          >
            صندوق ایمیل فعال:
          </label>
          {session.role === "admin" ? (
            <div className="relative">
              <select
                id="mailbox-select"
                value={selectedMailboxId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleMailboxSelect(val ? Number(val) : null);
                }}
                className="w-full appearance-none rounded-xl border border-input bg-background/80 py-2 ps-3 pe-8 text-xs font-medium text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary font-sans"
              >
                <option value="">همه صندوق‌ها ({mailboxes.length} صندوق)</option>
                {mailboxes.map((mb) => (
                  <option key={mb.id} value={mb.id}>
                    {mb.name} ({mb.address})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 flex items-center justify-between">
              <div className="truncate text-xs">
                <div className="font-semibold text-foreground truncate">{session.name}</div>
                <div className="text-muted-foreground truncate text-[11px]" dir="ltr">
                  {session.address}
                </div>
              </div>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary shrink-0">
                اختصاصی
              </span>
            </div>
          )}
        </div>

        {/* Navigation Folders */}
        <nav aria-label="پوشه‌های وب‌میل" className="flex-1 space-y-1 px-3 py-2 text-xs font-medium">
          <button
            onClick={() => handleFolderSelect("inbox")}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition duration-150 ${
              currentFolder === "inbox"
                ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4" />
              <span>صندوق ورودی</span>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm shadow-primary/30">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleFolderSelect("sent")}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition duration-150 ${
              currentFolder === "sent"
                ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Send className="h-4 w-4" />
              <span>پیام‌های ارسال‌شده</span>
            </div>
          </button>

          <button
            onClick={() => handleFolderSelect("starred")}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition duration-150 ${
              currentFolder === "starred"
                ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="h-4 w-4" />
              <span>پیام‌های نشان‌شده</span>
            </div>
          </button>

          <button
            onClick={() => handleFolderSelect("trash")}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition duration-150 ${
              currentFolder === "trash"
                ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="h-4 w-4" />
              <span>سطل زباله</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="border-t border-border/70 p-3 space-y-2">
          {/* User Profile Info Card */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5 text-xs border border-border/50">
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0 font-bold">
                {session.role === "admin" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="truncate">
                <div className="font-semibold text-foreground truncate">{session.name}</div>
                <div className="text-[11px] text-muted-foreground truncate" dir="ltr">
                  {session.address}
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                await webmailLogoutAction();
                window.location.reload();
              }}
              title="خروج از حساب وب‌میل"
              aria-label="خروج از حساب"
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-background/80"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {session.role === "admin" && (
            <a
              href="/persis-cp"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground transition hover:bg-muted/60 hover:text-foreground font-medium"
            >
              <span>پنل مدیریت ادمین</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </aside>

      {/* =========================================================================
          2. MIDDLE COLUMN: Message Feed & Search
         ========================================================================= */}
      <section className="flex w-96 flex-col border-e border-border/80 bg-card/40 shrink-0">
        {/* Search & Refresh Bar */}
        <div className="flex h-16 items-center gap-2 border-b border-border/70 px-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              id="webmail-search"
              aria-label="جستجو در پیام‌ها"
              placeholder="جستجو در نام فرستنده، موضوع یا متن..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/90 py-2 ps-9 pe-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary font-sans"
            />
          </div>
          <button
            onClick={() => handleRefresh(currentFolder, selectedMailboxId)}
            title="بروزرسانی صندوق پیام‌ها"
            aria-label="بروزرسانی صندوق پیام‌ها"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>

        {/* Email Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {filteredEmails.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <Mail className="mb-3 h-8 w-8 opacity-30 text-muted-foreground" />
              <div className="text-xs font-semibold text-foreground">هیچ پیامی در این پوشه وجود ندارد</div>
              <p className="mt-1 text-[11px] text-muted-foreground/80 max-w-[200px]">
                پیام‌های جدید ارسال‌شده یا دریافتی به صورت خودکار در این بخش نمایش داده می‌شوند.
              </p>
            </div>
          ) : (
            filteredEmails.map((item) => {
              const isSelected = item.id === selectedEmailId;
              const formattedDate = item.sentAt
                ? new Date(item.sentAt).toLocaleDateString("fa-IR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              // Clean snippet for preview (guaranteed free of MIME noise)
              const cleanSnippet = extractCleanSnippet(item.bodyText || item.bodyHtml, 110);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedEmailId(item.id);
                    if (!item.isRead) {
                      setEmails((prev) =>
                        prev.map((e) => (e.id === item.id ? { ...e, isRead: true } : e))
                      );
                    }
                  }}
                  className={`group relative flex cursor-pointer flex-col gap-1.5 p-4 transition duration-150 ${
                    isSelected
                      ? "bg-muted/70 text-foreground"
                      : "hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {/* Left Active Indicator Accent */}
                  {isSelected && (
                    <div className="absolute start-0 top-0 bottom-0 w-1 bg-primary rounded-e" />
                  )}

                  {/* Header: Sender & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      {!item.isRead && item.direction === "inbound" && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                      <span className={`truncate text-xs ${!item.isRead ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}>
                        {item.fromName || item.from.split("<")[0].replace(/"/g, "").trim() || item.from}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground font-mono">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Subject Line */}
                  <div className={`truncate text-xs ${!item.isRead ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                    {item.subject || "(بدون موضوع)"}
                  </div>

                  {/* Body Preview (Pristine snippet, zero MIME noise) */}
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80 font-sans">
                    {cleanSnippet}
                  </p>

                  {/* Status & Quick Actions */}
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {item.direction === "outbound" && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          ارسالی
                        </span>
                      )}
                      {Array.isArray(item.attachments) && item.attachments.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          <span>{item.attachments.length}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(item.id, Boolean(item.isStarred));
                      }}
                      aria-label={item.isStarred ? "حذف نشان پیام" : "نشان کردن پیام"}
                      className="text-muted-foreground transition hover:text-amber-400 p-1"
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          item.isStarred ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* =========================================================================
          3. MAIN READING PANE: Detailed Message View (High Fidelity)
         ========================================================================= */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {selectedEmail ? (
          <div className="flex h-full flex-col">
            {/* Action Bar Header */}
            <div className="flex h-16 items-center justify-between border-b border-border/70 px-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReply(selectedEmail)}
                  className="flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition duration-150 hover:bg-muted hover:border-primary/40 shadow-sm"
                >
                  <Reply className="h-3.5 w-3.5 text-primary" />
                  <span>پاسخ به پیام</span>
                </button>

                <button
                  onClick={() => handleToggleStar(selectedEmail.id, Boolean(selectedEmail.isStarred))}
                  className="flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition duration-150 hover:bg-muted shadow-sm"
                >
                  <Star
                    className={`h-3.5 w-3.5 ${
                      selectedEmail.isStarred ? "fill-amber-400 text-amber-400" : ""
                    }`}
                  />
                  <span>{selectedEmail.isStarred ? "نشان‌شده" : "نشان کردن"}</span>
                </button>

                {selectedEmail.isTrash ? (
                  <>
                    <button
                      onClick={() => handleRestore(selectedEmail.id)}
                      className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-emerald-500 transition hover:bg-muted shadow-sm"
                    >
                      بازگردانی به اینباکس
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(selectedEmail.id)}
                      className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20 shadow-sm"
                    >
                      حذف دائمی
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleTrash(selectedEmail.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition duration-150 hover:bg-muted hover:text-destructive shadow-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>انتقال به سطل زباله</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {selectedEmail.sentAt
                    ? new Date(selectedEmail.sentAt).toLocaleString("fa-IR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : new Date(selectedEmail.createdAt).toLocaleString("fa-IR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                </span>
              </div>
            </div>

            {/* Email Metadata Card */}
            <div className="border-b border-border/70 p-6 bg-card/30">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading mb-4">
                {selectedEmail.subject || "(بدون موضوع)"}
              </h1>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Sender Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/20">
                    {(selectedEmail.fromName || selectedEmail.from).slice(0, 1).toUpperCase()}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">
                        {selectedEmail.fromName || selectedEmail.from.split("<")[0].replace(/"/g, "").trim() || "فرستنده"}
                      </span>
                      <span className="text-muted-foreground font-mono text-[11px]" dir="ltr">
                        {selectedEmail.from.includes("<") ? selectedEmail.from.match(/<([^>]+)>/)?.[1] : selectedEmail.from}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">به:</span>
                      <span className="font-mono text-foreground/80 text-[11px]" dir="ltr">
                        {selectedEmail.to}
                      </span>
                    </div>
                    {selectedEmail.cc && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">رونوشت (CC):</span>
                        <span className="font-mono text-muted-foreground text-[11px]" dir="ltr">
                          {selectedEmail.cc}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              {Array.isArray(selectedEmail.attachments) && selectedEmail.attachments.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                    <span>فایل‌های پیوست ({selectedEmail.attachments.length} فایل):</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedEmail.attachments.map((att: AttachmentItem) => (
                      <a
                        key={att.id}
                        href={att.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs text-foreground transition hover:border-primary hover:bg-muted/50 shadow-sm"
                      >
                        <Paperclip className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[220px] font-mono text-[11px]" dir="ltr">
                          {att.originalName || att.filename || "فایل پیوست"}
                        </span>
                        {att.filesize && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            ({Math.round(att.filesize / 1024)} KB)
                          </span>
                        )}
                        <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Email Body Content - Rendered with High-Security Isolation */}
            <div className="flex-1 overflow-auto p-6 bg-background">
              {resolvedContent.html ? (
                <iframe
                  title="محتوای ایمیل"
                  sandbox="allow-popups allow-same-origin"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html dir="auto">
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style>
                        @font-face {
                          font-family: 'Vazirmatn';
                          src: url('/fonts/Vazir-Medium.woff2') format('woff2');
                          font-weight: 400;
                          font-style: normal;
                          font-display: swap;
                        }
                        @font-face {
                          font-family: 'Vazirmatn';
                          src: url('/fonts/Vazir-Bold.woff2') format('woff2');
                          font-weight: 700;
                          font-style: normal;
                          font-display: swap;
                        }
                        @font-face {
                          font-family: 'Inter';
                          src: url('/fonts/Inter-Regular.woff2') format('woff2');
                          font-weight: 400;
                          font-style: normal;
                          font-display: swap;
                        }
                        @font-face {
                          font-family: 'Inter';
                          src: url('/fonts/Inter-Bold.woff2') format('woff2');
                          font-weight: 700;
                          font-style: normal;
                          font-display: swap;
                        }
                        body {
                          font-family: 'Vazirmatn', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          color: #f1f3f7;
                          background: transparent;
                          line-height: 1.8;
                          font-size: 14.5px;
                          padding: 20px;
                          margin: 0;
                          word-break: break-word;
                        }
                        a { color: #f43f5e; text-decoration: underline; }
                        img { max-width: 100%; height: auto; border-radius: 8px; }
                        blockquote {
                          border-inline-start: 3px solid rgba(155, 7, 55, 0.5);
                          padding-inline-start: 14px;
                          margin-inline-start: 0;
                          opacity: 0.85;
                        }
                        p { margin-top: 0; margin-bottom: 1em; }
                        table { border-collapse: collapse; max-width: 100%; }
                        td, th { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.1); }
                      </style>
                    </head>
                    <body>${resolvedContent.html}</body>
                    </html>
                  `}
                  className="h-full w-full rounded-2xl border border-border/80 bg-card/60 shadow-inner"
                />
              ) : (
                <div
                  dir="auto"
                  className="rounded-2xl border border-border/80 bg-card/60 p-6 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans"
                >
                  {resolvedContent.text || "(این ایمیل حاوی متنی نیست)"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-4 border border-border/60">
              <Mail className="h-7 w-7 opacity-40 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">یک پیام را جهت مشاهده انتخاب نمایید</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">
              تمامی مکاتبات سازمانی دریافت شده یا ارسال شده در این درگاه امن قابل مدیریت و پیگیری می‌باشند.
            </p>
          </div>
        )}
      </main>

      {/* =========================================================================
          4. MODAL: Modern Compose / Reply Email Window (Luxury Dialog)
         ========================================================================= */}
      {isComposeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compose-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <h2 id="compose-dialog-title" className="text-base font-bold text-foreground font-heading">
                {replyingToId ? "پاسخ به پیام" : "نگارش پیام جدید"}
              </h2>
              <button
                onClick={() => setIsComposeOpen(false)}
                aria-label="بستن پنجره نگارش پیام"
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Alert */}
            {composeStatus.message && (
              <div
                role="alert"
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  composeStatus.type === "error"
                    ? "border border-destructive/30 bg-destructive/10 text-destructive"
                    : composeStatus.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                {composeStatus.type === "error" && <AlertCircle className="h-4 w-4 shrink-0" />}
                {composeStatus.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                {composeStatus.type === "loading" && <RefreshCw className="h-4 w-4 animate-spin shrink-0" />}
                <span>{composeStatus.message}</span>
              </div>
            )}

            {/* Compose Form */}
            <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
              {/* Sender Select */}
              <div className="space-y-1.5">
                <label htmlFor="compose-from-select" className="block text-xs font-semibold text-muted-foreground">
                  ارسال از طرف:
                </label>
                {session.role === "admin" ? (
                  <select
                    id="compose-from-select"
                    value={composeFromId}
                    onChange={(e) => setComposeFromId(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background/80 py-2.5 px-3 text-xs text-foreground outline-none transition focus:border-primary font-sans"
                  >
                    {mailboxes.map((mb) => (
                      <option key={mb.id} value={mb.id}>
                        {mb.name} &lt;{mb.address}&gt;
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={`${session.name} <${session.address}>`}
                    className="w-full rounded-xl border border-input bg-muted/40 py-2.5 px-3 text-xs text-muted-foreground outline-none font-sans"
                  />
                )}
              </div>

              {/* Recipient */}
              <div className="space-y-1.5">
                <label htmlFor="compose-to-input" className="block text-xs font-semibold text-muted-foreground">
                  گیرنده (To):
                </label>
                <input
                  id="compose-to-input"
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background/80 py-2.5 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary font-sans"
                />
              </div>

              {/* CC */}
              <div className="space-y-1.5">
                <label htmlFor="compose-cc-input" className="block text-xs font-semibold text-muted-foreground">
                  رونوشت (CC - اختیاری):
                </label>
                <input
                  id="compose-cc-input"
                  type="text"
                  placeholder="cc@example.com"
                  value={composeCc}
                  onChange={(e) => setComposeCc(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background/80 py-2.5 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary font-sans"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="compose-subject-input" className="block text-xs font-semibold text-muted-foreground">
                  موضوع پیام:
                </label>
                <input
                  id="compose-subject-input"
                  type="text"
                  required
                  placeholder="موضوع نامه..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/80 py-2.5 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary font-sans"
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label htmlFor="compose-body-textarea" className="block text-xs font-semibold text-muted-foreground">
                  متن پیام:
                </label>
                <textarea
                  id="compose-body-textarea"
                  rows={8}
                  required
                  placeholder="متن پیام خود را بنویسید..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary font-sans leading-relaxed resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="rounded-xl border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={composeStatus.type === "loading"}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>ارسال پیام</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
