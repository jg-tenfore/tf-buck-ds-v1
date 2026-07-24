import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    Cloud01,
    Database01,
    Download01,
    FilterLines,
    Mail05,
    PlayCircle,
    Plus,
    RefreshCw01,
    SearchLg,
    SwitchHorizontal01,
    Tablet01,
    Trash01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Tabs } from "@/components/application/tabs/tabs";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";

const meta = {
    title: "App Screens/Admin",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/* ------------------------------------------------------------------ */
/* Error Report                                                        */
/* ------------------------------------------------------------------ */

interface ErrorRow {
    id: string;
    note: string;
    date: string;
    excMessage?: string;
    innerExc?: string;
}

const errorRows: ErrorRow[] = [
    { id: "1", note: "WeirdTranspoTax on 11902456 order item has no tax but TTC is correct, afterTaxIsMatch = False", date: "Jul 24, 2026 · 2:29 PM" },
    { id: "2", note: "WeirdTranspoTax on 11902456 order item AND TTC have incorrect tax that does not match transpo price; afterTaxIsMatch = False will fix BOTH if true", date: "Jul 24, 2026 · 2:29 PM" },
    { id: "3", note: "btnSave_ServerClick", date: "Jul 24, 2026 · 2:25 PM", excMessage: "Thread was being aborted." },
    { id: "4", note: "TF/GF had small fees that didn't make sense and were corrected.", date: "Jul 24, 2026 · 2:25 PM" },
    {
        id: "5",
        note: "error with CustomersController.Get strPrefix: marc font",
        date: "Jul 24, 2026 · 2:24 PM",
        excMessage: "An error occurred while executing the command definition. See the inner exception for details.",
        innerExc: "Violation of PRIMARY KEY constraint 'PK__#B2823D2'. Cannot insert duplicate key in object 'dbo._GolfCourseCustomerIDS'. The duplicate key value is (785898).",
    },
    { id: "6", note: "Credit Card Declined: The authorization was rejected by CardConnect. Response code: Expired card", date: "Jul 24, 2026 · 2:23 PM" },
    { id: "7", note: "Failed Login Attempt: PIN=0651 DeviceIdentifier=441d30ed0a26cee9", date: "Jul 24, 2026 · 2:19 PM" },
    { id: "8", note: "WeirdTranspoTax on 11761170 order item AND TTC have incorrect tax that does not match transpo price", date: "Jul 24, 2026 · 2:19 PM" },
];

/** Admin › Reports › Error Report — a searchable, paginated log of exceptions and system notes. */
export const ErrorReport: Story = {
    name: "Error Report",
    render: () => (
        <AppShell activeUrl="/admin/reports">
            <PageHeader
                title="Error Report"
                subtitle="Exceptions and system notes captured across Sagamore Spring Golf Club."
                action={
                    <Button size="md" color="secondary" iconLeading={Download01}>
                        Export
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search error log" placeholder="Search notes or messages" icon={SearchLg} wrapperClassName="sm:w-96" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Error log">
                        <Table.Header>
                            <Table.Head label="Notes" isRowHeader />
                            <Table.Head label="Date" className="w-44" />
                            <Table.Head label="Exc. Message" className="w-64" />
                            <Table.Head label="Inner Exc." className="w-72" />
                        </Table.Header>
                        <Table.Body items={errorRows}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="max-w-md text-sm text-primary">{row.note}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums whitespace-nowrap">{row.date}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.excMessage ?? "—"}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.innerExc ?? "—"}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 3,341</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Scheduled Jobs                                                      */
/* ------------------------------------------------------------------ */

interface Job {
    id: string;
    name: string;
    description: string;
    icon: typeof Cloud01;
}

const jobs: Job[] = [
    { id: "1", name: "Nightly member billing", description: "Charges recurring dues and posts to member accounts", icon: Database01 },
    { id: "2", name: "Rebuild reporting cache", description: "Refreshes aggregate tables used by the Reports module", icon: RefreshCw01 },
    { id: "3", name: "Sync tee sheet inventory", description: "Reconciles GolfNow and internal availability", icon: Cloud01 },
    { id: "4", name: "Send booking reminders", description: "Emails golfers with a tee time in the next 24 hours", icon: Mail05 },
];

interface JobRun {
    id: string;
    job: string;
    started: string;
    duration: string;
    status: "success" | "running" | "failed";
}

const jobRuns: JobRun[] = [
    { id: "1", job: "Nightly member billing", started: "Jul 24, 2026 · 3:00 AM", duration: "4m 12s", status: "success" },
    { id: "2", job: "Rebuild reporting cache", started: "Jul 24, 2026 · 2:41 PM", duration: "1m 08s", status: "running" },
    { id: "3", job: "Sync tee sheet inventory", started: "Jul 24, 2026 · 2:15 PM", duration: "0m 52s", status: "success" },
    { id: "4", job: "Send booking reminders", started: "Jul 24, 2026 · 6:00 AM", duration: "—", status: "failed" },
    { id: "5", job: "Rebuild reporting cache", started: "Jul 23, 2026 · 2:41 PM", duration: "1m 22s", status: "success" },
];

const runStatus = {
    success: { color: "success" as const, label: "Completed" },
    running: { color: "blue" as const, label: "Running" },
    failed: { color: "error" as const, label: "Failed" },
};

/** Admin › Scheduled Jobs — invoke async background jobs and review recent run history. */
export const ScheduledJobs: Story = {
    name: "Scheduled Jobs",
    render: () => (
        <AppShell activeUrl="/admin/scheduled-jobs">
            <PageHeader title="Scheduled Jobs" subtitle="Run background jobs on demand and monitor their status." />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <Tabs className="w-full">
                    <Tabs.List type="button-brand" size="md">
                        <Tabs.Item id="run">Run Jobs</Tabs.Item>
                        <Tabs.Item id="history">History</Tabs.Item>
                    </Tabs.List>
                </Tabs>

                {/* Info banner */}
                <div className="flex items-start gap-3 rounded-xl bg-brand-secondary p-4 ring-1 ring-brand ring-inset">
                    <Cloud01 className="mt-0.5 size-5 shrink-0 text-brand-secondary" aria-hidden="true" />
                    <p className="text-sm text-secondary">
                        <span className="font-semibold text-brand-secondary">Async jobs</span> run in the background. After invoking, expect 1–5 minutes for the job to complete.
                    </p>
                </div>

                {/* Available jobs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {jobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                                    <job.icon className="size-5 text-fg-secondary" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-primary">{job.name}</p>
                                    <p className="mt-0.5 text-sm text-tertiary">{job.description}</p>
                                </div>
                            </div>
                            <Button size="sm" color="secondary" iconLeading={PlayCircle}>
                                Run
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Recent runs */}
                <TableCard.Root>
                    <TableCard.Header title="Recent runs" badge="Last 24 hours" description="Most recent invocations across all jobs." />
                    <Table aria-label="Recent job runs">
                        <Table.Header>
                            <Table.Head label="Job" isRowHeader />
                            <Table.Head label="Started" className="w-56" />
                            <Table.Head label="Duration" className="w-32" />
                            <Table.Head label="Status" className="w-40" />
                        </Table.Header>
                        <Table.Body items={jobRuns}>
                            {(row) => {
                                const s = runStatus[row.status];
                                return (
                                    <Table.Row id={row.id}>
                                        <Table.Cell className="font-medium text-primary">{row.job}</Table.Cell>
                                        <Table.Cell className="text-tertiary tabular-nums whitespace-nowrap">{row.started}</Table.Cell>
                                        <Table.Cell className="text-tertiary tabular-nums">{row.duration}</Table.Cell>
                                        <Table.Cell>
                                            <BadgeWithDot size="sm" type="pill-color" color={s.color}>
                                                {s.label}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Trades                                                              */
/* ------------------------------------------------------------------ */

/** Admin › Trades — configure the rules that let members swap tee times. */
export const Trades: Story = {
    name: "Trades",
    render: () => (
        <AppShell activeUrl="/admin/trades">
            <PageHeader
                title="Tee Time Trade Rules"
                subtitle="Control whether members can trade reserved tee times, and the limits that apply."
            />
            <div className="p-6 lg:p-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-6">
                    {/* Enable card */}
                    <div className="flex items-start justify-between gap-6 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary">
                                <SwitchHorizontal01 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary">Enable Tee Time Trades</p>
                                <p className="mt-0.5 text-sm text-tertiary">Rules are disabled. Toggle on to configure trading windows and limits.</p>
                            </div>
                        </div>
                        <Toggle size="md" />
                    </div>

                    {/* Disabled config preview */}
                    <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 opacity-50 ring-1 ring-secondary ring-inset">
                        <h2 className="text-sm font-semibold text-primary">Trade limits</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input isDisabled label="Trade window opens (hours before)" placeholder="48" />
                            <Input isDisabled label="Trade window closes (hours before)" placeholder="4" />
                            <Input isDisabled label="Max trades per member / week" placeholder="3" />
                            <Input isDisabled label="Trade fee" placeholder="$0.00" />
                        </div>
                        <div className="flex justify-end">
                            <Button size="md" isDisabled>
                                Save rules
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Tablets                                                             */
/* ------------------------------------------------------------------ */

interface TabletDevice {
    id: string;
    deviceId: string;
    description: string;
    course: string;
    online: boolean;
}

const tablets: TabletDevice[] = [
    { id: "4", deviceId: "abdd51bb19c28469", description: "Jarrett Emu Elo 15", course: "Sagamore Spring GC", online: true },
    { id: "7", deviceId: "8634ee3b783eed43", description: "Jarrette Samsung S6 (local)", course: "Sagamore Spring GC", online: true },
    { id: "8", deviceId: "37a87d64dbdf8052", description: "TenFore Tab S6 (Google Play)", course: "Sagamore Spring GC", online: false },
    { id: "13", deviceId: "9fe2a4df58b08723", description: "Kings Gate Flex 2", course: "Kings Gate Golf Club", online: true },
    { id: "15", deviceId: "27d41ef86ee2b9fa", description: "Windcrest Pro Shop", course: "Windcrest Golf Club", online: true },
    { id: "21", deviceId: "5ad702000b30ac60", description: "Jarrette Emu Tab S6", course: "Sagamore Spring GC", online: false },
    { id: "29", deviceId: "ebbfed253b8122d2", description: "Sonora", course: "Sonora Golf Course", online: true },
    { id: "33", deviceId: "f7c7104db70270f1", description: "Jarrette TCL Tablet", course: "Sagamore Hampton Golf Club", online: true },
    { id: "39", deviceId: "998b7a3ce423893e", description: "Thoroughbred F&B 1", course: "Thoroughbred Golf Club", online: false },
    { id: "43", deviceId: "044aaec5fd67bea4", description: "Thoroughbred Bev Cart Tab", course: "Thoroughbred Golf Club", online: true },
];

/** Admin › Tablets — registered POS / bev-cart devices across every managed course. */
export const Tablets: Story = {
    name: "Tablets",
    render: () => (
        <AppShell activeUrl="/admin/tablets">
            <PageHeader
                title="Tablets"
                subtitle="Registered devices running the TenFore POS across all managed courses."
                action={
                    <Button iconLeading={Plus} size="md">
                        New tablet
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search tablets" placeholder="Search by device, description or course" icon={SearchLg} wrapperClassName="sm:w-96" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Tablets">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-20" />
                            <Table.Head label="Device ID" className="w-56" />
                            <Table.Head label="Description" />
                            <Table.Head label="Golf Course" />
                            <Table.Head label="Status" className="w-32" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={tablets}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2 text-tertiary">
                                            <Tablet01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                            <span className="font-mono text-xs">{row.deviceId}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.description}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.course}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={row.online ? "success" : "gray"}>
                                            {row.online ? "Online" : "Offline"}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label={`Remove ${row.description}`} />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 6</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};
