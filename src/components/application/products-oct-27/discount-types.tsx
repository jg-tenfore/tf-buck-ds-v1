"use client";

import { useState } from "react";
import { Check, Edit05, Tag01, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import { LinkText, TableCard, Td, Th } from "../migration-v2/kit";
import { ACCOUNTING_CATEGORIES, DISCOUNT_TYPES, type DiscountKind, type DiscountType, PRODUCTS_NAV } from "./data";
import { ConfirmDeleteModal, ProductsPage, RecordBody, RecordHeader, RowIconButton, Toast, ToggleGrid, useRecordTabs, useReportDirty } from "./kit";

const KINDS: { id: DiscountKind; label: string; hint: string; prefix?: string; suffix?: string }[] = [
    { id: "percent", label: "Percent off", hint: "Takes a percentage off the price.", suffix: "%" },
    { id: "costPlus", label: "Cost plus", hint: "Sells at cost plus a percentage.", suffix: "%" },
    { id: "amount", label: "Dollar amount", hint: "Takes a fixed amount off.", prefix: "$" },
];

/** "10%" / "Cost + 15%" / "$25.00". */
export const discountLabel = (d: Pick<DiscountType, "kind" | "value">) =>
    d.kind === "percent" ? `${d.value}% off` : d.kind === "costPlus" ? `Cost + ${d.value}%` : `${money(d.value)} off`;

/**
 * One discount type in its tab. Today's three amount fields ("enter a value
 * in exactly one") become one choice of kind plus a single amount.
 */
export const DiscountTypeRecord = ({
    discount,
    isNew,
    onCancel,
    onDirtyChange,
    onSaved,
    onDelete,
}: {
    discount: DiscountType;
    isNew?: boolean;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (d: DiscountType) => void;
    onDelete: () => void;
}) => {
    const toForm = (d: DiscountType) => ({ ...d, valueText: d.value ? String(d.value) : "" });
    const [saved, setSaved] = useState(() => toForm(discount));
    const [form, setForm] = useState(() => toForm(discount));
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);
    const value = Number(form.valueText) || 0;
    const kind = KINDS.find((k) => k.id === form.kind)!;
    const allOn = ACCOUNTING_CATEGORIES.every((c) => form.categories.includes(c));

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New discount type
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Discount type</>
                    )
                }
                title={form.description || "New discount type"}
                meta={`${value ? discountLabel({ kind: form.kind, value }) : "No amount yet"} · ${allOn ? "all categories" : `${form.categories.length} categories`}${form.approval ? " · manager approval" : ""}`}
                saveLabel={isNew ? "Create discount" : "Save changes"}
                canSave={dirty && Boolean(form.description.trim() && value > 0 && form.categories.length)}
                onCancel={onCancel}
                onSave={() => {
                    const next = { ...form, value, id: form.id || Date.now() };
                    setForm(next);
                    setSaved(next);
                    onSaved(next);
                    setMessage(isNew ? `${next.description} created.` : `Changes to ${next.description} saved.`);
                }}
                actions={isNew ? [] : [{ id: "delete", label: "Delete", icon: Trash01, destructive: true, onAction: () => setConfirmDelete(true) }]}
            />
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <RecordBody
                mode="sections"
                tabs={[{ id: "all", label: "All" }]}
                sections={[
                    {
                        id: "details",
                        tab: "all",
                        title: "Details",
                        description: "The name staff pick at the point of sale.",
                        content: (
                            <div className="max-w-xl">
                                <Input
                                    label="Description"
                                    isRequired
                                    placeholder="e.g. Senior"
                                    value={form.description}
                                    onChange={(v) => set({ description: v })}
                                />
                            </div>
                        ),
                    },
                    {
                        id: "amount",
                        tab: "all",
                        title: "Amount",
                        description: "Pick how the discount works, then the amount.",
                        content: (
                            <>
                                <div role="radiogroup" aria-label="Discount kind" className="grid gap-3 sm:grid-cols-3">
                                    {KINDS.map((k) => (
                                        <button
                                            key={k.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={form.kind === k.id}
                                            onClick={() => set({ kind: k.id })}
                                            className={cx(
                                                "flex cursor-pointer gap-3 rounded-xl p-4 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                                form.kind === k.id ? "bg-brand-primary_alt ring-2 ring-brand" : "ring-secondary hover:bg-primary_hover",
                                            )}
                                        >
                                            <span
                                                className={cx(
                                                    "mt-0.5 size-4 shrink-0 rounded-full ring-1 ring-primary ring-inset",
                                                    form.kind === k.id && "bg-brand-solid ring-4 ring-bg-brand-solid",
                                                )}
                                            />
                                            <span>
                                                <span className="block text-sm font-semibold text-primary">{k.label}</span>
                                                <span className="block text-sm text-tertiary">{k.hint}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex max-w-xs items-end gap-2">
                                    {kind.prefix && <span className="pb-2.5 text-md font-medium text-tertiary">{kind.prefix}</span>}
                                    <div className="flex-1">
                                        <Input
                                            label={
                                                kind.id === "amount" ? "Dollar amount" : kind.id === "costPlus" ? "Cost plus percentage" : "Discount percentage"
                                            }
                                            inputMode="decimal"
                                            placeholder={kind.id === "amount" ? "5.00" : kind.id === "costPlus" ? "15" : "20"}
                                            value={form.valueText}
                                            onChange={(v) => set({ valueText: v })}
                                        />
                                    </div>
                                    {kind.suffix && <span className="pb-2.5 text-md font-medium text-tertiary">{kind.suffix}</span>}
                                </div>
                            </>
                        ),
                    },
                    {
                        id: "approval",
                        tab: "all",
                        title: "Approval",
                        content: (
                            <Toggle
                                label="Manager approval required"
                                hint="A manager has to enter their PIN before staff can apply it."
                                isSelected={form.approval}
                                onChange={(on) => set({ approval: on })}
                            />
                        ),
                    },
                    {
                        id: "categories",
                        tab: "all",
                        title: "Product Categories",
                        description: "Which accounting categories the discount can be applied to.",
                        aside: (
                            <button
                                type="button"
                                className="cursor-pointer text-sm font-semibold text-brand-secondary hover:underline"
                                onClick={() => set({ categories: allOn ? [] : [...ACCOUNTING_CATEGORIES] })}
                            >
                                {allOn ? "Clear all" : "Select all"}
                            </button>
                        ),
                        content: (
                            <ToggleGrid
                                cols={3}
                                items={ACCOUNTING_CATEGORIES.map((c) => ({ id: c, label: c }))}
                                values={Object.fromEntries(form.categories.map((c) => [c, true]))}
                                onChange={(id, on) =>
                                    set({
                                        categories: on
                                            ? ACCOUNTING_CATEGORIES.filter((c) => c === id || form.categories.includes(c))
                                            : form.categories.filter((c) => c !== id),
                                    })
                                }
                            />
                        ),
                    },
                ]}
            />
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.description}
                detail="Staff can't apply it anymore. Past orders keep the discount."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

type Tab = { key: string; discount: DiscountType; isNew?: boolean };
let drafts = 0;
const blankDiscount = (): DiscountType => ({ id: 0, description: "", kind: "percent", value: 0, approval: false, categories: [] });

/** Products › Discount Types: the list, and each discount type in its own tab. */
export const DiscountTypesPage = ({ initialOpen = [] }: { initialOpen?: (number | "new")[] }) => {
    const [rows, setRows] = useState(DISCOUNT_TYPES);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((id) =>
            id === "new"
                ? { key: `new-${++drafts}`, discount: blankDiscount(), isNew: true }
                : { key: `d-${id}`, discount: DISCOUNT_TYPES.find((d) => d.id === id)! },
        ),
    );
    const [deleting, setDeleting] = useState<DiscountType | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const remove = (d: DiscountType) => {
        setRows((all) => all.filter((x) => x.id !== d.id));
        if (tabs.tabs.some((t) => t.key === `d-${d.id}`)) tabs.forceClose(`d-${d.id}`);
        setMessage(`${d.description} deleted.`);
    };
    const cell = (d: DiscountType, kind: DiscountKind) =>
        d.kind === kind ? kind === "amount" ? money(d.value) : `${d.value}%` : <span className="text-quaternary">—</span>;

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.discountTypes}
            crumbs={["Products", "Discount Types"]}
            title="Discount Types"
            description="The discounts staff can apply at the point of sale."
            primary={{ id: "add", label: "Add discount type", onAction: () => tabs.open({ key: `new-${++drafts}`, discount: blankDiscount(), isNew: true }) }}
            lists={[{ id: "list", label: "Discount types" }]}
            tabs={tabs.tabs.map((t) => ({
                id: t.key,
                label: t.discount.description || "New discount type",
                sublabel: t.isNew ? "Draft" : undefined,
                icon: Tag01,
            }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={tabs.active === "list" ? undefined : "hidden"}>
                <TableCard>
                    <thead>
                        <tr>
                            <Th>Description</Th>
                            <Th className="text-right">Discount %</Th>
                            <Th className="text-right">Cost plus %</Th>
                            <Th className="text-right">$ Amount</Th>
                            <Th className="text-center">Approval required</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((d) => (
                            <tr key={d.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: `d-${d.id}`, discount: d })}>
                                <Td>
                                    <LinkText>{d.description}</LinkText>
                                </Td>
                                <Td className="text-right tabular-nums">{cell(d, "percent")}</Td>
                                <Td className="text-right tabular-nums">{cell(d, "costPlus")}</Td>
                                <Td className="text-right tabular-nums">{cell(d, "amount")}</Td>
                                <Td className="text-center">
                                    {d.approval ? (
                                        <Check className="mx-auto size-4 text-fg-success-secondary" aria-label="Yes" />
                                    ) : (
                                        <span className="text-quaternary">—</span>
                                    )}
                                </Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end gap-1">
                                        <RowIconButton
                                            label={`Edit ${d.description}`}
                                            icon={Edit05}
                                            onClick={() => tabs.open({ key: `d-${d.id}`, discount: d })}
                                        />
                                        <RowIconButton label={`Delete ${d.description}`} icon={Trash01} destructive onClick={() => setDeleting(d)} />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <DiscountTypeRecord
                        discount={t.discount}
                        isNew={t.isNew}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        onSaved={(d) => {
                            setRows((all) => (all.some((r) => r.id === d.id) ? all.map((r) => (r.id === d.id ? d : r)) : [...all, d]));
                            tabs.update(t.key, { discount: d, isNew: false });
                        }}
                        onDelete={() => remove(t.discount)}
                    />
                </div>
            ))}
            {tabs.warning}
            <ConfirmDeleteModal
                isOpen={Boolean(deleting)}
                what={deleting?.description ?? ""}
                detail="Staff can't apply it anymore. Past orders keep the discount."
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) remove(deleting);
                    setDeleting(null);
                }}
            />
        </ProductsPage>
    );
};
