import type { CalendarBusyBlock } from "./types.js";
/** Glean meeting_lookup document shape (partial). */
export interface GleanMeetingDocument {
    title?: string;
    url?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    snippets?: string[];
}
export declare function parseGleanEventTime(raw: string): Date;
export declare function gleanDocumentsToBusyBlocks(docs: GleanMeetingDocument[], options: {
    skipTitlePatterns: RegExp[];
    skipAllDayWorkingLocation?: boolean;
}): CalendarBusyBlock[];
export declare function blocksForLocalDate(blocks: CalendarBusyBlock[], date: string, timeZone: string): CalendarBusyBlock[];
