---
trigger: model_decision
description: "Apply when implementing forms, Zod schemas, API routes, Server Actions, environment variables, authentication, or user-submitted data."
---
# Security & Validation Standards

## 1. Forms & DTO Validation (Zod + React Hook Form)
- Every form MUST use `react-hook-form` with `@hookform/resolvers/zod`.
- Define reusable Zod schemas in `src/lib/validations/` (outside components) and share them between client forms and server handlers/Server Actions.
- Never trust client-side validation alone: re-validate all incoming API/Server Action payloads on the server with Zod.

## 2. Secrets & Environment Hygiene
- Never hardcode SMTP credentials, Payload secrets, database URLs, or API keys. Read them via a validated `src/lib/env.ts` (Zod-checked `process.env`).
- Never expose server-only environment variables (`SMTP_PASS`, `DATABASE_URI`, `PAYLOAD_SECRET`) to Client Components or `NEXT_PUBLIC_*` prefixes.

## 3. Abuse Prevention & Safe Output
- Protect public submission endpoints (`/contact`, Request a Sample) against spam/abuse (rate limiting, honeypot field, or bot protection).
- Avoid `dangerouslySetInnerHTML`; if rendering rich text from Payload CMS, use Payload's safe Lexical/Slate React serializer.
