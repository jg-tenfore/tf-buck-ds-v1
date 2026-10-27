"use client";

import { useState } from "react";
import { Download01, Edit05, FilterLines, Plus, SearchLg, SlashCircle01, Umbrella03 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { money } from "../migration-v2/data";
import { LinkText, ScreenModal, TableCard, Td, Th } from "../migration-v2/kit";
import { COURSE, CREDITS_NAV, type HistoryEntry, RAIN_CHECKS, RAIN_CHECK_DETAIL, RESERVATIONS, type RainCheck } from "./data";
import {
    BalanceStrip,
    CreditsPage,
    Facts,
    NOW,
    RecordBody,
    RecordHeader,
    STAFF,
    STh,
    SavedNote,
    SectionCard,
    SectionEmpty,
    SectionTable,
    type SubTabMode,
    TransferHistory,
    TransferModal,
    useRecordTabs,
    useReportDirty,
} from "./kit";

const SUB_TABS = [
    { id: "details", label: "Details" },
    { id: "transactions", label: "Transactions" },
];

/**
 * One rain check in its tab: Cancel / Save at the top, then full-width
 * sections. The customer changes only through Transfer (to someone with a
 * reservation at this course), recorded in its history.
 */
export const RainCheckRecord = ({
    row,
    mode,
    initialModal,
    onCancel,
    onDirtyChange,
}: {
    row: RainCheck;
    mode: SubTabMode;
    initialModal?: "transfer" | "adjust" | "void";
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) => {
    const initial = { ...RAIN_CHECK_DETAIL, id: row.id, customer: row.customer, round: row.round, amount: row.awarded, used: row.used };
    const [savedExpires, setSavedExpires] = useState(initial.expires);
    const [expires, setExpires] = useState(initial.expires);
    const [customer, setCustomer] = useState(initial.customer);
    const [amount, setAmount] = useState(initial.amount);
    const [voided, setVoided] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>(initial.history);
    const [modal, setModal] = useState(initialModal ?? null);
    const [adjustBy, setAdjustBy] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const dirty = expires !== savedExpires;
    useReportDirty(dirty, onDirtyChange);
    const log = (action: string, detail: string) => setHistory((h) => [{ date: NOW, action, detail, by: STAFF }, ...h]);
    const remaining = voided ? 0 : amount - initial.used;

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={<>Rain check {initial.id}</>}
                title="Edit Rain Check"
                meta={`${customer} · ${money(remaining)} remaining${voided ? " · Voided" : ""}`}
                canSave={dirty}
                onCancel={onCancel}
                onSave={() => {
                    setSavedExpires(expires);
                    log("Edited", "Expiration date changed");
                    setMessage(`Changes to rain check ${initial.id} saved.`);
                }}
                extra={
                    <Button color="tertiary-destructive" size="md" iconLeading={SlashCircle01} isDisabled={voided} onClick={() => setModal("void")}>
                        Void
                    </Button>
                }
            />
            <SavedNote message={message} />
            <RecordBody
                mode={mode}
                tabs={SUB_TABS}
                sections={[
                    {
                        id: "balance",
                        tab: "details",
                        title: "Balance & Details",
                        description: "The amount comes from the rained-out round. Change it with Adjust.",
                        aside: (
                            <Button color="secondary" size="sm" iconLeading={Edit05} isDisabled={voided} onClick={() => setModal("adjust")}>
                                Adjust balance
                            </Button>
                        ),
                        content: (
                            <>
                                <BalanceStrip
                                    items={[
                                        { label: "Amount", value: money(amount) },
                                        { label: "Amount used", value: money(initial.used) },
                                        { label: "Amount remaining", value: money(remaining), strong: true },
                                    ]}
                                />
                                <div className="grid gap-5 lg:grid-cols-3">
                                    <Input label="Date expired" type="date" value={expires} onChange={setExpires} />
                                </div>
                                <Facts
                                    items={[
                                        ["Rain check ID", initial.id],
                                        ["Round", initial.round],
                                        ["Date created", initial.created],
                                        ["Date exhausted", initial.exhausted],
                                        ["Date realized", initial.realized],
                                    ]}
                                />
                            </>
                        ),
                    },
                    {
                        id: "transfer",
                        tab: "details",
                        title: "Customer & History",
                        description: "Move the rain check to another customer with Transfer. Every change is listed here.",
                        content: (
                            <TransferHistory
                                holder={customer}
                                holderDetail={customer === initial.customer ? `Reservation ${initial.reservation}` : undefined}
                                history={history}
                                onTransfer={() => setModal("transfer")}
                            />
                        ),
                    },
                    {
                        id: "transactions",
                        tab: "transactions",
                        title: "Transactions",
                        description: "Orders this rain check was used on.",
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        <STh>ID</STh>
                                        <STh>Date</STh>
                                        <STh>Order</STh>
                                        <STh className="text-right">Amount</STh>
                                    </tr>
                                }
                                empty={<SectionEmpty>Not used yet.</SectionEmpty>}
                            >
                                {null}
                            </SectionTable>
                        ),
                    },
                ]}
            />
            <TransferModal
                isOpen={modal === "transfer"}
                title="Transfer rain check"
                summary={`Rain check ${initial.id} · ${money(remaining)} remaining`}
                from={customer}
                note="The new holder needs a reservation at this course."
                onClose={() => setModal(null)}
                onConfirm={(to) => {
                    log("Transferred", `${customer} → ${to} (${money(remaining)})`);
                    setCustomer(to);
                    setMessage(`Rain check ${initial.id} transferred to ${to}.`);
                }}
            />
            <ScreenModal
                title="Adjust balance"
                isOpen={modal === "adjust"}
                onClose={() => setModal(null)}
                footer={
                    <>
                        <Button color="secondary" size="md" onClick={() => setModal(null)}>
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            isDisabled={!Number(adjustBy)}
                            onClick={() => {
                                const by = Number(adjustBy);
                                setAmount((a) => a + by);
                                log("Adjusted", `${by > 0 ? "+" : ""}${money(by)} to the amount`);
                                setAdjustBy("");
                                setModal(null);
                            }}
                        >
                            Adjust
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-secondary">Add to or take away from the amount. It's recorded in the rain check's history.</p>
                <Input label="Amount (use − to reduce)" placeholder="e.g. 10 or -5" inputMode="decimal" value={adjustBy} onChange={setAdjustBy} />
            </ScreenModal>
            <ScreenModal
                title="Void rain check?"
                isOpen={modal === "void"}
                onClose={() => setModal(null)}
                footer={
                    <>
                        <Button color="secondary" size="md" onClick={() => setModal(null)}>
                            Keep it
                        </Button>
                        <Button
                            color="primary-destructive"
                            size="md"
                            onClick={() => {
                                setVoided(true);
                                log("Voided", `${money(remaining)} remaining cleared`);
                                setModal(null);
                            }}
                        >
                            Void rain check
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-secondary">
                    Rain check {initial.id} can't be used after it's voided. The {money(remaining)} remaining is cleared and recorded in its history.
                </p>
            </ScreenModal>
        </div>
    );
};

/** "New" in the header: a draft tab to issue a rain check against a reservation at this course. */
export const NewRainCheck = ({
    onCancel,
    onDirtyChange,
    onSaved,
}: {
    onCancel: () => void;
    onDirtyChange?: (d: boolean) => void;
    onSaved: (rc: RainCheck) => void;
}) => {
    const [query, setQuery] = useState("");
    const [reservation, setReservation] = useState<(typeof RESERVATIONS)[number] | null>(null);
    const [holes, setHoles] = useState("0");
    const [amount, setAmount] = useState("");
    const q = query.trim().toLowerCase();
    const matches = q ? RESERVATIONS.filter((r) => `${r.id} ${r.customer}`.toLowerCase().includes(q)) : RESERVATIONS;
    const dirty = Boolean(reservation || amount || holes !== "0");
    useReportDirty(dirty, onDirtyChange);
    const canSave = Boolean(reservation && Number(amount) > 0);

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                title="New Rain Check"
                saveLabel="Save Rain Check"
                canSave={canSave}
                onCancel={onCancel}
                onSave={() =>
                    onSaved({
                        id: "58580",
                        customer: reservation!.customer,
                        round: reservation!.round,
                        created: "10/27/2026",
                        expires: "10/27/2027",
                        realized: null,
                        awarded: Number(amount),
                        used: 0,
                    })
                }
            />
            <SectionCard title="Reservation" description="The rained-out round. It must be at this course.">
                <Input label="Customer reservation search" placeholder="Search name or reservation ID" icon={SearchLg} value={query} onChange={setQuery} />
                <div className="flex flex-col overflow-hidden rounded-lg ring-1 ring-secondary">
                    {matches.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                                setReservation(r);
                                if (!amount) setAmount(r.paid.toFixed(2));
                            }}
                            className={`flex cursor-pointer items-center justify-between gap-3 border-b border-secondary px-4 py-3 text-left last:border-b-0 hover:bg-primary_hover ${reservation?.id === r.id ? "bg-active" : ""}`}
                        >
                            <span>
                                <span className="block text-sm font-medium text-primary">{r.customer}</span>
                                <span className="block text-xs text-tertiary">
                                    Reservation {r.id} · {r.round}
                                </span>
                            </span>
                            <span className="text-sm text-secondary tabular-nums">{money(r.paid)} paid</span>
                        </button>
                    ))}
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                    <Input label="Selected reservation ID" value={reservation?.id ?? ""} isReadOnly placeholder="Choose a reservation above" />
                    <Input label="Holes played" inputMode="numeric" value={holes} onChange={setHoles} />
                </div>
            </SectionCard>
            <SectionCard title="Amount" description="What the customer gets back for the holes not played.">
                <div className="grid gap-5 lg:grid-cols-3">
                    <Input label="Original price paid" value={reservation ? money(reservation.paid) : "$0.00"} isReadOnly />
                    <Input label="Rain check amount" placeholder="0.00" inputMode="decimal" value={amount} onChange={setAmount} />
                </div>
            </SectionCard>
        </div>
    );
};

type Tab = { key: string; row?: RainCheck };

/** Reports › Credits › Rain Checks: the list, each rain check in its own tab, and New as a draft tab. */
export const RainChecksPage = ({
    mode = "sections",
    initialOpen = [],
    initialModal,
}: {
    mode?: SubTabMode;
    /** Rain check ids to open as tabs ("new" for a draft); the last is active. */
    initialOpen?: string[];
    initialModal?: "transfer" | "adjust" | "void";
}) => {
    const [rows, setRows] = useState(RAIN_CHECKS);
    const tabs = useRecordTabs<Tab>(initialOpen.map((id) => (id === "new" ? { key: "new" } : { key: id, row: RAIN_CHECKS.find((r) => r.id === id)! })));
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const shown = rows.filter((r) => !q || `${r.id} ${r.customer} ${r.round} ${r.awarded}`.toLowerCase().includes(q));
    const total = shown.reduce((sum, r) => sum + r.awarded - r.used, 0);

    return (
        <CreditsPage
            navId={CREDITS_NAV.rainChecks}
            crumbs={["Reports", "Credits", "Rain Checks"]}
            title="Rain Checks"
            description="Credits issued for weather, and what is still outstanding."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Export CSV
                    </Button>
                    <Button size="md" iconLeading={Plus} onClick={() => tabs.open({ key: "new" })}>
                        Add Rain Check
                    </Button>
                </>
            }
            listLabel="Rain checks"
            tabs={tabs.tabs.map((t) =>
                t.row
                    ? { id: t.key, label: t.row.id, sublabel: t.row.customer, icon: Umbrella03 }
                    : { id: t.key, label: "New rain check", sublabel: "Draft", icon: Umbrella03 },
            )}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <div className={tabs.active === "list" ? "flex flex-col gap-4" : "hidden"}>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input
                            aria-label="Search rain checks"
                            placeholder="Search name, amount, date, or #ID"
                            icon={SearchLg}
                            value={query}
                            onChange={setQuery}
                        />
                    </div>
                    <Button color="secondary" size="md" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>
                <TableCard>
                    <thead>
                        <tr>
                            {[
                                "ID",
                                "Customer",
                                "Course",
                                "Round",
                                "Date created",
                                "Date expired",
                                "Realized",
                                "Amount awarded",
                                "Amount used",
                                "Balance act.",
                                "Balance",
                            ].map((h, i) => (
                                <Th key={h} className={i >= 7 ? "text-right" : undefined}>
                                    {h}
                                </Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((r) => (
                            <tr key={r.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: r.id, row: r })}>
                                <Td>
                                    <LinkText>{r.id}</LinkText>
                                </Td>
                                <Td className="font-medium">{r.customer}</Td>
                                <Td className="max-w-40 text-secondary">{COURSE}</Td>
                                <Td className="max-w-52 text-secondary">
                                    {r.round}
                                    {r.bookedBy && <div className="text-xs text-tertiary">booked by {r.bookedBy}</div>}
                                </Td>
                                <Td className="text-secondary">{r.created}</Td>
                                <Td className="text-secondary">{r.expires}</Td>
                                <Td className="text-secondary">{r.realized}</Td>
                                <Td className="text-right tabular-nums">{money(r.awarded)}</Td>
                                <Td className="text-right tabular-nums">{money(r.used)}</Td>
                                <Td className="text-right tabular-nums">{money(r.awarded - r.used)}</Td>
                                <Td className="text-right font-semibold tabular-nums">{money(r.awarded - r.used)}</Td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={9} className="border-t border-secondary bg-secondary px-4 py-3 text-sm font-medium text-secondary">
                                {shown.length} rain checks
                            </td>
                            <td colSpan={2} className="border-t border-secondary bg-secondary px-4 py-3 text-right text-sm font-semibold text-primary">
                                Total {money(total)}
                            </td>
                        </tr>
                    </tfoot>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    {t.row ? (
                        <RainCheckRecord
                            row={t.row}
                            mode={mode}
                            initialModal={t.key === tabs.active ? initialModal : undefined}
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        />
                    ) : (
                        <NewRainCheck
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                            onSaved={(rc) => {
                                setRows((all) => [rc, ...all]);
                                tabs.forceClose(t.key);
                                tabs.open({ key: rc.id, row: rc });
                            }}
                        />
                    )}
                </div>
            ))}
            {tabs.warning}
        </CreditsPage>
    );
};
