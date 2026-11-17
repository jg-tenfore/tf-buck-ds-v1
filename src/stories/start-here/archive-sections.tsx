import shotIdeas from "./screens/archive-ideas.jpg";
import { DOCS, SUMMARIES, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, Split } from "./ui";

/**
 * Archive › About the archive — what the Archive holds and why it's kept. Counts are
 * stories per folder from Storybook's index.json (Nov 17, 2026); dates from git log.
 */

export const ArchiveHero = () => (
    <Hero
        size="page"
        eyebrow="Archive"
        title="Earlier explorations, kept for reference."
        lead="Work that a later round replaced. Nothing here needs a review, and nothing here should be built. It stays so the reasoning behind today's screens is one click away, and so links shared at the time still open."
        chips={["66 stories", "3 folders", "Starts collapsed"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(DOCS.overview)}>
                    Back to the Overview
                </Cta>
                <Cta kind="secondary" href={story(SUMMARIES.nov17Packages)}>
                    The newest review
                </Cta>
            </CtaRow>
        }
    />
);

export const ArchiveFolders = () => (
    <CardGrid min={290}>
        <MiniCard
            eyebrow="Aug 2026 · 6 stories"
            title="Early explorations"
            links={[
                ["Dashboard", story("explorations-dashboard--green")],
                ["Tee Time Booking", story("explorations-tee-time-booking--green")],
            ]}
        >
            Green, navy and green-and-navy color explorations of the dashboard and tee time booking. Replaced by Buck's green brand in Design System › Styles.
        </MiniCard>
        <MiniCard
            eyebrow="Oct 2026 · 28 stories"
            title="Migration V2 Ideas"
            links={[
                ["Punch Cards ideas", story("migration-v2-ideas-punch-cards--original")],
                ["Today's Buck", story("migration-v2-global-nav--expanded")],
            ]}
        >
            Three ideas each for seven of today's screens, beside the original. The originals are kept, as they ship, in Research › Today's Buck.
        </MiniCard>
        <MiniCard
            eyebrow="Oct 2026 · 32 stories"
            title="Punch Card explorations"
            links={[
                ["Final deliverables", story(SUMMARIES.punchCards)],
                ["Combinations", story("prototypes-punch-cards-v2-combinations--all-combinations")],
            ]}
        >
            Builder layouts 3B, 3C and 3D, eight sample card combos, and the customer punch card table explorations. Replaced by the Oct 27 final deliverables
            in Prototypes › Punch Cards.
        </MiniCard>
    </CardGrid>
);

export const ArchiveReasons = () => (
    <CardGrid min={240}>
        <MiniCard eyebrow="1" title="The reasoning stays visible" tone="subtle">
            When someone asks why a screen looks the way it does, the options that lost are one click away.
        </MiniCard>
        <MiniCard eyebrow="2" title="Old links still open" tone="subtle">
            A story moves here with its id unchanged, so a link pasted into Linear or Slack at the time still works.
        </MiniCard>
        <MiniCard eyebrow="3" title="It stays out of the way" tone="subtle">
            The folder starts collapsed in the sidebar and sits last. Superseded work moves here instead of being deleted.
        </MiniCard>
    </CardGrid>
);

export const ArchiveExample = () => (
    <Split
        eyebrow="Archive › Migration V2 Ideas"
        title="An idea for today's Punch Cards report"
        shot={shotIdeas}
        caption="Punch Cards · Idea 1 of three"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("migration-v2-ideas-punch-cards--idea-1")}>Open it</Cta>
                <Cta href={story("credits-oct-27-customer-punch-cards--list")}>What replaced it</Cta>
            </CtaRow>
        }
    >
        One of three ideas for today's Punch Cards report, built beside the original in October. Customer punch cards were later redesigned in Prototypes ›
        Credits and Prototypes › Punch Cards.
    </Split>
);
