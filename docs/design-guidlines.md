# Design & UI Guidelines

## UI/UX Inspiration (Crucial)

The UI/UX, visual identity, layout, and overall feel of the website MUST closely resemble and be inspired by these two premium industry leaders:

1. **Caesarstone:** [https://www.caesarstoneus.com/](https://www.caesarstoneus.com/)
2. **Breton:** [https://breton.it/](https://breton.it/)
   _Key characteristics to mimic:_ Premium, industrial yet modern, minimalist, large high-quality imagery, sophisticated typography, and ample white space.

## Styling Approach

- Use **Tailwind CSS** for all styling. Avoid custom CSS files.
- Use **Shadcn UI** for base components (buttons, inputs, dialogs, etc.). Customize them via Tailwind configuration to match the premium industrial look.
- Use **Framer Motion** for smooth, professional page transitions, scroll animations, and interactive component animations (avoid overly bouncy or playful animations; keep them elegant).

## Responsive Design

- Mobile-first approach. Ensure all pages look exceptional and function flawlessly on mobile, tablet, and desktop.

## Internationalization & RTL/LTR

- The website supports both RTL and LTR.
- **Crucial Rule:** Use logical properties in Tailwind when necessary (e.g., `ms-` instead of `ml-`, `ps-` instead of `pl-`) to ensure layout flips correctly between RTL and LTR without extra code.
- Fonts: Configure specific fonts for Persian/Arabic (e.g., Vazirmatn or custom font) and English (e.g., Geist or Inter) via `next/font`.

## Forms

- Always use `react-hook-form` connected with `zod` resolver for validation.
- Show clear, professionally styled validation error messages below inputs.
