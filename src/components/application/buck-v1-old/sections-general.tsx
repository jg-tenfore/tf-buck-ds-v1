"use client";

import { useState } from "react";
import { DotsGrid, LinkExternal01, Percent02, Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import {
    ADDITIONAL_MIDS,
    FEE_TABLES,
    LINKS,
    MAIN_INFO,
    MAIN_INFO_TOGGLES,
    OPTIONS,
    PAYMENT_OTHER_FIELDS,
    PAYMENT_TOGGLES,
    PAYMENT_TYPES,
    SERVICE_CHARGES,
    SUB_COURSES,
    TAX_RATE_FIELDS,
    TAX_TYPES,
    TENFORE_ONLY,
} from "./course-settings-data";
import { PAYMENT_TYPE_KEYWORDS } from "./search-keywords";
import {
    AdminLockIcon,
    ColorField,
    ControlledSelect,
    Dash,
    FieldGrid,
    Group,
    NewAction,
    RowActions,
    SelectField,
    TableFrame,
    Td,
    TextField,
    Th,
    TimeField,
    ToggleField,
    ToggleList,
    Tr,
    YesNo,
} from "./settings-kit";
import { SearchScope, Searchable } from "./settings-search";

/* -------------------------------------------------------------------------- */
/*  Main Info                                                                 */
/* -------------------------------------------------------------------------- */

export const MainInfoContent = () => {
    const m = MAIN_INFO;
    const t = TENFORE_ONLY;

    return (
        <>
            <Group title="Identity">
                <FieldGrid>
                    <TextField label="Course Name" value={m.courseName} />
                    <TextField label="Subcourse Alias" value={m.subcourseAlias} />
                    <SelectField label="Course Type" options={OPTIONS.courseType} value={m.courseType} />
                </FieldGrid>
            </Group>

            <Group title="Address">
                <FieldGrid>
                    <TextField label="Street" value={m.street} />
                    <TextField label="City" value={m.city} />
                    <SelectField label="State" options={OPTIONS.state} value={m.state} />
                    <TextField label="Zip" value={m.zip} />
                    <SelectField label="Country" options={OPTIONS.country} value={m.country} />
                </FieldGrid>
            </Group>

            <Group title="Contact">
                <FieldGrid>
                    <TextField label="Contact Phone" value={m.phone} type="tel" />
                    <TextField label="Contact Email" value={m.email} type="email" />
                    <TextField label="Website URL" value={m.website} type="url" />
                </FieldGrid>
            </Group>

            <Group title="Location and Time" description="Used for distance-based features, geofencing and every date shown in the app.">
                <FieldGrid>
                    <TextField label="Latitude" value={m.latitude} />
                    <TextField label="Longitude" value={m.longitude} />
                    <TextField label="GeoFence Radius" value={m.geofenceRadius} />
                    <SelectField label="Time Zone" options={OPTIONS.timeZone} value={m.timeZone} />
                </FieldGrid>
            </Group>

            <Group title="Regional and Format">
                <FieldGrid>
                    <SelectField label="Currency Country" options={OPTIONS.country} value={m.currencyCountry} />
                    <SelectField label="Language Country" options={OPTIONS.country} value={m.languageCountry} />
                    <SelectField label="Number of Holes" options={OPTIONS.holes} value={m.numberOfHoles} />
                    <SelectField label="Invoice Type" options={OPTIONS.invoiceType} value={m.invoiceType} />
                </FieldGrid>
            </Group>

            <Group title="Branding">
                <FieldGrid>
                    <ColorField label="Background Color" value={m.backgroundColor} />
                    <ColorField label="Foreground Color" value={m.foregroundColor} />
                </FieldGrid>
            </Group>

            <Group title="Credits and Expirations" description="How long issued credits stay valid, in days.">
                <FieldGrid>
                    <TextField label="Rewards Expiration (days)" value={m.rewardsExpiration} />
                    <TextField label="Rain Check Expiration (days)" value={m.rainCheckExpiration} />
                    <TextField label="Gift Card Expiration (days)" value={m.giftCardExpiration} />
                </FieldGrid>
            </Group>

            <Group title="Reporting">
                <FieldGrid>
                    <TimeField label="Reporting End Time" value="02:00" />
                </FieldGrid>
            </Group>

            <Group title="Other Settings">
                <FieldGrid>
                    <TextField label="EGiftify Subdomain" value={m.egiftifySubdomain} />
                    <TextField label="Google Tag Manager ID" value={m.googleTagManagerId} />
                    <TextField label="GA4 Measurement ID" value={m.ga4MeasurementId} />
                </FieldGrid>

                <ToggleList items={MAIN_INFO_TOGGLES} />

                <SearchScope title="TenFore only">
                    <div data-search-group="" className="flex flex-col gap-5 rounded-xl bg-secondary p-5 ring-1 ring-secondary">
                        <div data-search-heading="" className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-md font-semibold text-primary">
                                <AdminLockIcon className="text-fg-quaternary" />
                                TenFore only
                            </span>
                            <span className="text-sm text-tertiary">Visible to every user, editable only by TenFore administrators.</span>
                        </div>
                        <FieldGrid>
                            <TextField label="Parent Company" value={t.parentCompany} lock="admin" />
                            <TextField label="Vanity Name" value={t.vanityName} lock="readonly" />
                            <TextField label="TenFore Plan" value={t.plan} lock="admin" />
                            <TextField label="Status" value={t.status} lock="admin" />
                            <TextField label="Email API Key" value={t.emailApiKey} lock="readonly" className="md:col-span-2" />
                            <ToggleField label="Uses Menu" defaultSelected={t.usesMenu} lock="readonly" />
                        </FieldGrid>
                    </div>
                </SearchScope>
            </Group>
        </>
    );
};

/* -------------------------------------------------------------------------- */
/*  Links                                                                     */
/* -------------------------------------------------------------------------- */

export const LinksContent = () => {
    const [links, setLinks] = useState(LINKS);
    const [type, setType] = useState("Facebook");
    const [url, setUrl] = useState("");

    const add = () => {
        if (!url.trim()) return;
        setLinks((prev) => [...prev, { id: crypto.randomUUID(), type, url: url.trim() }]);
        setUrl("");
    };

    return (
        <Group>
            <Searchable
                label="Add link"
                keywords="social facebook instagram url website"
                className="grid grid-cols-1 items-end gap-4 md:grid-cols-[minmax(0,18rem)_1fr_auto]"
            >
                <SelectLinkType value={type} onChange={setType} />
                <Input label="URL" placeholder="https://example.com" value={url} onChange={setUrl} type="url" />
                <Button size="md" iconLeading={Plus} isDisabled={!url.trim()} onClick={add}>
                    Add link
                </Button>
            </Searchable>

            {links.length > 0 && (
                <div data-search-container="" className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                    {links.map((link) => (
                        <Searchable
                            key={link.id}
                            label={`${link.type} link`}
                            keywords="social url website"
                            className="grid grid-cols-[10rem_1fr_auto] items-center gap-4 px-5 py-3.5"
                        >
                            <span className="text-sm font-semibold text-primary">{link.type}</span>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-w-0 items-center gap-2 text-sm text-brand-secondary hover:text-brand-secondary_hover"
                            >
                                <LinkExternal01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <span className="truncate">{link.url}</span>
                            </a>
                            <RowActions hideEdit onDelete={() => setLinks((prev) => prev.filter((l) => l.id !== link.id))} />
                        </Searchable>
                    ))}
                </div>
            )}
        </Group>
    );
};

const SelectLinkType = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <ControlledSelect label="Link type" options={OPTIONS.linkType} value={value} onChange={onChange} />
);

/* -------------------------------------------------------------------------- */
/*  Sub-courses                                                               */
/* -------------------------------------------------------------------------- */

export const SubCoursesContent = () => {
    const [rows, setRows] = useState(SUB_COURSES);
    const [name, setName] = useState("");
    const [holes, setHoles] = useState("18 holes");
    const [minBookable, setMinBookable] = useState("9 holes");

    const add = () => {
        if (!name.trim()) return;
        setRows((prev) => [...prev, { id: crypto.randomUUID(), name: name.trim(), holes, minBookable }]);
        setName("");
    };

    return (
        <Group>
            <Searchable
                label="Add sub-course"
                keywords="nine layout course holes"
                className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-[1fr_12rem_16rem_auto]"
            >
                <Input label="Name" placeholder="e.g. East Course" value={name} onChange={setName} />
                <ControlledSelect label="Hole Count" options={OPTIONS.holeCount} value={holes} onChange={setHoles} />
                <ControlledSelect label="Minimum Bookable Holes" options={OPTIONS.holeCount} value={minBookable} onChange={setMinBookable} />
                <Button size="md" iconLeading={Plus} isDisabled={!name.trim()} onClick={add}>
                    Add sub-course
                </Button>
            </Searchable>

            <TableFrame>
                <thead>
                    <tr>
                        <Th>Name</Th>
                        <Th className="w-48">Hole Count</Th>
                        <Th className="w-64">Minimum Bookable Holes</Th>
                        <Th className="w-20" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <Tr key={row.id} label={row.name} keywords="sub-course nine layout">
                            <Td className="font-semibold text-primary">{row.name}</Td>
                            <Td>{row.holes}</Td>
                            <Td>{row.minBookable || <Dash />}</Td>
                            <Td>
                                <RowActions hideEdit onDelete={() => setRows((prev) => prev.filter((r) => r.id !== row.id))} />
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </TableFrame>
        </Group>
    );
};

/* -------------------------------------------------------------------------- */
/*  Taxes & Fees                                                              */
/* -------------------------------------------------------------------------- */

export const TaxRatesGroup = () => (
    <Group title="Tax Rates" description="Which configured tax applies to each kind of line item.">
        <FieldGrid>
            {TAX_RATE_FIELDS.map((f) => (
                <SelectField key={f.label} label={f.label} options={OPTIONS.taxRate} value={f.value} />
            ))}
        </FieldGrid>
    </Group>
);

export const ServiceChargesGroup = () => (
    <Group title="Service Charges">
        <FieldGrid>
            {SERVICE_CHARGES.map((f) => (
                <TextField key={f.label} label={f.label} value={f.value} trailing={<Percent02 className="size-4" aria-hidden="true" />} />
            ))}
        </FieldGrid>
    </Group>
);

export const TaxTypesGroup = () => {
    const [taxTypes, setTaxTypes] = useState(TAX_TYPES);

    return (
        <Group title="Tax Types" action={<NewAction />}>
            <TableFrame>
                <thead>
                    <tr>
                        <Th className="w-24">ID</Th>
                        <Th>Name</Th>
                        <Th className="w-40">Rate</Th>
                        <Th className="w-28 text-center">Alcohol</Th>
                        <Th className="w-28 text-center">Default</Th>
                        <Th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {taxTypes.map((tax) => (
                        <Tr key={tax.id} label={tax.name || `Tax ${tax.id}`} keywords="tax rate percentage">
                            <Td>{tax.id}</Td>
                            <Td className="font-semibold text-primary">{tax.name}</Td>
                            <Td className="tabular-nums">{tax.rate}</Td>
                            <Td className="text-center">
                                <YesNo value={tax.alcohol} />
                            </Td>
                            <Td className="text-center">
                                <YesNo value={tax.isDefault} />
                            </Td>
                            <Td>
                                <RowActions onDelete={() => setTaxTypes((prev) => prev.filter((t) => t.id !== tax.id))} />
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </TableFrame>
        </Group>
    );
};

export const FeeTablesGroups = () => (
    <>
        {FEE_TABLES.map((table) => (
            <Group key={table.title} title={table.title} tooltip={table.tooltip} action={<NewAction />}>
                <TableFrame>
                    <thead>
                        <tr>
                            <Th className="w-10" />
                            <Th>Memberships</Th>
                            <Th>Customer Types</Th>
                            <Th>Percent</Th>
                            <Th>Amount</Th>
                            <Th className="text-center">Online</Th>
                            <Th className="text-center">In-Person</Th>
                            <Th>Min Days</Th>
                            <Th>Per Booking</Th>
                            <Th>Payment Timing</Th>
                            <Th>Refundable By</Th>
                            <Th className="w-24" />
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, i) => (
                            <Tr key={i} label={`${table.title} · ${row.amount}`} keywords="fee charge">
                                <Td>
                                    <DotsGrid className="size-4 cursor-grab text-fg-quaternary" aria-label="Drag to reorder" />
                                </Td>
                                <Td className="max-w-40 whitespace-normal text-primary">{row.memberships}</Td>
                                <Td className="max-w-44 whitespace-normal text-primary">{row.customerTypes}</Td>
                                <Td>{row.percent}</Td>
                                <Td className="text-primary tabular-nums">{row.amount}</Td>
                                <Td className="text-center">{row.online ? <YesNo value /> : null}</Td>
                                <Td className="text-center">{row.inPerson ? <YesNo value /> : null}</Td>
                                <Td className="text-primary">{row.minDays}</Td>
                                <Td>{row.perBooking}</Td>
                                <Td className="text-primary">{row.paymentTiming}</Td>
                                <Td className="text-primary">{row.refundableBy}</Td>
                                <Td>
                                    <RowActions />
                                </Td>
                            </Tr>
                        ))}
                    </tbody>
                </TableFrame>
            </Group>
        ))}
    </>
);

export const TaxesFeesContent = () => (
    <>
        <TaxRatesGroup />
        <ServiceChargesGroup />
        <TaxTypesGroup />
        <FeeTablesGroups />
    </>
);

/* -------------------------------------------------------------------------- */
/*  Payments                                                                  */
/* -------------------------------------------------------------------------- */

const PaymentTypeRow = ({ name, enabled }: { name: string; enabled: boolean }) => {
    const [isOn, setIsOn] = useState(enabled);

    return (
        <Searchable label={name} keywords={PAYMENT_TYPE_KEYWORDS} className="flex min-h-16 items-center justify-between gap-6 px-5 py-3">
            <span className="text-sm font-semibold text-primary">{name}</span>
            <div className="flex items-center gap-6">
                {isOn && <Toggle size="sm" label="Disable tip line" aria-label={`${name}: disable tip line`} className="flex-row-reverse items-center" />}
                <Toggle size="md" aria-label={`${name} enabled`} isSelected={isOn} onChange={setIsOn} />
            </div>
        </Searchable>
    );
};

export const PaymentTypesGroup = () => (
    <Group title="Payment Types">
        <div data-search-container="" className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
            {PAYMENT_TYPES.map((p) => (
                <PaymentTypeRow key={p.name} {...p} />
            ))}
        </div>
    </Group>
);

export const AdditionalMidsGroup = () => (
    <Group title="Additional MIDs" action={<NewAction />}>
        <TableFrame>
            <thead>
                <tr>
                    <Th>Type</Th>
                    <Th>Processor</Th>
                    <Th>MID</Th>
                    <Th className="w-28 text-center">Clover</Th>
                    <Th className="w-24" />
                </tr>
            </thead>
            <tbody>
                {ADDITIONAL_MIDS.map((mid) => (
                    <Tr key={mid.type} label={mid.type} keywords="merchant id mid processor card">
                        <Td className="font-semibold text-primary">{mid.type}</Td>
                        <Td>{mid.processor}</Td>
                        <Td className="tabular-nums">{mid.mid}</Td>
                        <Td className="text-center">
                            <YesNo value={mid.clover} />
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

export const PaymentOtherSettingsGroup = () => (
    <Group title="Other Settings">
        <FieldGrid>
            {PAYMENT_OTHER_FIELDS.map((f) => (
                <TextField key={f.label} label={f.label} value={f.value} />
            ))}
        </FieldGrid>
        <ToggleList items={PAYMENT_TOGGLES} />
    </Group>
);

export const PaymentsContent = () => (
    <>
        <PaymentTypesGroup />
        <AdditionalMidsGroup />
        <PaymentOtherSettingsGroup />
    </>
);
