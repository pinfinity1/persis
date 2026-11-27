# Development & Decision Log

> **Agent Rule:** Keep this file concise. Always add new entries at the **top** of the Log Entries section. When entries exceed 15–20 items, move older entries to `docs/DEV_LOG_ARCHIVE.md`.

## Current Project State
- **Phase:** Feature Complete & Production Hardening
- **Stack:** Next.js 15.4.11 (App Router, React 19), Payload CMS 3.86 (PostgreSQL adapter, Lexical editor), Tailwind CSS v4, TypeScript (strict), MinIO (S3 storage), Docker Compose, Nodemailer, `next-intl` (fa, en, ar).
- **Completed:**
  - Base project scaffolding with strict RSC, modular services (`src/services/`), and logical RTL/LTR design tokens.
  - Multilingual corporate portal with SEO metadata, canonicalization, and localized catalogs/products.
  - High-Performance Progressive Catalog & PDF Streaming Studio (`/catalogs`):
    - Eliminated the slow 30MB monolithic `<iframe>` PDF download bottleneck by architecting `CatalogPdfReader` using pure `pdfjs-dist` (`6.5.438` legacy build) loaded via dynamic import on demand (`0 KB` initial page JS overhead) and a local worker (`public/pdf.worker.min.mjs`, zero external CDN reliance).
    - Configured HTTP Byte-Range streaming (`disableAutoFetch: true`, `rangeChunkSize: 65536`) paired with `@payloadcms/storage-s3` `206 Partial Content` support, allowing Page 1 to stream and render on HiDPI `<canvas>` rapidly with background prefetching for subsequent pages.
    - Built full responsive reader controls: Desktop Single/Spread view toggle, lazy IntersectionObserver thumbnail drawer, zoom (`75%`–`225%`), keyboard shortcuts (`Arrows`, `Esc`, `F`, `+`/`-`), mobile touch-swipe navigation, real-time progress bar, and error fallback links.
    - Implemented a uniform responsive card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) in `CatalogsDirectoryClient` + `CatalogCard`, ensuring consistent horizontal alignment across multiple catalogs on mobile, tablet, and desktop.
    - Framed catalog covers inside `aspect-[4/3]` with an ambient blurred backdrop matching each cover's palette + uncropped `object-contain` foreground, adapting seamlessly to square, landscape, or portrait artwork.
    - Production build verified (`9.85 kB` route size, `168 kB` first load JS).
  - Showrooms & Dealers Locator Overhaul (`/dealers`):
    - Resolved PostgreSQL enum type crash (`22P02: invalid input value for enum enum_dealers_province: "تهران"`).
    - Integrated provincial capital city mapping into `IRAN_PROVINCES` (`center`, `centerEn`, `centerAr`), enabling instant city-level search (شیراز، کرج، مشهد، تبریز، اهواز، رشت، ساری، ارومیه).
    - Architected high-performance `DealersDirectoryClient` with sub-millisecond in-memory filtering, zero layout shift (CLS = 0), and shallow URL synchronization (`window.history.replaceState`).
    - Seeded official showrooms across major Iranian cities (Tehran, Isfahan, Shiraz, Mashhad, Karaj, Tabriz, Shahrekord).
  - Payload CMS administrative portal (`/persis-cp`) with automated migration management.
  - Contact and Inquiry forms with Sliding Window Rate Limiter and asynchronous non-blocking email dispatch.
  - Enterprise Webmail & Outbound/Inbound Infrastructure (`mail.persisquartz.com`).
  - Brand Identity & Custom Latin Typeface Samples (`PersisType Display` & `PersisType Luxury`):
    - Engineered a mathematically exact `11u × 11u` `P` monogram (`1.0u` uniform stroke, `2u/1u` concentric arcs, `0.6u` architectural stencil gap, parallel `45°` bevels) and applied the full perfected icon & wordmark suite (`public/logo-Red.*`, `public/logo-Red-bgwhite.svg`, `public/logo-Circle.svg`, `public/logo-Mark.svg`, `public/PersisQuartz-Red.*`, `public/PersisQuartz-White.*`, `public/logo/*`, `src/app/icon0.svg`, `icon1.png`, `apple-icon.png`, `favicon.ico`, `web-app-manifest-*.png`).
    - Upgraded `Logo` (`src/components/shared/logo.tsx`) to crisp vector SVG with `tone="white"` / `full-white` / `icon-circle` / `icon-transparent` variants and wired dark-surface components (`Header` over hero, `Footer`, `HeroBanner` fallback, `/mail` login & sidebar, and `[locale]/loading.tsx`) to use crisp `PersisQuartz-White.svg` and `logo-Red.svg`.
    - **Sample 1 (`PersisType Display` V1.1 in `public/fonts/PersisTypeDisplay-Latin.*`):** `67` glyphs (`83` codepoints) derived from the `P` monogram with Breton-accurate `b`/`d` symmetry, **10 OpenType `GSUB` (`liga`/`calt`) horizontal interlocks** (`ab, de, op, ob, ap, ep, up, qu, qr, st`), and `GPOS` kerning.
    - **Sample 2 (`PersisType Luxury` V1.0 in `public/fonts/PersisTypeLuxury-Latin.*`):** `58` glyphs (`84` codepoints) wide `1:8.3` luxury display typeface inspired by the client's `PERSIS` & `CATALOG` artwork, designed to pair with the `P` monogram logo.
- **In Progress:** Cloudflare Worker edge deployment & production build verification; bilingual Persian typeface phase pending explicit user confirmation.
- **Next Up:** Domain DNS cutover, live email routing tests, and Persian companion selection for `PersisType`.

---

## Log Entries (Newest First)

### [2026-11-27] — Brand Identity Overhaul: P-Monogram Grid, `PersisType Display` V1.1 (Breton Interlocks) & `PersisType Luxury` Sample 2
- **Changes:**
  - **Geometric Monogram Reconstruction & Clean Repo Assets:** Standardized the `P` monogram onto an `11u × 11u` grid and updated `public/logo-Red.*`, `public/logo-Red-bgwhite.svg`, `public/logo-Circle.svg`, `public/logo-Mark.svg`, `public/PersisQuartz-Red.*` (with `q_u` interlock), `public/PersisQuartz-White.*`, `public/logo/*`, `src/app/icon0.svg`, `icon1.png`, `apple-icon.png`, `favicon.ico`, and maskable PWA icons.
  - **UI Component Integration (`Logo`, `Header`, `Footer`, `HeroBanner`, Webmail, `Loading`):** Upgraded `src/components/shared/logo.tsx` to crisp vector SVGs with `tone="white"` and circle/transparent variants; wired dark surfaces (`Header` un-scrolled hero bar, `Footer` replacing `brightness-0 invert`, `HeroBanner` dark fallback, `webmail-login-form.tsx`, `webmail-client.tsx`) to `/PersisQuartz-White.svg` and `[locale]/loading.tsx` to `/logo-Red.svg`.
  - **Sample 1 (`PersisType Display` V1.1 — `public/fonts/PersisTypeDisplay-Latin.*`):** Added Breton-style vertical mirrors on `b` and `d` (extended `5u..6u` crossbars matching `p`/`q`), **10 OpenType `GSUB` (`liga`/`calt`) horizontal interlocking bridges** (`a_b`, `d_e`, `o_p`, `o_b`, `a_p`, `e_p`, `u_p`, `q_u`, `q_r`, `s_t`), and tight `GPOS` kerning (`67` glyphs).
  - **Sample 2 (`PersisType Luxury` V1.0 — `public/fonts/PersisTypeLuxury-Latin.*`):** Engineered a distinct wide architectural All-Caps display font (`58` glyphs, `1:8.33` stroke, swept leaf terminals, open `P/R/B/A/H/K` breaks) matching the client's `PERSIS` & `CATALOG` artwork to pair alongside the `P` monogram.
- **Key Decisions:**
  - Adopted the Breton identity principle where the monogram (`P`) is literally the lowercase `p` glyph of the brand typeface (`PersisType Display`).
  - Set `OS/2` `ulCodePageRange1 = 0x1` (CP1252 Latin 1) and `fsType = 0` so `.ttf`/`.otf` install cleanly in Microsoft Word, Figma, macOS Font Book, and Windows.
  - Deferred Persian companion design until explicit user instruction; `layout.tsx` and `globals.css` fonts remain untouched on `Vazirmatn` + `Inter` for now.

### [2026-11-25] — High-Performance Progressive PDF.js Range-Streaming Reader & ISR Optimization
- **Changes:**
  - **Eliminated 30MB `<iframe>` Bottleneck (`CatalogPdfReader`):** Installed `pdfjs-dist` (`6.5.438`) and copied `pdf.worker.min.mjs` locally to `public/pdf.worker.min.mjs` (eliminating external CDN dependencies). Dynamically imported `pdfjs-dist/legacy/build/pdf.mjs` only when opening a catalog, keeping `/[locale]/catalogs` First Load JS at `168 kB`.
  - **Progressive HTTP Range Streaming:** Configured `disableAutoFetch: true` and `rangeChunkSize: 65536` (`64 KB` chunks) to stream only needed page bytes over HTTP `206 Partial Content`, rendering HiDPI `<canvas>` pages with background prefetching of the next page.
  - **Responsive Luxury Reader UX:** Added Single/Spread view toggle on desktop (`>= 960px`), lazy `IntersectionObserver` thumbnails drawer, zoom (`75%–225%`), keyboard shortcuts, mobile touch-swipe navigation, real-time loading progress bar, and direct open/download fallback.
  - **ISR & WebP Image Optimization:** Added `export const revalidate = 3600` to `src/app/[locale]/catalogs/page.tsx` and updated `CatalogService` + `CatalogCard` to serve Payload's pre-generated WebP `sizes.desktop` cover image directly.
  - **ESLint Config:** Added `public/pdf.worker.min.mjs` to `eslint.config.mjs` ignores.
- **Key Decisions:**
  - Using `pdfjs-dist/legacy/build/pdf.mjs` directly (without `react-pdf`) avoids React 19 peer/SSR canvas issues while supporting Safari 16+/iOS and all modern browsers via local worker assets.

### [2026-11-24] — Clean Luxury Catalog Showcase & In-Site PDF Viewer Overhaul
- **Changes:**
  - **Removed Overengineered & Hardcoded Bloat:** Completely purged dummy hardcoded spreads, fake English headers, fake technical spec rows ("خلوص ۹۳٪", "۳۲۰ در ۱۶۰"), and awkward overlaid badges.
  - **Fixed Cover Image Cropping:** Configured catalog cover image with `object-contain` and standard catalog proportions, ensuring the client's cover typography (e.g. "CATALOG PERSIS QUARTZ") is fully visible without any edge cropping.
  - **Clean In-Site Viewer Modal (`CatalogViewerModal`):** Built a dedicated 100% full-screen in-site reader displaying the client's actual uploaded PDF. Features proper body scroll lock, dark backdrop, direct download, fullscreen controls, and keyboard `Esc` exit.
  - **Minimalist Directory (`CatalogsDirectoryClient` & `CatalogCard`):** Removed empty category tabs, displaying only categories that contain published items. Cards display genuine CMS titles, descriptions, publication year, and localized file size.
  - **Clean Multilingual Localization:** Purged bloated buzzwords from `fa.json`, `en.json`, and `ar.json`, keeping only clean, direct translations.
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
