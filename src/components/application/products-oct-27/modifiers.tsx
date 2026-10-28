"use client";

import { useState } from "react";
import { Edit05, LayersThree01, Plus, Sliders01, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import { LinkText, TableCard, Td, Th } from "../migration-v2/kit";
import { GROUP_COLORS, MODIFIERS, MODIFIER_GROUPS, type Modifier, type ModifierGroup, PRODUCTS_NAV, TAX2_TYPES, TAX_TYPES, round2, taxRate } from "./data";
import {
    ConfirmDeleteModal,
    FieldGrid,
    PriceSummary,
    ProductsPage,
    RecordBody,
    RecordHeader,
    RowIconButton,
    SectionEmpty,
    SelectField,
    Toast,
    ToggleGrid,
    exportAction,
    useRecordTabs,
    useReportDirty,
} from "./kit";

const SWATCH: Record<string, string> = {
    gray: "bg-gray-700",
    brand: "bg-brand-solid",
    blue: "bg-blue-600",
    orange: "bg-orange-500",
    error: "bg-error-solid",
    success: "bg-success-solid",
};

/** A group's name as it looks on the ordering screen (a colored chip when it has a color). */
const GroupChip = ({ group }: { group: ModifierGroup }) =>
    group.color ? (
        <span className={cx("inline-flex rounded-md px-2 py-0.5 text-sm font-medium text-white", SWATCH[group.color])}>{group.description}</span>
    ) : (
        <span className="text-sm text-secondary">{group.description}</span>
    );

/** One modifier in its tab: name, price with taxes, and the groups it's in. */
export const ModifierRecord = ({
    modifier,
    isNew,
    groups,
    onCancel,
    onDirtyChange,
    onSaved,
    onDelete,
}: {
    modifier: Modifier;
    isNew?: boolean;
    groups: ModifierGroup[];
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (m: Modifier) => void;
    onDelete: () => void;
}) => {
    const toForm = (m: Modifier) => ({ ...m, priceText: m.price ? m.price.toFixed(2) : "" });
    const [saved, setSaved] = useState(() => toForm(modifier));
    const [form, setForm] = useState(() => toForm(modifier));
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);
    const price = Number(form.priceText) || 0;
    const tax = round2(price * taxRate(form.taxType));
    const tax2 = round2(price * taxRate(form.tax2Type));

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New modifier
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Modifier</>
                    )
                }
                title={form.title || "New modifier"}
                meta={`${money(round2(price + tax + tax2))} after tax · in ${form.groups.length} ${form.groups.length === 1 ? "group" : "groups"}`}
                saveLabel={isNew ? "Create modifier" : "Save changes"}
                canSave={dirty && Boolean(form.title.trim())}
                onCancel={onCancel}
                onSave={() => {
                    const next = { ...form, price, id: form.id || 100 + Math.floor(Math.random() * 900) };
                    setForm(next);
                    setSaved(next);
                    onSaved(next);
                    setMessage(isNew ? `${next.title} created.` : `Changes to ${next.title} saved.`);
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
                        description: 'Modifiers can be used on any product, like "Well Done", "Add Mayo" or "No Veggies".',
                        content: (
                            <div className="max-w-xl">
                                <Input label="Modifier title" isRequired placeholder="e.g. Add Bacon" value={form.title} onChange={(v) => set({ title: v })} />
                            </div>
                        ),
                    },
                    {
                        id: "pricing",
                        tab: "all",
                        title: "Pricing",
                        description: "Added to the product's price when chosen. Leave at 0 for free choices.",
                        content: (
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                                <FieldGrid>
                                    <Input
                                        label="Price"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={form.priceText}
                                        onChange={(v) => set({ priceText: v })}
                                    />
                                    <div />
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
                                </FieldGrid>
                                <PriceSummary
                                    lines={[
                                        ["Price", price],
                                        ["Tax", tax],
                                        ["Tax 2", tax2],
                                        ["Fees", 0],
                                    ]}
                                    total={round2(price + tax + tax2)}
                                />
                            </div>
                        ),
                    },
                    {
                        id: "groups",
                        tab: "all",
                        title: "Modifier Groups",
                        description: "The groups this modifier shows up in.",
                        content: (
                            <ToggleGrid
                                cols={3}
                                items={groups.map((g) => ({ id: g.description, label: g.description }))}
                                values={Object.fromEntries(form.groups.map((g) => [g, true]))}
                                onChange={(id, on) => set({ groups: on ? [...form.groups, id] : form.groups.filter((x) => x !== id) })}
                            />
                        ),
                    },
                ]}
            />
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.title}
                detail="It's removed from every group and product. Past orders keep it."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

/** One modifier group in its tab: name, order, button color and the modifiers in it. */
export const ModifierGroupRecord = ({
    group,
    isNew,
    modifiers,
    onCancel,
    onDirtyChange,
    onSaved,
    onDelete,
}: {
    group: ModifierGroup;
    isNew?: boolean;
    modifiers: Modifier[];
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (g: ModifierGroup) => void;
    onDelete: () => void;
}) => {
    const [saved, setSaved] = useState(group);
    const [form, setForm] = useState(group);
    const [pick, setPick] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<ModifierGroup>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);
    const inGroup = form.modifiers.map((id) => modifiers.find((m) => m.id === id)!).filter(Boolean);

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New modifier group
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Modifier group {group.id}</>
                    )
                }
                title={form.description || "New modifier group"}
                meta={`${inGroup.length} ${inGroup.length === 1 ? "modifier" : "modifiers"}${form.sequence !== null ? ` · shown ${form.sequence}${form.sequence === 1 ? "st" : form.sequence === 2 ? "nd" : form.sequence === 3 ? "rd" : "th"}` : ""}`}
                saveLabel={isNew ? "Create group" : "Save changes"}
                canSave={dirty && Boolean(form.description.trim())}
                onCancel={onCancel}
                onSave={() => {
                    const g = form.id ? form : { ...form, id: 4000 + Math.floor(Math.random() * 900) };
                    setForm(g);
                    setSaved(g);
                    onSaved(g);
                    setMessage(isNew ? `${g.description} created.` : `Changes to ${g.description} saved.`);
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
                        description: "How the group's button looks and where it sits on the ordering screen.",
                        content: (
                            <>
                                <FieldGrid>
                                    <Input
                                        label="Description"
                                        isRequired
                                        placeholder="e.g. Burger Temps"
                                        value={form.description}
                                        onChange={(v) => set({ description: v })}
                                    />
                                    <Input
                                        label="Display sequence"
                                        hint="Lower numbers show first."
                                        inputMode="numeric"
                                        value={form.sequence === null ? "" : String(form.sequence)}
                                        onChange={(v) => set({ sequence: v === "" ? null : Number(v) || 0 })}
                                    />
                                </FieldGrid>
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-secondary">Background color</span>
                                    <div role="radiogroup" aria-label="Background color" className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={form.color === null}
                                            onClick={() => set({ color: null })}
                                            className={cx(
                                                "h-9 cursor-pointer rounded-lg px-3 text-sm font-medium text-secondary ring-1 ring-primary ring-inset",
                                                form.color === null && "ring-2 ring-brand",
                                            )}
                                        >
                                            None
                                        </button>
                                        {GROUP_COLORS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                role="radio"
                                                aria-label={c}
                                                aria-checked={form.color === c}
                                                onClick={() => set({ color: c })}
                                                className={cx(
                                                    "size-9 cursor-pointer rounded-lg ring-offset-2 ring-offset-bg-primary",
                                                    SWATCH[c],
                                                    form.color === c && "ring-2 ring-brand",
                                                )}
                                            />
                                        ))}
                                        <span className="ml-2">
                                            <GroupChip group={{ ...form, description: form.description || "Preview" }} />
                                        </span>
                                    </div>
                                </div>
                            </>
                        ),
                    },
                    {
                        id: "modifiers",
                        tab: "all",
                        title: "Modifiers in This Group",
                        content: (
                            <>
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="min-w-64 flex-1">
                                        <SelectField
                                            label="Add a modifier"
                                            value={pick}
                                            onChange={setPick}
                                            options={[
                                                { value: "", label: "Select a modifier" },
                                                ...modifiers
                                                    .filter((m) => !form.modifiers.includes(m.id))
                                                    .map((m) => ({ value: String(m.id), label: `${m.title} · ${money(m.price)}` })),
                                            ]}
                                        />
                                    </div>
                                    <Button
                                        color="secondary"
                                        size="md"
                                        iconLeading={Plus}
                                        isDisabled={!pick}
                                        onClick={() => {
                                            set({ modifiers: [...form.modifiers, Number(pick)] });
                                            setPick("");
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                                {inGroup.length ? (
                                    <ul className="flex flex-col divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                                        {inGroup.map((m) => (
                                            <li key={m.id} className="flex items-center gap-4 px-4 py-2 text-sm">
                                                <span className="flex-1 font-medium text-primary">{m.title}</span>
                                                <span className="text-secondary tabular-nums">{money(m.price)}</span>
                                                <RowIconButton
                                                    label={`Remove ${m.title}`}
                                                    icon={Trash01}
                                                    destructive
                                                    onClick={() => set({ modifiers: form.modifiers.filter((x) => x !== m.id) })}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <SectionEmpty>No modifiers in this group yet.</SectionEmpty>
                                )}
                            </>
                        ),
                    },
                ]}
            />
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.description}
                detail="Products using this group stop asking for it. The modifiers themselves aren't deleted."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

type Tab = { key: string; kind: "modifier"; modifier: Modifier; isNew?: boolean } | { key: string; kind: "group"; group: ModifierGroup; isNew?: boolean };
let drafts = 0;
const blankModifier = (): Modifier => ({ id: 0, title: "", price: 0, taxType: "standard", tax2Type: "none", groups: [] });
const blankGroup = (): ModifierGroup => ({ id: 0, description: "", sequence: null, color: null, modifiers: [] });

/**
 * Products › Modifiers: two lists (Modifiers, Modifier groups) as the first
 * tabs, and each modifier or group in its own tab. The primary action follows
 * the list you're on.
 */
export const ModifiersPage = ({
    initialList = "modifiers",
    initialOpen = [],
}: {
    initialList?: "modifiers" | "groups";
    initialOpen?: ({ modifier: number } | { group: number })[];
}) => {
    const [modifiers, setModifiers] = useState(MODIFIERS);
    const [groups, setGroups] = useState(MODIFIER_GROUPS);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((o) =>
            "modifier" in o
                ? { key: `m-${o.modifier}`, kind: "modifier", modifier: MODIFIERS.find((m) => m.id === o.modifier)! }
                : { key: `g-${o.group}`, kind: "group", group: MODIFIER_GROUPS.find((g) => g.id === o.group)! },
        ),
        initialOpen.length ? undefined : initialList,
    );
    const [list, setList] = useState(initialList);
    const [deleting, setDeleting] = useState<{ kind: "modifier"; item: Modifier } | { kind: "group"; item: ModifierGroup } | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    // Closing the active record tab sends the shared tab hook back to "list": show the list you were on.
    const active = tabs.active === "list" ? list : tabs.active;
    const shownList = active === "modifiers" || active === "groups" ? active : list;

    const select = (id: string) => {
        if (id === "modifiers" || id === "groups") setList(id);
        tabs.setActive(id);
    };
    const removeModifier = (m: Modifier) => {
        setModifiers((all) => all.filter((x) => x.id !== m.id));
        setGroups((all) => all.map((g) => ({ ...g, modifiers: g.modifiers.filter((x) => x !== m.id) })));
        if (tabs.tabs.some((t) => t.key === `m-${m.id}`)) tabs.forceClose(`m-${m.id}`);
        tabs.setActive("modifiers");
        setMessage(`${m.title} deleted.`);
    };
    const removeGroup = (g: ModifierGroup) => {
        setGroups((all) => all.filter((x) => x.id !== g.id));
        if (tabs.tabs.some((t) => t.key === `g-${g.id}`)) tabs.forceClose(`g-${g.id}`);
        tabs.setActive("groups");
        setMessage(`${g.description} deleted.`);
    };

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.modifiers}
            crumbs={["Products", "Modifiers"]}
            title="Modifiers"
            description="Options and add-ons that change a product's price or preparation."
            primary={
                shownList === "groups"
                    ? {
                          id: "add-group",
                          label: "Add modifier group",
                          onAction: () => tabs.open({ key: `new-${++drafts}`, kind: "group", group: blankGroup(), isNew: true }),
                      }
                    : {
                          id: "add",
                          label: "Add modifier",
                          onAction: () => tabs.open({ key: `new-${++drafts}`, kind: "modifier", modifier: blankModifier(), isNew: true }),
                      }
            }
            secondary={[exportAction(shownList === "groups" ? "modifier groups" : "modifiers")]}
            lists={[
                { id: "modifiers", label: "Modifiers", icon: Sliders01 },
                { id: "groups", label: "Modifier groups", icon: LayersThree01 },
            ]}
            tabs={tabs.tabs.map((t) => ({
                id: t.key,
                label: t.kind === "modifier" ? t.modifier.title || "New modifier" : t.group.description || "New modifier group",
                sublabel: t.isNew ? "Draft" : t.kind === "group" ? "Group" : undefined,
                icon: t.kind === "modifier" ? Sliders01 : LayersThree01,
            }))}
            activeId={active}
            onSelect={select}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={active === "modifiers" ? undefined : "hidden"}>
                <TableCard>
                    <thead>
                        <tr>
                            <Th>Description</Th>
                            <Th>Groups</Th>
                            <Th className="text-right">Price</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {modifiers.map((m) => (
                            <tr
                                key={m.id}
                                className="cursor-pointer hover:bg-primary_hover"
                                onClick={() => tabs.open({ key: `m-${m.id}`, kind: "modifier", modifier: m })}
                            >
                                <Td>
                                    <LinkText>{m.title}</LinkText>
                                </Td>
                                <Td className="text-tertiary">{m.groups.join(", ") || "—"}</Td>
                                <Td className="text-right tabular-nums">{money(m.price)}</Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end gap-1">
                                        <RowIconButton
                                            label={`Edit ${m.title}`}
                                            icon={Edit05}
                                            onClick={() => tabs.open({ key: `m-${m.id}`, kind: "modifier", modifier: m })}
                                        />
                                        <RowIconButton
                                            label={`Delete ${m.title}`}
                                            icon={Trash01}
                                            destructive
                                            onClick={() => setDeleting({ kind: "modifier", item: m })}
                                        />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            <div className={active === "groups" ? undefined : "hidden"}>
                <TableCard>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Description</Th>
                            <Th className="text-right">Sequence</Th>
                            <Th className="text-right">Modifiers</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((g) => (
                            <tr
                                key={g.id}
                                className="cursor-pointer hover:bg-primary_hover"
                                onClick={() => tabs.open({ key: `g-${g.id}`, kind: "group", group: g })}
                            >
                                <Td>
                                    <LinkText>{g.id}</LinkText>
                                </Td>
                                <Td>
                                    <GroupChip group={g} />
                                </Td>
                                <Td className="text-right text-secondary tabular-nums">{g.sequence ?? "—"}</Td>
                                <Td className="text-right text-secondary tabular-nums">{g.modifiers.length}</Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end gap-1">
                                        <RowIconButton
                                            label={`Edit ${g.description}`}
                                            icon={Edit05}
                                            onClick={() => tabs.open({ key: `g-${g.id}`, kind: "group", group: g })}
                                        />
                                        <RowIconButton
                                            label={`Delete ${g.description}`}
                                            icon={Trash01}
                                            destructive
                                            onClick={() => setDeleting({ kind: "group", item: g })}
                                        />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === active ? undefined : "hidden"}>
                    {t.kind === "modifier" ? (
                        <ModifierRecord
                            modifier={t.modifier}
                            isNew={t.isNew}
                            groups={groups}
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                            onSaved={(m) => {
                                setModifiers((all) => (all.some((x) => x.id === m.id) ? all.map((x) => (x.id === m.id ? m : x)) : [...all, m]));
                                tabs.update(t.key, { modifier: m, isNew: false } as Partial<Tab>);
                            }}
                            onDelete={() => removeModifier(t.modifier)}
                        />
                    ) : (
                        <ModifierGroupRecord
                            group={t.group}
                            isNew={t.isNew}
                            modifiers={modifiers}
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                            onSaved={(g) => {
                                setGroups((all) => (all.some((x) => x.id === g.id) ? all.map((x) => (x.id === g.id ? g : x)) : [...all, g]));
                                tabs.update(t.key, { group: g, isNew: false } as Partial<Tab>);
                            }}
                            onDelete={() => removeGroup(t.group)}
                        />
                    )}
                </div>
            ))}
            {tabs.warning}
            <ConfirmDeleteModal
                isOpen={Boolean(deleting)}
                what={deleting ? (deleting.kind === "modifier" ? deleting.item.title : deleting.item.description) : ""}
                detail={
                    deleting?.kind === "group"
                        ? "Products using this group stop asking for it. The modifiers themselves aren't deleted."
                        : "It's removed from every group and product. Past orders keep it."
                }
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting?.kind === "modifier") removeModifier(deleting.item);
                    if (deleting?.kind === "group") removeGroup(deleting.item);
                    setDeleting(null);
                }}
            />
        </ProductsPage>
    );
};
