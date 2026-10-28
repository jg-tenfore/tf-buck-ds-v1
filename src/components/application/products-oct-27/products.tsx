"use client";

import { useEffect, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    Copy01,
    Copy06,
    FilterLines,
    PauseCircle,
    PlayCircle,
    Plus,
    Printer,
    SearchLg,
    ShoppingBag01,
    Star01,
    Trash01,
    XClose,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import { LinkText, ScreenModal, TableCard, Td, Th } from "../migration-v2/kit";
import {
    ACCOUNTING_CATEGORIES,
    BRANDS,
    COURSE,
    COURSES,
    CREDIT_BOOKS,
    DEPARTMENTS,
    DEPARTMENT_GROUPS,
    MODIFIER_GROUP_NAMES,
    PARTNERS,
    PRODUCTS,
    PRODUCTS_NAV,
    PRODUCT_GROUPS,
    PRODUCT_OPTIONS,
    type ProductDetail,
    type ProductRow,
    SUB_GROUPS,
    TAX2_TYPES,
    TAX_TYPES,
    blankProduct,
    grandTotal,
    productDetail,
    round2,
    taxRate,
} from "./data";
import {
    BalanceStrip,
    ConfirmDeleteModal,
    FieldGrid,
    ImageField,
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
    type SubTabMode,
    Toast,
    ToggleGrid,
    exportAction,
    useRecordTabs,
    useReportDirty,
} from "./kit";

const SUB_TABS = [
    { id: "info", label: "Product info" },
    { id: "sold", label: "Where it's sold" },
    { id: "pricing", label: "Pricing" },
    { id: "options", label: "Options" },
    { id: "modifiers", label: "Modifiers" },
    { id: "ingredients", label: "Ingredients" },
    { id: "variants", label: "Variants" },
    { id: "inventory", label: "Inventory history" },
];

type Form = Omit<ProductDetail, "row"> & { id: string; name: string; group: string; sku: string; price: string; onHold: boolean };
type Variant = { id: number; title: string; sku: string; size: string; color: string; a1: string; a2: string; cost: string };
type Ingredient = { id: number; product: string; qty: string };

const toForm = (d: ProductDetail): Form => {
    const { row, ...rest } = d;
    return {
        ...rest,
        id: row.id ? String(row.id) : "",
        name: row.name,
        group: row.group,
        sku: row.sku ?? "",
        price: row.price ? row.price.toFixed(2) : "",
        onHold: Boolean(row.onHold),
    };
};

/** What the form's price, taxes and fees come to. */
const pricing = (f: Form, feeRate: number) => {
    const price = Number(f.price) || 0;
    const tax = round2(price * taxRate(f.taxType));
    const tax2 = round2(price * taxRate(f.tax2Type));
    const fees = round2(price * feeRate);
    return { price, tax, tax2, fees, total: round2(price + tax + tax2 + fees) };
};

/**
 * One product in its tab. The eight sub-tabs from today's Products page become
 * stacked sections (A) or stay as sub-tabs (B). On Hold, Duplicate, Copy to
 * another course, Print price sticker and Delete live in the Actions menu.
 */
export const ProductRecord = ({
    detail,
    isNew,
    mode,
    startEdited,
    onCancel,
    onDirtyChange,
    onSaved,
    onDuplicate,
    onCopy,
    onDelete,
}: {
    detail: ProductDetail;
    isNew?: boolean;
    mode: SubTabMode;
    startEdited?: boolean;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (row: ProductRow) => void;
    onDuplicate: (form: ProductDetail) => void;
    onCopy: (name: string) => void;
    onDelete: () => void;
}) => {
    const feeRate = detail.row.price ? detail.row.fees / detail.row.price : 0;
    const [saved, setSaved] = useState(() => toForm(detail));
    const [form, setForm] = useState(() => (startEdited ? { ...toForm(detail), price: "6.99" } : toForm(detail)));
    const [variants, setVariants] = useState<Variant[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [pickGroup, setPickGroup] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved) || variants.length > 0 || ingredients.length > 0;
    useReportDirty(dirty, onDirtyChange);
    const p = pricing(form, feeRate);
    const canSave = dirty && Boolean(form.name.trim() && form.group && p.price > 0);
    const asRow = (f: Form): ProductRow => ({
        ...detail.row,
        id: Number(f.id) || detail.row.id || 99000 + Math.floor(Math.random() * 900),
        name: f.name,
        group: f.group,
        sku: f.sku || undefined,
        price: p.price,
        tax: p.tax,
        tax2: p.tax2,
        fees: p.fees,
        onHold: f.onHold,
    });

    const actions: PageAction[] = isNew
        ? []
        : [
              {
                  id: "duplicate",
                  label: "Duplicate",
                  icon: Copy06,
                  onAction: () => onDuplicate({ ...detail, ...form, row: { ...asRow(form), id: 0, name: `Copy of ${form.name}` } }),
              },
              {
                  id: "hold",
                  label: form.onHold ? "Take off hold" : "Put on hold",
                  icon: form.onHold ? PlayCircle : PauseCircle,
                  onAction: () => set({ onHold: !form.onHold }),
              },
              {
                  id: "sticker",
                  label: "Print price sticker",
                  icon: Printer,
                  onAction: () => setMessage(`Price sticker for ${form.name} sent to the Pro Shop printer.`),
              },
              { id: "copy", label: "Copy to another course…", icon: Copy01, onAction: () => onCopy(form.name) },
              { id: "delete", label: "Delete product", icon: Trash01, destructive: true, onAction: () => setConfirmDelete(true) },
          ];

    const groupNames = PRODUCT_GROUPS.map((g) => g.name);
    const groupGl = PRODUCT_GROUPS.find((g) => g.name === form.group)?.gl;

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    <>
                        {isNew ? "New product" : `Product ${detail.row.id}`}
                        {isNew && (
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        )}
                        {form.onHold && (
                            <Badge color="warning" size="sm">
                                On hold
                            </Badge>
                        )}
                    </>
                }
                title={form.name || "New product"}
                meta={form.group ? `${form.group} · ${money(p.total)} after tax and fees` : "Name it, pick a group and set a price to save."}
                saveLabel={isNew ? "Create product" : "Save changes"}
                canSave={canSave}
                onCancel={onCancel}
                onSave={() => {
                    setSaved(form);
                    setVariants([]);
                    setIngredients([]);
                    onSaved(asRow(form));
                    setMessage(isNew ? `${form.name} created.` : `Changes to ${form.name} saved.`);
                }}
                actions={actions}
            />
            <Toast message={message} onDismiss={() => setMessage(null)} />
            {form.onHold && (
                <div className="rounded-xl bg-warning-primary px-4 py-3 text-sm text-primary ring-1 ring-fg-warning-secondary ring-inset">
                    <span className="font-semibold">On hold.</span> Staff can't ring this up anywhere until it's taken off hold.
                </div>
            )}
            <RecordBody
                mode={mode}
                tabs={SUB_TABS}
                sections={[
                    {
                        id: "info",
                        tab: "info",
                        title: "Product Info",
                        description: "What it's called and how it looks on the ordering screens and online.",
                        content: (
                            <>
                                <ImageField />
                                <FieldGrid>
                                    <Input label="Name" isRequired placeholder="e.g. Logo Golf Glove" value={form.name} onChange={(v) => set({ name: v })} />
                                    <Input label="Product ID" placeholder="Created when saved" value={form.id} onChange={(v) => set({ id: v })} />
                                </FieldGrid>
                                <TextArea
                                    label="Description"
                                    rows={3}
                                    hint={`${form.description.length} / 1000`}
                                    value={form.description}
                                    onChange={(v) => set({ description: v })}
                                />
                            </>
                        ),
                    },
                    {
                        id: "codes",
                        tab: "info",
                        title: "Category & Codes",
                        description: "How it's grouped for reporting, and the codes your books and vendors use.",
                        content: (
                            <FieldGrid>
                                <SelectField
                                    label="Accounting category"
                                    value={form.category}
                                    onChange={(v) => set({ category: v })}
                                    options={[{ value: "", label: "Select category" }, ...ACCOUNTING_CATEGORIES]}
                                />
                                <SelectField
                                    label="Default product group"
                                    value={form.group}
                                    onChange={(v) => set({ group: v, subGroup: "None" })}
                                    options={[{ value: "", label: "Select product group" }, ...groupNames]}
                                />
                                <SelectField
                                    label="Default product sub-group"
                                    value={form.subGroup}
                                    onChange={(v) => set({ subGroup: v })}
                                    options={SUB_GROUPS[form.group] ?? [{ value: "None", label: "No sub-groups available" }]}
                                />
                                <SelectField
                                    label="GL code"
                                    value={form.glOverride}
                                    onChange={(v) => set({ glOverride: v })}
                                    options={[
                                        { value: "", label: groupGl ? `No GL code (inherits ${groupGl} from group)` : "No GL code" },
                                        "1120",
                                        "3320",
                                        "3341",
                                        "5700",
                                    ]}
                                />
                                <SelectField label="Brand" value={form.brand} onChange={(v) => set({ brand: v })} options={BRANDS} />
                                <Input label="SKU" placeholder="A unique SKU is created if left blank" value={form.sku} onChange={(v) => set({ sku: v })} />
                                <Input label="Vendor code" value={form.vendorCode} onChange={(v) => set({ vendorCode: v })} />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "partners",
                        tab: "info",
                        title: "Partners, Credit Books & Rewards",
                        content: (
                            <FieldGrid>
                                <SelectField label="Partner" value={form.partner} onChange={(v) => set({ partner: v })} options={PARTNERS} />
                                <Input
                                    label="Partner product code"
                                    value={form.partnerCode}
                                    onChange={(v) => set({ partnerCode: v })}
                                    isDisabled={form.partner === "None"}
                                />
                                <SelectField label="Credit book" value={form.creditBook} onChange={(v) => set({ creditBook: v })} options={CREDIT_BOOKS} />
                                <div />
                                <Input
                                    label="Rewards value"
                                    hint="Points earned when bought"
                                    inputMode="numeric"
                                    value={form.rewardsValue}
                                    onChange={(v) => set({ rewardsValue: v })}
                                />
                                <Input
                                    label="Rewards cost"
                                    hint="Points to redeem it"
                                    inputMode="numeric"
                                    value={form.rewardsCost}
                                    onChange={(v) => set({ rewardsCost: v })}
                                />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "sold",
                        tab: "sold",
                        title: "Where It's Sold",
                        description: "Turn on each department that sells it, and pick the group it shows under there.",
                        aside: (
                            <Button
                                color="secondary"
                                size="sm"
                                onClick={() =>
                                    set({
                                        departments: Object.fromEntries(
                                            DEPARTMENTS.map((d) => [d, form.departments[d] ?? (form.group || DEPARTMENT_GROUPS[0])]),
                                        ),
                                    })
                                }
                            >
                                Sell everywhere
                            </Button>
                        ),
                        content: (
                            <div className="flex flex-col divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                                {DEPARTMENTS.map((d) => {
                                    const on = d in form.departments;
                                    return (
                                        <div key={d} className="flex min-h-16 flex-wrap items-center justify-between gap-4 px-4 py-3">
                                            <Toggle
                                                label={d}
                                                isSelected={on}
                                                onChange={(next) => {
                                                    const { [d]: _, ...rest } = form.departments;
                                                    set({ departments: next ? { ...form.departments, [d]: form.group || DEPARTMENT_GROUPS[0] } : rest });
                                                }}
                                            />
                                            {on && (
                                                <div className="w-full sm:w-64">
                                                    <SelectField
                                                        label={`${d} group`}
                                                        value={form.departments[d] ?? ""}
                                                        onChange={(v) => set({ departments: { ...form.departments, [d]: v } })}
                                                        options={DEPARTMENT_GROUPS}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ),
                    },
                    {
                        id: "pricing",
                        tab: "pricing",
                        title: "Pricing",
                        description: "Set the price before tax and fees, or type the price you want customers to pay and it works backwards.",
                        content: (
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                                <FieldGrid>
                                    <Input
                                        label="Price (before tax and fees)"
                                        isRequired
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={form.price}
                                        onChange={(v) => set({ price: v })}
                                    />
                                    <Input
                                        label="Target price (after tax and fees)"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={p.total ? p.total.toFixed(2) : ""}
                                        onChange={(v) => {
                                            const divisor = 1 + taxRate(form.taxType) + taxRate(form.tax2Type) + feeRate;
                                            set({ price: v ? (Number(v) / divisor).toFixed(2) : "" });
                                        }}
                                    />
                                    <SelectField
                                        label="Tax type"
                                        value={form.taxType}
                                        onChange={(v) => set({ taxType: v })}
                                        options={TAX_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                                    />
                                    <SelectField
                                        label="Tax type 2"
                                        value={form.tax2Type}
                                        onChange={(v) => set({ tax2Type: v })}
                                        options={TAX2_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                                    />
                                    <Input
                                        label="Cost"
                                        inputMode="decimal"
                                        value={form.cost ? String(form.cost) : ""}
                                        placeholder="0.00"
                                        onChange={(v) => set({ cost: Number(v) || 0 })}
                                    />
                                    <Input
                                        label="Exposed cost"
                                        tooltip="The cost shown to staff on reports"
                                        inputMode="decimal"
                                        value={form.exposedCost}
                                        onChange={(v) => set({ exposedCost: v })}
                                    />
                                    <Input
                                        label="Service charge override"
                                        hint="Optional. Replaces the group's service charge."
                                        inputMode="decimal"
                                        value={form.serviceCharge}
                                        onChange={(v) => set({ serviceCharge: v })}
                                    />
                                </FieldGrid>
                                <PriceSummary
                                    lines={[
                                        ["Price", p.price],
                                        ["Tax", p.tax],
                                        ["Tax 2", p.tax2],
                                        ["Fees", p.fees],
                                    ]}
                                    total={p.total}
                                />
                            </div>
                        ),
                    },
                    {
                        id: "options",
                        tab: "options",
                        title: "Options",
                        description: "How it behaves at the point of sale, and what it's reported as.",
                        content: (
                            <>
                                <h3 className="text-sm font-semibold text-secondary">At the point of sale</h3>
                                <ToggleGrid
                                    items={PRODUCT_OPTIONS.filter((o) => o.group === "sale")}
                                    values={form.options}
                                    onChange={(id, on) => set({ options: { ...form.options, [id]: on } })}
                                />
                                <h3 className="text-sm font-semibold text-secondary">Report as</h3>
                                <ToggleGrid
                                    items={PRODUCT_OPTIONS.filter((o) => o.group === "type")}
                                    values={form.options}
                                    onChange={(id, on) => set({ options: { ...form.options, [id]: on } })}
                                />
                            </>
                        ),
                    },
                    {
                        id: "modifiers",
                        tab: "modifiers",
                        title: "Modifier Groups",
                        description: "Choices staff are asked for when this is added to an order.",
                        content: (
                            <>
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="min-w-64 flex-1">
                                        <SelectField
                                            label="Modifier group"
                                            value={pickGroup}
                                            onChange={setPickGroup}
                                            options={[
                                                { value: "", label: "Select a modifier group" },
                                                ...MODIFIER_GROUP_NAMES.filter((m) => !form.modifierGroups.includes(m)),
                                            ]}
                                        />
                                    </div>
                                    <Button
                                        color="secondary"
                                        size="md"
                                        iconLeading={Plus}
                                        isDisabled={!pickGroup}
                                        onClick={() => {
                                            set({ modifierGroups: [...form.modifierGroups, pickGroup] });
                                            setPickGroup("");
                                        }}
                                    >
                                        Add group
                                    </Button>
                                </div>
                                {form.modifierGroups.length ? (
                                    <ul className="flex flex-col divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                                        {form.modifierGroups.map((m) => (
                                            <li key={m} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-primary">
                                                {m}
                                                <RowIconButton
                                                    label={`Remove ${m}`}
                                                    icon={Trash01}
                                                    destructive
                                                    onClick={() => set({ modifierGroups: form.modifierGroups.filter((x) => x !== m) })}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <SectionEmpty>No modifier groups. Add one above.</SectionEmpty>
                                )}
                            </>
                        ),
                    },
                    {
                        id: "ingredients",
                        tab: "ingredients",
                        title: "Ingredients",
                        description: "Inventory items used up each time this sells.",
                        aside: (
                            <Button
                                color="secondary"
                                size="sm"
                                iconLeading={Plus}
                                onClick={() => setIngredients((list) => [...list, { id: Date.now(), product: "", qty: "1" }])}
                            >
                                Add ingredient
                            </Button>
                        ),
                        content: ingredients.length ? (
                            <div className="flex flex-col gap-3">
                                {ingredients.map((ing) => (
                                    <div key={ing.id} className="flex flex-wrap items-end gap-3">
                                        <div className="min-w-64 flex-1">
                                            <SelectField
                                                label="Ingredient"
                                                value={ing.product}
                                                onChange={(v) => setIngredients((list) => list.map((x) => (x.id === ing.id ? { ...x, product: v } : x)))}
                                                options={[{ value: "", label: "Select an inventory item" }, ...PRODUCTS.map((r) => r.name)]}
                                            />
                                        </div>
                                        <div className="w-28">
                                            <Input
                                                label="Quantity"
                                                inputMode="decimal"
                                                value={ing.qty}
                                                onChange={(v) => setIngredients((list) => list.map((x) => (x.id === ing.id ? { ...x, qty: v } : x)))}
                                            />
                                        </div>
                                        <RowIconButton
                                            label="Remove ingredient"
                                            icon={XClose}
                                            onClick={() => setIngredients((list) => list.filter((x) => x.id !== ing.id))}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <SectionEmpty>No ingredients. Use Add ingredient to track what this uses up.</SectionEmpty>
                        ),
                    },
                    {
                        id: "variants",
                        tab: "variants",
                        title: "Variants",
                        description: "Sizes, colors or styles sold under this product, each with its own SKU and cost.",
                        aside: (
                            <Button
                                color="secondary"
                                size="sm"
                                iconLeading={Plus}
                                onClick={() =>
                                    setVariants((list) => [...list, { id: Date.now(), title: "", sku: "", size: "", color: "", a1: "", a2: "", cost: "" }])
                                }
                            >
                                New variant
                            </Button>
                        ),
                        content: (
                            <SectionTable
                                head={
                                    <tr>
                                        {["Title", "SKU", "Size", "Color", "Attribute 1", "Attribute 2", "Cost", ""].map((h, i) => (
                                            <STh key={i}>{h}</STh>
                                        ))}
                                    </tr>
                                }
                                empty={!variants.length && <SectionEmpty>No variants.</SectionEmpty>}
                            >
                                {variants.map((v) => (
                                    <tr key={v.id}>
                                        {(["title", "sku", "size", "color", "a1", "a2", "cost"] as const).map((k) => (
                                            <STd key={k} className="px-2 py-2">
                                                <Input
                                                    aria-label={k}
                                                    size="sm"
                                                    value={v[k]}
                                                    onChange={(val) => setVariants((list) => list.map((x) => (x.id === v.id ? { ...x, [k]: val } : x)))}
                                                />
                                            </STd>
                                        ))}
                                        <STd className="px-2 py-2">
                                            <RowIconButton
                                                label="Remove variant"
                                                icon={Trash01}
                                                destructive
                                                onClick={() => setVariants((list) => list.filter((x) => x.id !== v.id))}
                                            />
                                        </STd>
                                    </tr>
                                ))}
                            </SectionTable>
                        ),
                    },
                    {
                        id: "inventory",
                        tab: "inventory",
                        title: "Inventory History",
                        description: "Stock received and sold. Receive more under Inventory › Receive.",
                        content: (
                            <>
                                <BalanceStrip
                                    items={[
                                        { label: "Current stock", value: String(detail.stock), strong: true },
                                        { label: "Total sold", value: String(detail.sold) },
                                        { label: "Last received", value: detail.inventory[0]?.date.split(" ").slice(0, 3).join(" ") ?? "—" },
                                    ]}
                                />
                                <SectionTable
                                    head={
                                        <tr>
                                            <STh>Date</STh>
                                            <STh>Invoice</STh>
                                            <STh className="text-right">Qty</STh>
                                            <STh className="text-right">Unit cost</STh>
                                        </tr>
                                    }
                                    empty={!detail.inventory.length && <SectionEmpty>Nothing received yet.</SectionEmpty>}
                                >
                                    {detail.inventory.map((r, i) => (
                                        <tr key={i}>
                                            <STd>{r.date}</STd>
                                            <STd>{r.invoice}</STd>
                                            <STd className="text-right tabular-nums">{r.qty}</STd>
                                            <STd className="text-right tabular-nums">{money(r.unitCost)}</STd>
                                        </tr>
                                    ))}
                                </SectionTable>
                            </>
                        ),
                    },
                ]}
            />
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.name}
                detail="It's removed from every department and menu. Past orders keep their line items."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Featured products + copy to another course                                */
/* -------------------------------------------------------------------------- */

const FEATURED_MAX = 9;

/** Up to nine products shown first on the course's online shop, in order. */
export const FeaturedProductsModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (count: number) => void }) => {
    const [picked, setPicked] = useState<string[]>(["Tour Golf Balls – Dozen", "Logo Golf Glove"]);
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const results = q ? PRODUCTS.filter((r) => !picked.includes(r.name) && r.name.toLowerCase().includes(q)).slice(0, 5) : [];
    const move = (i: number, by: number) =>
        setPicked((list) => {
            const next = [...list];
            [next[i], next[i + by]] = [next[i + by], next[i]];
            return next;
        });
    return (
        <ScreenModal
            title="Featured products"
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-lg"
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        onClick={() => {
                            onSave(picked.length);
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                </>
            }
        >
            <p className="text-sm text-secondary">Shown first, in this order, on your course's online shop.</p>
            <div className="flex flex-col gap-2">
                <Input
                    label={`Products (${picked.length} of ${FEATURED_MAX})`}
                    placeholder="Search products to feature"
                    icon={SearchLg}
                    value={query}
                    onChange={setQuery}
                    isDisabled={picked.length >= FEATURED_MAX}
                />
                {results.length > 0 && (
                    <div className="flex flex-col rounded-lg ring-1 ring-secondary">
                        {results.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                    setPicked((list) => [...list, r.name]);
                                    setQuery("");
                                }}
                                className="flex cursor-pointer items-center justify-between border-b border-secondary px-4 py-2.5 text-left text-sm last:border-b-0 hover:bg-primary_hover"
                            >
                                <span className="font-medium text-primary">{r.name}</span>
                                <span className="text-tertiary">{money(grandTotal(r))}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {picked.length ? (
                <ol className="flex flex-col divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                    {picked.map((name, i) => (
                        <li key={name} className="flex items-center gap-3 px-3 py-2 text-sm">
                            <span className="w-5 text-center font-semibold text-tertiary tabular-nums">{i + 1}</span>
                            <span className="flex-1 font-medium text-primary">{name}</span>
                            <RowIconButton label={`Move ${name} up`} icon={ArrowUp} onClick={() => i > 0 && move(i, -1)} />
                            <RowIconButton label={`Move ${name} down`} icon={ArrowDown} onClick={() => i < picked.length - 1 && move(i, 1)} />
                            <RowIconButton label={`Remove ${name}`} icon={XClose} onClick={() => setPicked((list) => list.filter((x) => x !== name))} />
                        </li>
                    ))}
                </ol>
            ) : (
                <SectionEmpty>Nothing featured yet.</SectionEmpty>
            )}
        </ScreenModal>
    );
};

/** Copy products (the selected ones, one product, or all) to another of your courses. */
export const CopyToCourseModal = ({
    isOpen,
    what,
    onClose,
    onCopy,
}: {
    isOpen: boolean;
    what: string;
    onClose: () => void;
    onCopy: (course: string) => void;
}) => {
    const [course, setCourse] = useState("");
    const [overwrite, setOverwrite] = useState(false);
    return (
        <ScreenModal
            title="Copy to another course"
            isOpen={isOpen}
            onClose={onClose}
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        iconLeading={Copy01}
                        isDisabled={!course}
                        onClick={() => {
                            onCopy(course);
                            setCourse("");
                            onClose();
                        }}
                    >
                        Copy
                    </Button>
                </>
            }
        >
            <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
                <p className="font-medium text-primary">{what}</p>
                <p className="mt-0.5 text-tertiary">From {COURSE}</p>
            </div>
            <SelectField
                label="Destination course"
                value={course}
                onChange={setCourse}
                options={[{ value: "", label: "Select a course" }, ...COURSES.slice(1)]}
            />
            <Checkbox
                label="Overwrite matching products there"
                hint="Products with the same SKU are replaced. Otherwise they're skipped."
                isSelected={overwrite}
                onChange={setOverwrite}
            />
        </ScreenModal>
    );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

type Tab = { key: string; detail: ProductDetail; isNew?: boolean };
let drafts = 0;

/** Products › List: every product, and each one (or a new one) in its own closable tab. */
export const ProductsListPage = ({
    mode = "sections",
    initialOpen = [],
    initialModal,
    unsavedWarning,
}: {
    mode?: SubTabMode;
    /** Product ids to open as tabs ("new" for a blank one); the last is active. */
    initialOpen?: (number | "new")[];
    initialModal?: "featured" | "copy";
    /** The active product has an unsaved change and its tab is being closed (stories). */
    unsavedWarning?: boolean;
}) => {
    const [rows, setRows] = useState(PRODUCTS);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((id) =>
            id === "new"
                ? { key: `new-${++drafts}`, detail: blankProduct(), isNew: true }
                : { key: `p-${id}`, detail: productDetail(PRODUCTS.find((r) => r.id === id)!) },
        ),
    );
    const { askToClose } = tabs;
    useEffect(() => {
        if (unsavedWarning && tabs.tabs.length) askToClose(tabs.tabs.at(-1)!.key);
    }, [unsavedWarning]); // eslint-disable-line react-hooks/exhaustive-deps
    const [modal, setModal] = useState<"featured" | "copy" | null>(initialModal ?? null);
    const [copyWhat, setCopyWhat] = useState<string | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const q = query.trim().toLowerCase();
    const shown = rows.filter((r) => !q || `${r.id} ${r.name} ${r.group} ${r.sku ?? ""}`.toLowerCase().includes(q));
    const allSelected = shown.length > 0 && shown.every((r) => selected.includes(r.id));

    const openNew = (detail = blankProduct()) => tabs.open({ key: `new-${++drafts}`, detail, isNew: true });
    const copyLabel =
        copyWhat ?? (selected.length ? `${selected.length} selected ${selected.length === 1 ? "product" : "products"}` : `All ${rows.length} products`);

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.list}
            crumbs={["Products", "List"]}
            title="Products"
            description="Everything this course sells, with pricing, variants and where it appears."
            primary={{ id: "new", label: "New product", onAction: () => openNew() }}
            secondary={[
                { id: "featured", label: "Featured products", icon: Star01, onAction: () => setModal("featured") },
                {
                    id: "copy",
                    label: "Copy to another course…",
                    icon: Copy01,
                    onAction: () => {
                        setCopyWhat(null);
                        setModal("copy");
                    },
                },
                exportAction("products"),
            ]}
            lists={[{ id: "list", label: "Products" }]}
            tabs={tabs.tabs.map((t) => ({
                id: t.key,
                label: t.isNew ? t.detail.row.name || "New product" : t.detail.row.name,
                sublabel: t.isNew ? "Draft" : undefined,
                icon: ShoppingBag01,
            }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={tabs.active === "list" ? "flex flex-col gap-4" : "hidden"}>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input aria-label="Search products" placeholder="Search name, group, SKU or ID" icon={SearchLg} value={query} onChange={setQuery} />
                    </div>
                    <Button color="secondary" size="md" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>
                {selected.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-brand-primary_alt px-4 py-2.5 text-sm ring-1 ring-brand ring-inset">
                        <span className="font-semibold text-brand-secondary">{selected.length} selected</span>
                        <Button
                            color="link-color"
                            size="sm"
                            iconLeading={Copy01}
                            onClick={() => {
                                setCopyWhat(null);
                                setModal("copy");
                            }}
                        >
                            Copy to another course
                        </Button>
                        <Button
                            color="link-color"
                            size="sm"
                            iconLeading={PauseCircle}
                            onClick={() => {
                                setRows((all) => all.map((r) => (selected.includes(r.id) ? { ...r, onHold: true } : r)));
                                setMessage(`${selected.length} products put on hold.`);
                                setSelected([]);
                            }}
                        >
                            Put on hold
                        </Button>
                        <Button color="link-gray" size="sm" className="ml-auto" onClick={() => setSelected([])}>
                            Clear
                        </Button>
                    </div>
                )}
                <TableCard>
                    <thead>
                        <tr>
                            <Th className="w-10">
                                <Checkbox aria-label="Select all" isSelected={allSelected} onChange={(on) => setSelected(on ? shown.map((r) => r.id) : [])} />
                            </Th>
                            {["#", "Name", "Group", "Vendor", "SKU", "GL", "Price", "Tax", "Tax 2", "Fees", "Grand total"].map((h, i) => (
                                <Th key={h} className={i >= 6 ? "text-right" : undefined}>
                                    {h}
                                </Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((r) => (
                            <tr
                                key={r.id}
                                className={cx("cursor-pointer hover:bg-primary_hover", selected.includes(r.id) && "bg-active")}
                                onClick={() => tabs.open({ key: `p-${r.id}`, detail: productDetail(r) })}
                            >
                                <Td onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        aria-label={`Select ${r.name}`}
                                        isSelected={selected.includes(r.id)}
                                        onChange={(on) => setSelected((s) => (on ? [...s, r.id] : s.filter((x) => x !== r.id)))}
                                    />
                                </Td>
                                <Td className="text-secondary tabular-nums">{r.id}</Td>
                                <Td>
                                    <span className="flex items-center gap-2">
                                        <LinkText>{r.name}</LinkText>
                                        {r.onHold && (
                                            <Badge color="warning" size="sm">
                                                On hold
                                            </Badge>
                                        )}
                                    </span>
                                </Td>
                                <Td className="text-secondary">{r.group}</Td>
                                <Td className="text-tertiary">{r.vendor ?? "—"}</Td>
                                <Td className="text-secondary tabular-nums">{r.sku ?? "—"}</Td>
                                <Td className="text-secondary tabular-nums">{r.gl}</Td>
                                <Td className="text-right tabular-nums">{money(r.price)}</Td>
                                <Td className="text-right tabular-nums">{money(r.tax)}</Td>
                                <Td className="text-right tabular-nums">{money(r.tax2)}</Td>
                                <Td className="text-right tabular-nums">{money(r.fees)}</Td>
                                <Td className="text-right font-semibold tabular-nums">{money(grandTotal(r))}</Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <ProductRecord
                        detail={t.detail}
                        isNew={t.isNew}
                        mode={mode}
                        startEdited={unsavedWarning && t.key === tabs.tabs.at(-1)?.key}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        onSaved={(row) => {
                            setRows((all) => (all.some((r) => r.id === row.id) ? all.map((r) => (r.id === row.id ? row : r)) : [row, ...all]));
                            tabs.update(t.key, { detail: { ...t.detail, row }, isNew: false });
                        }}
                        onDuplicate={(detail) => openNew(detail)}
                        onCopy={(name) => {
                            setCopyWhat(name);
                            setModal("copy");
                        }}
                        onDelete={() => {
                            setRows((all) => all.filter((r) => r.id !== t.detail.row.id));
                            tabs.forceClose(t.key);
                            setMessage(`${t.detail.row.name} deleted.`);
                        }}
                    />
                </div>
            ))}
            {tabs.warning}
            <FeaturedProductsModal isOpen={modal === "featured"} onClose={() => setModal(null)} onSave={(n) => setMessage(`Featured products saved (${n}).`)} />
            <CopyToCourseModal
                isOpen={modal === "copy"}
                what={copyLabel}
                onClose={() => setModal(null)}
                onCopy={(course) => {
                    setMessage(`${copyLabel} copied to ${course}.`);
                    setSelected([]);
                }}
            />
        </ProductsPage>
    );
};
