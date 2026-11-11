"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Lock01, Receipt, Repeat04, SearchLg, Ticket01, Trash01, UserX01, XClose } from "@untitledui/icons";
import { Dialog as AriaDialog, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { SelectField } from "../products-oct-27/kit";
import {
    BAYS,
    type Block,
    type Customer,
    DAILY_LIMIT,
    DURATIONS,
    NO_MEMBERSHIP,
    REPEAT_LABEL,
    type Repeat,
    type Reservation,
    SHEET_DATE,
    STATUS_LABEL,
    bayById,
    bookingsToday,
    conflictFor,
    customerById,
    feeFor,
    fmtDuration,
    fmtTime,
    membershipOf,
    punchesNeeded,
    searchCustomers,
    slots,
    usd,
} from "./bay-data";

/* -------------------------------------------------------------------------- */
/*  Slide-over frame                                                          */
/* -------------------------------------------------------------------------- */

/**
 * A 560px panel from the right, the same width Birdie's bay sheet moved its
 * dialogs to. The sheet stays visible behind it, so staff can see the bay
 * they're booking. The footer is Cancel and the one primary action, nothing else.
 */
export const SlideOver = ({
    title,
    eyebrow,
    isOpen,
    onClose,
    footer,
    children,
}: {
    title: string;
    eyebrow?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    footer: ReactNode;
    children: ReactNode;
}) => (
    <AriaModalOverlay isOpen={isOpen} onOpenChange={(open) => !open && onClose()} isDismissable className="fixed inset-0 z-50 flex justify-end bg-overlay/40">
        <AriaModal className="h-full w-full max-w-[560px]">
            <AriaDialog aria-label={title} className="flex h-full flex-col bg-primary shadow-xl ring-1 ring-secondary_alt outline-hidden">
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-5">
                    <div className="flex min-w-0 flex-col gap-1">
                        {eyebrow && <div className="text-xs font-medium text-tertiary">{eyebrow}</div>}
                        <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                    >
                        <XClose className="size-5" />
                    </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">{children}</div>
                <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">{footer}</div>
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);

const Group = ({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) => (
    <section className="flex flex-col gap-3">
        <div>
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            {hint && <p className="text-xs text-tertiary">{hint}</p>}
        </div>
        {children}
    </section>
);

const Callout = ({
    tone,
    icon: Icon,
    title,
    children,
}: {
    tone: "error" | "warning" | "gray";
    icon: typeof AlertCircle;
    title: string;
    children?: ReactNode;
}) => (
    <div
        role={tone === "error" ? "alert" : "status"}
        className={cx(
            "flex gap-3 rounded-lg p-3 text-sm ring-1 ring-inset",
            tone === "error" && "bg-error-primary text-error-primary ring-error_subtle",
            tone === "warning" && "ring-warning_subtle bg-warning-primary text-warning-primary",
            tone === "gray" && "bg-secondary text-secondary ring-secondary",
        )}
    >
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-1">
            <p className="font-semibold">{title}</p>
            {children && <div className="text-secondary">{children}</div>}
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Shared pieces                                                             */
/* -------------------------------------------------------------------------- */

export const MembershipDot = ({ customer, className }: { customer?: Customer; className?: string }) => {
    const plan = membershipOf(customer) ?? NO_MEMBERSHIP;
    return <span aria-hidden="true" className={cx("inline-block size-2.5 shrink-0 rounded-full", className)} style={{ backgroundColor: plan.color }} />;
};

const CustomerCard = ({ customer, onClear }: { customer: Customer; onClear?: () => void }) => {
    const plan = membershipOf(customer);
    return (
        <div className="flex items-start justify-between gap-3 rounded-lg p-3 ring-1 ring-secondary ring-inset">
            <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <MembershipDot customer={customer} />
                    {customer.name}
                </span>
                <span className="text-xs text-tertiary">
                    {customer.phone} · {customer.email}
                </span>
                <span className="text-xs text-secondary">
                    {plan ? plan.name : NO_MEMBERSHIP.name}
                    {customer.punchesLeft !== undefined && ` · ${customer.punchesLeft} punches left`}
                </span>
            </div>
            {onClear && (
                <Button color="link-gray" size="sm" onClick={onClear}>
                    Change
                </Button>
            )}
        </div>
    );
};

/** Name, phone or email; the last digits of a phone are enough. */
const CustomerSearch = ({ onPick }: { onPick: (c: Customer) => void }) => {
    const [q, setQ] = useState("");
    const results = searchCustomers(q);
    return (
        <div className="flex flex-col gap-2">
            <Input label="Customer" icon={SearchLg} placeholder="Name, phone or email" value={q} onChange={setQ} autoFocus />
            {q.trim() && (
                <ul className="overflow-hidden rounded-lg ring-1 ring-secondary">
                    {results.length ? (
                        results.map((c) => (
                            <li key={c.id}>
                                <button
                                    type="button"
                                    onClick={() => onPick(c)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-secondary px-3 py-2.5 text-left last:border-0 hover:bg-primary_hover"
                                >
                                    <span className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <MembershipDot customer={c} />
                                        {c.name}
                                    </span>
                                    <span className="text-xs text-tertiary tabular-nums">{c.phone}</span>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-3 text-sm text-tertiary">No customer matches "{q}".</li>
                    )}
                </ul>
            )}
        </div>
    );
};

const timeOptions = slots().map((t) => ({ value: String(t), label: fmtTime(t) }));
const durationOptions = DURATIONS.map((d) => ({ value: String(d), label: fmtDuration(d) }));
const bayOptions = BAYS.map((b) => ({ value: b.id, label: `${b.name} · up to ${b.capacity}` }));
const repeatOptions = (Object.keys(REPEAT_LABEL) as Repeat[]).map((k) => ({ value: k, label: REPEAT_LABEL[k] }));
const partyOptions = (bayId: string) => Array.from({ length: bayById(bayId).capacity }, (_, i) => String(i + 1));

/** Bay, time, length and party. Moving to a smaller bay clamps the party to fit. */
const WhenWhere = ({
    bayId,
    start,
    duration,
    party,
    onChange,
}: {
    bayId: string;
    start: number;
    duration: number;
    party: number;
    onChange: (v: { bayId: string; start: number; duration: number; party: number }) => void;
}) => (
    <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
            label="Bay"
            value={bayId}
            onChange={(v) => onChange({ bayId: v, start, duration, party: Math.min(party, bayById(v).capacity) })}
            options={bayOptions}
        />
        <SelectField
            label="Party size"
            value={String(party)}
            onChange={(v) => onChange({ bayId, start, duration, party: Number(v) })}
            options={partyOptions(bayId)}
        />
        <SelectField label="Start" value={String(start)} onChange={(v) => onChange({ bayId, start: Number(v), duration, party })} options={timeOptions} />
        <SelectField
            label="How long"
            value={String(duration)}
            onChange={(v) => onChange({ bayId, start, duration: Number(v), party })}
            options={durationOptions}
        />
    </div>
);

/** The fee for this golfer at this time, and whether a punch card covers it. */
const FeePanel = ({
    customer,
    start,
    duration,
    usePunches,
    onUsePunches,
}: {
    customer?: Customer;
    start: number;
    duration: number;
    usePunches: boolean;
    onUsePunches: (v: boolean) => void;
}) => {
    const fee = feeFor(customer, start, duration);
    const need = punchesNeeded(duration);
    const left = customer?.punchesLeft;
    const covered = left !== undefined && usePunches ? Math.min(left, need) : 0;
    /* A punch buys a whole hour; whatever the card can't cover is charged at the hourly rate. */
    const charge = covered ? fee.hourly * (need - covered) : fee.amount;
    return (
        <div className="flex flex-col gap-3 rounded-lg bg-secondary p-4">
            <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-secondary">
                    {fee.name} · {usd(fee.hourly)}/hr · {fmtDuration(duration)}
                </span>
                <span className="font-semibold text-primary tabular-nums">{usd(charge)}</span>
            </div>
            {left !== undefined && (
                <>
                    <Toggle
                        size="sm"
                        label={`Use punch card (${left} left, this needs ${need})`}
                        hint={membershipOf(customer)?.punchCard ? `${membershipOf(customer)?.punchCard}, granted by their membership.` : undefined}
                        isSelected={usePunches}
                        onChange={onUsePunches}
                    />
                    {usePunches && covered < need && (
                        <p className="text-xs text-warning-primary">
                            The card covers {covered} of {need} hours. The other {need - covered} {need - covered === 1 ? "hour is" : "hours are"} charged at{" "}
                            {usd(fee.hourly)}.
                        </p>
                    )}
                </>
            )}
            {!customer && <p className="text-xs text-tertiary">Pick a customer to see their rate.</p>}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Book a bay                                                                */
/* -------------------------------------------------------------------------- */

export type BookDraft = { bayId: string; start: number; customerId?: string; duration?: number };

export const BookPanel = ({
    draft,
    reservations,
    blocks,
    onClose,
    onBook,
}: {
    draft: BookDraft;
    reservations: Reservation[];
    blocks: Block[];
    onClose: () => void;
    onBook: (res: Omit<Reservation, "id">, sendEmail: boolean) => void;
}) => {
    const [customer, setCustomer] = useState<Customer | undefined>(draft.customerId ? customerById(draft.customerId) : undefined);
    const [where, setWhere] = useState({
        bayId: draft.bayId,
        start: draft.start,
        duration: draft.duration ?? 60,
        party: Math.min(2, bayById(draft.bayId).capacity),
    });
    const [repeat, setRepeat] = useState<Repeat>("none");
    const [note, setNote] = useState("");
    const [usePunches, setUsePunches] = useState(true);
    const [override, setOverride] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);

    const conflict = conflictFor(reservations, blocks, where);
    const today = customer ? bookingsToday(reservations, customer.id) : [];
    const overLimit = today.length >= DAILY_LIMIT;
    const canBook = Boolean(customer) && !conflict && (!overLimit || override);

    return (
        <SlideOver
            isOpen
            onClose={onClose}
            eyebrow={`${bayById(where.bayId).name} · ${SHEET_DATE}`}
            title="Book a bay"
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        isDisabled={!canBook}
                        onClick={() =>
                            onBook(
                                {
                                    ...where,
                                    customerId: customer!.id,
                                    status: "booked",
                                    paid: false,
                                    tabOpen: false,
                                    note: note.trim() || undefined,
                                    repeat,
                                    seriesId: repeat === "none" ? undefined : `s-${Date.now()}`,
                                    punchesUsed:
                                        customer?.punchesLeft !== undefined && usePunches
                                            ? Math.min(customer.punchesLeft, punchesNeeded(where.duration))
                                            : undefined,
                                },
                                sendEmail,
                            )
                        }
                    >
                        Book bay
                    </Button>
                </>
            }
        >
            <Group title="Who">
                {customer ? <CustomerCard customer={customer} onClear={() => setCustomer(undefined)} /> : <CustomerSearch onPick={setCustomer} />}
            </Group>

            <Group title="When and where">
                <WhenWhere {...where} onChange={setWhere} />
                {conflict && (
                    <Callout tone="error" icon={AlertCircle} title={`${bayById(where.bayId).name} isn't free then`}>
                        {conflict.kind === "reservation"
                            ? `${customerById(conflict.with.customerId)?.name} has it ${fmtTime(conflict.with.start)}–${fmtTime(conflict.with.start + conflict.with.duration)}. Pick another time or bay.`
                            : `Blocked ${fmtTime(conflict.with.start)}–${fmtTime(conflict.with.start + conflict.with.duration)}: ${conflict.with.label}.`}
                    </Callout>
                )}
                {customer && overLimit && (
                    <Callout tone="warning" icon={AlertTriangle} title={`${customer.name} already has ${today.length} bookings today`}>
                        <div className="flex flex-col gap-2">
                            <span>The daily limit is {DAILY_LIMIT}. No-shows count toward it; cancellations don't.</span>
                            <Toggle size="sm" label="Book anyway (override the limit)" isSelected={override} onChange={setOverride} />
                        </div>
                    </Callout>
                )}
            </Group>

            <Group title="Fee">
                <FeePanel customer={customer} start={where.start} duration={where.duration} usePunches={usePunches} onUsePunches={setUsePunches} />
            </Group>

            <Group title="Repeat" hint="A repeating booking is written 12 weeks ahead. Editing one later changes only that day.">
                <SelectField label="Repeat" value={repeat} onChange={(v) => setRepeat(v as Repeat)} options={repeatOptions} />
            </Group>

            <Group title="Note" hint="Shows on the sheet, where everyone reads it.">
                <TextArea aria-label="Note" rows={4} placeholder="Birthday, extra chairs, invoice to…" value={note} onChange={setNote} />
            </Group>

            <Toggle
                label="Send confirmation email"
                hint={customer ? `To ${customer.email}` : "Sent to the customer once they're picked."}
                isSelected={sendEmail}
                onChange={setSendEmail}
            />
        </SlideOver>
    );
};

/* -------------------------------------------------------------------------- */
/*  Reservation details                                                       */
/* -------------------------------------------------------------------------- */

const statusColor = { booked: "gray", checkedIn: "success", cancelled: "gray", noShow: "error" } as const;

export const DetailsPanel = ({
    res,
    reservations,
    blocks,
    onClose,
    onSave,
    onStatus,
    onCancelSeries,
}: {
    res: Reservation;
    reservations: Reservation[];
    blocks: Block[];
    onClose: () => void;
    onSave: (res: Reservation, message: string) => void;
    onStatus: (res: Reservation, message: string) => void;
    onCancelSeries: (seriesId: string) => void;
}) => {
    const customer = customerById(res.customerId)!;
    const [where, setWhere] = useState({ bayId: res.bayId, start: res.start, duration: res.duration, party: res.party });
    const [note, setNote] = useState(res.note ?? "");
    const dirty =
        where.bayId !== res.bayId || where.start !== res.start || where.duration !== res.duration || where.party !== res.party || note !== (res.note ?? "");
    const conflict = conflictFor(reservations, blocks, { ...where, id: res.id });
    const fee = feeFor(customer, where.start, where.duration);
    const live = res.status === "booked" || res.status === "checkedIn";
    const seriesCount = useMemo(() => (res.seriesId ? reservations.filter((x) => x.seriesId === res.seriesId).length : 0), [reservations, res.seriesId]);

    return (
        <SlideOver
            isOpen
            onClose={onClose}
            eyebrow={
                <span className="flex items-center gap-2">
                    {bayById(res.bayId).name} · {fmtTime(res.start)} · {SHEET_DATE}
                    <Badge size="sm" color={statusColor[res.status]}>
                        {STATUS_LABEL[res.status]}
                    </Badge>
                </span>
            }
            title={customer.name}
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        size="md"
                        isDisabled={!dirty || Boolean(conflict) || !live}
                        onClick={() => onSave({ ...res, ...where, note: note.trim() || undefined }, "Booking updated.")}
                    >
                        Save changes
                    </Button>
                </>
            }
        >
            <CustomerCard customer={customer} />

            {live && (
                <div className="flex flex-wrap gap-2">
                    {res.status === "booked" ? (
                        <Button
                            size="sm"
                            color="secondary"
                            iconLeading={CheckCircle}
                            onClick={() => onStatus({ ...res, status: "checkedIn" }, `${customer.name} checked in.`)}
                        >
                            Check in
                        </Button>
                    ) : (
                        <Button size="sm" color="secondary" onClick={() => onStatus({ ...res, status: "booked" }, "Check-in undone.")}>
                            Undo check-in
                        </Button>
                    )}
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={Receipt}
                        isDisabled={res.tabOpen || res.paid}
                        onClick={() => onStatus({ ...res, tabOpen: true }, `Tab opened with ${usd(fee.amount)} bay fee.`)}
                    >
                        {res.tabOpen ? "Tab open" : "Open a tab"}
                    </Button>
                    <Button size="sm" color="secondary" isDisabled={res.paid} onClick={() => onStatus({ ...res, paid: true, tabOpen: false }, "Marked paid.")}>
                        {res.paid ? "Paid" : "Take payment"}
                    </Button>
                </div>
            )}

            <Group
                title="When and where"
                hint={res.seriesId ? `Part of a ${REPEAT_LABEL[res.repeat].toLowerCase()} series. Changes here apply to this day only.` : undefined}
            >
                <WhenWhere {...where} onChange={setWhere} />
                {conflict && (
                    <Callout tone="error" icon={AlertCircle} title={`${bayById(where.bayId).name} isn't free then`}>
                        {conflict.kind === "reservation" ? `${customerById(conflict.with.customerId)?.name} has it.` : `Blocked: ${conflict.with.label}.`}
                    </Callout>
                )}
            </Group>

            <Group title="Fee">
                <div className="flex items-baseline justify-between rounded-lg bg-secondary p-4 text-sm">
                    <span className="text-secondary">
                        {fee.name} · {fmtDuration(where.duration)}
                        {res.punchesUsed ? ` · ${res.punchesUsed} punch${res.punchesUsed > 1 ? "es" : ""} used` : ""}
                    </span>
                    <span className="font-semibold text-primary tabular-nums">{res.punchesUsed ? usd(0) : usd(fee.amount)}</span>
                </div>
            </Group>

            <Group title="Note">
                <TextArea aria-label="Note" rows={4} value={note} onChange={setNote} isDisabled={!live} />
            </Group>

            {live && (
                <Group title="Remove this booking" hint="Both free the time on the sheet. A no-show still counts toward the golfer's daily limit.">
                    <div className="flex flex-wrap gap-2 [&>*]:flex-1">
                        <Button
                            size="md"
                            color="secondary-destructive"
                            iconLeading={Trash01}
                            onClick={() => onStatus({ ...res, status: "cancelled" }, "Booking cancelled.")}
                        >
                            Cancel booking
                        </Button>
                        <Button
                            size="md"
                            color="secondary-destructive"
                            iconLeading={UserX01}
                            onClick={() => onStatus({ ...res, status: "noShow" }, "Marked as a no-show.")}
                        >
                            Mark no-show
                        </Button>
                        {res.seriesId && (
                            <Button size="md" color="secondary-destructive" iconLeading={Repeat04} onClick={() => onCancelSeries(res.seriesId!)}>
                                Cancel all {seriesCount > 1 ? seriesCount : ""} in series
                            </Button>
                        )}
                    </div>
                </Group>
            )}
            {!live && (
                <Callout tone="gray" icon={Ticket01} title={`This booking was ${res.status === "noShow" ? "a no-show" : "cancelled"}`}>
                    The time is free again. {res.status === "noShow" && "It still counts toward the golfer's daily limit."}
                </Callout>
            )}
        </SlideOver>
    );
};

/* -------------------------------------------------------------------------- */
/*  Block a bay                                                               */
/* -------------------------------------------------------------------------- */

export type BlockDraft = { bayId: string; start: number; id?: string };

/** A block needs a reason, can cover several bays at once, can repeat, and can't land on a live booking. */
export const BlockPanel = ({
    draft,
    reservations,
    blocks,
    onClose,
    onSave,
    onRemove,
}: {
    draft: BlockDraft;
    reservations: Reservation[];
    blocks: Block[];
    onClose: () => void;
    onSave: (blocks: Omit<Block, "id">[], replaceId?: string) => void;
    onRemove: (id: string) => void;
}) => {
    const existing = draft.id ? blocks.find((b) => b.id === draft.id) : undefined;
    const [label, setLabel] = useState(existing?.label ?? "");
    const [bayIds, setBayIds] = useState<string[]>([existing?.bayId ?? draft.bayId]);
    const [start, setStart] = useState(existing?.start ?? draft.start);
    const [duration, setDuration] = useState(existing?.duration ?? 60);
    const [repeat, setRepeat] = useState<Repeat>(existing?.repeat ?? "none");
    const clashes = bayIds.map((bayId) => ({ bayId, c: conflictFor(reservations, blocks, { bayId, start, duration, id: existing?.id }) })).filter((x) => x.c);
    const canSave = label.trim().length > 0 && bayIds.length > 0 && clashes.length === 0;

    return (
        <SlideOver
            isOpen
            onClose={onClose}
            eyebrow={SHEET_DATE}
            title={existing ? "Blocked time" : "Block a bay"}
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        iconLeading={Lock01}
                        isDisabled={!canSave}
                        onClick={() =>
                            onSave(
                                bayIds.map((bayId) => ({
                                    bayId,
                                    start,
                                    duration,
                                    label: label.trim(),
                                    repeat,
                                    seriesId: repeat === "none" ? undefined : `s-${Date.now()}`,
                                })),
                                existing?.id,
                            )
                        }
                    >
                        {existing ? "Save block" : bayIds.length > 1 ? `Block ${bayIds.length} bays` : "Block bay"}
                    </Button>
                </>
            }
        >
            <Input
                label="Reason"
                isRequired
                placeholder="League setup, repair, private event…"
                value={label}
                onChange={setLabel}
                hint="Shows on the sheet in place of a name."
            />
            <Group title="Bays" hint={existing ? undefined : "Pick every bay this covers."}>
                <div className="flex flex-wrap gap-2">
                    {BAYS.map((b) => {
                        const on = bayIds.includes(b.id);
                        return (
                            <button
                                key={b.id}
                                type="button"
                                aria-pressed={on}
                                disabled={Boolean(existing) && !on}
                                onClick={() => setBayIds(on ? bayIds.filter((x) => x !== b.id) : [...bayIds, b.id])}
                                className={cx(
                                    "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition duration-100 ease-linear ring-inset disabled:cursor-not-allowed disabled:opacity-50",
                                    on
                                        ? "bg-brand-primary_alt text-brand-secondary ring-brand"
                                        : "bg-primary text-secondary ring-primary hover:bg-primary_hover",
                                )}
                            >
                                {b.name}
                            </button>
                        );
                    })}
                </div>
            </Group>
            <div className="grid gap-4 sm:grid-cols-3">
                <SelectField label="Start" value={String(start)} onChange={(v) => setStart(Number(v))} options={timeOptions} />
                <SelectField label="How long" value={String(duration)} onChange={(v) => setDuration(Number(v))} options={durationOptions} />
                <SelectField label="Repeat" value={repeat} onChange={(v) => setRepeat(v as Repeat)} options={repeatOptions} />
            </div>
            {clashes.length > 0 && (
                <Callout tone="error" icon={AlertCircle} title="A block can't cover a live booking">
                    {clashes.map(({ bayId, c }) => (
                        <div key={bayId}>
                            {bayById(bayId).name}:{" "}
                            {c!.kind === "reservation"
                                ? `${customerById(c!.with.customerId)?.name} at ${fmtTime(c!.with.start)}`
                                : `already blocked (${c!.with.label})`}
                        </div>
                    ))}
                </Callout>
            )}
            {existing && (
                <Group title="Remove this block">
                    <Button size="md" color="secondary-destructive" iconLeading={Trash01} onClick={() => onRemove(existing.id)}>
                        Remove block
                    </Button>
                </Group>
            )}
        </SlideOver>
    );
};
