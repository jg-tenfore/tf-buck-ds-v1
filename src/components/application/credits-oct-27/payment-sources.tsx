"use client";

import { useState } from "react";
import { AlertCircle, CreditCard01, Download01, Play, SearchLg, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { TableCard, Td, Th } from "../migration-v2/kit";
import { CREDITS_NAV, PAYMENT_SOURCES } from "./data";
import { CreditsPage } from "./kit";

/** An "Add" link where a billing field is missing. */
const AddLink = () => <button className="cursor-pointer text-sm font-medium text-brand-secondary hover:underline">Add</button>;

/**
 * Reports › Credits › Payment Sources: cards and accounts on file, in the new
 * header. List only for now; reorganizing it was deferred on the 10/27 call.
 */
export const PaymentSourcesPage = () => {
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();
    const rows = PAYMENT_SOURCES.filter((p) => !q || `${p.psid} ${p.customer} ${p.cardholder} ${p.details}`.toLowerCase().includes(q));

    return (
        <CreditsPage
            navId={CREDITS_NAV.paymentSources}
            crumbs={["Reports", "Credits", "Payment Sources"]}
            title="Payment Sources"
            description="Cards and accounts customers have on file."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={Trash01}>
                        Disable expired
                    </Button>
                    <Button color="secondary" size="md" iconLeading={Download01}>
                        Export CSV
                    </Button>
                </>
            }
            listLabel="Payment sources"
            tabs={[]}
            activeId="list"
            onSelect={() => {}}
            onClose={() => {}}
        >
            <Input aria-label="Search payment sources" placeholder="Search name, card or PSID" icon={SearchLg} value={query} onChange={setQuery} />
            <TableCard>
                <thead>
                    <tr>
                        {[
                            "PSID",
                            "Customer",
                            "Billing postal",
                            "Cardholder",
                            "Billing street",
                            "Merchant ID",
                            "App",
                            "Details",
                            "Created",
                            "Expiration",
                            "Processor",
                            "",
                        ].map((h, i) => (
                            <Th key={i}>{h}</Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((p) => (
                        <tr key={p.psid} className="hover:bg-primary_hover">
                            <Td className="text-secondary">{p.psid}</Td>
                            <Td className="font-medium">{p.customer}</Td>
                            <Td>
                                {p.postal ? (
                                    <span className="inline-flex items-center gap-1 text-secondary">
                                        {p.postal}
                                        {p.postalFlag && <AlertCircle className="size-4 text-fg-warning-secondary" aria-label="Postal code doesn't match" />}
                                    </span>
                                ) : (
                                    <AddLink />
                                )}
                            </Td>
                            <Td className="text-secondary">{p.cardholder}</Td>
                            <Td className="text-secondary">{p.street ?? <AddLink />}</Td>
                            <Td className="text-secondary">{p.merchantId}</Td>
                            <Td className="text-secondary">{p.app}</Td>
                            <Td className="font-medium">{p.details}</Td>
                            <Td className="text-secondary">{p.created}</Td>
                            <Td className="whitespace-nowrap">
                                <span className={cx(p.expired ? "text-error-primary" : "text-secondary")}>{p.expiration}</span>
                                {p.expired && (
                                    <Badge color="error" size="sm" className="ml-2">
                                        Expired
                                    </Badge>
                                )}
                            </Td>
                            <Td>
                                <Play className="size-4 text-fg-brand-secondary" aria-label="Processor" />
                            </Td>
                            <Td>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        aria-label={`Disable ${p.psid}`}
                                        className="cursor-pointer text-fg-quaternary hover:text-fg-quaternary_hover"
                                    >
                                        <CreditCard01 className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Delete ${p.psid}`}
                                        className="cursor-pointer text-fg-quaternary hover:text-fg-error-secondary"
                                    >
                                        <Trash01 className="size-4" />
                                    </button>
                                </div>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </TableCard>
        </CreditsPage>
    );
};
