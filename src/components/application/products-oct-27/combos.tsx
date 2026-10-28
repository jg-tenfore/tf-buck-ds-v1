"use client";

import { useState } from "react";
import { Copy06, Edit05, LayersThree01, Plus, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { money } from "../migration-v2/data";
import { LinkText, ScreenModal, TableCard, Td, Th } from "../migration-v2/kit";
import {
    COMBOS,
    COMBO_DEPARTMENTS,
    COMBO_PRODUCTS,
    type Combo,
    type ComboItem,
    PRODUCTS_NAV,
    TAX2_TYPES,
    TAX_TYPES,
    comboAfterTax,
    comboBeforeTax,
    comboItemTax,
    comboItemTax2,
    comboItemTotal,
    round2,
    taxRate,
} from "./data";
import {
    ConfirmDeleteModal,
    FieldGrid,
    type PageAction,
    PriceSummary,
    ProductsPage,
    RecordBody,
    RecordHeader,
    RowIconButton,
    STd,
    STh,
    SectionEmpty,
    SectionTable,
    SelectField,
    Toast,
    useRecordTabs,
    useReportDirty,
} from "./kit";

type Draft = { product: string; qty: string; unitPrice: string; taxType: string; tax2Type: string };
const toDraft = (i?: ComboItem): Draft =>
    i
        ? { product: i.product, qty: String(i.qty), unitPrice: i.unitPrice.toFixed(2), taxType: i.taxType, tax2Type: i.tax2Type }
        : { product: "", qty: "1", unitPrice: "", taxType: "standard", tax2Type: "none" };

/**
 * Add a product to a combo, or change one already in it: quantity and the
 * price it's sold at inside the combo, with its taxes worked out.
 */
export const ComboItemModal = ({
    isOpen,
    item,
    department,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    item?: ComboItem;
    department: string;
    onClose: () => void;
    onSave: (draft: Omit<ComboItem, "id">) => void;
}) => {
    const [d, setD] = useState(() => toDraft(item));
    const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }));
    const price = Number(d.unitPrice) || 0;
    const qty = Number(d.qty) || 0;
    const tax = round2(price * taxRate(d.taxType));
    const tax2 = round2(price * taxRate(d.tax2Type));
    const unitTotal = round2(price + tax + tax2);
    const ok = Boolean(d.product && qty > 0 && d.unitPrice !== "");
    return (
        <ScreenModal
            title={item ? `Edit ${item.product}` : "Add a product to this combo"}
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-xl"
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        isDisabled={!ok}
                        onClick={() => {
                            onSave({ product: d.product, qty, unitPrice: price, fees: item?.fees ?? 0, taxType: d.taxType, tax2Type: d.tax2Type });
                            onClose();
                        }}
                    >
                        {item ? "Save product" : "Add product"}
                    </Button>
                </>
            }
        >
            <SelectField
                label="Product"
                hint={`Only products sold in ${department} can be added.`}
                value={d.product}
                onChange={(v) => set({ product: v })}
                options={[{ value: "", label: "Select a product" }, ...COMBO_PRODUCTS]}
            />
            <FieldGrid>
                <Input label="Quantity" inputMode="numeric" value={d.qty} onChange={(v) => set({ qty: v })} />
                <Input
                    label="Unit price (before tax and fees)"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={d.unitPrice}
                    onChange={(v) => set({ unitPrice: v })}
                />
                <SelectField
                    label="Tax type"
                    value={d.taxType}
                    onChange={(v) => set({ taxType: v })}
                    options={TAX_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                />
                <SelectField
                    label="Tax type 2"
                    value={d.tax2Type}
                    onChange={(v) => set({ tax2Type: v })}
                    options={TAX2_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                />
            </FieldGrid>
            <PriceSummary
                label={`Line total (${qty} × ${money(unitTotal)})`}
                lines={[
                    ["Unit price", price],
                    ["Tax", tax],
                    ["Tax 2", tax2],
                    ["Unit total", unitTotal],
                ]}
                total={round2(unitTotal * qty)}
            />
        </ScreenModal>
    );
};

/** One combo in its tab: details, the products in it, and what it all costs. */
export const ComboRecord = ({
    combo,
    isNew,
    initialModal,
    onCancel,
    onDirtyChange,
    onSaved,
    onDuplicate,
    onDelete,
}: {
    combo: Combo;
    isNew?: boolean;
    initialModal?: "add" | "edit";
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (combo: Combo) => void;
    onDuplicate: (combo: Combo) => void;
    onDelete: () => void;
}) => {
    const [saved, setSaved] = useState(combo);
    const [form, setForm] = useState(combo);
    const [modal, setModal] = useState<{ item?: ComboItem } | null>(
        initialModal === "add" ? {} : initialModal === "edit" && combo.items[0] ? { item: combo.items[0] } : null,
    );
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<Combo>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);

    const actions: PageAction[] = isNew
        ? []
        : [
              { id: "duplicate", label: "Duplicate", icon: Copy06, onAction: () => onDuplicate({ ...form, id: 0, title: `Copy of ${form.title}` }) },
              { id: "delete", label: "Delete combo", icon: Trash01, destructive: true, onAction: () => setConfirmDelete(true) },
          ];

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New combo
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Combo · {form.department}</>
                    )
                }
                title={form.title || "New combo"}
                meta={`${form.items.length} ${form.items.length === 1 ? "product" : "products"} · ${money(comboAfterTax(form))} after tax and fees`}
                saveLabel={isNew ? "Create combo" : "Save changes"}
                canSave={dirty && Boolean(form.title.trim())}
                onCancel={onCancel}
                onSave={() => {
                    const c = form.id ? form : { ...form, id: Date.now() };
                    setForm(c);
                    setSaved(c);
                    onSaved(c);
                    setMessage(isNew ? `${form.title} created.` : `Changes to ${form.title} saved.`);
                }}
                actions={actions}
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
                        description: "What staff see on the ordering screen and the receipt.",
                        content: (
                            <FieldGrid cols={3}>
                                <Input label="Title" isRequired placeholder="e.g. Turn Special" value={form.title} onChange={(v) => set({ title: v })} />
                                <Input
                                    label="Description"
                                    placeholder="Shown under the title"
                                    value={form.description}
                                    onChange={(v) => set({ description: v })}
                                />
                                <SelectField
                                    label="Department"
                                    hint="Products must be sold in this department."
                                    value={form.department}
                                    onChange={(v) => set({ department: v })}
                                    options={COMBO_DEPARTMENTS}
                                />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "products",
                        tab: "all",
                        title: "Products",
                        description: "Each product in the combo and the price it's sold at inside it.",
                        aside: (
                            <Button color="secondary" size="sm" iconLeading={Plus} onClick={() => setModal({})}>
                                Add product
                            </Button>
                        ),
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        <STh>Product</STh>
                                        <STh className="text-right">Unit price</STh>
                                        <STh className="text-right">Unit fees</STh>
                                        <STh className="text-right">Unit tax</STh>
                                        <STh className="text-right">Unit tax 2</STh>
                                        <STh className="text-right">Qty</STh>
                                        <STh className="text-right">Total</STh>
                                        <STh />
                                    </tr>
                                }
                                empty={!form.items.length && <SectionEmpty>No products yet. Use Add product to build the combo.</SectionEmpty>}
                            >
                                {form.items.map((i) => (
                                    <tr key={i.id}>
                                        <STd className="font-medium text-primary">{i.product}</STd>
                                        <STd className="text-right tabular-nums">{money(i.unitPrice)}</STd>
                                        <STd className="text-right tabular-nums">{money(i.fees)}</STd>
                                        <STd className="text-right tabular-nums">{money(comboItemTax(i))}</STd>
                                        <STd className="text-right tabular-nums">{money(comboItemTax2(i))}</STd>
                                        <STd className="text-right tabular-nums">{i.qty}</STd>
                                        <STd className="text-right font-semibold text-primary tabular-nums">{money(comboItemTotal(i))}</STd>
                                        <STd className="py-1.5">
                                            <div className="flex justify-end gap-1">
                                                <RowIconButton label={`Edit ${i.product}`} icon={Edit05} onClick={() => setModal({ item: i })} />
                                                <RowIconButton
                                                    label={`Remove ${i.product}`}
                                                    icon={Trash01}
                                                    destructive
                                                    onClick={() => set({ items: form.items.filter((x) => x.id !== i.id) })}
                                                />
                                            </div>
                                        </STd>
                                    </tr>
                                ))}
                            </SectionTable>
                        ),
                    },
                    {
                        id: "price",
                        tab: "all",
                        title: "Combo Price",
                        description: "Worked out from the products above.",
                        content: (
                            <div className="max-w-sm">
                                <PriceSummary
                                    label="After taxes and fees"
                                    lines={[
                                        ["Before tax", comboBeforeTax(form)],
                                        ["Taxes and fees", round2(comboAfterTax(form) - comboBeforeTax(form))],
                                    ]}
                                    total={comboAfterTax(form)}
                                />
                            </div>
                        ),
                    },
                ]}
            />
            {modal && (
                <ComboItemModal
                    isOpen
                    item={modal.item}
                    department={form.department}
                    onClose={() => setModal(null)}
                    onSave={(d) =>
                        set({
                            items: modal.item
                                ? form.items.map((x) => (x.id === modal.item!.id ? { ...x, ...d } : x))
                                : [...form.items, { ...d, id: `n${Date.now()}` }],
                        })
                    }
                />
            )}
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.title}
                detail="It's removed from every ordering screen. Past orders keep their line items."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

type Tab = { key: string; combo: Combo; isNew?: boolean };
let drafts = 0;
const blankCombo = (): Combo => ({ id: 0, title: "", description: "", department: "Pro Shop", items: [] });

/** Products › Combos: the list, and each combo (or a new one) in its own tab. */
export const CombosPage = ({ initialOpen = [], initialModal }: { initialOpen?: (number | "new")[]; initialModal?: "add" | "edit" }) => {
    const [rows, setRows] = useState(COMBOS);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((id) =>
            id === "new" ? { key: `new-${++drafts}`, combo: blankCombo(), isNew: true } : { key: `c-${id}`, combo: COMBOS.find((c) => c.id === id)! },
        ),
    );
    const [deleting, setDeleting] = useState<Combo | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const openNew = (combo = blankCombo()) => tabs.open({ key: `new-${++drafts}`, combo, isNew: true });
    const remove = (c: Combo) => {
        setRows((all) => all.filter((x) => x.id !== c.id));
        const open = tabs.tabs.find((t) => t.combo.id === c.id && !t.isNew);
        if (open) tabs.forceClose(open.key);
        setMessage(`${c.title} deleted.`);
    };

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.combos}
            crumbs={["Products", "Combos"]}
            title="Combos"
            description="Bundles of products sold as one item, with their own price."
            primary={{ id: "add", label: "Add combo", onAction: () => openNew() }}
            lists={[{ id: "list", label: "Combos" }]}
            tabs={tabs.tabs.map((t) => ({ id: t.key, label: t.combo.title || "New combo", sublabel: t.isNew ? "Draft" : undefined, icon: LayersThree01 }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={tabs.active === "list" ? undefined : "hidden"}>
                <TableCard>
                    <thead>
                        <tr>
                            <Th>Title</Th>
                            <Th>Description</Th>
                            <Th>Department</Th>
                            <Th className="text-right">Products</Th>
                            <Th className="text-right">Price</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((c) => (
                            <tr key={c.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: `c-${c.id}`, combo: c })}>
                                <Td>
                                    <LinkText>{c.title}</LinkText>
                                </Td>
                                <Td className="text-secondary">{c.description || "—"}</Td>
                                <Td className="text-secondary">{c.department}</Td>
                                <Td className="text-right text-secondary tabular-nums">{c.items.length}</Td>
                                <Td className="text-right font-medium tabular-nums">{money(comboBeforeTax(c))}</Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end gap-1">
                                        <RowIconButton label={`Edit ${c.title}`} icon={Edit05} onClick={() => tabs.open({ key: `c-${c.id}`, combo: c })} />
                                        <RowIconButton label={`Delete ${c.title}`} icon={Trash01} destructive onClick={() => setDeleting(c)} />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <ComboRecord
                        combo={t.combo}
                        isNew={t.isNew}
                        initialModal={t.key === tabs.active ? initialModal : undefined}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        onSaved={(combo) => {
                            setRows((all) => (all.some((r) => r.id === combo.id) ? all.map((r) => (r.id === combo.id ? combo : r)) : [combo, ...all]));
                            tabs.update(t.key, { combo, isNew: false });
                        }}
                        onDuplicate={(c) => openNew(c)}
                        onDelete={() => remove(t.combo)}
                    />
                </div>
            ))}
            {tabs.warning}
            <ConfirmDeleteModal
                isOpen={Boolean(deleting)}
                what={deleting?.title ?? ""}
                detail="It's removed from every ordering screen. Past orders keep their line items."
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) remove(deleting);
                    setDeleting(null);
                }}
            />
        </ProductsPage>
    );
};
