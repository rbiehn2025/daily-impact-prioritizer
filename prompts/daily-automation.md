# Daily Impact Prioritizer — automated calendar run

You are executing the **Daily Impact Prioritizer** routine for Robert Biehn (Solutions Architect, Iterable). This is a **scheduled weekday run**, not a conversational request.

Read `/config/default.json` before starting. Current delivery mode is **`ics_fallback`** with **`googleCalendarWrites`: false** until Google Calendar MCP auth is approved.

## Goals (in order)

1. Rank **meeting-driven** prep from Glean (calendar is primary; plus 14-day activity and ≤2 searches).
2. Map each ranked item into **open slots around that day’s meetings** for **today through Friday** (America/New_York)—not a generic weekly task list.
3. **Always** produce a dated **`.ics` file** under `output/daily/{runDate}/`.
4. **Optionally** sync to Google Calendar only when `googleCalendarWrites` is `true` in config.

Do **not** claim Google events were created unless step 8 succeeds.

## Configuration defaults

- Timezone: `America/New_York`
- Weekdays only; on Sat/Sun exit with one line: skipped (weekend).
- Working window 09:00–18:00; blocks ≥ 25 min; 10 min pre-meeting buffer; max 4 blocks/day.
- Title prefix: `🎯 Prep: ` · managed marker: `daily-impact-prioritizer`

## Workflow

### 1. Context

Local date/time in configured timezone. Stop on weekends if `schedule.weekdaysOnly`.

### 2. Calendar — Glean `meeting_lookup`

- `after=today`, `before=this_week`; paginate while `hasMoreResults`.
- Treat meetings, holds, focus-time, and all-day working location as **busy**.
- Use meetings to drive **prep** rankings (customer/external first).

### 3. Activity — Glean `user_activity`

- Last **14 days** (`ranking.activityLookbackDays`): customer work, deliverables, blockers, open loops.

### 4. Search — Glean `search` (max 2)

- Close gaps on active accounts, deadlines, or unresolved threads.

### 5. Rank work

3–5 items (up to `ranking.maxWorkItems`), scored on urgency, impact, time-to-value, confidence. Include `targetDate` when tied to a same-day meeting. Same guardrails as the Glean Daily Impact Prioritizer skill (no invented deadlines, etc.).

### 6. Build artifacts (required)

1. Save full meeting list to `/tmp/meetings.json`.
2. Save ranked items to `/tmp/work-items.json` (see `schemas/work-items.example.json`).
3. Run:

```bash
cd /workspace && npm install && npm run daily -- --calendar /tmp/meetings.json --items /tmp/work-items.json
```

4. Parse the JSON printed to stdout. Artifact paths:

- `output/daily/{runDate}/prep-blocks.ics` ← **Robert imports this**
- `output/daily/{runDate}/plan.json`
- `output/daily/{runDate}/google-events.json`
- `output/daily/{runDate}/RUN.md`

### 7. Publish ICS for pickup (required when `commitArtifactsToGit` is true)

```bash
cd /workspace && git add "output/daily/${RUN_DATE}/" && git commit -m "Daily prep blocks ${RUN_DATE}" && git push -u origin main
```

Replace `RUN_DATE` with the run date from the CLI JSON (e.g. `2026-09-16`). If there are zero blocks, still commit `RUN.md` explaining why.

### 8. Google Calendar (only if `googleCalendarWrites` is true)

Skip this section entirely while auth is pending.

When enabled:

1. Delete stale managed events (title prefix `🎯 Prep: ` or description contains `daily-impact-prioritizer`) from today–Friday with `dip_run_date` ≠ today via `Google_Calendar_Actions_GOOGLECALENDAR_DELETE_`.
2. Create events from `google-events.json` via `Google_Calendar_Actions_GOOGLECALENDAR_CREATE_` (`visibility`: private, `send_updates`: none).

If create fails with auth errors, **ICS from step 6 is still the success path** — say so clearly.

### 9. Run summary (required chat output)

- Run date, block count, path to **`output/daily/{runDate}/prep-blocks.ics`**
- Table: local start, title, expected outcome, source URL
- Unassigned items and why
- Google sync: skipped / attempted / N created
- One-line import reminder: Google Calendar → Import & export → Import

## After Google auth is approved

In `config/default.json` set:

```json
"delivery": "both",
"googleCalendarWrites": true
```

Then step 8 runs automatically; ICS remains as backup.
