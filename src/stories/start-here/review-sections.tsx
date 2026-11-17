import heroArt from "./art/hero-bays.jpg";
import shotBayA from "./screens/bay-a.jpg";
import shotBayB from "./screens/bay-b.jpg";
import { DOCS, NETLIFY, PAGES, SUMMARIES, story } from "./tokens";
import { CardGrid, Code, Compare, Cta, CtaRow, Hero, MiniCard, Steps } from "./ui";

/**
 * Start Here › How to review — for Weston and for developers: where to start, how to
 * share a screen, how to compare concepts, where feedback goes, and where it all lives.
 * The hosted-prototype links here were carried over from the old Introduction page.
 */

export const ReviewHero = () => (
    <Hero
        size="page"
        eyebrow="How to review"
        title="Start at the newest Summary, then click through."
        lead="For Weston and for developers. Every review round opens on a one-page Summary that links to each screen it changed. Feedback goes in Linear, with the screen's link."
        chips={["For product and developers", "A link for every screen", "Sample data only"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.nov17Packages)}>
                    Open the newest Summary
                </Cta>
                <Cta kind="secondary" href={story(DOCS.screenIndex)}>
                    Screen index
                </Cta>
            </CtaRow>
        }
    />
);

export const ReviewSteps = () => (
    <Steps
        items={[
            {
                label: "Open",
                title: "The newest Reviews folder",
                body: "Reviews are listed newest first. Today that's Nov 17 · Lesson packages (punch-card style), then Nov 17 · Default clinic photos.",
                meta: "Sidebar › Reviews",
            },
            { label: "Read", title: "Its Summary", body: "What was asked, what was built, what changed on purpose, and the open questions.", meta: "One page" },
            {
                label: "Click",
                title: "Into each screen",
                body: "Every screen in a Summary is a link. Screens are clickable: open tabs, menus and panels.",
                meta: "Prototypes",
            },
            { label: "Reply", title: "In Linear", body: "One issue per point, with the screen's link pasted in.", meta: "Weston & Justin team" },
        ]}
    />
);

export const SidebarGuide = () => (
    <CardGrid min={290}>
        <MiniCard eyebrow="Everyone" title="Start Here" href={story(DOCS.overview)} cta="Overview" tone="subtle">
            What Buck's design system is, its rules, the roadmap, and this page.
        </MiniCard>
        <MiniCard eyebrow="Product" title="Reviews" href={story(SUMMARIES.nov17Packages)} cta="Newest summary" tone="subtle">
            One folder per round, newest first, each opening on a Summary. The place to start a review.
        </MiniCard>
        <MiniCard eyebrow="Product and developers" title="Prototypes" href={story(DOCS.screenIndex)} cta="Screen index" tone="subtle">
            The screens themselves, filed by product area: the full application first, then each area reworked in a review.
        </MiniCard>
        <MiniCard eyebrow="Developers" title="Design System" href={story(DOCS.styleGuide)} cta="Style guide" tone="subtle">
            Styles, components, App Chrome and account login: the parts every screen is built from.
        </MiniCard>
        <MiniCard eyebrow="Background" title="Research" href={story("migration-v2-global-nav--expanded")} cta="Today's Buck" tone="subtle">
            Today's Buck rebuilt as it ships, for comparing against, and the navigation proposal.
        </MiniCard>
        <MiniCard eyebrow="Reference" title="Archive" href={story(DOCS.archive)} cta="About the archive" tone="subtle">
            Superseded explorations. Starts collapsed; nothing in it needs a review.
        </MiniCard>
    </CardGrid>
);

export const Links = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="Share a screen" title="Copy the address bar">
            Every story has its own address, ending in <Code>?path=/story/…</Code> (pages end in <Code>?path=/docs/…</Code>). Paste it into Linear or Slack and
            it opens that exact screen, on GitHub Pages or Netlify.
        </MiniCard>
        <MiniCard eyebrow="Links last" title="Moving a story doesn't break its link">
            A story's link comes from its id, not its place in the sidebar. When folders were reorganized, every story kept its id, and moved pages forward to
            their new address.
        </MiniCard>
        <MiniCard eyebrow="Full screen" title="See a screen without Storybook around it">
            Use “Open in isolation mode” at the top right of a story, or press <Code>⌥ F</Code> for full screen. Press <Code>/</Code> to search the sidebar.
        </MiniCard>
    </CardGrid>
);

export const CompareBays = () => (
    <Compare
        items={[
            {
                img: shotBayA,
                label: "A · Bay columns",
                note: "Bays across, time down. Best for “which bay is free at 6?”",
                href: story("nov-17-2026-bay-sheet--concept-a"),
            },
            {
                img: shotBayB,
                label: "B · Tee sheet rows",
                note: "A row per half hour, with day stats on top. Best for “what's happening next?”",
                href: story("nov-17-2026-bay-sheet--concept-b"),
            },
        ]}
    />
);

export const Feedback = () => (
    <CardGrid min={240}>
        <MiniCard eyebrow="Where" title="Linear, Weston & Justin team" tone="brand">
            All Buck design feedback goes in Linear on the Weston & Justin team. Tag Justin on any design change.
        </MiniCard>
        <MiniCard eyebrow="What to include" title="The screen's link and its name" tone="brand">
            Paste the story link and name the screen as the sidebar does, e.g. “Bay Sheet › A · Bay columns”.
        </MiniCard>
        <MiniCard eyebrow="How" title="One point per issue" tone="brand">
            Keep it, change it, or a question. For a choice between options, say which one and why.
        </MiniCard>
    </CardGrid>
);

export const SampleData = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="Sample data" title="Every name and number is invented">
            Courses, golfers, staff, products, prices and totals are made up. This repo and Storybook are public, so no real customer data is ever used.
        </MiniCard>
        <MiniCard eyebrow="Clickable, not connected" title="Nothing is saved">
            Tabs open and close, menus and panels work, and Save shows what would happen. Nothing reaches a server, and reloading starts the screen over.
        </MiniCard>
    </CardGrid>
);

export const Hosted = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="This Storybook" title="GitHub Pages, with Netlify as backup">
            Both rebuild on every merge to main.
            <div className="mt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={PAGES}>GitHub Pages</Cta>
                    <Cta href={NETLIFY}>Netlify</Cta>
                </CtaRow>
            </div>
        </MiniCard>
        <MiniCard eyebrow="Standalone" title="The clickable app">
            Every Full application screen behind the real Global Nav. Click a nav item, or press ⌘K, and the screen swaps in place.
            <div className="mt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={`${PAGES}app/`}>GitHub Pages</Cta>
                    <Cta href={`${NETLIFY}app/`}>Netlify</Cta>
                </CtaRow>
            </div>
        </MiniCard>
        <MiniCard eyebrow="Standalone" title="Course Settings, before and after">
            Today's Golf Course Settings rebuilt from production, and four concepts for finding a setting faster.
            <div className="mt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={`${PAGES}course-settings/`}>Original</Cta>
                    <Cta href={`${PAGES}course-settings/concept-4-search-dialog`}>Concept 4</Cta>
                    <Cta href={story("prototypes-buck-v1-old-course-settings-concepts--relayout")}>In Storybook</Cta>
                </CtaRow>
            </div>
        </MiniCard>
    </CardGrid>
);
