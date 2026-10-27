"use client";

import { useEffect, useState } from "react";
import { Download01, Edit05, FilterLines, Gift01, Mail01, RefreshCcw01, SearchLg, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { money } from "../migration-v2/data";
import { LinkText, ScreenModal, TableCard, Td, Th } from "../migration-v2/kit";
import { COURSE, CREDITS_NAV, GIFT_CARDS, GIFT_CARD_DETAIL, GIFT_CARD_TOTALS, type GiftCard, type HistoryEntry } from "./data";
import {
    BalanceStrip,
    CreditsPage,
    Facts,
    NOW,
    RecordBody,
    RecordHeader,
    STAFF,
    STd,
    STh,
    SavedNote,
    SectionEmpty,
    SectionTable,
    type SubTabMode,
    TransferHistory,
    TransferModal,
    useRecordTabs,
    useReportDirty,
} from "./kit";

const RESTRICTIONS = [
    ["paymentPending", "Payment pending"],
    ["foodBeverage", "For food & beverage"],
    ["alcohol", "For alcohol"],
    ["merchandise", "For merchandise"],
    ["teeFees", "For tee fees"],
] as const;
type Restrictions = typeof GIFT_CARD_DETAIL.restrictions;

const SUB_TABS = [
    { id: "details", label: "Details" },
    { id: "outgoing", label: "Outgoing orders" },
    { id: "incoming", label: "Incoming orders" },
    { id: "books", label: "Credit books" },
    { id: "emails", label: "Resend emails" },
];

/** Every gift card opens as 274402's detail with its own id and holder (sample data). */
const detailFor = (row: GiftCard) => ({ ...GIFT_CARD_DETAIL, id: row.id, upc: row.upc, customer: row.to, awarded: row.awarded, used: row.used });

/**
 * One gift card in its tab, Builder 3D style: Cancel / Save at the top, then
 * full-width sections. The holder changes only through Transfer, which is
 * recorded in the card's history.
 */
export const GiftCardRecord = ({
    row,
    mode,
    initialModal,
    startEdited,
    onCancel,
    onDirtyChange,
}: {
    row: GiftCard;
    mode: SubTabMode;
    initialModal?: "transfer" | "adjust";
    /** Start with an unsaved expiration change (stories). */
    startEdited?: boolean;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) => {
    const initial = detailFor(row);
    const [savedCard, setSavedCard] = useState({ expires: initial.expires, restrictions: initial.restrictions });
    const [expires, setExpires] = useState(startEdited ? "2123-08-25" : savedCard.expires);
    const [restrictions, setRestrictions] = useState<Restrictions>(savedCard.restrictions);
    const [customer, setCustomer] = useState(initial.customer);
    const [awarded, setAwarded] = useState(initial.awarded);
    const [history, setHistory] = useState<HistoryEntry[]>(initial.history);
    const [modal, setModal] = useState(initialModal ?? null);
    const [adjustBy, setAdjustBy] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const dirty = expires !== savedCard.expires || RESTRICTIONS.some(([key]) => restrictions[key] !== savedCard.restrictions[key]);
    useReportDirty(dirty, onDirtyChange);
    const log = (action: string, detail: string) => setHistory((h) => [{ date: NOW, action, detail, by: STAFF }, ...h]);
    const remaining = awarded - initial.used;

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={<>Gift card {initial.id}</>}
                title="Edit Gift Card"
                meta={`${customer} · ${money(remaining)} remaining`}
                canSave={dirty}
                onCancel={onCancel}
                onSave={() => {
                    setSavedCard({ expires, restrictions });
                    log("Edited", "Expiration date or usage restrictions changed");
                    setMessage(`Changes to gift card ${initial.id} saved.`);
                }}
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
                        description: "Amounts are set by orders and adjustments. Change the balance with Adjust.",
                        aside: (
                            <Button color="secondary" size="sm" iconLeading={Edit05} onClick={() => setModal("adjust")}>
                                Adjust balance
                            </Button>
                        ),
                        content: (
                            <>
                                <BalanceStrip
                                    items={[
                                        { label: "Amount awarded", value: money(awarded) },
                                        { label: "Amount used", value: money(initial.used) },
                                        { label: "Amount remaining", value: money(remaining), strong: true },
                                    ]}
                                />
                                <div className="grid gap-5 lg:grid-cols-3">
                                    <Input label="Expiration date" type="date" value={expires} onChange={setExpires} />
                                </div>
                                <Facts
                                    items={[
                                        ["Gift card ID", initial.id],
                                        ["UPC code", initial.upc],
                                        ["Date created", initial.created],
                                        ["Date imported", initial.imported],
                                    ]}
                                />
                            </>
                        ),
                    },
                    {
                        id: "restrictions",
                        tab: "details",
                        title: "Usage Restrictions",
                        description: "What this gift card can be spent on.",
                        content: (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {RESTRICTIONS.map(([key, label]) => (
                                    <div key={key} className="rounded-lg p-4 ring-1 ring-secondary">
                                        <Toggle label={label} isSelected={restrictions[key]} onChange={(on) => setRestrictions((r) => ({ ...r, [key]: on }))} />
                                    </div>
                                ))}
                            </div>
                        ),
                    },
                    {
                        id: "transfer",
                        tab: "details",
                        title: "Customer & History",
                        description: "Move the card and its balance to another customer with Transfer.",
                        content: <TransferHistory holder={customer} holderDetail={initial.email} history={history} onTransfer={() => setModal("transfer")} />,
                    },
                    {
                        id: "outgoing",
                        tab: "outgoing",
                        title: "Outgoing Orders",
                        description: "Orders this gift card paid for.",
                        aside: (
                            <Button color="secondary" size="sm" iconLeading={RefreshCcw01}>
                                Sync
                            </Button>
                        ),
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        <STh>Order ID</STh>
                                        <STh>Order payment ID</STh>
                                        <STh>Course</STh>
                                        <STh>Date</STh>
                                        <STh>Status</STh>
                                        <STh className="text-right">Amount</STh>
                                    </tr>
                                }
                                empty={!initial.outgoingOrders.length && <SectionEmpty>Not used on any orders yet.</SectionEmpty>}
                            >
                                {null}
                            </SectionTable>
                        ),
                    },
                    {
                        id: "incoming",
                        tab: "incoming",
                        title: "Incoming Orders",
                        description: "The order that bought this gift card.",
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        <STh>Order ID</STh>
                                        <STh>Order item ID</STh>
                                        <STh>Date</STh>
                                        <STh>Status</STh>
                                        <STh className="text-right">Amount</STh>
                                    </tr>
                                }
                                empty={!initial.incomingOrders.length && <SectionEmpty>Not bought through an order (issued from a credit book).</SectionEmpty>}
                            >
                                {null}
                            </SectionTable>
                        ),
                    },
                    {
                        id: "books",
                        tab: "books",
                        title: "Credit Books",
                        description: "Credit books that paid out to this gift card.",
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        <STh>ID</STh>
                                        <STh>Name</STh>
                                        <STh>Date</STh>
                                        <STh className="text-right">Amount</STh>
                                    </tr>
                                }
                            >
                                {initial.creditBooks.map((b) => (
                                    <tr key={b.id}>
                                        <STd>{b.id}</STd>
                                        <STd className="font-medium text-primary">{b.name}</STd>
                                        <STd>{b.date}</STd>
                                        <STd className="text-right tabular-nums">{money(b.amount)}</STd>
                                    </tr>
                                ))}
                            </SectionTable>
                        ),
                    },
                    {
                        id: "emails",
                        tab: "emails",
                        title: "Resend Emails",
                        description: "Send the purchase confirmation or recipient notification again.",
                        content: (
                            <div className="flex flex-col gap-5">
                                {!initial.purchaser && (
                                    <div className="rounded-lg bg-warning-primary px-4 py-3 text-sm text-primary ring-1 ring-fg-warning-secondary ring-inset">
                                        No purchase order found for this gift card, so the purchase confirmation can't be resent.
                                    </div>
                                )}
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="min-w-64 flex-1">
                                        <Input label="Purchaser email" hint="Purchaser: —" placeholder="Purchaser email" isDisabled={!initial.purchaser} />
                                    </div>
                                    <Button color="secondary" size="md" iconLeading={Mail01} isDisabled={!initial.purchaser}>
                                        Resend purchase confirmation
                                    </Button>
                                </div>
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="min-w-64 flex-1">
                                        <Input label="Recipient email" hint={`Recipient: ${customer}`} defaultValue={initial.email} />
                                    </div>
                                    <Button color="secondary" size="md" iconLeading={Mail01}>
                                        Resend recipient notification
                                    </Button>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
            <TransferModal
                isOpen={modal === "transfer"}
                title="Transfer gift card"
                summary={`Gift card ${initial.id} · ${money(remaining)} remaining`}
                from={customer}
                onClose={() => setModal(null)}
                onConfirm={(to) => {
                    log("Transferred", `${customer} → ${to} (${money(remaining)})`);
                    setCustomer(to);
                    setMessage(`Gift card ${initial.id} transferred to ${to}.`);
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
                                setAwarded((a) => a + by);
                                log("Adjusted", `${by > 0 ? "+" : ""}${money(by)} to the amount awarded`);
                                setAdjustBy("");
                                setModal(null);
                            }}
                        >
                            Adjust
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-secondary">Add to or take away from the amount awarded. It's recorded in the card's history.</p>
                <Input label="Amount (use − to reduce)" placeholder="e.g. 10 or -5" inputMode="decimal" value={adjustBy} onChange={setAdjustBy} />
            </ScreenModal>
        </div>
    );
};

type Tab = { key: string; row: GiftCard };

/** Reports › Credits › Gift Cards: the list, and each card in its own closable tab. */
export const GiftCardsPage = ({
    mode = "sections",
    initialOpen = [],
    initialModal,
    unsavedWarning,
}: {
    mode?: SubTabMode;
    /** Gift card ids to open as tabs; the last is active. */
    initialOpen?: string[];
    initialModal?: "transfer" | "adjust";
    /** The active card has an unsaved change and its tab is being closed (stories). */
    unsavedWarning?: boolean;
}) => {
    const tabs = useRecordTabs<Tab>(initialOpen.map((id) => ({ key: id, row: GIFT_CARDS.find((g) => g.id === id)! })));
    const { askToClose } = tabs;
    useEffect(() => {
        if (unsavedWarning && initialOpen.length) askToClose(initialOpen.at(-1)!);
    }, [unsavedWarning]); // eslint-disable-line react-hooks/exhaustive-deps
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const rows = GIFT_CARDS.filter((g) => !q || `${g.id} ${g.to} ${g.upc}`.toLowerCase().includes(q));

    return (
        <CreditsPage
            navId={CREDITS_NAV.giftCards}
            crumbs={["Reports", "Credits", "Gift Cards"]}
            title="Gift Cards"
            description="Balances, activity and what is still outstanding."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={Trash01}>
                        Close expired
                    </Button>
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Export CSV
                    </Button>
                </>
            }
            listLabel="Gift cards"
            tabs={tabs.tabs.map((t) => ({ id: t.key, label: t.row.id, sublabel: t.row.to, icon: Gift01 }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <div className={tabs.active === "list" ? "flex flex-col gap-4" : "hidden"}>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input aria-label="Search gift cards" placeholder="Search ID, name or UPC" icon={SearchLg} value={query} onChange={setQuery} />
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
                                "To",
                                "From",
                                "UPC",
                                "Type",
                                "Course",
                                "Date created",
                                "Date expired",
                                "Realized",
                                "Amount awarded",
                                "Amount used",
                                "Balance act.",
                                "Balance",
                            ].map((h, i) => (
                                <Th key={h} className={i >= 9 ? "text-right" : undefined}>
                                    {h}
                                </Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((g) => (
                            <tr key={g.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: g.id, row: g })}>
                                <Td>
                                    <LinkText>{g.id}</LinkText>
                                </Td>
                                <Td>
                                    <LinkText>{g.to}</LinkText>
                                </Td>
                                <Td className="text-tertiary">{g.from ?? "N/A"}</Td>
                                <Td className="text-secondary">{g.upc}</Td>
                                <Td className="text-secondary">{g.type}</Td>
                                <Td className="max-w-40 text-secondary">{COURSE}</Td>
                                <Td className="text-secondary">{g.created}</Td>
                                <Td className="text-secondary">{g.expires}</Td>
                                <Td className="text-secondary">{g.realized}</Td>
                                <Td className="text-right tabular-nums">{money(g.awarded)}</Td>
                                <Td className="text-right tabular-nums">{money(g.used)}</Td>
                                <Td className="text-right tabular-nums">{money(g.awarded - g.used)}</Td>
                                <Td className="text-right font-semibold tabular-nums">{money(g.awarded - g.used)}</Td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={11} className="border-t border-secondary bg-secondary px-4 py-3 text-sm font-medium text-secondary">
                                {GIFT_CARD_TOTALS.count} gift cards
                            </td>
                            <td colSpan={2} className="border-t border-secondary bg-secondary px-4 py-3 text-right text-sm font-semibold text-primary">
                                Total {money(GIFT_CARD_TOTALS.balance)}
                            </td>
                        </tr>
                    </tfoot>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <GiftCardRecord
                        row={t.row}
                        mode={mode}
                        initialModal={t.key === tabs.active ? initialModal : undefined}
                        startEdited={unsavedWarning && t.key === tabs.active}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                    />
                </div>
            ))}
            {tabs.warning}
        </CreditsPage>
    );
};
