import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    Announcement02,
    BarChartSquare02,
    CursorClick02,
    Edit01,
    Eye,
    MagicWand02,
    Mail01,
    Plus,
    SearchLg,
    Send03,
    Trash01,
    Users01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Tabs } from "@/components/application/tabs/tabs";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Marketing",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** Section tabs for the Email area (Campaigns / Templates / Templates (Unlayer)). */
const EmailTabs = ({ selected }: { selected: "campaigns" | "templates" | "unlayer" }) => (
    <Tabs selectedKey={selected}>
        <Tabs.List type="button-brand" size="md">
            <Tabs.Item id="campaigns" icon={Announcement02}>
                Campaigns
            </Tabs.Item>
            <Tabs.Item id="templates" icon={Mail01}>
                Templates
            </Tabs.Item>
            <Tabs.Item id="unlayer" icon={MagicWand02}>
                Templates (Unlayer)
            </Tabs.Item>
        </Tabs.List>
    </Tabs>
);

/* ---------------------------------------------------------------------------------- */
/* Campaigns                                                                          */
/* ---------------------------------------------------------------------------------- */

type CampaignStatus = "Sent" | "Scheduled" | "Draft";

interface Campaign {
    id: string;
    name: string;
    template: string;
    status: CampaignStatus;
    recipients: number;
    openRate: string;
    created: string;
}

const campaigns: Campaign[] = [
    { id: "c1", name: "Summer Twilight Rates", template: "Summer Kickoff!", status: "Sent", recipients: 3120, openRate: "48.2%", created: "Jul 18, 2026 04:55 PM" },
    { id: "c2", name: "Member-Guest Invitational", template: "Event Invite", status: "Sent", recipients: 842, openRate: "61.7%", created: "Jul 09, 2026 09:15 AM" },
    { id: "c3", name: "Junior Camp — Final Spots", template: "Junior Camp", status: "Scheduled", recipients: 1204, openRate: "—", created: "Jul 24, 2026 08:00 AM" },
    { id: "c4", name: "Expiring Membership Reminder", template: "Expiring Membership", status: "Scheduled", recipients: 318, openRate: "—", created: "Jul 22, 2026 10:00 AM" },
    { id: "c5", name: "Labor Day Weekend Tee Times", template: "Holiday Promo", status: "Draft", recipients: 0, openRate: "—", created: "Jul 20, 2026 02:47 PM" },
    { id: "c6", name: "Pro Shop Fall Apparel Sale", template: "Retail Promo", status: "Draft", recipients: 0, openRate: "—", created: "Jul 15, 2026 01:16 PM" },
    { id: "c7", name: "Spring Aeration Notice", template: "Course Update", status: "Sent", recipients: 4980, openRate: "52.9%", created: "Jun 25, 2026 02:05 PM" },
    { id: "c8", name: "Welcome to Sagamore Spring", template: "TenFore Welcome", status: "Sent", recipients: 96, openRate: "73.4%", created: "Jun 12, 2026 11:44 AM" },
];

const statusBadge = (status: CampaignStatus) => {
    if (status === "Sent") return <BadgeWithDot size="sm" type="pill-color" color="success">Sent</BadgeWithDot>;
    if (status === "Scheduled") return <BadgeWithDot size="sm" type="pill-color" color="blue">Scheduled</BadgeWithDot>;
    return <BadgeWithDot size="sm" type="pill-color" color="gray">Draft</BadgeWithDot>;
};

/** Email Campaigns — KPI overview, section tabs, and a searchable, paginated campaigns table. */
export const Campaigns: Story = {
    render: () => (
        <AppShell activeUrl="/marketing/email">
            <PageHeader
                title="Email Campaigns"
                subtitle="Send targeted emails to members, guests, and past customers."
                action={
                    <Button iconLeading={Plus} size="md">
                        New campaign
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <EmailTabs selected="campaigns" />

                {/* KPI row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Emails sent (30d)" value="13,168" change={12.4} icon={Send03} />
                    <MetricCard title="Avg. open rate" value="54.8%" change={3.1} icon={Eye} />
                    <MetricCard title="Avg. click rate" value="9.6%" change={-1.4} icon={CursorClick02} />
                    <MetricCard title="Subscribers" value="6,204" change={2.7} icon={Users01} />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search campaigns" placeholder="Search campaigns" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={BarChartSquare02}>
                                Reports
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Email campaigns">
                        <Table.Header>
                            <Table.Head label="Campaign" isRowHeader />
                            <Table.Head label="Template" />
                            <Table.Head label="Status" className="w-36" />
                            <Table.Head label="Recipients" className="w-32 text-right" />
                            <Table.Head label="Open rate" className="w-28 text-right" />
                            <Table.Head label="Created" className="w-48" />
                            <Table.Head label="" className="w-24" />
                        </Table.Header>
                        <Table.Body items={campaigns}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.name}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.template}</Table.Cell>
                                    <Table.Cell>{statusBadge(row.status)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.recipients ? row.recipients.toLocaleString() : "—"}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.openRate}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.created}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-0.5">
                                            <Button size="sm" color="tertiary" iconLeading={Send03} aria-label="Send campaign" />
                                            <Button size="sm" color="tertiary" iconLeading={Edit01} aria-label="Edit campaign" />
                                            <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label="Delete campaign" />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">32 campaigns</span>
                        <span className="text-sm text-tertiary">Page 1 of 4</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ---------------------------------------------------------------------------------- */
/* Templates                                                                          */
/* ---------------------------------------------------------------------------------- */

interface Template {
    id: string;
    name: string;
    category: string;
    lastEdited: string;
}

const templates: Template[] = [
    { id: "t1", name: "Summer Kickoff!", category: "Promotion", lastEdited: "Jul 18, 2026" },
    { id: "t2", name: "TenFore Welcome", category: "Onboarding", lastEdited: "Jul 12, 2026" },
    { id: "t3", name: "Expiring Membership", category: "Membership", lastEdited: "Jul 09, 2026" },
    { id: "t4", name: "Junior Camp", category: "Instruction", lastEdited: "Jul 02, 2026" },
    { id: "t5", name: "Event Invite", category: "Events", lastEdited: "Jun 28, 2026" },
    { id: "t6", name: "Holiday Promo", category: "Promotion", lastEdited: "Jun 20, 2026" },
    { id: "t7", name: "Course Update", category: "Operations", lastEdited: "Jun 14, 2026" },
    { id: "t8", name: "Retail Promo", category: "Pro Shop", lastEdited: "Jun 05, 2026" },
    { id: "t9", name: "Happy Birthday!", category: "Lifecycle", lastEdited: "May 30, 2026" },
];

/** Email Templates — the reusable HTML templates campaigns are built from. */
export const Templates: Story = {
    render: () => (
        <AppShell activeUrl="/marketing/email">
            <PageHeader
                title="Email Templates"
                subtitle="Reusable designs you can drop into any campaign."
                action={
                    <Button iconLeading={Plus} size="md">
                        New template
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <EmailTabs selected="templates" />

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search templates" placeholder="Search templates" icon={SearchLg} wrapperClassName="sm:w-80" />
                    </div>
                    <Table aria-label="Email templates">
                        <Table.Header>
                            <Table.Head label="Template" isRowHeader />
                            <Table.Head label="Category" className="w-48" />
                            <Table.Head label="Last edited" className="w-40" />
                            <Table.Head label="" className="w-28" />
                        </Table.Header>
                        <Table.Body items={templates}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-fg-quaternary">
                                                <Mail01 className="size-4" aria-hidden="true" />
                                            </span>
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.category}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.lastEdited}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-0.5">
                                            <Button size="sm" color="tertiary" iconLeading={Edit01} aria-label="Edit template" />
                                            <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label="Delete template" />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">36 templates</span>
                        <span className="text-sm text-tertiary">Page 1 of 4</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ---------------------------------------------------------------------------------- */
/* Templates (Unlayer)                                                                */
/* ---------------------------------------------------------------------------------- */

interface UnlayerTemplate {
    id: string;
    name: string;
    category: string;
    lastEdited: string;
}

const unlayerTemplates: UnlayerTemplate[] = [
    { id: "u1", name: "Unlayer Promo", category: "Promotion", lastEdited: "Jul 21, 2026" },
    { id: "u2", name: "Summer Kickoff!", category: "Promotion", lastEdited: "Jul 18, 2026" },
    { id: "u3", name: "TenFore Welcome", category: "Onboarding", lastEdited: "Jul 12, 2026" },
    { id: "u4", name: "Ridges at Sand Creek — Video Test", category: "Events", lastEdited: "Jul 08, 2026" },
    { id: "u5", name: "Junior Camp", category: "Instruction", lastEdited: "Jul 02, 2026" },
    { id: "u6", name: "Happy 4th of July", category: "Seasonal", lastEdited: "Jun 30, 2026" },
    { id: "u7", name: "Welcome to the Club", category: "Membership", lastEdited: "Jun 22, 2026" },
    { id: "u8", name: "Template One", category: "Newsletter", lastEdited: "Jun 15, 2026" },
];

/** Email Templates (Unlayer) — drag-and-drop templates built in the visual editor. */
export const TemplatesUnlayer: Story = {
    name: "Templates (Unlayer)",
    render: () => (
        <AppShell activeUrl="/marketing/email">
            <PageHeader
                title="Email Templates (Unlayer)"
                subtitle="Drag-and-drop designs built with the visual editor."
                action={
                    <Button iconLeading={Plus} size="md">
                        New Unlayer template
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <EmailTabs selected="unlayer" />

                <TableCard.Root>
                    <TableCard.Header
                        title="Visual templates"
                        badge={<Badge size="sm" type="pill-color" color="brand">Unlayer</Badge>}
                        description="These templates open in the drag-and-drop builder instead of the HTML editor."
                        contentTrailing={
                            <Input size="sm" aria-label="Search Unlayer templates" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-72" />
                        }
                    />
                    <Table aria-label="Unlayer email templates">
                        <Table.Header>
                            <Table.Head label="Template" isRowHeader />
                            <Table.Head label="Category" className="w-48" />
                            <Table.Head label="Last edited" className="w-40" />
                            <Table.Head label="" className="w-32" />
                        </Table.Header>
                        <Table.Body items={unlayerTemplates}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-8 items-center justify-center rounded-md bg-brand-secondary text-fg-brand-primary">
                                                <MagicWand02 className="size-4" aria-hidden="true" />
                                            </span>
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.category}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.lastEdited}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-0.5">
                                            <Button size="sm" color="tertiary" iconLeading={Eye} aria-label="Preview template" />
                                            <Button size="sm" color="tertiary" iconLeading={Edit01} aria-label="Edit in builder" />
                                            <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label="Delete template" />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">18 templates</span>
                        <span className="text-sm text-tertiary">Page 1 of 2</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};
