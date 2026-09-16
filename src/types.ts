export type IsoDate = `${number}-${number}-${number}`;

export interface PlannerConfig {
  timezone: string;
  schedule?: {
    weekdaysOnly: boolean;
    defaultRunHourLocal: number;
    planHorizon: string;
  };
  workingHours: { start: string; end: string };
  slots: {
    minBlockMinutes: number;
    meetingBufferMinutes: number;
    maxBlocksPerDay: number;
  };
  calendar: {
    calendarId?: string;
    eventTitlePrefix: string;
    visibility: "default" | "public" | "private" | "confidential";
    createMeetingRoom?: boolean;
    managedMarker: string;
    skipTitlePatterns: string[];
    /** ics_fallback: always write ICS; try Google only if googleCalendarWrites is true */
    delivery?: "ics_fallback" | "google_calendar" | "both";
    googleCalendarWrites?: boolean;
    dailyOutputBaseDir?: string;
    commitArtifactsToGit?: boolean;
  };
  ranking?: {
    maxWorkItems: number;
    activityLookbackDays: number;
    maxGleanSearches: number;
  };
}

export interface CalendarBusyBlock {
  title: string;
  start: Date;
  end: Date;
  sourceUrl?: string;
  allDay?: boolean;
}

export interface RankedWorkItem {
  id: string;
  title: string;
  rationale: string;
  timeboxMinutes: number;
  expectedOutcome: string;
  sourceTitle: string;
  sourceUrl: string;
  urgencyScore: number;
  impactScore: number;
  /** Optional ISO date (local) when this item should be done; defaults to earliest feasible day */
  targetDate?: IsoDate;
  /** If set, block should end at least this many minutes before a named meeting */
  beforeMeetingTitle?: string;
}

export interface PlannedFocusBlock {
  workItemId: string;
  title: string;
  startLocal: string;
  endLocal: string;
  expectedOutcome: string;
  sourceUrl: string;
  rationale: string;
}

export interface DayPlan {
  date: IsoDate;
  blocks: PlannedFocusBlock[];
  unassignedItemIds: string[];
}

export interface WeekPlan {
  timezone: string;
  generatedAt: string;
  runDate: IsoDate;
  days: DayPlan[];
}

export interface GoogleEventDraft {
  summary: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  visibility: string;
  create_meeting_room: boolean;
  extended_properties: string;
}
