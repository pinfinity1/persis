# Project Constitution — Persis Quartz (Multilingual Corporate Website & CMS)

## 1. Project Identity & Tech Stack
- **Brand:** Persis Quartz (پرسیس کوارتز) — Premium engineered quartz surfaces.
- **Frontend:** Next.js 15.5.20 (App Router, `src/app/[locale]`), TypeScript (strict), Tailwind CSS, Shadcn UI, Motion.
- **Forms & Validation:** React Hook Form + `@hookform/resolvers/zod` + Zod.
- **Internationalization:** `next-intl` — Default: `fa` (RTL), Supported: `fa` (RTL), `ar` (RTL), `en` (LTR).
- **Backend & CMS:** Payload CMS + PostgreSQL.
- **Email & Infra:** SMTP + Nodemailer, Docker & Docker Compose.

## 2. Verification & Quality Commands
Run these commands in the terminal after code changes (adjust package manager if using `pnpm` or `yarn`):
- **Typecheck:** `npx tsc --noEmit`
- **Lint:** `npm run lint`
- **Build Check (for major/routing changes):** `npm run build`

## 3. Senior Engineering Mindset (Mandatory)
- **Plan Before Code:** Before editing files for any non-trivial task, inspect related code, present a concise implementation plan (affected files, RSC/Client boundaries, edge cases, performance risks), and wait for approval.
- **Production-Grade Only:** Never leave `TODO`s, placeholder mock data, `console.log`, `@ts-ignore`, `any`, or empty `catch` blocks.
- **Simplicity & Modularity:** Keep `page.tsx` thin (layout/data-fetching wrapper only). Extract modular, single-responsibility components into `src/components/`.
- **Strict Verification Loop:** After every edit, run Typecheck and Lint. Fix all errors and warnings before reporting completion.
- **No Unapproved Architectural Shifts:** If a task introduces a trade-off (e.g., caching strategy, schema change, new dependency), stop and ask first.

## 4. Project Documentation Map (Load On-Demand)
Do NOT preload all docs simultaneously; read them only when relevant to the current task:
- `docs/architecture.md` — Core patterns, folder structure, and RSC/Service design.
- `docs/design-guidelines.md` — Caesarstone/Breton visual benchmark, typography, and RTL/LTR rules.
- `docs/use-cases.md` — Full sitemap, page sections, and Payload CMS admin requirements.
- `docs/content.md` — Official Persian brand copy (load ONLY when implementing copy or seeding CMS/i18n dictionaries).

## 5. Project Memory (`docs/DEV_LOG.md`)
- **At the start of every new task/chat:** Read ONLY the `Current Project State` and the latest 5 entries of `docs/DEV_LOG.md` to stay aligned with prior architectural decisions.
- **At the end of every completed feature or major fix:** Update `Current Project State` and prepend a concise entry (changes, key decisions, risks) to `docs/DEV_LOG.md`. Archive older entries to `docs/DEV_LOG_ARCHIVE.md` if the log exceeds 20 entries.
