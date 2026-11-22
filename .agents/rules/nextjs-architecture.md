---
trigger: glob
glob: "src/**/*.{ts,tsx}"
description: "Core Next.js 15 App Router, TypeScript, RSC/Client boundary, and naming conventions."
---
# Next.js 15 & TypeScript Architecture Rules

Reference: @[Architecture](../../docs/architecture.md)

## 1. Server vs. Client Component Boundaries
- **Default to Server Components (RSC):** Fetch data directly via `src/services/`, handle backend logic, and pass serializable props down.
- **Leaf-Node Client Components:** Place `"use client"` ONLY at the smallest interactive leaf components (state, event handlers, browser APIs, Motion animations). Never mark a whole `page.tsx` or large layout as `"use client"`.
- **Composition Over Prop Drilling:** Use `children` and named slot props to pass Server Components through Client wrappers cleanly.

## 2. Next.js 15 App Router Conventions
- Remember that `params` and `searchParams` in `page.tsx` and `layout.tsx` are **Promises** in Next.js 15 — always `await` them with explicit types.
- Use standard route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Keep `page.tsx` strictly as a thin orchestrator (metadata, data fetching, layout composition).

## 3. Service Layer & Strict Typing
- **Zero Raw Fetches in UI:** Never call raw `fetch()` or Payload queries inside React components. Abstract all data access into `src/services/`.
- **Strict TypeScript:** Zero `any` types. Define explicit interfaces/types in `src/types/` or infer them from Zod schemas and Payload generated types.
- **Absolute Imports:** Always use `@/` path aliases (e.g., `@/components/ui/button`, `@/services/products`).

## 4. Directory & Naming Standards
- `src/components/ui/` — Base Shadcn/Radix primitives.
- `src/components/shared/` — Global layout elements (Header, Footer, Logo, LocaleSwitcher).
- `src/components/[feature]/` — Feature-specific modules (e.g., `src/components/products/`).
- **Files:** `kebab-case.tsx` for components (`product-card.tsx`), `camelCase.ts` for hooks (`useScroll.ts`), utils, and services (`productService.ts`).
- **Exports:** `PascalCase` for React components (`export function ProductCard(...)`).
