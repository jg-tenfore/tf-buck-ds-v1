"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { AlertTriangle, ChevronDown, DotsHorizontal, Download01, Image01, List, Plus, Trash01, UploadCloud02, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { CreditsHeader } from "../credits-oct-27/kit";
import { money } from "../migration-v2/data";
import { ScreenModal, ScreenShell, type ScreenTab, TabStrip } from "../migration-v2/kit";

export {
    BalanceStrip,
    Facts,
    NOW,
    RecordBody,
    type RecordSection,
    STAFF,
    STd,
    STh,
    SavedNote,
    SectionCard,
    SectionEmpty,
    SectionTable,
    type SubTabMode,
    UnsavedChangesModal,
    useRecordTabs,
    useReportDirty,
} from "../credits-oct-27/kit";

export type IconType = FC<{ className?: string }>;

/* -------------------------------------------------------------------------- */
/*  Actions: primary + secondary, collapsing into an Actions menu             */
/* -------------------------------------------------------------------------- */

/** One action on a page or a record. `items` makes it a menu (Export ▾). */
export type PageAction = {
    id: string;
    label: string;
    icon?: IconType;
    onAction?: () => void;
    isDisabled?: boolean;
    destructive?: boolean;
    items?: PageAction[];
};

/** Up to this many buttons show side by side; past it, the secondary actions move into an Actions menu next to the primary. */
export const MAX_VISIBLE_ACTIONS = 3;

/**
 * A dropdown button. Actions that carry their own `items` (Export) become a
 * labeled section inside it.
 */
export const ActionsMenu = ({ label = "Actions", icon, actions }: { label?: string; icon?: IconType; actions: PageAction[] }) => {
    const plain = actions.filter((a) => !a.items && !a.destructive);
    const groups = actions.filter((a) => a.items);
    const destructive = actions.filter((a) => a.destructive && !a.items);
    const item = (a: PageAction) => (
        <Dropdown.Item
            key={a.id}
            id={a.id}
            textValue={a.label}
            label={a.label}
            icon={a.icon}
            isDisabled={a.isDisabled}
            onAction={a.onAction}
            className={a.destructive ? "[&_span]:text-error-primary [&_svg]:text-fg-error-secondary" : undefined}
        />
    );
    return (
        <Dropdown.Root>
            <Button color="secondary" size="md" iconLeading={icon ?? (label === "Actions" ? DotsHorizontal : undefined)} iconTrailing={ChevronDown}>
                {label}
            </Button>
            <Dropdown.Popover className="w-64">
                <Dropdown.Menu aria-label={label}>
                    {plain.length > 0 && <Dropdown.Section>{plain.map(item)}</Dropdown.Section>}
                    {groups.map((g, i) => (
                        <Dropdown.Section key={g.id} aria-label={g.label}>
                            {(plain.length > 0 || i > 0) && <Dropdown.Separator />}
                            <Dropdown.SectionHeader className="px-4 pt-2 pb-1 text-xs font-semibold text-tertiary">{g.label}</Dropdown.SectionHeader>
                            {g.items!.map(item)}
                        </Dropdown.Section>
                    ))}
                    {destructive.length > 0 && (
                        <Dropdown.Section>
                            <Dropdown.Separator />
                            {destructive.map(item)}
                        </Dropdown.Section>
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

const ActionButton = ({ action }: { action: PageAction }) =>
    action.items ? (
        <ActionsMenu label={action.label} icon={action.icon} actions={action.items} />
    ) : (
        <Button
            color={action.destructive ? "secondary-destructive" : "secondary"}
            size="md"
            iconLeading={action.icon}
            isDisabled={action.isDisabled}
            onClick={action.onAction}
        >
            {action.label}
        </Button>
    );

/**
 * A page's global actions, top right: the primary action last. With more than
 * three actions, every secondary one moves into an Actions menu beside it.
 */
export const ActionBar = ({ primary, secondary = [] }: { primary?: PageAction; secondary?: PageAction[] }) => {
    const collapse = secondary.length + (primary ? 1 : 0) > MAX_VISIBLE_ACTIONS;
    return (
        <div className="flex flex-wrap items-center gap-3">
            {collapse ? <ActionsMenu actions={secondary} /> : secondary.map((a) => <ActionButton key={a.id} action={a} />)}
            {primary && (
                <Button size="md" iconLeading={primary.icon ?? Plus} isDisabled={primary.isDisabled} onClick={primary.onAction}>
                    {primary.label}
                </Button>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Page: header + tabs                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A Products page: Global Nav, the new header (breadcrumbs, title + Beta,
 * description, actions) and the tab strip. Lists are the first tabs (most
 * pages have one; Modifiers has two); records open beside them as closable tabs.
 */
export const ProductsPage = ({
    navId,
    crumbs,
    title,
    description,
    primary,
    secondary,
    lists = [{ id: "list", label: "List" }],
    tabs = [],
    activeId = "list",
    onSelect = () => {},
    onClose = () => {},
    children,
}: {
    navId: string;
    crumbs: string[];
    title: string;
    description: string;
    primary?: PageAction;
    secondary?: PageAction[];
    /** The list tabs, always first. Pass [] for a page with no tab strip (Rewards, Price Stickers). */
    lists?: ScreenTab[];
    tabs?: ScreenTab[];
    activeId?: string;
    onSelect?: (id: string) => void;
    onClose?: (id: string) => void;
    children: ReactNode;
}) => (
    <ScreenShell
        nav={{ activeId: navId, scrollToActive: true }}
        title={title}
        description={description}
        header={
            <CreditsHeader
                crumbs={crumbs}
                title={title}
                description={description}
                actions={primary || secondary?.length ? <ActionBar primary={primary} secondary={secondary} /> : undefined}
            />
        }
        tabs={
            lists.length || tabs.length ? (
                <TabStrip
                    tabs={[...lists.map((l) => ({ icon: List, ...l })), ...tabs.map((t) => ({ ...t, closable: true }))]}
                    activeId={activeId}
                    onSelect={onSelect}
                    onClose={onClose}
                />
            ) : undefined
        }
    >
        {children}
    </ScreenShell>
);

/* -------------------------------------------------------------------------- */
/*  Record header                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Top of a record's tab: what it is on the left; Cancel and Save on the right
 * (always at the top). One extra action shows as a button before Cancel; with
 * more, they move into an Actions menu right next to Save.
 */
export const RecordHeader = ({
    eyebrow,
    title,
    meta,
    saveLabel = "Save changes",
    canSave,
    onCancel,
    onSave,
    actions = [],
}: {
    eyebrow?: ReactNode;
    title: string;
    meta?: ReactNode;
    saveLabel?: string;
    canSave: boolean;
    onCancel: () => void;
    onSave: () => void;
    actions?: PageAction[];
}) => {
    const collapse = actions.length + 2 > MAX_VISIBLE_ACTIONS;
    return (
        <header className="flex flex-wrap items-end justify-between gap-6 pb-1">
            <div className="flex min-w-0 flex-col gap-1">
                {eyebrow && <div className="flex items-center gap-2 text-xs font-medium text-tertiary">{eyebrow}</div>}
                <h1 className="text-xl font-semibold text-primary">{title}</h1>
                {meta && <div className="text-sm text-tertiary">{meta}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {!collapse && actions.map((a) => <ActionButton key={a.id} action={a} />)}
                <Button color="secondary" size="md" onClick={onCancel}>
                    Cancel
                </Button>
                {collapse && <ActionsMenu actions={actions} />}
                <Button size="md" isDisabled={!canSave} onClick={onSave}>
                    {saveLabel}
                </Button>
            </div>
        </header>
    );
};

/** "Delete Premium Vodka – Bottle?" Destructive actions always confirm first. */
export const ConfirmDeleteModal = ({
    isOpen,
    what,
    detail,
    onCancel,
    onConfirm,
}: {
    isOpen: boolean;
    what: string;
    detail?: string;
    onCancel: () => void;
    onConfirm: () => void;
}) => (
    <ScreenModal
        title={`Delete ${what}?`}
        isOpen={isOpen}
        onClose={onCancel}
        footer={
            <>
                <Button color="secondary" size="md" onClick={onCancel}>
                    Keep it
                </Button>
                <Button color="primary-destructive" size="md" iconLeading={Trash01} onClick={onConfirm}>
                    Delete
                </Button>
            </>
        }
    >
        <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-error-secondary">
                <AlertTriangle className="size-5 text-fg-error-primary" aria-hidden="true" />
            </span>
            <p className="text-sm text-secondary">{detail ?? "This can't be undone."}</p>
        </div>
    </ScreenModal>
);

/* -------------------------------------------------------------------------- */
/*  Fields                                                                    */
/* -------------------------------------------------------------------------- */

/** Fields in a responsive grid (one column on narrow screens). */
export const FieldGrid = ({ cols = 2, children }: { cols?: 2 | 3 | 4; children: ReactNode }) => (
    <div className={cx("grid gap-5", cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4")}>{children}</div>
);

/** A NativeSelect over plain strings. */
export const SelectField = ({
    label,
    value,
    onChange,
    options,
    hint,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: (string | { value: string; label: string })[];
    hint?: string;
}) => (
    <NativeSelect
        label={label}
        hint={hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))}
    />
);

/** On/off settings as bordered rows in a grid, each with an optional hint. */
export const ToggleGrid = ({
    items,
    values,
    onChange,
    cols = 2,
}: {
    items: readonly { id: string; label: string; hint?: string }[];
    values: Record<string, boolean>;
    onChange: (id: string, on: boolean) => void;
    cols?: 2 | 3;
}) => (
    <div className={cx("grid gap-3", cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {items.map((item) => (
            <div key={item.id} className="rounded-lg p-4 ring-1 ring-secondary">
                <Toggle label={item.label} hint={item.hint} isSelected={Boolean(values[item.id])} onChange={(on) => onChange(item.id, on)} />
            </div>
        ))}
    </div>
);

/** Several picks from a list, as removable chips plus an "Add…" picker. */
export const TokenField = ({
    label,
    hint,
    value,
    options,
    onChange,
    placeholder = "Add…",
}: {
    label: string;
    hint?: string;
    value: string[];
    options: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
}) => {
    const left = options.filter((o) => !value.includes(o));
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">{label}</span>
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg bg-primary px-2.5 py-2 shadow-xs ring-1 ring-primary ring-inset">
                {value.map((v) => (
                    <span
                        key={v}
                        className="flex items-center gap-1 rounded-md bg-primary py-0.5 pr-1 pl-2 text-sm font-medium text-secondary ring-1 ring-primary ring-inset"
                    >
                        {v}
                        <button
                            type="button"
                            aria-label={`Remove ${v}`}
                            onClick={() => onChange(value.filter((x) => x !== v))}
                            className="flex size-4 cursor-pointer items-center justify-center rounded text-fg-quaternary hover:text-fg-quaternary_hover"
                        >
                            <XClose className="size-3" />
                        </button>
                    </span>
                ))}
                {left.length > 0 && (
                    <select
                        aria-label={`Add to ${label}`}
                        value=""
                        onChange={(e) => e.target.value && onChange([...value, e.target.value])}
                        className="min-w-24 flex-1 cursor-pointer bg-transparent text-sm text-placeholder outline-hidden"
                    >
                        <option value="">{placeholder}</option>
                        {left.map((o) => (
                            <option key={o} value={o}>
                                {o}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            {hint && <span className="text-sm text-tertiary">{hint}</span>}
        </div>
    );
};

/** Price, taxes and fees adding up to a grand total, read-only, beside or below the inputs. */
export const PriceSummary = ({ lines, total, label = "Grand total" }: { lines: [string, number][]; total: number; label?: string }) => (
    <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
        <div className="bg-secondary px-4 py-3">
            <p className="text-xs font-semibold tracking-wider text-tertiary uppercase">{label}</p>
            <p className="mt-0.5 text-display-xs font-semibold text-primary tabular-nums">{money(total)}</p>
        </div>
        <dl className="divide-y divide-secondary text-sm">
            {lines.map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2.5">
                    <dt className="text-tertiary">{k}</dt>
                    <dd className="font-medium text-primary tabular-nums">{money(v)}</dd>
                </div>
            ))}
        </dl>
    </div>
);

/** An image slot with Upload / Remove. */
export const ImageField = ({ label = "Image", hint = "PNG or JPG, at least 400 × 400." }: { label?: string; hint?: string }) => {
    const [has, setHas] = useState(false);
    return (
        <div className="flex items-center gap-5">
            <div className="flex size-28 shrink-0 items-center justify-center rounded-xl bg-secondary ring-1 ring-secondary">
                <Image01 className={cx("size-8", has ? "text-fg-brand-secondary" : "text-fg-quaternary")} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-secondary">{label}</span>
                <span className="text-sm text-tertiary">{has ? "image.png · 640 × 640" : hint}</span>
                <div className="flex gap-2">
                    <Button color="secondary" size="sm" iconLeading={UploadCloud02} onClick={() => setHas(true)}>
                        {has ? "Replace" : "Upload"}
                    </Button>
                    {has && (
                        <Button color="tertiary" size="sm" onClick={() => setHas(false)}>
                            Remove
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

/** Sun–Sat as pill toggles. */
export const DaysPicker = ({ days, value, onChange }: { days: string[]; value: string[]; onChange: (v: string[]) => void }) => (
    <div className="flex flex-col gap-3">
        <div role="group" aria-label="Days" className="flex flex-wrap gap-2">
            {days.map((d) => {
                const on = value.includes(d);
                return (
                    <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange(on ? value.filter((x) => x !== d) : days.filter((x) => x === d || value.includes(x)))}
                        className={cx(
                            "h-10 min-w-14 cursor-pointer rounded-lg px-3 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                            on ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-primary hover:bg-primary_hover",
                        )}
                    >
                        {d}
                    </button>
                );
            })}
        </div>
        <div className="flex gap-3 text-sm">
            <button type="button" className="cursor-pointer font-medium text-brand-secondary hover:underline" onClick={() => onChange([...days])}>
                Every day
            </button>
            <button type="button" className="cursor-pointer font-medium text-brand-secondary hover:underline" onClick={() => onChange(days.slice(1, 6))}>
                Weekdays
            </button>
            <button type="button" className="cursor-pointer font-medium text-tertiary hover:underline" onClick={() => onChange([])}>
                Clear
            </button>
        </div>
    </div>
);

/** Row icon buttons (edit / delete) at the end of a table row. */
export const RowIconButton = ({ label, icon: Icon, onClick, destructive }: { label: string; icon: IconType; onClick?: () => void; destructive?: boolean }) => (
    <button
        type="button"
        aria-label={label}
        onClick={(e) => {
            e.stopPropagation();
            onClick?.();
        }}
        className={cx(
            "flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover",
            destructive ? "hover:text-fg-error-secondary" : "hover:text-fg-quaternary_hover",
        )}
    >
        <Icon className="size-4" />
    </button>
);

/** "Premium Vodka – Bottle saved." / "Copied to Schule Oaks." */
export const Toast = ({ message, onDismiss }: { message: string | null; onDismiss: () => void }) =>
    message ? (
        <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl bg-success-primary px-4 py-3 text-sm text-primary ring-1 ring-fg-success-secondary ring-inset"
        >
            {message}
            <button type="button" aria-label="Dismiss" onClick={onDismiss} className="cursor-pointer text-fg-quaternary">
                <XClose className="size-4" />
            </button>
        </div>
    ) : null;

/** The Export ▾ menu every list offers. */
export const exportAction = (what: string): PageAction => ({
    id: "export",
    label: "Export",
    icon: Download01,
    items: [
        { id: "xlsx", label: "Excel (.xlsx)" },
        { id: "csv", label: "CSV" },
        { id: "pdf", label: "PDF" },
        { id: "clipboard", label: `Copy ${what} to clipboard` },
        { id: "print", label: "Print" },
    ],
});
