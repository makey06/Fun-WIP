# Reddit Keyword Notifier

Checks r/Redrising every 6 hours for new posts containing "red god" or
"release date" (case-insensitive) and opens a **GitHub Issue** (assigned to
you) when it finds a match.

## Setup

This lives in the `reddit-notifier/` subfolder of the `Fun-WIP` repo. The
GitHub Actions workflow file is at `.github/workflows/reddit-notifier-check.yml`
in the repo root (Actions only triggers from workflows at the repo root, not
inside subfolders) — it's configured to run all steps inside this subfolder.

No external accounts, API keys, or secrets are required. The workflow uses
GitHub's automatically-provided `GITHUB_TOKEN` to create issues in this same
repo, and assigns each new issue to the repo owner.

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
Go to the **Actions** tab in the repo → select "Check Reddit for keyword
matches" → click **Run workflow** to trigger it manually. If a matching post
exists, check the **Issues** tab for a new issue assigned to you.

## Customizing

- **Change keywords**: edit the `KEYWORDS` list near the top of
  `check_reddit.py`.
- **Change subreddit**: edit `SUBREDDIT` in `check_reddit.py`.
- **Change frequency**: edit the `cron` schedule in
  `.github/workflows/reddit-notifier-check.yml` (currently `0 */6 * * *` =
  every 6 hours). Use https://crontab.guru to build other schedules.
- **Change the issue label**: edit `ISSUE_LABEL` in `check_reddit.py`. Note
  the label must already exist in the repo, or be created beforehand,
  otherwise GitHub will still create the issue but skip the label.

## How it works

- The workflow runs on a schedule and calls Reddit's public JSON feed for
  r/Redrising (no Reddit API key needed for this).
- It compares new post IDs against `seen_posts.json` so the same post never
  triggers two issues.
- Matching posts trigger a call to the GitHub REST API to create a new
  issue, titled "Red Rising book news! - <post title>", with the matched
  keyword(s) and a link to the post in the body, assigned to the repo owner.
- The workflow commits the updated `seen_posts.json` back to the repo after
  each run, so state persists between scheduled runs.
