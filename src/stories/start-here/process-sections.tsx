import { DOCS, SUMMARIES, story } from "./tokens";
import { Callout, CardGrid, Cta, CtaRow, Decision, Hero, MiniCard, Shipped, type ShippedItem, Steps } from "./ui";

/**
 * Start Here › Process & roadmap — how a call becomes screens, what has shipped,
 * what is still open, and what's next. The shipped list is `git log --first-parent main`
 * (merges and squash commits), one plain line each, newest first.
 */

export const ProcessHero = () => (
    <Hero
        size="page"
        eyebrow="Process & roadmap"
        title="From a call with product to a live screen."
        lead="Each round starts with a call or a Loom, becomes a dated review folder and prototype screens, and goes live when it merges to main."
        chips={[`${SHIPPED.length} changes shipped since Jul 24, 2026`, "Latest: Nov 17", "4 open decisions"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.nov17Packages)}>
                    The newest review
                </Cta>
                <Cta kind="secondary" href={story(DOCS.howToReview)}>
                    How to review
                </Cta>
            </CtaRow>
        }
    />
);

export const ProcessSteps = () => (
    <Steps
        items={[
            { label: "Ask", title: "A call or a Loom", body: "Weston walks through what courses asked for, or records a Loom.", meta: "Weston and Justin" },
            {
                label: "Write it down",
                title: "A dated review folder",
                body: "A new folder in Reviews, opening on a Summary: what was asked, what's built, what's open.",
                meta: "Reviews",
            },
            {
                label: "Build",
                title: "Screens in Prototypes",
                body: "Built on the design system, filed under the product area they belong to.",
                meta: "Prototypes",
            },
            {
                label: "Merge",
                title: "A pull request to main",
                body: "Each round is one branch and one pull request, merged when it's ready to show.",
                meta: "GitHub",
            },
            { label: "Share", title: "Live on two sites", body: "GitHub Pages and Netlify both rebuild on every merge to main.", meta: "Pages and Netlify" },
        ]}
    />
);

const SHIPPED: ShippedItem[] = [
    { date: "2026-11-11", pr: 24, title: "Bay Sheet in two layouts, plus fixes from the MCG feedback file", href: story(SUMMARIES.nov11) },
    { date: "2026-10-28", pr: 23, title: "Products: every Products Beta screen in the Credits layout", href: story(SUMMARIES.products) },
    { date: "2026-10-27", pr: 22, title: "Credits: every Credits screen on one header, tabs and stacked layout", href: story(SUMMARIES.credits) },
    { date: "2026-10-27", pr: 21, title: "Punch Cards: final deliverables from the Oct 27 Loom and call", href: story(SUMMARIES.punchCards) },
    { date: "2026-10-27", pr: 20, title: "Punch cards: all vs specific items, Green fees renamed, three options for Weston" },
    { date: "2026-10-27", pr: 19, title: "Customer punch cards table: offering columns (1c)" },
    { date: "2026-10-20", pr: 18, title: "Customer punch cards table: caption line removed (1b)" },
    { date: "2026-10-19", pr: 17, title: "Customer punch cards table: flexible filters split into 1a and 1b" },
    { date: "2026-10-15", title: "Three customer punch card table prototypes" },
    { date: "2026-10-14", pr: 16, title: "Punch card builder: stacked layout (3D)" },
    { date: "2026-10-13", pr: 15, title: "Punch card builder: minutes for durations, plus two alternative concepts" },
    { date: "2026-10-13", pr: 14, title: "Punch card builder: creating a card with several items" },
    { date: "2026-10-02", pr: 13, title: "Combined Revenue and Combined Report with September data" },
    {
        date: "2026-10-01",
        pr: 12,
        title: "Today's Buck rebuilt as it ships (Migration V2), with three ideas per screen",
        href: story("migration-v2-global-nav--expanded"),
    },
    { date: "2026-09-30", pr: 11, title: "Every prototype hosted on GitHub Pages, with Netlify as backup" },
    { date: "2026-09-30", pr: 10, title: "More course imagery for sample screens" },
    {
        date: "2026-09-29",
        pr: 9,
        title: "Course Settings rebuilt from production, plus four concepts",
        href: story("prototypes-buck-v1-old-course-settings-original--full-screen"),
    },
    { date: "2026-08-07", pr: 8, title: "GitHub Pages deploy for Storybook restored" },
    { date: "2026-08-07", pr: 7, title: "The front page links to the live app" },
    { date: "2026-08-07", pr: 6, title: "Continuous deploy for the standalone app" },
    { date: "2026-08-07", pr: 5, title: "Color explorations, a navy brand, table density and a standalone app" },
    { date: "2026-08-06", pr: 4, title: "Deploys moved to Netlify only" },
    { date: "2026-08-06", pr: 3, title: "Netlify continuous deploy" },
    { date: "2026-07-28", pr: 2, title: "Orders: KPI tiles in a three-column grid" },
    { date: "2026-07-24", title: "README leads with the live Storybook" },
    { date: "2026-07-24", title: "GitHub Pages deploy for Storybook" },
    { date: "2026-07-24", pr: 1, title: "App Chrome, charts, a sample dashboard and 18 app screen groups", href: story(DOCS.screenIndex) },
    { date: "2026-07-24", title: "Buck design system set up: Untitled UI React, Tailwind v4, Storybook 10" },
];

export const ShippedList = () => <Shipped items={SHIPPED} />;

export const OpenDecisions = () => (
    <CardGrid min={420}>
        <Decision
            title="Records: sections or sub-tabs?"
            a={["Option A · sections", "Every former sub-tab becomes a section on one scrolling page."]}
            b={["Option B · sub-tabs", "The sub-tabs stay under the record header; each holds stacked sections."]}
            source="Asked in Reviews › Oct 27 · Credits. Built both ways for gift cards, rain checks, credit books and products."
            links={[
                ["Open A", story("credits-oct-27-gift-cards--option-a-sections")],
                ["Open B", story("credits-oct-27-gift-cards--option-b-sub-tabs")],
            ]}
        />
        <Decision
            title="The daily bay-booking limit counts…"
            a={["Bookings", "A golfer can make so many bookings a day, whatever their length."]}
            b={["Hours", "A golfer can book so many hours a day, across any number of bookings."]}
            source="Asked in Reviews › Nov 11 · Summary, with a second question: can every role override the limit?"
            links={[["See the warning", story("nov-11-2026-bay-sheet--daily-limit")]]}
        />
        <Decision
            title="Do repeating bookings need an end date?"
            a={["An end date", "Staff pick when a repeat stops."]}
            b={["12 weeks ahead", "As built: a repeat is written 12 weeks ahead, and can be cancelled whole."]}
            source="Asked in Reviews › Nov 11 · Summary."
            links={[["See a repeating booking", story("nov-11-2026-bay-sheet--details")]]}
        />
    </CardGrid>
);

export const ComingUp = () => (
    <>
        <CardGrid min={260}>
            <MiniCard eyebrow="1" title="Remap the web layouts" tone="subtle">
                Bring the existing golfer-facing web layouts across to CraneWeb, page by page.
            </MiniCard>
            <MiniCard eyebrow="2" title="Mobile: categories or search" tone="subtle">
                On a phone, shoppers find products through a category menu or a search.
            </MiniCard>
            <MiniCard eyebrow="3" title="Checkout with a shipping address" tone="subtle">
                Shipping orders need an address at checkout, so tax is charged for where the order goes (destination tax).
            </MiniCard>
        </CardGrid>
        <Callout tone="gray">
            <b>Timing isn't confirmed.</b> It depends on how big the tax work turns out to be. Raised on the Nov 11 call.
        </Callout>
    </>
);
