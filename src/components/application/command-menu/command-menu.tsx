"use client";

import type { ComponentType, HTMLAttributes } from "react";
import { ArrowUp, CornerDownLeft, SearchLg } from "@untitledui/icons";
import { useFilter } from "react-aria";
import {
    Autocomplete,
    Dialog,
    Header,
    Input as AriaInput,
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Modal,
    ModalOverlay,
    SearchField,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export interface CommandMenuItem {
    /** Label shown in the row and used for search matching. */
    label: string;
    /** Unique key / destination for the item. */
    href: string;
    /** Icon component to display. */
    icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
    /** Optional trailing hint (e.g. the parent section path). */
    hint?: string;
}

export interface CommandMenuGroup {
    /** Section heading shown above the group. */
    label: string;
    /** Rows in this group. */
    items: CommandMenuItem[];
}

interface CommandMenuProps {
    /** Whether the command menu is open. */
    isOpen: boolean;
    /** Called when the open state should change. */
    onOpenChange: (isOpen: boolean) => void;
    /** Grouped items to display. */
    groups: CommandMenuGroup[];
    /** Called with the selected item's `href` when a row is activated. */
    onSelect?: (href: string) => void;
    /** Placeholder for the search field. */
    placeholder?: string;
}

/**
 * A ⌘K-style command menu built on React Aria's `Autocomplete` — a search field
 * that filters a grouped `ListBox` in real time, inside a dismissable modal.
 * Styled with Untitled UI semantic tokens. Pair it with a trigger (e.g. the
 * sidebar search button) that flips `isOpen`.
 */
export const CommandMenu = ({ isOpen, onOpenChange, groups, onSelect, placeholder = "Search…" }: CommandMenuProps) => {
    const { contains } = useFilter({ sensitivity: "base" });

    return (
        <ModalOverlay
            isDismissable
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={({ isEntering, isExiting }) =>
                cx(
                    "fixed inset-0 z-50 flex justify-center bg-overlay/70 px-4 pt-[12vh] backdrop-blur-sm",
                    isEntering && "duration-200 ease-out animate-in fade-in",
                    isExiting && "duration-150 ease-in animate-out fade-out",
                )
            }
        >
            <Modal
                className={({ isEntering, isExiting }) =>
                    cx(
                        "h-max w-full max-w-xl",
                        isEntering && "duration-200 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-1",
                        isExiting && "duration-150 ease-in animate-out fade-out zoom-out-95",
                    )
                }
            >
                <Dialog aria-label="Command menu" className="flex max-h-[70vh] flex-col overflow-hidden rounded-xl bg-primary shadow-xl ring-1 ring-secondary_alt outline-hidden">
                    <Autocomplete filter={contains}>
                        {/* Search field */}
                        <div className="flex items-center gap-2.5 border-b border-secondary px-4">
                            <SearchLg aria-hidden="true" className="size-5 shrink-0 text-fg-quaternary" />
                            <SearchField aria-label="Search navigation" autoFocus className="flex-1">
                                <AriaInput
                                    placeholder={placeholder}
                                    className="w-full bg-transparent py-4 text-md text-primary outline-hidden placeholder:text-placeholder"
                                />
                            </SearchField>
                            <kbd className="hidden rounded px-1.5 py-0.5 font-body text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset sm:inline-block">
                                Esc
                            </kbd>
                        </div>

                        {/* Results */}
                        <ListBox
                            aria-label="Navigation items"
                            selectionMode="none"
                            onAction={(key) => {
                                onSelect?.(String(key));
                                onOpenChange(false);
                            }}
                            className="flex max-h-100 flex-col gap-1 overflow-y-auto p-2 outline-hidden"
                            renderEmptyState={() => (
                                <div className="px-3 py-10 text-center text-sm text-tertiary">No results found.</div>
                            )}
                        >
                            {groups.map((group) => (
                                <ListBoxSection key={group.label} className="flex flex-col gap-0.5">
                                    <Header className="px-2 pt-3 pb-1 text-xs font-semibold text-quaternary first:pt-1">{group.label}</Header>
                                    {group.items.map((item) => (
                                        <ListBoxItem
                                            key={item.href}
                                            id={item.href}
                                            textValue={`${item.label} ${item.hint ?? ""}`.trim()}
                                            className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm outline-hidden select-none hover:bg-primary_hover focus:bg-primary_hover data-[focused]:bg-primary_hover"
                                        >
                                            {item.icon && (
                                                <item.icon aria-hidden="true" className="size-5 shrink-0 text-fg-quaternary" />
                                            )}
                                            <span className="flex-1 truncate font-medium text-secondary">{item.label}</span>
                                            {item.hint && <span className="truncate text-xs text-quaternary">{item.hint}</span>}
                                            <CornerDownLeft
                                                aria-hidden="true"
                                                className="size-4 shrink-0 text-fg-quaternary opacity-0 group-data-[focused]:opacity-100"
                                            />
                                        </ListBoxItem>
                                    ))}
                                </ListBoxSection>
                            ))}
                        </ListBox>

                        {/* Footer legend */}
                        <div className="flex items-center gap-4 border-t border-secondary px-4 py-2.5 text-xs text-quaternary">
                            <span className="flex items-center gap-1.5">
                                <kbd className="flex size-5 items-center justify-center rounded ring-1 ring-secondary ring-inset">
                                    <ArrowUp className="size-3" />
                                </kbd>
                                <kbd className="flex size-5 items-center justify-center rounded ring-1 ring-secondary ring-inset">
                                    <ArrowUp className="size-3 rotate-180" />
                                </kbd>
                                to navigate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="flex size-5 items-center justify-center rounded ring-1 ring-secondary ring-inset">
                                    <CornerDownLeft className="size-3" />
                                </kbd>
                                to select
                            </span>
                        </div>
                    </Autocomplete>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
