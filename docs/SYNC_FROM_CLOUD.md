# Sync cloud project → `~/daily-impact-prioritizer` → GitHub

The cloud agent cannot push to GitHub directly (no credentials in the VM). Use one of these from **your Mac** in the empty clone.

## Option A — Fetch from Cursor Origin (recommended)

Your cloud code lives on:

`https://origin.cursor.com/git/iterable/tmp-91a8fcb443a6e6fb.git`

```bash
cd ~/daily-impact-prioritizer

git remote add cursor https://origin.cursor.com/git/iterable/tmp-91a8fcb443a6e6fb.git
git fetch cursor main
git merge cursor/main --allow-unrelated-histories -m "Import daily impact prioritizer from cloud agent"
git push -u origin main
```

If `git fetch cursor` asks for auth, sign in via Cursor/browser when prompted, or use **Option B**.

`origin` should already be `https://github.com/rbiehn2025/daily-impact-prioritizer.git` from your empty clone.

## Option B — Git bundle (no Origin network auth)

1. In this cloud agent run, download **`output/daily-impact-prioritizer.bundle`** from the file tree (generated on each release push to Origin).
2. On your Mac:

```bash
cd ~/daily-impact-prioritizer
git pull /path/to/downloads/daily-impact-prioritizer.bundle main
git push -u origin main
```

## Option C — Helper script (after Option A fetch works once)

From a clone that already has the project files:

```bash
./scripts/publish-to-github.sh
```

## Cursor automation (after GitHub has `main`)

- Repo: `rbiehn2025/daily-impact-prioritizer`, branch `main`
- See `automation/SETUP.md`
