import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
export function dailyOutputDir(runDate, baseDir = "output/daily") {
    return `${baseDir}/${runDate}`;
}
export function dailyArtifactPaths(runDate, baseDir = "output/daily") {
    const dir = dailyOutputDir(runDate, baseDir);
    return {
        dir,
        plan: `${dir}/plan.json`,
        googleEvents: `${dir}/google-events.json`,
        ics: `${dir}/prep-blocks.ics`,
        runNotes: `${dir}/RUN.md`,
    };
}
export function ensureDir(filePath) {
    mkdirSync(dirname(filePath), { recursive: true });
}
export function writeRunNotes(path, plan, options) {
    const blockCount = plan.days.reduce((n, d) => n + d.blocks.length, 0);
    const lines = [
        `# Daily run ${plan.runDate}`,
        "",
        `- **Generated:** ${plan.generatedAt}`,
        `- **Timezone:** ${plan.timezone}`,
        `- **Delivery mode:** ${options.delivery}`,
        `- **Prep blocks:** ${blockCount}`,
        `- **ICS file:** \`${options.icsPath}\``,
        "",
        "## Import (until Google Calendar MCP is approved)",
        "",
        "Google Calendar → Settings → Import & export → Import → select `prep-blocks.ics`.",
        "",
    ];
    if (options.googleAttempted) {
        lines.push(`- **Google Calendar events created:** ${options.googleCreated}`, "");
    }
    if (blockCount === 0) {
        lines.push("_No open slots matched ranked work this run._", "");
    }
    else {
        lines.push("| Start (local) | Block |", "| --- | --- |");
        for (const day of plan.days) {
            for (const b of day.blocks) {
                lines.push(`| ${b.startLocal} | ${b.title} |`);
            }
        }
        lines.push("");
    }
    writeFileSync(path, lines.join("\n"));
}
//# sourceMappingURL=daily-output.js.map