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

## ▶ Prototypes

Clickable prototypes built from the design system, hosted on **GitHub Pages** with **Netlify** as a backup (both rebuild on every merge to `main`). Each is also listed on the Storybook **Introduction** page.

Run them locally with `npm run app` (Tenfore App, port 6019) and `npm run proto:course-settings` (Course Settings + concepts, port 6020).

| Prototype                                   | What it is                                                                                                                                                                                          | Open it                                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tenfore App**                             | Every App Screen stitched together behind the real Global Nav; click through or press ⌘K.                                                                                                           | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/app/) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/app/)                                                                       |
| **Buck V1 Old – Course Settings**           | The legacy Golf Course Settings screen (The Dunes of Delgado PROD) rebuilt from production screenshots — legacy sidebar, 17 accordion sections, every field. The baseline for the concepts below.   | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/course-settings/) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/course-settings/)                                               |
| **Concept 1 · Re-laid out**                 | Same settings, redesigned per section to use less space: payment types as chips + _Manage_ dialog, tax-rate matrix, one merged fee table, compact switch grids, disclaimer previews, paged tablets. | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/course-settings/concept-1-relayout) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/course-settings/concept-1-relayout)           |
| **Concept 2 · Dynamic search**              | Search rail + narrower column. Unrelated settings dim to 10% (or hide) and matches highlight in place; understands goals like “block employees from refunds”.                                       | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/course-settings/concept-2-search) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/course-settings/concept-2-search)               |
| **Concept 3 · Command menu**                | The original screen with a big search bar above it; Google Admin–style grouped results (Ask TenFore AI, Sections, Settings, Records) that open the right section.                                   | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/course-settings/concept-3-command-menu) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/course-settings/concept-3-command-menu)   |
| **Concept 4 · Re-laid out + search dialog** | Concept 1’s layout with Concept 3’s search as a dialog — ⌘K, arrow to a result, ↵ jumps straight to the setting.                                                                                    | [GitHub Pages](https://jg-tenfore.github.io/tf-buck-ds-v1/course-settings/concept-4-search-dialog) · [Netlify backup](https://tf-buck-ds-v1.netlify.app/course-settings/concept-4-search-dialog) |

All four concepts are also in Storybook under _Prototypes / Buck V1 Old – Course Settings / Concepts_. Concept 2 and 3 links accept `?q=…` to open mid-search (e.g. `/concept-3-command-menu?q=tax`).

## Stack

- **React 19** + **TypeScript**
- **Next.js 16** (App Router)
- **Tailwind CSS v4** — a semantic, light/dark-aware token system (`src/styles/theme.css`, `palette.css`)
- **React Aria Components** for accessibility and behavior (imported as `Aria*`)
- **Storybook 10** (`@storybook/nextjs-vite`) for documentation, with **Recharts** for data visualization

## Scripts

| Script                                        | What it does                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run storybook`                           | Start Storybook on port 6018                                                                        |
| `npm run build-storybook`                     | Build the static Storybook site to `storybook-static/`                                              |
| `npm run dev`                                 | Start the Next.js dev server                                                                        |
| `npm run build`                               | Production build of the Next.js app                                                                 |
| `npm run app`                                 | Tenfore App prototype (Vite) on port 6019                                                           |
| `npm run build-app`                           | Build the Tenfore App prototype to `dist-app/`                                                      |
| `npm run proto:course-settings`               | Buck V1 Old – Course Settings prototype + concepts on port 6020                                     |
| `npm run build-proto:course-settings`         | Build that prototype to `dist-buck-v1-old/`                                                         |
| `npm run build-prototypes:pages` / `:netlify` | Build both prototypes into `storybook-static/` for GitHub Pages / Netlify (after `build-storybook`) |

## Storybook structure

- **Introduction** — overview plus a card for every prototype
- **Foundations** — Colors, Typography, Spacing, Radius, Border, Effect Styles, Icons, Logos, and **Data Visualization** rules
- **Explorations** — color treatments (Green / Navy / Green & Navy) of key screens
- **Components** — Actions, Forms, Feedback & Status, Layout & Structure, **Charts & Data**, Media & Visuals, Navigation
- **App Chrome** — Global Nav (dual-tier), Command Menu (⌘K), and the Navigation Proposal
- **App Screens** — the Sagamore-branded Dashboard plus 18 back-office screen groups (Golf, Reports, Customers, Products, …), each rendered inside the nav shell
- **Sign in / Sign up** — Sign up, Log in, Forgot password, Verification
- **Prototypes** — _Buck V1 Old – Course Settings_: the Original rebuild and Concepts 1–4

## Project layout

```
src/
├── components/        # base, application, foundations, marketing, shared-assets
├── components/application/buck-v1-old/   # Course Settings rebuild, search engine + concepts
├── stories/           # Storybook stories (incl. stories/screens for App Screens, stories/prototypes)
├── styles/            # theme.css, palette.css, typography.css, globals.css
├── hooks/  utils/  providers/  data/
.storybook/            # main.ts, preview.tsx
standalone/            # Tenfore App prototype entry (npm run app)
prototypes/            # Course Settings prototype entry (npm run proto:course-settings)
public/buck-v1-old/    # Course Settings imagery
images/                # Sagamore course imagery + Pro Shop store catalog (served via staticDirs)
.github/workflows/     # deploy-pages.yml (Storybook + prototypes → GitHub Pages), deploy-netlify.yml (same → Netlify),
                       # deploy-app-netlify.yml (Tenfore App → tf-buck-prototype.netlify.app)
```

## Conventions

- Files are **kebab-case**; React Aria imports are prefixed **`Aria*`**.
- Style with **semantic tokens** (`text-secondary`, `bg-primary`) — never literal color classes.
- Charts follow the rules in **Foundations → Data Visualization**; reuse the shared `chart-kit`.

See `CLAUDE.md` for the full component and styling reference.
