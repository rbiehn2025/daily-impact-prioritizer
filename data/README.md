# Sample inputs for `npm run daily`

Copy or symlink Glean `meeting_lookup` results into `meetings.json`, and your ranked list into `work-items.json`.

**Shapes:**

- [`../schemas/meetings.example.json`](../schemas/meetings.example.json) — calendar busy blocks (`title`, `eventStartTime`, `eventEndTime`, `url`).
- [`../schemas/work-items.example.json`](../schemas/work-items.example.json) — ranked prep work.

**Dry run (from repo root):**

```bash
npm install
npm run daily -- --calendar schemas/meetings.example.json --items schemas/work-items.example.json
```

Real automation runs use `/tmp/meetings.json` and `/tmp/work-items.json` after the agent gathers Glean data (see [`../prompts/daily-automation.md`](../prompts/daily-automation.md)).
