import { describe, expect, it } from "vitest";
import { loadConfig, parseLocalTimeOnDate } from "../src/config.js";
import { findFreeSlotsForDay } from "../src/slots.js";
import type { CalendarBusyBlock } from "../src/types.js";

describe("findFreeSlotsForDay", () => {
  const config = loadConfig();

  it("finds gaps with meeting buffer", () => {
    const date = "2026-09-16";
    const busy: CalendarBusyBlock[] = [
      {
        title: "Meeting",
        start: parseLocalTimeOnDate(date, "12:00", config.timezone),
        end: parseLocalTimeOnDate(date, "13:00", config.timezone),
      },
    ];
    const slots = findFreeSlotsForDay(date, busy, config);
    expect(slots.length).toBeGreaterThan(0);
    const morning = slots.find(
      (s) => s.start.getHours() === 9 || s.durationMinutes >= 25,
    );
    expect(morning).toBeDefined();
    const beforeMeeting = slots.find(
      (s) => s.end <= parseLocalTimeOnDate(date, "11:50", config.timezone),
    );
    expect(beforeMeeting?.durationMinutes).toBeGreaterThanOrEqual(25);
  });
});
