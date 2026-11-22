---
name: build-feature
description: "End-to-end Senior Engineer workflow for implementing a new page, section, or feature in the Persis Quartz Next.js 15 + Payload CMS project."
---
# Senior Feature Implementation Playbook

Follow these steps strictly in order when asked to build a new feature or page:

## Phase 1: Discovery & Architecture Plan (NO CODE YET)
1. Read `docs/DEV_LOG.md` (Current Project State + latest 5 entries), `docs/use-cases.md` for functional requirements, and `docs/content.md` if official Persian copy is needed.
2. Inspect existing files in `src/types/`, `src/services/`, and `src/components/` to reuse established patterns and Shadcn UI primitives.
3. Present a concise **Implementation Plan** to the user covering:
   - Exact files to create/modify.
   - Server vs. Client component split.
   - Payload CMS collection/service queries and Zod schemas needed.
   - i18n translation keys (`fa`, `ar`, `en`) and RTL/LTR considerations.
   - Performance & edge cases (empty states, error states, mobile layout, LCP/CLS).
4. **Wait for user approval** before writing code (unless the user explicitly instructed to execute directly).

## Phase 2: Implementation (Bottom-Up)
1. **Types & Validation:** Define TypeScript interfaces (`src/types/`) and Zod schemas (`src/lib/validations/`).
2. **Service Layer:** Implement data-fetching/mutation functions in `src/services/` with pagination, locale support, and strict error handling.
3. **i18n Keys:** Add all UI strings to locale message files (`fa`, `ar`, `en`) — zero hardcoded text.
4. **Modular Components:** Build reusable, logical-styled (`ms-`, `ps-`, etc.) components in `src/components/[feature]/`, keeping `"use client"` strictly at leaf nodes.
5. **Route Assembly:** Wire up `page.tsx`, `loading.tsx`, and `error.tsx` inside `src/app/[locale]/...` with proper Next.js 15 `generateMetadata`.

## Phase 3: Automated Verification
1. Run `npx tsc --noEmit` and `npm run lint` in the terminal.
2. Fix every TypeScript error, ESLint warning, or broken import.
3. Update `docs/DEV_LOG.md` (`Current Project State` + prepend a new entry at the top).
4. Report a concise summary of changed files and verification results.
