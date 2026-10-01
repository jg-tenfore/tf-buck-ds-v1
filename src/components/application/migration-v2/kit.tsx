"use client";

import type { FC, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { createContext, useContext } from "react";
import { Calendar, ChevronDown, Download01, List, MessageChatCircle, PlusCircle, User01, XClose } from "@untitledui/icons";
import { Dialog as AriaDialog, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { staticAsset } from "@/utils/static-asset";
import { COURSES, type CourseKey } from "./data";
import { GlobalNav, type GlobalNavProps } from "./global-nav";

/* -------------------------------------------------------------------------- */
/*  App shell                                                                 */
/* -------------------------------------------------------------------------- */

export interface ScreenShellProps {
    /** Global Nav state for this screen (active page, search term…). */
    nav: GlobalNavProps;
    course?: CourseKey;
    title: string;
    description: string;
    /** Header action, e.g. "Add Credit Book". */
    action?: ReactNode;
    /** Browser-style tab strip under the header. */
    tabs?: ReactNode;
    /** Replace the standard page header entirely (record pages in Migration V2 Ideas). */
    header?: ReactNode;
    children: ReactNode;
}

/**
 * Back-office page frame: Global Nav, top bar (course switcher + account),
 * page header, optional tab strip, then the gray work area. Every Migration V2
 * screen renders inside this so the global architecture stays identical.
 */
/**
 * When true, ScreenShell renders only its header + content — used to drop a
 * full screen (a table, a record page) inside another screen's tab.
 */
export const EmbeddedShellContext = createContext(false);

export const ScreenShell = (props: ScreenShellProps) =>
    useContext(EmbeddedShellContext) ? (
        <div className="flex flex-col gap-5">
            {props.header}
            {props.children}
        </div>
    ) : (
        <FullScreenShell {...props} />
    );

const FullScreenShell = ({ nav, course = "dunes", title, description, action, tabs, header, children }: ScreenShellProps) => (
    <div className="flex h-screen min-h-[720px] overflow-hidden bg-secondary">
        <GlobalNav {...nav} />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <TopBar course={course} />
            {header ?? (
                <header className="flex items-start justify-between gap-6 border-b border-secondary bg-primary px-8 pt-6 pb-5">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-semibold text-primary">{title}</h1>
                        <p className="text-md text-tertiary">{description}</p>
                    </div>
                    {action}
                </header>
            )}
            {tabs}
            <main className="flex flex-1 flex-col gap-5 px-8 py-6">{children}</main>
        </div>
        <ChatBubble />
    </div>
);

const TopBar = ({ course }: { course: CourseKey }) => {
    const c = COURSES[course];
    return (
        <div className="sticky top-0 z-20 flex h-18 shrink-0 items-center justify-end gap-3 border-b border-secondary bg-primary px-6">
            <button
                type="button"
                className="flex h-11 cursor-pointer items-center gap-3 rounded-lg bg-primary py-1.5 pr-3 pl-1.5 shadow-xs ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover"
            >
                <img src={staticAsset(c.logo)} alt="" className="size-8 rounded-md object-cover ring-1 ring-secondary" />
                <span className="text-sm font-semibold text-primary">{c.name}</span>
                <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
            </button>
            <button
                type="button"
                aria-label="Account"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full text-fg-secondary ring-2 ring-fg-secondary ring-inset hover:bg-primary_hover"
            >
                <User01 className="size-5" />
            </button>
        </div>
    );
};

const ChatBubble = () => (
    <button
        type="button"
        aria-label="Chat with support"
        className="fixed right-6 bottom-6 z-30 flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand-solid text-white shadow-lg transition duration-100 ease-linear hover:bg-brand-solid_hover"
    >
        <MessageChatCircle className="size-6" />
    </button>
);

/* -------------------------------------------------------------------------- */
/*  Header action + tab strip                                                 */
/* -------------------------------------------------------------------------- */

/** Green "+ Add …" link in the page header. */
export const HeaderAction = ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <Button color="link-color" size="md" iconLeading={PlusCircle} onClick={onClick}>
        {label}
    </Button>
);

export type ScreenTab = {
    id: string;
    label?: string;
    /** Second line under the label (e.g. a balance). */
    sublabel?: string;
    icon?: FC<{ className?: string }>;
    closable?: boolean;
};

/**
 * Browser-style tabs: the first tab is the list view; detail views (a customer,
 * a payment, Bulk Entry) open as closable tabs beside it.
 */
export const TabStrip = ({
    tabs,
    activeId,
    onSelect,
    onClose,
}: {
    tabs: ScreenTab[];
    activeId: string;
    onSelect?: (id: string) => void;
    onClose?: (id: string) => void;
}) => (
    <div role="tablist" className="flex items-end gap-1 border-b border-secondary bg-primary px-8 pt-3">
        {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            const Icon = tab.icon ?? List;
            return (
                <div
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    className={cx(
                        "-mb-px flex items-center gap-2 rounded-t-lg border border-b-0 px-3.5 py-2 text-sm font-semibold transition duration-100 ease-linear",
                        isActive ? "border-secondary bg-secondary text-primary" : "border-transparent text-tertiary hover:text-secondary",
                    )}
                >
                    <button type="button" onClick={() => onSelect?.(tab.id)} className="flex cursor-pointer items-center gap-2">
                        <Icon className="size-4 shrink-0" />
                        {tab.label && (
                            <span className="flex flex-col items-start leading-tight">
                                <span>{tab.label}</span>
                                {tab.sublabel && <span className="text-xs font-medium text-tertiary">{tab.sublabel}</span>}
                            </span>
                        )}
                    </button>
                    {tab.closable && (
                        <button
                            type="button"
                            aria-label={`Close ${tab.label}`}
                            onClick={() => onClose?.(tab.id)}
                            className="ml-1 flex size-5 cursor-pointer items-center justify-center rounded text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover"
                        >
                            <XClose className="size-3.5" />
                        </button>
                    )}
                </div>
            );
        })}
    </div>
);

/** Underlined, letter-spaced section tabs inside a detail view (DETAILS / CUSTOMERS (23) / …). */
export const InnerTabs = ({ tabs, activeId, onChange }: { tabs: { id: string; label: string }[]; activeId: string; onChange?: (id: string) => void }) => (
    <div role="tablist" className="flex gap-6 border-b border-secondary">
        {tabs.map((t) => (
            <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === activeId}
                onClick={() => onChange?.(t.id)}
                className={cx(
                    "-mb-px cursor-pointer border-b-2 px-1 pb-3 text-xs font-semibold tracking-[0.12em] uppercase transition duration-100 ease-linear",
                    t.id === activeId ? "border-fg-brand-primary text-brand-secondary" : "border-transparent text-tertiary hover:text-secondary",
                )}
            >
                {t.label}
            </button>
        ))}
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Fields + toolbar                                                          */
/* -------------------------------------------------------------------------- */

export const FieldLabel = ({ children }: { children: ReactNode }) => <span className="text-sm font-medium text-secondary">{children}</span>;

/** Date input look-alike (value + calendar icon), matching the screens' date pickers. */
export const DateField = ({ label, value, placeholder, className }: { label?: string; value?: string; placeholder?: string; className?: string }) => (
    <label className={cx("flex flex-col gap-1.5", className)}>
        {label && <FieldLabel>{label}</FieldLabel>}
        <span className="flex h-11 items-center gap-2 rounded-lg bg-primary px-3.5 shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand">
            <input
                defaultValue={value}
                placeholder={placeholder}
                aria-label={label ?? placeholder}
                className="min-w-0 flex-1 bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder"
            />
            <Calendar className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        </span>
    </label>
);

export const ExportButton = () => (
    <Button color="secondary" size="md" iconLeading={Download01} iconTrailing={ChevronDown}>
        Export
    </Button>
);

/** Small green "+ New" style link used inside cards and sections. */
export const InlineAction = ({ icon: Icon = PlusCircle, children }: { icon?: FC<{ className?: string }>; children: ReactNode }) => (
    <button type="button" className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
        <Icon className="size-4" />
        {children}
    </button>
);

/* -------------------------------------------------------------------------- */
/*  Tables                                                                    */
/* -------------------------------------------------------------------------- */

export const TableCard = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx("overflow-x-auto rounded-xl bg-primary shadow-xs ring-1 ring-secondary", className)}>
        <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
);

export const Th = ({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...rest} className={cx("bg-secondary px-4 py-3 text-xs font-semibold tracking-wider whitespace-nowrap text-tertiary uppercase", className)}>
        {children}
    </th>
);

export const Td = ({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...rest} className={cx("border-t border-secondary px-4 py-3.5 align-middle text-primary", className)}>
        {children}
    </td>
);

/** Green link-styled cell text (IDs, names, emails that open something). */
export const LinkText = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-left font-medium text-brand-secondary hover:text-brand-secondary_hover hover:underline"
    >
        {children}
    </button>
);

export const Dash = () => (
    <span className="text-quaternary" aria-label="None">
        —
    </span>
);

/** Bordered box with centered gray text — the screens' standard empty state. */
export const EmptyBox = ({ children, bordered = true }: { children: ReactNode; bordered?: boolean }) => (
    <div className={cx("px-4 py-4 text-center text-sm text-tertiary", bordered && "rounded-xl bg-primary ring-1 ring-secondary")}>{children}</div>
);

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */

/** Modal dialog with title bar, body and a right-aligned footer. */
export const ScreenModal = ({
    title,
    isOpen,
    onClose,
    footer,
    children,
    width = "max-w-md",
}: {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    footer: ReactNode;
    children: ReactNode;
    width?: string;
}) => (
    <AriaModalOverlay
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-6 backdrop-blur-[2px]"
    >
        <AriaModal className={cx("w-full", width)}>
            <AriaDialog
                aria-label={title}
                className="flex max-h-[85vh] flex-col overflow-hidden rounded-xl bg-primary shadow-xl ring-1 ring-secondary_alt outline-hidden"
            >
                <div className="flex items-center justify-between gap-4 border-b border-secondary px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                    >
                        <XClose className="size-5" />
                    </button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">{children}</div>
                <div className="flex justify-end gap-3 border-t border-secondary px-5 py-4">{footer}</div>
            </AriaDialog>
        </AriaModal>
    </AriaModalOverlay>
);

/**
 * Props that make a whole table row open something (used by Migration V2
 * Ideas). Returns nothing when there's no handler, so today's tables keep
 * their link-only behavior.
 */
export const clickableRow = (onOpen?: () => void) =>
    onOpen
        ? {
              onClick: onOpen,
              onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen();
                  }
              },
              tabIndex: 0,
              role: "link" as const,
              className: "cursor-pointer transition duration-100 ease-linear hover:bg-primary_hover focus-visible:bg-primary_hover focus-visible:outline-none",
          }
        : {};
