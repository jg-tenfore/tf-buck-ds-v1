import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ComponentType, type HTMLAttributes, useEffect, useState } from "react";
import {
    ArrowRight,
    BarChartSquare02,
    Building01,
    Building07,
    Calendar,
    CurrencyDollar,
    GraduationHat02,
    Home02,
    LifeBuoy01,
    Mail05,
    Monitor04,
    Package,
    Settings01,
    ShoppingCart01,
    Tag01,
    Trophy01,
    User01,
    UserSquare,
    Users01,
} from "@untitledui/icons";
import { CommandMenu, type CommandMenuGroup } from "@/components/application/command-menu/command-menu";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import type { NavItemType } from "@/components/application/app-navigation/config";

type Icon = ComponentType<HTMLAttributes<HTMLOrSVGElement>>;

const meta: Meta = {
    title: "App Chrome/Nav Proposal",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** The 18 top-level sections in the nav today, in their current order. */
const CURRENT: { label: string; icon: Icon }[] = [
    { label: "My Golf Course", icon: Home02 },
    { label: "Company", icon: Building01 },
    { label: "Orders", icon: ShoppingCart01 },
    { label: "Reports", icon: BarChartSquare02 },
    { label: "Golf", icon: Trophy01 },
    { label: "Simulator Bays", icon: Monitor04 },
    { label: "Activities", icon: Users01 },
    { label: "Instruction", icon: GraduationHat02 },
    { label: "F & B", icon: ShoppingCart01 },
    { label: "Customers", icon: Users01 },
    { label: "Employees", icon: UserSquare },
    { label: "Membership", icon: User01 },
    { label: "Products", icon: Tag01 },
    { label: "Inventory", icon: Package },
    { label: "Events", icon: Calendar },
    { label: "Bays (beta)", icon: Building07 },
    { label: "Marketing", icon: Mail05 },
    { label: "Admin", icon: UserSquare },
];

/** Proposed grouping: 18 flat sections folded into 7 labelled areas. */
const PROPOSED: { label: string; note: string; icon: Icon; members: string[] }[] = [
    { label: "Home", note: "Dashboard, what's new, locations & setup", icon: Home02, members: ["My Golf Course"] },
    {
        label: "Play",
        note: "Everything that puts golfers on a tee or in a bay",
        icon: Trophy01,
        members: ["Golf", "Simulator Bays", "Bays (beta)", "Activities", "Instruction", "Events"],
    },
    { label: "Commerce", note: "Selling — orders, catalog & stock", icon: ShoppingCart01, members: ["Orders", "Products", "Inventory", "F & B"] },
    { label: "People", note: "Members, customers & staff", icon: Users01, members: ["Membership", "Customers", "Employees"] },
    { label: "Insights", note: "Reporting & analytics", icon: BarChartSquare02, members: ["Reports"] },
    { label: "Marketing", note: "Email & campaigns", icon: Mail05, members: ["Marketing"] },
    { label: "Settings & Admin", note: "Company config & back-office tools", icon: Settings01, members: ["Company", "Admin"] },
];

const Row = ({ icon: Icon, label, muted }: { icon: Icon; label: string; muted?: boolean }) => (
    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
        <Icon className="size-4.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <span className={muted ? "text-sm text-tertiary" : "flex-1 text-sm font-medium text-secondary"}>{label}</span>
    </div>
);

export const Default: Story = {
    render: () => (
        <div className="min-h-screen bg-secondary px-6 py-12">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <p className="text-xs font-semibold tracking-[0.14em] text-quaternary uppercase">App Chrome · Proposal</p>
                <h1 className="mt-1.5 text-display-sm font-semibold text-primary">Global nav — grouping proposal</h1>
                <p className="mt-2 max-w-2xl text-md text-tertiary">
                    The nav today is a flat list of <span className="font-semibold text-secondary">18 top-level sections</span>. This proposal folds them into{" "}
                    <span className="font-semibold text-secondary">7 labelled areas</span> so related tools sit together and the rail stays scannable.
                </p>

                {/* Current -> Proposed */}
                <div className="mt-10 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1.15fr]">
                    {/* Current */}
                    <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                        <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Today</p>
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-tertiary">18 sections</span>
                        </div>
                        <nav className="flex flex-col gap-0.5">
                            {CURRENT.map((item) => (
                                <Row key={item.label} icon={item.icon} label={item.label} />
                            ))}
                        </nav>
                    </div>

                    {/* Arrow */}
                    <div className="hidden items-center justify-center self-center lg:flex">
                        <span className="flex size-9 items-center justify-center rounded-full bg-brand-primary">
                            <ArrowRight className="size-5 text-fg-brand-primary" aria-hidden="true" />
                        </span>
                    </div>

                    {/* Proposed */}
                    <div className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                        <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Proposed</p>
                            <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-xs font-medium text-brand-secondary">7 groups</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {PROPOSED.map((group) => (
                                <div key={group.label} className="rounded-xl bg-secondary/50 p-2.5 ring-1 ring-secondary ring-inset">
                                    <div className="flex items-start gap-2.5">
                                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
                                            <group.icon className="size-4 text-fg-brand-primary" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-primary">{group.label}</p>
                                            <p className="text-xs text-tertiary">{group.note}</p>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {group.members.map((member) => (
                                                    <span key={member} className="rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-secondary ring-1 ring-secondary ring-inset">
                                                        {member}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Full mapping */}
                <div className="mt-12">
                    <h2 className="text-sm font-semibold tracking-wide text-quaternary uppercase">Full mapping</h2>
                    <p className="mt-1 max-w-xl text-sm text-tertiary">Every current top-level section and where it lands in the proposed structure.</p>
                    <div className="mt-4 overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-secondary text-left text-xs font-semibold tracking-wide text-quaternary uppercase">
                                    <th className="px-4 py-2.5 font-semibold">Today</th>
                                    <th className="px-4 py-2.5 font-semibold">Proposed group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CURRENT.map((current) => {
                                    const group = PROPOSED.find((proposed) => proposed.members.includes(current.label));
                                    return (
                                        <tr key={current.label} className="border-b border-secondary last:border-0">
                                            <td className="px-4 py-2.5">
                                                <span className="flex items-center gap-2.5">
                                                    <current.icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                                    <span className="font-medium text-secondary">{current.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                {group ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-secondary px-2 py-0.5 text-xs font-medium text-brand-secondary">
                                                        <group.icon className="size-3.5" aria-hidden="true" />
                                                        {group.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-tertiary">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="mt-6 max-w-2xl text-sm text-tertiary">
                    Grouping is a proposal — labels and membership are easy to adjust. Next step: wire the chosen groups into the Global Nav as the primary rail,
                    with each area&apos;s sections in the secondary panel.
                </p>
            </div>
        </div>
    ),
};

/** The proposed grouping as a real nav: the 7 areas in the Untitled UI Simple sidebar. */
const PROPOSED_NAV: NavItemType[] = [
    { label: "Home", href: "/home", icon: Home02 },
    {
        label: "Play",
        href: "/play",
        icon: Trophy01,
        items: [
            { label: "Golf", href: "/play/golf" },
            { label: "Simulator Bays", href: "/play/simulator-bays" },
            { label: "Bays (beta)", href: "/play/bays-beta" },
            { label: "Activities", href: "/play/activities" },
            { label: "Instruction", href: "/play/instruction" },
            { label: "Events", href: "/play/events" },
        ],
    },
    {
        label: "Commerce",
        href: "/commerce",
        icon: ShoppingCart01,
        items: [
            { label: "Orders", href: "/commerce/orders" },
            { label: "Products", href: "/commerce/products" },
            { label: "Inventory", href: "/commerce/inventory" },
            { label: "F & B", href: "/commerce/f-and-b" },
        ],
    },
    {
        label: "People",
        href: "/people",
        icon: Users01,
        items: [
            { label: "Membership", href: "/people/membership" },
            { label: "Customers", href: "/people/customers" },
            { label: "Employees", href: "/people/employees" },
        ],
    },
    { label: "Insights", href: "/insights", icon: BarChartSquare02 },
    { label: "Marketing", href: "/marketing", icon: Mail05 },
    {
        label: "Admin",
        href: "/admin",
        icon: Building01,
        items: [
            { label: "Company", href: "/admin/company" },
            { label: "Back-office tools", href: "/admin/tools" },
        ],
    },
];

const FOOTER_NAV: NavItemType[] = [
    { label: "Settings", href: "/settings", icon: Settings01 },
    { label: "Support", href: "/support", icon: LifeBuoy01 },
];

/** Command-menu groups derived from the proposed nav. */
const PROPOSED_COMMAND_GROUPS: CommandMenuGroup[] = [
    {
        label: "Go to",
        items: PROPOSED_NAV.filter((group) => !group.items?.length).map((group) => ({ label: group.label, href: group.href!, icon: group.icon })),
    },
    ...PROPOSED_NAV.filter((group) => group.items?.length).map((group) => ({
        label: group.label,
        items: group.items!.map((item) => ({ label: item.label, href: item.href, icon: group.icon, hint: group.label })),
    })),
    { label: "General", items: FOOTER_NAV.map((item) => ({ label: item.label, href: item.href!, icon: item.icon })) },
];

/**
 * The proposed grouping rendered as a working nav in the **Simple** sidebar —
 * shown in contrast to the current dual-tier nav in **App Chrome / Global Nav**.
 * Expand a group (e.g. Play) to reveal its sections; Settings and Support are
 * pinned to the footer. Click **Search** or press **⌘K** for the command menu.
 */
const ProposedNavWithCommandMenu = () => {
    const [activeUrl, setActiveUrl] = useState("/play/golf");
    const [isCommandOpen, setIsCommandOpen] = useState(false);

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
            <SidebarNavigationSimple activeUrl={activeUrl} items={PROPOSED_NAV} footerItems={FOOTER_NAV} onSearchClick={() => setIsCommandOpen(true)} />
            <main className="flex flex-1 items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <h1 className="text-display-xs font-semibold text-primary">Proposed navigation</h1>
                    <p className="mt-2 text-md text-tertiary">
                        The 7 proposed groups in the Untitled UI Simple sidebar. Expand a group to see its sections; Settings &amp; Support sit in the footer.
                        Compare with the current dual-tier nav in <span className="font-medium text-secondary">App Chrome / Global Nav</span>.
                    </p>
                </div>
            </main>

            <CommandMenu
                isOpen={isCommandOpen}
                onOpenChange={setIsCommandOpen}
                groups={PROPOSED_COMMAND_GROUPS}
                onSelect={setActiveUrl}
                placeholder="Search navigation…"
            />
        </div>
    );
};

export const SimpleSidebar: Story = {
    name: "Proposed · Simple Sidebar",
    render: () => <ProposedNavWithCommandMenu />,
};
