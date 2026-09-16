#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { loadConfig, localDateString, weekdayIndexInTimeZone, } from "./config.js";
import { dailyArtifactPaths, ensureDir, writeRunNotes, } from "./daily-output.js";
import { gleanDocumentsToBusyBlocks } from "./parse-glean-calendar.js";
import { endOfWeekIso, planWeek } from "./planner.js";
import { buildGoogleEventDraft, flattenBlocks } from "./google-event.js";
import { googleEventDraftsToIcs } from "./ics.js";
const cmd = process.argv[2];
function readJson(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}
function runPlanner(calendarPath, itemsPath, configPath) {
    const config = loadConfig(configPath);
    const skipPatterns = config.calendar.skipTitlePatterns.map((p) => new RegExp(p));
    const docs = readJson(calendarPath);
    const busy = gleanDocumentsToBusyBlocks(docs, {
        skipTitlePatterns: skipPatterns,
    });
    const items = readJson(itemsPath);
    const now = new Date();
    const runDate = localDateString(now, config.timezone);
    const horizon = endOfWeekIso(runDate, config.timezone);
    const plan = planWeek(now, busy, items, config, horizon);
    const drafts = flattenBlocks(plan).map((b) => buildGoogleEventDraft(b, config, plan.runDate));
    return { plan, drafts, config };
}
if (cmd === "plan") {
    const calendarPath = requireArg("--calendar");
    const itemsPath = requireArg("--items");
    const outPath = arg("--out") ?? "plan.json";
    const configPath = arg("--config");
    const { plan } = runPlanner(calendarPath, itemsPath, configPath);
    writeFileSync(outPath, JSON.stringify(plan, null, 2));
    console.log(`Wrote ${outPath} (${plan.days.reduce((n, d) => n + d.blocks.length, 0)} blocks)`);
}
else if (cmd === "format-events") {
    const planPath = arg("--plan") ?? "plan.json";
    const outPath = arg("--out") ?? "google-events.json";
    const configPath = arg("--config");
    const config = loadConfig(configPath);
    const plan = readJson(planPath);
    const drafts = flattenBlocks(plan).map((b) => buildGoogleEventDraft(b, config, plan.runDate));
    writeFileSync(outPath, JSON.stringify(drafts, null, 2));
    console.log(`Wrote ${outPath} (${drafts.length} events)`);
}
else if (cmd === "export-ics") {
    const eventsPath = arg("--events") ?? "google-events.json";
    const outPath = arg("--out") ?? "output/prep-blocks.ics";
    const events = readJson(eventsPath);
    ensureDir(outPath);
    writeFileSync(outPath, googleEventDraftsToIcs(events));
    console.log(`Wrote ${outPath} (${events.length} events)`);
}
else if (cmd === "daily") {
    const calendarPath = requireArg("--calendar");
    const itemsPath = requireArg("--items");
    const configPath = arg("--config");
    const { plan, drafts, config } = runPlanner(calendarPath, itemsPath, configPath);
    if (config.schedule?.weekdaysOnly) {
        const now = new Date();
        const dow = weekdayIndexInTimeZone(now, config.timezone);
        if (dow === 0 || dow === 6) {
            console.log(JSON.stringify({
                skipped: true,
                reason: "weekend",
                runDate: plan.runDate,
            }));
            process.exit(0);
        }
    }
    const baseDir = config.calendar.dailyOutputBaseDir ?? "output/daily";
    const paths = dailyArtifactPaths(plan.runDate, baseDir);
    ensureDir(paths.plan);
    writeFileSync(paths.plan, JSON.stringify(plan, null, 2));
    writeFileSync(paths.googleEvents, JSON.stringify(drafts, null, 2));
    writeFileSync(paths.ics, googleEventDraftsToIcs(drafts));
    writeRunNotes(paths.runNotes, plan, {
        delivery: config.calendar.delivery ?? "ics_fallback",
        googleAttempted: false,
        googleCreated: 0,
        icsPath: paths.ics,
    });
    const blockCount = plan.days.reduce((n, d) => n + d.blocks.length, 0);
    console.log(JSON.stringify({
        skipped: false,
        runDate: plan.runDate,
        blockCount,
        delivery: config.calendar.delivery ?? "ics_fallback",
        googleCalendarWrites: config.calendar.googleCalendarWrites ?? false,
        artifacts: paths,
    }));
}
else {
    console.error(`Usage:
  daily --calendar meetings.json --items work-items.json
  plan --calendar meetings.json --items work-items.json [--out plan.json]
  format-events --plan plan.json [--out google-events.json]
  export-ics --events google-events.json [--out output/prep-blocks.ics]`);
    process.exit(1);
}
function arg(name) {
    const i = process.argv.indexOf(name);
    if (i === -1)
        return undefined;
    return process.argv[i + 1];
}
function requireArg(name) {
    const value = arg(name);
    if (!value) {
        console.error(`Missing required argument ${name}`);
        process.exit(1);
    }
    return value;
}
//# sourceMappingURL=cli.js.map