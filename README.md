# Buck Design System (`tf-buck-ds-v1`)

Tenfore's **Buck** design system — component library and design foundations, documented in Storybook.
It shares its color palette and typography with the Fox design system, on the same Untitled UI +
Tailwind CSS v4 + React Aria foundation.

## Stack

- **React 19** + **TypeScript**
- **Next.js 16** (App Router)
- **Tailwind CSS v4** with a semantic, light/dark-aware token system (`src/styles/theme.css`, `palette.css`)
- **React Aria Components** for accessibility (imported as `Aria*`)
- **Storybook 10** (`@storybook/nextjs-vite`) for documentation

## Getting started

```bash
npm install

# Storybook (design system docs) — http://localhost:6018
npm run storybook

# Next.js app dev server
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run storybook` | Start Storybook on port 6018 |
| `npm run build-storybook` | Build the static Storybook site to `storybook-static/` |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build of the Next.js app |

## Structure

```
src/
├── components/        # base, application, foundations, marketing, shared-assets
├── stories/           # Storybook: Foundations, Components, Sign in / Sign up
├── styles/            # theme.css, palette.css, typography.css, globals.css
├── hooks/  utils/  providers/  data/
.storybook/            # main.ts, preview.tsx
```

## Storybook categories

- **Foundations** — Colors, Typography, Spacing, Radius, Border, Effect Styles, Icons, Logos
- **Components** — Actions, Forms, Feedback & Status, Layout & Structure, Media & Visuals, Navigation
- **Sign in / Sign up** — Log in, Sign up, Forgot password, Verification

## Conventions

- Files are **kebab-case**; React Aria imports are prefixed **`Aria*`**.
- Style with **semantic tokens** (`text-secondary`, `bg-primary`) — never literal color classes.

See `CLAUDE.md` for the full component and styling reference.
