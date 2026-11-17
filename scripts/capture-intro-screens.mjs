// Captures the prototype screens shown on Storybook's Start Here pages
// (Overview, Style guide, Process & roadmap, How to review) and the Archive note.
//
//   npm run storybook                              (in another terminal; serves :6018)
//   node scripts/capture-intro-screens.mjs         (every shot)
//   node scripts/capture-intro-screens.mjs bay-a   (only the named shots)
//
// Headless Chrome over the DevTools protocol, no extra packages: a fresh profile,
// a 1440 × 900 window, each story opened on its own, ~4 s to settle, then a
// screenshot. macOS `sips` turns it into a ~1200px JPEG in
// src/stories/start-here/screens/. Re-run after a visible change to a screen.
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/stories/start-here/screens");
const base = process.env.STORYBOOK_URL ?? "http://localhost:6018/";
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9341;
const WIDTH = 1440;
const HEIGHT = 900;
const SETTLE_MS = 4000;
mkdirSync(out, { recursive: true });

/** [file, story id, optional { clip: [x, y, width, height] in CSS px, width: output px }] */
const SHOTS = [
    // Simulator Bays › Bay Sheet (Nov 11)
    ["bay-a", "nov-17-2026-bay-sheet--concept-a"],
    ["bay-b", "nov-17-2026-bay-sheet--concept-b"],
    ["bay-book", "nov-17-2026-bay-sheet--book"],
    // Products (Oct 27)
    ["products-list", "products-oct-27-products--list"],
    ["products-record", "products-oct-27-products--option-a-sections"],
    ["punch-list", "products-oct-27-punch-cards--list"],
    // Credits (Oct 27)
    ["credits-list", "credits-oct-27-gift-cards--list"],
    ["credits-sub-tabs", "credits-oct-27-gift-cards--option-b-sub-tabs"],
    ["credits-unsaved", "credits-oct-27-gift-cards--unsaved-changes"],
    // Full application
    ["app-tee-sheet", "app-screens-golf--daily-tee-sheet"],
    ["app-dashboard", "app-screens-dashboard--default"],
    // MCG Feedback Fixes (Nov 11)
    ["feedback-rounds", "nov-11-2026-feedback--rounds-search"],
    // Archive
    ["archive-ideas", "migration-v2-ideas-punch-cards--idea-1"],
];

const only = process.argv.slice(2);
const shots = only.length ? SHOTS.filter(([name]) => only.includes(name)) : SHOTS;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(path.join(tmpdir(), "buck-capture-"));
const browser = spawn(
    chrome,
    [
        "--headless=new",
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${profile}`,
        `--window-size=${WIDTH},${HEIGHT}`,
        "--hide-scrollbars",
        "--no-first-run",
        "--no-default-browser-check",
        "about:blank",
    ],
    { stdio: "ignore" },
);

/** Wait for Chrome's debugging endpoint to answer. */
async function devtools() {
    for (let i = 0; i < 50; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
            if (res.ok) return;
        } catch {
            /* not up yet */
        }
        await sleep(200);
    }
    throw new Error("Chrome did not start");
}

/** A minimal CDP session on one page target. */
async function openPage() {
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });
    let seq = 0;
    const pending = new Map();
    const listeners = new Map();
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
        } else if (msg.method && listeners.has(msg.method)) {
            listeners.get(msg.method)(msg.params);
            listeners.delete(msg.method);
        }
    };
    const send = (method, params = {}) =>
        new Promise((resolve, reject) => {
            const id = ++seq;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    const once = (method) => new Promise((resolve) => listeners.set(method, resolve));
    const close = async () => {
        ws.close();
        await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`).catch(() => {});
    };
    return { send, once, close };
}

try {
    await devtools();
    for (const [file, id, opts = {}] of shots) {
        // A fresh page per shot, so no state carries from one story to the next.
        const page = await openPage();
        await page.send("Page.enable");
        await page.send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
        const loaded = page.once("Page.loadEventFired");
        await page.send("Page.navigate", { url: `${base}iframe.html?viewMode=story&id=${encodeURIComponent(id)}` });
        await loaded;
        await sleep(SETTLE_MS);
        const clip = opts.clip ? { x: opts.clip[0], y: opts.clip[1], width: opts.clip[2], height: opts.clip[3], scale: 1 } : undefined;
        const { data } = await page.send("Page.captureScreenshot", { format: "png", ...(clip ? { clip } : {}) });
        await page.close();

        const png = path.join(profile, `${file}.png`);
        const jpg = path.join(out, `${file}.jpg`);
        writeFileSync(png, Buffer.from(data, "base64"));
        execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "62", "--resampleWidth", String(opts.width ?? 1200), png, "--out", jpg], {
            stdio: "ignore",
        });
        console.log(`  ✓ ${file}  (${id})`);
    }
} finally {
    browser.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
}
