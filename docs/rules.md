# AI Coding Rules

When generating code for this project, you MUST follow these rules:

1. **Production-Grade & MVP Focus:** This is a PRODUCTION-GRADE project. All code must be robust, scalable, secure, and optimized to reach a high-quality Minimum Viable Product (MVP) standard efficiently.
2. **TypeScript Only:** Write strictly typed TypeScript code. Avoid `any`. Define proper interfaces/types for all data, especially for Payload CMS responses.
3. **App Router Conventions:** Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
4. **i18n Implementation:** Always use `next-intl` hooks (like `useTranslations`) for text. NEVER hardcode text strings in the components.
5. **Server vs Client:**
   - Default to Server Components (RSC).
   - Add `"use client"` only at the very top of files that explicitly require `useState`, `useEffect`, user events (`onClick`), or `motion`.
6. **Form Handling:** Always combine `react-hook-form` and `@hookform/resolvers/zod`. Define Zod schemas in a separate file or outside the component.
7. **Imports:** Use absolute imports (e.g., `@/components/...`).
8. **Clean Code & Modularization:** Pages must only act as layouts/wrappers. Break large UI parts into small, modular, single-responsibility components under `src/components/`.
9. **Uncompromised Performance & Logical Styling:**
   - **Performance:** Optimize all media assets (Next.js `<Image />` with proper `sizes` and `priority`, lightweight video loading), ensure zero layout shifts (CLS), and use lazy loading / Dynamic Imports for non-critical code.
   - **Logical Tailwind Properties:** ALWAYS use logical CSS properties (e.g., `ms-`, `me-`, `ps-`, `pe-`, `border-s`, `border-e`) instead of physical ones (`ml-`, `mr-`, etc.) to guarantee seamless, zero-duplicate RTL/LTR support across all languages (FA, EN, AR).

---

## Component Architecture & Naming Conventions

### 📁 Directory Structure

- **Base UI Components (Shadcn/Radix):** `src/components/ui/`
- **Shared Layout Elements (Header, Footer, Logo):** `src/components/shared/`
- **Feature-Specific UI:** `src/components/[feature]/` (e.g., `src/components/products/`)

### 🏷️ Naming Conventions

- **Component File Names:** `kebab-case.tsx` (e.g., `product-card.tsx`, `main-nav.tsx`).
- **Component Function Names:** `PascalCase` (e.g., `export const ProductCard = ...`).
- **Hooks:** `camelCase.ts` (e.g., `useScroll.ts`).
- **Utilities & Services:** `camelCase.ts` (e.g., `formatCurrency.ts`).
