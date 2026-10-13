"use client";

import { useState } from "react";
import { Calendar, MarkerPin01 } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import type { ItemDraft } from "./add-item";
import { EMPTY_DRAFT, ItemFields, draftFrom, draftIsComplete, mergeTarget, withKind } from "./add-item";
import type { ItemKind, PunchCard, PunchItem } from "./data";
import { EMPTY_CARD, ITEM_KINDS, cardTotals, expirationLabel, itemLabel, kindMeta, punchesLabel } from "./data";
import { CoursesCard, DetailsCard, ExpirationCard, ItemRow, ItemTypeTile, PricingCard, SectionCard } from "./page-sections";
import type { PunchCardState } from "./use-punch-card";
import { PunchCardFrame, usePunchCard } from "./use-punch-card";

/* -------------------------------------------------------------------------- */
/*  Customer preview                                                          */
/* -------------------------------------------------------------------------- */

/** One punch per dot up to 20; beyond that a bar, so big cards stay readable. */
const Punches = ({ count }: { count: number }) =>
    count <= 20 ? (
        <div className="flex flex-wrap gap-1.5" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <span key={i} className="size-3.5 rounded-full ring-1 ring-primary ring-inset" />
            ))}
        </div>
    ) : (
        <div className="h-2 w-full rounded-full bg-tertiary" aria-hidden="true" />
    );

const PreviewItem = ({ item }: { item: PunchItem }) => {
    const Icon = kindMeta(item.kind).icon;
    return (
        <li className="flex flex-col gap-2 py-3">
            <div className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                <span className="flex-1 truncate text-sm font-semibold text-primary">{itemLabel(item)}</span>
                <span className="shrink-0 text-xs text-tertiary tabular-nums">0 of {item.punches} used</span>
            </div>
            <Punches count={item.punches} />
        </li>
    );
};

/** The punch card as the customer would see it after buying: what's on it, how many punches, where and until when. */
export const PunchCardPreview = ({ card }: { card: PunchCard }) => {
    const total = cardTotals(card).total;
    return (
        <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-secondary">
            <div className="flex flex-col gap-3 bg-brand-solid p-5">
                <span className="text-xs font-semibold tracking-[0.14em] text-tertiary_on-brand uppercase">Punch card · The Dunes of Delgado</span>
                <div className="flex items-end justify-between gap-4">
                    <h3 className={cx("text-xl font-semibold", card.title ? "text-primary_on-brand" : "text-tertiary_on-brand")}>
                        {card.title || "Untitled punch card"}
                    </h3>
                    <span className="shrink-0 text-lg font-semibold text-primary_on-brand tabular-nums">{money(total)}</span>
                </div>
                {card.description && <p className="text-sm text-secondary_on-brand">{card.description}</p>}
            </div>
            <div className="flex flex-col gap-1 bg-primary px-5 pt-2 pb-5">
                {card.items.length ? (
                    <ul className="divide-y divide-secondary">
                        {card.items.map((item) => (
                            <PreviewItem key={item.id} item={item} />
                        ))}
                    </ul>
                ) : (
                    <p className="py-6 text-center text-sm text-tertiary">Items you add show up here.</p>
                )}
                <dl className="flex flex-col gap-2 border-t border-secondary pt-4 text-sm">
                    <div className="flex items-start gap-2 text-tertiary">
                        <Calendar className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Expires</dt>
                        <dd>{expirationLabel(card.expiration)}</dd>
                    </div>
                    <div className="flex items-start gap-2 text-tertiary">
                        <MarkerPin01 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Valid at</dt>
                        <dd>{card.courses.length ? card.courses.join(", ") : "No courses picked yet"}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Items with tiles + slide-over                                             */
/* -------------------------------------------------------------------------- */

export type Drawer = { draft: ItemDraft; editingId?: string } | null;

/** Concept C's items card: the list, then a tile per kind; tiles and pencils open the slide-over. */
const TileItemsCard = ({ state, onOpen }: { state: PunchCardState; onOpen: (drawer: Drawer) => void }) => (
    <SectionCard title="Punch Card Items" description="Pick what this card includes. Each item opens in a side panel.">
        {state.card.items.length > 0 && (
            <ul className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                {state.card.items.map((item) => (
                    <ItemRow
                        key={item.id}
                        item={item}
                        onEdit={() => onOpen({ draft: draftFrom(item), editingId: item.id })}
                        onRemove={() => state.removeItem(item)}
                    />
                ))}
            </ul>
        )}
        <div className="grid grid-cols-2 gap-3 2xl:grid-cols-3">
            {ITEM_KINDS.map((k) => (
                <button
                    key={k.kind}
                    type="button"
                    onClick={() => onOpen({ draft: withKind(EMPTY_DRAFT, k.kind) })}
                    className="flex cursor-pointer flex-col items-start gap-3 rounded-xl p-4 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover hover:ring-brand"
                >
                    <ItemTypeTile kind={k.kind} />
                    <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-primary">Add {k.label.toLowerCase()}</span>
                        <span className="text-xs text-tertiary">{k.description}</span>
                    </span>
                </button>
            ))}
        </div>
    </SectionCard>
);

/** The side panel: one kind's fields, Save Item. Opened straight on a kind, so there's no step 1. */
const ItemDrawer = ({ drawer, state, onChange }: { drawer: Drawer; state: PunchCardState; onChange: (drawer: Drawer) => void }) => {
    const kind: ItemKind | undefined = drawer?.draft.kind;
    const merge = drawer ? mergeTarget(drawer.draft, state.card.items, drawer.editingId) : undefined;
    return (
        <SlideoutMenu isOpen={Boolean(drawer)} onOpenChange={(open) => !open && onChange(null)} isDismissable className="z-50">
            {drawer && kind && (
                <>
                    <SlideoutMenu.Header onClose={() => onChange(null)}>
                        <div className="flex items-center gap-3">
                            <ItemTypeTile kind={kind} solid />
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-primary">
                                    {drawer.editingId ? "Edit" : "Add"} {kindMeta(kind).label.toLowerCase()}
                                </h2>
                                <p className="text-sm text-tertiary">{kindMeta(kind).description}</p>
                            </div>
                        </div>
                    </SlideoutMenu.Header>
                    <SlideoutMenu.Content>
                        <ItemFields draft={drawer.draft} onDraft={(p) => onChange({ ...drawer, draft: { ...drawer.draft, ...p } })} merge={merge} />
                    </SlideoutMenu.Content>
                    <SlideoutMenu.Footer className="flex justify-end gap-3">
                        <Button color="secondary" size="md" onClick={() => onChange(null)}>
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            isDisabled={!draftIsComplete(drawer.draft)}
                            onClick={() => {
                                state.saveItem(drawer.draft, drawer.editingId);
                                onChange(null);
                            }}
                        >
                            {drawer.editingId ? "Save changes" : "Save Item"}
                        </Button>
                    </SlideoutMenu.Footer>
                </>
            )}
        </SlideoutMenu>
    );
};

/**
 * Concept C · Live preview: one form column (details → items → pricing →
 * rules) next to a sticky preview of the card the customer gets. Kinds are
 * big tiles that open a side panel straight on that kind, so there's no
 * "choose type" step, and every change shows up on the card as you go.
 */
export const PreviewConceptPage = ({ initial = EMPTY_CARD, initialDrawer = null }: { initial?: PunchCard; initialDrawer?: Drawer }) => {
    const state = usePunchCard(initial);
    const { card, update } = state;
    const [drawer, setDrawer] = useState<Drawer>(initialDrawer);
    return (
        <PunchCardFrame state={state}>
            <div key={state.resetKey} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="flex flex-col gap-5">
                    <DetailsCard
                        title={card.title}
                        description={card.description}
                        onTitle={(title) => update({ title })}
                        onDescription={(description) => update({ description })}
                    />
                    <TileItemsCard state={state} onOpen={setDrawer} />
                    <div className="grid items-start gap-5 2xl:grid-cols-2">
                        <PricingCard card={card} onChange={update} />
                        <div className="flex flex-col gap-5">
                            <ExpirationCard value={card.expiration} onChange={(expiration) => update({ expiration })} />
                            <CoursesCard selected={card.courses} onChange={(courses) => update({ courses })} />
                        </div>
                    </div>
                </div>
                <aside className="flex flex-col gap-3 xl:sticky xl:top-24">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-sm font-semibold text-secondary">What the customer gets</h2>
                        <span className="text-xs text-tertiary">
                            {card.items.reduce((n, i) => n + i.punches, 0)} {punchesLabel(2)} total
                        </span>
                    </div>
                    <PunchCardPreview card={card} />
                </aside>
            </div>
            <ItemDrawer drawer={drawer} state={state} onChange={setDrawer} />
        </PunchCardFrame>
    );
};
