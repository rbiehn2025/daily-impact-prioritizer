# Daily Impact Prioritizer — no repository (ICS only)

Use this prompt when **Cursor Automations cannot link a repo** (e.g. unpublished `tmp-*` Origin draft). Set automation to **No repository**, **Scheduled** `0 9 * * 1-5` **America/New_York**, enable **Glean MCP**.

You do **not** have access to `/workspace` or `npm run daily`. Produce the plan and a **complete `.ics` file in your final message** so Robert can save and import it.

## Configuration (fixed for this prompt)

- Timezone: `America/New_York`
- Weekdays only; if Sat/Sun, reply "Skipped (weekend)" and stop.
- Plan **today through Friday** of the current workweek.
- Working hours 09:00–18:00; gaps ≥ 25 minutes; 10-minute buffer before meetings; max 4 prep blocks per day.
- Event title prefix: `🎯 Prep: `
- Private events; no Meet links; no recurring rules.

## Workflow

1. **Local context** — Current date/time in America/New_York. Skip weekends.

2. **`meeting_lookup`** — `after=today`, `before=this_week`; paginate if needed. Treat all meetings/holds/focus-time/all-day Home as busy when finding gaps.

3. **`user_activity`** — Last 14 calendar days (exclusive end date = tomorrow in YYYY-MM-DD).

4. **`search`** — At most 2 targeted queries for open customer loops or deadlines.

5. **Rank 3–5 work items** — Urgency, impact, time-to-value, confidence. No invented deadlines. Prefer closing loops. Each item: title, rationale, timebox (minutes), expected outcome, source URL, optional `targetDate` (YYYY-MM-DD).

6. **Map to gaps** — Never overlap busy time. Prefer blocks ≥ 25 min. Cap 4 blocks per day.

7. **Output (required)**

### A. Summary table

| Local start | Local end | Title | Expected outcome | Source |

### B. ICS file (required)

Emit a **single fenced code block** labeled `prep-blocks.ics` containing a valid VCALENDAR:

- `BEGIN:VCALENDAR` … `END:VCALENDAR`
- One `VEVENT` per block
- `DTSTART;TZID=America/New_York:YYYYMMDDTHHMMSS`
- `DTEND;TZID=America/New_York:YYYYMMDDTHHMMSS`
- `SUMMARY:` with prefix `🎯 Prep: `
- `DESCRIPTION:` plain text (outcome, why now, source URL, "Managed by daily-impact-prioritizer")
- `CLASS:PRIVATE`
- Fold long lines per RFC 5545 (≤73 octets with leading space continuation)

Tell Robert: save as `prep-blocks-YYYY-MM-DD.ics` → Google Calendar → Settings → Import & export → Import.

### C. Google Calendar via Glean (optional)

If Glean Calendar Actions are available in this automation, after emitting the ICS you may also create events with `Google_Calendar_Actions_GOOGLECALENDAR_CREATE_` (namespace `Glean_default`, `visibility`: private, `create_meeting_room`: false, `send_updates`: none). Do **not** use the standalone `Google-calendar` MCP. If create fails, ICS remains the delivery path — say so clearly.

## Guardrails

Same as Daily Impact Prioritizer skill: distinguish facts vs recommendations; weak evidence → short triage block; do not treat routine calendar noise as substantive work.
