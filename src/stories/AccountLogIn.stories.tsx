import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthSimple } from "./account-auth-simple";

/**
 * Simple log-in page for the Sagamore member portal — an elevated Untitled UI
 * card with email + password, a green sign-in CTA, and the Google / Apple icon
 * social group.
 */
const meta: Meta = {
    title: "Sign in ∕ Sign up/Log in",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: () => <AuthSimple defaultMode="login" />,
};
