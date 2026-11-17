import { COUNTS, PAGES, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, LinkCard } from "./ui";

/**
 * Prototypes › Full application › Screen index — every Full application screen, grouped by
 * Global Nav area in the nav's own order. Written out by hand from Storybook's index.json
 * (titles under Prototypes/Full application/, Nov 17, 2026): MDX can't read the index at
 * build time. Add a row here when a screen is added.
 */

interface Area {
    area: string;
    /** [story name, story id] */
    screens: [string, string][];
}

export const AREAS: Area[] = [
    {
        area: "Dashboard",
        screens: [["Default", "app-screens-dashboard--default"]],
    },
    {
        area: "My Golf Course",
        screens: [
            ["Dashboard", "app-screens-my-golf-course--dashboard"],
            ["What's New", "app-screens-my-golf-course--whats-new"],
            ["Departments", "app-screens-my-golf-course--departments"],
            ["Locations", "app-screens-my-golf-course--locations"],
            ["Settings", "app-screens-my-golf-course--settings"],
            ["Integrations", "app-screens-my-golf-course--integrations"],
        ],
    },
    {
        area: "Company",
        screens: [
            ["Settings", "app-screens-company--settings"],
            ["Duplicate Customers", "app-screens-company--duplicate-customers"],
        ],
    },
    {
        area: "Orders",
        screens: [["All Orders", "app-screens-orders--all-orders"]],
    },
    {
        area: "Reports",
        screens: [
            ["GL — Codes", "app-screens-reports--general-ledger-codes"],
            ["GL — Report", "app-screens-reports--general-ledger-report"],
            ["User Activities", "app-screens-reports--user-activities"],
            ["Waitlists", "app-screens-reports--waitlists"],
            ["Credits — Gift Cards", "app-screens-reports--gift-cards"],
            ["Credits — Rain Checks", "app-screens-reports--rain-checks"],
            ["Credits — Payment Sources", "app-screens-reports--payment-sources"],
            ["Credits — Punch Cards", "app-screens-reports--punch-cards"],
            ["Charges — Statements", "app-screens-reports--statements"],
            ["Charges — Aging", "app-screens-reports--aging"],
            ["Revenue — Sales by Category", "app-screens-reports--sales-by-category"],
            ["Revenue — Combined Report", "app-screens-reports--combined-report"],
            ["Revenue — Discounts & Promos", "app-screens-reports--discounts-promos"],
            ["Rounds — Weekly", "app-screens-reports--weekly-rounds"],
            ["Rounds — Monthly", "app-screens-reports--monthly-rounds"],
        ],
    },
    {
        area: "Golf",
        screens: [
            ["Daily Tee Sheet", "app-screens-golf--daily-tee-sheet"],
            ["Schedules", "app-screens-golf--schedules"],
            ["Auto-Block Templates", "app-screens-golf--auto-block-templates"],
            ["Starter Sheet", "app-screens-golf--starter-sheet"],
            ["Fees", "app-screens-golf--fees"],
        ],
    },
    {
        area: "Simulator Bays",
        screens: [
            ["Bays", "app-screens-simulator-bays--bays"],
            ["Fees", "app-screens-simulator-bays--fees"],
            ["Schedules", "app-screens-simulator-bays--schedules"],
            ["Bookings", "app-screens-simulator-bays--bookings"],
            ["Settings", "app-screens-simulator-bays--settings"],
        ],
    },
    {
        area: "Activities",
        screens: [
            ["Resources", "app-screens-activities--resources"],
            ["Fees", "app-screens-activities--fees"],
            ["Schedules", "app-screens-activities--schedules"],
            ["Bookings", "app-screens-activities--bookings"],
            ["Settings", "app-screens-activities--settings"],
        ],
    },
    {
        area: "Instruction",
        screens: [
            ["Clinic Templates", "app-screens-instruction--clinic-templates"],
            ["Clinic Instances", "app-screens-instruction--clinic-instances"],
            ["Clinic Waitlist", "app-screens-instruction--clinic-waitlist"],
            ["Clinic Sold", "app-screens-instruction--clinic-sold"],
        ],
    },
    {
        area: "F & B",
        screens: [
            ["Reservations", "app-screens-f-b--reservations"],
            ["Restaurant", "app-screens-f-b--restaurant"],
        ],
    },
    {
        area: "Customers",
        screens: [
            ["Customers", "app-screens-customers--customers"],
            ["Customer Types", "app-screens-customers--customer-types"],
        ],
    },
    {
        area: "Employees",
        screens: [
            ["Employees", "app-screens-employees--employees"],
            ["Time Clock — Employee Hours", "app-screens-employees--time-clock-employee-hours"],
            ["Time Clock — All Hours", "app-screens-employees--time-clock-all-hours"],
            ["Tip Outs", "app-screens-employees--tip-outs"],
            ["Tips Report", "app-screens-employees--tips-report"],
        ],
    },
    {
        area: "Membership",
        screens: [
            ["Memberships", "app-screens-membership--memberships"],
            ["Members", "app-screens-membership--members"],
            ["Member Report", "app-screens-membership--member-report"],
        ],
    },
    {
        area: "Products",
        screens: [
            ["List", "app-screens-products--list"],
            ["Groups", "app-screens-products--groups"],
            ["Inventory", "app-screens-products--inventory"],
            ["Receivables", "app-screens-products--receivables"],
        ],
    },
    {
        area: "Inventory",
        screens: [["Inventory Counts", "app-screens-inventory--inventory-counts"]],
    },
    {
        area: "Events",
        screens: [
            ["Events", "app-screens-events--events"],
            ["Event Details", "app-screens-events--event-details"],
        ],
    },
    {
        area: "Bays (beta)",
        screens: [
            ["Bay List", "app-screens-bays-beta--bay-list"],
            ["Bay Reservations", "app-screens-bays-beta--bay-reservations"],
            ["Bay Schedules", "app-screens-bays-beta--bay-schedules"],
            ["Bay Waitlist", "app-screens-bays-beta--bay-waitlist"],
        ],
    },
    {
        area: "Marketing",
        screens: [
            ["Campaigns", "app-screens-marketing--campaigns"],
            ["Templates", "app-screens-marketing--templates"],
            ["Templates (Unlayer)", "app-screens-marketing--templates-unlayer"],
        ],
    },
    {
        area: "Admin",
        screens: [
            ["Error Report", "app-screens-admin--error-report"],
            ["Scheduled Jobs", "app-screens-admin--scheduled-jobs"],
            ["Trades", "app-screens-admin--trades"],
            ["Tablets", "app-screens-admin--tablets"],
        ],
    },
];

export const IndexHero = () => (
    <Hero
        size="page"
        eyebrow="Prototypes › Full application"
        title="Every screen, by Global Nav area."
        lead="The original app screens, one card per area in the order the Global Nav lists them. Each screen opens as its own story."
        chips={[`${COUNTS.fullApplication} screens`, `${COUNTS.areas} areas`, "Sample data only"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("app-screens-dashboard--default")}>
                    Start at the Dashboard
                </Cta>
                <Cta kind="secondary" href={`${PAGES}app/`}>
                    The clickable app
                </Cta>
            </CtaRow>
        }
    />
);

export const ScreenIndex = () => (
    <CardGrid min={280}>
        {AREAS.map((a, i) => (
            <LinkCard key={a.area} eyebrow={String(i + 1)} title={a.area} links={a.screens.map(([name, id]) => [name, story(id)] as [string, string])} />
        ))}
    </CardGrid>
);
