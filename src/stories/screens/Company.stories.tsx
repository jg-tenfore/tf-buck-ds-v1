import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertTriangle, ArrowLeft, ArrowRight, Lock01, Mail01, Phone, SearchLg, Star01, SwitchHorizontal01, Users01 } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";

const meta = {
    title: "App Screens/Company",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** A single labelled setting row — label + supporting text on the left, control on the right. */
const SettingRow = ({
    label,
    hint,
    locked,
    control,
}: {
    label: string;
    hint?: string;
    locked?: boolean;
    control: React.ReactNode;
}) => (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-2">
            <div>
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-secondary">{label}</p>
                    {locked && <Lock01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />}
                </div>
                {hint && <p className="mt-0.5 text-sm text-tertiary">{hint}</p>}
            </div>
        </div>
        <div className="sm:w-64 sm:shrink-0">{control}</div>
    </div>
);

const courses = [
    { id: "none", label: "None" },
    { id: "sagamore", label: "Sagamore Spring Golf Club" },
    { id: "highland", label: "Highland Links" },
    { id: "cedar", label: "Cedar Ridge National" },
];

/**
 * Company Settings — company-wide booking and customer defaults. Rebuilt from the legacy
 * cramped six-field grid into grouped setting cards with clear labels, hints, and inline controls.
 */
export const Settings: Story = {
    render: () => (
        <AppShell activeUrl="/company/settings">
            <PageHeader
                title="Company Settings"
                subtitle="Defaults applied across every course in Sagamore Golf Group."
                action={<Button size="md">Save changes</Button>}
            />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 lg:p-8">
                {/* Booking */}
                <section className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                    <div className="border-b border-secondary px-4 py-3">
                        <h2 className="text-sm font-semibold text-primary">Booking</h2>
                        <p className="mt-0.5 text-sm text-tertiary">How tee times are shared and limited across the company.</p>
                    </div>
                    <div className="divide-y divide-secondary">
                        <SettingRow
                            label="Share booking engine"
                            hint="Let sister courses publish tee times through the shared engine."
                            locked
                            control={<Toggle size="md" defaultSelected aria-label="Share booking engine" />}
                        />
                        <SettingRow
                            label="Daily round limit"
                            hint="Maximum rounds bookable per day, per course."
                            locked
                            control={<Input size="sm" defaultValue="100" aria-label="Daily round limit" className="tabular-nums" />}
                        />
                        <SettingRow
                            label="Booking overlap restriction"
                            hint="Hours a customer must wait between overlapping bookings."
                            locked
                            control={<Input size="sm" defaultValue="4" aria-label="Booking overlap restriction in hours" className="tabular-nums" />}
                        />
                    </div>
                </section>

                {/* Customers */}
                <section className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                    <div className="border-b border-secondary px-4 py-3">
                        <h2 className="text-sm font-semibold text-primary">Customers</h2>
                        <p className="mt-0.5 text-sm text-tertiary">Where customer records live and who can search them.</p>
                    </div>
                    <div className="divide-y divide-secondary">
                        <SettingRow
                            label="Store customers' golf course"
                            hint="Default course a new customer record is attached to."
                            control={
                                <div>
                                    <Select aria-label="Store customers golf course" placeholder="Select a course" defaultSelectedKey="none" items={courses}>
                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                    </Select>
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-error-primary">
                                        <AlertTriangle className="size-3.5" aria-hidden="true" />
                                        A default course is required before sharing.
                                    </p>
                                </div>
                            }
                        />
                        <SettingRow
                            label="Search all company courses"
                            hint="Include every course's customers in search results."
                            locked
                            control={<Toggle size="md" aria-label="Search all company courses" />}
                        />
                        <SettingRow
                            label="Share customer search"
                            hint="Allow other courses to find customers you created."
                            locked
                            control={<Toggle size="md" defaultSelected aria-label="Share customer search" />}
                        />
                    </div>
                </section>

                <div className="flex items-center justify-end gap-3">
                    <Button size="md" color="secondary">
                        Cancel
                    </Button>
                    <Button size="md">Save changes</Button>
                </div>
            </div>
        </AppShell>
    ),
};

interface DuplicateGroup {
    id: string;
    keep: { name: string; email: string; customerNo: string; avatar?: string; created: string };
    merge: { name: string; email: string; customerNo: string; created: string };
    matchOn: "Email" | "Phone" | "Name + phone";
    confidence: "High" | "Medium";
}

const duplicates: DuplicateGroup[] = [
    {
        id: "1",
        keep: { name: "Olivia Chen", email: "olivia.chen@example.com", customerNo: "355183", created: "Oct 29, 2023", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
        merge: { name: "Olivia Chen", email: "olivia.chen@example.com", customerNo: "612045", created: "Feb 14, 2025" },
        matchOn: "Email",
        confidence: "High",
    },
    {
        id: "2",
        keep: { name: "Marcus Bennett", email: "marcus@example.com", customerNo: "355611", created: "Nov 3, 2023" },
        merge: { name: "Marc Bennett", email: "m.bennett@example.com", customerNo: "588120", created: "Dec 1, 2024" },
        matchOn: "Phone",
        confidence: "High",
    },
    {
        id: "3",
        keep: { name: "Priya Nair", email: "priya.nair@example.com", customerNo: "427286", created: "Apr 8, 2024", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
        merge: { name: "Priya N.", email: "priya.nair@example.com", customerNo: "634998", created: "May 22, 2025" },
        matchOn: "Email",
        confidence: "High",
    },
    {
        id: "4",
        keep: { name: "James Park", email: "james.park@example.com", customerNo: "430799", created: "Apr 30, 2024" },
        merge: { name: "Jim Park", email: "jpark@example.com", customerNo: "601233", created: "Jan 9, 2025" },
        matchOn: "Name + phone",
        confidence: "Medium",
    },
    {
        id: "5",
        keep: { name: "Dana Lee", email: "dana.lee@example.com", customerNo: "444266", created: "Jul 30, 2024", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
        merge: { name: "Dana Lee", email: "dana.lee@example.com", customerNo: "655410", created: "Jun 2, 2025" },
        matchOn: "Email",
        confidence: "High",
    },
];

const matchIcon = { Email: Mail01, Phone: Phone, "Name + phone": Users01 } as const;

/**
 * Duplicate Customers — a dedup review tool for merging records that share an email, phone, or name
 * across the company. Each row pairs the record to keep with a likely duplicate and a match reason.
 */
export const DuplicateCustomers: Story = {
    render: () => (
        <AppShell activeUrl="/company/duplicate-customers">
            <PageHeader
                title="Duplicate Customers"
                subtitle="Review likely duplicate records and merge them into a single profile."
                action={
                    <Button size="md" color="secondary" iconLeading={Star01}>
                        Auto-merge high confidence
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <TableCard.Root>
                    <TableCard.Header title="Potential duplicates" badge="5 groups" description="Sorted by match confidence. Merging keeps the older record and its history." />
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search duplicates" placeholder="Search by name or email" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary">
                            Dismiss all
                        </Button>
                    </div>
                    <Table aria-label="Potential duplicate customers">
                        <Table.Header>
                            <Table.Head label="Keep" isRowHeader />
                            <Table.Head label="Duplicate" />
                            <Table.Head label="Match on" className="w-44" />
                            <Table.Head label="Confidence" className="w-32" />
                            <Table.Head label="" className="w-52" />
                        </Table.Header>
                        <Table.Body items={duplicates}>
                            {(row) => {
                                const MatchIcon = matchIcon[row.matchOn];
                                return (
                                    <Table.Row id={row.id}>
                                        <Table.Cell>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar size="sm" src={row.keep.avatar} alt={row.keep.name} initials={row.keep.name.charAt(0)} />
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{row.keep.name}</p>
                                                    <p className="text-xs text-tertiary">
                                                        #{row.keep.customerNo} · {row.keep.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div>
                                                <p className="text-sm font-medium text-primary">{row.merge.name}</p>
                                                <p className="text-xs text-tertiary">
                                                    #{row.merge.customerNo} · {row.merge.email}
                                                </p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="flex items-center gap-1.5 text-sm text-tertiary">
                                                <MatchIcon className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                {row.matchOn}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge size="sm" type="pill-color" color={row.confidence === "High" ? "success" : "warning"}>
                                                {row.confidence}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" color="link-gray">
                                                    Dismiss
                                                </Button>
                                                <Button size="sm" iconLeading={SwitchHorizontal01}>
                                                    Merge
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 3</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};
