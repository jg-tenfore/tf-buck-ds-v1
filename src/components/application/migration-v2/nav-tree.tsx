import type { FC } from "react";
import {
    Announcement02,
    Award01,
    BankNote01,
    BarChartSquare02,
    BookClosed,
    Box,
    Building05,
    Building07,
    Calculator,
    Calendar,
    CalendarCheck01,
    CalendarDate,
    ClipboardCheck,
    Clock,
    ClockRewind,
    Cloud01,
    Code02,
    CoinsHand,
    CreditCard01,
    CreditCard02,
    CurrencyDollar,
    Dataflow03,
    File02,
    FileAttachment01,
    FileDownload02,
    FileX02,
    Flag01,
    Gift01,
    GraduationHat01,
    Grid01,
    Hash02,
    Home02,
    Hourglass01,
    LayersThree01,
    LineChartUp01,
    List,
    MagicWand02,
    Mail01,
    MarkerPin01,
    MessageChatCircle,
    Minus,
    Monitor01,
    Package,
    Passport,
    Percent02,
    PieChart01,
    PresentationChart01,
    Printer,
    PuzzlePiece01,
    Receipt,
    ReverseLeft,
    Scales01,
    Settings01,
    ShoppingBag01,
    ShoppingCart01,
    Speedometer02,
    SwitchHorizontal01,
    Tablet01,
    Tag01,
    Target04,
    Ticket01,
    Truck01,
    Umbrella03,
    User01,
    UserCheck01,
    Users01,
    Users03,
    UsersRight,
    Wallet02,
} from "@untitledui/icons";

/**
 * The legacy back-office Global Nav, transcribed item-for-item from the
 * production accordion (references/100126/global nav). Three levels deep:
 * section → page / group → page.
 */

export type NavNode = {
    id: string;
    label: string;
    icon: FC<{ className?: string }>;
    children?: NavNode[];
};

/** Build a node; ids are the label path so duplicates ("Settings", "Fees") stay unique. */
const n = (label: string, icon: FC<{ className?: string }>, children?: NavNode[]): NavNode => ({ id: "", label, icon, children });

const TREE: NavNode[] = [
    n("My Course", Home02, [
        n("Dashboard", Speedometer02),
        n("What's New", Announcement02),
        n("Golf Genius", MagicWand02, [n("Roster", Users01), n("Events", Calendar)]),
        n("Departments", Building05, [n("Schedules", CalendarDate)]),
        n("Locations", MarkerPin01),
        n("Settings", Settings01),
        n("QuickBooks", FileAttachment01, [n("Connected Apps", PuzzlePiece01), n("Accounts", Minus), n("Classes", Minus)]),
        n("Integrations", SwitchHorizontal01),
    ]),
    n("My Company", Building07, [n("Settings", Settings01), n("Duplicate Customers", UsersRight)]),
    n("Orders", ShoppingBag01, [n("All Orders", ClipboardCheck), n("Refunds", ReverseLeft), n("Tabs", Receipt), n("Charge Back", FileAttachment01)]),
    n("Reports", BarChartSquare02, [
        n("General Ledger", BookClosed, [n("Codes", Hash02), n("General Ledger A", BookClosed), n("General Ledger B", BookClosed)]),
        n("User Activities", User01),
        n("Waitlists", List),
        n("Cash Payouts", BankNote01),
        n("Problem Orders", FileX02),
        n("Reconcile", Scales01),
        n("Rewards", Gift01),
        n("Credits", FileAttachment01, [
            n("Gift Cards", Gift01),
            n("Rain Checks", Umbrella03),
            n("Payment Sources", CreditCard01),
            n("Punch Cards", Ticket01),
            n("Credit Books", BookClosed),
        ]),
        n("Charges", Receipt, [
            n("Balances", Scales01),
            n("Statements", File02),
            n("Aging", FileAttachment01),
            n("Charges", FileAttachment01),
            n("Payments", CreditCard02),
            n("History", ClockRewind),
        ]),
        n("Revenue", CurrencyDollar, [
            n("Sales by Category", PieChart01),
            n("Combined Report", LineChartUp01),
            n("Combined Revenue", PieChart01),
            n("F&B and Events", Receipt),
            n("Payments", CreditCard01),
            n("Product Sales by Category", Package),
            n("Product Sales by Group", Package),
            n("Golf", Target04),
            n("Discounts & Promos", Tag01),
        ]),
        n("Taxes", Percent02, [n("Tax by Product", Percent02), n("Tax by Type", Percent02)]),
        n("Rounds", Target04, [n("Weekly Rounds", CalendarDate), n("Monthly Rounds", Calendar)]),
    ]),
    n("Golf", Target04, [n("Tee Sheet", Grid01, [n("Daily", Calendar)]), n("Fees", Target04), n("Print Outs", Printer, [n("Pace of Play", Hourglass01)])]),
    n("Rooms", Building05, [n("Schedules", CalendarDate)]),
    n("Simulator Bays", Monitor01, [
        n("Bays", Monitor01),
        n("Fees", CurrencyDollar),
        n("Schedules", CalendarDate),
        n("Bookings", CalendarCheck01),
        n("Settings", Settings01),
    ]),
    n("Activities", Users03, [
        n("Resources", LayersThree01),
        n("Fees", CurrencyDollar),
        n("Schedules", CalendarDate),
        n("Bookings", CalendarCheck01),
        n("Settings", Settings01),
    ]),
    n("Instruction", GraduationHat01, [
        n("Clinics", PresentationChart01, [n("Templates", ClipboardCheck), n("Instances", CalendarDate), n("Waitlist", List), n("Sold", Receipt)]),
    ]),
    n("F & B", Receipt, [n("Restaurant", Receipt, [n("Reservations", ClipboardCheck), n("Schedules", CalendarDate), n("Tables", Grid01)])]),
    n("Customers", Users01, [n("Customers", User01), n("Customer Types", LayersThree01), n("By Activity", Clock), n("Golfer Groups", Users01)]),
    n("Employees", User01, [
        n("Employees", Users03),
        n("Time Clock", Clock, [n("Employee Hours", Clock), n("All Hours", Clock)]),
        n("Tip Outs", CoinsHand),
        n("Tips Report", CoinsHand),
        n("Shifts Report", Clock),
        n("End of Shift", Calculator),
        n("Tips By Employee", CoinsHand),
        n("Service Charges", Percent02),
        n("Employee Performance", LineChartUp01),
    ]),
    n("Membership", Passport, [
        n("Memberships", Passport),
        n("Members", Passport),
        n("Member Report", UserCheck01),
        n("Member Contact Info", Passport),
        n("Memberships Sold", FileAttachment01),
        n("Member Spending", Wallet02),
        n("Membership Activity", BarChartSquare02),
    ]),
    n("Products", Tag01, [
        n("List", Tag01),
        n("Groups", LayersThree01),
        n("Combos", Grid01),
        n("Menus", Receipt),
        n("Modifiers", LayersThree01),
        n("Discount Types", Percent02),
        n("Punch Cards", Ticket01),
        n("Rewards", Award01),
        n("Price Stickers", Printer, [n("Star", Receipt), n("Dymo", Tag01), n("Avery 5160", Grid01)]),
    ]),
    n("Inventory", Box, [
        n("Receive", Package),
        n("Inventory Counts", Box),
        n("Products Sold", ShoppingCart01),
        n("Current Stock", Building05),
        n("Received", Truck01),
        n("Variance", Scales01),
    ]),
    n("Events", Calendar, [n("Events", Calendar)]),
    n("Bays (beta)", Building05, [n("Bay List", List), n("Bay Reservations", BookClosed), n("Bay Schedules", CalendarDate), n("Bay Waitlist", Users01)]),
    n("Marketing", Mail01, [
        n("Automations", MagicWand02),
        n("Email", Mail01, [n("Campaigns", Announcement02), n("Templates", Code02), n("Templates (Unlayer)", MagicWand02)]),
        n("SMS", MessageChatCircle, [
            n("Config", Settings01),
            n("Numbers", Hash02),
            n("Templates", Code02),
            n("Campaigns", Announcement02),
            n("Reports", BarChartSquare02),
        ]),
        n("Promotions", Tag01),
    ]),
    n("Admin", User01, [
        n("Course Modules", PuzzlePiece01),
        n("Reports", BarChartSquare02, [n("Error Report", Flag01)]),
        n("Scheduled Jobs", Cloud01),
        n("Tablets", Tablet01),
        n("Import", FileDownload02),
    ]),
];

/** Give every node a stable id from its label path, e.g. "reports/credits/punch-cards". */
const slug = (s: string) =>
    s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
const assignIds = (nodes: NavNode[], prefix = ""): NavNode[] =>
    nodes.map((node) => {
        const id = prefix ? `${prefix}/${slug(node.label)}` : slug(node.label);
        return { ...node, id, children: node.children ? assignIds(node.children, id) : undefined };
    });

export const NAV_TREE: NavNode[] = assignIds(TREE);

/** Ids of the screens rebuilt in Migration V2. */
export const NAV_IDS = {
    punchCards: "reports/credits/punch-cards",
    creditBooks: "reports/credits/credit-books",
    charges: "reports/charges/charges",
    payments: "reports/charges/payments",
    history: "reports/charges/history",
    combinedReport: "reports/revenue/combined-report",
    combinedRevenue: "reports/revenue/combined-revenue",
} as const;

/** Every ancestor id of `id` (excluding itself), outermost first. */
export const ancestorsOf = (id: string): string[] => {
    const parts = id.split("/");
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("/"));
};

/** Every id in the tree that has children (for "expand all"). */
export const allGroupIds = (nodes: NavNode[] = NAV_TREE): string[] => nodes.flatMap((node) => (node.children ? [node.id, ...allGroupIds(node.children)] : []));
