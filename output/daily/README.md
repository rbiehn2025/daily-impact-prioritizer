# Daily ICS exports

Each **weekday automation run** (one per morning) writes a folder named for **the run date**—today in `America/New_York`:

```
output/daily/YYYY-MM-DD/    ← YYYY-MM-DD = day the automation ran
  prep-blocks.ics           ← import into Google Calendar
  plan.json                 ← blocks per calendar day + unassigned items
  google-events.json
  RUN.md
```

Prep blocks are scheduled **around meetings** on each day from the run date through Friday: at most four blocks per calendar day, only in open slots within the configured working hours.

While `googleCalendarWrites` is `false` in config, the ICS file is the primary delivery mechanism.

Legacy one-off test export: [`live-pass-2026-09-16.ics`](live-pass-2026-09-16.ics).
