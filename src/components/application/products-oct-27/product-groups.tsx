"use client";

import { useState } from "react";
import { CheckCircle, FolderPlus, Image01, LayersThree01, Menu01, Plus, SearchLg, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { LinkText, ScreenModal, TableCard, Td, Th } from "../migration-v2/kit";
import {
    COURSES,
    GL_CODES,
    MODIFIER_GROUP_NAMES,
    MODIFIER_NAMES,
    PRODUCTS_NAV,
    PRODUCT_FAMILIES,
    PRODUCT_GROUPS,
    type ProductGroup,
    QB_CLASSES,
    STAR_PRINTERS,
} from "./data";
import {
    ConfirmDeleteModal,
    FieldGrid,
    ImageField,
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
    ToggleGrid,
    TokenField,
    useRecordTabs,
    useReportDirty,
} from "./kit";

type Form = ProductGroup & { courses: string[]; printers: string[]; modifiers: string[]; modifierGroups: string[] };
const toForm = (g: ProductGroup): Form => ({
    ...g,
    courses: g.sellOnline ? [COURSES[0]] : [],
    printers: g.family === "Food" ? ["Kitchen"] : g.family === "Beverages" ? ["Bar"] : [],
    modifiers: [],
    modifierGroups: g.name === "Liquor" ? ["Mixers"] : [],
});

/** Name a new product family (the parent of product groups). */
export const AddFamilyModal = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (name: string) => void }) => {
    const [name, setName] = useState("");
    return (
        <ScreenModal
            title="Add a product family"
            isOpen={isOpen}
            onClose={onClose}
            footer={
                <>
                    <Button color="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        isDisabled={!name.trim()}
                        onClick={() => {
                            onSave(name.trim());
                            setName("");
                            onClose();
                        }}
                    >
                        Save family
                    </Button>
                </>
            }
        >
            <p className="text-sm text-secondary">Families are the parent of product groups, used to roll groups up in reports.</p>
            <Input label="Family name" placeholder="e.g. Pro Shop Merch" value={name} onChange={setName} autoFocus />
        </ScreenModal>
    );
};

/** One product group in its tab: details, where it's used, image and sub-groups. */
export const ProductGroupRecord = ({
    group,
    isNew,
    families,
    onAddFamily,
    onCancel,
    onDirtyChange,
    onSaved,
    onDelete,
}: {
    group: ProductGroup;
    isNew?: boolean;
    families: string[];
    onAddFamily: () => void;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (g: ProductGroup) => void;
    onDelete: () => void;
}) => {
    const [saved, setSaved] = useState(() => toForm(group));
    const [form, setForm] = useState(() => toForm(group));
    const [newSub, setNewSub] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New product group
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Product group {group.id}</>
                    )
                }
                title={form.name || "New product group"}
                meta={form.family ? `${form.family} family · ${form.subGroups.length} sub-groups` : "Name it and pick a family to save."}
                saveLabel={isNew ? "Create group" : "Save changes"}
                canSave={dirty && Boolean(form.name.trim() && form.family)}
                onCancel={onCancel}
                onSave={() => {
                    const g = form.id ? form : { ...form, id: 5000 + Math.floor(Math.random() * 999) };
                    setForm(g);
                    setSaved(g);
                    onSaved(g);
                    setMessage(isNew ? `${g.name} created.` : `Changes to ${g.name} saved.`);
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
                        description: "What the group is called, the family it rolls up to, and its accounting codes.",
                        content: (
                            <FieldGrid>
                                <Input label="Name" isRequired placeholder="e.g. Golf Balls" value={form.name} onChange={(v) => set({ name: v })} />
                                <div className="flex flex-col gap-1.5">
                                    <SelectField
                                        label="Product family"
                                        value={form.family}
                                        onChange={(v) => set({ family: v })}
                                        options={[{ value: "", label: "Select a family" }, ...families]}
                                    />
                                    <button
                                        type="button"
                                        onClick={onAddFamily}
                                        className="w-fit cursor-pointer text-sm font-medium text-brand-secondary hover:underline"
                                    >
                                        + Add a family
                                    </button>
                                </div>
                                <SelectField
                                    label="General ledger code"
                                    value={form.gl ?? "None"}
                                    onChange={(v) => set({ gl: v === "None" ? undefined : v })}
                                    options={GL_CODES}
                                />
                                <SelectField
                                    label="QuickBooks class"
                                    value={form.qbClass ?? "None"}
                                    onChange={(v) => set({ qbClass: v === "None" ? undefined : v })}
                                    options={QB_CLASSES}
                                />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "used",
                        tab: "all",
                        title: "Where It's Used",
                        description: "Courses that share this group, the printers its orders go to, and the modifiers every product in it gets.",
                        content: (
                            <FieldGrid>
                                <TokenField
                                    label="Universal product courses"
                                    value={form.courses}
                                    options={COURSES}
                                    onChange={(v) => set({ courses: v })}
                                    placeholder="Add a course…"
                                />
                                <TokenField
                                    label="Star printers"
                                    value={form.printers}
                                    options={STAR_PRINTERS}
                                    onChange={(v) => set({ printers: v })}
                                    placeholder="Add a printer…"
                                />
                                <TokenField
                                    label="Modifiers"
                                    value={form.modifiers}
                                    options={MODIFIER_NAMES}
                                    onChange={(v) => set({ modifiers: v })}
                                    placeholder="Add a modifier…"
                                />
                                <TokenField
                                    label="Modifier groups"
                                    value={form.modifierGroups}
                                    options={MODIFIER_GROUP_NAMES}
                                    onChange={(v) => set({ modifierGroups: v })}
                                    placeholder="Add a modifier group…"
                                />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "settings",
                        tab: "all",
                        title: "Settings",
                        content: (
                            <ToggleGrid
                                items={[
                                    { id: "sellOnline", label: "Sell online", hint: "Products in this group show in the online shop." },
                                    {
                                        id: "forceServiceCharge",
                                        label: "Force service charge",
                                        hint: "Always add the service charge, even when it's turned off for the order.",
                                    },
                                ]}
                                values={{ sellOnline: form.sellOnline, forceServiceCharge: form.forceServiceCharge }}
                                onChange={(id, on) => set({ [id]: on })}
                            />
                        ),
                    },
                    {
                        id: "image",
                        tab: "all",
                        title: "Image",
                        description: "Shown on the group's button on the ordering screens and in the online shop.",
                        content: <ImageField label="Group image" />,
                    },
                    {
                        id: "subgroups",
                        tab: "all",
                        title: "Sub-Groups",
                        description: "Narrower groups inside this one, used for filtering and reports.",
                        aside: (
                            <Button color="secondary" size="sm" iconLeading={Plus} onClick={() => setNewSub("")}>
                                New sub-group
                            </Button>
                        ),
                        content: (
                            <>
                                {newSub !== null && (
                                    <div className="flex flex-wrap items-end gap-3 rounded-lg bg-secondary p-4">
                                        <div className="min-w-64 flex-1">
                                            <Input label="Sub-group name" placeholder="e.g. Gloves" value={newSub} onChange={setNewSub} autoFocus />
                                        </div>
                                        <Button color="secondary" size="md" onClick={() => setNewSub(null)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="md"
                                            isDisabled={!newSub.trim()}
                                            onClick={() => {
                                                set({ subGroups: [...form.subGroups, { id: 9000 + form.subGroups.length, name: newSub.trim() }] });
                                                setNewSub(null);
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                )}
                                <SectionTable
                                    head={
                                        <tr>
                                            <STh>Image</STh>
                                            <STh>ID</STh>
                                            <STh>Name</STh>
                                            <STh />
                                        </tr>
                                    }
                                    empty={!form.subGroups.length && <SectionEmpty>No sub-groups yet. Use New sub-group to add one.</SectionEmpty>}
                                >
                                    {form.subGroups.map((s) => (
                                        <tr key={s.id}>
                                            <STd>
                                                <span className="flex size-8 items-center justify-center rounded-md bg-secondary">
                                                    <Image01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                </span>
                                            </STd>
                                            <STd className="tabular-nums">{s.id >= 9000 ? "New" : s.id}</STd>
                                            <STd className="font-medium text-primary">{s.name}</STd>
                                            <STd className="py-1.5">
                                                <div className="flex justify-end">
                                                    <RowIconButton
                                                        label={`Remove ${s.name}`}
                                                        icon={Trash01}
                                                        destructive
                                                        onClick={() => set({ subGroups: form.subGroups.filter((x) => x.id !== s.id) })}
                                                    />
                                                </div>
                                            </STd>
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
                detail="Products in this group keep their settings but will need a new default group."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

type Tab = { key: string; group: ProductGroup; isNew?: boolean };
let drafts = 0;
const blankGroup = (): ProductGroup => ({ id: 0, name: "", family: "", sellOnline: false, forceServiceCharge: false, subGroups: [] });

/** Products › Groups: the list (drag to reorder), and each group in its own tab. */
export const ProductGroupsPage = ({ initialOpen = [], initialModal }: { initialOpen?: (number | "new")[]; initialModal?: "family" }) => {
    const [rows, setRows] = useState(PRODUCT_GROUPS);
    const [families, setFamilies] = useState(PRODUCT_FAMILIES);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((id) =>
            id === "new" ? { key: `new-${++drafts}`, group: blankGroup(), isNew: true } : { key: `g-${id}`, group: PRODUCT_GROUPS.find((g) => g.id === id)! },
        ),
    );
    const [familyOpen, setFamilyOpen] = useState(initialModal === "family");
    const [deleting, setDeleting] = useState<ProductGroup | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [dragging, setDragging] = useState<number | null>(null);
    const q = query.trim().toLowerCase();
    const shown = rows.filter((g) => !q || `${g.id} ${g.name} ${g.family}`.toLowerCase().includes(q));
    const remove = (g: ProductGroup) => {
        setRows((all) => all.filter((x) => x.id !== g.id));
        const open = tabs.tabs.find((t) => t.group.id === g.id && !t.isNew);
        if (open) tabs.forceClose(open.key);
        setMessage(`${g.name} deleted.`);
    };

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.groups}
            crumbs={["Products", "Groups"]}
            title="Product Groups"
            description="How products are grouped for reporting and for the ordering screens."
            primary={{ id: "new", label: "New group", onAction: () => tabs.open({ key: `new-${++drafts}`, group: blankGroup(), isNew: true }) }}
            secondary={[{ id: "family", label: "Add family", icon: FolderPlus, onAction: () => setFamilyOpen(true) }]}
            lists={[{ id: "list", label: "Groups" }]}
            tabs={tabs.tabs.map((t) => ({
                id: t.key,
                label: t.group.name || "New product group",
                sublabel: t.isNew ? "Draft" : undefined,
                icon: LayersThree01,
            }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={tabs.active === "list" ? "flex flex-col gap-4" : "hidden"}>
                <Input aria-label="Search groups" placeholder="Search name, family or ID" icon={SearchLg} value={query} onChange={setQuery} />
                <TableCard>
                    <thead>
                        <tr>
                            <Th className="w-10">
                                <span className="sr-only">Reorder</span>
                            </Th>
                            {["Image", "ID", "Name", "Family", "Sell online", "Force service charge", "GL code", "QB class", ""].map((h, i) => (
                                <Th key={i}>{h}</Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((g) => (
                            <tr
                                key={g.id}
                                draggable={!q}
                                onDragStart={() => setDragging(g.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (dragging === null || dragging === g.id) return;
                                    setRows((all) => {
                                        const from = all.findIndex((x) => x.id === dragging);
                                        const to = all.findIndex((x) => x.id === g.id);
                                        const next = [...all];
                                        next.splice(to, 0, next.splice(from, 1)[0]);
                                        return next;
                                    });
                                }}
                                onDragEnd={() => setDragging(null)}
                                onClick={() => tabs.open({ key: `g-${g.id}`, group: g })}
                                className={dragging === g.id ? "bg-active" : "cursor-pointer hover:bg-primary_hover"}
                            >
                                <Td>
                                    <Menu01 className="size-4 cursor-grab text-fg-quaternary" aria-label="Drag to reorder" />
                                </Td>
                                <Td>
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-secondary ring-1 ring-secondary">
                                        <Image01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    </span>
                                </Td>
                                <Td className="text-secondary tabular-nums">{g.id}</Td>
                                <Td>
                                    <LinkText>{g.name}</LinkText>
                                </Td>
                                <Td className="text-secondary">{g.family}</Td>
                                <Td>
                                    {g.sellOnline ? (
                                        <CheckCircle className="size-5 text-fg-success-secondary" aria-label="Yes" />
                                    ) : (
                                        <span className="text-quaternary">—</span>
                                    )}
                                </Td>
                                <Td>
                                    {g.forceServiceCharge ? (
                                        <CheckCircle className="size-5 text-fg-success-secondary" aria-label="Yes" />
                                    ) : (
                                        <span className="text-quaternary">—</span>
                                    )}
                                </Td>
                                <Td className="text-secondary tabular-nums">{g.gl ?? "—"}</Td>
                                <Td className="text-secondary">{g.qbClass ?? "—"}</Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end">
                                        <RowIconButton label={`Delete ${g.name}`} icon={Trash01} destructive onClick={() => setDeleting(g)} />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
                <p className="text-xs text-tertiary">Drag rows to change the order groups appear on the ordering screens.</p>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <ProductGroupRecord
                        group={t.group}
                        isNew={t.isNew}
                        families={families}
                        onAddFamily={() => setFamilyOpen(true)}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        onSaved={(g) => {
                            setRows((all) => (all.some((r) => r.id === g.id) ? all.map((r) => (r.id === g.id ? g : r)) : [...all, g]));
                            tabs.update(t.key, { group: g, isNew: false });
                        }}
                        onDelete={() => remove(t.group)}
                    />
                </div>
            ))}
            {tabs.warning}
            <AddFamilyModal
                isOpen={familyOpen}
                onClose={() => setFamilyOpen(false)}
                onSave={(name) => {
                    setFamilies((f) => [...f, name]);
                    setMessage(`Family "${name}" added.`);
                }}
            />
            <ConfirmDeleteModal
                isOpen={Boolean(deleting)}
                what={deleting?.name ?? ""}
                detail="Products in this group keep their settings but will need a new default group."
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) remove(deleting);
                    setDeleting(null);
                }}
            />
        </ProductsPage>
    );
};
