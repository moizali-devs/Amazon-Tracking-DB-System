"""
Shared helpers for 04_aggregate.py, extracted for testability.
"""

from __future__ import annotations
from collections import defaultdict


ASPECTS = ["battery", "camera", "screen", "price", "build", "delivery"]
LABELS  = ["positive", "neutral", "negative"]


def pct(count: int, total: int) -> float:
    """Return percentage rounded to 1 decimal. Returns 0.0 if total is 0."""
    if total == 0:
        return 0.0
    return round(100 * count / total, 1)


def compute_overall_sentiment(rows: list[dict]) -> dict:
    """
    Compute positive/neutral/negative percentages from a list of scored rows.
    Returns dict with keys: positive, neutral, negative (each a float percentage).
    Percentages are adjusted to sum to exactly 100.
    """
    counts = defaultdict(int)
    for row in rows:
        label = row.get("vader_label", "")
        if label in LABELS:
            counts[label] += 1

    total = sum(counts.values())
    if total == 0:
        return {"positive": 0.0, "neutral": 0.0, "negative": 0.0}

    pos = pct(counts["positive"], total)
    neu = pct(counts["neutral"],  total)
    neg = round(100 - pos - neu, 1)   # ensure sum == 100.0

    return {"positive": pos, "neutral": neu, "negative": neg}


def compute_aspect_scores(rows: list[dict]) -> dict:
    """
    For each aspect, compute the percentage of mentions that are positive.
    Returns dict keyed by aspect name, each with:
      { positive, neutral, negative, mentionCount }
    """
    result = {}
    for aspect in ASPECTS:
        col = f"aspect_{aspect}"
        mentioned = [r for r in rows if r.get(col)]
        total = len(mentioned)
        if total == 0:
            result[aspect] = {
                "positive": 0.0, "neutral": 0.0, "negative": 0.0, "mentionCount": 0
            }
            continue

        counts = defaultdict(int)
        for r in mentioned:
            counts[r[col]] += 1

        pos = pct(counts["positive"], total)
        neu = pct(counts["neutral"],  total)
        neg = round(100 - pos - neu, 1)

        result[aspect] = {
            "positive":     pos,
            "neutral":      neu,
            "negative":     neg,
            "mentionCount": total,
        }
    return result


def compute_monthly_sentiment(rows: list[dict]) -> list[dict]:
    """
    Group rows by YYYY-MM timestamp and compute sentiment percentages per month.
    Returns a list of dicts sorted chronologically:
      [{ month, positive, neutral, negative, reviewCount }, ...]
    """
    monthly: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        ts = row.get("timestamp", "")
        if ts:
            monthly[ts].append(row)

    result = []
    for month in sorted(monthly.keys()):
        month_rows = monthly[month]
        sentiment = compute_overall_sentiment(month_rows)
        result.append({
            "month":       month,
            "reviewCount": len(month_rows),
            **sentiment,
        })
    return result


def compute_top_aspects(aspect_scores: dict, n: int = 3) -> tuple[list[str], list[str]]:
    """
    Return (top_praised, top_criticized) — lists of aspect names.
    Only aspects with at least 1 mention are considered.
    """
    mentioned = {k: v for k, v in aspect_scores.items() if v["mentionCount"] > 0}

    top_praised    = sorted(mentioned, key=lambda k: mentioned[k]["positive"],  reverse=True)[:n]
    top_criticized = sorted(mentioned, key=lambda k: mentioned[k]["negative"],  reverse=True)[:n]

    return top_praised, top_criticized


def build_product_entry(product_id: str, rows: list[dict]) -> dict:
    """Build the full product JSON entry from its review rows."""
    sample = rows[0]
    overall   = compute_overall_sentiment(rows)
    aspects   = compute_aspect_scores(rows)
    monthly   = compute_monthly_sentiment(rows)
    praised, criticized = compute_top_aspects(aspects)

    return {
        "id":                  product_id,
        "brand":               sample["brand"],
        "name":                sample["product_name"],
        "reviewCount":         len(rows),
        "overallSentiment":    overall,
        "aspectScores":        aspects,
        "monthlySentiment":    monthly,
        "topPraisedAspects":   praised,
        "topCriticizedAspects": criticized,
    }
