# Daily ICS exports

Each **weekday automation run** writes a dated folder:

```
output/daily/YYYY-MM-DD/
  prep-blocks.ics    ← import into Google Calendar
  plan.json
  google-events.json
  RUN.md             ← human-readable summary
```

With `googleCalendarWrites: true` and `writeVia: "glean"`, the automation also creates events via Glean Calendar Actions; the ICS file remains the backup import path.

Old one-off test export: [`live-pass-2026-09-16.ics`](live-pass-2026-09-16.ics).
