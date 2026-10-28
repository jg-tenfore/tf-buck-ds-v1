"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy06, Edit05, Receipt, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { LinkText, TableCard, Td, Th } from "../migration-v2/kit";
import { DAYS, MENUS, type Menu, PRODUCTS_NAV, dateShort, time12 } from "./data";
import {
    ConfirmDeleteModal,
    DaysPicker,
    FieldGrid,
    ProductsPage,
    RecordBody,
    RecordHeader,
    RowIconButton,
    SelectField,
    Toast,
    exportAction,
    useRecordTabs,
    useReportDirty,
} from "./kit";

/** "Every day" / "Weekdays" / "Sat, Sun". */
const daysLabel = (days: string[]) =>
    days.length === 7 ? "Every day" : days.join() === DAYS.slice(1, 6).join() ? "Weekdays" : days.length ? days.join(", ") : "No days";

/** One menu in its tab: its name and when it shows on the ordering screens. New menus can start as a copy of another. */
export const MenuRecord = ({
    menu,
    isNew,
    menus,
    onCancel,
    onDirtyChange,
    onSaved,
    onDuplicate,
    onDelete,
}: {
    menu: Menu;
    isNew?: boolean;
    menus: Menu[];
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
    onSaved: (m: Menu) => void;
    onDuplicate: (m: Menu) => void;
    onDelete: () => void;
}) => {
    const [saved, setSaved] = useState(menu);
    const [form, setForm] = useState(menu);
    const [cloneFrom, setCloneFrom] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const set = (patch: Partial<Menu>) => setForm((f) => ({ ...f, ...patch }));
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);
    useReportDirty(dirty, onDirtyChange);

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={
                    isNew ? (
                        <>
                            New menu
                            <Badge color="gray" size="sm">
                                Draft
                            </Badge>
                        </>
                    ) : (
                        <>Menu {menu.id}</>
                    )
                }
                title={form.title || "New menu"}
                meta={`${daysLabel(form.days)} · ${form.startTime ? `${time12(form.startTime)}–${time12(form.endTime)}` : "All day"}`}
                saveLabel={isNew ? "Create menu" : "Save changes"}
                canSave={dirty && Boolean(form.title.trim())}
                onCancel={onCancel}
                onSave={() => {
                    const m = form.id ? form : { ...form, id: 100 + Math.floor(Math.random() * 900) };
                    setForm(m);
                    setSaved(m);
                    onSaved(m);
                    setMessage(isNew ? `${m.title} created.` : `Changes to ${m.title} saved.`);
                }}
                actions={
                    isNew
                        ? []
                        : [
                              {
                                  id: "duplicate",
                                  label: "Duplicate",
                                  icon: Copy06,
                                  onAction: () => onDuplicate({ ...form, id: 0, title: `Copy of ${form.title}` }),
                              },
                              { id: "delete", label: "Delete menu", icon: Trash01, destructive: true, onAction: () => setConfirmDelete(true) },
                          ]
                }
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
                        content: (
                            <FieldGrid>
                                <Input label="Menu title" isRequired placeholder="e.g. Happy Hour" value={form.title} onChange={(v) => set({ title: v })} />
                                {isNew && (
                                    <SelectField
                                        label="Start from a copy of"
                                        hint="Optional. Copies its schedule and items."
                                        value={cloneFrom}
                                        onChange={(v) => {
                                            setCloneFrom(v);
                                            const src = menus.find((m) => String(m.id) === v);
                                            if (src)
                                                set({
                                                    startDate: src.startDate,
                                                    endDate: src.endDate,
                                                    startTime: src.startTime,
                                                    endTime: src.endTime,
                                                    days: src.days,
                                                });
                                        }}
                                        options={[{ value: "", label: "Blank menu" }, ...menus.map((m) => ({ value: String(m.id), label: m.title }))]}
                                    />
                                )}
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "schedule",
                        tab: "all",
                        title: "Schedule",
                        description: "When the menu shows on the ordering screens. Leave dates or times empty for no limit.",
                        content: (
                            <FieldGrid cols={4}>
                                <Input label="Start date" type="date" value={form.startDate} onChange={(v) => set({ startDate: v })} />
                                <Input label="End date" type="date" value={form.endDate} onChange={(v) => set({ endDate: v })} />
                                <Input label="Start time" type="time" value={form.startTime} onChange={(v) => set({ startTime: v })} />
                                <Input label="End time" type="time" value={form.endTime} onChange={(v) => set({ endTime: v })} />
                            </FieldGrid>
                        ),
                    },
                    {
                        id: "days",
                        tab: "all",
                        title: "Days",
                        description: "The days of the week it's available.",
                        content: <DaysPicker days={DAYS} value={form.days} onChange={(days) => set({ days })} />,
                    },
                ]}
            />
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                what={form.title}
                detail="It comes off every ordering screen. The products on it aren't deleted."
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    onDelete();
                }}
            />
        </div>
    );
};

type Tab = { key: string; menu: Menu; isNew?: boolean };
let drafts = 0;
const blankMenu = (): Menu => ({ id: 0, title: "", startDate: "", endDate: "", startTime: "", endTime: "", days: [] });

/** Products › Menus: the list in screen order (move up / down), and each menu in its own tab. */
export const MenusPage = ({ initialOpen = [] }: { initialOpen?: (number | "new")[] }) => {
    const [rows, setRows] = useState(MENUS);
    const tabs = useRecordTabs<Tab>(
        initialOpen.map((id) =>
            id === "new" ? { key: `new-${++drafts}`, menu: blankMenu(), isNew: true } : { key: `m-${id}`, menu: MENUS.find((m) => m.id === id)! },
        ),
    );
    const [deleting, setDeleting] = useState<Menu | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const openNew = (menu = blankMenu()) => tabs.open({ key: `new-${++drafts}`, menu, isNew: true });
    const move = (i: number, by: number) =>
        setRows((all) => {
            const next = [...all];
            [next[i], next[i + by]] = [next[i + by], next[i]];
            return next;
        });
    const remove = (m: Menu) => {
        setRows((all) => all.filter((x) => x.id !== m.id));
        const open = tabs.tabs.find((t) => t.menu.id === m.id && !t.isNew);
        if (open) tabs.forceClose(open.key);
        setMessage(`${m.title} deleted.`);
    };

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.menus}
            crumbs={["Products", "Menus"]}
            title="Menus"
            description="What each ordering screen shows, and in what order."
            primary={{ id: "add", label: "Add menu", onAction: () => openNew() }}
            secondary={[exportAction("menus")]}
            lists={[{ id: "list", label: "Menus" }]}
            tabs={tabs.tabs.map((t) => ({ id: t.key, label: t.menu.title || "New menu", sublabel: t.isNew ? "Draft" : undefined, icon: Receipt }))}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <Toast message={message} onDismiss={() => setMessage(null)} />
            <div className={tabs.active === "list" ? undefined : "hidden"}>
                <TableCard>
                    <thead>
                        <tr>
                            {["Order", "ID", "Title", "Start date", "End date", "Start time", "End time", "Days", "Actions"].map((h) => (
                                <Th key={h} className={h === "Actions" ? "text-right" : undefined}>
                                    {h}
                                </Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((m, i) => (
                            <tr key={m.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: `m-${m.id}`, menu: m })}>
                                <Td className="py-1.5">
                                    <div className="flex">
                                        <span className={cx(i === 0 && "pointer-events-none opacity-30")}>
                                            <RowIconButton label={`Move ${m.title} up`} icon={ChevronUp} onClick={() => move(i, -1)} />
                                        </span>
                                        <span className={cx(i === rows.length - 1 && "pointer-events-none opacity-30")}>
                                            <RowIconButton label={`Move ${m.title} down`} icon={ChevronDown} onClick={() => move(i, 1)} />
                                        </span>
                                    </div>
                                </Td>
                                <Td className="text-secondary tabular-nums">{m.id}</Td>
                                <Td>
                                    <LinkText>{m.title}</LinkText>
                                </Td>
                                <Td className="text-secondary">{dateShort(m.startDate)}</Td>
                                <Td className="text-secondary">{dateShort(m.endDate)}</Td>
                                <Td className="text-secondary">{time12(m.startTime)}</Td>
                                <Td className="text-secondary">{time12(m.endTime)}</Td>
                                <Td className="text-secondary">{daysLabel(m.days)}</Td>
                                <Td className="py-1.5">
                                    <div className="flex justify-end gap-1">
                                        <RowIconButton label={`Edit ${m.title}`} icon={Edit05} onClick={() => tabs.open({ key: `m-${m.id}`, menu: m })} />
                                        <RowIconButton label={`Delete ${m.title}`} icon={Trash01} destructive onClick={() => setDeleting(m)} />
                                    </div>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    <MenuRecord
                        menu={t.menu}
                        isNew={t.isNew}
                        menus={rows}
                        onCancel={() => tabs.close(t.key)}
                        onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        onSaved={(m) => {
                            setRows((all) => (all.some((r) => r.id === m.id) ? all.map((r) => (r.id === m.id ? m : r)) : [...all, m]));
                            tabs.update(t.key, { menu: m, isNew: false });
                        }}
                        onDuplicate={(m) => openNew(m)}
                        onDelete={() => remove(t.menu)}
                    />
                </div>
            ))}
            {tabs.warning}
            <ConfirmDeleteModal
                isOpen={Boolean(deleting)}
                what={deleting?.title ?? ""}
                detail="It comes off every ordering screen. The products on it aren't deleted."
                onCancel={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) remove(deleting);
                    setDeleting(null);
                }}
            />
        </ProductsPage>
    );
};
