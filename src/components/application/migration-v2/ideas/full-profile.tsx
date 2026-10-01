"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import {
    Award01,
    Bank,
    BankNote01,
    CalendarCheck01,
    Car01,
    ClockRewind,
    CreditCard02,
    Download01,
    Edit03,
    File02,
    Folder,
    Gift01,
    GraduationHat01,
    Hash02,
    Home02,
    Key01,
    LayersThree01,
    List,
    Mail01,
    Passport,
    Phone,
    Rows01,
    Settings01,
    ShoppingBag01,
    Target04,
    Ticket01,
    Trash01,
    Truck01,
    Umbrella03,
    User01,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import type { CustomerProfile } from "../data";
import { COURSES } from "../data";
import { LinkText, ScreenShell, TableCard, Td, Th } from "../kit";
import { NAV_IDS } from "../nav-tree";
import type { Nav, PanelPage } from "./drilldown";
import { MainCard, MoreActions, PanelGroup, PanelIdentity, PanelRow, PanelStat, RailBlock, RecordHeader, RecordLayout, StatBar } from "./ideas-kit";

/**
 * A fully filled-out customer for the Migration V2 Ideas — every one of the
 * 18 profile sections has data, so the proposals can be judged on a busy
 * account rather than an empty one. Identity (name, IDs, email, phone) comes
 * from whichever customer is opened; the account history is shared.
 * All data is invented.
 */

const COURSE = COURSES.dunes.name;

export const PROFILE_DETAILS = {
    dob: "03/14/1981",
    mailingAlias: "mreyes",
    height: "71",
    clothingSize: "L",
    anniversary: "06/09/2012",
    clubId: "DUN-0457",
    purchasePreferences: "Titleist Pro V1 (yellow). Size L polos, 34×32 pants. Prefers FootJoy.",
    notes: "Left-handed. Prefers first tee times on Saturdays. Allergic to shellfish — flag for event menus.",
    billing: { line1: "4180 Sendero Ridge", line2: "", city: "Bulverde", state: "TX", zip: "78163" },
    shipping: { line1: "4180 Sendero Ridge", line2: "Gate code 2207", city: "Bulverde", state: "TX", zip: "78163" },
    settings: [
        { label: "Cannot Book Online", on: false },
        { label: "Disable Charges", on: false },
        { label: "Email Opt-Out", on: false },
        { label: "Prompt Order Notes", on: true },
    ],
};

/* -------------------------------------------------------------------------- */
/*  Sections                                                                  */
/* -------------------------------------------------------------------------- */

export type SectionItem = { title: string; hint?: string; value?: string; fields: [string, string][] };
export type ProfileSection = {
    id: string;
    label: string;
    icon: FC<{ className?: string }>;
    group: "Account" | "Activity" | "Billing & credits";
    /** Short value shown on the root row. */
    summary: string;
    items: SectionItem[];
    /** Actions offered on the section page (same as today's section toolbars). */
    actions?: { label: string; icon: FC<{ className?: string }> }[];
};

const NEW = { label: "New", icon: Edit03 };
const EXPORT = { label: "Export", icon: Download01 };

export const SECTIONS: ProfileSection[] = [
    {
        id: "family",
        label: "Family members",
        icon: Users01,
        group: "Account",
        summary: "2",
        actions: [NEW],
        items: [
            {
                title: "Elena",
                hint: "Spouse · DOB 11/02/1983",
                fields: [
                    ["ID", "1351036"],
                    ["Relationship", "Spouse"],
                    ["DOB", "11/02/1983"],
                    ["Email", "elena.r@example.com"],
                ],
            },
            {
                title: "Mateo",
                hint: "Child · DOB 05/21/2013",
                fields: [
                    ["ID", "1351035"],
                    ["Relationship", "Child"],
                    ["DOB", "05/21/2013"],
                    ["Junior program", "Yes"],
                ],
            },
        ],
    },
    {
        id: "customer-types",
        label: "Customer types",
        icon: LayersThree01,
        group: "Account",
        summary: "3",
        actions: [NEW],
        items: [
            {
                title: "Full Member",
                fields: [
                    ["Added", "Jan 04, 2024"],
                    ["Pricing", "Member rates"],
                ],
            },
            {
                title: "Men's League",
                fields: [
                    ["Added", "Mar 12, 2025"],
                    ["Pricing", "League rates"],
                ],
            },
            {
                title: "Resident",
                fields: [
                    ["Added", "Jan 04, 2024"],
                    ["Pricing", "Resident discount"],
                ],
            },
        ],
    },
    {
        id: "payment-methods",
        label: "Payment methods",
        icon: CreditCard02,
        group: "Account",
        summary: "Visa •••• 4242",
        actions: [
            { label: "Add Card", icon: CreditCard02 },
            { label: "Add ACH", icon: Bank },
        ],
        items: [
            {
                title: "Visa •••• 4242",
                hint: "Expires 08/28 · Default",
                fields: [
                    ["ID", "88412"],
                    ["Merchant ID", "850000000054"],
                    ["Processor", "CardConnect"],
                    ["Expiration", "08/28"],
                ],
            },
            {
                title: "Chase Checking •••• 6610",
                hint: "ACH",
                fields: [
                    ["ID", "88413"],
                    ["Processor", "CardConnect ACH"],
                    ["ACH name", "Primary account holder"],
                ],
            },
        ],
    },
    {
        id: "documents",
        label: "Documents",
        icon: Folder,
        group: "Account",
        summary: "2",
        actions: [NEW],
        items: [
            {
                title: "Membership agreement 2026.pdf",
                hint: "Uploaded Jan 04, 2026",
                fields: [
                    ["Uploaded by", "Sam Porter"],
                    ["Size", "412 KB"],
                ],
            },
            {
                title: "Liability waiver.pdf",
                hint: "Uploaded Mar 02, 2025",
                fields: [
                    ["Uploaded by", "Front desk"],
                    ["Size", "128 KB"],
                ],
            },
        ],
    },
    {
        id: "tee-times",
        label: "Tee times",
        icon: Target04,
        group: "Activity",
        summary: "6",
        actions: [EXPORT],
        items: [
            ["6912204", "Oct 04, 2026 07:10 AM", "North", "4"],
            ["6899817", "Sep 27, 2026 07:20 AM", "North", "4"],
            ["6871150", "Sep 13, 2026 08:00 AM", "East", "2"],
            ["6844096", "May 05, 2026 07:30 AM", "North", "4"],
            ["6829999", "Apr 30, 2026 11:40 AM", "East", "2"],
            ["6801342", "Apr 18, 2026 07:00 AM", "North", "3"],
        ].map(([id, date, sub, players]) => ({
            title: date,
            hint: `${sub} Course · ${players} players`,
            value: `#${id}`,
            fields: [
                ["ID", id],
                ["Course", COURSE],
                ["Sub course", `${sub} Course`],
                ["Players", players],
            ] as [string, string][],
        })),
    },
    {
        id: "orders",
        label: "Orders",
        icon: ShoppingBag01,
        group: "Activity",
        summary: "8",
        actions: [EXPORT],
        items: [
            ["6459663", "Oct 01, 2026 02:00 AM", "$53.63", "Monthly dues"],
            ["6458975", "Sep 30, 2026 05:02 PM", "$275.00", "Pro shop · Driver"],
            ["6458408", "Sep 30, 2026 04:14 PM", "$16.69", "Grill · Lunch"],
            ["6431102", "Sep 27, 2026 12:48 PM", "$42.10", "Grill · Lunch"],
            ["6420051", "Sep 13, 2026 08:05 AM", "$65.00", "Green fee · Guest"],
            ["6398700", "Aug 29, 2026 06:30 PM", "$128.40", "Event · Member-Guest dinner"],
            ["6377215", "Aug 16, 2026 09:12 AM", "$39.99", "Pro shop · Balls"],
            ["6350988", "Aug 01, 2026 02:00 AM", "$53.63", "Monthly dues"],
        ].map(([id, date, amount, what]) => ({
            title: what,
            hint: date,
            value: amount,
            fields: [
                ["Order ID", id],
                ["Course", COURSE],
                ["Date", date],
                ["Amount", amount],
            ] as [string, string][],
        })),
    },
    {
        id: "waitlists",
        label: "Waitlists",
        icon: List,
        group: "Activity",
        summary: "2",
        items: [
            {
                title: "Oct 11, 2026 · 7:00–9:00 AM",
                hint: "4 players · Pending",
                fields: [
                    ["Status", "Pending"],
                    ["Window", "7:00–9:00 AM"],
                    ["Players", "4"],
                    ["Notify", "Text"],
                ],
            },
            {
                title: "Sep 20, 2026 · 7:00–8:00 AM",
                hint: "4 players · Fulfilled",
                fields: [
                    ["Status", "Fulfilled"],
                    ["Booked tee time", "#6884410"],
                    ["Players", "4"],
                ],
            },
        ],
    },
    {
        id: "cart-signouts",
        label: "Cart signouts",
        icon: Car01,
        group: "Activity",
        summary: "3",
        items: [
            {
                title: "Cart #14",
                hint: "Sep 27, 2026 07:12 AM",
                fields: [
                    ["Cart #", "14"],
                    ["Created", "Sep 27, 2026 07:12 AM"],
                    ["Signature", "On file"],
                ],
            },
            {
                title: "Cart #22",
                hint: "Sep 13, 2026 07:58 AM",
                fields: [
                    ["Cart #", "22"],
                    ["Created", "Sep 13, 2026 07:58 AM"],
                    ["Signature", "On file"],
                ],
            },
            {
                title: "Cart #9",
                hint: "May 05, 2026 07:25 AM",
                fields: [
                    ["Cart #", "9"],
                    ["Created", "May 05, 2026 07:25 AM"],
                    ["Signature", "On file"],
                ],
            },
        ],
    },
    {
        id: "clinics",
        label: "Clinics",
        icon: GraduationHat01,
        group: "Activity",
        summary: "2",
        actions: [EXPORT],
        items: [
            {
                title: "Short Game Clinic",
                hint: "Sep 18, 2026 · 5:30 PM",
                value: "$45.00",
                fields: [
                    ["Instructor", "Dana Brooks"],
                    ["Spots", "1"],
                    ["Paid", "$45.00"],
                ],
            },
            {
                title: "Junior Summer Camp (Mateo)",
                hint: "Jun 09–13, 2026",
                value: "$225.00",
                fields: [
                    ["Instructor", "Chris Lane"],
                    ["Participant", "Mateo (child)"],
                    ["Paid", "$225.00"],
                ],
            },
        ],
    },
    {
        id: "activity-bookings",
        label: "Activity bookings",
        icon: CalendarCheck01,
        group: "Activity",
        summary: "2",
        items: [
            {
                title: "Simulator Bay 2",
                hint: "Oct 08, 2026 · 6:00–7:00 PM",
                value: "$40.00",
                fields: [
                    ["Resource", "Bay 2"],
                    ["Duration", "1 hour"],
                    ["Players", "2"],
                ],
            },
            {
                title: "Pickleball Court 1",
                hint: "Sep 21, 2026 · 9:00–10:30 AM",
                value: "$24.00",
                fields: [
                    ["Resource", "Court 1"],
                    ["Duration", "1.5 hours"],
                    ["Players", "4"],
                ],
            },
        ],
    },
    {
        id: "activities",
        label: "Activities",
        icon: Rows01,
        group: "Activity",
        summary: "5",
        items: [
            ["10522017", "Sep 30, 2026 05:02 PM", "Sam Porter", "Order Created", "Pro shop sale"],
            ["10488664", "May 05, 2026 06:36 PM", "Sam Porter", "Reservation Moved", "N/A"],
            ["9032602", "Apr 15, 2026 06:10 PM", "Sam Porter", "Reservation Canceled", "TeeTimeCustomers5Controller"],
            ["8201190", "Mar 12, 2026 10:22 AM", "Front desk", "Customer Type Added", "Men's League"],
            ["7107228", "Jan 15, 2026 02:52 PM", "Customer (online)", "Membership Renewed", "Full Golf Membership 2026"],
        ].map(([id, date, user, activity, notes]) => ({
            title: activity,
            hint: `${user} · ${date}`,
            fields: [
                ["ID", id],
                ["Date", date],
                ["User", user],
                ["Notes", notes],
            ] as [string, string][],
        })),
    },
    {
        id: "memberships",
        label: "Memberships",
        icon: Passport,
        group: "Billing & credits",
        summary: "Full Golf",
        actions: [NEW],
        items: [
            {
                title: "Full Golf Membership",
                hint: "Expires Jan 01, 2027",
                fields: [
                    ["Course", COURSE],
                    ["Started", "Jan 04, 2024"],
                    ["Expires", "Jan 01, 2027 02:00 AM"],
                    ["Dues", "$53.63 / month"],
                ],
            },
        ],
    },
    {
        id: "payments",
        label: "Payments",
        icon: BankNote01,
        group: "Billing & credits",
        summary: "4",
        actions: [NEW, EXPORT],
        items: [
            ["185811", "Oct 01, 2026", "$53.63", "Visa •••• 4242"],
            ["182333", "Sep 01, 2026", "$304.81", "Visa •••• 4242"],
            ["176497", "Jul 01, 2026", "$127.60", "Chase •••• 6610"],
            ["170022", "Jun 01, 2026", "$53.63", "Visa •••• 4242"],
        ].map(([id, date, amount, method]) => ({
            title: amount,
            hint: `${date} · ${method}`,
            value: "Complete",
            fields: [
                ["CCP ID", id],
                ["Date", date],
                ["Method", method],
                ["Status", "Complete"],
            ] as [string, string][],
        })),
    },
    {
        id: "punch-cards",
        label: "Punch cards",
        icon: Ticket01,
        group: "Billing & credits",
        summary: "4 left",
        actions: [EXPORT],
        items: [
            {
                title: "10-Round Punch Card",
                hint: "6 of 10 used · Expires Dec 31, 2026",
                value: "4 left",
                fields: [
                    ["CPC ID", "21410"],
                    ["Awarded", "10"],
                    ["Used", "6"],
                    ["Expires", "Dec 31, 2026"],
                ],
            },
        ],
    },
    {
        id: "rain-checks",
        label: "Rain checks",
        icon: Umbrella03,
        group: "Billing & credits",
        summary: "$42.00",
        items: [
            {
                title: "$42.00",
                hint: "Issued Sep 13, 2026 · Expires Mar 13, 2027",
                fields: [
                    ["Issued for", "Tee time #6871150"],
                    ["Issued by", "Sam Porter"],
                    ["Expires", "Mar 13, 2027"],
                ],
            },
        ],
    },
    {
        id: "rewards",
        label: "Rewards",
        icon: Award01,
        group: "Billing & credits",
        summary: "1,240 pts",
        actions: [{ label: "Adjust Balance", icon: Edit03 }, EXPORT],
        items: [
            {
                title: "+275 pts",
                hint: "Sep 30, 2026 · Pro shop purchase",
                fields: [
                    ["Order", "6458975"],
                    ["Balance after", "1,240 pts"],
                ],
            },
            {
                title: "−500 pts",
                hint: "Aug 29, 2026 · Redeemed on event dinner",
                fields: [
                    ["Order", "6398700"],
                    ["Balance after", "965 pts"],
                ],
            },
            {
                title: "+128 pts",
                hint: "Aug 29, 2026 · Event purchase",
                fields: [
                    ["Order", "6398700"],
                    ["Balance after", "1,465 pts"],
                ],
            },
        ],
    },
    {
        id: "gift-cards",
        label: "Gift cards",
        icon: Gift01,
        group: "Billing & credits",
        summary: "$35.50",
        actions: [NEW, EXPORT],
        items: [
            {
                title: "Gift card •••• 7731",
                hint: "Balance $35.50 of $100.00",
                value: "$35.50",
                fields: [
                    ["Number", "•••• 7731"],
                    ["Original", "$100.00"],
                    ["Balance", "$35.50"],
                    ["Expires", "Never"],
                ],
            },
        ],
    },
];

const GROUPS = ["Account", "Activity", "Billing & credits"] as const;
const section = (id: string) => SECTIONS.find((s) => s.id === id)!;

/* -------------------------------------------------------------------------- */
/*  Idea 1 · drill-down pages                                                 */
/* -------------------------------------------------------------------------- */

const doneFooter =
    (label = "Done") =>
    (nav: Nav) => (
        <Button size="md" className="w-full" onClick={nav.back}>
            {label}
        </Button>
    );

export const fieldPage = (label: string, value: string): PanelPage => ({
    title: label,
    body: () => <Input label={label} defaultValue={value} />,
    footer: doneFooter(),
});

export const addressPage = (which: "billing" | "shipping"): PanelPage => {
    const a = which === "billing" ? PROFILE_DETAILS.billing : PROFILE_DETAILS.shipping;
    return {
        title: which === "billing" ? "Billing address" : "Shipping address",
        body: () => (
            <div className="flex flex-col gap-4">
                <Input label="Line 1" defaultValue={a.line1} />
                <Input label="Line 2" defaultValue={a.line2} placeholder="Apartment, suite, etc. (optional)" />
                <Input label="City" defaultValue={a.city} />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="State" defaultValue={a.state} />
                    <Input label="Zip" defaultValue={a.zip} />
                </div>
            </div>
        ),
        footer: doneFooter(),
    };
};

export const settingsPage: PanelPage = {
    title: "Other settings",
    body: () => (
        <div className="flex flex-col divide-y divide-secondary">
            {PROFILE_DETAILS.settings.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-3.5">
                    <span className="text-sm font-medium text-primary">{s.label}</span>
                    <Toggle aria-label={s.label} size="md" defaultSelected={s.on} />
                </div>
            ))}
        </div>
    ),
    footer: doneFooter("Save"),
};

export const profilePage = (c: CustomerProfile): PanelPage => ({
    title: "Profile",
    body: (nav) => {
        const d = PROFILE_DETAILS;
        const field = (label: string, value: string) => (
            <PanelRow label={label} value={value || "Add"} muted={!value} onClick={() => nav.push(fieldPage(label, value))} />
        );
        return (
            <>
                <PanelIdentity name={c.name} />
                <PanelGroup title="Contact">
                    {field("Phone number", c.phone)}
                    {field("Email", c.email)}
                    {field("Mailing alias", d.mailingAlias)}
                </PanelGroup>
                <PanelGroup title="Identity">
                    {field("First name", c.firstName)}
                    {field("Last name", c.lastName)}
                    {field("Date of birth", d.dob)}
                    {field("Wedding anniversary", d.anniversary)}
                    {field("Height (inches)", d.height)}
                    {field("Clothing size", d.clothingSize)}
                </PanelGroup>
                <PanelGroup title="Addresses">
                    <PanelRow
                        icon={Home02}
                        label="Billing address"
                        hint={`${d.billing.line1}, ${d.billing.city}, ${d.billing.state} ${d.billing.zip}`}
                        onClick={() => nav.push(addressPage("billing"))}
                    />
                    <PanelRow
                        icon={Truck01}
                        label="Shipping address"
                        hint={`${d.shipping.line1}, ${d.shipping.line2}, ${d.shipping.city}`}
                        onClick={() => nav.push(addressPage("shipping"))}
                    />
                </PanelGroup>
                <PanelGroup title="Account">
                    <PanelRow
                        icon={Settings01}
                        label="Other settings"
                        hint="Online booking, charges, email, order notes"
                        onClick={() => nav.push(settingsPage)}
                    />
                    {field("Club ID", d.clubId)}
                    {field("Purchase preferences", d.purchasePreferences)}
                    {field("Notes", d.notes)}
                    <PanelRow icon={Hash02} label="Golf course customer ID" value={c.gccId} static />
                    <PanelRow icon={Hash02} label="Customer ID" value={c.customerId} static />
                    <PanelRow icon={Key01} label="Reset customer password" />
                </PanelGroup>
            </>
        );
    },
});

const itemPage = (s: ProfileSection, item: SectionItem): PanelPage => ({
    title: item.title,
    body: () => (
        <>
            {item.hint && <p className="-mt-3 text-sm text-tertiary">{item.hint}</p>}
            <PanelGroup title={s.label}>
                {item.fields.map(([k, v]) => (
                    <PanelRow key={k} label={k} value={v} static />
                ))}
            </PanelGroup>
        </>
    ),
    footer: () => (
        <div className="flex gap-3">
            <Button color="secondary" size="md" iconLeading={Edit03} className="flex-1">
                Edit
            </Button>
            <Button color="secondary-destructive" size="md" iconLeading={Trash01} className="flex-1">
                Remove
            </Button>
        </div>
    ),
});

export const sectionPage = (id: string): PanelPage => {
    const s = section(id);
    return {
        title: s.label,
        body: (nav) => (
            <>
                {s.actions && (
                    <div className="-mt-2 flex flex-wrap gap-2">
                        {s.actions.map((a) => (
                            <Button key={a.label} color="secondary" size="sm" iconLeading={a.icon}>
                                {a.label}
                            </Button>
                        ))}
                    </div>
                )}
                <PanelGroup title={`${s.items.length} ${s.items.length === 1 ? "item" : "items"}`}>
                    {s.items.map((item, index) => (
                        <PanelRow key={index} label={item.title} hint={item.hint} value={item.value} onClick={() => nav.push(itemPage(s, item))} />
                    ))}
                </PanelGroup>
            </>
        ),
    };
};

interface CustomerPageOptions {
    /** Sections most relevant to the screen this panel was opened from; shown first. */
    focus?: string[];
    /** Heading for the focus group, e.g. "For this charge". */
    focusTitle?: string;
    /** Context card above the customer (the row's own record). */
    lead?: (nav: Nav) => ReactNode;
    title?: string;
}

/** The full customer, as a drill-down page: every section is a row that opens its list. */
export const customerPage = (
    c: CustomerProfile,
    { focus = [], focusTitle = "Most relevant here", lead, title = "Customer" }: CustomerPageOptions = {},
): PanelPage => ({
    title,
    body: (nav) => (
        <>
            {lead?.(nav)}
            <PanelIdentity name={c.name} sub={`#${c.gccId} · ${c.email}`} action={<LinkText onClick={() => nav.push(profilePage(c))}>Edit profile</LinkText>} />
            <div className="grid grid-cols-2 gap-3">
                <PanelStat label="Membership" value="Full Golf" />
                <PanelStat label="Rewards" value="1,240 pts" />
                <PanelStat label="Gift card balance" value="$35.50" />
                <PanelStat label="Punch card" value="4 rounds left" />
            </div>
            {focus.length > 0 && (
                <PanelGroup title={focusTitle}>
                    {focus.map((id) => {
                        const s = section(id);
                        return <PanelRow key={id} icon={s.icon} label={s.label} value={s.summary} onClick={() => nav.push(sectionPage(id))} />;
                    })}
                </PanelGroup>
            )}
            {GROUPS.map((g) => (
                <PanelGroup key={g} title={g}>
                    {g === "Account" && (
                        <PanelRow icon={User01} label="Profile" hint="Contact details, addresses, settings" onClick={() => nav.push(profilePage(c))} />
                    )}
                    {SECTIONS.filter((s) => s.group === g && !focus.includes(s.id)).map((s) => (
                        <PanelRow key={s.id} icon={s.icon} label={s.label} value={s.summary} onClick={() => nav.push(sectionPage(s.id))} />
                    ))}
                </PanelGroup>
            ))}
            <PanelGroup title="Account actions">
                <PanelRow icon={File02} label="Statements" />
                <PanelRow icon={File02} label="Invoice by date" />
                <PanelRow icon={ClockRewind} label="Charge history" />
                <PanelRow icon={Trash01} label="Delete customer" />
            </PanelGroup>
        </>
    ),
});

/** A tappable customer row that opens the full customer page. */
export const CustomerLinkRow = ({ customer, nav, options }: { customer: CustomerProfile; nav: Nav; options?: CustomerPageOptions }) => (
    <PanelRow
        icon={User01}
        label={customer.name}
        hint={`#${customer.gccId} · Full Golf · 1,240 pts`}
        onClick={() => nav.push(customerPage(customer, options))}
    />
);

/** Build a customer identity from a table row (invented contact details where the row has none). */
export const personFrom = (name: string, gccId: string, email?: string | null, phone?: string | null): CustomerProfile => {
    const [first, ...rest] = name.split(" ");
    const slug = name
        .toLowerCase()
        .replace(/[^a-z]+/g, ".")
        .replace(/^\.|\.$/g, "");
    return {
        name,
        gccId,
        customerId: String(1400000 + (Number(gccId) % 99999)),
        firstName: first,
        lastName: rest.join(" "),
        email: email ?? `${slug}@example.com`,
        phone: phone ?? `(210) 555-${String(Number(gccId) % 10000).padStart(4, "0")}`,
    };
};

/* -------------------------------------------------------------------------- */
/*  Idea 2 · full record page                                                 */
/* -------------------------------------------------------------------------- */

const ItemTable = ({ id, columns }: { id: string; columns: string[] }) => {
    const s = section(id);
    return (
        <TableCard>
            <thead>
                <tr>
                    {columns.map((c, i) => (
                        <Th key={c} className={i === columns.length - 1 ? "text-right" : undefined}>
                            {c}
                        </Th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {s.items.map((item, i) => (
                    <tr key={i}>
                        <Td className="font-medium">{item.title}</Td>
                        <Td className="text-tertiary">{item.hint}</Td>
                        {columns.length > 2 && <Td className="text-right tabular-nums">{item.value ?? ""}</Td>}
                    </tr>
                ))}
            </tbody>
        </TableCard>
    );
};

const SectionCard = ({ id, columns = ["Item", "Details", ""] }: { id: string; columns?: string[] }) => {
    const s = section(id);
    return (
        <MainCard
            title={`${s.label} · ${s.items.length}`}
            action={
                s.actions && (
                    <div className="flex gap-2">
                        {s.actions.map((a) => (
                            <Button key={a.label} color="secondary" size="sm" iconLeading={a.icon}>
                                {a.label}
                            </Button>
                        ))}
                    </div>
                )
            }
        >
            <ItemTable id={id} columns={columns} />
        </MainCard>
    );
};

/** Idea 2: the full customer as a Record page — every section filled. */
export const CustomerRecordPage = ({ customer, breadcrumb = "Customer Charges" }: { customer: CustomerProfile; breadcrumb?: string }) => {
    const d = PROFILE_DETAILS;
    const activities = section("activities").items;
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.charges, initialQuery: "charges" }}
            title={customer.name}
            description=""
            header={
                <RecordHeader
                    breadcrumb={breadcrumb}
                    breadcrumbIcon={User01}
                    title={customer.name}
                    subtitle={
                        <span className="flex flex-wrap items-center gap-2">
                            #{customer.gccId}
                            {section("customer-types").items.map((t) => (
                                <Badge key={t.title} type="color" size="sm" color="brand">
                                    {t.title}
                                </Badge>
                            ))}
                        </span>
                    }
                    actions={
                        <MoreActions
                            actions={[
                                { label: "Statements", icon: File02 },
                                { label: "Invoice By Date", icon: File02 },
                                { label: "Charge History", icon: ClockRewind },
                                { label: "Reset Customer Password", icon: Key01 },
                                { label: "Delete customer", icon: Trash01, destructive: true },
                            ]}
                        />
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Orders", value: section("orders").items.length },
                    { label: "Tee times", value: section("tee-times").items.length },
                    { label: "Membership", value: "Full Golf" },
                    { label: "Rewards", value: "1,240 pts" },
                    { label: "Gift card balance", value: "$35.50" },
                ]}
            />
            <RecordLayout
                main={
                    <>
                        <SectionCard id="orders" columns={["Order", "Date", "Amount"]} />
                        <SectionCard id="tee-times" columns={["Date", "Details", "ID"]} />
                        <SectionCard id="payments" columns={["Amount", "Date · method", "Status"]} />
                        <MainCard title="Activity">
                            <ol className="flex flex-col border-l border-secondary pl-5">
                                {activities.map((a, i) => (
                                    <li key={i} className="relative pb-5 last:pb-0">
                                        <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-fg-quaternary ring-4 ring-bg-secondary" />
                                        <span className="block text-sm font-semibold text-primary">{a.title}</span>
                                        <span className="text-sm text-tertiary">{a.hint}</span>
                                    </li>
                                ))}
                            </ol>
                        </MainCard>
                        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                            <SectionCard id="clinics" columns={["Clinic", "When", "Paid"]} />
                            <SectionCard id="activity-bookings" columns={["Resource", "When", "Price"]} />
                            <SectionCard id="waitlists" columns={["Request", "Details"]} />
                            <SectionCard id="cart-signouts" columns={["Cart", "Created"]} />
                            <SectionCard id="rewards" columns={["Points", "Details"]} />
                            <SectionCard id="documents" columns={["File", "Uploaded"]} />
                        </div>
                    </>
                }
                rail={
                    <>
                        <RailBlock title="Contact information" editable>
                            <span className="flex items-center gap-2">
                                <Mail01 className="size-4 text-fg-quaternary" />
                                <LinkText>{customer.email}</LinkText>
                            </span>
                            <span className="flex items-center gap-2">
                                <Phone className="size-4 text-fg-quaternary" />
                                {customer.phone}
                            </span>
                            <span className="text-tertiary">Mailing alias · {d.mailingAlias}</span>
                        </RailBlock>
                        <RailBlock title="Billing address" editable>
                            <span>{d.billing.line1}</span>
                            <span>
                                {d.billing.city}, {d.billing.state} {d.billing.zip}
                            </span>
                        </RailBlock>
                        <RailBlock title="Shipping address" editable>
                            <span>{d.shipping.line1}</span>
                            <span className="text-tertiary">{d.shipping.line2}</span>
                            <span>
                                {d.shipping.city}, {d.shipping.state} {d.shipping.zip}
                            </span>
                        </RailBlock>
                        <RailBlock title="Personal" editable>
                            <span className="text-tertiary">
                                Born {d.dob} · Anniversary {d.anniversary}
                            </span>
                            <span className="text-tertiary">
                                Height {d.height}" · Size {d.clothingSize}
                            </span>
                        </RailBlock>
                        <RailBlock title="Membership">
                            <span>Full Golf Membership</span>
                            <span className="text-xs text-tertiary">Expires Jan 01, 2027 · $53.63 / month</span>
                        </RailBlock>
                        <RailBlock title="Credits">
                            {(["punch-cards", "rain-checks", "gift-cards"] as const).map((id) => (
                                <span key={id} className="flex justify-between">
                                    {section(id).label}
                                    <span className="text-tertiary">{section(id).summary}</span>
                                </span>
                            ))}
                        </RailBlock>
                        <RailBlock title="Payment methods" editable>
                            {section("payment-methods").items.map((m) => (
                                <span key={m.title} className="flex items-center gap-2">
                                    <CreditCard02 className="size-4 text-fg-quaternary" />
                                    {m.title}
                                </span>
                            ))}
                        </RailBlock>
                        <RailBlock title="Family members" editable>
                            {section("family").items.map((f) => (
                                <span key={f.title} className="flex justify-between">
                                    <LinkText>{f.title}</LinkText>
                                    <span className="text-tertiary">{f.hint?.split(" · ")[0]}</span>
                                </span>
                            ))}
                        </RailBlock>
                        <RailBlock title="IDs">
                            <span className="text-tertiary">Golf course customer ID · {customer.gccId}</span>
                            <span className="text-tertiary">Customer ID · {customer.customerId}</span>
                            <span className="text-tertiary">Club ID · {d.clubId}</span>
                        </RailBlock>
                        <RailBlock title="Settings" editable>
                            {d.settings.map((s) => (
                                <span key={s.label} className="flex justify-between text-tertiary">
                                    {s.label}
                                    <span>{s.on ? "On" : "Off"}</span>
                                </span>
                            ))}
                        </RailBlock>
                        <RailBlock title="Purchase preferences" editable>
                            <span className="text-tertiary">{d.purchasePreferences}</span>
                        </RailBlock>
                        <RailBlock title="Notes" editable>
                            <span className="text-tertiary">{d.notes}</span>
                        </RailBlock>
                    </>
                }
            />
        </ScreenShell>
    );
};

/** Compact customer block for other records' rails (payments, history). */
export const CustomerRailSummary = ({ customer }: { customer: CustomerProfile }) => (
    <RailBlock title="Customer" editable>
        <LinkText>{customer.name}</LinkText>
        <span className="text-tertiary">{customer.email}</span>
        <span className="text-tertiary">{customer.phone}</span>
        <span className="mt-1 flex flex-wrap gap-1.5">
            {section("customer-types").items.map((t) => (
                <Badge key={t.title} type="color" size="sm" color="gray">
                    {t.title}
                </Badge>
            ))}
        </span>
        <span className="mt-1 text-xs text-tertiary">Full Golf Membership · 1,240 reward pts · Visa •••• 4242</span>
    </RailBlock>
);
