"use client";

import { useState } from "react";
import { CalendarPlus01, Check, Ticket02 } from "@untitledui/icons";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { BalanceStrip, Facts, STd, STh, SavedNote, SectionTable } from "@/components/application/credits-oct-27/kit";
import { ScreenModal } from "@/components/application/migration-v2/kit";
import { PageHeader } from "@/components/application/screen-kit";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { NativeSelect } from "@/components/base/select/select-native";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import {
    BALANCES,
    CREDIT_TERM,
    type CreditBalance,
    type CreditEvent,
    type CreditEventKind,
    EXTEND_REASONS,
    GOLFER,
    STAFF,
    TODAY,
    TODAYS_LESSON,
    addMonths,
    balanceLabel,
    cannotPayFor,
    courseName,
    daysUntil,
    fmtDate,
    instructorById,
    lessonById,
    money0,
    packageById,
    parseDate,
    singlePrice,
} from "./data";
import { CoachAvatar, CreditDots } from "./pack-card";

/**
 * Customers › Mara Linden › Lesson credits: every pack she holds, with credits left, purchase
 * and expiry dates and the redemption history. Staff can extend one pack's expiry (with a
 * reason, logged in its history) and apply a credit to a lesson, which is how an instructor
 * pays for a lesson at the lesson tee.
 */

/* -------------------------------------------------------------------------- */
/*  Status and history                                                        */
/* -------------------------------------------------------------------------- */

/** Packs this close to their date are flagged, so staff can offer an extension. */
const EXPIRING_SOON_DAYS = 30;

type BalanceStatus = "active" | "expiring" | "assigned" | "used-up" | "expired";

const statusOf = (b: CreditBalance): BalanceStatus => {
    if (b.creditsRemaining === 0) return "used-up";
    if (b.expiresOn) {
        const d = daysUntil(parseDate(b.expiresOn));
        if (d < 0) return "expired";
        if (d <= EXPIRING_SOON_DAYS) return "expiring";
    }
    return b.assigned ? "assigned" : "active";
};

const STATUS: Record<BalanceStatus, { label: string; color: "success" | "warning" | "gray" | "error" }> = {
    active: { label: "Active", color: "success" },
    expiring: { label: "Expiring soon", color: "warning" },
    assigned: { label: "Assigned", color: "gray" },
    "used-up": { label: "Used up", color: "gray" },
    expired: { label: "Expired", color: "error" },
};

const EVENT: Record<CreditEventKind, string> = {
    purchased: "Bought",
    issued: "Issued",
    booked: "Booked with a credit",
    applied: "Applied at the lesson tee",
    returned: "Credit returned",
    extended: "Expiry extended",
};

const inDays = (date: string) => {
    const d = daysUntil(parseDate(date));
    return d < 0 ? `${-d} days ago` : d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
};

const History = ({ events }: { events: CreditEvent[] }) => (
    <SectionTable
        head={
            <tr>
                <STh>Date</STh>
                <STh>What happened</STh>
                <STh>Lesson or detail</STh>
                <STh>By</STh>
                <STh className="text-right">Credits</STh>
            </tr>
        }
    >
        {events.map((e, i) => (
            <tr key={`${e.date}-${e.kind}-${i}`}>
                <STd className="whitespace-nowrap tabular-nums">{e.date}</STd>
                <STd>
                    <span className="flex flex-col">
                        <span className="font-medium text-primary">{EVENT[e.kind]}</span>
                        {e.note && <span className="text-xs text-tertiary">{e.note}</span>}
                    </span>
                </STd>
                <STd>{e.label}</STd>
                <STd className="whitespace-nowrap">{e.by}</STd>
                <STd
                    className={cx(
                        "text-right font-semibold tabular-nums",
                        e.credits < 0 ? "text-primary" : e.credits > 0 ? "text-success-primary" : "text-quaternary",
                    )}
                >
                    {e.credits > 0 ? `+${e.credits}` : e.credits < 0 ? `−${-e.credits}` : "—"}
                </STd>
            </tr>
        ))}
    </SectionTable>
);

/* -------------------------------------------------------------------------- */
/*  One pack                                                                  */
/* -------------------------------------------------------------------------- */

export const BalanceCard = ({ balance, onExtend, onApply }: { balance: CreditBalance; onExtend?: () => void; onApply?: () => void }) => {
    const instructor = instructorById(balance.instructorId);
    const status = statusOf(balance);
    const pack = packageById(balance.packageId);
    const courses = pack?.courseIds ?? instructor.courseIds;
    const extended = balance.history.find((e) => e.kind === "extended");
    return (
        <section
            data-testid="credit-balance"
            className={cx(
                "flex flex-col gap-5 rounded-xl bg-primary p-6 shadow-xs ring-inset",
                status === "expiring" ? "ring-2 ring-fg-warning-secondary" : "ring-1 ring-secondary",
            )}
        >
            <div className="flex flex-wrap items-start gap-4">
                <CoachAvatar instructor={instructor} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-primary">{balanceLabel(balance)}</h2>
                        <Badge size="sm" type="pill-color" color={STATUS[status].color}>
                            {STATUS[status].label}
                        </Badge>
                    </span>
                    <span className="text-sm text-tertiary">
                        with {instructor.name} · {lessonById(balance.lessonId).name} · {money0(singlePrice(instructor, lessonById(balance.lessonId)))} single
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {balance.expiresOn && (
                        <Button size="sm" color="secondary" iconLeading={CalendarPlus01} onClick={onExtend}>
                            Extend expiry
                        </Button>
                    )}
                    {balance.creditsRemaining > 0 && (
                        <Button size="sm" color="secondary" iconLeading={Ticket02} onClick={onApply}>
                            Apply a credit
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-secondary px-4 py-3.5">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-wider text-quaternary uppercase">Credits left</span>
                    <span className="flex flex-wrap items-center gap-3">
                        <span className="text-display-xs font-semibold text-primary tabular-nums">
                            {balance.creditsRemaining}
                            <span className="text-md font-medium text-tertiary">/{balance.creditsTotal}</span>
                        </span>
                        <CreditDots total={balance.creditsTotal} remaining={balance.creditsRemaining} />
                    </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold tracking-wider text-quaternary uppercase">Value held</span>
                    <span className="text-lg font-semibold text-primary tabular-nums">{money0(balance.creditsRemaining * balance.perLesson)}</span>
                    <span className="text-xs text-tertiary tabular-nums">{money0(balance.perLesson)} a credit</span>
                </div>
            </div>

            <Facts
                columns={4}
                items={[
                    [balance.assigned ? "Issued" : "Purchased", balance.purchasedOn],
                    [
                        "Expires",
                        balance.expiresOn ? (
                            <span className="flex flex-col">
                                <span className={cx(status === "expiring" && "text-warning-primary")}>
                                    {balance.expiresOn} · {inDays(balance.expiresOn)}
                                </span>
                                <span className="text-xs font-normal text-tertiary">{extended ? `Extended by ${extended.by}` : CREDIT_TERM}</span>
                            </span>
                        ) : (
                            "No expiry (imported balance)"
                        ),
                    ],
                    ["Valid at", courses.map(courseName).join(", ")],
                    ["Transfer", balance.transferable ? "Transferable" : "This golfer only"],
                ]}
            />

            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-secondary">Redemption history</span>
                <History events={balance.history} />
            </div>
        </section>
    );
};

/* -------------------------------------------------------------------------- */
/*  Extend expiry                                                             */
/* -------------------------------------------------------------------------- */

const EXTEND_BY = [
    { months: 1, label: "1 month" },
    { months: 3, label: "3 months" },
    { months: 6, label: "6 months" },
    { months: 12, label: "1 year" },
];

export interface ExtendResult {
    newDate: string;
    reason: string;
    note: string;
}

/** The dialog body, with its own state (shared by the modal and the inline story). */
const ExtendExpiryBody = ({
    balance,
    months,
    reason,
    note,
    onMonths,
    onReason,
    onNote,
}: {
    balance: CreditBalance;
    months: number;
    reason: string;
    note: string;
    onMonths: (m: number) => void;
    onReason: (r: string) => void;
    onNote: (n: string) => void;
}) => {
    const current = parseDate(balance.expiresOn!);
    // An expired pack extends from today, not from its old date.
    const from = current < TODAY ? TODAY : current;
    return (
        <>
            <div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3">
                <CoachAvatar instructor={instructorById(balance.instructorId)} size="sm" />
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold text-primary">
                        {balanceLabel(balance)} · {instructorById(balance.instructorId).name}
                    </span>
                    <span className="text-sm text-tertiary">
                        {balance.creditsRemaining} of {balance.creditsTotal} credits left · expires {balance.expiresOn} ({inDays(balance.expiresOn!)})
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-secondary">Extend by</span>
                <AriaRadioGroup aria-label="Extend by" value={String(months)} onChange={(v) => onMonths(Number(v))} className="grid grid-cols-2 gap-2">
                    {EXTEND_BY.map((o) => (
                        <AriaRadio
                            key={o.months}
                            value={String(o.months)}
                            className={({ isSelected }) =>
                                cx(
                                    "flex cursor-pointer items-center gap-3 rounded-lg p-3 ring-1 transition duration-100 ease-linear ring-inset",
                                    isSelected ? "bg-brand-primary_alt ring-2 ring-brand" : "ring-secondary hover:bg-primary_hover",
                                )
                            }
                        >
                            {({ isSelected, isFocusVisible }) => (
                                <>
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-sm font-semibold text-primary">{o.label}</span>
                                        <span className="text-xs text-tertiary tabular-nums">to {fmtDate(addMonths(from, o.months))}</span>
                                    </span>
                                    <RadioButtonBase size="sm" isSelected={isSelected} isFocusVisible={isFocusVisible} />
                                </>
                            )}
                        </AriaRadio>
                    ))}
                </AriaRadioGroup>
                <p className="flex items-center justify-between rounded-lg px-4 py-3 text-sm ring-1 ring-secondary ring-inset">
                    <span className="text-tertiary">New expiry</span>
                    <span className="tabular-nums">
                        <span className="text-quaternary line-through">{balance.expiresOn}</span>{" "}
                        <span className="font-semibold text-primary">{fmtDate(addMonths(from, months))}</span>
                    </span>
                </p>
            </div>

            <NativeSelect
                label="Reason"
                hint="Required. Saved in this pack's history."
                value={reason}
                onChange={(e) => onReason(e.target.value)}
                options={[{ value: "", label: "Pick a reason", disabled: true }, ...EXTEND_REASONS.map((r) => ({ value: r, label: r }))]}
            />
            <TextArea label="Note (optional)" placeholder="e.g. Shoulder injury, back on the range in January." value={note} onChange={onNote} rows={2} />
            <p className="text-xs text-tertiary">Only this golfer's pack changes. Other golfers who bought the same pack keep their own dates.</p>
        </>
    );
};

export const ExtendExpiryModal = ({
    balance,
    isOpen,
    onClose,
    onExtend,
    initialReason = "",
}: {
    balance: CreditBalance;
    isOpen: boolean;
    onClose: () => void;
    onExtend: (r: ExtendResult) => void;
    initialReason?: string;
}) => {
    const [months, setMonths] = useState(3);
    const [reason, setReason] = useState(initialReason);
    const [note, setNote] = useState("");
    const current = parseDate(balance.expiresOn ?? fmtDate(TODAY));
    const from = current < TODAY ? TODAY : current;
    return (
        <ScreenModal
            title="Extend expiry"
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-lg"
            footer={
                <>
                    <Button size="md" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        iconLeading={Check}
                        isDisabled={!reason}
                        onClick={() => onExtend({ newDate: fmtDate(addMonths(from, months)), reason, note })}
                    >
                        Extend expiry
                    </Button>
                </>
            }
        >
            <ExtendExpiryBody balance={balance} months={months} reason={reason} note={note} onMonths={setMonths} onReason={setReason} onNote={setNote} />
        </ScreenModal>
    );
};

/* -------------------------------------------------------------------------- */
/*  Apply a credit to a lesson                                                */
/* -------------------------------------------------------------------------- */

export const ApplyCreditModal = ({
    balances,
    isOpen,
    onClose,
    onApply,
}: {
    balances: CreditBalance[];
    isOpen: boolean;
    onClose: () => void;
    onApply: (balanceId: string) => void;
}) => {
    const lesson = TODAYS_LESSON;
    const instructor = instructorById(lesson.instructorId);
    const usable = balances.filter((b) => !cannotPayFor(b, lesson));
    const [picked, setPicked] = useState(usable[0]?.id ?? "");
    const price = singlePrice(instructor, lessonById(lesson.lessonId));
    return (
        <ScreenModal
            title="Apply a credit to a lesson"
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-lg"
            footer={
                <>
                    <Button size="md" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="md" iconLeading={Check} isDisabled={!picked} onClick={() => onApply(picked)}>
                        Apply 1 credit
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-secondary">Lesson</span>
                <div className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3">
                    <CoachAvatar instructor={instructor} size="sm" />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-semibold text-primary">{lesson.label}</span>
                        <span className="text-sm text-tertiary">
                            {GOLFER.name} with {instructor.name} · {money0(price)} due
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-secondary">Pay with</span>
                <AriaRadioGroup aria-label="Pay with" value={picked} onChange={setPicked} className="flex flex-col gap-2">
                    {balances.map((b) => {
                        const why = cannotPayFor(b, lesson);
                        return (
                            <AriaRadio
                                key={b.id}
                                value={b.id}
                                isDisabled={Boolean(why)}
                                className={({ isSelected, isDisabled }) =>
                                    cx(
                                        "flex items-center gap-3 rounded-lg p-3 ring-1 transition duration-100 ease-linear ring-inset",
                                        isDisabled ? "cursor-not-allowed opacity-50 ring-secondary" : "cursor-pointer",
                                        isSelected ? "bg-brand-primary_alt ring-2 ring-brand" : !isDisabled && "ring-secondary hover:bg-primary_hover",
                                    )
                                }
                            >
                                {({ isSelected, isFocusVisible, isDisabled }) => (
                                    <>
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="text-sm font-semibold text-primary">
                                                {balanceLabel(b)} · {instructorById(b.instructorId).name}
                                            </span>
                                            <span className="text-xs text-tertiary">
                                                {why ?? `${b.creditsRemaining} of ${b.creditsTotal} left${b.expiresOn ? ` · expires ${b.expiresOn}` : ""}`}
                                            </span>
                                        </span>
                                        <RadioButtonBase size="sm" isSelected={isSelected} isFocusVisible={isFocusVisible} isDisabled={isDisabled} />
                                    </>
                                )}
                            </AriaRadio>
                        );
                    })}
                </AriaRadioGroup>
                {usable.length === 0 && <p className="text-sm text-error-primary">No pack can pay for this lesson. Charge it as a single lesson instead.</p>}
            </div>

            <p className="text-xs text-tertiary">
                Instructors apply credits at the lesson tee. One credit pays for this golfer's lesson; nothing more is charged. It shows in the pack's history
                as applied by {instructor.name}.
            </p>
        </ScreenModal>
    );
};

/* -------------------------------------------------------------------------- */
/*  The page                                                                  */
/* -------------------------------------------------------------------------- */

export const CustomerCredits = ({
    initialDialog = null,
    extendId = "bal-ks-5",
    initialReason,
}: {
    /** Open with a dialog showing (for the dialog stories). */
    initialDialog?: "extend" | "apply" | null;
    /** The pack Extend expiry opens on. */
    extendId?: string;
    initialReason?: string;
}) => {
    const [balances, setBalances] = useState(BALANCES);
    const [dialog, setDialog] = useState<{ kind: "extend"; id: string } | { kind: "apply" } | null>(
        initialDialog === "extend" ? { kind: "extend", id: extendId } : initialDialog === "apply" ? { kind: "apply" } : null,
    );
    const [message, setMessage] = useState<string | null>(null);

    const left = balances.reduce((n, b) => n + b.creditsRemaining, 0);
    const value = balances.reduce((n, b) => n + b.creditsRemaining * b.perLesson, 0);
    const dated = balances.filter((b) => b.expiresOn && b.creditsRemaining > 0).sort((a, b) => +parseDate(a.expiresOn!) - +parseDate(b.expiresOn!));
    const next = dated[0];
    const today = fmtDate(TODAY);

    const update = (id: string, fn: (b: CreditBalance) => CreditBalance) => setBalances((all) => all.map((b) => (b.id === id ? fn(b) : b)));
    const extending = dialog?.kind === "extend" ? balances.find((b) => b.id === dialog.id) : undefined;

    return (
        <AppShell activeUrl="/customers/list">
            <PageHeader
                title={GOLFER.name}
                subtitle={`Customers / ${GOLFER.name} / Lesson credits · Customer #${GOLFER.customerId} · ${GOLFER.email}`}
                action={
                    <Button size="md" iconLeading={Ticket02} onClick={() => setDialog({ kind: "apply" })}>
                        Apply a credit to a lesson
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <SavedNote message={message} />
                <BalanceStrip
                    items={[
                        { label: "Credits left", value: String(left), strong: true },
                        { label: "Value held", value: money0(value) },
                        { label: "Packs", value: String(balances.length) },
                        { label: "Next expiry", value: next ? `${next.expiresOn} (${inDays(next.expiresOn!)})` : "None" },
                    ]}
                />
                {balances.map((b) => (
                    <BalanceCard key={b.id} balance={b} onExtend={() => setDialog({ kind: "extend", id: b.id })} onApply={() => setDialog({ kind: "apply" })} />
                ))}
            </div>

            {extending && (
                <ExtendExpiryModal
                    key={extending.id}
                    balance={extending}
                    isOpen
                    initialReason={initialReason}
                    onClose={() => setDialog(null)}
                    onExtend={({ newDate, reason, note }) => {
                        update(extending.id, (b) => ({
                            ...b,
                            expiresOn: newDate,
                            history: [
                                {
                                    date: today,
                                    kind: "extended",
                                    label: `From ${b.expiresOn} to ${newDate}`,
                                    by: STAFF,
                                    credits: 0,
                                    note: note ? `${reason}: ${note}` : reason,
                                },
                                ...b.history,
                            ],
                        }));
                        setMessage(`${balanceLabel(extending)} with ${instructorById(extending.instructorId).name} now expires ${newDate}.`);
                        setDialog(null);
                    }}
                />
            )}
            {dialog?.kind === "apply" && (
                <ApplyCreditModal
                    balances={balances}
                    isOpen
                    onClose={() => setDialog(null)}
                    onApply={(id) => {
                        const by = instructorById(TODAYS_LESSON.instructorId).name;
                        update(id, (b) => ({
                            ...b,
                            creditsRemaining: b.creditsRemaining - 1,
                            history: [{ date: today, kind: "applied", label: TODAYS_LESSON.label, by, credits: -1 }, ...b.history],
                        }));
                        setMessage(`1 credit applied to ${TODAYS_LESSON.label}. Nothing more to charge.`);
                        setDialog(null);
                    }}
                />
            )}
        </AppShell>
    );
};
