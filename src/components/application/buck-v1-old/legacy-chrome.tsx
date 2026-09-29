"use client";

import type { FC } from "react";
import { useState } from "react";
import {
    Building07,
    ChevronDown,
    ChevronRight,
    Clipboard,
    Clock,
    HelpCircle,
    Link02,
    Mail01,
    Menu01,
    Passport,
    Receipt,
    ShoppingBag01,
    Stars01,
    Target01,
    TrendUp01,
    Users01,
    Users03,
    XClose,
} from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { COURSE, asset } from "./course-settings-data";

/*
 * Legacy app chrome, recreated from the production screen. The original left
 * panel predates the design system, so its slate palette is reproduced with
 * literal values here (scoped to this file) rather than DS tokens.
 */
const SIDEBAR_BG = "bg-[#343a46]";
const SIDEBAR_TEXT = "text-[#c5c9d1]";

type NavChild = { label: string; hasChildren?: boolean; badge?: string; isActive?: boolean };
type NavItem = { label: string; icon: FC<{ className?: string }>; children?: NavChild[] };

const NAV: NavItem[] = [
    {
        label: "My Golf Course",
        icon: Building07,
        children: [
            { label: "Dashboard" },
            { label: "Golf Genius", hasChildren: true },
            { label: "Quickbooks", hasChildren: true },
            { label: "Integrations" },
            { label: "Integrations", badge: "BETA" },
            { label: "Departments", hasChildren: true },
            { label: "Locations" },
            { label: "Settings", isActive: true },
        ],
    },
    { label: "My Company", icon: Building07 },
    { label: "Orders", icon: Link02 },
    { label: "Reports", icon: TrendUp01 },
    { label: "Golf", icon: Clock },
    { label: "Instruction", icon: Clock },
    { label: "Activities", icon: Target01 },
    { label: "Simulator Bays", icon: Building07 },
    { label: "F&B", icon: Receipt },
    { label: "Rooms", icon: Building07 },
    { label: "Customers", icon: Users01 },
    { label: "Employees", icon: Users03 },
    { label: "Membership", icon: Passport },
    { label: "Products", icon: ShoppingBag01 },
    { label: "Inventory", icon: Clipboard },
    { label: "Events", icon: Stars01 },
    { label: "Marketing", icon: Mail01 },
    { label: "Help", icon: HelpCircle },
];

/** The legacy "TENFORE / GOLF" letter-spaced wordmark. */
const LegacyWordmark = () => (
    <div className="flex flex-col items-center leading-none select-none" aria-label="TenFore Golf">
        <span className="text-lg font-semibold tracking-[0.42em] text-white">TENFORE</span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-[0.55em] text-brand-400">GOLF</span>
    </div>
);

const SidebarNav = () => {
    // "My Golf Course" opens expanded, matching the Settings screen's entry point.
    const [open, setOpen] = useState<Record<string, boolean>>({ "My Golf Course": true });

    return (
        <nav aria-label="Main" className="flex flex-col gap-0.5 px-3 pb-6">
            {NAV.map(({ label, icon: Icon, children }) => {
                const isOpen = Boolean(open[label]);
                const hasGroup = Boolean(children?.length);

                return (
                    <div key={label}>
                        <button
                            type="button"
                            aria-expanded={hasGroup ? isOpen : undefined}
                            onClick={() => hasGroup && setOpen((prev) => ({ ...prev, [label]: !prev[label] }))}
                            className={cx(
                                "flex h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-[15px] transition duration-100 ease-linear hover:bg-white/5 hover:text-white",
                                isOpen ? "font-medium text-white" : SIDEBAR_TEXT,
                            )}
                        >
                            <Icon className="size-5 shrink-0 opacity-80" />
                            <span className="flex-1 text-left">{label}</span>
                            {isOpen ? <ChevronDown className="size-4 opacity-80" /> : <ChevronRight className="size-4 opacity-70" />}
                        </button>

                        {hasGroup && isOpen && (
                            <ul className="mt-0.5 mb-2 flex flex-col">
                                {children!.map((child, i) => (
                                    <li key={`${child.label}-${i}`}>
                                        <a
                                            href="#"
                                            aria-current={child.isActive ? "page" : undefined}
                                            onClick={(e) => e.preventDefault()}
                                            className={cx(
                                                "flex h-10 items-center gap-2 rounded-md pr-3 pl-11 text-sm transition duration-100 ease-linear hover:bg-white/5 hover:text-white",
                                                child.isActive ? "font-semibold text-white" : SIDEBAR_TEXT,
                                            )}
                                        >
                                            <span className="flex-1">{child.label}</span>
                                            {child.badge && (
                                                <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#343a46]">
                                                    {child.badge}
                                                </span>
                                            )}
                                            {child.hasChildren && <ChevronRight className="size-4 opacity-70" />}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

/** Fixed left panel on desktop; slide-over drawer on smaller screens. */
export const LegacySidebar = ({ isMobileOpen, onMobileClose }: { isMobileOpen: boolean; onMobileClose: () => void }) => (
    <>
        <aside className={cx("sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto lg:flex", SIDEBAR_BG)}>
            <div className="flex h-18 shrink-0 items-center justify-center">
                <LegacyWordmark />
            </div>
            <SidebarNav />
        </aside>

        {isMobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
                <button type="button" aria-label="Close menu" onClick={onMobileClose} className="absolute inset-0 bg-overlay/70" />
                <aside className={cx("relative flex h-full w-72 flex-col overflow-y-auto", SIDEBAR_BG)}>
                    <div className="flex h-18 shrink-0 items-center justify-between px-5">
                        <LegacyWordmark />
                        <button type="button" aria-label="Close menu" onClick={onMobileClose} className="text-white">
                            <XClose className="size-5" />
                        </button>
                    </div>
                    <SidebarNav />
                </aside>
            </div>
        )}
    </>
);

/** White top bar: course name + signed-in user card. */
export const LegacyTopBar = ({ onMenuClick }: { onMenuClick: () => void }) => (
    <header className="sticky top-0 z-30 flex h-18 shrink-0 items-stretch justify-between border-b border-secondary bg-primary">
        <button type="button" aria-label="Open menu" onClick={onMenuClick} className="flex items-center px-4 text-fg-secondary lg:invisible">
            <Menu01 className="size-5" />
        </button>
        <div className="flex items-stretch">
            <span className="hidden items-center px-6 text-sm text-tertiary sm:flex">{COURSE.name}</span>
            <div className="bg-secondary_subtle flex items-center gap-3 border-l border-secondary px-6">
                <img src={asset("avatar-deer.png")} alt="" className="size-10 rounded-full" />
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium text-secondary">{COURSE.user.name}</span>
                    <span className="text-xs text-tertiary">{COURSE.user.role}</span>
                </div>
            </div>
        </div>
    </header>
);
