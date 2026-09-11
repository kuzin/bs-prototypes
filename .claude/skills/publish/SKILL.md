---
name: publish
description: Ship the current session's work — run the checks, commit everything, push to GitHub, merge to main so GitHub Pages redeploys, and print a bulleted "What has changed in this session" list to paste elsewhere. Use when the user says /publish, "publish this", "ship it", or "deploy".
---

# Publish

Takes whatever is in the working tree and gets it live, then hands back a summary the
user can paste into Slack, a ticket, or a design review.

Deployment here is just `main`: `.github/workflows/deploy.yml` builds and pushes to
GitHub Pages on every push to `main`. So "deploy" means "land it on main" — there is no
separate deploy command to run, and nothing to run locally.

Live site: **https://kuzin.github.io/bs-prototypes/**

## 1. Check before you commit

CI (`verify`) runs lint → format:check → check → build, and a failure there is a failed
deploy. Run the same thing locally first:

```bash
pnpm lint && pnpm format:check && pnpm check && pnpm build
```

- `pnpm format` fixes formatting; `pnpm lint:fix` fixes what it can. ESLint **warnings**
  are fine (the config is tuned for a sandbox) — **errors** are not.
- `pnpm check` fails on registry drift: a prototype folder, a `components/prototypes.js`
  entry and a landing-card icon in `landing/App.jsx` that don't agree.
- If something fails, fix it and re-run. Don't push a red tree.

## 2. Commit

Never commit straight to `main`. If `git branch --show-current` says `main`, cut a
branch first: `git checkout -b claude/<short-name>`.

```bash
git add -A
git commit
```

One commit for the session unless the work splits cleanly into separate ideas. Write the
subject the way the repo does — sentence case, what changed and for whom, no `feat:`
prefixes (`git log --oneline -10` for the house style). End the message with the
attribution lines this session was given.

## 3. Push and open the PR

```bash
git push -u origin HEAD
gh pr create --fill
```

If the branch already has a PR, `git push` is enough — say which PR it updated.

## 4. Deploy

Wait for `verify` to go green, then merge — that push to `main` is the deploy:

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
```

- CI red: report what failed and stop. Don't merge around it.
- Merge conflict: rebase on `main`, re-run the checks, push again.
- After merging, the Pages build takes a minute or two. `gh run list --workflow=deploy.yml --limit 1`
  shows it; don't sit and poll it unless the user asks.

## 5. Print the summary

Last thing, always. A plain markdown bullet list under a `What has changed in this session`
heading, ready to paste somewhere with no editing:

- One bullet per user-visible change, in the words a teammate would use — what moved,
  what's new, what's gone. Not file names, not commit SHAs, not "refactored X".
- Group by prototype when the session touched several (`**Student profile**` as a bold
  lead-in, its bullets under it).
- Call out anything deliberately left out or still open in a final bullet.
- End with the PR link and the live URL, including the deep link to the prototype that
  changed where there is an obvious one (e.g. `…/bs-prototypes/student-profile/`).

Keep it to what actually shipped in _this_ session — not everything the branch has ever
carried.
