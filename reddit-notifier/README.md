# Reddit Keyword Notifier

Checks r/Redrising every 6 hours for new posts containing "red god" or
"release date" (case-insensitive) and texts you via Twilio when it finds a
match.

## Setup

This lives in the `reddit-notifier/` subfolder of the `Fun-WIP` repo. The
GitHub Actions workflow file is at `.github/workflows/reddit-notifier-check.yml`
in the repo root (Actions only triggers from workflows at the repo root, not
inside subfolders) — it's configured to run all steps inside this subfolder.

### 1. Get a Gmail App Password
This uses Gmail's SMTP server to send mail to your carrier's email-to-SMS
gateway, so you need an "app password" (not your regular Gmail password):

1. Make sure 2-Step Verification is turned on for your Google account
   (required for app passwords): https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create a new app password (name it something like "reddit-notifier").
4. Copy the 16-character password it gives you — you'll only see it once.

### 2. Add GitHub Secrets
In your repo: **Settings → Secrets and variables → Actions → New repository secret**.
Add these three:

| Secret name | Value |
|---|---|
| `GMAIL_ADDRESS` | Your full Gmail address, e.g. `you@gmail.com` |
| `GMAIL_APP_PASSWORD` | The 16-character app password from step 2 |
| `TO_PHONE_NUMBER` | Your 10-digit Verizon number, e.g. `5551234567` |

### 3. Test it
Go to the **Actions** tab in your repo → select "Check Reddit for keyword
matches" → click **Run workflow** to trigger it manually and confirm it
works before waiting for the schedule.

Note: Verizon's email-to-SMS gateway (`@vtext.com`) can occasionally be slow
or drop messages — it's free but not as reliable as a dedicated SMS service.
If you switch carriers later, the gateway domain in `check_reddit.py`
(`VERIZON_SMS_GATEWAY`) will need to change too (e.g. AT&T is
`@txt.att.net`, T-Mobile is `@tmomail.net`).

## Customizing

- **Change keywords**: edit the `KEYWORDS` list near the top of
  `check_reddit.py`.
- **Change subreddit**: edit `SUBREDDIT` in `check_reddit.py`.
- **Change frequency**: edit the `cron` schedule in
  `.github/workflows/check-reddit.yml` (currently `0 */6 * * *` = every 6
  hours). Use https://crontab.guru to build other schedules.

## How it works

- A GitHub Actions workflow runs on a schedule and calls Reddit's public
  JSON feed for r/Redrising (no Reddit API key needed for this).
- It compares new post IDs against `seen_posts.json` so you're never texted
  twice about the same post.
- Matching posts trigger an SMS by emailing your carrier's email-to-SMS
  gateway (e.g. `5551234567@vtext.com` for Verizon) via Gmail's SMTP server.
- The workflow commits the updated `seen_posts.json` back to the repo after
  each run, so state persists between scheduled runs.
