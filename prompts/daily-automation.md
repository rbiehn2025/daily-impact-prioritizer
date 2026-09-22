# Daily Impact Prioritizer — automated calendar run

You are executing the **Daily Impact Prioritizer** routine for Robert Biehn (Solutions Architect, Iterable). This is a **scheduled weekday run**, not a conversational request.

Read `/config/default.json` before starting. Current delivery mode is **`both`** with **`googleCalendarWrites`: true** and **`writeVia`: `glean`**.

## Goals (in order)

1. Rank high-impact prep work from Glean (calendar + 14-day activity + ≤2 searches).
2. Map work into open slots for **today through Friday** (America/New_York).
3. **Always** produce a dated **`.ics` file** under `output/daily/{runDate}/` (backup / manual import).
4. **Sync prep blocks to Google Calendar** via **Glean** MCP Calendar Actions (see step 8).

Do **not** claim Google events were created unless step 8 create calls succeed.

## Configuration defaults

- Timezone: `America/New_York`
- Weekdays only; on Sat/Sun exit with one line: skipped (weekend).
- Working window 09:00–18:00; blocks ≥ 25 min; 10 min pre-meeting buffer; max 4 blocks/day.
- Title prefix: `🎯 Prep: ` · managed marker: `daily-impact-prioritizer`
- Calendar writes: **Glean** tools under namespace `Glean_default` — **not** the standalone `Google-calendar` MCP (that namespace may still show `needsAuth`).

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

- `output/daily/{runDate}/prep-blocks.ics` ← backup import
- `output/daily/{runDate}/plan.json`
- `output/daily/{runDate}/google-events.json` ← payload for step 8
- `output/daily/{runDate}/RUN.md`

### 7. Publish ICS for pickup (required when `commitArtifactsToGit` is true)

```bash
cd /workspace && git add "output/daily/${RUN_DATE}/" && git commit -m "Daily prep blocks ${RUN_DATE}" && git push -u origin main
```

Replace `RUN_DATE` with the run date from the CLI JSON (e.g. `2026-09-16`). If there are zero blocks, still commit `RUN.md` explaining why.

### 8. Google Calendar via Glean (when `googleCalendarWrites` is true and `writeVia` is `glean`)

**Use only these tools from namespace `Glean_default`:**

| Action | Tool |
| --- | --- |
| Create | `Google_Calendar_Actions_GOOGLECALENDAR_CREATE_` |
| Delete | `Google_Calendar_Actions_GOOGLECALENDAR_DELETE_` |
| Optional patch | `Google_Calendar_Actions_GOOGLECALENDAR_PATCH_E` |

**Do not** call tools from the standalone `Google-calendar` MCP namespace while it is unauthenticated.

When enabled:

1. **Find stale managed prep events** for today–Friday: titles starting with `🎯 Prep: ` and/or description containing `daily-impact-prioritizer`, where private `dip_run_date` ≠ today's run date (or missing). Use `meeting_lookup` (`query` like `Prep:`, `after=today`, `before=this_week`) to locate them; then delete each with `Google_Calendar_Actions_GOOGLECALENDAR_DELETE_` (`calendar_id`: `primary`, `send_updates`: `none`).
2. **Create** each object in `google-events.json` with `Google_Calendar_Actions_GOOGLECALENDAR_CREATE_`:
   - Pass `summary`, `description`, `start_datetime`, `end_datetime`, `timezone`, `visibility` (`private`), `create_meeting_room` (`false`), `extended_properties` (string from the JSON).
   - Set `calendar_id` to `primary`, `send_updates` to `none`, `exclude_organizer` to `true` if the tool would otherwise invite you as an attendee you do not need.
   - Required `_user_goal`: copy a short goal such as `Create daily impact prioritizer prep blocks for {runDate}`.
3. **Verify** with `meeting_lookup` (`query`: `Prep:`, `after=today`, `before=this_week`) that the new titles appear.

If create fails (auth, permissions, or API errors), **ICS from step 6 is still the success path** — say so clearly and do not claim calendar sync succeeded.

### 9. Run summary (required chat output)

- Run date, block count, path to **`output/daily/{runDate}/prep-blocks.ics`**
- Table: local start, title, expected outcome, source URL
- Unassigned items and why
- Google sync via Glean: N created / deleted / failed (cite tool results)
- If sync failed: one-line import reminder — Google Calendar → Import & export → Import

## If Glean Calendar Actions become unavailable

Temporarily set in `config/default.json`:

```json
"delivery": "ics_fallback",
"googleCalendarWrites": false
```

ICS-only mode remains supported. Standalone `Google-calendar` MCP is an alternate write path only after that namespace is authenticated (`writeVia`: `google_calendar_mcp`).
