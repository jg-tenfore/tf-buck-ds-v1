"use client";

import type { ReactNode } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { CheckCircle, XClose } from "@untitledui/icons";
import { EmbeddedShellContext, ScreenShell } from "../migration-v2/kit";
import type { ItemDraft } from "./add-item";
import type { PunchCard, PunchItem } from "./data";
import { hasDuration, sameItem } from "./data";
import { PageHeader } from "./page-sections";

/** Products › Punch Cards in today's Global Nav. */
export const PUNCH_CARDS_NAV_ID = "products/punch-cards";

/**
 * The card being built and everything every concept does to it: edit fields,
 * save an item (merging into a matching line), remove one, save the card.
 */
export const usePunchCard = (initial: PunchCard) => {
    const [card, setCard] = useState(initial);
    const [saved, setSaved] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const ids = useRef(0);

    const update = (patch: Partial<PunchCard>) => {
        setCard((c) => ({ ...c, ...patch }));
        setSaved(false);
    };

    /** Add (or, with `editingId`, replace) an item. A matching line gets the punches instead. */
    const saveItem = (draft: ItemDraft, editingId?: string) => {
        const item: PunchItem = {
            id: editingId ?? `item-${++ids.current}`,
            kind: draft.kind!,
            punches: draft.punches,
            target: draft.target,
            duration: hasDuration(draft.kind) ? draft.duration : undefined,
        };
        const match = card.items.find((i) => i.id !== item.id && sameItem(i, item));
        const items = match
            ? card.items.filter((i) => i.id !== editingId).map((i) => (i.id === match.id ? { ...i, punches: i.punches + item.punches } : i))
            : editingId
              ? card.items.map((i) => (i.id === item.id ? item : i))
              : [...card.items, item];
        update({ items });
    };

    const removeItem = (item: PunchItem) => update({ items: card.items.filter((i) => i.id !== item.id) });

    const cancel = () => {
        setCard(initial);
        setSaved(false);
        setResetKey((k) => k + 1);
    };

    const canSave = Boolean(card.title.trim() && card.price > 0 && card.items.length && card.courses.length);

    const dirty = card !== initial && !saved;

    return { card, update, saveItem, removeItem, cancel, canSave, saved, setSaved, resetKey, dirty };
};

export type PunchCardState = ReturnType<typeof usePunchCard>;

/** "Golf & Range Bundle saved with 4 items." */
export const SavedBanner = ({ state }: { state: PunchCardState }) =>
    state.saved ? (
        <div role="status" className="flex items-center gap-3 rounded-xl bg-success-primary px-4 py-3 ring-1 ring-fg-success-secondary ring-inset">
            <CheckCircle className="size-5 text-fg-success-primary" aria-hidden="true" />
            <p className="flex-1 text-sm text-primary">
                <span className="font-semibold">{state.card.title}</span> saved with {state.card.items.length}{" "}
                {state.card.items.length === 1 ? "item" : "items"}.
            </p>
            <button type="button" aria-label="Dismiss" onClick={() => state.setSaved(false)} className="cursor-pointer text-fg-quaternary">
                <XClose className="size-4" />
            </button>
        </div>
    ) : null;

/** Today's back-office chrome around a New Punch Card page, with the header's Cancel / Save wired to the card. */
export const PunchCardFrame = ({
    state,
    title = "New Punch Card",
    onBack,
    onClose,
    onSaved,
    onDirtyChange,
    children,
}: {
    state: PunchCardState;
    title?: string;
    /** Back to the Products › Punch Cards list (the "‹ Punch Cards" link, and Cancel unless onClose is set). */
    onBack?: () => void;
    /** Cancel: close this card (its tab on the Products › Punch Cards page). */
    onClose?: () => void;
    /** Save Punch Card: hand the saved card back (the Products list updates its row). */
    onSaved?: (card: PunchCard) => void;
    /** Reports unsaved changes (the Products page warns before closing the tab). */
    onDirtyChange?: (dirty: boolean) => void;
    children: ReactNode;
}) => {
    const embedded = useContext(EmbeddedShellContext);
    useEffect(() => onDirtyChange?.(state.dirty), [state.dirty, onDirtyChange]);
    return (
        <ScreenShell
            nav={{ activeId: PUNCH_CARDS_NAV_ID, scrollToActive: true }}
            course="dunes"
            title={title}
            description=""
            header={
                <PageHeader
                    title={title}
                    embedded={embedded}
                    canSave={state.canSave}
                    onSave={() => {
                        state.setSaved(true);
                        onSaved?.(state.card);
                    }}
                    onBack={onBack}
                    onCancel={() => {
                        // Closing the tab discards the draft (and may ask first), so only reset when staying on the page.
                        if (onClose) return onClose();
                        state.cancel();
                        onBack?.();
                    }}
                />
            }
        >
            <SavedBanner state={state} />
            {children}
        </ScreenShell>
    );
};
