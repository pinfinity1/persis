---
trigger: model_decision
description: "Apply when working on Payload CMS collections, PostgreSQL queries, src/services/, API routes, Server Actions, or SMTP/Nodemailer email logic."
---
# Payload CMS, Data Layer & Backend Standards

Reference: @[Architecture](../../docs/architecture.md)

## 1. Payload CMS & Service Layer
- Encapsulate all Payload CMS interactions (`Local API` or REST/GraphQL fetches) inside `src/services/` with strongly typed return values.
- Always pass the active `locale` (`fa` | `ar` | `en`) and fallback locale configuration to Payload queries.
- Use `depth` conservatively (typically `1` or `2`, never unbounded) to prevent over-fetching nested relations and bloating payloads.
- Always enforce explicit `limit` and `page` parameters on collection queries (Products, Catalogs, Dealers, Projects, Blog Posts). Never fetch unbounded lists.

## 2. Caching & Revalidation
- Define explicit caching/revalidation strategies (`revalidateTag`, `revalidatePath`, or `unstable_cache` / Next.js fetch cache) for CMS-backed pages.
- Trigger on-demand revalidation via Payload `afterChange` / `afterDelete` hooks when content updates.

## 3. Email Service (SMTP + Nodemailer)
- Isolate Nodemailer transport and email templates inside `src/services/email/` (never inside route handlers or components directly).
- Validate all contact/sample-request payloads with Zod before dispatching emails, and sanitize user input to prevent header injection.
- Handle SMTP failures gracefully with structured server-side logging and safe, localized client error messages.
