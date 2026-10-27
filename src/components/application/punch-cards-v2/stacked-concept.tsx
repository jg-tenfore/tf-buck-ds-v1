"use client";

import { useState } from "react";
import { CurrencyDollar } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { TextArea } from "@/components/base/textarea/textarea";
import { money } from "../migration-v2/data";
import type { AddItemStep, ItemDraft } from "./add-item";
import { AddItemModal, EMPTY_DRAFT, draftFrom } from "./add-item";
import type { PunchCard } from "./data";
import { EMPTY_CARD, SECOND_TAX_RATES, TAX_RATES, cardTotals } from "./data";
import { CoursesCard, ExpirationCard, ItemsCard, SectionCard } from "./page-sections";
import { PunchCardFrame, usePunchCard } from "./use-punch-card";

/**
 * Details and pricing as one section: name and description on the left,
 * price and tax rates on the right, then the totals across the bottom.
 */
export const DetailsPricingCard = ({ card, onChange }: { card: PunchCard; onChange?: (patch: Partial<PunchCard>) => void }) => {
    const totals = cardTotals(card);
    const parts: [string, number][] = [
        ["Price", card.price],
        ["Tax", totals.tax],
        ["Tax 2", totals.tax2],
        ["Fees", totals.fees],
    ];
    return (
        <SectionCard title="Details & Pricing" description="What the card is called, what's included, and what it costs.">
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="flex flex-col gap-5 lg:col-span-2">
                    <Input
                        label="Title"
                        placeholder="e.g. Golf & Range Bundle"
                        value={card.title}
                        onChange={(title) => onChange?.({ title })}
                        isRequired
                        hideRequiredIndicator
                    />
                    <TextArea
                        label="Description"
                        placeholder="What's included, shown to staff and on receipts."
                        value={card.description}
                        onChange={(description) => onChange?.({ description })}
                        rows={5}
                    />
                </div>
                <div className="flex flex-col gap-5">
                    <Input
                        label="Price (before tax & fees)"
                        icon={CurrencyDollar}
                        placeholder="0.00"
                        inputMode="decimal"
                        defaultValue={card.price ? card.price.toFixed(2) : ""}
                        onChange={(v) => onChange?.({ price: Number(v.replace(/[^0-9.]/g, "")) || 0 })}
                    />
                    <NativeSelect
                        label="Tax Rate"
                        value={card.tax}
                        onChange={(e) => onChange?.({ tax: e.target.value })}
                        options={TAX_RATES.map(({ value, label }) => ({ value, label }))}
                    />
                    <NativeSelect
                        label="Tax Rate 2"
                        value={card.tax2}
                        onChange={(e) => onChange?.({ tax2: e.target.value })}
                        options={SECOND_TAX_RATES.map(({ value, label }) => ({ value, label }))}
                    />
                </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 rounded-lg bg-secondary p-4 text-sm sm:grid-cols-5">
                {parts.map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                        <dt className="text-tertiary">{k}</dt>
                        <dd className="font-medium text-primary tabular-nums">{money(v)}</dd>
                    </div>
                ))}
                <div className="flex flex-col gap-0.5 sm:items-end">
                    <dt className="font-semibold text-primary">Grand Total</dt>
                    <dd className="text-lg font-semibold text-brand-secondary tabular-nums">{money(totals.total)}</dd>
                </div>
            </dl>
        </SectionCard>
    );
};

type ModalState = { open: boolean; step: AddItemStep; draft: ItemDraft; editingId?: string };
const CLOSED: ModalState = { open: false, step: "type", draft: EMPTY_DRAFT };

/**
 * Concept D · Stacked: one column, every section the same full width. Details
 * and pricing share a section at the top; items, expiration and courses
 * follow. Adding items uses the same two-step dialog as Concept A.
 */
export const StackedConceptPage = ({
    initial = EMPTY_CARD,
    initialModal,
    title,
    onBack,
    onClose,
    onSaved,
    onDirtyChange,
}: {
    initial?: PunchCard;
    initialModal?: Partial<ModalState>;
    /** Page title, e.g. "Edit Punch Card" when opened from the list (default "New Punch Card"). */
    title?: string;
    onBack?: () => void;
    /** Cancel closes the card's tab (Products › Punch Cards). */
    onClose?: () => void;
    /** Called with the card when Save Punch Card is pressed. */
    onSaved?: (card: PunchCard) => void;
    onDirtyChange?: (dirty: boolean) => void;
}) => {
    const state = usePunchCard(initial);
    const { card, update } = state;
    const [modal, setModal] = useState<ModalState>({ ...CLOSED, ...initialModal });

    return (
        <PunchCardFrame state={state} title={title} onBack={onBack} onClose={onClose} onSaved={onSaved} onDirtyChange={onDirtyChange}>
            <div key={state.resetKey} className="flex flex-col gap-5">
                <DetailsPricingCard card={card} onChange={update} />
                <ItemsCard
                    items={card.items}
                    onAdd={() => setModal({ ...CLOSED, open: true })}
                    onEdit={(item) => setModal({ open: true, step: "details", draft: draftFrom(item), editingId: item.id })}
                    onRemove={state.removeItem}
                />
                <ExpirationCard wide value={card.expiration} onChange={(expiration) => update({ expiration })} />
                <CoursesCard wide selected={card.courses} onChange={(courses) => update({ courses })} />
            </div>
            <AddItemModal
                isOpen={modal.open}
                step={modal.step}
                draft={modal.draft}
                editing={Boolean(modal.editingId)}
                editingId={modal.editingId}
                existing={card.items}
                onDraft={(draft) => setModal((m) => ({ ...m, draft }))}
                onStep={(step) => setModal((m) => ({ ...m, step }))}
                onClose={() => setModal(CLOSED)}
                onSave={(draft) => {
                    state.saveItem(draft, modal.editingId);
                    setModal(CLOSED);
                }}
            />
        </PunchCardFrame>
    );
};
