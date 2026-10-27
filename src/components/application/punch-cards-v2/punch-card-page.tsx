"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { AddItemStep, ItemDraft } from "./add-item";
import { AddItemModal, EMPTY_DRAFT, draftFrom } from "./add-item";
import type { PunchCard } from "./data";
import { EMPTY_CARD } from "./data";
import { CoursesCard, DetailsCard, ExpirationCard, ItemsCard, PricingCard } from "./page-sections";
import { PunchCardFrame, usePunchCard } from "./use-punch-card";

export { PUNCH_CARDS_NAV_ID } from "./use-punch-card";

/** The New Punch Card page's two columns: details and items left, pricing and rules right. */
export const PunchCardLayout = ({ left, right }: { left: ReactNode; right: ReactNode }) => (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="flex flex-col gap-5">{left}</div>
        <div className="flex flex-col gap-5">{right}</div>
    </div>
);

export type ModalState = { open: boolean; step: AddItemStep; draft: ItemDraft; editingId?: string };
const CLOSED: ModalState = { open: false, step: "type", draft: EMPTY_DRAFT };

/**
 * Concept A · Modal: the New Punch Card page in today's back-office chrome.
 * Add Item opens the two-step dialog; saved items land on the card, can be
 * edited or removed, and Save Punch Card unlocks once there's a title, a
 * price, at least one item and one course.
 */
export const PunchCardBuilder = ({
    initial = EMPTY_CARD,
    initialModal,
    title,
    onBack,
    onClose,
    onSaved,
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
}) => {
    const state = usePunchCard(initial);
    const { card, update } = state;
    const [modal, setModal] = useState<ModalState>({ ...CLOSED, ...initialModal });

    return (
        <PunchCardFrame state={state} title={title} onBack={onBack} onClose={onClose} onSaved={onSaved}>
            <PunchCardLayout
                key={state.resetKey}
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
                            onRemove={state.removeItem}
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
                onSave={(draft) => {
                    state.saveItem(draft, modal.editingId);
                    setModal(CLOSED);
                }}
            />
        </PunchCardFrame>
    );
};
