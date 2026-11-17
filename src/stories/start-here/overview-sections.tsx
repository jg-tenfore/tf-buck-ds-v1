import heroArt from "./art/hero-course.jpg";
import shotTeeSheet from "./screens/app-tee-sheet.jpg";
import shotBayA from "./screens/bay-a.jpg";
import shotCredits from "./screens/credits-list.jpg";
import shotFeedback from "./screens/feedback-rounds.jpg";
import shotProducts from "./screens/products-list.jpg";
import shotPunch from "./screens/punch-list.jpg";
import { COUNTS, DOCS, SUMMARIES, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, ShotCard } from "./ui";

/**
 * Start Here › Overview — the page Storybook opens on. Sections are components so
 * the MDX stays a short outline; screenshots come from scripts/capture-intro-screens.mjs.
 */

export const OverviewHero = () => (
    <Hero
        eyebrow="Buck design system"
        title="Buck's screens and rules, in one place to review."
        lead="Buck is TenFore's back office for golf courses: tee sheet, simulator bays, pro shop products, credits, orders and reports. Every prototype screen and the design system it's built from live here, reviewed with product one dated round at a time."
        chips={[`${COUNTS.prototypes} prototype screens`, `${COUNTS.areas} app areas`, `${COUNTS.reviews} review rounds`, "Sample data only"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.nov17Photos)}>
                    Open the newest review
                </Cta>
                <Cta kind="secondary" href={story(DOCS.howToReview)}>
                    How to review
                </Cta>
            </CtaRow>
        }
        shots={[
            { img: shotBayA, label: "Bay Sheet · Nov 17", href: story("nov-17-2026-bay-sheet--concept-a") },
            { img: shotProducts, label: "Products · Oct 27", href: story("products-oct-27-products--list") },
            { img: shotCredits, label: "Gift Cards · Oct 27", href: story("credits-oct-27-gift-cards--list") },
        ]}
        caption="Live screens from the prototypes. Every course, golfer, product and figure is invented."
    />
);

/** The latest review rounds, newest first, each leading to its Summary and its key screens. */
export const WhatsNew = () => (
    <CardGrid min={220}>
        <MiniCard
            eyebrow="Nov 17 · Newest"
            title="Default clinic photos"
            href={story(SUMMARIES.nov17Photos)}
            cta="Summary"
            links={[
                ["Picker", story("nov-17-2026-default-clinic-photos--picker-default")],
                ["Template list", story("nov-17-2026-default-clinic-photos--template-list")],
            ]}
            tone="brand"
        >
            Six default photo sets for clinic templates: a course picks one in the template builder, and any template can use its own photo.
        </MiniCard>
        <MiniCard
            eyebrow="Nov 17"
            title="Bay sheet, round 2"
            href={story(SUMMARIES.nov17)}
            cta="Summary"
            links={[
                ["Layout A", story("nov-17-2026-bay-sheet--concept-a")],
                ["Fewer bays", story("nov-17-2026-bay-sheet--fewer-bays")],
            ]}
        >
            Bays share the width, drag a booking to move it, drag its edge to extend it, and booking starts on the sheet.
        </MiniCard>
        <MiniCard
            eyebrow="Nov 11"
            title="Bay sheet & feedback"
            href={story(SUMMARIES.nov11)}
            cta="Summary"
            links={[
                ["Layout A", story("nov-11-2026-bay-sheet--concept-a")],
                ["Layout B", story("nov-11-2026-bay-sheet--concept-b")],
            ]}
        >
            A visual bay sheet for simulator bays in two layouts, plus fixes for the Buck rows of the MCG feedback file.
        </MiniCard>
        <MiniCard
            eyebrow="Oct 27"
            title="Products"
            href={story(SUMMARIES.products)}
            cta="Summary"
            links={[["Products list", story("products-oct-27-products--list")]]}
        >
            Every Products Beta screen in the Credits layout, and the rule for primary and secondary actions.
        </MiniCard>
        <MiniCard
            eyebrow="Oct 27"
            title="Credits"
            href={story(SUMMARIES.credits)}
            cta="Summary"
            links={[["Gift cards", story("credits-oct-27-gift-cards--list")]]}
        >
            Gift cards, rain checks, credit books and customer punch cards on one header, tabs and stacked layout.
        </MiniCard>
        <MiniCard
            eyebrow="Oct 27"
            title="Punch cards"
            href={story(SUMMARIES.punchCards)}
            cta="Summary"
            links={[["Customer cards", story("prototypes-punch-cards-customer--list")]]}
        >
            The final punch card deliverables: the customer list, the products list, and create and edit.
        </MiniCard>
    </CardGrid>
);

export const AreaCards = () => (
    <CardGrid min={300}>
        <ShotCard
            shot={shotBayA}
            badge="Newest"
            eyebrow={`Simulator Bays · ${COUNTS.baySheet} screens`}
            title="Bay Sheet"
            body="Every bay for the day on one sheet: book, repeat, block a bay, add a note. Two layouts to compare, both opening the same booking panel."
            note={
                <>
                    <b className="font-semibold text-secondary">Look at:</b> A against B, the overlap and daily-limit warnings.
                </>
            }
            href={story("nov-17-2026-bay-sheet--concept-a")}
            cta="Open layout A"
            links={[["Layout B", story("nov-17-2026-bay-sheet--concept-b")]]}
        />
        <ShotCard
            shot={shotProducts}
            eyebrow={`Products · ${COUNTS.products} screens`}
            title="Products"
            body="Products, combos, price stickers, groups, menus, rewards, modifiers, discount types and punch cards, in today's Products menu order."
            note={
                <>
                    <b className="font-semibold text-secondary">Look at:</b> the Actions menu beside the primary button, and Option A against B in a record.
                </>
            }
            href={story("products-oct-27-products--list")}
            cta="Open Products"
            links={[["Summary", story(SUMMARIES.products)]]}
        />
        <ShotCard
            shot={shotCredits}
            eyebrow={`Credits · ${COUNTS.credits} screens`}
            title="Credits"
            body="Gift cards, rain checks, payment sources, customer punch cards and credit books, from Reports › Credits."
            note={
                <>
                    <b className="font-semibold text-secondary">Look at:</b> records opening as tabs, Transfer, and the unsaved-changes warning.
                </>
            }
            href={story("credits-oct-27-gift-cards--list")}
            cta="Open Gift Cards"
            links={[["Summary", story(SUMMARIES.credits)]]}
        />
        <ShotCard
            shot={shotPunch}
            eyebrow={`Punch Cards · ${COUNTS.punchCards} screens`}
            title="Punch Cards"
            body="The punch card list in Products, plus the final deliverables: customer punch cards and building a card item by item."
            note={
                <>
                    <b className="font-semibold text-secondary">Look at:</b> adding an item step by step, and how a card reads when it's full.
                </>
            }
            href={story("products-oct-27-punch-cards--list")}
            cta="Open the list"
            links={[
                ["Customer cards", story("prototypes-punch-cards-customer--list")],
                ["Card products", story("prototypes-punch-card-products-list--list")],
            ]}
        />
        <ShotCard
            shot={shotTeeSheet}
            eyebrow={`Full application · ${COUNTS.fullApplication} screens`}
            title="The whole app, area by area"
            body={`The original app screens in all ${COUNTS.areas} Global Nav areas, from the Daily Tee Sheet to Admin. The baseline the newer rounds build on.`}
            note={
                <>
                    <b className="font-semibold text-secondary">Look at:</b> the Screen index, which lists every screen by area.
                </>
            }
            href={story(DOCS.screenIndex)}
            cta="Screen index"
            links={[["Daily Tee Sheet", story("app-screens-golf--daily-tee-sheet")]]}
        />
        <ShotCard
            shot={shotFeedback}
            eyebrow={`MCG Feedback Fixes · ${COUNTS.feedbackFixes} screens`}
            title="Fixes from the feedback file"
            body="Search on Rounds by Customer and the tee sheet reports, refunded no-shows kept in history, and the All Orders filter kept across courses."
            href={story("nov-11-2026-feedback--rounds-search")}
            cta="Open the first fix"
            links={[["Summary", story(SUMMARIES.nov11)]]}
        />
    </CardGrid>
);

/** The other Start Here pages. */
export const NextPages = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="The rules" title="Style guide" href={story(DOCS.styleGuide)} cta="Read the rules" tone="subtle">
            Tokens, the page header, tabs, the actions rule, slide-overs and sample data, each linked to its Design System page.
        </MiniCard>
        <MiniCard eyebrow="The plan" title="Process & roadmap" href={story(DOCS.process)} cta="See the roadmap" tone="subtle">
            How a call becomes screens, everything shipped so far, open decisions and what's coming.
        </MiniCard>
        <MiniCard eyebrow="Your turn" title="How to review" href={story(DOCS.howToReview)} cta="Start reviewing" tone="subtle">
            Where to start, how to share a screen, how to compare concepts and where feedback goes.
        </MiniCard>
        <MiniCard eyebrow="Every screen" title="Screen index" href={story(DOCS.screenIndex)} cta="Open the index" tone="subtle">
            {`All ${COUNTS.fullApplication} Full application screens, grouped in the Global Nav's order.`}
        </MiniCard>
    </CardGrid>
);

export const Folders = () => (
    <CardGrid min={290}>
        <MiniCard eyebrow="1 · You are here" title="Start Here" tone="brand">
            This page, the style guide, the process and roadmap, and how to review.
        </MiniCard>
        <MiniCard eyebrow="2" title="Prototypes" href={story(DOCS.screenIndex)} cta="Screen index">
            The clickable product: the full application, then Credits, Products, Bay Sheet, Punch Cards, Course Settings and the feedback fixes.
        </MiniCard>
        <MiniCard eyebrow="3" title="Design System" href={story("foundations-colors--brand")} cta="Colors">
            Styles, components, the App Chrome (Global Nav, Command Menu) and the account login screens.
        </MiniCard>
        <MiniCard eyebrow="4" title="Reviews" href={story(SUMMARIES.nov17Photos)} cta="Newest summary">
            One folder per review round, newest first. Each opens on a Summary: what was asked, what was built, what's open.
        </MiniCard>
        <MiniCard eyebrow="5" title="Research" href={story("migration-v2-global-nav--expanded")} cta="Today's Buck">
            Today's Buck rebuilt as it ships (Migration V2), and the navigation proposal.
        </MiniCard>
        <MiniCard eyebrow="6" title="Archive" href={story(DOCS.archive)} cta="About the archive">
            Superseded explorations, kept for reference. The folder starts collapsed.
        </MiniCard>
    </CardGrid>
);
