import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    Announcement02,
    BarChartSquare02,
    BookClosed,
    Box,
    Building01,
    Building05,
    Building06,
    Building07,
    Calendar,
    CalendarCheck01,
    CalendarDate,
    Clipboard,
    Clock,
    Cloud01,
    CoinsHand,
    CreditCard01,
    CurrencyDollar,
    File02,
    File05,
    Flag05,
    Flag06,
    Gift01,
    GraduationHat02,
    Hash02,
    Home02,
    LayersThree01,
    LineChartUp01,
    List,
    Mail01,
    Mail05,
    MarkerPin02,
    Minus,
    Monitor04,
    Package,
    PackagePlus,
    PieChart03,
    PresentationChart01,
    Receipt,
    ReceiptCheck,
    Settings01,
    ShoppingBag03,
    ShoppingCart01,
    SlashCircle01,
    Speedometer04,
    SwitchHorizontal01,
    Tablet01,
    Tag01,
    Ticket01,
    Umbrella03,
    UploadCloud01,
    User01,
    UserCheck01,
    Users01,
    UsersPlus,
    UserSquare,
} from "@untitledui/icons";
import { useEffect, useState } from "react";
import { CommandMenu, type CommandMenuGroup } from "@/components/application/command-menu/command-menu";
import { CourseDashboard } from "@/components/application/dashboard/course-dashboard";
import { SidebarNavigationDualTier } from "@/components/application/app-navigation/sidebar-navigation/sidebar-dual-tier";
import type { NavItemType } from "@/components/application/app-navigation/config";

/**
 * The Tenfore back-office **primary navigation** as it exists today, rendered on
 * Tenfore Golf's Dual-tier Sidebar. The main (left) tier lists every top-level
 * section; hovering a section reveals its sub-items in the secondary tier.
 *
 * The live app nests up to three levels deep (e.g. Reports → Credits → Gift
 * Cards). Since the Dual-tier component supports two tiers, third-level items
 * are **flattened** into the secondary list, appearing immediately after their
 * parent group. Icons approximate the app's current solid icon set using the
 * closest `@untitledui/icons` line icons.
 */

const NAV_ITEMS: NavItemType[] = [
    {
        label: "My Golf Course",
        href: "/my-golf-course",
        icon: Home02,
        items: [
            { label: "Dashboard", href: "/my-golf-course/dashboard", icon: Speedometer04 },
            { label: "What's New", href: "/my-golf-course/whats-new", icon: Announcement02 },
            { label: "Departments", href: "/my-golf-course/departments", icon: Building05 },
            { label: "Schedules", href: "/my-golf-course/departments/schedules", icon: Calendar },
            { label: "Locations", href: "/my-golf-course/locations", icon: MarkerPin02 },
            { label: "Settings", href: "/my-golf-course/settings", icon: Settings01 },
            { label: "Integrations", href: "/my-golf-course/integrations", icon: SwitchHorizontal01 },
            { label: "QuickBooks", href: "/my-golf-course/integrations/quickbooks", icon: Minus },
        ],
    },
    {
        label: "Company",
        href: "/company",
        icon: Building01,
        items: [
            { label: "Settings", href: "/company/settings", icon: Settings01 },
            { label: "Duplicate Customers", href: "/company/duplicate-customers", icon: UsersPlus },
        ],
    },
    {
        label: "Orders",
        href: "/orders",
        icon: ShoppingCart01,
        items: [{ label: "All Orders", href: "/orders/all", icon: Clipboard }],
    },
    {
        label: "Reports",
        href: "/reports",
        icon: BarChartSquare02,
        items: [
            { label: "General Ledger", href: "/reports/general-ledger", icon: BookClosed },
            { label: "Codes", href: "/reports/general-ledger/codes", icon: Hash02 },
            { label: "General Ledger A", href: "/reports/general-ledger/a", icon: BookClosed },
            { label: "General Ledger A (beta)", href: "/reports/general-ledger/a-beta", icon: BookClosed },
            { label: "User Activities", href: "/reports/user-activities", icon: User01 },
            { label: "Waitlists", href: "/reports/waitlists", icon: List },
            { label: "Credits", href: "/reports/credits", icon: File05 },
            { label: "Gift Cards", href: "/reports/credits/gift-cards", icon: Gift01 },
            { label: "Rain Checks", href: "/reports/credits/rain-checks", icon: Umbrella03 },
            { label: "Payment Sources", href: "/reports/credits/payment-sources", icon: CreditCard01 },
            { label: "Punch Cards", href: "/reports/credits/punch-cards", icon: Ticket01 },
            { label: "Charges", href: "/reports/charges", icon: Receipt },
            { label: "Statements", href: "/reports/charges/statements", icon: File02 },
            { label: "Aging", href: "/reports/charges/aging", icon: File05 },
            { label: "Revenue", href: "/reports/revenue", icon: CurrencyDollar },
            { label: "Sales by Category", href: "/reports/revenue/sales-by-category", icon: PieChart03 },
            { label: "Combined Report", href: "/reports/revenue/combined", icon: LineChartUp01 },
            { label: "Discounts & Promos", href: "/reports/revenue/discounts-promos", icon: Tag01 },
            { label: "Rounds", href: "/reports/rounds", icon: Flag06 },
            { label: "Weekly Rounds", href: "/reports/rounds/weekly", icon: Calendar },
            { label: "Monthly Rounds", href: "/reports/rounds/monthly", icon: CalendarDate },
        ],
    },
    {
        label: "Golf",
        href: "/golf",
        icon: Flag06,
        items: [
            { label: "Tee Sheet", href: "/golf/tee-sheet", icon: File05 },
            { label: "Daily", href: "/golf/tee-sheet/daily", icon: Calendar },
            { label: "Daily (beta)", href: "/golf/tee-sheet/daily-beta", icon: Calendar },
            { label: "Schedules", href: "/golf/tee-sheet/schedules", icon: Calendar },
            { label: "Auto-Block Templates", href: "/golf/tee-sheet/auto-block-templates", icon: SlashCircle01 },
            { label: "Starter Sheet", href: "/golf/tee-sheet/starter-sheet", icon: Flag05 },
            { label: "Fees", href: "/golf/fees", icon: CurrencyDollar },
        ],
    },
    {
        label: "Simulator Bays",
        href: "/simulator-bays",
        icon: Monitor04,
        items: [
            { label: "Bays", href: "/simulator-bays/bays", icon: Monitor04 },
            { label: "Fees", href: "/simulator-bays/fees", icon: CurrencyDollar },
            { label: "Schedules", href: "/simulator-bays/schedules", icon: Calendar },
            { label: "Bookings", href: "/simulator-bays/bookings", icon: CalendarCheck01 },
            { label: "Settings", href: "/simulator-bays/settings", icon: Settings01 },
        ],
    },
    {
        label: "Activities",
        href: "/activities",
        icon: Users01,
        items: [
            { label: "Resources", href: "/activities/resources", icon: LayersThree01 },
            { label: "Fees", href: "/activities/fees", icon: CurrencyDollar },
            { label: "Schedules", href: "/activities/schedules", icon: Calendar },
            { label: "Bookings", href: "/activities/bookings", icon: CalendarCheck01 },
            { label: "Settings", href: "/activities/settings", icon: Settings01 },
        ],
    },
    {
        label: "Instruction",
        href: "/instruction",
        icon: GraduationHat02,
        items: [
            { label: "Clinics", href: "/instruction/clinics", icon: PresentationChart01 },
            { label: "Templates", href: "/instruction/clinics/templates", icon: Clipboard },
            { label: "Instances", href: "/instruction/clinics/instances", icon: Calendar },
            { label: "Waitlist", href: "/instruction/clinics/waitlist", icon: List },
            { label: "Sold", href: "/instruction/clinics/sold", icon: ReceiptCheck },
        ],
    },
    {
        label: "F & B",
        href: "/f-and-b",
        icon: ShoppingBag03,
        items: [
            { label: "Restaurant", href: "/f-and-b/restaurant", icon: Building06 },
            { label: "Reservations", href: "/f-and-b/restaurant/reservations", icon: Clipboard },
        ],
    },
    {
        label: "Customers",
        href: "/customers",
        icon: Users01,
        items: [
            { label: "Customers", href: "/customers/list", icon: User01 },
            { label: "Customer Types", href: "/customers/types", icon: LayersThree01 },
        ],
    },
    {
        label: "Employees",
        href: "/employees",
        icon: UserSquare,
        items: [
            { label: "Employees", href: "/employees/list", icon: Users01 },
            { label: "Time Clock", href: "/employees/time-clock", icon: Clock },
            { label: "Employee Hours", href: "/employees/time-clock/employee-hours", icon: Clock },
            { label: "All Hours", href: "/employees/time-clock/all-hours", icon: Clock },
            { label: "Tip Outs", href: "/employees/tip-outs", icon: CoinsHand },
            { label: "Tips Report", href: "/employees/tips-report", icon: CoinsHand },
        ],
    },
    {
        label: "Membership",
        href: "/membership",
        icon: CreditCard01,
        items: [
            { label: "Memberships", href: "/membership/memberships", icon: UserSquare },
            { label: "Members", href: "/membership/members", icon: Users01 },
            { label: "Member Report", href: "/membership/member-report", icon: UserCheck01 },
        ],
    },
    {
        label: "Products",
        href: "/products",
        icon: Tag01,
        items: [
            { label: "List", href: "/products/list", icon: Tag01 },
            { label: "Groups", href: "/products/groups", icon: LayersThree01 },
            { label: "Inventory", href: "/products/inventory", icon: Package },
            { label: "Receivables", href: "/products/inventory/receivables", icon: PackagePlus },
        ],
    },
    {
        label: "Inventory",
        href: "/inventory",
        icon: Package,
        items: [{ label: "Inventory Counts", href: "/inventory/counts", icon: Box }],
    },
    {
        label: "Events",
        href: "/events",
        icon: Calendar,
        items: [{ label: "Events", href: "/events/list", icon: Calendar }],
    },
    {
        label: "Bays (beta)",
        href: "/bays-beta",
        icon: Building07,
        items: [
            { label: "Bay List", href: "/bays-beta/list", icon: List },
            { label: "Bay Reservations", href: "/bays-beta/reservations", icon: BookClosed },
            { label: "Bay Schedules", href: "/bays-beta/schedules", icon: Calendar },
            { label: "Bay Waitlist", href: "/bays-beta/waitlist", icon: Users01 },
        ],
    },
    {
        label: "Marketing",
        href: "/marketing",
        icon: Mail05,
        items: [{ label: "Email", href: "/marketing/email", icon: Mail01 }],
    },
    {
        label: "Admin",
        href: "/admin",
        icon: UserSquare,
        items: [
            { label: "Reports", href: "/admin/reports", icon: BarChartSquare02 },
            { label: "Scheduled Jobs", href: "/admin/scheduled-jobs", icon: Cloud01 },
            { label: "Trades", href: "/admin/trades", icon: Calendar },
            { label: "Tablets", href: "/admin/tablets", icon: Tablet01 },
            { label: "Import", href: "/admin/import", icon: UploadCloud01 },
        ],
    },
];

/**
 * Command-menu groups derived from the nav: one group per top-level section,
 * its sub-items as searchable rows. The section name is carried as a `hint` so
 * repeated labels (Settings, Fees, Schedules…) stay disambiguated when searching.
 */
const COMMAND_GROUPS: CommandMenuGroup[] = NAV_ITEMS.map((section) => ({
    label: section.label,
    items: (section.items ?? []).map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        hint: section.label,
    })),
})).filter((group) => group.items.length > 0);

const meta = {
    title: "App Chrome/Global Nav",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sidebar + command menu, wired together with shared active-URL state. */
const NavWithCommandMenu = () => {
    const [activeUrl, setActiveUrl] = useState("/my-golf-course/dashboard");
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    // ⌘K / Ctrl+K toggles the command menu.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setIsCommandOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-primary">
            <SidebarNavigationDualTier activeUrl={activeUrl} items={NAV_ITEMS} onSearchClick={() => setIsCommandOpen(true)} />

            <main className="min-w-0 flex-1">
                <CourseDashboard />
            </main>

            <CommandMenu
                isOpen={isCommandOpen}
                onOpenChange={setIsCommandOpen}
                groups={COMMAND_GROUPS}
                onSelect={setActiveUrl}
                placeholder="Search navigation…"
            />
        </div>
    );
};

/**
 * The full back-office nav. Hover any top-level section (e.g. **Reports** or
 * **Golf**) to reveal its sub-items in the secondary panel. Click **Search** in
 * the sidebar — or press **⌘K** — to open the command menu and jump to any item.
 */
export const CurrentNavigation: Story = {
    render: () => <NavWithCommandMenu />,
};
