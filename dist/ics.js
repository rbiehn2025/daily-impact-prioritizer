function foldLine(line) {
    const max = 73;
    if (line.length <= max)
        return line;
    const parts = [];
    let rest = line;
    parts.push(rest.slice(0, max));
    rest = rest.slice(max);
    while (rest.length > 0) {
        parts.push(" " + rest.slice(0, max - 1));
        rest = rest.slice(max - 1);
    }
    return parts.join("\r\n");
}
function icsLocalDateTime(isoLocal) {
    return isoLocal.replace(/-/g, "").replace(/:/g, "");
}
function escapeText(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function googleEventDraftsToIcs(events) {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//daily-impact-prioritizer//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
    ];
    for (const ev of events) {
        const uid = `${icsLocalDateTime(ev.start_datetime)}-${ev.summary.replace(/\W+/g, "").slice(0, 24)}@daily-impact-prioritizer`;
        lines.push("BEGIN:VEVENT");
        lines.push(foldLine(`UID:${uid}`));
        lines.push(`DTSTART;TZID=${ev.timezone}:${icsLocalDateTime(ev.start_datetime)}`);
        lines.push(`DTEND;TZID=${ev.timezone}:${icsLocalDateTime(ev.end_datetime)}`);
        lines.push(foldLine(`SUMMARY:${escapeText(ev.summary)}`));
        lines.push(foldLine(`DESCRIPTION:${escapeText(ev.description)}`));
        lines.push("CLASS:PRIVATE");
        lines.push("TRANSP:OPAQUE");
        lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
}
//# sourceMappingURL=ics.js.map