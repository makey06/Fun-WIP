"""
Checks a subreddit for new posts matching keywords and sends an SMS via
Gmail's SMTP server, using your carrier's email-to-SMS gateway.

Designed to be run on a schedule (e.g. via GitHub Actions). Tracks which
posts have already triggered a notification in seen_posts.json so the same
post never sends two texts.
"""

import json
import os
import smtplib
import sys
import urllib.request
from email.mime.text import MIMEText

SUBREDDIT = "Redrising"
KEYWORDS = ["red god", "release date"]
SEEN_FILE = "seen_posts.json"
MAX_SEEN_HISTORY = 300  # how many post IDs to remember, to keep the file small

# Verizon's email-to-SMS gateway. The "TO_PHONE_NUMBER" secret should just be
# the 10-digit number, e.g. 5551234567
VERIZON_SMS_GATEWAY = "vtext.com"
MAX_SMS_LENGTH = 150  # stay safely under the ~160 char SMS limit

REDDIT_URL = f"https://www.reddit.com/r/{SUBREDDIT}/new.json?limit=25"
USER_AGENT = "reddit-keyword-notifier/1.0 (by u/yourusername)"
EMAIL_SUBJECT = "Red Rising book news!"


def fetch_new_posts():
    """Fetch the newest posts from the subreddit's public JSON feed."""
    req = urllib.request.Request(REDDIT_URL, headers={"User-Agent": USER_AGENT})
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


def send_sms(body):
    gmail_address = os.environ["GMAIL_ADDRESS"]
    gmail_app_password = os.environ["GMAIL_APP_PASSWORD"]
    to_phone_number = os.environ["TO_PHONE_NUMBER"]  # 10 digits, e.g. 5551234567

    to_address = f"{to_phone_number}@{VERIZON_SMS_GATEWAY}"

    # Carrier gateways truncate long messages, so keep it tight and skip a subject line
    short_body = body[:MAX_SMS_LENGTH]

    msg = MIMEText(short_body)
    msg["From"] = gmail_address
    msg["To"] = to_address
    msg["Subject"] = EMAIL_SUBJECT

    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
            server.starttls()
            server.login(gmail_address, gmail_app_password)
            server.sendmail(gmail_address, [to_address], msg.as_string())
        print(f"SMS sent: {short_body}")
    except smtplib.SMTPException as e:
        print(f"Gmail SMTP error: {e}", file=sys.stderr)
        raise


def main():
    seen_ids = load_seen_ids()
    posts = fetch_new_posts()

    new_seen_ids = set(seen_ids)
    notified_count = 0

    # Process oldest-first so notifications arrive in chronological order
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
            body = f"r/{SUBREDDIT}: {title} {permalink}"
            send_sms(body)
            notified_count += 1

    save_seen_ids(new_seen_ids)
    print(f"Checked {len(posts)} posts, sent {notified_count} notification(s).")


if __name__ == "__main__":
    main()
