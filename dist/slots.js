import { parseLocalTimeOnDate } from "./config.js";
function mergeBusy(blocks) {
    if (blocks.length === 0)
        return [];
    const sorted = [...blocks].sort((a, b) => a.start.getTime() - b.start.getTime());
    const merged = [{ ...sorted[0] }];
    for (let i = 1; i < sorted.length; i++) {
        const cur = sorted[i];
        const last = merged[merged.length - 1];
        if (cur.start.getTime() <= last.end.getTime()) {
            if (cur.end.getTime() > last.end.getTime()) {
                last.end = cur.end;
            }
        }
        else {
            merged.push({ ...cur });
        }
    }
    return merged;
}
export function findFreeSlotsForDay(date, busy, config) {
    const { timezone, workingHours, slots } = config;
    const dayStart = parseLocalTimeOnDate(date, workingHours.start, timezone);
    const dayEnd = parseLocalTimeOnDate(date, workingHours.end, timezone);
    const bufferMs = slots.meetingBufferMinutes * 60_000;
    const inflated = mergeBusy(busy.map((b) => ({
        ...b,
        start: new Date(b.start.getTime() - bufferMs),
        end: new Date(b.end.getTime()),
    })));
    const windows = [];
    let cursor = dayStart;
    for (const block of inflated) {
        const busyStart = block.start < dayStart ? dayStart : block.start;
        const busyEnd = block.end > dayEnd ? dayEnd : block.end;
        if (busyEnd <= dayStart || busyStart >= dayEnd)
            continue;
        if (busyStart > cursor) {
            const gapEnd = busyStart < dayEnd ? busyStart : dayEnd;
            if (gapEnd > cursor) {
                windows.push(slot(cursor, gapEnd));
            }
        }
        if (block.end > cursor)
            cursor = block.end > dayEnd ? dayEnd : block.end;
    }
    if (cursor < dayEnd) {
        windows.push(slot(cursor, dayEnd));
    }
    return windows.filter((w) => w.durationMinutes >= slots.minBlockMinutes);
}
function slot(start, end) {
    return {
        start,
        end,
        durationMinutes: Math.floor((end.getTime() - start.getTime()) / 60_000),
    };
}
export function trimSlotToMinutes(slot, minutes) {
    const end = new Date(slot.start.getTime() + minutes * 60_000);
    if (end > slot.end) {
        throw new Error("Slot too short for requested minutes");
    }
    return {
        start: slot.start,
        end,
        durationMinutes: minutes,
    };
}
//# sourceMappingURL=slots.js.map