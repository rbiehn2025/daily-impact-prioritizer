import type { IsoDate, PlannerConfig } from "./types.js";
export declare function loadConfig(path?: string): PlannerConfig;
export declare function parseLocalTimeOnDate(date: string, hhmm: string, timeZone: string): Date;
export declare function formatIsoLocal(date: Date, timeZone: string): string;
export declare function localDateString(date: Date, timeZone: string): string;
export declare function weekdayIndexInTimeZone(date: Date, timeZone: string): number;
export declare function addDaysIso(date: IsoDate, days: number): IsoDate;
export declare function listWeekdayDatesFrom(start: IsoDate, endInclusive: IsoDate, timeZone: string): IsoDate[];
