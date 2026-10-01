"use client";

import { useState } from "react";
import {
    AlertTriangle,
    BookClosed,
    Calendar,
    CheckCircle,
    Edit03,
    FileDownload02,
    Plus,
    PlusCircle,
    Receipt,
    Save01,
    Ticket01,
    Trash01,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import type { CreditBook, PunchCardRow } from "../data";
import { CREDIT_BOOKS, CREDIT_BOOK_DETAIL, PUNCH_CARDS, money } from "../data";
import { Dash, DateField, LinkText, ScreenShell, TableCard, Td, Th } from "../kit";
import { NAV_IDS } from "../nav-tree";
import { CreditBooksScreen, PunchCardsScreen } from "../screens-credits";
import { RecordFlow } from "./drilldown";
import { CustomerRailSummary, personFrom } from "./full-profile";
import {
    MainCard,
    MoreActions,
    PanelGroup,
    PanelRow,
    PanelStat,
    RailBlock,
    RecordHeader,
    RecordLayout,
    RecordNavContext,
    SlidePanel,
    StatBar,
} from "./ideas-kit";
import { bookCounts } from "./ideas-panels";

const PRODUCTS = [
    { id: "10", label: "10-Round Punch Card" },
    { id: "3", label: "3-Round Punch Card" },
];

const HOW_TO_USE =
    "Pick the punch-card product these paper cards correspond to, set the batch expiration, then add one row per paper card. For each card, find the customer or enter their info, and count how many holes have been punched out.";

/** The New Customer fields, shared by both ideas (same fields as today). */
const NewCustomerFields = () => (
    <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
            <Input label="First name" placeholder="First name" />
            <Input label="Last name" placeholder="Last name" />
            <Input label="Email" placeholder="Email" type="email" />
            <Input label="Phone" placeholder="Phone" type="tel" />
        </div>
        <span className="text-sm text-tertiary">Email or phone is required.</span>
        <button type="button" className="w-max cursor-pointer text-sm font-medium text-brand-secondary underline hover:text-brand-secondary_hover">
            Look up an existing customer instead
        </button>
    </div>
);

/* ========================================================================== */
/*  1 · Punch Cards — bulk entry for a customer who isn't on file             */
/* ========================================================================== */

/** Bulk Entry as its own page — cards in the main column, batch settings in the rail. */
export const PunchCardsBulkPage = () => (
    <ScreenShell
        nav={{ activeId: NAV_IDS.punchCards, initialQuery: "punch" }}
        title="Bulk entry"
        description=""
        header={
            <RecordHeader
                breadcrumb="Punch Cards"
                breadcrumbIcon={Ticket01}
                title="Bulk entry"
                subtitle={<p className="max-w-3xl text-sm">{HOW_TO_USE}</p>}
                actions={
                    <>
                        <Button color="secondary" size="md" iconLeading={Plus}>
                            Add Row
                        </Button>
                        <Button size="md" iconLeading={Save01} isDisabled>
                            Save All Pending
                        </Button>
                    </>
                }
            />
        }
    >
        <StatBar
            stats={[
                { label: "Cards in batch", value: 1 },
                { label: "Saved", value: 0 },
                { label: "Remaining", value: 1 },
            ]}
        />
        <RecordLayout
            main={
                <MainCard
                    title="Card #1 · New customer"
                    action={
                        <Button color="tertiary-destructive" size="sm" iconLeading={Trash01}>
                            Remove
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
                        <NewCustomerFields />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Rounds Used" defaultValue="0" type="number" />
                            <DateField label="Expiration Override" />
                        </div>
                    </div>
                </MainCard>
            }
            rail={
                <>
                    <RailBlock title="Punch card product">
                        <Select aria-label="Punch card product" placeholder="Select" items={PRODUCTS}>
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                    </RailBlock>
                    <RailBlock title="Default expiration">
                        <DateField />
                        <span className="text-xs text-tertiary">Applied to every new row. Override per card if needed.</span>
                    </RailBlock>
                </>
            }
        />
    </ScreenShell>
);

/* ========================================================================== */
/*  2 · Credit Books — funding a book with no product linked                  */
/* ========================================================================== */

const NoProductWarning = () => (
    <div className="flex gap-3 rounded-xl bg-warning-primary p-4 ring-1 ring-secondary ring-inset">
        <AlertTriangle className="size-5 shrink-0 text-fg-warning-primary" />
        <p className="text-sm text-secondary">
            No products are linked to this credit book yet. Link one on the product's own page first — funding buys this book's product, so there is nothing to
            sell until then.
        </p>
    </div>
);

const FundFields = () => (
    <div className="flex flex-col gap-4">
        <Select label="Product" placeholder="Select a product" items={[]} isDisabled>
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
        <Input label="Amount (before tax)" defaultValue="$0" isDisabled />
        <div className="grid grid-cols-2 gap-3">
            {["Tax Type", "Tax Type 2"].map((label) => (
                <Select key={label} label={label} items={[{ id: "none", label: "No tax" }]} defaultSelectedKey="none" isDisabled>
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
        <Select label="Payment Type" items={[{ id: "cash", label: "Cash" }]} defaultSelectedKey="cash" isDisabled>
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    </div>
);

/** Idea 2: the book as a record page; Fund stays visible but blocked, with the reason inline. */
export const CreditBookRecordPage = ({ book }: { book: CreditBook }) => {
    const d = { ...CREDIT_BOOK_DETAIL, id: book.id, title: book.title, balance: book.balance };
    const { customers, transactions } = bookCounts(book);
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.creditBooks, initialQuery: "cred" }}
            title={d.title}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Credit Books"
                    breadcrumbIcon={BookClosed}
                    title={d.title}
                    subtitle={`Credit book #${d.id}`}
                    actions={
                        <>
                            <MoreActions
                                actions={[
                                    { label: "Import order", icon: FileDownload02 },
                                    { label: "Edit settings", icon: Edit03 },
                                    { label: "Delete credit book", icon: Trash01, destructive: true },
                                ]}
                            />
                            <Button size="md" iconLeading={PlusCircle} isDisabled>
                                Fund Credit Book
                            </Button>
                        </>
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Balance", value: money(d.balance), tone: d.balance < 0 ? "negative" : undefined },
                    { label: "Customers", value: customers.length },
                    { label: "Transactions", value: transactions.length },
                    { label: "Expiration", value: d.expiration },
                ]}
            />
            <NoProductWarning />
            <RecordLayout
                main={
                    <>
                        <MainCard title="Recent transactions" action={<LinkText>View all {transactions.length}</LinkText>}>
                            <TableCard>
                                <thead>
                                    <tr>
                                        <Th>ID</Th>
                                        <Th>Date</Th>
                                        <Th>Type</Th>
                                        <Th>Gift Card</Th>
                                        <Th className="text-right">Amount</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 5).map((t) => (
                                        <tr key={t.id}>
                                            <Td>{t.id}</Td>
                                            <Td>{t.date}</Td>
                                            <Td>{t.type}</Td>
                                            <Td>
                                                <LinkText>{t.giftCard}</LinkText>
                                            </Td>
                                            <Td className="text-right tabular-nums">{money(t.amount)}</Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TableCard>
                        </MainCard>
                        <MainCard title="Customers" action={<LinkText>View all {customers.length}</LinkText>}>
                            <TableCard>
                                <thead>
                                    <tr>
                                        <Th>Name</Th>
                                        <Th>Email</Th>
                                        <Th>Phone</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.slice(0, 5).map((c) => (
                                        <tr key={c.id}>
                                            <Td>
                                                <LinkText>{c.name}</LinkText>
                                            </Td>
                                            <Td>{c.email ?? <Dash />}</Td>
                                            <Td>{c.phone ?? <Dash />}</Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TableCard>
                        </MainCard>
                    </>
                }
                rail={
                    <>
                        <RailBlock title="Applies to" editable>
                            <div className="flex flex-wrap gap-1.5">
                                {d.appliesTo.map((a) => (
                                    <Badge key={a} type="color" size="sm" color="gray">
                                        {a}
                                    </Badge>
                                ))}
                            </div>
                        </RailBlock>
                        <RailBlock title="Expiration" editable>
                            <span className="flex items-center gap-2">
                                <Calendar className="size-4 text-fg-quaternary" />
                                {d.expiration}
                            </span>
                        </RailBlock>
                        <RailBlock title="Linked product">
                            <span className="text-tertiary">None</span>
                        </RailBlock>
                    </>
                }
            />
        </ScreenShell>
    );
};

/* Idea 1 now lives in ideas-panels.tsx (row-stepping panels with sub-navigation). */
export { PunchCardsIdea1, CreditBooksIdea1 } from "./ideas-panels";

/* ========================================================================== */
/*  Idea 2 flows — start on today's table, click a row to load its page       */
/* ========================================================================== */

/** One punch card as a record page. */
export const PunchCardRecordPage = ({ row }: { row: PunchCardRow }) => {
    const remaining = row.awarded - row.used;
    const customer = row.customer ? personFrom(row.customer, row.gccId) : null;
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.punchCards, initialQuery: "punch" }}
            title={`Punch card ${row.cpcId}`}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Punch Cards"
                    breadcrumbIcon={Ticket01}
                    title={`Punch card ${row.cpcId}`}
                    subtitle={customer ? customer.name : "No customer linked"}
                    actions={
                        <MoreActions
                            actions={[
                                { label: "Edit rounds used", icon: Edit03 },
                                { label: "Change expiration", icon: Calendar },
                                { label: "Delete punch card", icon: Trash01, destructive: true },
                            ]}
                        />
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Rounds remaining", value: `${remaining} of ${row.awarded}` },
                    { label: "Rounds used", value: row.used },
                    { label: "Price pre-tax", value: row.pricePreTax },
                    { label: "Expires", value: row.expires },
                ]}
            />
            {!customer && (
                <div className="flex gap-3 rounded-xl bg-warning-primary p-4 ring-1 ring-secondary ring-inset">
                    <AlertTriangle className="size-5 shrink-0 text-fg-warning-primary" />
                    <p className="text-sm text-secondary">This punch card isn't linked to a customer, so its rounds can't be redeemed at check-in.</p>
                </div>
            )}
            <RecordLayout
                main={
                    <MainCard title="Card">
                        <TableCard>
                            <tbody>
                                {(
                                    [
                                        ["CPC ID", row.cpcId],
                                        ["GCC ID", row.gccId],
                                        ["Date created", row.created],
                                        ["Date expired", row.expires],
                                        ["Rounds awarded", String(row.awarded)],
                                        ["Rounds used", String(row.used)],
                                        ["Order ID", row.orderId ?? "N/A · added manually"],
                                        ["Order item ID", row.orderItemId ?? "N/A"],
                                    ] as const
                                ).map(([k, v]) => (
                                    <tr key={k} className="[&:first-child>td]:border-t-0">
                                        <Td className="w-48 text-tertiary">{k}</Td>
                                        <Td>{v}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableCard>
                    </MainCard>
                }
                rail={
                    customer ? (
                        <>
                            <CustomerRailSummary customer={customer} />
                            <RailBlock title="Member #">
                                <span>{row.member ?? "N/A"}</span>
                            </RailBlock>
                        </>
                    ) : (
                        <RailBlock title="Customer" action={<LinkText>Link customer</LinkText>}>
                            <span className="text-tertiary">None</span>
                        </RailBlock>
                    )
                }
            />
        </ScreenShell>
    );
};

/** Idea 2: from the punch-card table, a name opens that card's page; Bulk Entry opens its own page. */
export const PunchCardsIdea2 = () => {
    const [bulk, setBulk] = useState(false);
    if (bulk)
        return (
            <RecordNavContext.Provider value={{ onBack: () => setBulk(false) }}>
                <PunchCardsBulkPage />
            </RecordNavContext.Provider>
        );
    return (
        <RecordFlow
            screen={(open) => <PunchCardsScreen initialView="list" onOpenRow={open} onBulkEntry={() => setBulk(true)} />}
            rows={PUNCH_CARDS}
            page={(row) => <PunchCardRecordPage row={row} />}
        />
    );
};

/** Idea 2: from the credit-book table, a book opens its record page. */
export const CreditBooksIdea2 = () => (
    <RecordFlow
        screen={(open) => <CreditBooksScreen initialView="list" onOpenRow={open} />}
        rows={CREDIT_BOOKS}
        page={(book) => <CreditBookRecordPage book={book} />}
    />
);
