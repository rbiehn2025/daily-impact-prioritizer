# Daily Impact Prioritizer — calendar automation

**Repository:** [github.com/rbiehn2025/daily-impact-prioritizer](https://github.com/rbiehn2025/daily-impact-prioritizer)

Runs your **Daily Impact Prioritizer** workflow each weekday morning: pull calendar and recent work from Glean, rank high-impact actions, map them into open slots for the rest of the week, and deliver **prep blocks** to your calendar.

**Right now:** config uses **`both`** delivery — Glean MCP Calendar Actions create events on Google Calendar, and each run still writes an `.ics` under `output/daily/YYYY-MM-DD/` as backup.

## What runs where

| Piece | Role |
| --- | --- |
| [`prompts/daily-automation.md`](prompts/daily-automation.md) | **Cursor Automation** prompt (Glean + planner + ICS + optional git push). |
| [`automation/SETUP.md`](automation/SETUP.md) | Schedule, MCP, and morning import steps. |
| [`config/default.json`](config/default.json) | Timezone, slots, delivery mode, git commit flag. |
| `npm run daily` | Plan + `google-events.json` + **`prep-blocks.ics`** in one command. |
| [`docs/PUSH_UPDATES.md`](docs/PUSH_UPDATES.md) | How to push code and daily artifacts to GitHub. |

Default: **weekdays only**, working window **09:00–18:00 Eastern**, 14-day activity lookback, up to **5** ranked items and **4** prep blocks per day.

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
4. Enable **Glean** MCP (`meeting_lookup`, `user_activity`, ≤2× `search`, plus `Google_Calendar_Actions_GOOGLECALENDAR_CREATE_` / `_DELETE_` for writes). Do **not** rely on the standalone `Google-calendar` MCP while it is unauthenticated.

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
| Calendar | Glean `meeting_lookup` (`after=today`, `before=this_week`, paginate) | [`schemas/meetings.example.json`](schemas/meetings.example.json) |
| Work items | Agent ranking from activity + search | [`schemas/work-items.example.json`](schemas/work-items.example.json) |

Times use Glean’s format: `YYYY-MM-DD HH:mm:ss +00:00`. All-day working-location events (e.g. `Home`) are skipped when they match `calendar.skipTitlePatterns` in config.

## Morning import (ICS)

Google Calendar → **Settings** → **Import & export** → **Import** → select `output/daily/<today>/prep-blocks.ics`.

See also [`output/daily/README.md`](output/daily/README.md).

## Calendar delivery

In [`config/default.json`](config/default.json):

```json
"delivery": "both",
"googleCalendarWrites": true,
"writeVia": "glean"
```

The automation prompt’s step 8 creates/deletes managed events via **Glean** Calendar Actions; ICS remains the backup. Set `googleCalendarWrites` to `false` for ICS-only.

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
