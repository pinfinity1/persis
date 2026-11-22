# Development & Decision Log

> **Agent Rule:** Keep this file concise. Always add new entries at the **top** of the Log Entries section. When entries exceed 15–20 items, move older entries to `docs/DEV_LOG_ARCHIVE.md`.

## Current Project State
- **Phase:** Feature Complete & Production Hardening
- **Stack:** Next.js 15.4.11 (App Router, React 19), Payload CMS 3.86 (PostgreSQL adapter, Lexical editor), Tailwind CSS v4, TypeScript (strict), MinIO (S3 storage), Docker Compose, Nodemailer, `next-intl` (fa, en, ar).
- **Completed:**
  - Base project scaffolding with strict RSC, modular services (`src/services/`), and logical RTL/LTR design tokens.
  - Multilingual corporate portal with SEO metadata, canonicalization, and localized catalogs/products.
  - Payload CMS administrative portal (`/persis-cp`) with automated migration management.
  - Contact and Inquiry forms with Sliding Window Rate Limiter and asynchronous non-blocking email dispatch.
  - Enterprise Webmail & Outbound/Inbound Infrastructure (`mail.persisquartz.com`):
    - Subdomain routing rewrite in `src/middleware.ts`.
    - PostgreSQL schema & collections: `mailboxes`, `emails`, `email-attachments` (uploaded to MinIO S3).
    - Inbound Edge Email Worker script for Cloudflare with HMAC-SHA256 signature verification and `DOMPurify` XSS sanitization.
    - Global Email Templates & Response Settings (`email-settings`) for CMS-managed customer auto-acknowledgments.
    - Personal forwarding & push alert routing per mailbox (`forwardTo`).
    - Dedicated Webmail UI (`/mail`) styled with `globals.css` semantic design tokens and isolated sandboxed iframe viewer.
- **In Progress:** Cloudflare Worker edge deployment & production build verification.
- **Next Up:** Domain DNS cutover and live email routing tests.

---

## Log Entries (Newest First)

### [2026-11-21] — Webmail Security & Multi-Tenant Authentication Gate
- **Changes:**
  - Added cryptographic auth module `src/lib/webmail-auth.ts` with Node.js native `scrypt` hashing (16-byte random salt) and timing-safe verification (`crypto.timingSafeEqual`).
  - Added `webmailPassword` field to `src/payload/collections/Mailboxes.ts` with automatic hashing hook on CMS update.
  - Implemented Server Actions `webmailLoginAction` and `webmailLogoutAction` in `src/app/actions/mail-actions.ts` with Zod validation.
  - Implemented multi-tenant mailbox isolation: staff accounts are strictly scoped to their assigned mailbox (both for reading and outbound dispatch), while super admins have unrestricted visibility.
  - Created luxury authentication screen `src/components/webmail/webmail-login-form.tsx` matching Caesarstone/Breton brand aesthetic and Vazirmatn typography.
  - Added session profile badge and logout button to `src/components/webmail/webmail-client.tsx`.
  - Added database migration `src/migrations/20261121_190500_add_mailbox_webmail_password.ts` with `pg_advisory_xact_lock`.
  - Rewrote Cloudflare Worker in `scripts/cloudflare-email-worker/worker.js` as standalone zero-dependency script for instant deployment in Cloudflare web editor.
- **Key Decisions:**
  - Stateless HMAC-SHA256 session cookies (`httpOnly`, `sameSite: "lax"`, `secure: true`) eliminating external session store overhead while ensuring zero XSS vulnerabilities.
  - Dual login path: allows staff to log in with dedicated mailbox credentials, or super admins to authenticate with Payload CMS admin accounts.
- **Notes / Risks:** Default seeded mailboxes automatically receive initial password (`Persis2026!`) on first load if unset, editable anytime via `/persis-cp`.

### [2026-11-20] — Enterprise Webmail & Multi-Tenant Mailbox Infrastructure
- **Changes:**
  - Added `src/payload/collections/Mailboxes.ts`, `Emails.ts`, `EmailAttachments.ts`.
  - Added `src/payload/globals/EmailSettings.ts` for dynamic customer acknowledgment & auto-reply templates in Payload CMS.
  - Added `src/services/webmail.service.ts` and Server Actions `src/app/actions/mail-actions.ts`.
  - Added inbound webhook `src/app/api/webhooks/mail-inbound/route.ts` with HMAC-SHA256 validation, S3 attachment streaming, personal email forwarding (`forwardTo`), and auto-reply.
  - Added Webmail UI in `src/app/mail/page.tsx`, `layout.tsx`, and `src/components/webmail/webmail-client.tsx` using purely `globals.css` semantic tokens, logical RTL/LTR properties, and unified Vazirmatn + Inter typography.
  - Standardized font family inheritance across all form inputs and unified the typography scale (`text-xs`, `text-sm`, `text-base`), eliminating micro pixel sizes and raw monospace styling.
  - Configured sandboxed `<iframe>` to embed local Vazirmatn & Inter `@font-face` rules (`public/fonts/`) for consistent high-fidelity typography matching brand guidelines.
  - Added Cloudflare Email Worker edge scripts in `scripts/cloudflare-email-worker/`.
  - Hardened PostgreSQL migrations with `pg_advisory_xact_lock` to eliminate concurrency race conditions during parallel Next.js builds.
- **Key Decisions:**
  - Multi-tenant mailbox delegation: administrators assign staff to specific mailboxes; personal notification copies forward to Gmail/Outlook without storing credentials.
  - Sandboxed `<iframe>` rendering for untrusted external HTML emails to guarantee zero XSS/cookie-exfiltration risks.
  - Zero-cost architecture: leverages Cloudflare Email Routing + Worker + existing SMTP relay.
- **Notes / Risks:** Ensure `EMAIL_WEBHOOK_SECRET` in `.env.local`/production matches the Cloudflare Worker secret variable.

### [2026-11-07] — Contact & Inquiry Workflows + Rate Limiting
- **Changes:** Implemented multi-step lead forms (Sample box, Project, Dealer, Support) with client Zod validation and server-side sliding window rate limiting.
- **Key Decisions:** Non-blocking async background email dispatch via Nodemailer; failure logging without blocking client response.

### [2026-10-26] — Product & Catalog Dynamic Architecture
- **Changes:** Seeded and configured Product collections, finishes, thicknesses, vein patterns, and interactive catalog viewers.
- **Key Decisions:** Cache invalidation via `revalidateTag` in Payload hooks for high-performance static rendering.

### [Initial Setup] — Antigravity Engineering Architecture
- **Changes:** Added `AGENTS.md`, modular `.agents/rules/`, `build-feature` and `senior-review` skills, and organized `docs/`.
- **Key Decisions:** Adopted Progressive Disclosure for rules, strict RTL/LTR logical Tailwind styling, and RSC-first architecture.
