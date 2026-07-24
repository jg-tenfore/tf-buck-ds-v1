# Buck Design System (`tf-buck-ds-v1`)

Tenfore's **Buck** design system — component library, design foundations, and app screens, documented in Storybook. It shares its color palette and typography with the Fox design system, built on React Aria + Tailwind CSS v4.

## 📖 Storybook

**Live:** **https://jg-tenfore.github.io/tf-buck-ds-v1/**

Storybook is the source of truth for the design system. Run it locally:

```bash
npm install
npm run storybook   # http://localhost:6018
```

It is deployed to GitHub Pages automatically on every push to `main`.

## Stack

- **React 19** + **TypeScript**
- **Next.js 16** (App Router)
- **Tailwind CSS v4** — a semantic, light/dark-aware token system (`src/styles/theme.css`, `palette.css`)
- **React Aria Components** for accessibility and behavior (imported as `Aria*`)
- **Storybook 10** (`@storybook/nextjs-vite`) for documentation, with **Recharts** for data visualization

## Scripts

| Script | What it does |
| --- | --- |
| `npm run storybook` | Start Storybook on port 6018 |
| `npm run build-storybook` | Build the static Storybook site to `storybook-static/` |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build of the Next.js app |

## Storybook structure

- **Foundations** — Colors, Typography, Spacing, Radius, Border, Effect Styles, Icons, Logos, and **Data Visualization** rules
- **Components** — Actions, Forms, Feedback & Status, Layout & Structure, **Charts & Data**, Media & Visuals, Navigation
- **App Chrome** — Global Nav (dual-tier), Command Menu (⌘K), and the Navigation Proposal
- **App Screens** — the Sagamore-branded Dashboard plus 18 back-office screen groups (Golf, Reports, Customers, Products, …), each rendered inside the nav shell
- **Sign in / Sign up** — Sign up, Log in, Forgot password, Verification

## Project layout

```
src/
├── components/        # base, application, foundations, marketing, shared-assets
├── stories/           # Storybook stories (incl. stories/screens for App Screens)
├── styles/            # theme.css, palette.css, typography.css, globals.css
├── hooks/  utils/  providers/  data/
.storybook/            # main.ts, preview.tsx
images/                # Sagamore course imagery + Pro Shop store catalog (served via staticDirs)
.github/workflows/     # deploy-storybook.yml (build + deploy to GitHub Pages)
```

## Conventions

- Files are **kebab-case**; React Aria imports are prefixed **`Aria*`**.
- Style with **semantic tokens** (`text-secondary`, `bg-primary`) — never literal color classes.
- Charts follow the rules in **Foundations → Data Visualization**; reuse the shared `chart-kit`.

See `CLAUDE.md` for the full component and styling reference.
