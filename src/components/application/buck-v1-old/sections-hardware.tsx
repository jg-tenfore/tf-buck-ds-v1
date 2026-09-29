"use client";

import { useState } from "react";
import { Lock01, RefreshCw01, Trash01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { TextArea } from "@/components/base/textarea/textarea";
import {
    BIRDIE_DEFAULTS,
    BIRDIE_TOGGLES,
    COMPANY,
    COMPANY_TOGGLES,
    DOCUMENTS,
    IMAGES,
    NOTIFICATIONS,
    NOTIFICATION_TOGGLES,
    OPTIONS,
    PRINTERS,
    RECEIPT_TEXT,
    SCHEDULED_NOTIFICATIONS,
    TABLETS,
    TRANSPORTATION_TYPES,
} from "./course-settings-data";
import { Dash, FieldGrid, Group, NewAction, RowActions, SaveButton, SelectField, TableFrame, Td, TextField, Th, ToggleList, Tr, YesNo } from "./settings-kit";
import { Searchable } from "./settings-search";

/* -------------------------------------------------------------------------- */
/*  Birdie                                                                    */
/* -------------------------------------------------------------------------- */

export const BirdieContent = () => (
    <>
        <Group title="Defaults" description="What Birdie preselects when starting a new sale or event.">
            <FieldGrid>
                <SelectField label="Cart Signout Method" options={OPTIONS.cartSignout} value={BIRDIE_DEFAULTS.cartSignout} />
                <SelectField label="Default Event Tee Fee" options={OPTIONS.eventTeeFee} value={BIRDIE_DEFAULTS.eventTeeFee} />
                <SelectField label="Default Event Transportation" options={OPTIONS.eventTransport} value={BIRDIE_DEFAULTS.eventTransport} />
                <SelectField label="Most Common # of Holes" options={OPTIONS.holes} value={BIRDIE_DEFAULTS.commonHoles} />
            </FieldGrid>
        </Group>

        <Group title="Point of Sale Options">
            <ToggleList items={BIRDIE_TOGGLES} />
        </Group>

        <Group title="Receipt Text">
            <FieldGrid>
                {(
                    [
                        ["Pro Shop Receipt Tag", RECEIPT_TEXT.proShop],
                        ["Restaurant Receipt Tag", RECEIPT_TEXT.restaurant],
                        ["Cart Sign Out Disclaimer", RECEIPT_TEXT.cartDisclaimer],
                    ] as const
                ).map(([label, value]) => (
                    <Searchable key={label} label={label}>
                        <TextArea label={label} defaultValue={value} rows={4} />
                    </Searchable>
                ))}
            </FieldGrid>
        </Group>
    </>
);

/* -------------------------------------------------------------------------- */
/*  Tablets                                                                   */
/* -------------------------------------------------------------------------- */

export const TabletsContent = () => {
    const [rows, setRows] = useState(TABLETS);

    return (
        <Group action={<NewAction />}>
            <TableFrame>
                <thead>
                    <tr>
                        <Th className="w-28">#</Th>
                        <Th>Description</Th>
                        <Th className="w-56">Identifier</Th>
                        <Th className="w-56">Printer</Th>
                        <Th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((tablet) => (
                        <Tr key={tablet.id} label={tablet.description} keywords="tablet device kiosk terminal">
                            <Td className="font-mono text-primary">{tablet.id}</Td>
                            <Td className="font-semibold text-primary">{tablet.description}</Td>
                            <Td className="font-mono">{tablet.identifier}</Td>
                            <Td className="text-primary">{tablet.printer || <Dash />}</Td>
                            <Td>
                                <RowActions onDelete={() => setRows((prev) => prev.filter((t) => t.id !== tablet.id))} />
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </TableFrame>
        </Group>
    );
};

/* -------------------------------------------------------------------------- */
/*  Transportation Types                                                      */
/* -------------------------------------------------------------------------- */

export const TransportationContent = () => (
    <Group action={<NewAction />}>
        <TableFrame>
            <thead>
                <tr>
                    <Th>Type</Th>
                    <Th className="w-36 text-center">Booking</Th>
                    <Th className="w-36 text-center">Default</Th>
                    <Th className="w-24" />
                </tr>
            </thead>
            <tbody>
                {TRANSPORTATION_TYPES.map((t) => (
                    <Tr key={t.type} label={t.type} keywords="transportation cart walk">
                        <Td className="font-semibold text-primary">{t.type}</Td>
                        <Td className="text-center">
                            <YesNo value={t.booking} />
                        </Td>
                        <Td className="text-center">
                            <YesNo value={t.isDefault} />
                        </Td>
                        <Td>
                            <RowActions />
                        </Td>
                    </Tr>
                ))}
            </tbody>
        </TableFrame>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Notifications                                                             */
/* -------------------------------------------------------------------------- */

export const NotificationsContent = () => {
    const n = NOTIFICATIONS;

    return (
        <>
            <Group title="Notification Settings">
                <FieldGrid>
                    <TextField label="Billing From Email" value={n.billingFromEmail} type="email" />
                    <SelectField label="Send Statement Emails After (day)" options={OPTIONS.days} value={n.statementAfterDay} />
                    <SelectField label="Charge Customers After (day)" options={OPTIONS.days} value={n.chargeAfterDay} />
                </FieldGrid>
            </Group>

            <Group title="Messaging">
                <FieldGrid>
                    <TextField label="Twilio Phone Number" value={n.twilioPhone} type="tel" />
                    <TextField label="Send Grid Inbound Domain" value={n.sendGridDomain} />
                    <TextField label="Default From Email" value={n.defaultFromEmail} type="email" />
                    <TextField label="Default From Name" value={n.defaultFromName} />
                    <TextField label="Default Reply To Email" value={n.defaultReplyTo} type="email" />
                </FieldGrid>
                <ToggleList items={NOTIFICATION_TOGGLES} />
                {/* Legacy quirk kept on purpose: this section saves inline, above the scheduled list. */}
                <div className="flex justify-end">
                    <SaveButton />
                </div>
            </Group>

            <Group title="Scheduled Notifications" action={<NewAction />}>
                <TableFrame>
                    <thead>
                        <tr>
                            <Th className="w-28">#</Th>
                            <Th>Type</Th>
                            <Th className="w-40">Frequency</Th>
                            <Th>Recipients</Th>
                            <Th className="w-24" />
                        </tr>
                    </thead>
                    <tbody>
                        {SCHEDULED_NOTIFICATIONS.map((s) => (
                            <Tr key={s.id} label={s.type} keywords="scheduled notification alert email">
                                <Td className="font-mono text-primary">{s.id}</Td>
                                <Td className="font-semibold text-primary">{s.type}</Td>
                                <Td className="text-primary">{s.frequency}</Td>
                                <Td className="text-primary">{s.recipients}</Td>
                                <Td>
                                    <RowActions />
                                </Td>
                            </Tr>
                        ))}
                    </tbody>
                </TableFrame>
            </Group>
        </>
    );
};

/* -------------------------------------------------------------------------- */
/*  Printers                                                                  */
/* -------------------------------------------------------------------------- */

export const PrintersContent = () => (
    <Group
        action={
            <div className="flex items-center gap-5">
                <Button color="link-color" size="md" iconLeading={RefreshCw01}>
                    Refresh
                </Button>
                <NewAction />
            </div>
        }
    >
        <TableFrame>
            <thead>
                <tr>
                    <Th>Name</Th>
                    <Th>Uses</Th>
                    <Th>MAC Address</Th>
                    <Th className="text-center">Jobs</Th>
                    <Th className="text-center">Pop on Cash</Th>
                    <Th className="w-24" />
                </tr>
            </thead>
            <tbody>
                {PRINTERS.map((p) => (
                    <Tr key={p.name} label={p.name} keywords="printer receipt kitchen ticket">
                        <Td className="max-w-52 font-semibold whitespace-normal text-primary">{p.name}</Td>
                        <Td className="max-w-md">
                            {p.uses.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {p.uses.map((use) => (
                                        <Badge key={use} type="color" size="sm" color="gray">
                                            {use}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <Dash />
                            )}
                        </Td>
                        <Td className="font-mono text-primary">{p.mac}</Td>
                        <Td className="text-center">{p.jobs ? <span className="font-semibold text-brand-secondary">{p.jobs}</span> : <Dash />}</Td>
                        <Td className="text-center">
                            <YesNo value={p.popOnCash} />
                        </Td>
                        <Td>
                            <RowActions />
                        </Td>
                    </Tr>
                ))}
            </tbody>
        </TableFrame>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Images                                                                    */
/* -------------------------------------------------------------------------- */

export const ImagesContent = () => (
    <Group action={<NewAction />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {IMAGES.map((img) => (
                <Searchable
                    as="figure"
                    key={img.label}
                    label={img.label}
                    keywords="image photo picture logo upload"
                    className="overflow-hidden rounded-xl ring-1 ring-secondary"
                >
                    <div className="flex h-44 items-center justify-center border-b border-secondary bg-secondary p-4">
                        <img
                            src={img.src}
                            alt={img.label}
                            className={img.fit === "cover" ? "h-full w-auto max-w-full rounded-sm object-cover" : "h-full w-auto object-contain"}
                        />
                    </div>
                    <figcaption className="flex items-center justify-between px-4 py-3">
                        <span className="text-md font-medium text-primary">{img.label}</span>
                        <ButtonUtility color="tertiary" size="xs" tooltip="Delete" icon={Trash01} />
                    </figcaption>
                </Searchable>
            ))}
        </div>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Documents                                                                 */
/* -------------------------------------------------------------------------- */

const Stamp = ({ at, by }: { at: string; by: string }) => (
    <span className="flex flex-col">
        <span className="text-primary">{at}</span>
        <span className="text-xs text-tertiary">{by}</span>
    </span>
);

export const DocumentsContent = () => (
    <Group action={<NewAction />}>
        <TableFrame>
            <thead>
                <tr>
                    <Th>Description</Th>
                    <Th>Min. User Type</Th>
                    <Th className="text-center">Members Only</Th>
                    <Th>Created</Th>
                    <Th>Updated</Th>
                    <Th className="w-24" />
                </tr>
            </thead>
            <tbody>
                {DOCUMENTS.map((d) => (
                    <Tr key={d.description} label={d.description} keywords="document file policy upload">
                        <Td>
                            <a href="#documents" className="font-medium text-brand-secondary hover:text-brand-secondary_hover hover:underline">
                                {d.description}
                            </a>
                        </Td>
                        <Td className="text-primary">{d.minUserType}</Td>
                        <Td className="text-center">
                            <YesNo value={d.membersOnly} />
                        </Td>
                        <Td>
                            <Stamp {...d.created} />
                        </Td>
                        <Td>{d.updated ? <Stamp {...d.updated} /> : <Dash />}</Td>
                        <Td>
                            <RowActions />
                        </Td>
                    </Tr>
                ))}
            </tbody>
        </TableFrame>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Events                                                                    */
/* -------------------------------------------------------------------------- */

const EVENT_NOTES_MAX = 400;

export const EventsContent = () => {
    const [notes, setNotes] = useState("");

    return (
        <Group>
            <Searchable label="Universal Event Notes" keywords="event outing notes banquet" className="flex w-full max-w-3xl flex-col gap-1.5">
                <TextArea label="Universal Event Notes" value={notes} onChange={(v) => setNotes(v.slice(0, EVENT_NOTES_MAX))} rows={5} />
                <span className="self-end text-sm text-tertiary tabular-nums">
                    {notes.length} / {EVENT_NOTES_MAX}
                </span>
            </Searchable>
        </Group>
    );
};

/* -------------------------------------------------------------------------- */
/*  Company                                                                   */
/* -------------------------------------------------------------------------- */

export const CompanyContent = () => (
    <Group>
        <p className="flex items-center gap-2 text-sm text-secondary">
            <Lock01 className="size-4 text-fg-quaternary" aria-hidden="true" />
            These settings apply to every course in the company and can only be changed by a course owner.
        </p>
        <FieldGrid>
            <TextField label="Daily Round Limit" value={COMPANY.dailyRoundLimit} lock="readonly" />
            <TextField label="Store Customers Golf Course" value={COMPANY.storeCustomersCourse} lock="admin" className="md:col-span-2" />
            <TextField label="Booking Overlap Restriction (Hours)" value={COMPANY.bookingOverlapHours} lock="readonly" />
        </FieldGrid>
        <ToggleList items={COMPANY_TOGGLES} lock="readonly" />
    </Group>
);
