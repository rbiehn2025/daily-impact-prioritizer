import type { CalendarBusyBlock, IsoDate, PlannerConfig, RankedWorkItem, WeekPlan } from "./types.js";
export declare function planWeek(runAt: Date, busyBlocks: CalendarBusyBlock[], workItems: RankedWorkItem[], config: PlannerConfig, horizonEnd: IsoDate): WeekPlan;
export declare function endOfWeekIso(from: IsoDate, timeZone: string): IsoDate;
