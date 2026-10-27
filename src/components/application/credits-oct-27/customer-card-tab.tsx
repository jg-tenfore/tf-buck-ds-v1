"use client";

import { useState } from "react";
import { ArrowUpRight } from "@untitledui/icons";
import { kindMeta } from "@/components/application/punch-cards-v2/data";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InputNumber } from "@/components/base/input/input-number";
import { cx } from "@/utils/cx";
import { type OwnedCard, date, money, remaining, statusOf, unitOf } from "../punch-cards-table/data";
import type { HistoryEntry } from "./data";
import { Facts, NOW, RecordHeader, STAFF, STd, STh, SavedNote, SectionCard, SectionTable, TransferHistory, TransferModal, useReportDirty } from "./kit";

const STATUS_COLORS = { Active: "success", "Expiring soon": "warning", Exhausted: "gray", Expired: "error" } as const;

const itemName = (item: OwnedCard["items"][number]) => (item.duration ? `${item.target} · ${item.duration} min each` : item.target);

/**
 * One customer's punch card in its tab, Builder 3D style: Cancel / Save at the
 * top, then full-width sections. Used and the expiration date are edited and
 * saved; the owner changes only through Transfer, recorded in the history.
 */
export const CustomerCardStacked = ({
    card,
    initialModal,
    onSave,
    onCancel,
    onDirtyChange,
}: {
    card: OwnedCard;
    initialModal?: "transfer";
    onSave: (card: OwnedCard) => void;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) => {
    const [used, setUsed] = useState(card.items.map((item) => item.used));
    const [expires, setExpires] = useState(card.expires ?? "");
    const [modal, setModal] = useState(initialModal ?? null);
    const [message, setMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([
        { date: date(card.purchased), action: "Purchased", detail: `${card.title} at ${card.course} · ${card.order}`, by: "Pro Shop" },
    ]);

    const dirty = used.some((u, i) => u !== card.items[i].used) || (expires || null) !== card.expires;
    useReportDirty(dirty, onDirtyChange);
    const draft: OwnedCard = { ...card, expires: expires || null, items: card.items.map((item, i) => ({ ...item, used: used[i] })) };
    const log = (action: string, detail: string) => setHistory((h) => [{ date: NOW, action, detail, by: STAFF }, ...h]);

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    <>
                        {card.id}
                        <Badge color={STATUS_COLORS[statusOf(card)]} size="sm">
                            {statusOf(card)}
                        </Badge>
                    </>
                }
                title="Edit Customer Punch Card"
                meta={`${card.title} · owned by ${card.customer ?? "an unassigned customer"}${card.member ? " · Member" : card.customer ? " · Guest" : ""}`}
                canSave={dirty}
                onCancel={onCancel}
                onSave={() => {
                    onSave(draft);
                    log("Edited", "Used or expiration date corrected");
                    setMessage(`Changes to ${card.id} saved.`);
                }}
                extra={
                    card.customer && (
                        <Button color="link-color" size="md" iconTrailing={ArrowUpRight}>
                            Open customer profile
                        </Button>
                    )
                }
            />
            <SavedNote message={message} />
            <SectionCard title="Included Items" description="Awarded is fixed at purchase. Correct Used if a redemption was missed or entered by mistake.">
                <SectionTable
                    head={
                        <tr>
                            <STh>Item</STh>
                            <STh className="text-right">Awarded</STh>
                            <STh>Used</STh>
                            <STh className="text-right">Remaining</STh>
                        </tr>
                    }
                >
                    {card.items.map((item, i) => {
                        const left = remaining({ ...item, used: used[i] });
                        return (
                            <tr key={i}>
                                <STd>
                                    <div className="text-xs font-semibold tracking-wider text-tertiary uppercase">{kindMeta(item.kind).label}</div>
                                    <div className="font-medium text-primary">{itemName(item)}</div>
                                </STd>
                                <STd className="text-right tabular-nums">
                                    {item.awarded} {unitOf(item.kind)}
                                </STd>
                                <STd>
                                    <InputNumber
                                        aria-label={`Used ${item.target}`}
                                        size="sm"
                                        minValue={0}
                                        maxValue={item.awarded}
                                        value={used[i]}
                                        onChange={(n) => setUsed(used.map((u, j) => (j === i ? (Number.isNaN(n) ? 0 : n) : u)))}
                                        wrapperClassName="w-24"
                                    />
                                </STd>
                                <STd className={cx("text-right font-semibold tabular-nums", left ? "text-primary" : "text-tertiary")}>{left}</STd>
                            </tr>
                        );
                    })}
                </SectionTable>
            </SectionCard>
            <SectionCard title="Details" description="When unused punches stop working, and where the card came from.">
                <div className="grid gap-5 lg:grid-cols-3">
                    <Input label="Expiration date" type="date" value={expires} onChange={setExpires} hint={expires ? undefined : "No expiration"} />
                </div>
                <Facts
                    items={[
                        ["Customer email", card.email || "Not provided"],
                        ["Course of purchase", card.course],
                        ["Purchased", date(card.purchased)],
                        ["Card price (pre-tax)", money(card.price)],
                        ["Order ID", card.order],
                    ]}
                />
            </SectionCard>
            <SectionCard title="Customer & History" description="Move this card and all its remaining punches to another customer with Transfer.">
                <TransferHistory
                    holderLabel="Owned by"
                    holder={card.customer}
                    holderDetail={card.email || undefined}
                    history={history}
                    onTransfer={() => setModal("transfer")}
                />
            </SectionCard>
            <TransferModal
                isOpen={modal === "transfer"}
                title="Transfer punch card"
                summary={`${card.title} (${card.id}) · ${draft.items.reduce((sum, item) => sum + remaining(item), 0)} punches remaining`}
                from={card.customer}
                onClose={() => setModal(null)}
                onConfirm={(to) => {
                    onSave({ ...draft, customer: to, email: "" });
                    log("Transferred", `${card.customer ?? "Unassigned"} → ${to} (all remaining punches)`);
                    setMessage(`${card.id} transferred to ${to}.`);
                }}
            />
        </div>
    );
};
