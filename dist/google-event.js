export function buildGoogleEventDraft(block, config, runDate) {
    const marker = config.calendar.managedMarker;
    const description = [
        `<b>Expected outcome</b><br>${escapeHtml(block.expectedOutcome)}`,
        `<br><br><b>Why now</b><br>${escapeHtml(block.rationale)}`,
        `<br><br><b>Source</b><br><a href='${escapeHtmlAttr(block.sourceUrl)}'>${escapeHtmlAttr(block.sourceUrl)}</a>`,
        `<br><br><i>Managed by ${marker}. Run date: ${runDate}</i>`,
    ].join("");
    const extended = {
        private: {
            [marker]: "true",
            dip_run_date: runDate,
            dip_work_item_id: block.workItemId,
        },
    };
    return {
        summary: block.title,
        description,
        start_datetime: block.startLocal,
        end_datetime: block.endLocal,
        timezone: config.timezone,
        visibility: config.calendar.visibility,
        create_meeting_room: false,
        extended_properties: JSON.stringify(extended),
    };
}
export function isManagedPrioritizerEvent(title, description, config) {
    if (title.startsWith(config.calendar.eventTitlePrefix))
        return true;
    if (description?.includes(`Managed by ${config.calendar.managedMarker}`)) {
        return true;
    }
    return false;
}
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function escapeHtmlAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
}
export function flattenBlocks(plan) {
    return plan.days.flatMap((d) => d.blocks);
}
//# sourceMappingURL=google-event.js.map