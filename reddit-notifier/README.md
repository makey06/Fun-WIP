# Reddit Keyword Notifier

Checks r/Redrising every 6 hours for new posts containing "red god" or
"release date" (case-insensitive) and opens a **GitHub Issue** (assigned to
you) when it finds a match.

## ⚠️ Current status: not yet functional — Reddit OAuth app required

Reddit blocks unauthenticated requests to its public `.json` endpoints from
cloud/datacenter IPs (including GitHub Actions runners), regardless of
User-Agent. The script now uses Reddit's official OAuth API instead, which
requires a free Reddit "app" registration to get a Client ID and Client
Secret.

**The scheduled GitHub Action is currently disabled** to avoid repeated
failures and noisy error issues until this is set up. Once the secrets below
are added, re-enable the workflow from the repo's Actions tab (or ping
Claude to re-enable + test it).

### How to create the Reddit app (one-time, ~2 minutes)

1. Log in to Reddit, then go to https://www.reddit.com/prefs/apps
2. Scroll to the bottom and click **"create app"** (or "create another app").
3. Fill in the form:
   - **name**: anything, e.g. `redrising-notifier`
   - **type**: select **script**
   - **description**: optional
   - **about url**: leave blank
   - **redirect uri**: required field but unused for this flow — enter
     `http://localhost:8080`
4. Click **create app**.
5. You'll see a box for your new app with two values you need:
   - **Client ID**: the string directly under the app name/"personal use
     script" (a short string, no label next to it).
   - **Client Secret**: labeled "secret".
6. Add both as GitHub Secrets in the `Fun-WIP` repo (Settings → Secrets and
   variables → Actions → New repository secret):

| Secret name | Value |
|---|---|
| `REDDIT_CLIENT_ID` | The Client ID from step 5 |
| `REDDIT_CLIENT_SECRET` | The Client Secret from step 5 |

No Reddit username/password is needed — this uses the app-only
("client credentials") OAuth flow, which is sufficient for reading public
posts.

## Setup

This lives in the `reddit-notifier/` subfolder of the `Fun-WIP` repo. The
GitHub Actions workflow file is at `.github/workflows/reddit-notifier-check.yml`
in the repo root (Actions only triggers from workflows at the repo root, not
inside subfolders) — it's configured to run all steps inside this subfolder.

No email, SMS, or third-party notification accounts are required — the
workflow uses GitHub's automatically-provided `GITHUB_TOKEN` to create
issues in this same repo, and assigns each new issue to the repo owner.

### Get notified
To actually be alerted when an issue is created/assigned to you, make sure
notifications are turned on:
- **GitHub mobile app** (recommended): install it and enable push
  notifications. This gets you the closest thing to a text message.
- **Email**: in GitHub Settings → Notifications, make sure "Issues" is
  checked under email notifications.
- **Web/desktop**: the bell icon in GitHub's top nav will also show new
  assigned issues.

### Test it
Once the two Reddit secrets are added and the workflow is re-enabled: go to
the **Actions** tab in the repo → select "Check Reddit for keyword matches"
→ click **Run workflow** to trigger it manually. If a matching post exists,
check the **Issues** tab for a new issue assigned to you.

If the script ever fails (e.g. expired/invalid Reddit credentials), it will
automatically open a GitHub Issue labeled `reddit-notifier-error` containing
the full traceback, so failures are visible without digging through Actions
logs.

## Customizing

- **Change keywords**: edit the `KEYWORDS` list near the top of
  `check_reddit.py`.
- **Change subreddit**: edit `SUBREDDIT` in `check_reddit.py`.
- **Change frequency**: edit the `cron` schedule in
  `.github/workflows/reddit-notifier-check.yml` (currently `0 */6 * * *` =
  every 6 hours). Use https://crontab.guru to build other schedules.
- **Change the issue label**: edit `ISSUE_LABEL` in `check_reddit.py`. Note
  the label must already exist in the repo (the `reddit-alert` and
  `reddit-notifier-error` labels have already been created here).

## How it works

- The workflow runs on a schedule, gets a short-lived OAuth token from
  Reddit using the Client ID/Secret, and calls Reddit's official API for
  new posts in r/Redrising.
- It compares new post IDs against `seen_posts.json` so the same post never
  triggers two issues.
- Matching posts trigger a call to the GitHub REST API to create a new
  issue, titled "Red Rising book news! - <post title>", with the matched
  keyword(s) and a link to the post in the body, assigned to the repo owner.
- The workflow commits the updated `seen_posts.json` back to the repo after
  each run, so state persists between scheduled runs.
- Note: the repo's Actions "Workflow permissions" setting must be set to
  "Read and write permissions" (Settings → Actions → General) for the
  script to be able to create issues and commit back `seen_posts.json` —
  this has already been configured.
