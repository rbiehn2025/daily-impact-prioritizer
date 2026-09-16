# Daily ICS exports

Each **weekday automation run** writes a dated folder:

```
output/daily/YYYY-MM-DD/
  prep-blocks.ics    ← import into Google Calendar
  plan.json
  google-events.json
  RUN.md             ← human-readable summary
```

While `googleCalendarWrites` is `false` in config, the ICS file is the primary delivery mechanism.

Old one-off test export: [`live-pass-2026-09-16.ics`](live-pass-2026-09-16.ics).
