"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
    Bell01,
    Building05,
    Calendar,
    Car01,
    Clock,
    CpuChip01,
    CreditCard02,
    Folder,
    Image03,
    InfoCircle,
    Link03,
    Percent02,
    Printer,
    Shield01,
    Tablet02,
    Target04,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { COURSE } from "./course-settings-data";
import { LegacySidebar, LegacyTopBar } from "./legacy-chrome";
import { BookingEngineContent, BookingRulesContent, BookingWaitlistContent } from "./sections-booking";
import { LinksContent, MainInfoContent, PaymentsContent, SubCoursesContent, TaxesFeesContent } from "./sections-general";
import {
    BirdieContent,
    CompanyContent,
    DocumentsContent,
    EventsContent,
    ImagesContent,
    NotificationsContent,
    PrintersContent,
    TabletsContent,
    TransportationContent,
} from "./sections-hardware";
import { SettingsSection } from "./settings-kit";
import { pulseElement } from "./settings-search";

/** Fired by search surfaces (e.g. the command bar) to open a section and point at a setting. */
export const REVEAL_SETTING_EVENT = "course-settings:reveal";
export type RevealSettingDetail = { sectionId: string; label?: string; occurrence?: number };

export const revealSetting = (detail: RevealSettingDetail) => window.dispatchEvent(new CustomEvent(REVEAL_SETTING_EVENT, { detail }));

/** Scroll so `el` clears the sticky chrome above it. */
const scrollBelowChrome = (el: HTMLElement, offset: number) =>
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });

type SectionDef = {
    id: string;
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
    footer?: "save" | "locked" | "none";
    content: () => ReactNode;
};

/** The 17 settings sections, in the legacy screen's order. */
export const SECTIONS: SectionDef[] = [
    { id: "main-info", icon: InfoCircle, title: "Main Info", description: "Name, address, contact details and time zone.", content: MainInfoContent },
    {
        id: "links",
        icon: Link03,
        title: "Links",
        description: "Public URLs for booking, your website and social profiles.",
        footer: "none",
        content: LinksContent,
    },
    {
        id: "sub-courses",
        icon: Target04,
        title: "Sub-courses",
        description: "The nines and course configurations that make up this facility.",
        footer: "none",
        content: SubCoursesContent,
    },
    {
        id: "taxes-fees",
        icon: Percent02,
        title: "Taxes & Fees",
        description: "Tax rates and the fees applied to bookings and orders.",
        content: TaxesFeesContent,
    },
    { id: "payments", icon: CreditCard02, title: "Payments", description: "Processors, terminals and how payments are captured.", content: PaymentsContent },
    {
        id: "booking-engine",
        icon: CpuChip01,
        title: "Booking Engine",
        description: "How tee times are presented and sold to customers.",
        content: BookingEngineContent,
    },
    {
        id: "booking-rules",
        icon: Shield01,
        title: "Booking Rules",
        description: "Windows, limits and restrictions on who can book what.",
        footer: "none",
        content: BookingRulesContent,
    },
    {
        id: "booking-waitlist",
        icon: Clock,
        title: "Booking Waitlist",
        description: "Standby lists and how waiting customers are notified.",
        content: BookingWaitlistContent,
    },
    { id: "birdie", icon: CpuChip01, title: "Birdie", description: "Birdie kiosk and tablet configuration.", content: BirdieContent },
    {
        id: "tablets",
        icon: Tablet02,
        title: "Tablets",
        description: "Registered tablets and what each one is assigned to.",
        footer: "none",
        content: TabletsContent,
    },
    {
        id: "transportation-types",
        icon: Car01,
        title: "Transportation Types",
        description: "Carts and other transport offered at checkout.",
        footer: "none",
        content: TransportationContent,
    },
    {
        id: "notifications",
        icon: Bell01,
        title: "Notifications",
        description: "Email and SMS sent to customers and staff.",
        footer: "none",
        content: NotificationsContent,
    },
    { id: "printers", icon: Printer, title: "Printers", description: "Receipt and ticket printers for this course.", footer: "none", content: PrintersContent },
    {
        id: "images",
        icon: Image03,
        title: "Images",
        description: "Course photography used across the booking surfaces.",
        footer: "none",
        content: ImagesContent,
    },
    {
        id: "documents",
        icon: Folder,
        title: "Documents",
        description: "Files and policies attached to this course.",
        footer: "none",
        content: DocumentsContent,
    },
    { id: "events", icon: Calendar, title: "Events", description: "Defaults applied to events and outings.", content: EventsContent },
    { id: "company", icon: Building05, title: "Company", description: "Parent company and multi-course settings.", footer: "locked", content: CompanyContent },
];

/** Page body: header with Expand all / Collapse all, then the accordion of sections. */
export const CourseSettingsPage = () => {
    const [open, setOpen] = useState<Set<string>>(() => new Set());

    // Deep link: /#payments opens and scrolls to that section.
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!SECTIONS.some((s) => s.id === id)) return;
        setOpen(new Set([id]));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    }, []);

    // Open the section that holds a searched-for setting, then scroll to and pulse it.
    useEffect(() => {
        const onReveal = (event: Event) => {
            const { sectionId, label, occurrence = 0 } = (event as CustomEvent<RevealSettingDetail>).detail;
            setOpen((prev) => new Set(prev).add(sectionId));
            // Two frames: one for React to render the opened section, one for layout.
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    const section = document.getElementById(sectionId);
                    if (!section) return;
                    const target = label ? section.querySelectorAll<HTMLElement>(`[data-setting-label="${CSS.escape(label)}"]`)[occurrence] : undefined;
                    if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "center" });
                        pulseElement(target);
                    } else {
                        scrollBelowChrome(section, 170);
                    }
                }),
            );
        };
        window.addEventListener(REVEAL_SETTING_EVENT, onReveal);
        return () => window.removeEventListener(REVEAL_SETTING_EVENT, onReveal);
    }, []);

    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <>
            <div className="flex flex-col gap-4 border-b border-secondary bg-primary px-4 py-6 sm:flex-row sm:items-start sm:justify-between lg:px-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-display-xs font-semibold text-primary">Golf Course Settings</h1>
                        <Badge type="color" size="sm" color="gray">
                            {COURSE.settingsId}
                        </Badge>
                    </div>
                    <p className="text-md text-tertiary">Configure how {COURSE.name} operates across booking, payments and hardware.</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    <Button color="link-color" size="md" onClick={() => setOpen(new Set(SECTIONS.map((s) => s.id)))}>
                        Expand all
                    </Button>
                    <span className="text-quaternary" aria-hidden="true">
                        |
                    </span>
                    <Button color="link-color" size="md" onClick={() => setOpen(new Set())}>
                        Collapse all
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 px-4 py-8 lg:px-8">
                {SECTIONS.map(({ id, icon, title, description, footer, content: Content }) => (
                    <SettingsSection
                        key={id}
                        id={id}
                        icon={icon}
                        title={title}
                        description={description}
                        footer={footer}
                        isOpen={open.has(id)}
                        onToggle={() => toggle(id)}
                    >
                        <Content />
                    </SettingsSection>
                ))}
            </div>
        </>
    );
};

/** The full "Buck V1 Old — Course Settings" prototype: legacy chrome + settings page. */
export const BuckV1OldCourseSettings = ({ header }: { header?: ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-secondary">
            <LegacySidebar isMobileOpen={isMenuOpen} onMobileClose={() => setIsMenuOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <LegacyTopBar onMenuClick={() => setIsMenuOpen(true)} />
                <main className="flex-1">
                    {header}
                    <CourseSettingsPage />
                </main>
            </div>
        </div>
    );
};
