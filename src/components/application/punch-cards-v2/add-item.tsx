"use client";

import { useId, useState } from "react";
import { Check, SearchLg, XClose } from "@untitledui/icons";
import {
    Dialog as AriaDialog,
    ListBox as AriaListBox,
    ListBoxItem as AriaListBoxItem,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    Radio as AriaRadio,
    RadioGroup as AriaRadioGroup,
} from "react-aria-components";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { InputNumber } from "@/components/base/input/input-number";
import { Label } from "@/components/base/input/label";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { NativeSelect } from "@/components/base/select/select-native";
import { cx } from "@/utils/cx";
import type { ItemKind, PunchItem } from "./data";
import {
    ACTIVITY_TYPES,
    CLINICS,
    DURATION_PRESETS,
    INSTRUCTORS,
    ITEM_KINDS,
    PRODUCTS,
    TRANSPORTATION_TYPES,
    defaultTarget,
    hasDuration,
    itemSummary,
    kindMeta,
    sameItem,
} from "./data";
import { ItemTypeTile } from "./page-sections";

export type AddItemStep = "type" | "details";

/** The item being built in the dialog (kind is unset until step 1 is answered). */
export type ItemDraft = {
    kind?: ItemKind;
    punches: number;
    target: string;
    duration: number;
    query: string;
    /** "Custom" picked in the duration presets (activities, lessons). */
    customDuration?: boolean;
};

export const EMPTY_DRAFT: ItemDraft = { punches: 10, target: "", duration: 60, query: "" };

/** Start editing an existing item at step 2. */
export const draftFrom = (item: PunchItem): ItemDraft => ({
    kind: item.kind,
    punches: item.punches,
    target: item.target,
    duration: item.duration ?? 60,
    query: item.kind === "product" ? item.target.split(" ")[0].toLowerCase() : "",
    customDuration: hasDuration(item.kind) && !DURATION_PRESETS[item.kind]!.includes(item.duration ?? 60),
});

/** Switch the draft to a kind, keeping punches but resetting what it covers. */
export const withKind = (draft: ItemDraft, kind: ItemKind): ItemDraft =>
    draft.kind === kind ? draft : { ...draft, kind, target: defaultTarget[kind], query: "", duration: 60, customDuration: false };

export const draftIsComplete = (draft: ItemDraft) =>
    Boolean(draft.kind && draft.punches > 0 && draft.target && (!hasDuration(draft.kind) || draft.duration > 0));

/* -------------------------------------------------------------------------- */
/*  Step 1 · Choose type                                                      */
/* -------------------------------------------------------------------------- */

const ChooseType = ({ value, onChange }: { value?: ItemKind; onChange: (kind: ItemKind) => void }) => (
    <AriaRadioGroup
        aria-label="What are you adding to this punch card?"
        value={value ?? null}
        onChange={(v) => onChange(v as ItemKind)}
        className="flex flex-col gap-3"
    >
        <span className="text-sm font-semibold text-secondary">What are you adding to this punch card?</span>
        {ITEM_KINDS.map((k) => (
            <AriaRadio
                key={k.kind}
                value={k.kind}
                className={({ isSelected }) =>
                    cx(
                        "flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 transition duration-100 ease-linear ring-inset",
                        isSelected ? "bg-brand-primary_alt ring-2 ring-brand" : "ring-secondary hover:bg-primary_hover",
                    )
                }
            >
                {({ isSelected, isFocusVisible }) => (
                    <>
                        <ItemTypeTile kind={k.kind} solid={isSelected} />
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-sm font-semibold text-primary">{k.label}</span>
                            <span className="text-sm text-tertiary">{k.description}</span>
                        </span>
                        <RadioButtonBase size="md" isSelected={isSelected} isFocusVisible={isFocusVisible} />
                    </>
                )}
            </AriaRadio>
        ))}
    </AriaRadioGroup>
);

/* -------------------------------------------------------------------------- */
/*  Step 2 · Set punches                                                      */
/* -------------------------------------------------------------------------- */

const Punches = ({ value, onChange, hint }: { value: number; onChange: (n: number) => void; hint?: string }) => (
    <InputNumber
        label="Number of punches"
        hint={hint}
        orientation="horizontal"
        size="sm"
        minValue={1}
        maxValue={999}
        value={value}
        onChange={(n) => onChange(Number.isNaN(n) ? 1 : n)}
        wrapperClassName="w-40"
        inputClassName="text-center"
    />
);

const ProductSearch = ({ draft, onDraft }: { draft: ItemDraft; onDraft: (patch: Partial<ItemDraft>) => void }) => {
    const labelId = useId();
    const q = draft.query.trim().toLowerCase();
    const results = PRODUCTS.filter((p) => !q || `${p.name} ${p.group} ${p.location}`.toLowerCase().includes(q));
    return (
        <div className="flex flex-col gap-1.5">
            <Label id={labelId}>Product</Label>
            <div className="flex flex-col overflow-hidden rounded-lg shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand">
                <div className="flex items-center gap-2 border-b border-secondary px-3 py-2">
                    <SearchLg className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    <input
                        type="search"
                        aria-labelledby={labelId}
                        placeholder="Search products"
                        value={draft.query}
                        onChange={(e) => onDraft({ query: e.target.value })}
                        className="w-full bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder"
                    />
                </div>
                <AriaListBox
                    aria-label="Products"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={draft.target ? [draft.target] : []}
                    onSelectionChange={(keys) => {
                        const [key] = [...(keys as Set<string>)];
                        if (key) onDraft({ target: key });
                    }}
                    renderEmptyState={() => <p className="px-3 py-4 text-sm text-tertiary">No products match “{draft.query}”.</p>}
                    className="max-h-48 overflow-y-auto py-1"
                >
                    {results.map((p) => (
                        <AriaListBoxItem
                            key={p.name}
                            id={p.name}
                            textValue={p.name}
                            className={({ isSelected, isFocusVisible }) =>
                                cx(
                                    "mx-1 flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-hidden",
                                    isSelected ? "bg-active font-semibold text-primary" : "text-secondary hover:bg-primary_hover",
                                    isFocusVisible && "ring-2 ring-brand",
                                )
                            }
                        >
                            {({ isSelected }) => (
                                <>
                                    <Check className={cx("size-4 shrink-0 text-fg-brand-primary", !isSelected && "invisible")} aria-hidden="true" />
                                    <span className="flex-1 truncate">{p.name}</span>
                                    <span className="shrink-0 text-xs text-tertiary">
                                        {p.group} · {p.location}
                                    </span>
                                </>
                            )}
                        </AriaListBoxItem>
                    ))}
                </AriaListBox>
            </div>
            <p className="text-sm text-tertiary">Search any product: drinks, range buckets, merchandise.</p>
        </div>
    );
};

/** Quick-pick lengths (30 / 60 / 90 / 120 min) plus Custom, which reveals a minutes field. */
const DurationPresets = ({ label, draft, onDraft }: { label: string; draft: ItemDraft; onDraft: (patch: Partial<ItemDraft>) => void }) => {
    const presets = DURATION_PRESETS[draft.kind!]!;
    const custom = draft.customDuration || !presets.includes(draft.duration);
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            <div className="flex flex-wrap items-center gap-3">
                <ButtonGroup
                    size="sm"
                    aria-label={label}
                    selectedKeys={new Set([custom ? "custom" : String(draft.duration)])}
                    onSelectionChange={(keys) => {
                        const [key] = [...keys];
                        if (!key) return;
                        if (key === "custom") onDraft({ customDuration: true });
                        else onDraft({ duration: Number(key), customDuration: false });
                    }}
                >
                    {presets.map((m) => (
                        <ButtonGroupItem key={m} id={String(m)}>
                            {m} min
                        </ButtonGroupItem>
                    ))}
                    <ButtonGroupItem id="custom">Custom</ButtonGroupItem>
                </ButtonGroup>
                {custom && (
                    <InputNumber
                        aria-label="Custom length in minutes"
                        size="sm"
                        minValue={5}
                        maxValue={480}
                        step={5}
                        value={draft.duration}
                        onChange={(n) => onDraft({ duration: Number.isNaN(n) ? 60 : n })}
                        formatOptions={{ style: "unit", unit: "minute", unitDisplay: "long" }}
                        wrapperClassName="w-36"
                    />
                )}
            </div>
        </div>
    );
};

const SetPunches = ({
    draft,
    onDraft,
    onChangeType,
    merge,
}: {
    draft: ItemDraft;
    onDraft: (patch: Partial<ItemDraft>) => void;
    onChangeType: () => void;
    /** The line on the card this would merge into, if it's already there. */
    merge?: PunchItem;
}) => {
    const kind = draft.kind!;
    const meta = kindMeta(kind);
    const options = (list: string[]) => list.map((v) => ({ value: v, label: v }));
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3 ring-1 ring-secondary ring-inset">
                <ItemTypeTile kind={kind} solid />
                <span className="flex flex-1 flex-col">
                    <span className="text-xs font-semibold tracking-wider text-tertiary uppercase">Item type</span>
                    <span className="text-sm font-semibold text-primary">{meta.label}</span>
                </span>
                <Button color="link-color" size="sm" onClick={onChangeType}>
                    Change
                </Button>
            </div>

            {kind === "transportation" && (
                <NativeSelect
                    label="Transportation type"
                    value={draft.target}
                    onChange={(e) => onDraft({ target: e.target.value })}
                    options={options(TRANSPORTATION_TYPES)}
                />
            )}
            {kind === "product" && <ProductSearch draft={draft} onDraft={onDraft} />}
            {kind === "activity" && (
                <NativeSelect
                    label="Activity type"
                    value={draft.target}
                    onChange={(e) => onDraft({ target: e.target.value })}
                    options={options(ACTIVITY_TYPES)}
                />
            )}
            {kind === "clinic" && (
                <NativeSelect label="Clinic" value={draft.target} onChange={(e) => onDraft({ target: e.target.value })} options={options(CLINICS)} />
            )}
            {kind === "lesson" && (
                <NativeSelect label="Instructor" value={draft.target} onChange={(e) => onDraft({ target: e.target.value })} options={options(INSTRUCTORS)} />
            )}

            {hasDuration(kind) && <DurationPresets label={kind === "lesson" ? "Lesson length" : "Duration per punch"} draft={draft} onDraft={onDraft} />}
            <Punches value={draft.punches} onChange={(punches) => onDraft({ punches })} hint={meta.rule} />

            <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary">
                {draftIsComplete(draft) ? (
                    <>
                        This card will include{" "}
                        <span className="font-semibold text-primary">{itemSummary({ ...draft, kind, punches: draft.punches + (merge?.punches ?? 0) })}</span>
                        {merge && (
                            <span className="mt-1 block text-tertiary">
                                Already on this card with {merge.punches}, so saving adds {draft.punches} to that line instead of adding a new one.
                            </span>
                        )}
                    </>
                ) : (
                    "Pick a product to see what this card will include."
                )}
            </p>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Dialog                                                                    */
/* -------------------------------------------------------------------------- */

export interface AddItemPanelProps {
    step: AddItemStep;
    draft: ItemDraft;
    /** Editing an existing item: title reads "Edit Item", and Back becomes Cancel. */
    editing?: boolean;
    /** Items already on the card, to spot a duplicate that will merge. */
    existing?: PunchItem[];
    editingId?: string;
    onDraft: (draft: ItemDraft) => void;
    onStep: (step: AddItemStep) => void;
    onCancel?: () => void;
    onSave?: (draft: ItemDraft) => void;
    className?: string;
}

/** The Add Item dialog box itself: header, the current step, footer. Rendered inline in stories, in a modal in the flow. */
export const AddItemPanel = ({ step, draft, editing, existing = [], editingId, onDraft, onStep, onCancel, onSave, className }: AddItemPanelProps) => {
    const patch = (p: Partial<ItemDraft>) => onDraft({ ...draft, ...p });
    const merge = draft.kind ? existing.find((i) => i.id !== editingId && sameItem(i, { ...draft, kind: draft.kind! })) : undefined;
    return (
        <div className={cx("flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-primary shadow-xl ring-1 ring-secondary_alt", className)}>
            <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-primary">{editing ? "Edit Item" : "Add Item"}</h2>
                    <p className="text-sm text-tertiary">{step === "type" ? "Step 1 of 2 · Choose type" : "Step 2 of 2 · Set punches"}</p>
                </div>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onCancel}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                >
                    <XClose className="size-5" />
                </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                {step === "type" ? (
                    <ChooseType value={draft.kind} onChange={(kind) => onDraft(withKind(draft, kind))} />
                ) : (
                    <SetPunches draft={draft} onDraft={patch} onChangeType={() => onStep("type")} merge={merge} />
                )}
            </div>
            <div className={cx("flex gap-3 border-t border-secondary px-6 py-4", step === "type" ? "justify-end" : "justify-between")}>
                {step === "type" ? (
                    <>
                        <Button color="secondary" size="md" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button size="md" isDisabled={!draft.kind} onClick={() => onStep("details")}>
                            Next
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="secondary" size="md" onClick={editing ? onCancel : () => onStep("type")}>
                            {editing ? "Cancel" : "Back"}
                        </Button>
                        <Button size="md" isDisabled={!draftIsComplete(draft)} onClick={() => onSave?.(draft)}>
                            Save Item
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

/** AddItemPanel with its own state, for the stand-alone component stories. */
export const AddItemPanelDemo = ({
    step: initialStep = "type",
    draft: initialDraft = EMPTY_DRAFT,
    existing,
}: {
    step?: AddItemStep;
    draft?: ItemDraft;
    existing?: PunchItem[];
}) => {
    const [step, setStep] = useState(initialStep);
    const [draft, setDraft] = useState(initialDraft);
    const reset = () => {
        setStep(initialStep);
        setDraft(initialDraft);
    };
    return <AddItemPanel step={step} draft={draft} existing={existing} onDraft={setDraft} onStep={setStep} onCancel={reset} onSave={reset} />;
};

/** AddItemPanel in a modal over the page. */
export const AddItemModal = ({ isOpen, onClose, ...panel }: AddItemPanelProps & { isOpen: boolean; onClose: () => void }) => (
    <AriaModalOverlay
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-6 backdrop-blur-[2px]"
    >
        <AriaModal className="flex w-full justify-center">
            <AriaDialog aria-label={panel.editing ? "Edit Item" : "Add Item"} className="flex w-full justify-center outline-hidden">
                <AddItemPanel {...panel} onCancel={onClose} />
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);
