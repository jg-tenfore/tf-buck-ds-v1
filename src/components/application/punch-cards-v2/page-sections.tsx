"use client";

import type { ReactNode } from "react";
import { ChevronLeft, CurrencyDollar, Edit01, Plus, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { InputNumber } from "@/components/base/input/input-number";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { NativeSelect } from "@/components/base/select/select-native";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import type { Expiration, ItemKind, PunchCard, PunchItem } from "./data";
import { COURSES, SECOND_TAX_RATES, TAX_RATES, cardTotals, itemLabel, kindMeta, punchesLabel } from "./data";

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

/** White card with a title, as on the New Punch Card page. */
export const SectionCard = ({ title, description, aside, children }: { title: string; description?: string; aside?: ReactNode; children: ReactNode }) => (
    <section className="flex flex-col gap-5 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
            {aside}
        </div>
        {children}
    </section>
);

/** The item kind's icon in a rounded tile; `solid` for the selected kind in the Add Item dialog. */
export const ItemTypeTile = ({ kind, solid, className }: { kind: ItemKind; solid?: boolean; className?: string }) => {
    const Icon = kindMeta(kind).icon;
    return (
        <span
            className={cx(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                solid ? "bg-brand-solid text-white" : "bg-brand-primary text-fg-brand-primary ring-1 ring-brand ring-inset",
                className,
            )}
        >
            <Icon className="size-5" aria-hidden="true" />
        </span>
    );
};

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

export const PageHeader = ({
    title = "New Punch Card",
    canSave = true,
    onCancel,
    onSave,
}: {
    title?: string;
    canSave?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
}) => (
    <header className="flex items-end justify-between gap-6 border-b border-secondary bg-primary px-8 pt-5 pb-5">
        <div className="flex flex-col gap-1">
            <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
            >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Punch Cards
            </button>
            <h1 className="text-xl font-semibold text-primary">{title}</h1>
        </div>
        <div className="flex gap-3">
            <Button color="secondary" size="md" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="md" isDisabled={!canSave} onClick={onSave}>
                Save Punch Card
            </Button>
        </div>
    </header>
);

/* -------------------------------------------------------------------------- */
/*  Details                                                                   */
/* -------------------------------------------------------------------------- */

export const DetailsCard = ({
    title,
    description,
    onTitle,
    onDescription,
}: {
    title: string;
    description: string;
    onTitle?: (value: string) => void;
    onDescription?: (value: string) => void;
}) => (
    <SectionCard title="Details">
        <Input label="Title" placeholder="e.g. Golf & Range Bundle" value={title} onChange={onTitle} isRequired hideRequiredIndicator />
        <TextArea label="Description" placeholder="What's included, shown to staff and on receipts." value={description} onChange={onDescription} rows={3} />
    </SectionCard>
);

/* -------------------------------------------------------------------------- */
/*  Punch card items                                                          */
/* -------------------------------------------------------------------------- */

/** One line on the card: kind, what it covers, punches, edit and remove. */
export const ItemRow = ({ item, readOnly, onEdit, onRemove }: { item: PunchItem; readOnly?: boolean; onEdit?: () => void; onRemove?: () => void }) => (
    <li className="flex items-center gap-4 px-4 py-3.5">
        <ItemTypeTile kind={item.kind} />
        <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold tracking-wider text-tertiary uppercase">{kindMeta(item.kind).label}</span>
            <span className="truncate text-md font-semibold text-primary">{itemLabel(item)}</span>
        </div>
        <span className="shrink-0 text-sm text-tertiary">
            <span className="text-lg font-semibold text-primary tabular-nums">{item.punches}</span> {punchesLabel(item.punches)}
        </span>
        {!readOnly && (
            <div className="flex shrink-0 gap-1">
                <Button color="tertiary" size="sm" iconLeading={Edit01} aria-label={`Edit ${itemLabel(item)}`} onClick={onEdit} />
                <Button color="tertiary" size="sm" iconLeading={Trash01} aria-label={`Remove ${itemLabel(item)}`} onClick={onRemove} />
            </div>
        )}
    </li>
);

export const ItemsCard = ({
    items,
    onAdd,
    onEdit,
    onRemove,
}: {
    items: PunchItem[];
    onAdd?: () => void;
    onEdit?: (item: PunchItem) => void;
    onRemove?: (item: PunchItem) => void;
}) => (
    <SectionCard
        title="Punch Card Items"
        description="What the customer can redeem with this card."
        aside={<span className="pt-1 text-sm text-tertiary">{items.length === 1 ? "1 item" : `${items.length} items`}</span>}
    >
        {items.length > 0 ? (
            <ul className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                {items.map((item) => (
                    <ItemRow key={item.id} item={item} onEdit={() => onEdit?.(item)} onRemove={() => onRemove?.(item)} />
                ))}
            </ul>
        ) : (
            <p className="rounded-xl bg-secondary px-4 py-6 text-center text-sm text-tertiary">
                No items yet. Add green fees, transportation, products, activities or clinics — as many as this card should include.
            </p>
        )}
        <button
            type="button"
            onClick={onAdd}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary py-4 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:bg-primary_hover"
        >
            <Plus className="size-5" aria-hidden="true" />
            Add Item
        </button>
    </SectionCard>
);

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

export const PricingCard = ({
    card,
    onChange,
}: {
    card: Pick<PunchCard, "price" | "tax" | "tax2">;
    onChange?: (patch: Partial<Pick<PunchCard, "price" | "tax" | "tax2">>) => void;
}) => {
    const totals = cardTotals(card);
    const rows: [string, number][] = [
        ["Tax", totals.tax],
        ["Tax 2", totals.tax2],
        ["Fees", totals.fees],
    ];
    return (
        <SectionCard title="Pricing">
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
            <dl className="flex flex-col gap-2 rounded-lg bg-secondary p-4 text-sm">
                {rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-tertiary">
                        <dt>{k}</dt>
                        <dd className="tabular-nums">{money(v)}</dd>
                    </div>
                ))}
                <div className="flex justify-between border-t border-secondary pt-2 font-semibold text-primary">
                    <dt>Grand Total</dt>
                    <dd className="text-brand-secondary tabular-nums">{money(totals.total)}</dd>
                </div>
            </dl>
        </SectionCard>
    );
};

/* -------------------------------------------------------------------------- */
/*  Expiration                                                                */
/* -------------------------------------------------------------------------- */

/** When unused punches stop working: never, N days after purchase, or on a date. */
export const ExpirationCard = ({ value, onChange, wide }: { value: Expiration; onChange?: (value: Expiration) => void; wide?: boolean }) => (
    <SectionCard title="Expiration" description="When unused punches on this card stop working.">
        <RadioGroup
            aria-label="Expiration"
            size="md"
            value={value.mode}
            onChange={(mode) => onChange?.({ ...value, mode: mode as Expiration["mode"] })}
            className={wide ? "grid items-start gap-6 lg:grid-cols-3" : undefined}
        >
            <RadioButton value="never" label="Never expires" hint="Punches stay good until they're used." size="md" />
            <div className="flex flex-col gap-3">
                <RadioButton value="days" label="After a number of days" hint="Counted from the day it's purchased." size="md" />
                {value.mode === "days" && (
                    <InputNumber
                        aria-label="Days after purchase"
                        size="sm"
                        minValue={1}
                        maxValue={3650}
                        value={value.days}
                        onChange={(days) => onChange?.({ ...value, days: Number.isNaN(days) ? 365 : days })}
                        formatOptions={{ style: "unit", unit: "day", unitDisplay: "long" }}
                        className="pl-8"
                        wrapperClassName="w-40"
                    />
                )}
            </div>
            <div className="flex flex-col gap-3">
                <RadioButton value="date" label="On a date" hint="Every card sold expires on the same day." size="md" />
                {value.mode === "date" && (
                    <Input
                        aria-label="Expiration date"
                        placeholder="MM/DD/YYYY"
                        value={value.date}
                        onChange={(date) => onChange?.({ ...value, date })}
                        className="pl-8"
                        wrapperClassName="w-44"
                    />
                )}
            </div>
        </RadioGroup>
    </SectionCard>
);

/* -------------------------------------------------------------------------- */
/*  Applicable courses                                                        */
/* -------------------------------------------------------------------------- */

export const CoursesCard = ({ selected, onChange, wide }: { selected: string[]; onChange?: (courses: string[]) => void; wide?: boolean }) => (
    <SectionCard title="Applicable Courses" description="Where every item on this card can be redeemed.">
        <div className={wide ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : "flex flex-col gap-4"}>
            {COURSES.map((course) => (
                <Checkbox
                    key={course}
                    size="md"
                    label={course}
                    isSelected={selected.includes(course)}
                    onChange={(on) => onChange?.(on ? [...selected, course] : selected.filter((c) => c !== course))}
                />
            ))}
        </div>
    </SectionCard>
);
