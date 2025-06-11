import os
from typing import Iterable

# Placeholder for real Telegram notification logic

def notify_guides(message: str, telegram_ids: Iterable[str]):
    """Send message to guides via Telegram bot (placeholder)."""
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not token:
        print('TELEGRAM_BOT_TOKEN is not configured')
        return
    for tg_id in telegram_ids:
        print(f"Would send to {tg_id}: {message}")
