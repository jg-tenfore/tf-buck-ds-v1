"use client";

import type { FC, ReactNode, TdHTMLAttributes } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Edit01, Lock01, PlusCircle, Save01, Trash01, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import type { Option } from "./course-settings-data";
import { SearchScope, Searchable } from "./settings-search";

/* -------------------------------------------------------------------------- */
/*  Accordion section                                                         */
/* -------------------------------------------------------------------------- */

interface SettingsSectionProps {
    id: string;
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
    isOpen: boolean;
    onToggle: () => void;
    /** "save" = sticky Save bar, "locked" = Save bar shown but disabled, "none" = list-only section. */
    footer?: "save" | "locked" | "none";
    children: ReactNode;
}

/** One collapsible settings card: icon tile, title + description, chevron, and a sticky Save bar. */
export const SettingsSection = ({ id, icon: Icon, title, description, isOpen, onToggle, footer = "save", children }: SettingsSectionProps) => {
    const panelId = `${id}-panel`;

    return (
        <section id={id} data-search-section="" className="scroll-mt-24 rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <h2>
                <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={onToggle}
                    className={cx(
                        "flex w-full cursor-pointer items-center gap-4 rounded-xl px-5 py-4 text-left outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                        isOpen && "rounded-b-none border-b border-secondary",
                    )}
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-fg-secondary">
                        <Icon className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-md font-semibold text-primary">{title}</span>
                        <span className="text-sm text-tertiary">{description}</span>
                    </span>
                    <ChevronDown
                        aria-hidden="true"
                        className={cx("size-5 shrink-0 text-fg-quaternary transition-transform duration-150 ease-linear", isOpen && "rotate-180")}
                    />
                </button>
            </h2>

            {isOpen && (
                <div id={panelId} role="region" aria-label={title}>
                    <SearchScope section={{ id, title, icon: Icon }}>
                        <div className="flex flex-col divide-y divide-secondary px-5">{children}</div>
                    </SearchScope>
                    {footer !== "none" && <SaveBar isDisabled={footer === "locked"} />}
                </div>
            )}
        </section>
    );
};

/** Sticky footer Save button — stays pinned to the viewport bottom while the card scrolls. */
export const SaveBar = ({ isDisabled }: { isDisabled?: boolean }) => (
    <div className="sticky bottom-0 z-10 flex justify-end rounded-b-xl border-t border-secondary bg-primary px-5 py-4">
        <SaveButton isDisabled={isDisabled} />
    </div>
);

/** Save button with a brief saving → saved confirmation so the prototype feels live. */
export const SaveButton = ({ isDisabled }: { isDisabled?: boolean }) => {
    const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const save = () => {
        setState("saving");
        timer.current = setTimeout(() => {
            setState("saved");
            timer.current = setTimeout(() => setState("idle"), 1600);
        }, 700);
    };

    return (
        <Button
            size="md"
            iconLeading={state === "saved" ? Check : Save01}
            isDisabled={isDisabled}
            isLoading={state === "saving"}
            showTextWhileLoading
            onClick={save}
        >
            {state === "saved" ? "Saved" : "Save"}
        </Button>
    );
};

/* -------------------------------------------------------------------------- */
/*  Section groups & layout                                                   */
/* -------------------------------------------------------------------------- */

interface GroupProps {
    title?: string;
    description?: string;
    /** Help tooltip shown as an info icon beside the heading. */
    tooltip?: string;
    /** Right-aligned header content, e.g. a "New" action. */
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

/** A titled block inside a section (IDENTITY, ADDRESS, …). Groups are separated by dividers. */
export const Group = ({ title, description, tooltip, action, children, className }: GroupProps) => (
    <div data-search-group="" className={cx("flex flex-col gap-4 py-6", className)}>
        {(title || action) && (
            <div data-search-heading="" className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    {title && (
                        <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-secondary uppercase">
                            {title}
                            {tooltip && (
                                <span
                                    title={tooltip}
                                    className="inline-flex size-4 items-center justify-center rounded-full bg-fg-quaternary text-[10px] font-bold text-white normal-case"
                                >
                                    i
                                </span>
                            )}
                        </h3>
                    )}
                    {description && <p className="text-sm text-tertiary">{description}</p>}
                </div>
                {action}
            </div>
        )}
        <SearchScope title={title}>{children}</SearchScope>
    </div>
);

/** Column count for FieldGrid — the legacy screen uses 3; narrower concept layouts use 2. */
export const FieldGridColumns = createContext<2 | 3>(3);

/** The legacy screen's multi-column field grid. */
export const FieldGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
    const columns = useContext(FieldGridColumns);
    return <div className={cx("grid grid-cols-1 gap-x-6 gap-y-5", columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2", className)}>{children}</div>;
};

/* -------------------------------------------------------------------------- */
/*  Fields                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Lock treatments carried over from the legacy screen:
 * - `readonly` — gray padlock: visible and readable, not editable here.
 * - `admin` — red person-with-padlock: only a TenFore administrator can change it.
 */
export type LockKind = "readonly" | "admin";

export const AdminLockIcon = ({ className }: { className?: string }) => (
    <span className={cx("relative inline-flex size-5 text-fg-error-secondary", className)} aria-hidden="true">
        <User01 className="size-4" />
        <Lock01 className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-sm bg-primary" />
    </span>
);

const LockAdornment = ({ lock }: { lock: LockKind }) => (
    <span
        className="pointer-events-none absolute right-3 bottom-0 flex h-10 items-center"
        title={lock === "admin" ? "Editable only by TenFore administrators" : "Read-only"}
    >
        {lock === "admin" ? <AdminLockIcon /> : <Lock01 className="size-4 text-fg-quaternary" aria-hidden="true" />}
    </span>
);

interface TextFieldProps {
    label: string;
    value?: string;
    placeholder?: string;
    tooltip?: string;
    lock?: LockKind;
    /** Trailing unit/icon inside the field, e.g. a percent sign. */
    trailing?: ReactNode;
    type?: string;
    className?: string;
}

/** Labeled text input on the DS `Input`, with optional lock/trailing adornments. */
export const TextField = ({ label, value, placeholder, tooltip, lock, trailing, type, className }: TextFieldProps) => (
    <Searchable label={label} className={cx("relative", className)}>
        {tooltip ? (
            <div className="flex flex-col gap-1.5">
                <Label tooltip={tooltip}>{label}</Label>
                <Input
                    aria-label={label}
                    defaultValue={value}
                    placeholder={placeholder}
                    type={type}
                    isReadOnly={lock === "readonly"}
                    isDisabled={lock === "admin"}
                    inputClassName={cx((lock || trailing) && "pr-10")}
                />
            </div>
        ) : (
            <Input
                label={label}
                defaultValue={value}
                placeholder={placeholder}
                type={type}
                isReadOnly={lock === "readonly"}
                isDisabled={lock === "admin"}
                inputClassName={cx((lock || trailing) && "pr-10")}
            />
        )}
        {lock && <LockAdornment lock={lock} />}
        {!lock && trailing && <span className="pointer-events-none absolute right-3 bottom-0 flex h-10 items-center text-fg-quaternary">{trailing}</span>}
    </Searchable>
);

interface SelectFieldProps {
    label: string;
    options: Option[];
    value?: string;
    placeholder?: string;
    tooltip?: string;
    className?: string;
}

/** Labeled dropdown on the DS `Select`. */
export const SelectField = ({ label, options, value, placeholder = "Select", tooltip, className }: SelectFieldProps) => {
    // Make sure the recorded value is always selectable, even if it isn't in the canned list.
    const items = value && !options.some((o) => o.id === value) ? [{ id: value, label: value }, ...options] : options;

    return (
        <Searchable label={label} className={className}>
            <Select label={label} tooltip={tooltip} placeholder={placeholder} items={items} defaultSelectedKey={value || undefined}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </Searchable>
    );
};

/** DS `Select` bound to state — for the inline "add row" forms (Links, Sub-courses). */
export const ControlledSelect = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}) => (
    <Select label={label} items={options} selectedKey={value} onSelectionChange={(key) => key != null && onChange(String(key))}>
        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
    </Select>
);

/** Time input on the DS `Input` (the native time picker keeps the prototype simple). */
export const TimeField = ({ label, value }: { label: string; value: string }) => (
    <Searchable label={label}>
        <Input label={label} type="time" defaultValue={value} />
    </Searchable>
);

/** A switch that sits under its own label, like a form field (Enable Notify Only, …). */
export const ToggleField = ({ label, tooltip, defaultSelected, lock }: { label: string; tooltip?: string; defaultSelected?: boolean; lock?: LockKind }) => (
    <Searchable label={label} className="flex flex-col gap-3">
        <Label tooltip={tooltip}>{label}</Label>
        <div className="flex items-center justify-between gap-3">
            <Toggle aria-label={label} size="md" defaultSelected={defaultSelected} isDisabled={Boolean(lock)} />
            {lock && (lock === "admin" ? <AdminLockIcon /> : <Lock01 className="size-4 text-fg-quaternary" aria-hidden="true" />)}
        </div>
    </Searchable>
);

/** Color swatch field (Branding). Opens the native color picker. */
export const ColorField = ({ label, value }: { label: string; value: string }) => {
    const [color, setColor] = useState(value);

    return (
        <Searchable as="label" label={label} className="flex flex-col gap-1.5">
            <span data-label="" className="text-sm font-medium text-secondary">
                {label}
            </span>
            <span className="relative flex h-10 cursor-pointer items-center rounded-lg bg-primary px-3 shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand">
                <span className="h-3 w-full rounded-sm" style={{ backgroundColor: color }} />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={label}
                />
            </span>
        </Searchable>
    );
};

/* -------------------------------------------------------------------------- */
/*  Toggle lists                                                              */
/* -------------------------------------------------------------------------- */

export interface ToggleItem {
    label: string;
    description?: string;
    on: boolean;
}

/** "list" = the legacy one-setting-per-row list; "grid" = compact two-column switches (concept 3). */
export const ToggleListVariant = createContext<"list" | "grid">("list");

/** Bordered list of on/off settings — the legacy screen's most common pattern. */
export const ToggleList = ({ items, lock }: { items: ToggleItem[]; lock?: LockKind }) => {
    const variant = useContext(ToggleListVariant);

    if (variant === "grid") {
        return (
            <div data-search-container="" className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                {items.map((item) => (
                    <Searchable key={item.label} label={item.label} className="flex items-start gap-3 rounded-md py-2">
                        <Toggle aria-label={item.label} size="sm" defaultSelected={item.on} isDisabled={Boolean(lock)} className="mt-0.5" />
                        <div className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-secondary">{item.label}</span>
                            {item.description && <span className="text-xs text-tertiary">{item.description}</span>}
                        </div>
                        {lock && <Lock01 className="mt-0.5 ml-auto size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                    </Searchable>
                ))}
            </div>
        );
    }

    return (
        <div data-search-container="" className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
            {items.map((item) => (
                <Searchable key={item.label} label={item.label} className="flex items-center justify-between gap-6 px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-primary">{item.label}</span>
                        {item.description && <span className="text-sm text-tertiary">{item.description}</span>}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Toggle aria-label={item.label} size="md" defaultSelected={item.on} isDisabled={Boolean(lock)} />
                        {lock && <Lock01 className="size-4 text-fg-quaternary" aria-hidden="true" />}
                    </div>
                </Searchable>
            ))}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Tables                                                                    */
/* -------------------------------------------------------------------------- */

/** Rounded table frame with a gray header row. Scrolls horizontally when columns overflow. */
export const TableFrame = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div data-search-container="" className={cx("overflow-x-auto rounded-xl ring-1 ring-secondary", className)}>
        <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
);

/** A findable table row. `label` is what the search results list shows for it. */
export const Tr = ({ label, keywords, children }: { label: string; keywords?: string; children: ReactNode }) => (
    <Searchable as="tr" label={label} keywords={keywords}>
        {children}
    </Searchable>
);

export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cx("bg-secondary px-5 py-3 text-xs font-semibold tracking-wider whitespace-nowrap text-tertiary uppercase", className)}>{children}</th>
);

export const Td = ({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...rest} className={cx("border-t border-secondary px-5 py-4 align-middle text-secondary", className)}>
        {children}
    </td>
);

/** Filled green check used for yes/true cells. */
export const Yes = ({ label = "Yes" }: { label?: string }) => (
    <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-solid" role="img" aria-label={label}>
        <Check className="size-3 text-white" strokeWidth={3} />
    </span>
);

/** Em dash used for empty / false cells. */
export const Dash = () => (
    <span className="text-quaternary" aria-label="None">
        —
    </span>
);

export const YesNo = ({ value }: { value: boolean }) => (value ? <Yes /> : <Dash />);

/** Edit + delete icon pair at the end of a row. */
export const RowActions = ({ onDelete, hideEdit }: { onDelete?: () => void; hideEdit?: boolean }) => (
    <div className="flex items-center justify-end gap-1">
        {!hideEdit && <ButtonUtility color="tertiary" size="xs" tooltip="Edit" icon={Edit01} />}
        <ButtonUtility color="tertiary" size="xs" tooltip="Delete" icon={Trash01} onClick={onDelete} />
    </div>
);

/** Green "+ New" link-button used above tables. */
export const NewAction = ({ label = "New", onClick }: { label?: string; onClick?: () => void }) => (
    <Button color="link-color" size="md" iconLeading={PlusCircle} onClick={onClick}>
        {label}
    </Button>
);
