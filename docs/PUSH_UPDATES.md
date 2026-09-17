# Push updates to GitHub

**Repo:** [github.com/rbiehn2025/daily-impact-prioritizer](https://github.com/rbiehn2025/daily-impact-prioritizer)

## From Cursor Cloud Agent (GitHub integrated)

When the environment is linked to GitHub, the agent can push directly:

1. Work on a branch (e.g. `cursor/daily-impact-prioritizer-c7db`) or `main`.
2. After code changes: `npm run check` (build + tests).
3. Commit and push:

```bash
git add -A
git commit -m "Describe your change"
git push -u origin <branch>
```

Daily automation commits **only** `output/daily/YYYY-MM-DD/` to `main` when `commitArtifactsToGit` is `true` in [`config/default.json`](../config/default.json).

## From your laptop

```bash
git clone https://github.com/rbiehn2025/daily-impact-prioritizer.git
cd daily-impact-prioritizer
npm install
npm run check
# edit, commit, push
git push -u origin main
```

Or use [`scripts/publish-to-github.sh`](../scripts/publish-to-github.sh) if `github` is a second remote.

## After editing TypeScript (`src/`)

Compiled output in `dist/` is checked in for environments without `tsx`. Regenerate before pushing code changes:

```bash
npm run build
git add dist/
```

## Legacy: sync from Cursor Origin `tmp-*` draft

If you still have code only on an Origin draft URL, see [`SYNC_FROM_CLOUD.md`](SYNC_FROM_CLOUD.md).
