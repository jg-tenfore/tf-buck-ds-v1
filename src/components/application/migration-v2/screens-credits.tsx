"use client";

import { useState } from "react";
import {
    BookClosed,
    CheckCircle,
    Edit03,
    File02,
    FileDownload02,
    FilterFunnel01,
    Gift01,
    Plus,
    PlusCircle,
    Save01,
    SearchLg,
    Table,
    Trash01,
    User01,
    UserMinus01,
    UserPlus01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { CustomerProfileView } from "./customer-profile";
import { CREDIT_BOOKS, CREDIT_BOOK_CUSTOMERS, CREDIT_BOOK_DETAIL, CREDIT_BOOK_TRANSACTIONS, CUSTOMERS, PUNCH_CARDS, money } from "./data";
import {
    Dash,
    DateField,
    ExportButton,
    FieldLabel,
    HeaderAction,
    InnerTabs,
    LinkText,
    ScreenModal,
    ScreenShell,
    TabStrip,
    TableCard,
    Td,
    Th,
    clickableRow,
} from "./kit";
import { NAV_IDS } from "./nav-tree";

/* ========================================================================== */
/*  1 · Credits › Punch Cards                                                 */
/* ========================================================================== */

export type PunchCardsView = "list" | "bulk" | "bulk-new-customer" | "customer";

/**
 * Punch Cards report: every punch card sold and how many punches are left.
 * Bulk Entry (for back-filling paper cards) and a customer's profile open as
 * closable tabs beside the list.
 */
export const PunchCardsScreen = ({
    initialView = "list",
    onOpenRow,
    onBulkEntry,
}: {
    initialView?: PunchCardsView;
    /** Ideas: open a row in the proposal instead of today's customer tab. */
    onOpenRow?: (index: number) => void;
    onBulkEntry?: () => void;
}) => {
    const [view, setView] = useState<PunchCardsView>(initialView);
    const [openTabs, setOpenTabs] = useState(() => ({
        bulk: initialView === "bulk" || initialView === "bulk-new-customer",
        customer: initialView === "customer",
    }));
    const [newCustomer, setNewCustomer] = useState(initialView === "bulk-new-customer");

    const tabs = [
        { id: "list", label: "Punch Cards" },
        ...(openTabs.bulk ? [{ id: "bulk", label: "Bulk Entry", icon: Table, closable: true }] : []),
        ...(openTabs.customer ? [{ id: "customer", label: CUSTOMERS.mara.name, icon: User01, closable: true }] : []),
    ];
    const activeTab = view === "bulk-new-customer" ? "bulk" : view;

    const open = (tab: "bulk" | "customer") => {
        setOpenTabs((t) => ({ ...t, [tab]: true }));
        setView(tab);
    };
    const close = (id: string) => {
        setOpenTabs((t) => ({ ...t, [id]: false }));
        setView("list");
    };

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.punchCards, initialQuery: "punch" }}
            title="Punch Cards"
            description="Punch cards sold, and how many punches are left."
            tabs={<TabStrip tabs={tabs} activeId={activeTab} onSelect={(id) => setView(id as PunchCardsView)} onClose={close} />}
        >
            {view === "list" && (
                <PunchCardList
                    linkIds={Boolean(onOpenRow)}
                    onBulkEntry={onBulkEntry ?? (() => open("bulk"))}
                    onCustomer={(i) => (onOpenRow ? onOpenRow(i) : open("customer"))}
                />
            )}
            {(view === "bulk" || view === "bulk-new-customer") && <BulkEntry newCustomer={newCustomer} onToggleNewCustomer={() => setNewCustomer((v) => !v)} />}
            {view === "customer" && <CustomerProfileView customer={CUSTOMERS.mara} />}
        </ScreenShell>
    );
};

const PunchCardList = ({ onBulkEntry, onCustomer, linkIds }: { onBulkEntry: () => void; onCustomer: (index: number) => void; linkIds?: boolean }) => (
    <>
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <Input aria-label="Search punch cards" placeholder="Search" icon={SearchLg} inputClassName="pr-10" />
                <FilterFunnel01 className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-fg-quaternary" aria-hidden="true" />
            </div>
            <Button size="md" iconLeading={Table} onClick={onBulkEntry}>
                Bulk Entry
            </Button>
            <ExportButton />
        </div>
        <TableCard>
            <thead>
                <tr>
                    {[
                        "CPC ID",
                        "GCC ID",
                        "Customer Name",
                        "Member",
                        "Order ID",
                        "Order Item ID",
                        "Price Pre-Tax",
                        "Date Created",
                        "Date Expired",
                        "Rounds Awarded",
                        "Rounds Used",
                        "Rounds Remaining",
                    ].map((h) => (
                        <Th key={h}>{h}</Th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {PUNCH_CARDS.map((r, i) => (
                    <tr key={r.cpcId} {...clickableRow(linkIds ? () => onCustomer(i) : undefined)}>
                        <Td>{linkIds ? <LinkText onClick={() => onCustomer(i)}>{r.cpcId}</LinkText> : r.cpcId}</Td>
                        <Td>{r.gccId}</Td>
                        <Td className="max-w-40 whitespace-normal">{r.customer ? <LinkText onClick={() => onCustomer(i)}>{r.customer}</LinkText> : "N/A"}</Td>
                        <Td>{r.member ? <LinkText>{r.member}</LinkText> : "N/A"}</Td>
                        <Td>{r.orderId ? <LinkText>{r.orderId}</LinkText> : "N/A"}</Td>
                        <Td>{r.orderItemId ? <LinkText>{r.orderItemId}</LinkText> : "N/A"}</Td>
                        <Td className="tabular-nums">{r.pricePreTax}</Td>
                        <Td>{r.created}</Td>
                        <Td>{r.expires}</Td>
                        <Td className="tabular-nums">{r.awarded}</Td>
                        <Td className="tabular-nums">{r.used}</Td>
                        <Td className="tabular-nums">{r.awarded - r.used}</Td>
                    </tr>
                ))}
            </tbody>
        </TableCard>
    </>
);

const BulkEntry = ({ newCustomer, onToggleNewCustomer }: { newCustomer: boolean; onToggleNewCustomer: () => void }) => (
    <div className="flex flex-1 flex-col gap-5">
        <div className="grid grid-cols-1 gap-6 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
                <Label>Punch Card Product</Label>
                <Select
                    aria-label="Punch card product"
                    placeholder="Select"
                    items={[
                        { id: "10", label: "10-Round Punch Card" },
                        { id: "3", label: "3-Round Punch Card" },
                    ]}
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            </div>
            <div className="flex flex-col gap-1.5">
                <DateField label="Default Expiration" />
                <span className="text-sm text-tertiary">Applied to every new row. Override per card if needed.</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-primary">How to use</span>
                <p className="text-sm text-tertiary">
                    Pick the punch-card product these paper cards correspond to, set the batch expiration, then add one row per paper card. For each card, find
                    the customer or enter their info, and count how many holes have been punched out.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-[3rem_minmax(0,1fr)_12rem_16rem_2.5rem] items-start gap-4 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
            <span className="pt-9 text-sm font-semibold text-secondary">#1</span>
            <div className="flex flex-col gap-1.5">
                <FieldLabel>{newCustomer ? "New Customer" : "Customer"}</FieldLabel>
                {newCustomer ? (
                    <div className="grid grid-cols-2 gap-3">
                        <Input aria-label="First name" placeholder="First name" />
                        <Input aria-label="Last name" placeholder="Last name" />
                        <Input aria-label="Email" placeholder="Email" type="email" />
                        <Input aria-label="Phone" placeholder="Phone" type="tel" />
                        <span className="col-span-2 text-sm text-tertiary">Email or phone is required.</span>
                    </div>
                ) : (
                    <Input aria-label="Customer" placeholder="Search customers" icon={SearchLg} />
                )}
                <button
                    type="button"
                    onClick={onToggleNewCustomer}
                    className="mt-1 w-max cursor-pointer text-sm font-medium text-brand-secondary underline hover:text-brand-secondary_hover"
                >
                    {newCustomer ? "Look up an existing customer instead" : "Can't find them? Enter a new customer"}
                </button>
            </div>
            <Input label="Rounds Used" defaultValue="0" type="number" />
            <DateField label="Expiration Override" />
            <button
                type="button"
                aria-label="Remove row"
                className="mt-8 flex size-10 cursor-pointer items-center justify-center rounded-md text-fg-error-secondary hover:bg-error-primary"
            >
                <Trash01 className="size-5" />
            </button>
        </div>

        {/* pr-28 keeps the action buttons clear of the floating chat bubble. */}
        <div className="sticky bottom-0 -mx-8 mt-auto flex items-center justify-between gap-4 border-t border-secondary bg-primary py-4 pr-28 pl-8">
            <span className="flex items-center gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1.5">
                    <CheckCircle className="size-5 text-fg-success-secondary" />
                    Saved: 0
                </span>
                <span>Remaining: 1</span>
            </span>
            <div className="flex items-center gap-3">
                <Button color="secondary" size="md" iconLeading={Plus}>
                    Add Row
                </Button>
                <Button size="md" iconLeading={Save01} isDisabled>
                    Save All Pending
                </Button>
            </div>
        </div>
    </div>
);

/* ========================================================================== */
/*  2 · Credits › Credit Books                                                */
/* ========================================================================== */

export type CreditBooksView = "list" | "add" | "details" | "fund" | "customers" | "customer" | "transactions";

/**
 * Credit Books: course-funded balances customers can spend against. A book
 * opens as a tab with Details / Customers / Transactions; customers open as a
 * further tab. Add and Fund are modal flows.
 */
export const CreditBooksScreen = ({ initialView = "list", onOpenRow }: { initialView?: CreditBooksView; onOpenRow?: (index: number) => void }) => {
    const bookOpenInitially = initialView !== "list" && initialView !== "add";
    const [bookOpen, setBookOpen] = useState(bookOpenInitially);
    const [customerOpen, setCustomerOpen] = useState(initialView === "customer");
    const [tab, setTab] = useState<"list" | "book" | "customer">(initialView === "customer" ? "customer" : bookOpenInitially ? "book" : "list");
    const [section, setSection] = useState<"details" | "customers" | "transactions">(
        initialView === "customers" ? "customers" : initialView === "transactions" ? "transactions" : "details",
    );
    const [modal, setModal] = useState<"add" | "fund" | null>(initialView === "add" ? "add" : initialView === "fund" ? "fund" : null);

    const tabs = [
        { id: "list" },
        ...(bookOpen ? [{ id: "book", label: CREDIT_BOOK_DETAIL.title, sublabel: money(CREDIT_BOOK_DETAIL.balance), icon: BookClosed, closable: true }] : []),
        ...(customerOpen ? [{ id: "customer", label: `Customer ${CUSTOMERS.aaron.gccId}`, icon: User01, closable: true }] : []),
    ];

    const openBook = () => {
        setBookOpen(true);
        setTab("book");
    };
    const close = (id: string) => {
        if (id === "book") {
            setBookOpen(false);
            setCustomerOpen(false);
        }
        if (id === "customer") setCustomerOpen(false);
        setTab(id === "customer" && bookOpen ? "book" : "list");
    };

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.creditBooks, initialQuery: "cred" }}
            title="Credit Books"
            description="Course-funded credit balances customers can spend against."
            action={<HeaderAction label="Add Credit Book" onClick={() => setModal("add")} />}
            tabs={<TabStrip tabs={tabs} activeId={tab} onSelect={(id) => setTab(id as typeof tab)} onClose={close} />}
        >
            {tab === "list" && <CreditBookList linkTitles={Boolean(onOpenRow)} onOpen={(i) => (onOpenRow ? onOpenRow(i) : openBook())} />}
            {tab === "book" && (
                <>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <InnerTabs
                            tabs={[
                                { id: "details", label: "Details" },
                                { id: "customers", label: `Customers (${CREDIT_BOOK_CUSTOMERS.length})` },
                                { id: "transactions", label: `Transactions (${CREDIT_BOOK_TRANSACTIONS.length})` },
                            ]}
                            activeId={section}
                            onChange={(id) => setSection(id as typeof section)}
                        />
                        {section === "details" && (
                            <div className="flex gap-3 pb-2">
                                <Button color="secondary" size="md" iconLeading={FileDownload02}>
                                    Import Order
                                </Button>
                                <Button size="md" iconLeading={PlusCircle} onClick={() => setModal("fund")}>
                                    Fund Credit Book
                                </Button>
                            </div>
                        )}
                        {section === "customers" && (
                            <div className="flex gap-3 pb-2">
                                <Button color="secondary" size="md" iconLeading={UserMinus01} isDisabled>
                                    Remove (0)
                                </Button>
                                <Button color="secondary" size="md" iconLeading={Gift01} isDisabled>
                                    Pay Out (0)
                                </Button>
                                <Button color="secondary" size="md" iconLeading={File02} isDisabled>
                                    Charge (0)
                                </Button>
                                <Button size="md" iconLeading={UserPlus01}>
                                    Add Customer
                                </Button>
                            </div>
                        )}
                    </div>
                    {section === "details" && <CreditBookDetails />}
                    {section === "customers" && (
                        <CreditBookCustomers
                            onCustomer={() => {
                                setCustomerOpen(true);
                                setTab("customer");
                            }}
                        />
                    )}
                    {section === "transactions" && <CreditBookTransactions />}
                </>
            )}
            {tab === "customer" && <CustomerProfileView customer={CUSTOMERS.aaron} />}

            <AddCreditBookModal isOpen={modal === "add"} onClose={() => setModal(null)} />
            <FundCreditBookModal isOpen={modal === "fund"} onClose={() => setModal(null)} />
        </ScreenShell>
    );
};

const CreditBookList = ({ onOpen, linkTitles }: { onOpen: (index: number) => void; linkTitles?: boolean }) => {
    const total = CREDIT_BOOKS.reduce((sum, b) => sum + b.balance, 0);
    return (
        <>
            <div className="flex items-end justify-between gap-4">
                <DateField label="Balance As Of" placeholder="Today" className="w-64" />
                <ExportButton />
            </div>
            <TableCard>
                <thead>
                    <tr>
                        <Th className="w-40">ID</Th>
                        <Th>Title</Th>
                        <Th className="text-right">Balance</Th>
                        <Th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {CREDIT_BOOKS.map((b, i) => (
                        <tr key={b.id} {...clickableRow(linkTitles ? () => onOpen(i) : undefined)}>
                            <Td>
                                <LinkText onClick={() => onOpen(i)}>{b.id}</LinkText>
                            </Td>
                            <Td>{linkTitles ? <LinkText onClick={() => onOpen(i)}>{b.title}</LinkText> : b.title}</Td>
                            <Td className={b.balance < 0 ? "text-right text-error-primary tabular-nums" : "text-right tabular-nums"}>{money(b.balance)}</Td>
                            <Td>
                                <span className="flex justify-end gap-3 text-fg-quaternary">
                                    <Edit03 className="size-4" aria-label="Edit" />
                                    <Trash01 className="size-4" aria-label="Delete" />
                                </span>
                            </Td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <Td className="bg-secondary font-semibold" colSpan={2}>
                            # Credit Books {CREDIT_BOOKS.length}
                        </Td>
                        <Td className="bg-secondary text-right font-semibold tabular-nums">Total {money(total)}</Td>
                        <Td className="bg-secondary" />
                    </tr>
                </tfoot>
            </TableCard>
        </>
    );
};

const CreditBookDetails = () => {
    const d = CREDIT_BOOK_DETAIL;
    const items = [
        ["Credit Book ID", d.id],
        ["Title", d.title],
        ["Balance", money(d.balance)],
        ["Applies To", d.appliesTo.join(", ")],
        ["Expiration", d.expiration],
    ];
    return (
        <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-5">
                {items.map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                        <dt className="text-xs font-semibold tracking-wider text-tertiary uppercase">{k}</dt>
                        <dd className="text-md font-medium text-primary">{v}</dd>
                    </div>
                ))}
            </dl>
            <div className="flex justify-end">
                <Button color="secondary" size="md" iconLeading={Edit03}>
                    Edit Settings
                </Button>
            </div>
        </div>
    );
};

const CreditBookCustomers = ({ onCustomer }: { onCustomer: () => void }) => (
    <TableCard>
        <thead>
            <tr>
                <Th className="w-12">
                    <Checkbox aria-label="Select all customers" />
                </Th>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
            </tr>
        </thead>
        <tbody>
            {CREDIT_BOOK_CUSTOMERS.map((c) => (
                <tr key={c.id}>
                    <Td>
                        <Checkbox aria-label={`Select ${c.name}`} />
                    </Td>
                    <Td>{c.id}</Td>
                    <Td>
                        <LinkText onClick={onCustomer}>{c.name}</LinkText>
                    </Td>
                    <Td>{c.email ?? <Dash />}</Td>
                    <Td>{c.phone ?? <Dash />}</Td>
                </tr>
            ))}
        </tbody>
    </TableCard>
);

const CreditBookTransactions = () => (
    <TableCard>
        <thead>
            <tr>
                {["ID", "Date", "Type", "Employee", "Paid Customer", "Gift Card", "Charged Customer", "Order ID"].map((h) => (
                    <Th key={h}>{h}</Th>
                ))}
                <Th className="text-right">Amount</Th>
                <Th className="w-12" />
            </tr>
        </thead>
        <tbody>
            {CREDIT_BOOK_TRANSACTIONS.map((t) => (
                <tr key={t.id}>
                    <Td>{t.id}</Td>
                    <Td>{t.date}</Td>
                    <Td>{t.type}</Td>
                    <Td>{t.employee}</Td>
                    <Td>
                        <Dash />
                    </Td>
                    <Td>
                        <LinkText>{t.giftCard}</LinkText>
                    </Td>
                    <Td>
                        <Dash />
                    </Td>
                    <Td>
                        <Dash />
                    </Td>
                    <Td className="text-right tabular-nums">{money(t.amount)}</Td>
                    <Td>
                        <Trash01 className="size-4 text-fg-quaternary" aria-label="Delete" />
                    </Td>
                </tr>
            ))}
        </tbody>
    </TableCard>
);

const AddCreditBookModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <ScreenModal
        title="Add Credit Book"
        isOpen={isOpen}
        onClose={onClose}
        footer={
            <>
                <Button color="tertiary" size="md" onClick={onClose}>
                    Cancel
                </Button>
                <Button size="md">Add Credit Book</Button>
            </>
        }
    >
        <Input label="Title" placeholder="Credit book name" />
        <div className="flex flex-col gap-1.5">
            <FieldLabel>Applies To</FieldLabel>
            <div className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                {["Merchandise", "Food & Beverage", "Tee Fees", "Alcohol"].map((label) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-sm font-semibold text-primary">{label}</span>
                        <Toggle aria-label={label} size="md" defaultSelected />
                    </div>
                ))}
            </div>
        </div>
        <DateField label="Expiration Date" placeholder="No hard date" />
        <Input
            label="Months Until Expiration"
            placeholder="e.g. 12"
            type="number"
            tooltip="Credits expire this many months after they're added. Leave blank to use the hard date."
        />
    </ScreenModal>
);

const FundCreditBookModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <ScreenModal
        title="Fund Credit Book"
        isOpen={isOpen}
        onClose={onClose}
        width="max-w-xl"
        footer={
            <>
                <Button color="secondary" size="md" onClick={onClose}>
                    Cancel
                </Button>
                <Button size="md" isDisabled>
                    Fund Credit Book
                </Button>
            </>
        }
    >
        <p className="text-sm text-secondary">Buys this book's product and credits the book by the pre-tax amount.</p>
        <div className="flex flex-col gap-1.5">
            <Select label="Product" placeholder="Select a product" items={[]} isDisabled>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
            <p className="text-sm text-tertiary">
                No products are linked to this credit book yet. Link one on the product's own page first — funding buys this book's product, so there is nothing
                to sell until then.
            </p>
        </div>
        <Input label="Amount (before tax)" defaultValue="$0" />
        <div className="grid grid-cols-2 gap-4">
            {["Tax Type", "Tax Type 2"].map((label) => (
                <Select
                    key={label}
                    label={label}
                    items={[
                        { id: "none", label: "No tax" },
                        { id: "std", label: "Standard Tax (8.25%)" },
                    ]}
                    defaultSelectedKey="none"
                >
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
            ))}
        </div>
        <dl className="flex flex-col gap-1.5 rounded-xl bg-secondary px-4 py-3 text-sm">
            {["Subtotal", "Tax", "Tax 2", "Fees"].map((k) => (
                <div key={k} className="flex justify-between text-tertiary">
                    <dt>{k}</dt>
                    <dd className="tabular-nums">$0.00</dd>
                </div>
            ))}
            <div className="mt-1 flex justify-between border-t border-secondary pt-2.5 font-semibold text-primary">
                <dt>Total charged</dt>
                <dd className="tabular-nums">$0.00</dd>
            </div>
        </dl>
        <Select
            label="Payment Type"
            items={[
                { id: "cash", label: "Cash" },
                { id: "card", label: "Credit Card" },
                { id: "check", label: "Check" },
            ]}
            defaultSelectedKey="cash"
        >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    </ScreenModal>
);
