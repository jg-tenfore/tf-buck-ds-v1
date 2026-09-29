"use client";

import type { FC } from "react";
import { useRef, useState } from "react";
import {
    AlignLeft,
    Bold01,
    CheckSquare,
    Dotpoints01,
    Edit05,
    Heading01,
    Heading02,
    Image01,
    Italic01,
    LeftIndent01,
    Link01,
    List,
    RightIndent01,
    Strikethrough01,
    Type01,
    Underline01,
} from "@untitledui/icons";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";

type Command = { icon: FC<{ className?: string }>; label: string; run: () => void };

/**
 * Rich-text disclaimer editor. The legacy screen used a Quill editor; this
 * keeps its shape (title bar with an HTML switch, formatting toolbar, live
 * document) using a contentEditable surface so the formatting buttons work in
 * the prototype. Switching "HTML" on shows the raw markup for editing.
 */
export const RichTextEditor = ({ title, defaultHtml }: { title: string; defaultHtml: string }) => {
    const [html, setHtml] = useState(defaultHtml);
    // The markup the editable surface mounts with. Kept separate from `html` so typing
    // never re-renders the surface (which would reset the caret).
    const [mountHtml, setMountHtml] = useState(defaultHtml);
    const [isSource, setIsSource] = useState(false);
    const surface = useRef<HTMLDivElement>(null);

    // execCommand is deprecated but still the simplest way to drive a prototype editor.
    const exec = (command: string, value?: string) => () => {
        surface.current?.focus();
        document.execCommand(command, false, value);
        setHtml(surface.current?.innerHTML ?? html);
    };

    const groups: Command[][] = [
        [
            { icon: Bold01, label: "Bold", run: exec("bold") },
            { icon: Italic01, label: "Italic", run: exec("italic") },
            { icon: Underline01, label: "Underline", run: exec("underline") },
            { icon: Strikethrough01, label: "Strikethrough", run: exec("strikeThrough") },
        ],
        [
            { icon: Type01, label: "Text color", run: exec("foreColor", "#e05b5b") },
            { icon: Edit05, label: "Highlight", run: exec("hiliteColor", "#ffff00") },
        ],
        [
            { icon: Image01, label: "Insert image", run: () => {} },
            {
                icon: Link01,
                label: "Insert link",
                run: () => {
                    const url = window.prompt("Link URL");
                    if (url) exec("createLink", url)();
                },
            },
        ],
        [
            { icon: Heading01, label: "Heading 1", run: exec("formatBlock", "h1") },
            { icon: Heading02, label: "Heading 2", run: exec("formatBlock", "h2") },
        ],
        [
            { icon: List, label: "Numbered list", run: exec("insertOrderedList") },
            { icon: Dotpoints01, label: "Bulleted list", run: exec("insertUnorderedList") },
            { icon: CheckSquare, label: "Checklist", run: () => {} },
        ],
        [
            { icon: LeftIndent01, label: "Outdent", run: exec("outdent") },
            { icon: RightIndent01, label: "Indent", run: exec("indent") },
        ],
    ];

    const toggleSource = (next: boolean) => {
        if (!next) setMountHtml(html);
        setIsSource(next);
    };

    return (
        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
            <div className="flex items-center justify-between gap-4 border-b border-secondary bg-secondary px-5 py-3">
                <span className="flex items-center gap-3 text-md font-semibold text-primary">
                    <Edit05 className="size-5 text-fg-quaternary" aria-hidden="true" />
                    {title}
                </span>
                <span className="flex items-center gap-3 text-sm font-medium text-secondary">
                    HTML
                    <Toggle aria-label={`${title} HTML source`} size="md" isSelected={isSource} onChange={toggleSource} />
                </span>
            </div>

            {!isSource && (
                <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-secondary px-4 py-2.5"
                    role="toolbar"
                    aria-label={`${title} formatting`}
                >
                    {groups.map((group, i) => (
                        <div key={i} className="flex items-center gap-0.5">
                            {group.map(({ icon: Icon, label, run }) => (
                                <button
                                    key={label}
                                    type="button"
                                    title={label}
                                    aria-label={label}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={run}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-tertiary transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-secondary"
                                >
                                    <Icon className="size-4" />
                                </button>
                            ))}
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        {["Normal", "Normal", "Sans Serif"].map((label, i) => (
                            <select
                                key={i}
                                aria-label={["Heading", "Size", "Font"][i]}
                                defaultValue={label}
                                className="h-8 cursor-pointer rounded-md bg-primary px-2 text-sm font-medium text-secondary ring-1 ring-secondary outline-hidden ring-inset"
                            >
                                <option>{label}</option>
                                <option>{i === 2 ? "Serif" : i === 1 ? "Large" : "Heading 1"}</option>
                                <option>{i === 2 ? "Monospace" : i === 1 ? "Small" : "Heading 2"}</option>
                            </select>
                        ))}
                        <button
                            type="button"
                            title="Align"
                            aria-label="Align"
                            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-tertiary hover:bg-primary_hover"
                        >
                            <AlignLeft className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {isSource ? (
                <textarea
                    aria-label={`${title} HTML`}
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="block min-h-72 w-full resize-y bg-primary px-5 py-4 font-mono text-xs leading-relaxed text-secondary outline-hidden"
                />
            ) : (
                <div
                    ref={surface}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-label={title}
                    onInput={(e) => setHtml(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: mountHtml }}
                    className={cx(
                        "min-h-40 px-5 py-4 text-sm leading-relaxed text-[#1f1f1f] outline-hidden",
                        // Legacy document typography (Quill defaults), kept independent of the app theme.
                        "bg-white [&_a]:text-[#2563eb] [&_a]:underline [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-normal [&_h2]:text-2xl [&_img]:max-w-full",
                    )}
                />
            )}
        </div>
    );
};
