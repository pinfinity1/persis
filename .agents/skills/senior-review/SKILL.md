---
name: senior-review
description: "Performs a strict Staff-Engineer code review on recent changes for Next.js 15, Payload CMS, RTL/LTR, Core Web Vitals, security, and maintainability."
---
# Staff Engineer Code Review Checklist

Act as a strict Staff Engineer reviewing recent changes (`git diff` or specified files) for **Persis Quartz**. Audit every item below and cite exact file paths and line numbers:

## 1. Architecture & Next.js 15 Correctness
- Are `params` and `searchParams` properly `await`ed?
- Is `"use client"` pushed down to leaf nodes, or is a page/container unnecessarily client-rendered?
- Are all CMS/API calls isolated in `src/services/` (no raw `fetch()` in components)?
- Are there any `any` types, `@ts-ignore`, `TODO`s, or unhandled promise rejections / empty `catch` blocks?

## 2. RTL/LTR & i18n Integrity
- Scan for ANY physical Tailwind classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `border-l`, `border-r`). Flag every occurrence to be replaced with logical properties.
- Scan for ANY hardcoded Persian/English/Arabic UI text instead of `next-intl` translation keys.

## 3. Performance & Core Web Vitals
- Do all images use `next/image` with proper `sizes`, aspect ratios (preventing CLS), and `priority` only for above-the-fold LCP?
- Are heavy client widgets dynamically imported?
- Are Payload CMS queries bounded (`limit`/`page`) with minimal `depth`?

## 4. Security & Form Validation
- Are forms using `react-hook-form` + Zod resolver, AND re-validated server-side?
- Is any secret or sensitive server variable leaked to client bundles?

## Output Format
Group findings strictly into:
1. **Critical (Must Fix Before Merge)** — Bugs, security holes, broken RTL/i18n, type/build issues.
2. **Performance & Architecture Warnings** — Unnecessary `"use client"`, CLS/LCP risks, over-fetching.
3. **Polish & Maintainability Suggestions** — Cleaner abstractions, naming (`kebab-case.tsx`), readability.
