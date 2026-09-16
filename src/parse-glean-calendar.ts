import type { CalendarBusyBlock } from "./types.js";

/** Glean meeting_lookup document shape (partial). */
export interface GleanMeetingDocument {
  title?: string;
  url?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  snippets?: string[];
}

const GLEAN_TIME =
  /^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})\s([+-]\d{2}:\d{2})$/;

export function parseGleanEventTime(raw: string): Date {
  const m = raw.trim().match(GLEAN_TIME);
  if (!m) {
    return new Date(raw);
  }
  const [, date, time, offset] = m;
  return new Date(`${date}T${time}${offset}`);
}

export function gleanDocumentsToBusyBlocks(
  docs: GleanMeetingDocument[],
  options: {
    skipTitlePatterns: RegExp[];
    skipAllDayWorkingLocation?: boolean;
  },
): CalendarBusyBlock[] {
  const blocks: CalendarBusyBlock[] = [];
  for (const doc of docs) {
    if (!doc.eventStartTime || !doc.eventEndTime || !doc.title) continue;
    const start = parseGleanEventTime(doc.eventStartTime);
    const end = parseGleanEventTime(doc.eventEndTime);
    const durationMs = end.getTime() - start.getTime();
    const allDay = durationMs >= 23 * 60 * 60 * 1000;
    if (options.skipAllDayWorkingLocation !== false && allDay) continue;
    if (options.skipTitlePatterns.some((re) => re.test(doc.title!))) continue;
    blocks.push({
      title: doc.title,
      start,
      end,
      sourceUrl: doc.url,
      allDay,
    });
  }
  return blocks.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function blocksForLocalDate(
  blocks: CalendarBusyBlock[],
  date: string,
  timeZone: string,
): CalendarBusyBlock[] {
  return blocks.filter(
    (b) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(b.start) === date,
  );
}
