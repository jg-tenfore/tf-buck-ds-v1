"use client";

import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { ItemDraft } from "./add-item";
import { EMPTY_DRAFT, ItemFields, KindHeader, draftFrom, draftIsComplete, mergeTarget, withKind } from "./add-item";
import type { ItemKind, PunchCard } from "./data";
import { EMPTY_CARD, ITEM_KINDS } from "./data";
import { CoursesCard, DetailsCard, ExpirationCard, ItemRow, ItemTypeTile, PricingCard, SectionCard } from "./page-sections";
import { PunchCardLayout } from "./punch-card-page";
import type { PunchCardState } from "./use-punch-card";
import { PunchCardFrame, usePunchCard } from "./use-punch-card";

/** What the inline editor is working on: a new item of a kind, or an existing line. */
export type Composer = { draft: ItemDraft; editingId?: string } | null;

/** The fields for one item, framed in the items card, with Cancel and Add / Save. */
const InlineEditor = ({
    composer,
    state,
    onChange,
    onDone,
}: {
    composer: NonNullable<Composer>;
    state: PunchCardState;
    onChange: (composer: Composer) => void;
    onDone: () => void;
}) => {
    const { draft, editingId } = composer;
    const merge = mergeTarget(draft, state.card.items, editingId);
    return (
        <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 ring-2 ring-brand">
            <KindHeader kind={draft.kind!} onChange={editingId ? undefined : () => onChange(null)} />
            <ItemFields draft={draft} onDraft={(p) => onChange({ ...composer, draft: { ...draft, ...p } })} merge={merge} />
            <div className="flex justify-end gap-3">
                <Button color="secondary" size="md" onClick={onDone}>
                    Cancel
                </Button>
                <Button
                    size="md"
                    isDisabled={!draftIsComplete(draft)}
                    onClick={() => {
                        state.saveItem(draft, editingId);
                        onDone();
                    }}
                >
                    {editingId ? "Save changes" : merge ? "Add to existing line" : "Add to card"}
                </Button>
            </div>
        </div>
    );
};

/** One button per kind: picking one opens its fields right below, no dialog. */
const KindChips = ({ onPick }: { onPick: (kind: ItemKind) => void }) => (
    <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-secondary">Add to this card</span>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {ITEM_KINDS.map((k) => (
                <button
                    key={k.kind}
                    type="button"
                    onClick={() => onPick(k.kind)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover hover:ring-brand"
                >
                    <ItemTypeTile kind={k.kind} className="size-9" />
                    <span className="flex-1 text-sm font-semibold text-primary">{k.label}</span>
                    <Plus className="size-4 text-fg-quaternary" aria-hidden="true" />
                </button>
            ))}
        </div>
    </div>
);

/** Concept B's items card: rows edit in place, new items are composed at the bottom. */
export const InlineItemsCard = ({ state, initialComposer = null }: { state: PunchCardState; initialComposer?: Composer }) => {
    const [composer, setComposer] = useState<Composer>(initialComposer);
    const { items } = state.card;
    const close = () => setComposer(null);
    return (
        <SectionCard
            title="Punch Card Items"
            description="What the customer can redeem with this card."
            aside={<span className="pt-1 text-sm text-tertiary">{items.length === 1 ? "1 item" : `${items.length} items`}</span>}
        >
            {items.length > 0 && (
                <ul className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                    {items.map((item) =>
                        composer?.editingId === item.id ? (
                            <li key={item.id} className="bg-secondary p-3">
                                <InlineEditor composer={composer} state={state} onChange={setComposer} onDone={close} />
                            </li>
                        ) : (
                            <ItemRow
                                key={item.id}
                                item={item}
                                onEdit={() => setComposer({ draft: draftFrom(item), editingId: item.id })}
                                onRemove={() => state.removeItem(item)}
                            />
                        ),
                    )}
                </ul>
            )}
            {composer && !composer.editingId ? (
                <InlineEditor composer={composer} state={state} onChange={setComposer} onDone={close} />
            ) : (
                <>
                    {items.length === 0 && (
                        <p className="rounded-xl bg-secondary px-4 py-6 text-center text-sm text-tertiary">
                            No items yet. Pick a kind below to add the first one.
                        </p>
                    )}
                    <KindChips onPick={(kind) => setComposer({ draft: withKind(EMPTY_DRAFT, kind) })} />
                </>
            )}
        </SectionCard>
    );
};

/**
 * Concept B · Inline: the same page, but adding never leaves it. Pick a kind
 * from the chips under the list and its fields open right there; the pencil
 * opens a line in place. One step instead of two, nothing covering the card.
 */
export const InlineConceptPage = ({ initial = EMPTY_CARD, initialComposer }: { initial?: PunchCard; initialComposer?: Composer }) => {
    const state = usePunchCard(initial);
    const { card, update } = state;
    return (
        <PunchCardFrame state={state}>
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
                        <InlineItemsCard state={state} initialComposer={initialComposer} />
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
        </PunchCardFrame>
    );
};
