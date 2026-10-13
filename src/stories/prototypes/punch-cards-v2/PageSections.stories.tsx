import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { CoursesCard, DetailsCard, ExpirationCard, ItemRow, ItemsCard, PageHeader, PricingCard } from "@/components/application/punch-cards-v2/page-sections";

/**
 * The New Punch Card page, one section at a time. Data is the Golf & Range
 * Bundle from the concept screenshot.
 */
const meta = {
    title: "Prototypes/Punch Cards V2/1 Page Sections",
    id: "prototypes-punch-cards-v2-page-sections",
    parameters: { layout: "padded", backgrounds: { disable: true } },
    decorators: [(Story) => <div className="min-h-screen bg-secondary p-6">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bundle = combination("bundle").card;
const narrow = (node: React.ReactNode) => <div className="max-w-2xl">{node}</div>;

/** Breadcrumb back to Punch Cards, page title, Cancel and Save Punch Card. */
export const Header: Story = { name: "Page header", render: () => <PageHeader /> };

export const Details: Story = { name: "Details", render: () => narrow(<DetailsCard title={bundle.title} description={bundle.description} />) };

export const DetailsEmpty: Story = { name: "Details · empty", render: () => narrow(<DetailsCard title="" description="" />) };

/** The card's items: kind tile, what it covers, punches, edit and remove. */
export const Items: Story = { name: "Punch Card Items", render: () => narrow(<ItemsCard items={bundle.items} />) };

/** Before anything is added: a short prompt and the Add Item button. */
export const ItemsEmpty: Story = { name: "Punch Card Items · empty", render: () => narrow(<ItemsCard items={[]} />) };

/** One row per item kind. */
export const Rows: Story = {
    name: "Item rows · every kind",
    render: () =>
        narrow(
            <ul className="divide-y divide-secondary rounded-xl bg-primary ring-1 ring-secondary">
                {combination("everything").card.items.map((item) => (
                    <ItemRow key={item.id} item={item} />
                ))}
            </ul>,
        ),
};

/** Price before tax and fees, two tax rates, and the running total. */
export const Pricing: Story = { name: "Pricing", render: () => <div className="max-w-sm">{<PricingCard card={bundle} />}</div> };

/** Never, a number of days after purchase, or a fixed date. */
export const Expiration: Story = { name: "Expiration", render: () => <div className="max-w-sm">{<ExpirationCard value={bundle.expiration} />}</div> };

export const ExpirationDate: Story = {
    name: "Expiration · on a date",
    render: () => <div className="max-w-sm">{<ExpirationCard value={{ mode: "date", days: 365, date: "12/31/2026" }} />}</div>,
};

export const Courses: Story = { name: "Applicable Courses", render: () => <div className="max-w-sm">{<CoursesCard selected={bundle.courses} />}</div> };
