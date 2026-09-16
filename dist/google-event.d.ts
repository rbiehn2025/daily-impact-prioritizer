import type { GoogleEventDraft, PlannedFocusBlock, PlannerConfig } from "./types.js";
export declare function buildGoogleEventDraft(block: PlannedFocusBlock, config: PlannerConfig, runDate: string): GoogleEventDraft;
export declare function isManagedPrioritizerEvent(title: string, description: string | undefined, config: PlannerConfig): boolean;
export declare function flattenBlocks(plan: import("./types.js").WeekPlan): PlannedFocusBlock[];
