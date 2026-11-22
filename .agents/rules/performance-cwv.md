---
trigger: model_decision
description: "Apply when building Hero sections, media galleries, product grids, animations, data queries, or optimizing Core Web Vitals (LCP, CLS, INP)."
---
# High-Performance & Core Web Vitals Standards

## 1. LCP < 1.5s & Hero Optimization
- Hero images MUST use `next/image` with `priority`, accurate `sizes`, and optimized formats (WebP/AVIF).
- For Hero background videos: provide a lightweight `poster` image (preloaded for LCP), use compressed MP4/WebM, `muted`, `playsInline`, `autoPlay`, `loop`, and defer heavy video bytes or fall back to static imagery on slow connections / `prefers-reduced-motion`.

## 2. Zero Layout Shift (CLS = 0)
- Always define explicit `width`/`height` or `aspect-[...]` containers for images, videos, cards, and skeletons.
- Reserve exact space for dynamic states (`loading.tsx`, Suspense fallbacks, and filter transitions).

## 3. Bundle Size & Rendering Efficiency
- Dynamically import (`next/dynamic`) heavy non-critical Client Components (e.g., interactive maps for Dealers Locator, PDF/catalog viewers, complex modals, heavy charts).
- Keep featured product lists on the Home Page capped (6–8 items max as specified in `docs/use-cases.md`).
- Avoid N+1 queries and unnecessary client-side re-renders; memoize expensive derived lists only when profiling warrants it.
