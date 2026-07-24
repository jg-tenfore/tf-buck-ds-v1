import { useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";

/**
 * The morning tee sheet, rendered. Each row is a booked block on the first tee at
 * Sagamore — time, the member up next, holes they've signed up for, and where
 * their round stands. Built on react-aria-components, so keyboard nav, selection,
 * and column sorting all come for free. Keep it monochromatic; let the starter's
 * board do the talking.
 */
const meta = {
    title: "Components/Layout & Structure/Table",
    component: Table,
    parameters: {
        layout: "padded",
    },
    argTypes: {
        size: {
            control: "radio",
            options: ["sm", "md"],
            description: "Row density for the tee sheet.",
        },
        selectionMode: {
            control: "radio",
            options: ["none", "single", "multiple"],
            description: "Whether starters can check off rows.",
        },
    },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

type TeeStatus = "On the tee" | "Out on the course" | "Holed out" | "No-show";

const statusColor: Record<TeeStatus, "brand" | "success" | "gray" | "warning"> = {
    "On the tee": "brand",
    "Out on the course": "success",
    "Holed out": "gray",
    "No-show": "warning",
};

interface TeeTime {
    id: string;
    time: string;
    player: string;
    avatar?: string;
    holes: "9" | "18";
    status: TeeStatus;
}

const teeTimes: TeeTime[] = [
    { id: "1", time: "7:10 AM", player: "Bobby Jones", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", holes: "18", status: "Out on the course" },
    { id: "2", time: "7:20 AM", player: "Patty Berg", holes: "18", status: "On the tee" },
    { id: "3", time: "7:30 AM", player: "Walter Hagen", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", holes: "9", status: "Holed out" },
    { id: "4", time: "7:40 AM", player: "Mickey Wright", holes: "18", status: "No-show" },
    { id: "5", time: "7:50 AM", player: "Gene Sarazen", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", holes: "9", status: "On the tee" },
];

/** Renders a player cell with avatar (where available) and name. */
const PlayerCell = ({ row }: { row: TeeTime }) => (
    <div className="flex items-center gap-3">
        <Avatar size="sm" src={row.avatar} alt={row.player} initials={row.player.charAt(0)} />
        <span className="text-sm font-medium text-primary">{row.player}</span>
    </div>
);

/** The full tee sheet — time, member, holes, status, and a quiet actions column. */
export const Playground: Story = {
    args: {
        size: "md",
        "aria-label": "Morning tee sheet",
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="text-right" />
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** Same sheet, but the starter can sort by tee time — click the Time column header. */
export const Sortable: Story = {
    args: {
        "aria-label": "Sortable tee sheet",
    },
    render: (args) => {
        const SortableTable = () => {
            const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
                column: "time",
                direction: "ascending",
            });

            const sorted = [...teeTimes].sort((a, b) => {
                const cmp = a.time.localeCompare(b.time);
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });

            return (
                <Table {...args} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}>
                    <Table.Header>
                        <Table.Head id="time" label="Time" isRowHeader allowsSorting className="w-28" />
                        <Table.Head id="player" label="Player" />
                        <Table.Head id="holes" label="Holes" className="w-24" />
                        <Table.Head id="status" label="Status" className="w-44" />
                    </Table.Header>
                    <Table.Body items={sorted}>
                        {(row) => (
                            <Table.Row id={row.id}>
                                <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                <Table.Cell>
                                    <PlayerCell row={row} />
                                </Table.Cell>
                                <Table.Cell>{row.holes}</Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                        {row.status}
                                    </BadgeWithDot>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            );
        };

        return <SortableTable />;
    },
};

/** Every row ends in a dots menu — edit the booking, copy the link, or scratch it. */
export const WithRowActions: Story = {
    args: {
        "aria-label": "Tee sheet with row actions",
    },
    render: (args) => (
        <Table {...args}>
            <Table.Header>
                <Table.Head label="Time" isRowHeader className="w-28" />
                <Table.Head label="Player" />
                <Table.Head label="Holes" className="w-24" />
                <Table.Head label="Status" className="w-44" />
                <Table.Head label="" className="w-16" />
            </Table.Header>
            <Table.Body items={teeTimes}>
                {(row) => (
                    <Table.Row id={row.id}>
                        <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                        <Table.Cell>
                            <PlayerCell row={row} />
                        </Table.Cell>
                        <Table.Cell>{row.holes}</Table.Cell>
                        <Table.Cell>
                            <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                {row.status}
                            </BadgeWithDot>
                        </Table.Cell>
                        <Table.Cell className="px-4">
                            <div className="flex justify-end">
                                <TableRowActionsDropdown />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    ),
};

/** The tee sheet tucked into a titled card, with selectable rows for the starter. */
export const WithCardWrapper: Story = {
    args: {
        "aria-label": "Tee sheet card",
        selectionMode: "multiple",
    },
    render: (args) => {
        const CardTable = () => {
            const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));

            return (
                <TableCard.Root>
                    <TableCard.Header
                        title="Morning tee sheet"
                        badge="5 bookings"
                        description="First tee, front nine. Saturday, June 18."
                    />
                    <Table {...args} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-28" />
                            <Table.Head label="Player" />
                            <Table.Head label="Holes" className="w-24" />
                            <Table.Head label="Status" className="w-44" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={teeTimes}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                    <Table.Cell>
                                        <PlayerCell row={row} />
                                    </Table.Cell>
                                    <Table.Cell>{row.holes}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                            {row.status}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell className="px-4">
                                        <div className="flex justify-end">
                                            <TableRowActionsDropdown />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            );
        };

        return <CardTable />;
    },
};
