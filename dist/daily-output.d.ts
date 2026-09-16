import type { WeekPlan } from "./types.js";
export declare function dailyOutputDir(runDate: string, baseDir?: string): string;
export declare function dailyArtifactPaths(runDate: string, baseDir?: string): {
    dir: string;
    plan: string;
    googleEvents: string;
    ics: string;
    runNotes: string;
};
export declare function ensureDir(filePath: string): void;
export declare function writeRunNotes(path: string, plan: WeekPlan, options: {
    delivery: string;
    googleAttempted: boolean;
    googleCreated: number;
    icsPath: string;
}): void;
