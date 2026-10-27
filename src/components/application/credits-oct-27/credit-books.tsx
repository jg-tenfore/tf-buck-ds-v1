"use client";

import { useState } from "react";
import { BookClosed, Download01, FileDownload02, Plus, PlusCircle, SearchLg, Trash01, UserMinus01, UserPlus01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";
import { money } from "../migration-v2/data";
import { DateField, LinkText, TableCard, Td, Th } from "../migration-v2/kit";
import { CREDITS_NAV, CREDIT_BOOK, CREDIT_BOOK_ROWS, type CreditBookRow, GIFT_CARD_EXPIRATIONS, creditBookTotals } from "./data";
import {
    BalanceStrip,
    CreditsPage,
    Facts,
    RecordBody,
    RecordHeader,
    STd,
    STh,
    SavedNote,
    SectionCard,
    SectionTable,
    type SubTabMode,
    useRecordTabs,
    useReportDirty,
} from "./kit";

const APPLIES = [
    ["merchandise", "Merchandise"],
    ["foodBeverage", "Food & Beverage"],
    ["teeFees", "Tee Fees"],
    ["alcohol", "Alcohol"],
] as const;
type Applies = typeof CREDIT_BOOK.appliesTo;

/** Title, gift card expiration and what its gift cards can be spent on. */
const DetailsFields = ({
    title,
    expiration,
    applies,
    onTitle,
    onExpiration,
    onApplies,
}: {
    title: string;
    expiration: string;
    applies: Applies;
    onTitle: (v: string) => void;
    onExpiration: (v: string) => void;
    onApplies: (v: Applies) => void;
}) => (
    <>
        <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Input label="Title" isRequired value={title} onChange={onTitle} placeholder="e.g. Member-Guest" />
            </div>
            <NativeSelect
                label="Gift card expiration"
                value={expiration}
                onChange={(e) => onExpiration(e.target.value)}
                options={GIFT_CARD_EXPIRATIONS.map((v) => ({ value: v, label: v }))}
            />
        </div>
        <div className="flex flex-col gap-3">
            <div>
                <p className="text-sm font-medium text-secondary">Applies to</p>
                <p className="text-sm text-tertiary">What the gift cards it pays out can be spent on.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {APPLIES.map(([key, label]) => (
                    <div key={key} className="rounded-lg p-4 ring-1 ring-secondary">
                        <Toggle label={label} isSelected={applies[key]} onChange={(on) => onApplies({ ...applies, [key]: on })} />
                    </div>
                ))}
            </div>
        </div>
    </>
);

const SUB_TABS = [
    { id: "details", label: "Details" },
    { id: "customers", label: `Customers (${CREDIT_BOOK.customers.length})` },
    { id: "transactions", label: `Transactions (${CREDIT_BOOK.transactions.length})` },
];

/**
 * One credit book in its tab: Cancel / Save at the top, then full-width
 * sections (balance and funding, details, customers, transactions).
 */
export const CreditBookRecord = ({
    row,
    mode,
    initialTab,
    onCancel,
    onDirtyChange,
}: {
    row: CreditBookRow;
    mode: SubTabMode;
    initialTab?: string;
    onCancel: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) => {
    const [saved, setSaved] = useState({ title: row.title, expiration: CREDIT_BOOK.expiration, applies: CREDIT_BOOK.appliesTo });
    const [title, setTitle] = useState(saved.title);
    const [expiration, setExpiration] = useState(saved.expiration);
    const [applies, setApplies] = useState<Applies>(saved.applies);
    const [selected, setSelected] = useState<string[]>([]);
    const [customerQuery, setCustomerQuery] = useState("");
    const [txQuery, setTxQuery] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const dirty = title !== saved.title || expiration !== saved.expiration || APPLIES.some(([k]) => applies[k] !== saved.applies[k]);
    useReportDirty(dirty, onDirtyChange);
    const cq = customerQuery.trim().toLowerCase();
    const customers = CREDIT_BOOK.customers.filter((c) => !cq || `${c.id} ${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(cq));
    const tq = txQuery.trim().toLowerCase();
    const transactions = CREDIT_BOOK.transactions.filter((t) => !tq || Object.values(t).join(" ").toLowerCase().includes(tq));
    const n = selected.length;

    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                eyebrow={<>Credit book #{row.id}</>}
                title="Edit Credit Book"
                meta={`${saved.title} · ${money(row.balance ?? 0)} balance`}
                canSave={dirty && Boolean(title.trim())}
                onCancel={onCancel}
                onSave={() => {
                    setSaved({ title, expiration, applies });
                    setMessage(`Changes to ${title} saved.`);
                }}
                extra={
                    <Button color="tertiary-destructive" size="md" iconLeading={Trash01}>
                        Delete
                    </Button>
                }
            />
            <SavedNote message={message} />
            <RecordBody
                mode={mode}
                tabs={SUB_TABS}
                initialTab={initialTab}
                sections={[
                    {
                        id: "balance",
                        tab: "details",
                        title: "Balance",
                        description: "Fund the book to pay out gift cards to its customers.",
                        aside: (
                            <div className="flex gap-2">
                                <Button color="secondary" size="sm" iconLeading={FileDownload02}>
                                    Import order
                                </Button>
                                <Button size="sm" iconLeading={PlusCircle}>
                                    Fund credit book
                                </Button>
                            </div>
                        ),
                        content: (
                            <>
                                <BalanceStrip
                                    items={[
                                        { label: "Balance", value: money(row.balance ?? 0), strong: true },
                                        { label: "Customers", value: String(CREDIT_BOOK.customers.length) },
                                        { label: "Transactions", value: String(CREDIT_BOOK.transactions.length) },
                                        { label: "Created", value: CREDIT_BOOK.created },
                                    ]}
                                />
                                <Facts
                                    columns={2}
                                    items={[
                                        ["Credit book", `#${row.id}`],
                                        ["Gift card expiration", saved.expiration],
                                    ]}
                                />
                            </>
                        ),
                    },
                    {
                        id: "details",
                        tab: "details",
                        title: "Details",
                        description: "What it's called and what its gift cards can be spent on.",
                        content: (
                            <DetailsFields
                                title={title}
                                expiration={expiration}
                                applies={applies}
                                onTitle={setTitle}
                                onExpiration={setExpiration}
                                onApplies={setApplies}
                            />
                        ),
                    },
                    {
                        id: "customers",
                        tab: "customers",
                        title: `Customers (${CREDIT_BOOK.customers.length})`,
                        description: n ? `${n} selected` : "Select customers to charge, pay out or remove.",
                        aside: (
                            <div className="flex flex-wrap gap-2">
                                <Button color="secondary" size="sm" isDisabled={!n}>
                                    Charge ({n})
                                </Button>
                                <Button color="secondary" size="sm" isDisabled={!n}>
                                    Pay out ({n})
                                </Button>
                                <Button color="secondary" size="sm" iconLeading={UserMinus01} isDisabled={!n}>
                                    Remove ({n})
                                </Button>
                                <Button size="sm" iconLeading={UserPlus01}>
                                    Add customer
                                </Button>
                            </div>
                        ),
                        content: (
                            <>
                                <Input
                                    aria-label="Search customers"
                                    placeholder="Search by name, email, phone or ID"
                                    icon={SearchLg}
                                    value={customerQuery}
                                    onChange={setCustomerQuery}
                                />
                                <div className="max-h-[420px] overflow-y-auto">
                                    <SectionTable
                                        head={
                                            <tr>
                                                <STh className="w-10">
                                                    <Checkbox
                                                        aria-label="Select all"
                                                        isSelected={n > 0 && n === customers.length}
                                                        isIndeterminate={n > 0 && n < customers.length}
                                                        onChange={(on) => setSelected(on ? customers.map((c) => c.id) : [])}
                                                    />
                                                </STh>
                                                <STh>ID</STh>
                                                <STh>Name</STh>
                                                <STh>Email</STh>
                                                <STh>Phone</STh>
                                            </tr>
                                        }
                                    >
                                        {customers.map((c) => (
                                            <tr key={c.id}>
                                                <STd>
                                                    <Checkbox
                                                        aria-label={`Select ${c.name}`}
                                                        isSelected={selected.includes(c.id)}
                                                        onChange={(on) => setSelected((s) => (on ? [...s, c.id] : s.filter((id) => id !== c.id)))}
                                                    />
                                                </STd>
                                                <STd>{c.id}</STd>
                                                <STd>
                                                    <LinkText>{c.name}</LinkText>
                                                </STd>
                                                <STd>{c.email ?? "—"}</STd>
                                                <STd>{c.phone ?? "—"}</STd>
                                            </tr>
                                        ))}
                                    </SectionTable>
                                </div>
                            </>
                        ),
                    },
                    {
                        id: "transactions",
                        tab: "transactions",
                        title: `Transactions (${CREDIT_BOOK.transactions.length})`,
                        description: "Every payout, charge and funding on this book.",
                        content: (
                            <>
                                <Input
                                    aria-label="Search transactions"
                                    placeholder="Search by type, employee, customer, ID, amount or date"
                                    icon={SearchLg}
                                    value={txQuery}
                                    onChange={setTxQuery}
                                />
                                <div className="max-h-[420px] overflow-y-auto">
                                    <SectionTable
                                        head={
                                            <tr>
                                                <STh>ID</STh>
                                                <STh>Date</STh>
                                                <STh>Type</STh>
                                                <STh>Employee</STh>
                                                <STh>Paid customer</STh>
                                                <STh>Gift card</STh>
                                                <STh>Charged customer</STh>
                                                <STh>Order ID</STh>
                                                <STh className="text-right">Amount</STh>
                                            </tr>
                                        }
                                    >
                                        {transactions.map((t) => (
                                            <tr key={t.id}>
                                                <STd>{t.id}</STd>
                                                <STd>{t.date}</STd>
                                                <STd>{t.type}</STd>
                                                <STd>{t.employee}</STd>
                                                <STd>—</STd>
                                                <STd>
                                                    <LinkText>{t.giftCard}</LinkText>
                                                </STd>
                                                <STd>—</STd>
                                                <STd>—</STd>
                                                <STd className="text-right tabular-nums">{money(t.amount)}</STd>
                                            </tr>
                                        ))}
                                    </SectionTable>
                                </div>
                            </>
                        ),
                    },
                ]}
            />
        </div>
    );
};

/** "Add Credit Book": a draft tab with the details; balance and customers come after it's saved. */
export const NewCreditBook = ({
    onCancel,
    onDirtyChange,
    onSaved,
}: {
    onCancel: () => void;
    onDirtyChange?: (d: boolean) => void;
    onSaved: (row: CreditBookRow) => void;
}) => {
    const [title, setTitle] = useState("");
    const [expiration, setExpiration] = useState("Course default");
    const [applies, setApplies] = useState<Applies>({ merchandise: true, foodBeverage: true, teeFees: true, alcohol: true });
    useReportDirty(Boolean(title) || expiration !== "Course default" || APPLIES.some(([k]) => !applies[k]), onDirtyChange);
    return (
        <div className="flex flex-col gap-5">
            <RecordHeader
                title="New Credit Book"
                saveLabel="Save Credit Book"
                canSave={Boolean(title.trim())}
                onCancel={onCancel}
                onSave={() => onSaved({ id: "734", title, customers: 0, transactions: 0, balance: 0 })}
            />
            <SectionCard title="Details" description="What it's called and what its gift cards can be spent on.">
                <DetailsFields title={title} expiration={expiration} applies={applies} onTitle={setTitle} onExpiration={setExpiration} onApplies={setApplies} />
            </SectionCard>
            <SectionCard title="Balance" description="Fund the book and add customers once it's saved.">
                <BalanceStrip
                    items={[
                        { label: "Balance", value: money(0), strong: true },
                        { label: "Customers", value: "0" },
                        { label: "Transactions", value: "0" },
                    ]}
                />
            </SectionCard>
        </div>
    );
};

type Tab = { key: string; row?: CreditBookRow };

/** Reports › Credits › Credit Books: the list, each book in its own tab, and Add as a draft tab. */
export const CreditBooksPage = ({
    mode = "sections",
    initialOpen = [],
    initialTab,
}: {
    mode?: SubTabMode;
    /** Credit book ids to open ("new" for a draft); the last is active. */
    initialOpen?: string[];
    /** Sub-tab to start on (mode B). */
    initialTab?: string;
}) => {
    const [rows, setRows] = useState(CREDIT_BOOK_ROWS);
    const tabs = useRecordTabs<Tab>(initialOpen.map((id) => (id === "new" ? { key: "new" } : { key: id, row: CREDIT_BOOK_ROWS.find((r) => r.id === id)! })));
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const shown = rows.filter((r) => !q || `${r.id} ${r.title}`.toLowerCase().includes(q));
    const totals = creditBookTotals(shown);

    return (
        <CreditsPage
            navId={CREDITS_NAV.creditBooks}
            crumbs={["Reports", "Credits", "Credit Books"]}
            title="Credit Books"
            description="Course-funded credit balances customers can spend against."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Export CSV
                    </Button>
                    <Button size="md" iconLeading={Plus} onClick={() => tabs.open({ key: "new" })}>
                        Add Credit Book
                    </Button>
                </>
            }
            listLabel="Credit books"
            tabs={tabs.tabs.map((t) =>
                t.row
                    ? { id: t.key, label: t.row.title, sublabel: money(t.row.balance ?? 0), icon: BookClosed }
                    : { id: t.key, label: "New credit book", sublabel: "Draft", icon: BookClosed },
            )}
            activeId={tabs.active}
            onSelect={tabs.setActive}
            onClose={tabs.close}
        >
            <div className={tabs.active === "list" ? "flex flex-col gap-4" : "hidden"}>
                <div className="flex gap-3">
                    <DateField placeholder="As of today" className="w-48" />
                    <div className="flex-1">
                        <Input aria-label="Search credit books" placeholder="Search by title or ID" icon={SearchLg} value={query} onChange={setQuery} />
                    </div>
                </div>
                <TableCard>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>Title</Th>
                            <Th className="text-right">Customers</Th>
                            <Th className="text-right">Transactions</Th>
                            <Th className="text-right">Balance</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((r) => (
                            <tr key={r.id} className="cursor-pointer hover:bg-primary_hover" onClick={() => tabs.open({ key: r.id, row: r })}>
                                <Td className="text-secondary">{r.id}</Td>
                                <Td>
                                    <LinkText>{r.title}</LinkText>
                                </Td>
                                <Td className="text-right tabular-nums">{r.customers}</Td>
                                <Td className="text-right tabular-nums">{r.transactions}</Td>
                                <Td className="text-right font-medium tabular-nums">{r.balance === null ? "—" : money(r.balance)}</Td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2} className="border-t border-secondary bg-secondary px-4 py-3 text-sm font-medium text-secondary">
                                {shown.length} credit books
                            </td>
                            <td colSpan={3} className="border-t border-secondary bg-secondary px-4 py-3 text-right text-sm text-secondary">
                                <span className="mr-6">
                                    In credit <span className="font-semibold text-primary">{money(totals.inCredit)}</span>
                                </span>
                                <span className="mr-6">
                                    Overdrawn <span className="font-semibold text-primary">{money(totals.overdrawn)}</span>
                                </span>
                                Net balance <span className="font-semibold text-brand-secondary">{money(totals.net)}</span>
                            </td>
                        </tr>
                    </tfoot>
                </TableCard>
            </div>
            {tabs.tabs.map((t) => (
                <div key={t.key} className={t.key === tabs.active ? undefined : "hidden"}>
                    {t.row ? (
                        <CreditBookRecord
                            row={t.row}
                            mode={mode}
                            initialTab={initialTab}
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                        />
                    ) : (
                        <NewCreditBook
                            onCancel={() => tabs.close(t.key)}
                            onDirtyChange={(d) => tabs.setDirty(t.key, d)}
                            onSaved={(row) => {
                                setRows((all) => [row, ...all]);
                                tabs.forceClose(t.key);
                                tabs.open({ key: row.id, row });
                            }}
                        />
                    )}
                </div>
            ))}
            {tabs.warning}
        </CreditsPage>
    );
};
