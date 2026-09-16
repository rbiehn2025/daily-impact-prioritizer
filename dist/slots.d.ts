import type { CalendarBusyBlock, PlannerConfig } from "./types.js";
export interface FreeSlot {
    start: Date;
    end: Date;
    durationMinutes: number;
}
export declare function findFreeSlotsForDay(date: string, busy: CalendarBusyBlock[], config: PlannerConfig): FreeSlot[];
export declare function trimSlotToMinutes(slot: FreeSlot, minutes: number): FreeSlot;
