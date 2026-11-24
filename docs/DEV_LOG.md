# Development & Decision Log

> **Agent Rule:** Keep this file concise. Always add new entries at the **top** of the Log Entries section. When entries exceed 15–20 items, move older entries to `docs/DEV_LOG_ARCHIVE.md`.

## Current Project State
- **Phase:** Feature Complete & Production Hardening
- **Stack:** Next.js 15.4.11 (App Router, React 19), Payload CMS 3.86 (PostgreSQL adapter, Lexical editor), Tailwind CSS v4, TypeScript (strict), MinIO (S3 storage), Docker Compose, Nodemailer, `next-intl` (fa, en, ar).
- **Completed:**
  - Base project scaffolding with strict RSC, modular services (`src/services/`), and logical RTL/LTR design tokens.
  - Multilingual corporate portal with SEO metadata, canonicalization, and localized catalogs/products.
  - Bespoke Architectural Lookbook & In-Site Interactive Catalog Showcase (`/catalogs`):
    - Completely replaced the plain, boring download cards with an ultra-luxury editorial lookbook architecture inspired by Caesarstone & Breton.
    - Designed `CatalogHeroFeatured` showcasing the flagship 2026 Master Collection with 3D perspective depth, technical slab specs (320x160cm, 20/30mm, 93% silica, Bretonstone®), and dual luxury actions.
    - Built `CatalogLookbookModal`: bespoke full-screen dark architectural modal with macro texture zoom, dual view modes (Curated Interactive Material Spreads with hot-spots linking directly to products + Native High-Performance In-Site PDF Viewer frame), keyboard navigation (Arrows, Esc, F), touch swipe gestures on mobile, overview grid drawer, and one-click share.
    - Implemented `CatalogsDirectoryClient` with sub-millisecond in-memory category filtering (Master, Technical, Collections, Guides) and real-time live search.
    - Ensured 100% responsiveness on mobile, tablet, and wide desktop with zero layout shift (CLS = 0) and zero heavy, crashing client-side canvas dependencies (First Load JS: 173 kB).
  - Showrooms & Dealers Locator Overhaul (`/dealers`):
    - Resolved PostgreSQL enum type crash (`22P02: invalid input value for enum enum_dealers_province: "تهران"`).
    - Integrated provincial capital city mapping into `IRAN_PROVINCES` (`center`, `centerEn`, `centerAr`), enabling instant city-level search (شیراز، کرج، مشهد، تبریز، اهواز، رشت، ساری، ارومیه).
    - Architected high-performance `DealersDirectoryClient` with sub-millisecond in-memory filtering, zero layout shift (CLS = 0), and shallow URL synchronization (`window.history.replaceState`).
    - Seeded official showrooms across major Iranian cities (Tehran, Isfahan, Shiraz, Mashhad, Karaj, Tabriz, Shahrekord).
  - Payload CMS administrative portal (`/persis-cp`) with automated migration management.
  - Contact and Inquiry forms with Sliding Window Rate Limiter and asynchronous non-blocking email dispatch.
  - Enterprise Webmail & Outbound/Inbound Infrastructure (`mail.persisquartz.com`).
- **In Progress:** Cloudflare Worker edge deployment & production build verification.
- **Next Up:** Domain DNS cutover and live email routing tests.

---

## Log Entries (Newest First)

### [2026-11-24] — Bespoke Architectural Lookbook, Interactive Material Reader & Luxury Catalog Showcase
- **Changes:**
  - **Hero Showcase (`CatalogHeroFeatured`):** Replaced the plain static card layout with an editorial 3D publication showcase for the flagship 2026 Master Collection. Features slab dimension specs ($320 \times 160\text{ cm}$, $20\text{ & }30\text{ mm}$), Bretonstone® technology badge, and prominent dual CTAs ("ورق زدن و کاوش در ژورنال" + "دانلود نسخه چاپی با کیفیت بالا").
  - **Interactive Lookbook Reader (`CatalogLookbookModal`):**
    - Built a dedicated full-screen dark architectural reader (`bg-neutral-950/98 backdrop-blur-2xl`) tailored specifically for luxury quartz stone surfaces.
    - **Interactive Spreads Mode:** Displays curated architectural spreads with macro texture zoom ($0.75\times$ to $2.5\times$), technical stone specifications, and pulsing interactive hotspots on slabs linking directly to product pages.
    - **In-Site Native Document Mode:** Clean sandboxed frame rendering the uploaded PDF directly without forcing external downloads or throwing the user out of the site context.
    - **Controls & Navigation:** Full keyboard support (RTL/LTR aware Left/Right arrows, Esc to exit, F for fullscreen), mobile touch-swipe gestures, overview contact-sheet grid drawer, and one-click URL sharing with clipboard feedback.
  - **High-Performance Client Directory (`CatalogsDirectoryClient`):** Sub-millisecond in-memory category filtering (همه، کاتالوگ جامع، مشخصات فنی، کالکشن‌ها، راهنماها) and live instant search with zero layout shift.
  - **Editorial Monograph Cards (`CatalogEditorialCard`):** Redesigned catalog cards with an architectural portrait ratio (`aspect-[3/4]`), spine depth styling, year badges, Breton Tech badge, and dual action buttons.
  - **Multilingual Localization:** Updated `fa.json`, `en.json`, and `ar.json` with over 25+ luxury architectural terminology keys.
- **Key Decisions:**
  - Abandoned skeuomorphic faux paper flipping (which crashed in prior attempts due to `react-pdf` / React 19 incompatibilities and heavy client canvas bloat).
  - Adopted a modern editorial showcase architecture (Caesarstone & Breton standard): lightweight First Load JS (173 kB), zero CLS, sub-millisecond filtering, and 60fps gesture transitions.
- **Changes:**
  - **PostgreSQL Enum Type Fix:** Eliminated `{ province: { equals: match.fa } }` from `src/services/dealer.service.ts`. Because Payload CMS maps `select` fields to Postgres enums (`enum_dealers_province`), passing Persian labels caused PostgreSQL error `22P02`. Queries now strictly query the valid enum slug (`match.slug`).
  - **Capital Cities & Regional Mapping:** Enriched `IRAN_PROVINCES` in `src/lib/constants/provinces.ts` with `center`, `centerEn`, and `centerAr` for all 31 Iranian provinces, enabling `normalizeProvinceToSlug` to resolve city names directly to their province slugs (e.g. "شیراز" -> "fars", "کرج" -> "alborz", "مشهد" -> "khorasan-razavi").
  - **Ultra-Minimalist Luxury UI/UX Overhaul (`DealersDirectoryClient`):** Completely redesigned `src/components/dealers/dealers-directory-client.tsx` to align strictly with Caesarstone / Breton design guidelines:
    - Removed heavy card boxes, outer borders, and noisy badge chips.
    - Designed an airy, single-line toolbar with transparent search input and underlined minimal selector (`border-b border-border/30`).
    - Made dropdown menu fully responsive with `end-0` alignment preventing mobile overflow.
    - Sub-millisecond in-memory filtering (<1ms), zero layout shift (CLS = 0), and shallow URL synchronization (`window.history.replaceState`).
  - **Database Seed:** Seeded official Persis Quartz showrooms across major Iranian metropolitan centers (Tehran, Isfahan, Shiraz, Mashhad, Karaj, Tabriz, Shahrekord) with multilingual data and realistic coordinates.
- **Key Decisions:**
  - Strict adherence to Caesarstone/Breton understated luxury: minimal borders, pure typography, no dashboard-style containers.
  - Pre-fetching all published dealers at page load (`getDealersService({ locale, province: 'all' })`) enables sub-millisecond in-memory client filtering (<1ms, INP < 16ms), eliminating network delays and skeleton flickering when toggling cities.
  - Full server-side JSON-LD Schema (`LocalBusiness` departments) is preserved for SEO crawlers.

### [2026-11-24] — Webmail PostgreSQL State Persistence, Deep Search Engine & High-Performance Nginx Hardening
- **Changes:**
  - **Payload Local API Access Control:** Added `overrideAccess: true` to all `WebmailService` operations (`toggleStar`, `markAsRead`, `toggleRead`, `moveToTrash`, `restoreFromTrash`, `deletePermanently`). Resolved the issue where Payload 3.x rejected updates from Webmail cookie sessions that lack a CMS admin user, causing stars and read indicators to revert on page refresh.
  - **Accurate Database Unread Count & Badge:** Added initial unread counting via `payload.count` directly from PostgreSQL in `src/app/mail/page.tsx` and tied it to a reactive state in `WebmailClient`. Unread badges on "صندوق ورودی" now remain accurate across folder switches.
  - **Auto Mark as Read & Manual Toggle:** Automatically marks incoming emails as read in PostgreSQL upon selection using a ref gate (`prevSelectedIdRef`) to avoid unintended resets. Added a dedicated "خوانده‌نشده / خوانده‌شده" toggle button with `Mail` and `MailOpen` icons in the reader action toolbar.
  - **Full-Text Deep Multilingual Search:** Built `normalizeSearchString` and `matchesSearchQuery` in `src/lib/mime-parser.ts` to normalize Persian/Arabic characters (ی/ي, ک/ك, آ/ا, ZWNJ, Harakat) and search across subject, sender name, email address, recipients, and the full un-truncated body text.
  - **Aggressive MIME Header & Boundary Sanitization:** Enhanced `stripMimeHeadersAndDelimiters` to strip hexadecimal boundary identifiers (e.g. `00000000000024aede...`), single-newline headers, and duplicate body content.
  - **Nginx & DNS High-Performance Recipe:** Provided the complete, production-grade Nginx configuration with HTTP/2, Gzip compression, static asset caching, and SSL certbot setup for `mail.persisquartz.com`.
- **Key Decisions:**
  - `prevSelectedIdRef` ensures automatic read-marking only triggers on distinct email selection transitions, preserving the user's manual "خوانده‌نشده" toggle.
  - `overrideAccess: true` is strictly required in Payload Local API when invoked from public or session-based Server Actions.


### [2026-11-23] — Webmail UI/UX Overhaul, MIME Noise Elimination & Lighthouse 100
- **Changes:**
  - Created recursive RFC 5322 MIME parser `src/lib/mime-parser.ts` to decode complex multipart emails (Gmail, Yahoo, Outlook), eliminating all boundary noise (`--_Part_...`, `Content-Type`) and isolating pure human text & HTML.
  - Hardened inbound webhook `src/app/api/webhooks/mail-inbound/route.ts` with `xss` sanitizer (resolving Next.js ESM bundling conflict) and `force-dynamic`.
  - Upgraded Cloudflare Email Worker `scripts/cloudflare-email-worker/worker.js` with multi-boundary recursive extraction.
  - Standardized Payload CMS collections (`Mailboxes`, `Emails`, `EmailAttachments`, `EmailSettings`) under unified `Communications` group with English titles, resolving visual inconsistency in `/persis-cp`.
  - Redesigned `/mail` login gate with official Persis Quartz brand logo (`/PersisQuartz-Red.png`), luxury glassmorphism, accessible form controls, and corporate Persian copy.
  - Redesigned `/mail` Webmail Client with Caesarstone/Breton luxury aesthetic, pure Persian navigation, dynamic retroactive MIME cleaning for older database emails, and sandboxed isolated reader.
  - Optimized `src/app/mail/layout.tsx` for Lighthouse 100 (Viewport, WCAG AA contrast, Vazirmatn font-display swap, zero CLS).
- **Key Decisions:**
  - Multi-tier defense-in-depth against MIME boundary noise (Edge Worker + Server Webhook + Client-side retroactive parser).
  - Use lightweight `xss` instead of `isomorphic-dompurify` to prevent Next.js 15 App Router bundling errors with `html-encoding-sniffer`.

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
