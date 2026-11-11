import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AllOrdersPage, RoundsByCustomerPage, TeeSheetReportPage } from "@/components/application/nov-11-2026/feedback";

/**
 * Buck rows from the MCG feedback file reviewed on the Nov 11 call. Each story
 * names the row it answers.
 */
const meta = {
    title: "Nov 11, 2026/Feedback File",
    id: "nov-11-2026-feedback",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Row 53 (HG, Nov 11): "would be nice to have a search option to eliminate going back to customer search and going profile by profile." */
export const RoundsSearch: Story = {
    name: "Rounds by Customer · search",
    render: () => <RoundsByCustomerPage initialQuery="310" />,
};

/** Row 22 (HG, Oct 8): refunded no-show rounds shouldn't disappear from a customer's rounds history. Open a customer to see every round in place. */
export const RoundsExpanded: Story = {
    name: "Rounds by Customer · refunded no-show kept",
    render: () => <RoundsByCustomerPage initialOpen={["40112"]} />,
};

/** Row 26 (HQ, Oct 14): tee sheet reports need a search by name. */
export const BookedReservations: Story = {
    name: "Booked Reservations · search",
    render: () => <TeeSheetReportPage report="booked" initialQuery="pemberton" />,
};

export const OnlineReservations: Story = {
    name: "Online Reservations · search",
    render: () => <TeeSheetReportPage report="online" />,
};

export const NoShows: Story = {
    name: "No Shows · search",
    render: () => <TeeSheetReportPage report="noShows" />,
};

/** Row 48 (HQ, Nov 6): the order status filter should stay the same when switching course. Set to Refunded on The Dunes, then switched to Bushwood. */
export const OrdersFilterKept: Story = {
    name: "All Orders · filter kept across courses",
    render: () => <AllOrdersPage initialCourse="bushwood" initialStatus="Refunded" keptFrom="dunes" />,
};

/** Row 48, second half: Problem Orders was showing cancelled orders. They're hidden, with a switch to bring them back. */
export const ProblemOrders: Story = {
    name: "Problem Orders · cancelled hidden",
    render: () => <AllOrdersPage initialTab="problem" />,
};
