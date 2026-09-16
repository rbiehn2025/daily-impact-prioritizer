import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
export function loadConfig(path) {
    const configPath = path ?? join(__dirname, "..", "config", "default.json");
    const raw = readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed;
}
export function parseLocalTimeOnDate(date, hhmm, timeZone) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = hhmm.split(":").map(Number);
    const utcGuess = Date.UTC(y, m - 1, d, hh, mm, 0);
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });
    const parts = formatter.formatToParts(new Date(utcGuess));
    const get = (type) => Number(parts.find((p) => p.type === type)?.value);
    const asLocal = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    const offset = asLocal - utcGuess;
    return new Date(utcGuess - offset);
}
export function formatIsoLocal(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });
    return formatter.format(date).replace(" ", "T");
}
export function localDateString(date, timeZone) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}
export function weekdayIndexInTimeZone(date, timeZone) {
    const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
    }).format(date);
    const map = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    };
    return map[weekday] ?? 0;
}
export function addDaysIso(date, days) {
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + days));
    return dt.toISOString().slice(0, 10);
}
export function listWeekdayDatesFrom(start, endInclusive, timeZone) {
    const out = [];
    let cur = start;
    while (cur <= endInclusive) {
        const probe = parseLocalTimeOnDate(cur, "12:00", timeZone);
        const dow = weekdayIndexInTimeZone(probe, timeZone);
        if (dow >= 1 && dow <= 5)
            out.push(cur);
        cur = addDaysIso(cur, 1);
    }
    return out;
}
//# sourceMappingURL=config.js.map