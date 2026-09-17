# Sync cloud project → GitHub

Most users now connect **GitHub** directly in Cursor Automations and push from the cloud agent. Use **[`PUSH_UPDATES.md`](PUSH_UPDATES.md)** for that path.

This doc is only for **legacy** workflows where code still lives on a Cursor Origin `tmp-*` draft.

## Option A — Fetch from Cursor Origin

Cloud code may live on:

`https://origin.cursor.com/git/iterable/tmp-91a8fcb443a6e6fb.git`

On your Mac, in `~/daily-impact-prioritizer`:

```bash
git remote add cursor https://origin.cursor.com/git/iterable/tmp-91a8fcb443a6e6fb.git
git fetch cursor main
git merge cursor/main --allow-unrelated-histories -m "Import daily impact prioritizer from cloud agent"
git push -u origin main
```

`origin` should be `https://github.com/rbiehn2025/daily-impact-prioritizer.git`.

## Option B — Git bundle

1. Download **`output/daily-impact-prioritizer.bundle`** from a cloud run (if generated).
2. On your Mac:

```bash
cd ~/daily-impact-prioritizer
git pull /path/to/downloads/daily-impact-prioritizer.bundle main
git push -u origin main
```

## Option C — Helper script

```bash
./scripts/sync-from-cloud-to-github.sh
```

## After GitHub has `main`

- Repo: `rbiehn2025/daily-impact-prioritizer`, branch `main`
- Automation setup: [`../automation/SETUP.md`](../automation/SETUP.md)
