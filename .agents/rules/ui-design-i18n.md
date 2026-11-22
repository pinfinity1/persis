---
trigger: glob
glob: "src/{app,components}/**/*.tsx"
description: "Visual design benchmarks (Caesarstone/Breton), Tailwind logical RTL/LTR rules, Motion, and next-intl."
---
# UI, Design System & Internationalization (RTL/LTR)

Reference: @[Design Guidelines](../../docs/design-guidelines.md)

## 1. Visual Aesthetic (Caesarstone & Breton Standard)
- Target a **premium, architectural, minimalist, industrial-luxury** feel: generous whitespace, crisp typography, large high-resolution stone/slab visuals, and restrained neutral palettes.
- Use **Shadcn UI** primitives customized via Tailwind config/tokens; avoid custom CSS files.
- **Mobile-First Responsive:** Every section must render cleanly across mobile, tablet, and wide desktop screens.

## 2. Strict RTL/LTR Logical Styling (CRITICAL)
The site supports Persian (`fa`, RTL), Arabic (`ar`, RTL), and English (`en`, LTR).
- **NEVER** use physical directional classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `border-l`, `border-r`, `rounded-l`, `rounded-r`).
- **ALWAYS** use Tailwind logical properties:
  - Margin/Padding: `ms-`, `me-`, `ps-`, `pe-`
  - Positioning: `start-`, `end-`
  - Alignment: `text-start`, `text-end`
  - Borders/Radius: `border-s`, `border-e`, `rounded-s`, `rounded-e`
- Mirror directional icons (arrows, chevrons) automatically in RTL using `rtl:rotate-180` or logical icon helpers.

## 3. Internationalization (`next-intl`)
- **Zero Hardcoded Strings:** Every visible label, ARIA label, alt fallback, validation message, and metadata title MUST come from `next-intl` (`useTranslations` in Client, `getTranslations` in Server Components) or localized Payload CMS fields.
- Use `next/font` for locale-appropriate typography (e.g., Vazirmatn for `fa`/`ar`, Inter/Geist for `en`).

## 4. Motion & Animations
- Use **Motion** for subtle, architectural transitions (smooth fades, understated parallax, clean scroll reveals).
- Avoid bouncy, springy, or playful animations; keep easing smooth and refined (e.g., `cubic-bezier(0.22, 1, 0.36, 1)`).
- Respect `prefers-reduced-motion`.
