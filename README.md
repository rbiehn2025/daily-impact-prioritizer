# Daily Impact Prioritizer — calendar automation

**Repository:** [github.com/rbiehn2025/daily-impact-prioritizer](https://github.com/rbiehn2025/daily-impact-prioritizer)

Runs **once each weekday morning**: read **your real calendar** (today through Friday), decide what prep matters for **those scheduled meetings**, and place **prep blocks only in open time** around those meetings—not a generic weekly to-do list.

Each run writes one folder, `output/daily/{runDate}/`, where `{runDate}` is **today** in `America/New_York`. Import that day’s `prep-blocks.ics` into Google Calendar.

**Right now:** config uses **`ics_fallback`** (the `.ics` file is the delivery path) while Google Calendar MCP write auth is pending. After approval, flip `googleCalendarWrites` to `true` in config for direct event creation (ICS stays as backup).

### How a weekday run works

1. **Calendar (primary signal)** — Glean `meeting_lookup` from **today** through **end of this week**. Meetings, holds, and focus time are **busy**; customer and external meetings drive what gets ranked first.
2. **Rank prep (3–5 items)** — Up to `ranking.maxWorkItems` (default **5**) prep tasks for **this run only**, using calendar + **14-day** Glean activity + at most **2** searches. Set `targetDate` on an item when prep is for a meeting on a specific day (usually **today**).
3. **Schedule around meetings** — For **each calendar day** from today through Friday, the planner finds gaps in **09:00–18:00** Eastern (≥25 minutes, 10-minute buffer before meetings) and places at most **`maxBlocksPerDay` (4) prep blocks on that day**. If the day is full of meetings, fewer or no blocks land that day; leftover ranked items show as unassigned in `plan.json`.
4. **Deliver** — `prep-blocks.ics` plus `plan.json`, `RUN.md`, and `google-events.json` under `output/daily/{runDate}/`.

**Defaults (see [`config/default.json`](config/default.json)):** weekdays only (skip Sat/Sun); Eastern timezone; working window **09:00–18:00**; **14-day** activity lookback for ranking; **≤5** ranked prep items per run; **≤4** prep blocks **per calendar day** (only where free time exists).

## What runs where

| Piece | Role |
| --- | --- |
| [`prompts/daily-automation.md`](prompts/daily-automation.md) | **Cursor Automation** prompt (Glean + planner + ICS + optional git push). |
| [`automation/SETUP.md`](automation/SETUP.md) | Schedule, MCP, and morning import steps. |
| [`config/default.json`](config/default.json) | Timezone, slots, delivery mode, git commit flag. |
| `npm run daily` | Plan + `google-events.json` + **`prep-blocks.ics`** in one command. |
| [`docs/PUSH_UPDATES.md`](docs/PUSH_UPDATES.md) | How to push code and daily artifacts to GitHub. |

## Repository layout

```
config/default.json          # planner + calendar delivery settings
prompts/daily-automation.md  # scheduled agent workflow
schemas/*.example.json       # JSON shapes for CLI inputs
data/README.md               # how to run a local dry run
src/                         # TypeScript planner + ICS export
dist/                        # compiled JS (run `npm run build` after src edits)
output/daily/YYYY-MM-DD/     # committed daily artifacts (ICS, plan, RUN.md)
```

## Set up the daily automation (Cursor)

**GitHub repo:** `rbiehn2025/daily-impact-prioritizer` · branch `main`

Connect **Dashboard → Integrations → GitHub**, then **Automations → New automation** → **Single repository** → `rbiehn2025/daily-impact-prioritizer` → `main`.

**If Automations will not let you attach a repo**, see [`automation/SETUP.md`](automation/SETUP.md).

1. **Automations → New automation** on this repo, branch `main`.
2. **Schedule:** weekday mornings in `America/New_York` (e.g. cron `0 10 * * 1-5` for 10:00 AM local, or match `schedule.defaultRunHourLocal` in config).
3. **Prompt:** paste or point at [`prompts/daily-automation.md`](prompts/daily-automation.md).
4. Enable **Glean** MCP (`meeting_lookup`, `user_activity`, ≤2× `search`). Google Calendar optional until write auth.

Each run commits `output/daily/{date}/` when `commitArtifactsToGit` is `true` so you can **pull the ICS** or grab it from the agent run.

## Manual dry run

```bash
npm install
npm run check    # optional: build dist + run tests
npm run daily -- --calendar schemas/meetings.example.json --items schemas/work-items.example.json
# → output/daily/<runDate>/prep-blocks.ics
```

Or step-by-step: `plan` → `format-events` → `export-ics` (see `package.json` scripts).

### Input JSON

| File | Source | Schema |
| --- | --- | --- |
| Calendar | Glean `meeting_lookup` (`after=today`, `before=this_week`, paginate) — **defines busy time and which meetings need prep** | [`schemas/meetings.example.json`](schemas/meetings.example.json) |
| Work items | Agent-ranked prep for **this run**, tied to meetings when possible (`targetDate`) | [`schemas/work-items.example.json`](schemas/work-items.example.json) |

Times use Glean’s format: `YYYY-MM-DD HH:mm:ss +00:00`. All-day working-location events (e.g. `Home`) are skipped when they match `calendar.skipTitlePatterns` in config. The planner never invents meetings—it only schedules prep in **free slots** on days that appear in your meeting file.

## Morning import (ICS)

Google Calendar → **Settings** → **Import & export** → **Import** → select `output/daily/<today>/prep-blocks.ics`.

See also [`output/daily/README.md`](output/daily/README.md).

## Enable Google Calendar writes later

In [`config/default.json`](config/default.json):

```json
"delivery": "both",
"googleCalendarWrites": true
```

The automation prompt’s step 8 will create/delete managed events; ICS remains the backup.

## Customize

- `workingHours`, `minBlockMinutes`, `meetingBufferMinutes`, `maxBlocksPerDay`
- `eventTitlePrefix`, `managedMarker`, `skipTitlePatterns`
- `commitArtifactsToGit`: set `false` if you do not want auto-commit/push of daily folders

## Push updates to GitHub

See **[`docs/PUSH_UPDATES.md`](docs/PUSH_UPDATES.md)**. Quick check before pushing code:

```bash
npm run check
```

## Tests

```bash
npm test
```
