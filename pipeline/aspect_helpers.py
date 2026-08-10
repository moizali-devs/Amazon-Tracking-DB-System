"""
Shared helpers for 03_aspects.py, extracted for testability.
"""

from __future__ import annotations

# ── Aspect keyword map ────────────────────────────────────────────────────────
# Each aspect maps to a set of keywords that signal it is being discussed.
# Matching is done on lowercased token lemmas and raw text within a window
# around the keyword.

ASPECT_KEYWORDS: dict[str, list[str]] = {
    "battery":  ["battery", "charge", "charging", "power", "life", "drain", "mah"],
    "camera":   ["camera", "photo", "picture", "image", "lens", "shot", "megapixel", "mp"],
    "screen":   ["screen", "display", "glass", "protector", "resolution", "brightness", "touch"],
    "price":    ["price", "cost", "value", "money", "worth", "expensive", "cheap", "affordable", "deal"],
    "build":    ["build", "quality", "material", "plastic", "metal", "durable", "sturdy", "flimsy", "finish"],
    "delivery": ["delivery", "shipping", "arrived", "package", "packaging", "damaged", "fast", "slow", "days"],
}

# Window (in tokens) around a keyword to search for sentiment-bearing adjectives
WINDOW_SIZE = 5

# spaCy POS tags considered sentiment-bearing
SENTIMENT_POS = {"ADJ", "ADV"}


def extract_aspects(doc, vader_label: str) -> dict[str, str | None]:
    """
    Given a spaCy Doc and a pre-computed VADER label, return a dict mapping
    each aspect to its sentiment label ('positive'|'negative'|'neutral'|None).

    None means the aspect was not mentioned in the review.
    When an aspect IS mentioned, we use the VADER label of the overall review
    as the sentiment - this is simpler and more reliable than token-level
    sentiment, which is noisy on short informal text.
    """
    text_lower = doc.text.lower()
    result: dict[str, str | None] = {aspect: None for aspect in ASPECT_KEYWORDS}

    for aspect, keywords in ASPECT_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                result[aspect] = vader_label
                break  # one keyword match is enough per aspect

    return result


def aspects_to_columns(aspects: dict[str, str | None]) -> dict[str, str]:
    """Convert aspect dict to flat CSV column dict. None → empty string."""
    return {f"aspect_{k}": (v or "") for k, v in aspects.items()}
