import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import {
    BarChartSquare02,
    Calendar,
    CreditCard01,
    GraduationHat02,
    Home02,
    Mail01,
    Package,
    Settings01,
    ShoppingCart01,
    Tag01,
    User01,
    Users01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CommandMenu, type CommandMenuGroup } from "@/components/application/command-menu/command-menu";

const DEMO_GROUPS: CommandMenuGroup[] = [
    {
        label: "Go to",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: Home02, hint: "My Golf Course" },
            { label: "Reports", href: "/reports", icon: BarChartSquare02, hint: "Reports" },
            { label: "Orders", href: "/orders", icon: ShoppingCart01, hint: "Orders" },
            { label: "Products", href: "/products", icon: Tag01, hint: "Products" },
            { label: "Inventory", href: "/inventory", icon: Package, hint: "Products" },
        ],
    },
    {
        label: "People",
        items: [
            { label: "Customers", href: "/customers", icon: User01, hint: "Customers" },
            { label: "Members", href: "/members", icon: Users01, hint: "Membership" },
            { label: "Memberships", href: "/memberships", icon: CreditCard01, hint: "Membership" },
        ],
    },
    {
        label: "Schedule",
        items: [
            { label: "Tee Sheet", href: "/tee-sheet", icon: Calendar, hint: "Golf" },
            { label: "Clinics", href: "/clinics", icon: GraduationHat02, hint: "Instruction" },
            { label: "Email campaigns", href: "/marketing/email", icon: Mail01, hint: "Marketing" },
            { label: "Settings", href: "/settings", icon: Settings01, hint: "Company" },
        ],
    },
];

const meta = {
    title: "App Chrome/Command Menu",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CommandMenuDemo = ({ startOpen }: { startOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(Boolean(startOpen));
    const [lastSelected, setLastSelected] = useState<string | null>(null);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary p-8">
            <Button color="secondary" onClick={() => setIsOpen(true)}>
                Open command menu ⌘K
            </Button>
            <p className="text-sm text-tertiary">
                {lastSelected ? (
                    <>
                        Last selected: <span className="font-medium text-secondary">{lastSelected}</span>
                    </>
                ) : (
                    "Type to filter, ↑ ↓ to move, ↵ to select, Esc to close."
                )}
            </p>

            <CommandMenu isOpen={isOpen} onOpenChange={setIsOpen} groups={DEMO_GROUPS} onSelect={setLastSelected} placeholder="Search or jump to…" />
        </div>
    );
};

/**
 * The Tenfore ⌘K command menu — a search field that filters a grouped list in
 * real time, in a dismissable modal. Built on React Aria's `Autocomplete`. Open
 * by default here so you can see the layout; press **⌘K** or the button to toggle.
 */
export const Default: Story = {
    render: () => <CommandMenuDemo startOpen />,
};

/** Triggered from a button / keyboard shortcut, starting closed. */
export const Triggered: Story = {
    render: () => <CommandMenuDemo />,
};
