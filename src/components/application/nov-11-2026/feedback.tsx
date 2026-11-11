"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Download01, FilterLines, Pin02, SearchLg, XClose } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { CreditsHeader, STd, STh, SectionEmpty, SectionTable } from "../credits-oct-27/kit";
import { COURSES, type CourseKey } from "../migration-v2/data";
import { ScreenShell, TabStrip } from "../migration-v2/kit";
import { SelectField } from "../products-oct-27/kit";

/*
 * Buck items from the MCG feedback file reviewed on the Nov 11 call. Each page
 * is the smallest change that answers the row it came from; the row is quoted
 * in the story's description. Names and numbers are invented.
 */

const matches = (q: string, ...fields: string[]) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    const digits = s.replace(/\D/g, "");
    return fields.some((f) => f.toLowerCase().includes(s) || (digits.length >= 3 && f.replace(/\D/g, "").includes(digits)));
};

/** Search that sits first in the filter bar, so nobody has to leave the report to find one person. */
const SearchBar = ({
    value,
    onChange,
    placeholder,
    count,
    total,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    count: number;
    total: number;
}) => (
    <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-[28rem]">
            <Input aria-label="Search" icon={SearchLg} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
        {value.trim() && (
            <>
                <span className="text-sm text-tertiary">
                    {count} of {total} match "{value.trim()}"
                </span>
                <Button size="sm" color="link-gray" iconLeading={XClose} onClick={() => onChange("")}>
                    Clear
                </Button>
            </>
        )}
    </div>
);

const DateRange = ({ from, to }: { from: string; to: string }) => (
    <div className="flex items-end gap-2">
        <div className="w-44">
            <SelectField label="From" value={from} onChange={() => {}} options={[from]} />
        </div>
        <div className="w-44">
            <SelectField label="To" value={to} onChange={() => {}} options={[to]} />
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Rounds by Customer: search, plus every round in place                     */
/* -------------------------------------------------------------------------- */

type RoundStatus = "played" | "noShow" | "noShowRefunded" | "cancelled";
type Round = { date: string; course: string; time: string; players: number; rate: string; paid: number; status: RoundStatus };
type CustomerRounds = { id: string; name: string; phone: string; email: string; rounds: Round[] };

const R = (date: string, course: string, time: string, players: number, rate: string, paid: number, status: RoundStatus = "played"): Round => ({
    date,
    course,
    time,
    players,
    rate,
    paid,
    status,
});

const ROUNDS_BY_CUSTOMER: CustomerRounds[] = [
    {
        id: "40112",
        name: "Harold Pemberton",
        phone: "(555) 310-2218",
        email: "h.pemberton@example.com",
        rounds: [
            R("Nov 9, 2026", "Bushwood Main", "8:20 AM", 4, "Senior", 38),
            R("Nov 2, 2026", "Bushwood Exec 9", "9:10 AM", 2, "Senior 9", 22),
            R("Oct 28, 2026", "Bushwood Main", "7:50 AM", 4, "Senior", 0, "noShowRefunded"),
            R("Oct 19, 2026", "Bushwood Main", "8:00 AM", 4, "Senior", 38),
        ],
    },
    {
        id: "40377",
        name: "Keisha Morrow",
        phone: "(555) 482-0091",
        email: "keisha.m@example.com",
        rounds: [R("Nov 8, 2026", "Bushwood Main", "1:40 PM", 3, "Rack", 89), R("Oct 30, 2026", "Bushwood Main", "2:10 PM", 2, "Twilight", 55)],
    },
    {
        id: "40415",
        name: "Victor Alvarez",
        phone: "(555) 615-3340",
        email: "valvarez@example.com",
        rounds: [
            R("Nov 10, 2026", "Bushwood Exec 9", "4:00 PM", 1, "Twilight 9", 18),
            R("Nov 3, 2026", "Bushwood Exec 9", "4:20 PM", 1, "Twilight 9", 0, "noShow"),
            R("Oct 27, 2026", "Bushwood Main", "3:30 PM", 2, "Twilight", 55),
        ],
    },
    {
        id: "40502",
        name: "Ruth Calloway",
        phone: "(555) 207-7765",
        email: "ruth.calloway@example.com",
        rounds: [R("Nov 7, 2026", "Bushwood Main", "9:30 AM", 4, "Member", 0), R("Oct 31, 2026", "Bushwood Main", "9:40 AM", 4, "Member", 0)],
    },
    {
        id: "40688",
        name: "Dev Patel",
        phone: "(555) 931-4402",
        email: "dev.patel@example.com",
        rounds: [R("Nov 6, 2026", "Bushwood Main", "11:10 AM", 2, "Rack", 89, "cancelled"), R("Oct 22, 2026", "Bushwood Main", "10:50 AM", 2, "Rack", 89)],
    },
    {
        id: "40731",
        name: "Margaret Ellison",
        phone: "(555) 310-8854",
        email: "m.ellison@example.com",
        rounds: [R("Nov 5, 2026", "Bushwood Exec 9", "8:00 AM", 2, "Senior 9", 22)],
    },
];

const STATUS: Record<RoundStatus, { label: string; color: "gray" | "success" | "error" | "warning" }> = {
    played: { label: "Played", color: "success" },
    noShow: { label: "No-show", color: "error" },
    noShowRefunded: { label: "No-show · refunded", color: "warning" },
    cancelled: { label: "Cancelled", color: "gray" },
};

const RoundsDetail = ({ c }: { c: CustomerRounds }) => {
    const noShows = c.rounds.filter((r) => r.status === "noShow" || r.status === "noShowRefunded").length;
    return (
        <div className="flex flex-col gap-3 bg-secondary px-6 py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                <span className="text-tertiary">
                    {c.phone} · {c.email}
                </span>
                <span className="text-tertiary">
                    No-shows on record <span className="font-semibold text-primary">{noShows}</span>
                </span>
                <Button size="sm" color="link-color" className="ml-auto">
                    Open profile
                </Button>
            </div>
            <div className="overflow-hidden rounded-lg bg-primary ring-1 ring-secondary">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs font-semibold text-tertiary uppercase">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Course</th>
                            <th className="px-4 py-2">Tee time</th>
                            <th className="px-4 py-2">Players</th>
                            <th className="px-4 py-2">Rate</th>
                            <th className="px-4 py-2 text-right">Paid</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {c.rounds.map((r) => (
                            <tr key={r.date + r.time} className="border-t border-secondary">
                                <td className="px-4 py-2.5 text-primary">{r.date}</td>
                                <td className="px-4 py-2.5 text-secondary">{r.course}</td>
                                <td className="px-4 py-2.5 text-secondary tabular-nums">{r.time}</td>
                                <td className="px-4 py-2.5 text-secondary tabular-nums">{r.players}</td>
                                <td className="px-4 py-2.5 text-secondary">{r.rate}</td>
                                <td className="px-4 py-2.5 text-right text-secondary tabular-nums">${r.paid.toFixed(2)}</td>
                                <td className="px-4 py-2.5">
                                    <Badge size="sm" color={STATUS[r.status].color}>
                                        {STATUS[r.status].label}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {c.rounds.some((r) => r.status === "noShowRefunded") && (
                <p className="text-xs text-tertiary">
                    A refunded no-show stays in the history, marked, so staff can tell a first no-show from a repeat without digging through refunds.
                </p>
            )}
        </div>
    );
};

export const RoundsByCustomerPage = ({ initialQuery = "", initialOpen = [] }: { initialQuery?: string; initialOpen?: string[] }) => {
    const [q, setQ] = useState(initialQuery);
    const [open, setOpen] = useState<string[]>(initialOpen);
    const rows = ROUNDS_BY_CUSTOMER.filter((c) => matches(q, c.name, c.phone, c.email, c.id));
    const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
    return (
        <ScreenShell
            nav={{ activeId: "reports", scrollToActive: true }}
            course="bushwood"
            title="Rounds by Customer"
            description=""
            header={
                <CreditsHeader
                    crumbs={["Reports", "Golf", "Rounds by Customer"]}
                    title="Rounds by Customer"
                    description="Every customer who played in the range, and each of their rounds."
                    actions={
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export
                        </Button>
                    }
                />
            }
        >
            <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary">
                <div className="flex flex-wrap items-end gap-4">
                    <DateRange from="Oct 1, 2026" to="Nov 11, 2026" />
                    <div className="w-56">
                        <SelectField label="Course" value="All courses" onChange={() => {}} options={["All courses", "Bushwood Main", "Bushwood Exec 9"]} />
                    </div>
                </div>
                <SearchBar
                    value={q}
                    onChange={setQ}
                    placeholder="Find a customer: name, phone, email or customer #"
                    count={rows.length}
                    total={ROUNDS_BY_CUSTOMER.length}
                />
            </div>
            <SectionTable
                head={
                    <tr>
                        <STh className="w-10" />
                        <STh>Customer</STh>
                        <STh>Customer #</STh>
                        <STh className="text-right">Rounds</STh>
                        <STh className="text-right">No-shows</STh>
                        <STh>Last played</STh>
                        <STh className="text-right">Paid</STh>
                    </tr>
                }
                empty={!rows.length && <SectionEmpty>No customer matches "{q}". Try a phone number or customer #.</SectionEmpty>}
            >
                {rows.map((c) => {
                    const isOpen = open.includes(c.id);
                    const played = c.rounds.filter((r) => r.status === "played");
                    return (
                        <Fragment key={c.id}>
                            <tr className="cursor-pointer bg-primary hover:bg-primary_hover" onClick={() => toggle(c.id)} aria-expanded={isOpen}>
                                <STd>
                                    {isOpen ? <ChevronDown className="size-4 text-fg-quaternary" /> : <ChevronRight className="size-4 text-fg-quaternary" />}
                                </STd>
                                <STd className="font-medium text-primary">{c.name}</STd>
                                <STd className="tabular-nums">{c.id}</STd>
                                <STd className="text-right tabular-nums">{played.length}</STd>
                                <STd className="text-right tabular-nums">{c.rounds.filter((r) => r.status.startsWith("noShow")).length}</STd>
                                <STd>{played[0]?.date ?? "—"}</STd>
                                <STd className="text-right tabular-nums">${c.rounds.reduce((n, r) => n + r.paid, 0).toFixed(2)}</STd>
                            </tr>
                            {isOpen && (
                                <tr>
                                    <td colSpan={7} className="border-t border-secondary p-0">
                                        <RoundsDetail c={c} />
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    );
                })}
            </SectionTable>
        </ScreenShell>
    );
};

/* -------------------------------------------------------------------------- */
/*  Tee sheet reports: search by name                                         */
/* -------------------------------------------------------------------------- */

export type TeeReport = "booked" | "online" | "noShows";

const REPORTS: Record<TeeReport, { title: string; nav: string; description: string; extra: string }> = {
    booked: {
        title: "Booked Reservations",
        nav: "golf/tee-sheet",
        description: "Every tee time booked for the range, by whoever booked it.",
        extra: "Booked by",
    },
    online: { title: "Online Reservations", nav: "golf/tee-sheet", description: "Tee times golfers booked themselves online.", extra: "Confirmation #" },
    noShows: { title: "No Shows", nav: "golf/tee-sheet", description: "Tee times where the golfer never checked in.", extra: "Refunded" },
};

type TeeRow = { name: string; phone: string; email: string; date: string; time: string; course: string; players: number; extra: Record<TeeReport, string> };

const TEE_ROWS: TeeRow[] = [
    {
        name: "Harold Pemberton",
        phone: "(555) 310-2218",
        email: "h.pemberton@example.com",
        date: "Nov 12, 2026",
        time: "8:20 AM",
        course: "Main",
        players: 4,
        extra: { booked: "Pro shop · A. Whitfield", online: "TF-88213", noShows: "Yes · Oct 28" },
    },
    {
        name: "Keisha Morrow",
        phone: "(555) 482-0091",
        email: "keisha.m@example.com",
        date: "Nov 12, 2026",
        time: "1:40 PM",
        course: "Main",
        players: 3,
        extra: { booked: "Online", online: "TF-88219", noShows: "No" },
    },
    {
        name: "Victor Alvarez",
        phone: "(555) 615-3340",
        email: "valvarez@example.com",
        date: "Nov 13, 2026",
        time: "4:00 PM",
        course: "Exec 9",
        players: 1,
        extra: { booked: "Online", online: "TF-88240", noShows: "No" },
    },
    {
        name: "Ruth Calloway",
        phone: "(555) 207-7765",
        email: "ruth.calloway@example.com",
        date: "Nov 13, 2026",
        time: "9:30 AM",
        course: "Main",
        players: 4,
        extra: { booked: "Pro shop · J. Ruiz", online: "TF-88251", noShows: "No" },
    },
    {
        name: "Dev Patel",
        phone: "(555) 931-4402",
        email: "dev.patel@example.com",
        date: "Nov 14, 2026",
        time: "11:10 AM",
        course: "Main",
        players: 2,
        extra: { booked: "Mobile app", online: "TF-88266", noShows: "Yes · Nov 6" },
    },
    {
        name: "Margaret Ellison",
        phone: "(555) 310-8854",
        email: "m.ellison@example.com",
        date: "Nov 14, 2026",
        time: "8:00 AM",
        course: "Exec 9",
        players: 2,
        extra: { booked: "Pro shop · A. Whitfield", online: "TF-88270", noShows: "No" },
    },
    {
        name: "Harold Pemberton",
        phone: "(555) 310-2218",
        email: "h.pemberton@example.com",
        date: "Nov 16, 2026",
        time: "7:50 AM",
        course: "Main",
        players: 4,
        extra: { booked: "Pro shop · J. Ruiz", online: "TF-88302", noShows: "No" },
    },
];

export const TeeSheetReportPage = ({ report, initialQuery = "" }: { report: TeeReport; initialQuery?: string }) => {
    const meta = REPORTS[report];
    const [q, setQ] = useState(initialQuery);
    const rows = TEE_ROWS.filter((r) => matches(q, r.name, r.phone, r.email, r.extra.online));
    return (
        <ScreenShell
            nav={{ activeId: meta.nav, scrollToActive: true }}
            course="bushwood"
            title={meta.title}
            description=""
            header={
                <CreditsHeader
                    crumbs={["Golf", "Tee Sheet", meta.title]}
                    title={meta.title}
                    description={meta.description}
                    actions={
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export
                        </Button>
                    }
                />
            }
        >
            <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary">
                <div className="flex flex-wrap items-end gap-4">
                    <DateRange from="Nov 12, 2026" to="Nov 18, 2026" />
                    <div className="w-48">
                        <SelectField label="Course" value="All courses" onChange={() => {}} options={["All courses", "Main", "Exec 9"]} />
                    </div>
                </div>
                <SearchBar value={q} onChange={setQ} placeholder="Search by name, phone, email or confirmation #" count={rows.length} total={TEE_ROWS.length} />
            </div>
            <SectionTable
                head={
                    <tr>
                        <STh>Golfer</STh>
                        <STh>Date</STh>
                        <STh>Tee time</STh>
                        <STh>Course</STh>
                        <STh className="text-right">Players</STh>
                        <STh>{meta.extra}</STh>
                    </tr>
                }
                empty={!rows.length && <SectionEmpty>Nobody named "{q}" in this range.</SectionEmpty>}
            >
                {rows.map((r) => (
                    <tr key={r.name + r.date + r.time}>
                        <STd>
                            <span className="flex flex-col">
                                <span className="font-medium text-primary">{r.name}</span>
                                <span className="text-xs text-tertiary">{r.phone}</span>
                            </span>
                        </STd>
                        <STd>{r.date}</STd>
                        <STd className="tabular-nums">{r.time}</STd>
                        <STd>{r.course}</STd>
                        <STd className="text-right tabular-nums">{r.players}</STd>
                        <STd>{r.extra[report]}</STd>
                    </tr>
                ))}
            </SectionTable>
        </ScreenShell>
    );
};

/* -------------------------------------------------------------------------- */
/*  All Orders: filters that survive a course switch; Problem Orders cleanup  */
/* -------------------------------------------------------------------------- */

type OrderStatus = "Open" | "Completed" | "Refunded" | "Cancelled";
type Order = { id: string; course: CourseKey; date: string; customer: string; register: string; total: number; status: OrderStatus; problem?: string };

const ORDERS: Order[] = [
    { id: "6571204", course: "dunes", date: "Nov 11, 2026 9:14 AM", customer: "Keisha Morrow", register: "Pro Shop 1", total: 112.4, status: "Completed" },
    { id: "6571211", course: "dunes", date: "Nov 11, 2026 9:40 AM", customer: "Walk-in", register: "Grill", total: 18.75, status: "Refunded" },
    {
        id: "6571230",
        course: "dunes",
        date: "Nov 11, 2026 10:02 AM",
        customer: "Dev Patel",
        register: "Pro Shop 1",
        total: 89,
        status: "Open",
        problem: "Payment doesn't match items",
    },
    {
        id: "6571244",
        course: "dunes",
        date: "Nov 11, 2026 10:31 AM",
        customer: "Ruth Calloway",
        register: "Snack Bar",
        total: 9.5,
        status: "Cancelled",
        problem: "Unlocked, then voided",
    },
    { id: "6571251", course: "dunes", date: "Nov 11, 2026 11:05 AM", customer: "Walk-in", register: "Grill", total: 41.2, status: "Refunded" },
    { id: "8802117", course: "bushwood", date: "Nov 11, 2026 7:58 AM", customer: "Harold Pemberton", register: "Pro Shop", total: 38, status: "Completed" },
    { id: "8802130", course: "bushwood", date: "Nov 11, 2026 8:22 AM", customer: "Victor Alvarez", register: "Pro Shop", total: 18, status: "Refunded" },
    {
        id: "8802141",
        course: "bushwood",
        date: "Nov 11, 2026 8:45 AM",
        customer: "Walk-in",
        register: "Halfway House",
        total: 12.25,
        status: "Open",
        problem: "Cart fee zeroed after unlock",
    },
    {
        id: "8802152",
        course: "bushwood",
        date: "Nov 11, 2026 9:10 AM",
        customer: "Margaret Ellison",
        register: "Pro Shop",
        total: 22,
        status: "Cancelled",
        problem: "Cancelled at the register",
    },
    { id: "8802166", course: "bushwood", date: "Nov 11, 2026 9:36 AM", customer: "Walk-in", register: "Halfway House", total: 7.5, status: "Refunded" },
];

const STATUSES: ("All" | OrderStatus)[] = ["All", "Open", "Completed", "Refunded", "Cancelled"];
const statusColor = { Open: "warning", Completed: "success", Refunded: "gray", Cancelled: "gray" } as const;

export const AllOrdersPage = ({
    initialCourse = "dunes",
    initialStatus = "All",
    initialTab = "all",
    keptFrom,
}: {
    initialCourse?: CourseKey;
    initialStatus?: "All" | OrderStatus;
    initialTab?: "all" | "problem";
    /** Show the "kept from" note as if the filter was set on another course first. */
    keptFrom?: CourseKey;
}) => {
    const [course, setCourse] = useState<CourseKey>(initialCourse);
    const [status, setStatus] = useState(initialStatus);
    const [tab, setTab] = useState(initialTab);
    const [showCancelled, setShowCancelled] = useState(false);
    const [carried, setCarried] = useState<CourseKey | undefined>(keptFrom);

    const atCourse = ORDERS.filter((o) => o.course === course);
    const problems = atCourse.filter((o) => o.problem);
    const hiddenCancelled = problems.filter((o) => o.status === "Cancelled").length;
    const rows =
        tab === "all"
            ? atCourse.filter((o) => status === "All" || o.status === status)
            : problems.filter((o) => (showCancelled || o.status !== "Cancelled") && (status === "All" || o.status === status));

    return (
        <ScreenShell
            nav={{ activeId: "orders/all-orders", scrollToActive: true }}
            course={course}
            title="All Orders"
            description=""
            header={
                <CreditsHeader
                    crumbs={["Orders", tab === "all" ? "All Orders" : "Problem Orders"]}
                    title={tab === "all" ? "All Orders" : "Problem Orders"}
                    description={tab === "all" ? "Every order at this course." : "Orders that need a look. Cancelled orders are left out; they're settled."}
                    actions={
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export
                        </Button>
                    }
                />
            }
            tabs={
                <TabStrip
                    tabs={[
                        { id: "all", label: "All Orders" },
                        { id: "problem", label: "Problem Orders" },
                    ]}
                    activeId={tab}
                    onSelect={(id) => setTab(id as "all" | "problem")}
                    onClose={() => {}}
                />
            }
        >
            <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-72">
                        <SelectField
                            label="Course"
                            value={course}
                            onChange={(v) => {
                                setCarried(course);
                                setCourse(v as CourseKey);
                            }}
                            options={(Object.keys(COURSES) as CourseKey[]).map((k) => ({ value: k, label: COURSES[k].name }))}
                        />
                    </div>
                    <DateRange from="Nov 11, 2026" to="Nov 11, 2026" />
                </div>
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Order status">
                    <FilterLines className="mr-1 size-4 text-fg-quaternary" aria-hidden="true" />
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            aria-pressed={status === s}
                            onClick={() => setStatus(s)}
                            className={cx(
                                "cursor-pointer rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                                status === s ? "bg-brand-primary_alt text-brand-secondary ring-brand" : "text-secondary ring-primary hover:bg-primary_hover",
                            )}
                        >
                            {s}
                        </button>
                    ))}
                    {carried && carried !== course && status !== "All" && (
                        // Switching course here (or in the top bar) keeps the status picked.
                        <span className="ml-2 flex items-center gap-1.5 text-xs text-brand-secondary">
                            <Pin02 className="size-3.5" aria-hidden="true" />"{status}" kept from {COURSES[carried].name}
                        </span>
                    )}
                </div>
                {tab === "problem" && hiddenCancelled > 0 && (
                    <Toggle size="sm" label={`Show cancelled orders (${hiddenCancelled} hidden)`} isSelected={showCancelled} onChange={setShowCancelled} />
                )}
            </div>
            <SectionTable
                head={
                    <tr>
                        <STh>Order</STh>
                        <STh>Date</STh>
                        <STh>Customer</STh>
                        <STh>Register</STh>
                        {tab === "problem" && <STh>Problem</STh>}
                        <STh className="text-right">Total</STh>
                        <STh>Status</STh>
                    </tr>
                }
                empty={
                    !rows.length && (
                        <SectionEmpty>
                            No {status === "All" ? "" : `${status.toLowerCase()} `}orders at {COURSES[course].name} for this day.
                        </SectionEmpty>
                    )
                }
            >
                {rows.map((o) => (
                    <tr key={o.id}>
                        <STd className="font-medium text-brand-secondary tabular-nums">{o.id}</STd>
                        <STd>{o.date}</STd>
                        <STd>{o.customer}</STd>
                        <STd>{o.register}</STd>
                        {tab === "problem" && <STd>{o.problem}</STd>}
                        <STd className="text-right tabular-nums">${o.total.toFixed(2)}</STd>
                        <STd>
                            <Badge size="sm" color={statusColor[o.status]}>
                                {o.status}
                            </Badge>
                        </STd>
                    </tr>
                ))}
            </SectionTable>
        </ScreenShell>
    );
};
