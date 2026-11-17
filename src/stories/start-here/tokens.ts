import type { StaticImageData } from "next/image";

/**
 * Link helpers and shared facts for Storybook's Start Here pages (see ./ui.tsx).
 * Colours come from Buck's semantic Tailwind tokens, not from here.
 */

/** A Storybook page or story by id: docs ids end in `--docs`. */
export const story = (id: string) => `./?path=/${id.endsWith("--docs") ? "docs" : "story"}/${id}`;

/** The two places this Storybook is published; both redeploy on every merge to main. */
export const PAGES = "https://jg-tenfore.github.io/tf-buck-ds-v1/";
export const NETLIFY = "https://tf-buck-ds-v1.netlify.app/";

/**
 * A static image import as a URL. Storybook's Next.js framework hands back an
 * image object ({ src, width, height }); plain Vite hands back a string.
 */
export type ImageSource = string | StaticImageData;
export const src = (img: ImageSource) => (typeof img === "string" ? img : img.src);

/** The Start Here pages and the other docs pages they point at. */
export const DOCS = {
    overview: "start-here-overview--docs",
    styleGuide: "start-here-style-guide--docs",
    process: "start-here-process-roadmap--docs",
    howToReview: "start-here-how-to-review--docs",
    screenIndex: "prototypes-full-application-screen-index--docs",
    archive: "archive-about-the-archive--docs",
    dataViz: "design-system-styles-data-visualization--docs",
} as const;

/** Each review round's Summary page, newest first. */
export const SUMMARIES = {
    nov17: "nov-17-2026-overview--overview",
    nov11: "nov-11-2026-overview--overview",
    products: "products-oct-27-overview--overview",
    credits: "credits-oct-27-overview--overview",
    punchCards: "prototypes-punch-cards-overview--final-deliverables",
} as const;

/** Story counts, taken from Storybook's index.json on Nov 17, 2026. */
export const COUNTS = {
    prototypes: 187,
    fullApplication: 74,
    areas: 19,
    products: 40,
    credits: 21,
    baySheet: 7,
    punchCards: 32,
    courseSettings: 6,
    feedbackFixes: 7,
    reviews: 5,
} as const;
