"use client";

import { useRef, useState } from "react";
import { CheckCircle, XClose } from "@untitledui/icons";
import { ScreenShell } from "../migration-v2/kit";
import type { AddItemStep, ItemDraft } from "./add-item";
import { AddItemModal, EMPTY_DRAFT, draftFrom } from "./add-item";
import type { PunchCard, PunchItem } from "./data";
import { EMPTY_CARD, hasDuration, sameItem } from "./data";
import { CoursesCard, DetailsCard, ExpirationCard, ItemsCard, PageHeader, PricingCard } from "./page-sections";

/** Products › Punch Cards in today's Global Nav. */
export const PUNCH_CARDS_NAV_ID = "products/punch-cards";

/** The New Punch Card page laid out with its four sections; no behavior. */
export const PunchCardLayout = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="flex flex-col gap-5">{left}</div>
        <div className="flex flex-col gap-5">{right}</div>
    </div>
);

type ModalState = { open: boolean; step: AddItemStep; draft: ItemDraft; editingId?: string };
const CLOSED: ModalState = { open: false, step: "type", draft: EMPTY_DRAFT };

/**
 * The full flow: New Punch Card page in today's back-office chrome. Add Item
 * opens the two-step dialog; saved items land on the card, can be edited or
 * removed, and Save Punch Card unlocks once there's a title, a price, at
 * least one item and one course.
 */
export const PunchCardBuilder = ({ initial = EMPTY_CARD, initialModal }: { initial?: PunchCard; initialModal?: Partial<ModalState> }) => {
    const [card, setCard] = useState(initial);
    const [modal, setModal] = useState<ModalState>({ ...CLOSED, ...initialModal });
    const [saved, setSaved] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const ids = useRef(0);

    const update = (patch: Partial<PunchCard>) => {
        setCard((c) => ({ ...c, ...patch }));
        setSaved(false);
    };
    const canSave = Boolean(card.title.trim() && card.price > 0 && card.items.length && card.courses.length);

    const saveItem = (draft: ItemDraft) => {
        const item: PunchItem = {
            id: modal.editingId ?? `item-${++ids.current}`,
            kind: draft.kind!,
            punches: draft.punches,
            target: draft.target,
            duration: hasDuration(draft.kind) ? draft.duration : undefined,
        };
        // Already on the card (same kind, target and length)? Add the punches to that line instead.
        const match = card.items.find((i) => i.id !== item.id && sameItem(i, item));
        const items = match
            ? card.items.filter((i) => i.id !== modal.editingId).map((i) => (i.id === match.id ? { ...i, punches: i.punches + item.punches } : i))
            : modal.editingId
              ? card.items.map((i) => (i.id === item.id ? item : i))
              : [...card.items, item];
        update({ items });
        setModal(CLOSED);
    };

    return (
        <ScreenShell
            nav={{ activeId: PUNCH_CARDS_NAV_ID, scrollToActive: true }}
            course="dunes"
            title="New Punch Card"
            description=""
            header={
                <PageHeader
                    canSave={canSave}
                    onSave={() => setSaved(true)}
                    onCancel={() => {
                        setCard(initial);
                        setSaved(false);
                        setResetKey((k) => k + 1);
                    }}
                />
            }
        >
            {saved && (
                <div role="status" className="ring-success-secondary flex items-center gap-3 rounded-xl bg-success-primary px-4 py-3 ring-1 ring-inset">
                    <CheckCircle className="size-5 text-fg-success-primary" aria-hidden="true" />
                    <p className="flex-1 text-sm text-primary">
                        <span className="font-semibold">{card.title}</span> saved with {card.items.length} {card.items.length === 1 ? "item" : "items"}.
                    </p>
                    <button type="button" aria-label="Dismiss" onClick={() => setSaved(false)} className="cursor-pointer text-fg-quaternary">
                        <XClose className="size-4" />
                    </button>
                </div>
            )}
            <PunchCardLayout
                key={resetKey}
                left={
                    <>
                        <DetailsCard
                            title={card.title}
                            description={card.description}
                            onTitle={(title) => update({ title })}
                            onDescription={(description) => update({ description })}
                        />
                        <ItemsCard
                            items={card.items}
                            onAdd={() => setModal({ ...CLOSED, open: true })}
                            onEdit={(item) => setModal({ open: true, step: "details", draft: draftFrom(item), editingId: item.id })}
                            onRemove={(item) => update({ items: card.items.filter((i) => i.id !== item.id) })}
                        />
                    </>
                }
                right={
                    <>
                        <PricingCard card={card} onChange={update} />
                        <ExpirationCard value={card.expiration} onChange={(expiration) => update({ expiration })} />
                        <CoursesCard selected={card.courses} onChange={(courses) => update({ courses })} />
                    </>
                }
            />
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
                onSave={saveItem}
            />
        </ScreenShell>
    );
};
