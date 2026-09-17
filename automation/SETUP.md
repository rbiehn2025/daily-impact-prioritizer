# Cursor daily automation setup

**GitHub:** [rbiehn2025/daily-impact-prioritizer](https://github.com/rbiehn2025/daily-impact-prioritizer) (private) · use branch **`main`**.

Connect GitHub in **Cursor Dashboard → Integrations** before creating the automation.

## Why “add repo” fails (tmp-* Origin projects only)

If you were still on an Origin draft URL like `tmp-91a8fcb443a6e6fb`, that repo is **not** selectable in Automations. Use the **GitHub repo above** instead.

---

## Path A — GitHub automation (recommended)

1. **Dashboard → Integrations → GitHub** — grant access to `rbiehn2025/daily-impact-prioritizer`.
2. **Automations → New automation**.
3. **Repository:** `rbiehn2025/daily-impact-prioritizer`, branch **`main`**.
4. **Schedule:** weekday mornings, timezone **America/New_York** (e.g. `0 10 * * 1-5` for 10:00 AM; align with `schedule.defaultRunHourLocal` in [`config/default.json`](../config/default.json)).
5. **Prompt:** [`../prompts/daily-automation.md`](../prompts/daily-automation.md).
6. **MCP:** **Glean** (enable Google Calendar when write auth is approved).

While `googleCalendarWrites` is `false` in config, each run writes **`output/daily/YYYY-MM-DD/prep-blocks.ics`** and can commit/push to `main` when `commitArtifactsToGit` is true.

---

## Path B — No repository (ICS in run transcript)

Use [`../prompts/daily-automation-no-repo.md`](../prompts/daily-automation-no-repo.md) with **No repository** + Glean MCP if you cannot link GitHub yet.

---

## Path C — Publish Origin draft (legacy)

Only if you still work from a Cursor `tmp-*` draft: **Create repo** on the agent run, then mirror to GitHub or use Origin in automations.

---

## Push code to GitHub (one-time)

From a machine with GitHub auth (or this cloud agent after GitHub is connected to the environment):

```bash
git remote add github https://github.com/rbiehn2025/daily-impact-prioritizer.git
git push -u github main
```

If the GitHub repo was initialized with a README, run `git pull github main --rebase` first, then push.

---

## After Google Calendar MCP auth

In [`../config/default.json`](../config/default.json):

```json
"delivery": "both",
"googleCalendarWrites": true
```

## Manual test (with repo)

```bash
npm install
npm run check   # optional
npm run daily -- --calendar schemas/meetings.example.json --items schemas/work-items.example.json
```

Production automation uses `/tmp/meetings.json` and `/tmp/work-items.json` after Glean (see prompt).

## Push code or doc changes

See [`../docs/PUSH_UPDATES.md`](../docs/PUSH_UPDATES.md).
