"use client";

import { useMemo, useState } from "react";
import { DotsGrid } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Toggle } from "@/components/base/toggle/toggle";
import { BOOKING_ENGINE, BOOKING_RULES, BOOKING_TOGGLES, DISCLAIMERS, OPTIONS, WAITLIST_TOGGLES } from "./course-settings-data";
import { RichTextEditor } from "./rich-text-editor";
import {
    ControlledSelect,
    FieldGrid,
    Group,
    NewAction,
    RowActions,
    SelectField,
    TableFrame,
    Td,
    TextField,
    Th,
    TimeField,
    ToggleField,
    ToggleList,
    Tr,
    YesNo,
} from "./settings-kit";
import { Searchable } from "./settings-search";

/* -------------------------------------------------------------------------- */
/*  Booking Engine                                                            */
/* -------------------------------------------------------------------------- */

export const BookingWindowGroup = () => {
    const b = BOOKING_ENGINE;

    return (
        <Group title="Booking Window" description="How far ahead players may book, and when those times open.">
            <FieldGrid>
                <SelectField label="Booking Engine Type" options={OPTIONS.bookingEngineType} value={b.type} />
                <TextField label="Max days out a player can book (public)" value={b.maxDaysPublic} />
                <TextField label="Max days out a player can book (members)" value={b.maxDaysMembers} />
                <TimeField label="What time do bookings come available?" value="00:01" />
                <TextField label="Hours before time users can cancel" value={b.cancelHours} />
            </FieldGrid>
        </Group>
    );
};

export const BookingLimitsGroup = () => {
    const b = BOOKING_ENGINE;

    return (
        <Group title="Limits">
            <FieldGrid>
                <SelectField label="Minimum Holes Players Can Book" options={OPTIONS.minHoles} value={b.minHoles} />
                <SelectField label="Maximum Holes Players Can Book" options={OPTIONS.maxHoles} value={b.maxHoles} />
                <TextField label="Max times a player can book per day" value={b.maxPerDay} />
                <TextField label="Minimum players to book" value={b.minPlayers} />
                <TextField label="Maximum players to book" value={b.maxPlayers} />
            </FieldGrid>
        </Group>
    );
};

export const BookingOptionsGroup = () => {
    const b = BOOKING_ENGINE;

    return (
        <Group title="Booking Options">
            <FieldGrid>
                <TextField label="Max Court Booking Days Out" value={b.maxCourtDays} />
                <TextField label="Standby Signup Open Time (HH:mm)" value={b.standbyOpen} />
                <TextField label="Standby Signup Close Time (HH:mm)" value={b.standbyClose} />
            </FieldGrid>
            <ToggleList items={BOOKING_TOGGLES} />
        </Group>
    );
};

export const DisclaimersGroup = () => (
    <Group title="Disclaimers">
        {(
            [
                ["Booking Disclaimer", DISCLAIMERS.booking],
                ["Cancellation Disclaimer", DISCLAIMERS.cancellation],
                ["Clinic Terms", DISCLAIMERS.clinic],
            ] as const
        ).map(([title, html]) => (
            <Searchable key={title} label={title}>
                <RichTextEditor title={title} defaultHtml={html} />
            </Searchable>
        ))}
    </Group>
);

export const BookingEngineContent = () => (
    <>
        <BookingWindowGroup />
        <BookingLimitsGroup />
        <BookingOptionsGroup />
        <DisclaimersGroup />
    </>
);

/* -------------------------------------------------------------------------- */
/*  Booking Rules                                                             */
/* -------------------------------------------------------------------------- */

export const BookingRulesContent = () => {
    const [domain, setDomain] = useState("All");
    const [category, setCategory] = useState("All");
    const [showDisabled, setShowDisabled] = useState(true);
    const [rules, setRules] = useState(BOOKING_RULES);

    const visible = useMemo(() => rules.filter((r) => (domain === "All" || r.domain === domain) && (showDisabled || r.enabled)), [rules, domain, showDisabled]);

    return (
        <Group>
            <Searchable
                label="Booking rule filters"
                keywords="booking rule restriction block limit"
                className="flex flex-wrap items-end justify-between gap-4 rounded-xl p-4 ring-1 ring-secondary"
            >
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-64">
                        <ControlledSelect label="Domain" options={OPTIONS.domain} value={domain} onChange={setDomain} />
                    </div>
                    <div className="w-48">
                        <ControlledSelect label="Category" options={OPTIONS.category} value={category} onChange={setCategory} />
                    </div>
                    <div className="flex flex-col gap-3 pb-2">
                        <span className="text-sm font-medium text-secondary">Show disabled</span>
                        <Toggle aria-label="Show disabled" size="md" isSelected={showDisabled} onChange={setShowDisabled} />
                    </div>
                </div>
                <NewAction />
            </Searchable>

            <TableFrame>
                <thead>
                    <tr>
                        <Th className="w-16">#</Th>
                        <Th>Rule</Th>
                        <Th>Type</Th>
                        <Th>Applies To</Th>
                        <Th>Limit</Th>
                        <Th>When</Th>
                        <Th>Outcome</Th>
                        <Th>Channels</Th>
                        <Th className="text-center">Enabled</Th>
                        <Th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {visible.map((r) => (
                        <Tr key={r.id} label={r.rule} keywords="booking rule restriction block limit">
                            <Td>
                                <span className="flex items-center gap-2 text-primary">
                                    <DotsGrid className="size-4 cursor-grab text-fg-quaternary" aria-label="Drag to reorder" />
                                    {r.id}
                                </span>
                            </Td>
                            <Td className="max-w-44 whitespace-normal text-primary">{r.rule}</Td>
                            <Td className="max-w-40 whitespace-normal">
                                <span className="block text-primary">{r.type}</span>
                                <span className="block text-xs text-tertiary">{r.domain}</span>
                            </Td>
                            <Td className="max-w-32 whitespace-normal text-primary">{r.appliesTo}</Td>
                            <Td className="text-primary">{r.limit}</Td>
                            <Td className="max-w-60 whitespace-normal text-primary">{r.when}</Td>
                            <Td>
                                <Badge type="color" size="md" color={r.outcome === "Block" ? "error" : "success"}>
                                    {r.outcome}
                                </Badge>
                            </Td>
                            <Td>
                                <Badge type="color" size="md" color="gray">
                                    {r.channels}
                                </Badge>
                            </Td>
                            <Td className="text-center">
                                <YesNo value={r.enabled} />
                            </Td>
                            <Td>
                                <RowActions onDelete={() => setRules((prev) => prev.filter((x) => x.id !== r.id))} />
                            </Td>
                        </Tr>
                    ))}
                    {visible.length === 0 && (
                        <tr>
                            <Td className="py-8 text-center text-tertiary" colSpan={10}>
                                No rules match these filters.
                            </Td>
                        </tr>
                    )}
                </tbody>
            </TableFrame>

            <p className="text-sm text-tertiary">
                Rules are evaluated in priority order, grouped by rule type — every type has to pass. Nothing is enforced until this course has the
                booking-rules feature flag switched on.
            </p>
        </Group>
    );
};

/* -------------------------------------------------------------------------- */
/*  Booking Waitlist                                                          */
/* -------------------------------------------------------------------------- */

/** The Pay & Book / Reserve & Pay at Course blocks share this layout. */
const AutoBookBlock = ({ prefix, extraFee }: { prefix: string; extraFee: string }) => (
    <FieldGrid>
        <ToggleField label={`Enable ${prefix}`} defaultSelected />
        <SelectField
            label={`${prefix} Lead Time (min)`}
            tooltip="How many minutes before the tee time the customer has to respond."
            options={OPTIONS.leadTime}
            placeholder="Select"
        />
        <ToggleField label="Charge Extra Fee" tooltip="Add a convenience fee when the waitlist books on the customer's behalf." />
        <TextField label="Extra Fee" tooltip="Fee charged per automatic booking." value={extraFee} lock="readonly" />
        <TextField label="Tax" tooltip="Tax applied to the extra fee." value="Standard Tax (8.25%)" lock="admin" />
        <TextField label="Tax 2" tooltip="Secondary tax applied to the extra fee." value="None" lock="admin" />
        <TextField label="General Ledger Code" tooltip="Where the extra fee posts in the general ledger." value="Tee Fees (1230000)" lock="admin" />
    </FieldGrid>
);

export const BookingWaitlistContent = () => (
    <>
        <Group
            title="Waitlist"
            description="Allow customers to be notified or even book tee times automatically when a time becomes available within their selected timeframe."
        >
            <ToggleList items={WAITLIST_TOGGLES} />
        </Group>

        <Group title="Notify Only" description="Notify customers when a tee time opens within their waitlist timeframe. They book it themselves.">
            <FieldGrid>
                <ToggleField label="Enable Notify Only" defaultSelected />
                <SelectField
                    label="Notify Only Lead Time (min)"
                    tooltip="How many minutes before the tee time the customer is notified."
                    options={OPTIONS.leadTime}
                    value="15 Minutes"
                />
            </FieldGrid>
        </Group>

        <Group
            title="Pay & Book"
            description="Notify and allow customers to pay and book automatically when a tee time becomes available within their selected waitlist timeframe."
        >
            <AutoBookBlock prefix="Pay & Book" extraFee="$5" />
        </Group>

        <Group
            title="Reserve & Pay at Course"
            description="Notify and allow customers to reserve tee times automatically when a time becomes available within their selected waitlist timeframe. Customers pay at the course on arrival."
        >
            <AutoBookBlock prefix="Reserve Pay At Course" extraFee="$10" />
        </Group>
    </>
);
