"""
Tests for 04_aggregate.py - sentiment aggregation, aspect scoring, and output schema.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from aggregate_helpers import (
    compute_overall_sentiment,
    compute_aspect_scores,
    compute_monthly_sentiment,
    compute_top_aspects,
    build_product_entry,
    ASPECTS,
)

# ── Fixtures ──────────────────────────────────────────────────────────────────

def make_row(vader_label="positive", timestamp="2023-01", **aspect_overrides):
    row = {
        "product_id":    "B001",
        "brand":         "Apple",
        "product_name":  "Test Product",
        "review_text":   "Great product",
        "rating":        "5",
        "timestamp":     timestamp,
        "vader_compound": "0.8",
        "vader_label":   vader_label,
        "tb_polarity":   "0.5",
        "tb_subjectivity": "0.6",
        "aspect_battery":  "",
        "aspect_camera":   "",
        "aspect_screen":   "",
        "aspect_price":    "",
        "aspect_build":    "",
        "aspect_delivery": "",
    }
    for k, v in aspect_overrides.items():
        row[f"aspect_{k}"] = v
    return row


# ── compute_overall_sentiment ─────────────────────────────────────────────────

def test_overall_sentiment_percentages_sum_to_100():
    rows = [make_row("positive")] * 7 + [make_row("negative")] * 2 + [make_row("neutral")] * 1
    result = compute_overall_sentiment(rows)
    total = result["positive"] + result["neutral"] + result["negative"]
    assert abs(total - 100.0) < 0.1

def test_overall_sentiment_all_positive():
    rows = [make_row("positive")] * 10
    result = compute_overall_sentiment(rows)
    assert result["positive"] == 100.0
    assert result["negative"] == 0.0

def test_overall_sentiment_empty_rows():
    result = compute_overall_sentiment([])
    assert result == {"positive": 0.0, "neutral": 0.0, "negative": 0.0}

def test_overall_sentiment_keys():
    result = compute_overall_sentiment([make_row("positive")])
    assert set(result.keys()) == {"positive", "neutral", "negative"}


# ── compute_aspect_scores ─────────────────────────────────────────────────────

def test_aspect_scores_has_all_aspects():
    rows = [make_row()]
    result = compute_aspect_scores(rows)
    assert set(result.keys()) == set(ASPECTS)

def test_aspect_scores_mention_count():
    rows = [make_row(battery="positive"), make_row(battery="positive"), make_row()]
    result = compute_aspect_scores(rows)
    assert result["battery"]["mentionCount"] == 2

def test_aspect_scores_zero_mention_count_when_not_mentioned():
    rows = [make_row()]  # no aspects mentioned
    result = compute_aspect_scores(rows)
    assert result["battery"]["mentionCount"] == 0

def test_aspect_scores_sum_to_100():
    rows = [make_row(price="positive")] * 6 + [make_row(price="negative")] * 4
    result = compute_aspect_scores(rows)
    total = result["price"]["positive"] + result["price"]["neutral"] + result["price"]["negative"]
    assert abs(total - 100.0) < 0.1


# ── compute_monthly_sentiment ─────────────────────────────────────────────────

def test_monthly_sentiment_sorted_chronologically():
    rows = (
        [make_row(timestamp="2023-03")] * 3 +
        [make_row(timestamp="2023-01")] * 5 +
        [make_row(timestamp="2023-02")] * 2
    )
    result = compute_monthly_sentiment(rows)
    months = [r["month"] for r in result]
    assert months == sorted(months)

def test_monthly_sentiment_review_count():
    rows = [make_row(timestamp="2023-01")] * 4 + [make_row(timestamp="2023-02")] * 6
    result = compute_monthly_sentiment(rows)
    counts = {r["month"]: r["reviewCount"] for r in result}
    assert counts["2023-01"] == 4
    assert counts["2023-02"] == 6

def test_monthly_sentiment_skips_empty_timestamp():
    rows = [make_row(timestamp=""), make_row(timestamp="2023-01")]
    result = compute_monthly_sentiment(rows)
    assert len(result) == 1
    assert result[0]["month"] == "2023-01"


# ── compute_top_aspects ───────────────────────────────────────────────────────

def test_top_aspects_returns_three():
    rows = [
        make_row(battery="positive", camera="positive", screen="positive",
                 price="negative", build="negative", delivery="negative"),
    ] * 10
    scores = compute_aspect_scores(rows)
    praised, criticized = compute_top_aspects(scores)
    assert len(praised) == 3
    assert len(criticized) == 3

def test_top_praised_are_highest_positive():
    rows = (
        [make_row(battery="positive")] * 9 + [make_row(battery="negative")] * 1 +  # 90% pos
        [make_row(screen="positive")]  * 5 + [make_row(screen="negative")]  * 5 +  # 50% pos
        [make_row(price="negative")]   * 8 + [make_row(price="positive")]   * 2    # 20% pos
    )
    scores = compute_aspect_scores(rows)
    praised, _ = compute_top_aspects(scores, n=1)
    assert praised[0] == "battery"

def test_top_criticized_are_highest_negative():
    rows = (
        [make_row(price="negative")]   * 8 + [make_row(price="positive")]   * 2 +  # 80% neg
        [make_row(battery="negative")] * 3 + [make_row(battery="positive")] * 7    # 30% neg
    )
    scores = compute_aspect_scores(rows)
    _, criticized = compute_top_aspects(scores, n=1)
    assert criticized[0] == "price"


# ── build_product_entry ───────────────────────────────────────────────────────

def test_build_product_entry_schema():
    rows = [make_row("positive", timestamp="2023-01")] * 5
    entry = build_product_entry("B001", rows)
    assert entry["id"] == "B001"
    assert entry["brand"] == "Apple"
    assert entry["name"] == "Test Product"
    assert entry["reviewCount"] == 5
    assert "overallSentiment" in entry
    assert "aspectScores" in entry
    assert "monthlySentiment" in entry
    assert "topPraisedAspects" in entry
    assert "topCriticizedAspects" in entry

def test_build_product_entry_review_count():
    rows = [make_row()] * 42
    entry = build_product_entry("B001", rows)
    assert entry["reviewCount"] == 42

def test_build_product_entry_monthly_sorted():
    rows = [make_row(timestamp="2023-06")] * 3 + [make_row(timestamp="2023-01")] * 3
    entry = build_product_entry("B001", rows)
    months = [m["month"] for m in entry["monthlySentiment"]]
    assert months == sorted(months)
