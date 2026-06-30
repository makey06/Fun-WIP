"""
Checks a subreddit for new posts matching keywords and opens a GitHub Issue
(assigned to the repo owner) for each match.

Designed to be run on a schedule via GitHub Actions. Tracks which posts have
already been processed in seen_posts.json so the same post never triggers
two issues. Uses the automatically-provided GITHUB_TOKEN and GITHUB_REPOSITORY
env vars that every Actions run has access to -- no extra secrets needed.
"""

import base64
import json
import os
import sys
import urllib.error
import urllib.request

SUBREDDIT = "Redrising"
KEYWORDS = ["red god", "release date"]
SEEN_FILE = "seen_posts.json"
MAX_SEEN_HISTORY = 300  # how many post IDs to remember, to keep the file small

REDDIT_OAUTH_TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
REDDIT_API_URL = f"https://oauth.reddit.com/r/{SUBREDDIT}/new?limit=25"
USER_AGENT = "redrising-keyword-notifier/1.0 (by /u/yourusername)"
ISSUE_LABEL = "reddit-alert"
ERROR_LABEL = "reddit-notifier-error"


def get_reddit_access_token():
    """
    Get a short-lived OAuth token using Reddit's client_credentials grant.
    This is the "app-only" flow -- it only needs a client ID/secret (no
    Reddit username/password) and is sufficient for reading public posts.
    """
    client_id = os.environ["REDDIT_CLIENT_ID"]
    client_secret = os.environ["REDDIT_CLIENT_SECRET"]

    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    req = urllib.request.Request(
        REDDIT_OAUTH_TOKEN_URL,
        data=b"grant_type=client_credentials",
        method="POST",
        headers={
            "Authorization": f"Basic {auth}",
            "User-Agent": USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["access_token"]


def fetch_new_posts():
    """Fetch the newest posts from the subreddit via Reddit's official OAuth API."""
    token = get_reddit_access_token()
    req = urllib.request.Request(
        REDDIT_API_URL,
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": USER_AGENT,
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["data"]["children"]


def load_seen_ids():
    if not os.path.exists(SEEN_FILE):
        return set()
    with open(SEEN_FILE, "r") as f:
        try:
            return set(json.load(f))
        except json.JSONDecodeError:
            return set()


def save_seen_ids(seen_ids):
    # Keep only the most recent N to prevent unbounded growth
    trimmed = list(seen_ids)[-MAX_SEEN_HISTORY:]
    with open(SEEN_FILE, "w") as f:
        json.dump(trimmed, f, indent=2)


def matches_keywords(post):
    title = post.get("title", "")
    selftext = post.get("selftext", "")
    combined = f"{title} {selftext}".lower()
    return [kw for kw in KEYWORDS if kw.lower() in combined]


def create_github_issue(title, body, labels=None):
    """Create a GitHub Issue in the current repo, assigned to the repo owner."""
    token = os.environ["GITHUB_TOKEN"]
    repo_full_name = os.environ["GITHUB_REPOSITORY"]  # auto-set by Actions, e.g. "owner/repo"
    owner = repo_full_name.split("/")[0]

    url = f"https://api.github.com/repos/{repo_full_name}/issues"
    payload = {
        "title": title,
        "body": body,
        "labels": labels if labels is not None else [ISSUE_LABEL],
        "assignees": [owner],
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": USER_AGENT,
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        print(f"Created issue #{data['number']}: {data['html_url']}")
    except urllib.error.HTTPError as e:
        print(f"GitHub API error {e.code}: {e.read().decode()}", file=sys.stderr)
        raise


def main():
    seen_ids = load_seen_ids()
    posts = fetch_new_posts()

    new_seen_ids = set(seen_ids)
    notified_count = 0

    # Process oldest-first so issues are created in chronological order
    for child in reversed(posts):
        post = child["data"]
        post_id = post["id"]

        if post_id in seen_ids:
            continue

        new_seen_ids.add(post_id)

        matched = matches_keywords(post)
        if matched:
            title = post.get("title", "(no title)")
            permalink = f"https://redd.it/{post_id}"
            issue_title = f"Red Rising book news! - {title}"
            issue_body = (
                f"**Matched keyword(s):** {', '.join(matched)}\n\n"
                f"**Post:** {title}\n\n"
                f"**Link:** {permalink}\n\n"
                f"_Subreddit: r/{SUBREDDIT}_"
            )
            create_github_issue(issue_title, issue_body)
            notified_count += 1

    save_seen_ids(new_seen_ids)
    print(f"Checked {len(posts)} posts, created {notified_count} issue(s).")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        import traceback
        tb = traceback.format_exc()
        print(tb, file=sys.stderr)
        try:
            create_github_issue(
                "Reddit notifier script error",
                f"The reddit-notifier script failed with an unhandled exception:\n\n```\n{tb}\n```",
                labels=[ERROR_LABEL],
            )
        except Exception as inner:
            print(f"Also failed to report the error as an issue: {inner}", file=sys.stderr)
        sys.exit(1)
