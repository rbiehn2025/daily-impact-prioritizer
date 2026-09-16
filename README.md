# Daily Impact Prioritizer — calendar automation

**Repository:** [github.com/rbiehn2025/daily-impact-prioritizer](https://github.com/rbiehn2025/daily-impact-prioritizer)

Runs your **Daily Impact Prioritizer** workflow each weekday morning: pull calendar and recent work from Glean, rank high-impact actions, map them into open slots for the rest of the week, and deliver **prep blocks** to your calendar.

**Right now:** config uses **`ics_fallback`** (daily `.ics` under `output/daily/YYYY-MM-DD/`) while Google Calendar MCP write auth is pending. After approval, flip `googleCalendarWrites` to `true` in config for direct event creation (ICS stays as backup).

## What runs where

| Piece | Role |
| --- | --- |
| [`prompts/daily-automation.md`](prompts/daily-automation.md) | **Cursor Automation** prompt (Glean + planner + ICS + optional git push). |
| [`automation/SETUP.md`](automation/SETUP.md) | Schedule, MCP, and morning import steps. |
| [`config/default.json`](config/default.json) | Timezone, slots, delivery mode, git commit flag. |
| `npm run daily` | Plan + `google-events.json` + **`prep-blocks.ics`** in one command. |

Default: **weekdays 9:00 AM Eastern**, 14-day activity lookback.

## Set up the daily automation (Cursor)

**GitHub repo:** `rbiehn2025/daily-impact-prioritizer` · branch `main`

Connect **Dashboard → Integrations → GitHub**, then **Automations → New automation** → **Single repository** → `rbiehn2025/daily-impact-prioritizer` → `main`.

**If Automations will not let you attach a repo**, see [`automation/SETUP.md`](automation/SETUP.md). Summary:

1. **Automations → New automation** on this repo, branch `main`.
2. **Schedule:** `0 9 * * 1-5`, timezone `America/New_York`.
3. **Prompt:** [`prompts/daily-automation.md`](prompts/daily-automation.md).
4. Enable **Glean** MCP (Google Calendar optional until auth).

Each run commits `output/daily/{date}/` when `commitArtifactsToGit` is true so you can **pull the ICS** or grab it from the agent run.

## Manual dry run

```bash
npm install
npm run daily -- --calendar data/meetings.json --items data/work-items.json
# → output/daily/<runDate>/prep-blocks.ics
```

Or step-by-step: `plan` → `format-events` → `export-ics` (see scripts in `package.json`).

### `work-items.json` shape

See [`schemas/work-items.example.json`](schemas/work-items.example.json).

### `meetings.json`

Glean `meeting_lookup` documents (`title`, `eventStartTime`, `eventEndTime`, `url`).

## Enable Google Calendar writes later

In [`config/default.json`](config/default.json):

```json
"delivery": "both",
"googleCalendarWrites": true
```

## Customize

- `workingHours`, `minBlockMinutes`, `meetingBufferMinutes`, `maxBlocksPerDay`
- `eventTitlePrefix`, `managedMarker`
- `commitArtifactsToGit`: set `false` if you do not want auto-commit/push from the agent

## Tests

```bash
npm test
```
