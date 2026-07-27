# Project Architecture

## Core Stack

- **Framework:** Next.js 15.5.20 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Animations:** Framer Motion
- **Form Handling & Validation:** React Hook Form + Zod
- **Internationalization (i18n):** next-intl

## Backend & Infrastructure

- **Headless CMS:** Payload CMS
- **Database:** PostgreSQL
- **Email Service:** SMTP + Nodemailer
- **Deployment & Containerization:** Docker & Docker Compose

## Structural Decisions

- **App Router:** Using `src/app` directory.
- **i18n Routing:** Dynamic locale routing (e.g., `src/app/[locale]/...`).
- **Default Locale:** Persian (`fa`) - RTL.
- **Supported Locales:** Persian (`fa` - RTL), Arabic (`ar` - RTL), English (`en` - LTR).
- **Component Strategy:** Favor Server Components (RSC) by default. Use Client Components (`"use client"`) only when interactivity or hooks are required.

## Folder Structure (Directory Layout)

```text
src/
├── app/                  # Next.js App Router
│   └── [locale]/         # i18n dynamic routing (fa, en, ar)
├── components/           # React Components
│   ├── ui/               # Base components (Shadcn UI)
│   ├── shared/           # Shared components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utility functions, constants, Zod schemas
├── hooks/                # Custom React Hooks
├── services/             # API calls and external integrations (Payload CMS fetches)
├── types/                # Global TypeScript interfaces
└── store/                # Global state management
```

## Core Design Patterns

### A. Server/Client Component Pattern

- **Server Components (Default):** Fetch data directly from `services/`, handle backend logic, and pass raw data as props.
- **Client Components (`"use client"`):** Placed at the leaf nodes of the component tree. Used ONLY for state, user events, and Framer Motion animations.

### B. Service Layer / Data Fetching

- Do NOT write raw `fetch()` logic inside React components.
- Abstract all CMS interactions into the `services/` directory.

### C. Validation & DTO Pattern

- Use **Zod** for validating both incoming API data and outgoing Form data.
- Never trust raw data directly; always type and validate it before rendering.

### D. Component Composition

- Avoid excessive Prop Drilling.
- Pass components as `children` or specific props (slots) to keep components decoupled and optimize Server/Client rendering boundaries.
