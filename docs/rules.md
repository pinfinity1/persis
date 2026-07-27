# AI Coding Rules

When generating code for this project, you MUST follow these rules:

1. **Production-Grade & MVP Focus:** This is a PRODUCTION-GRADE project, not a practice or tutorial project. All code must be robust, scalable, secure, and optimized to reach a high-quality Minimum Viable Product (MVP) standard efficiently.
2. **TypeScript Only:** Write strictly typed TypeScript code. Avoid `any`. Define proper interfaces/types for all data, especially for Payload CMS responses.
3. **App Router Conventions:** Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
4. **i18n Implementation:** Always use `next-intl` hooks (like `useTranslations`) for text. NEVER hardcode text strings in the components.
5. **Server vs Client:**
   - Default to Server Components.
   - Add `"use client"` only at the very top of files that need `useState`, `useEffect`, `onClick`, or `framer-motion`.
6. **Form Handling:** Always combine `react-hook-form` and `@hookform/resolvers/zod`. Define Zod schemas in a separate file or outside the component.
7. **Imports:** Use absolute imports (e.g., `@/components/...`).
8. **Clean Code:** Break large components into smaller, reusable pieces. Keep functions pure where possible.
