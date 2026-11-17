import heroArt from "./art/hero-proshop.jpg";
import shotBook from "./screens/bay-book.jpg";
import shotUnsaved from "./screens/credits-unsaved.jpg";
import shotProducts from "./screens/products-list.jpg";
import shotRecord from "./screens/products-record.jpg";
import { DOCS, story } from "./tokens";
import { CardGrid, Code, Cta, CtaRow, Hero, MiniCard, Points, Split } from "./ui";

/**
 * Start Here › Style guide — Buck's rules, each beside a screen that follows it and
 * linked to the Design System page that shows it. Every rule was checked against the
 * code it describes:
 *   products-oct-27/kit.tsx   ActionBar, RecordHeader, MAX_VISIBLE_ACTIONS, ConfirmDeleteModal
 *   credits-oct-27/kit.tsx    CreditsHeader, useRecordTabs, UnsavedChangesModal
 *   nov-11-2026/bay-panels.tsx SlideOver (max-w-[560px])
 *   base/buttons/button.tsx   disabled:opacity-50
 */

export const StyleHero = () => (
    <Hero
        size="page"
        eyebrow="Style guide"
        title="The rules every Buck screen follows."
        lead="Short on purpose. Each rule sits beside a screen that follows it and links to the Design System page that shows it. Settled in the Oct 27 and Nov 11 reviews."
        chips={["Tokens", "Page header", "Tabs", "Actions", "Records", "Slide-overs", "Sample data"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("foundations-colors--brand")}>
                    Colors and tokens
                </Cta>
                <Cta kind="secondary" href={story("products-oct-27-products--list")}>
                    See it in Products
                </Cta>
            </CtaRow>
        }
    />
);

export const TokenRule = () => (
    <CardGrid min={300}>
        <MiniCard
            eyebrow="1 · Color"
            title="Semantic tokens only"
            links={[
                ["Colors", story("foundations-colors--brand")],
                ["Typography", story("foundations-typography--scale")],
            ]}
        >
            Style with what a color is for: <Code>text-primary</Code>, <Code>bg-secondary</Code>, <Code>fg-brand-primary</Code>, <Code>border-secondary</Code>.
            Never a raw shade like <Code>text-gray-900</Code>. Brand green <Code>brand-600</Code> (rgb 50 131 85) is the primary interactive color. Type is
            Inter.
        </MiniCard>
        <MiniCard
            eyebrow="2 · Frame"
            title="Every screen sits in the Global Nav"
            links={[
                ["Global Nav", story("app-chrome-global-nav--current-navigation")],
                ["Command Menu", story("app-chrome-command-menu--default")],
            ]}
        >
            Prototypes open inside Buck's own navigation, with the course switcher top right, so a screen is always reviewed where it will live. New pages are
            added to the nav the way the product would add them (Bay Sheet leads Simulator Bays, as Tee Sheet leads Golf).
        </MiniCard>
    </CardGrid>
);

export const HeaderRule = () => (
    <Split
        n={3}
        eyebrow="Page header"
        title="Breadcrumbs, title, Beta badge, description, actions top right"
        shot={shotProducts}
        caption="Products · Prototypes › Products"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-navigation-breadcrumbs--playground")}>Breadcrumbs</Cta>
                <Cta href={story("components-feedback-status-badge--playground")}>Badge</Cta>
                <Cta href={story("products-oct-27-products--list")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Breadcrumbs first,", "then the page title with a Beta badge, and one line saying what the page is for."],
                ["The page's actions sit top right,", "across from the title, never in a toolbar below it."],
                ["The same header on every page", "in Credits, Products and the Bay Sheet."],
            ]}
        />
    </Split>
);

export const TabsRule = () => (
    <Split
        n={4}
        eyebrow="Tabs"
        title="The list is the first tab; records open beside it"
        shot={shotUnsaved}
        caption="Gift Cards · closing a tab with unsaved changes"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-navigation-tabs--playground")}>Tabs</Cta>
                <Cta href={story("components-actions-modal--default")}>Modal</Cta>
                <Cta href={story("credits-oct-27-gift-cards--unsaved-changes")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["The list is always the first tab.", "Modifiers is the one page with two lists, so it has two."],
                ["Each record opens in its own closable tab", "beside the list. A new record opens as a Draft tab."],
                ["Unsaved changes are guarded.", "Closing the tab or pressing Cancel asks before anything is thrown away."],
                ["Edits that were pop-ups in production", "(Edit modifier group, Add menu) are tabs now, like every other record."],
            ]}
        />
    </Split>
);

export const ActionsRule = () => (
    <Split
        n={5}
        eyebrow="Actions"
        title="One primary action, always rightmost"
        shot={shotRecord}
        caption="A product record · Cancel, Actions ▾, Save at the top"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-actions-button--playground")}>Button</Cta>
                <Cta href={story("components-actions-dropdown--playground")}>Dropdown</Cta>
                <Cta href={story("products-oct-27-products--option-a-sections")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                [
                    "On a page:",
                    "up to three actions show as buttons. More than three, and every secondary action moves into an Actions ▾ menu right beside the primary.",
                ],
                [
                    "In a record:",
                    "Cancel and Save always show. One extra action is a button before Cancel; two or more go in Actions ▾ between Cancel and Save.",
                ],
                ["Destructive last.", "Delete or Void sits last in the menu, in red, and always asks to confirm."],
                ["Export is one menu", "(Excel, CSV, PDF, Copy, Print), as its own button or a section inside Actions."],
            ]}
        />
    </Split>
);

export const RecordRule = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="6 · Records" title="Save and Cancel at the top" href={story("credits-oct-27-gift-cards--option-a-sections")} cta="See a record">
            A record's Save and Cancel sit in its header, never in a bar at the bottom, so they're in reach without scrolling. The body is full-width sections
            in one column, nothing side by side.
        </MiniCard>
        <MiniCard eyebrow="7 · Records" title="Transfer is a button, never a field" href={story("credits-oct-27-gift-cards--transfer")} cta="See a transfer">
            Punch cards, gift cards and rain checks change hands with a dedicated Transfer button. Every transfer is listed in the record's history.
        </MiniCard>
    </CardGrid>
);

export const SlideOverRule = () => (
    <Split
        n={8}
        eyebrow="Slide-overs"
        title="Quick edits on dense screens open a 560px panel"
        shot={shotBook}
        caption="Book a bay · the sheet stays in view"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-actions-slideout-menu--default")}>Slideout Menu</Cta>
                <Cta href={story("nov-17-2026-bay-sheet--book")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Where the page is the point,", "like the bay sheet, booking or blocking opens a panel from the right, so the sheet stays visible."],
                ["560px wide,", "the same width for every panel on the screen."],
                ["The footer is Cancel and one primary action,", "nothing else."],
            ]}
        />
    </Split>
);

export const SmallRules = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="9" title="Disabled is 50% opacity" href={story("components-actions-button--playground")} cta="Button">
            <Code>disabled:opacity-50</Code> with a not-allowed cursor. No separate disabled colors.
        </MiniCard>
        <MiniCard eyebrow="10" title="100ms linear transitions" href={story("components-actions-button--playground")} cta="Button">
            Hover and color changes use <Code>transition duration-100 ease-linear</Code>: quick, never showy.
        </MiniCard>
        <MiniCard eyebrow="11" title="Invented data only" href={story(DOCS.howToReview)} cta="What sample data means">
            The repo and Storybook are public. Every course, golfer, product and figure is made up. No real customer data, ever.
        </MiniCard>
        <MiniCard eyebrow="12" title="Patterns, not product names">
            When an idea comes from elsewhere, describe the pattern ("a search that dims what doesn't match"), never another company's product.
        </MiniCard>
    </CardGrid>
);
