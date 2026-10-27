"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle, SwitchHorizontal01 } from "@untitledui/icons";
import { kindMeta } from "@/components/application/punch-cards-v2/data";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InputNumber } from "@/components/base/input/input-number";
import { NativeSelect } from "@/components/base/select/select-native";
import { cx } from "@/utils/cx";
import { CUSTOMER_NAMES, type OwnedCard, date, money, remaining, statusOf, unitOf } from "./data";

const STATUS_COLORS = { Active: "success", "Expiring soon": "warning", Exhausted: "gray", Expired: "error" } as const;

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            {description && <p className="text-sm text-tertiary">{description}</p>}
        </div>
        {children}
    </section>
);

const itemName = (item: OwnedCard["items"][number]) => (item.duration ? `${item.target} · ${item.duration} min each` : item.target);

/**
 * One customer's punch card, opened as its own tab from the list (instead of
 * a modal). Correct Used per item (awarded is fixed at purchase), change the
 * expiration date, or transfer the card to another customer.
 */
export function CardDetailTab({ card, onSave }: { card: OwnedCard; onSave: (card: OwnedCard, message: string) => void }) {
    const [used, setUsed] = useState(card.items.map((item) => item.used));
    const [expires, setExpires] = useState(card.expires ?? "");
    const [transferTo, setTransferTo] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [saved, setSaved] = useState<string | null>(null);

    const changed = used.some((u, i) => u !== card.items[i].used) || (expires || null) !== card.expires;
    const draft: OwnedCard = { ...card, expires: expires || null, items: card.items.map((item, i) => ({ ...item, used: used[i] })) };
    const others = CUSTOMER_NAMES.filter((name) => name !== card.customer);

    const save = (next: OwnedCard, message: string) => {
        onSave(next, message);
        setSaved(message);
    };

    return (
        <div className="flex flex-col gap-5">
            {saved && (
                <div role="status" className="flex items-center gap-3 rounded-xl bg-success-primary px-4 py-3 ring-1 ring-fg-success-secondary ring-inset">
                    <CheckCircle className="size-5 text-fg-success-primary" aria-hidden="true" />
                    <p className="text-sm text-primary">{saved}</p>
                </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-tertiary">{card.id}</span>
                        <Badge color={STATUS_COLORS[statusOf(card)]} size="sm">
                            {statusOf(card)}
                        </Badge>
                    </div>
                    <h1 className="mt-1 text-display-xs font-semibold text-primary">{card.title}</h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Owned by <span className="font-medium text-secondary">{card.customer ?? "an unassigned customer"}</span>
                        {card.member ? " · Member" : card.customer ? " · Guest" : ""} · {card.course}
                    </p>
                </div>
                {card.customer && (
                    <Button color="link-color" size="sm" iconTrailing={ArrowUpRight}>
                        Open customer profile
                    </Button>
                )}
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
                <div className="flex flex-col gap-5">
                    <Section title="Included items" description="Awarded is fixed at purchase. Correct Used if a redemption was missed or entered by mistake.">
                        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary text-xs font-semibold tracking-wider text-tertiary uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3 text-right">Awarded</th>
                                        <th className="px-4 py-3">Used</th>
                                        <th className="px-4 py-3 text-right">Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {card.items.map((item, i) => {
                                        const left = remaining({ ...item, used: used[i] });
                                        return (
                                            <tr key={i} className="border-t border-secondary">
                                                <td className="px-4 py-3">
                                                    <div className="text-xs font-semibold tracking-wider text-tertiary uppercase">
                                                        {kindMeta(item.kind).label}
                                                    </div>
                                                    <div className="font-medium text-primary">{itemName(item)}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-secondary tabular-nums">
                                                    {item.awarded} {unitOf(item.kind)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <InputNumber
                                                        aria-label={`Used ${item.target}`}
                                                        size="sm"
                                                        minValue={0}
                                                        maxValue={item.awarded}
                                                        value={used[i]}
                                                        onChange={(n) => setUsed(used.map((u, j) => (j === i ? (Number.isNaN(n) ? 0 : n) : u)))}
                                                        wrapperClassName="w-24"
                                                    />
                                                </td>
                                                <td className={cx("px-4 py-3 text-right font-semibold tabular-nums", left ? "text-primary" : "text-tertiary")}>
                                                    {left}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Transfer card" description="Move this card and all its remaining punches to another customer.">
                        {confirming ? (
                            <div className="flex flex-col gap-3 rounded-lg bg-secondary p-4">
                                <p className="text-sm text-secondary">
                                    Transfer <span className="font-semibold text-primary">{card.title}</span> ({card.id}) from{" "}
                                    <span className="font-semibold text-primary">{card.customer ?? "unassigned"}</span> to{" "}
                                    <span className="font-semibold text-primary">{transferTo}</span>? Remaining punches move with it.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            save({ ...draft, customer: transferTo }, `${card.id} transferred to ${transferTo}.`);
                                            setConfirming(false);
                                            setTransferTo("");
                                        }}
                                    >
                                        Transfer card
                                    </Button>
                                    <Button color="secondary" size="sm" onClick={() => setConfirming(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-end gap-3">
                                <NativeSelect
                                    label="Transfer to customer"
                                    value={transferTo}
                                    onChange={(e) => setTransferTo(e.target.value)}
                                    options={[{ value: "", label: "Choose a customer…" }, ...others.map((name) => ({ value: name, label: name }))]}
                                    className="max-w-72"
                                />
                                <Button
                                    color="secondary"
                                    size="md"
                                    iconLeading={SwitchHorizontal01}
                                    isDisabled={!transferTo}
                                    onClick={() => setConfirming(true)}
                                >
                                    Transfer…
                                </Button>
                            </div>
                        )}
                    </Section>
                </div>

                <Section title="Details">
                    <Input label="Expiration date" type="date" value={expires} onChange={setExpires} hint={expires ? undefined : "No expiration"} />
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                        {[
                            ["Customer email", card.email || "Not provided"],
                            ["Course of purchase", card.course],
                            ["Purchased", date(card.purchased)],
                            ["Card price (pre-tax)", money(card.price)],
                            ["Order ID", card.order],
                        ].map(([label, value]) => (
                            <div key={label} className="min-w-0">
                                <dt className="text-xs text-tertiary">{label}</dt>
                                <dd className="mt-1 font-medium wrap-anywhere text-secondary">{value}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="flex gap-3 border-t border-secondary pt-4">
                        <Button size="md" isDisabled={!changed} onClick={() => save(draft, `Changes to ${card.id} saved.`)}>
                            Save changes
                        </Button>
                        <Button
                            color="secondary"
                            size="md"
                            isDisabled={!changed}
                            onClick={() => {
                                setUsed(card.items.map((item) => item.used));
                                setExpires(card.expires ?? "");
                            }}
                        >
                            Discard
                        </Button>
                    </div>
                </Section>
            </div>
        </div>
    );
}
