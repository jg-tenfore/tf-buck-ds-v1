"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import {
    Award01,
    Bank,
    BankNote01,
    CalendarCheck01,
    Car01,
    ChevronDown,
    Clock,
    ClockRewind,
    CreditCard02,
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
    Lock01,
    Mail01,
    Passport,
    Phone,
    Rows01,
    Save01,
    Scales01,
    Settings01,
    ShoppingBag01,
    Target04,
    Ticket01,
    Trash01,
    Truck01,
    Umbrella03,
    User01,
    UserSquare,
    Users01,
    XClose,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import type { CustomerProfile as Customer } from "./data";
import { PROFILE_SECTIONS } from "./data";
import { EmptyBox, ExportButton, InlineAction, LinkText, TableCard, Td, Th } from "./kit";

/**
 * Customer profile — opened as a tab from any report that lists customers
 * (Punch Cards, Credit Books, Charges, Payments). A header card with account
 * actions, then 18 collapsible sections. `history` fills the sections with
 * the captured account activity; without it every section shows its empty
 * state (a brand-new customer).
 */

export const PROFILE_SECTION_IDS = [
    "profile",
    "tee-times",
    "waitlists",
    "orders",
    "family",
    "customer-types",
    "documents",
    "payment-methods",
    "cart-signouts",
    "payments",
    "memberships",
    "punch-cards",
    "rain-checks",
    "rewards",
    "gift-cards",
    "clinics",
    "activity-bookings",
    "activities",
] as const;
export type ProfileSectionId = (typeof PROFILE_SECTION_IDS)[number];

const SECTION_META: Record<ProfileSectionId, { label: string; icon: FC<{ className?: string }> }> = {
    profile: { label: "Profile", icon: User01 },
    "tee-times": { label: "Tee Times", icon: Target04 },
    waitlists: { label: "Waitlists", icon: List },
    orders: { label: "Orders", icon: ShoppingBag01 },
    family: { label: "Family Members", icon: Users01 },
    "customer-types": { label: "Customer Types", icon: LayersThree01 },
    documents: { label: "Documents", icon: Folder },
    "payment-methods": { label: "Payment Methods", icon: CreditCard02 },
    "cart-signouts": { label: "Cart Signouts", icon: Car01 },
    payments: { label: "Payments", icon: BankNote01 },
    memberships: { label: "Memberships", icon: Passport },
    "punch-cards": { label: "Punch Cards", icon: Ticket01 },
    "rain-checks": { label: "Rain Checks", icon: Umbrella03 },
    rewards: { label: "Rewards", icon: Award01 },
    "gift-cards": { label: "Gift Cards", icon: Gift01 },
    clinics: { label: "Clinics", icon: GraduationHat01 },
    "activity-bookings": { label: "Activity Bookings", icon: CalendarCheck01 },
    activities: { label: "Activities", icon: Rows01 },
};

interface CustomerProfileProps {
    customer: Customer;
    /** Sections open on first render. */
    initialOpen?: ProfileSectionId[] | "all";
    /** Fill sections with captured account history (otherwise every section is empty). */
    history?: boolean;
}

export const CustomerProfileView = ({ customer, initialOpen = [], history = false }: CustomerProfileProps) => {
    const [open, setOpen] = useState<Set<ProfileSectionId>>(() => new Set(initialOpen === "all" ? PROFILE_SECTION_IDS : initialOpen));

    const toggle = (id: ProfileSectionId) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-primary px-5 py-4 shadow-xs ring-1 ring-secondary">
                <div className="flex items-center gap-4">
                    <span className="ring-brand-secondary relative flex size-16 items-center justify-center rounded-full bg-brand-solid text-white ring-4">
                        <User01 className="size-8" />
                        <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-primary text-fg-brand-primary ring-1 ring-secondary">
                            <Edit03 className="size-3.5" />
                        </span>
                    </span>
                    <span className="text-lg font-semibold text-primary">
                        {customer.name} · #{customer.gccId}
                    </span>
                </div>
                <div className="flex flex-wrap items-center divide-x divide-secondary">
                    {(
                        [
                            ["Statements", File02],
                            ["Invoice By Date", File02],
                            ["Charge History", ClockRewind],
                            ["Delete", Trash01],
                        ] as const
                    ).map(([label, Icon]) => (
                        <button
                            key={label}
                            type="button"
                            className="flex cursor-pointer items-center gap-1.5 px-3 text-sm font-medium text-secondary hover:text-primary"
                        >
                            <Icon className="size-4 text-fg-quaternary" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-secondary overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                {PROFILE_SECTION_IDS.map((id) => {
                    const { label, icon: Icon } = SECTION_META[id];
                    const isOpen = open.has(id);
                    return (
                        <section key={id}>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => toggle(id)}
                                className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition duration-100 ease-linear hover:bg-primary_hover"
                            >
                                <Icon className="size-5 text-fg-secondary" />
                                <span className="flex-1 text-md font-semibold text-primary">{label}</span>
                                <ChevronDown className={cx("size-5 text-fg-quaternary transition-transform duration-150", isOpen && "rotate-180")} />
                            </button>
                            {isOpen && <div className="flex flex-col gap-4 px-5 pb-5">{renderSection(id, customer, history)}</div>}
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Section bodies                                                            */
/* -------------------------------------------------------------------------- */

const Toolbar = ({ left, right }: { left?: ReactNode; right?: ReactNode }) => (
    <div className="flex items-center justify-between gap-3">
        <div>{left}</div>
        <div className="flex items-center gap-3">{right}</div>
    </div>
);

const HeaderOnlyTable = ({ columns }: { columns: string[] }) => (
    <TableCard>
        <thead>
            <tr>
                {columns.map((c) => (
                    <Th key={c}>{c}</Th>
                ))}
            </tr>
        </thead>
    </TableCard>
);

const renderSection = (id: ProfileSectionId, customer: Customer, history: boolean): ReactNode => {
    const h = PROFILE_SECTIONS;
    switch (id) {
        case "profile":
            return <ProfileForm customer={customer} />;
        case "tee-times":
            return (
                <>
                    <Toolbar right={<ExportButton />} />
                    {history ? (
                        <TableCard>
                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Course</Th>
                                    <Th>Sub Course</Th>
                                    <Th>Date</Th>
                                    <Th className="text-right">Players</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {h.teeTimes.map((t, i) => (
                                    <tr key={i}>
                                        <Td>{t.id}</Td>
                                        <Td>{t.course}</Td>
                                        <Td>{t.subCourse}</Td>
                                        <Td>{t.date}</Td>
                                        <Td className="text-right tabular-nums">{t.players}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableCard>
                    ) : (
                        <EmptyBox>There are no tee times for this customer</EmptyBox>
                    )}
                </>
            );
        case "waitlists":
            return (
                <>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-secondary">Statuses</span>
                        <span className="inline-flex w-max items-center gap-1.5 rounded-lg bg-primary py-1.5 pr-2 pl-3 text-sm font-medium text-secondary shadow-xs ring-1 ring-primary ring-inset">
                            Fulfilled
                            <XClose className="size-3.5 text-fg-quaternary" />
                        </span>
                    </div>
                    <EmptyBox>There are no waitlists for this customer</EmptyBox>
                </>
            );
        case "orders":
            return (
                <>
                    <Toolbar right={<ExportButton />} />
                    {history ? (
                        <TableCard>
                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Course</Th>
                                    <Th>Date</Th>
                                    <Th className="text-right">Amount</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {h.orders.map((o) => (
                                    <tr key={o.id}>
                                        <Td>{o.id}</Td>
                                        <Td>{o.course}</Td>
                                        <Td>{o.date}</Td>
                                        <Td className="text-right tabular-nums">{o.amount}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableCard>
                    ) : (
                        <EmptyBox>There are no orders for this customer</EmptyBox>
                    )}
                </>
            );
        case "family":
            return (
                <>
                    <Toolbar left={<InlineAction>New</InlineAction>} />
                    {history ? (
                        <TableCard>
                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Name</Th>
                                    <Th>DOB</Th>
                                    <Th className="w-12" />
                                </tr>
                            </thead>
                            <tbody>
                                {h.familyMembers.map((f) => (
                                    <tr key={f.id}>
                                        <Td>{f.id}</Td>
                                        <Td>
                                            <LinkText>{f.name}</LinkText>
                                        </Td>
                                        <Td>{f.dob}</Td>
                                        <Td>
                                            <Trash01 className="size-4 text-fg-quaternary" aria-label="Remove" />
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableCard>
                    ) : (
                        <EmptyBox>There are no family members for this customer</EmptyBox>
                    )}
                </>
            );
        case "customer-types":
            return (
                <>
                    <Toolbar left={<InlineAction>New</InlineAction>} />
                    <EmptyBox>There are no types for this customer</EmptyBox>
                </>
            );
        case "documents":
            return (
                <>
                    <Toolbar right={<InlineAction>New</InlineAction>} />
                    <EmptyBox bordered={false}>No documents yet — add one with New.</EmptyBox>
                </>
            );
        case "payment-methods":
            return (
                <>
                    <Toolbar
                        left={
                            <div className="flex items-center gap-5">
                                <InlineAction icon={CreditCard02}>Add Card</InlineAction>
                                <InlineAction icon={Bank}>Add ACH</InlineAction>
                            </div>
                        }
                    />
                    <HeaderOnlyTable columns={["ID", "Merchant ID", "Processor", "Card", "Expiration", "ACH Name", "Actions"]} />
                </>
            );
        case "cart-signouts":
            return <HeaderOnlyTable columns={["Image", "Cart #", "Created"]} />;
        case "payments":
            return (
                <>
                    <Toolbar left={<InlineAction>New</InlineAction>} right={<ExportButton />} />
                    <EmptyBox>No payments exist for this customer.</EmptyBox>
                </>
            );
        case "memberships":
            return (
                <>
                    <Toolbar left={<InlineAction>New</InlineAction>} />
                    {history ? (
                        <TableCard>
                            <thead>
                                <tr>
                                    <Th>Course</Th>
                                    <Th>Membership</Th>
                                    <Th>Expires</Th>
                                    <Th className="w-16" />
                                </tr>
                            </thead>
                            <tbody>
                                {h.memberships.map((m) => (
                                    <tr key={m.membership}>
                                        <Td>{m.course}</Td>
                                        <Td>{m.membership}</Td>
                                        <Td>{m.expires}</Td>
                                        <Td>
                                            <span className="flex flex-col items-center gap-2 text-fg-quaternary">
                                                <Edit03 className="size-4" aria-label="Edit" />
                                                <Trash01 className="size-4" aria-label="Remove" />
                                            </span>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableCard>
                    ) : (
                        <EmptyBox>There are no memberships for this customer</EmptyBox>
                    )}
                </>
            );
        case "punch-cards":
            return (
                <>
                    <Toolbar right={<ExportButton />} />
                    <EmptyBox>There are no punch cards for this customer</EmptyBox>
                </>
            );
        case "rain-checks":
            return <EmptyBox>There are no rainchecks for this customer</EmptyBox>;
        case "rewards":
            return (
                <>
                    <div className="flex items-center justify-center gap-4">
                        <InlineAction icon={Scales01}>Adjust Balance</InlineAction>
                        <ExportButton />
                    </div>
                    <EmptyBox>There are no rewards for this customer</EmptyBox>
                </>
            );
        case "gift-cards":
            return (
                <>
                    <Toolbar left={<InlineAction>New</InlineAction>} right={<ExportButton />} />
                    <EmptyBox>There are no gift cards for this customer</EmptyBox>
                </>
            );
        case "clinics":
            return (
                <>
                    <Toolbar right={<ExportButton />} />
                    <EmptyBox>No clinics exist for this customer.</EmptyBox>
                </>
            );
        case "activity-bookings":
            return <EmptyBox>No activity bookings for this customer.</EmptyBox>;
        case "activities":
            return history ? (
                <TableCard>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Date</Th>
                            <Th>User</Th>
                            <Th>Activity</Th>
                            <Th>Notes</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {h.activities.map((a) => (
                            <tr key={a.id}>
                                <Td>{a.id}</Td>
                                <Td>{a.date}</Td>
                                <Td>{a.user}</Td>
                                <Td>{a.activity}</Td>
                                <Td>{a.notes}</Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            ) : (
                <EmptyBox>No activity for this customer yet.</EmptyBox>
            );
    }
};

/* -------------------------------------------------------------------------- */
/*  Profile form                                                              */
/* -------------------------------------------------------------------------- */

/** Text field with a trailing icon; `locked` = system value, read-only. */
const IconField = ({ label, value, icon: Icon, locked }: { label: string; value?: string; icon?: FC<{ className?: string }>; locked?: boolean }) => (
    <label className="flex min-w-0 flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <span
            className={cx(
                "flex h-11 items-center gap-2 rounded-lg px-3.5 shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand",
                locked ? "bg-secondary" : "bg-primary",
            )}
        >
            <input
                defaultValue={value}
                readOnly={locked}
                aria-label={label}
                className={cx("min-w-0 flex-1 truncate bg-transparent text-md outline-hidden", locked ? "text-tertiary" : "text-primary")}
            />
            {Icon && <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
        </span>
    </label>
);

const STATES = [
    { id: "None", label: "None" },
    { id: "TX", label: "Texas" },
    { id: "UT", label: "Utah" },
    { id: "ID", label: "Idaho" },
];

const AddressBlock = ({ title, icon: Icon }: { title: string; icon: FC<{ className?: string }> }) => (
    <div className="flex flex-col gap-4">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-tertiary uppercase">
            <Icon className="size-4" />
            {title}
        </span>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <IconField label="Line 1" />
            <IconField label="Line 2" />
            <IconField label="City" />
            <Select label="State" items={STATES} defaultSelectedKey="None">
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
            <IconField label="Zip" />
        </div>
    </div>
);

const ProfileForm = ({ customer }: { customer: Customer }) => (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
            <IconField label="First Name" value={customer.firstName} />
            <IconField label="Last Name" value={customer.lastName} />
            <IconField label="Date of Birth" icon={Clock} />
            <IconField label="Mailing Alias" icon={Mail01} />
            <IconField label="Email" value={customer.email} icon={Mail01} />
            <IconField label="Phone" value={customer.phone} icon={Phone} />
            <IconField label="Height (inches)" icon={Edit03} />
            <IconField label="Clothing Size" icon={Edit03} />
            <IconField label="Wedding Anniversary" icon={Clock} />
            <IconField label="Golf Course Customer ID" value={customer.gccId} icon={Hash02} locked />
            <IconField label="Customer ID" value={customer.customerId} icon={Hash02} locked />
            <IconField label="Fox Sign-up Username" value={customer.email} icon={Lock01} locked />
        </div>

        <InlineAction icon={Key01}>Reset Customer Password</InlineAction>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AddressBlock title="Billing Address" icon={Home02} />
            <AddressBlock title="Shipping Address" icon={Truck01} />
        </div>

        <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-tertiary uppercase">
                <Settings01 className="size-4" />
                Other Settings
            </span>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                    {["Cannot Book Online", "Disable Charges", "Email Opt-Out", "Prompt Order Notes"].map((label) => (
                        <div key={label} className="flex items-center justify-between gap-4 px-5 py-4">
                            <span className="text-sm font-semibold text-primary">{label}</span>
                            <Toggle aria-label={label} size="md" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <IconField label="Club ID" icon={UserSquare} />
                    <TextArea label="Purchase Preferences" rows={3} />
                    <TextArea label="Notes" rows={3} />
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <Button size="md" iconLeading={Save01}>
                Save
            </Button>
        </div>
    </div>
);
