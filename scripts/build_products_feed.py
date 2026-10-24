#!/usr/bin/env python3
"""
Pull the creator's project list from the itch.io API and write it as a
Google Shopping RSS feed (docs/products.xml) for BabyLoveGrowth's
"XML Feed (URL)" product-catalog import.

Usage:
    ITCH_API_KEY=xxxx python scripts/build_products_feed.py [output_path]

Only the API key is secret; the feed itself contains public store data.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from xml.sax.saxutils import escape

STORE_NAME = "RPG Maker Plugins"
STORE_URL = "https://rpg-maker-plugins.itch.io/"
STORE_DESC = "Plugins, tools and asset packs for RPG Maker MZ."
CURRENCY = "USD"

MODERN_URL = "https://api.itch.io/profile/games"
LEGACY_URL = "https://itch.io/api/1/{key}/my-games"


def fetch_json(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    req.add_header("User-Agent", "rpgmakermarket-products-feed/1.0")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch_games(api_key):
    """Try the current api.itch.io host first, fall back to the legacy v1 URL."""
    errors = []
    try:
        data = fetch_json(MODERN_URL, {"Authorization": f"Bearer {api_key}"})
        if "games" in data:
            return data["games"], "api.itch.io"
        errors.append(f"api.itch.io: {data.get('errors') or 'no games field'}")
    except urllib.error.HTTPError as e:
        errors.append(f"api.itch.io: HTTP {e.code}")
    except Exception as e:  # noqa: BLE001
        errors.append(f"api.itch.io: {e}")

    try:
        data = fetch_json(LEGACY_URL.format(key=api_key))
        if "games" in data:
            return data["games"], "itch.io/api/1"
        errors.append(f"legacy: {data.get('errors') or 'no games field'}")
    except urllib.error.HTTPError as e:
        errors.append(f"legacy: HTTP {e.code}")
    except Exception as e:  # noqa: BLE001
        errors.append(f"legacy: {e}")

    raise SystemExit("Could not fetch games from itch.io: " + "; ".join(errors))


def slug_from_url(url):
    return url.rstrip("/").rsplit("/", 1)[-1] or "product"


def game_to_item(g):
    url = g.get("url") or ""
    title = g.get("title") or slug_from_url(url)
    desc = (g.get("short_text") or "").strip()
    cents = int(g.get("min_price") or 0)
    price = f"{cents / 100:.2f} {CURRENCY}"
    if cents == 0:
        desc = (desc + " " if desc else "") + "Free / pay what you want."
    image = g.get("still_cover_url") or g.get("cover_url") or ""
    gid = g.get("id") or slug_from_url(url)

    lines = [
        "    <item>",
        f"      <g:id>{escape(str(gid))}</g:id>",
        f"      <title>{escape(title)}</title>",
        f"      <g:title>{escape(title)}</g:title>",
        f"      <link>{escape(url)}</link>",
        f"      <g:link>{escape(url)}</g:link>",
        f"      <description>{escape(desc)}</description>",
        f"      <g:description>{escape(desc)}</g:description>",
        f"      <g:price>{price}</g:price>",
        "      <g:availability>in stock</g:availability>",
        "      <g:condition>new</g:condition>",
        f"      <g:brand>{escape(STORE_NAME)}</g:brand>",
        f"      <g:product_type>{escape(g.get('classification') or 'tool')}</g:product_type>",
    ]
    if image:
        lines.append(f"      <g:image_link>{escape(image)}</g:image_link>")
    lines.append("    </item>")
    return "\n".join(lines)


def build_feed(games):
    published = [g for g in games if g.get("published", True)]
    published.sort(key=lambda g: (g.get("title") or "").lower())
    now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    items = "\n".join(game_to_item(g) for g in published)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>{escape(STORE_NAME)}</title>
    <link>{escape(STORE_URL)}</link>
    <description>{escape(STORE_DESC)}</description>
    <lastBuildDate>{now}</lastBuildDate>
{items}
  </channel>
</rss>
""", len(published)


def main():
    api_key = os.environ.get("ITCH_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("ITCH_API_KEY environment variable is not set.")

    out_path = sys.argv[1] if len(sys.argv) > 1 else "docs/products.xml"

    games, source = fetch_games(api_key)
    xml, count = build_feed(games)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(xml)
    print(f"Wrote {count} published products to {out_path} (source: {source})")


if __name__ == "__main__":
    main()
