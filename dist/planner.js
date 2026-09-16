import { formatIsoLocal, listWeekdayDatesFrom, localDateString, parseLocalTimeOnDate, } from "./config.js";
import { blocksForLocalDate } from "./parse-glean-calendar.js";
import { findFreeSlotsForDay, trimSlotToMinutes } from "./slots.js";
function itemSortScore(item) {
    return (item.urgencyScore * 2 +
        item.impactScore * 1.5 +
        Math.min(item.timeboxMinutes, 120) / 60);
}
export function planWeek(runAt, busyBlocks, workItems, config, horizonEnd) {
    const timeZone = config.timezone;
    const runDate = localDateString(runAt, timeZone);
    const dates = listWeekdayDatesFrom(runDate, horizonEnd, timeZone);
    const sortedItems = [...workItems].sort((a, b) => itemSortScore(b) - itemSortScore(a));
    const assigned = new Set();
    const days = [];
    for (const date of dates) {
        const dayBusy = blocksForLocalDate(busyBlocks, date, timeZone);
        let slots = findFreeSlotsForDay(date, dayBusy, config);
        const blocks = [];
        const unassigned = [];
        const candidates = sortedItems.filter((item) => !assigned.has(item.id) &&
            (!item.targetDate || item.targetDate === date));
        let blockCount = 0;
        for (const item of candidates) {
            if (blockCount >= config.slots.maxBlocksPerDay)
                break;
            const slotIdx = slots.findIndex((s) => s.durationMinutes >= item.timeboxMinutes);
            if (slotIdx === -1) {
                continue;
            }
            const rawSlot = slots[slotIdx];
            const used = trimSlotToMinutes(rawSlot, item.timeboxMinutes);
            const title = `${config.calendar.eventTitlePrefix}${item.title}`;
            blocks.push({
                workItemId: item.id,
                title,
                startLocal: formatIsoLocal(used.start, timeZone),
                endLocal: formatIsoLocal(used.end, timeZone),
                expectedOutcome: item.expectedOutcome,
                sourceUrl: item.sourceUrl,
                rationale: item.rationale,
            });
            assigned.add(item.id);
            blockCount += 1;
            const remainingStart = used.end;
            const remainingMinutes = Math.floor((rawSlot.end.getTime() - remainingStart.getTime()) / 60_000);
            if (remainingMinutes >= config.slots.minBlockMinutes) {
                slots[slotIdx] = {
                    start: remainingStart,
                    end: rawSlot.end,
                    durationMinutes: remainingMinutes,
                };
            }
            else {
                slots.splice(slotIdx, 1);
            }
        }
        for (const item of sortedItems) {
            if (!assigned.has(item.id) && (!item.targetDate || item.targetDate === date)) {
                unassigned.push(item.id);
            }
        }
        days.push({ date, blocks, unassignedItemIds: [...new Set(unassigned)] });
    }
    return {
        timezone: timeZone,
        generatedAt: runAt.toISOString(),
        runDate,
        days,
    };
}
export function endOfWeekIso(from, timeZone) {
    const probe = parseLocalTimeOnDate(from, "12:00", timeZone);
    const dow = new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
    }).format(probe);
    const toFriday = {
        Mon: 4,
        Tue: 3,
        Wed: 2,
        Thu: 1,
        Fri: 0,
        Sat: -1,
        Sun: -2,
    };
    const add = toFriday[dow] ?? 4;
    const [y, m, d] = from.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + add));
    return dt.toISOString().slice(0, 10);
}
//# sourceMappingURL=planner.js.map