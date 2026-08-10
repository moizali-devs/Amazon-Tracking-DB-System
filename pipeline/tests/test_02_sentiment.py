"""
Tests for 02_sentiment.py - VADER scoring and label assignment.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sentiment_helpers import vader_label, score_row

analyzer = SentimentIntensityAnalyzer()


# ── vader_label ───────────────────────────────────────────────────────────────

def test_positive_threshold():
    assert vader_label(0.05) == "positive"

def test_above_positive_threshold():
    assert vader_label(0.8) == "positive"

def test_negative_threshold():
    assert vader_label(-0.05) == "negative"

def test_below_negative_threshold():
    assert vader_label(-0.9) == "negative"

def test_neutral_between_thresholds():
    assert vader_label(0.0) == "neutral"

def test_neutral_just_below_positive():
    assert vader_label(0.04) == "neutral"

def test_neutral_just_above_negative():
    assert vader_label(-0.04) == "neutral"


# ── score_row ─────────────────────────────────────────────────────────────────

def test_clearly_positive_review():
    result = score_row(analyzer, "This is an absolutely amazing product, I love it!")
    assert result["vader_label"] == "positive"
    assert result["vader_compound"] >= 0.05

def test_clearly_negative_review():
    result = score_row(analyzer, "Terrible product, broke after one day. Complete waste of money.")
    assert result["vader_label"] == "negative"
    assert result["vader_compound"] <= -0.05

def test_score_row_has_all_fields():
    result = score_row(analyzer, "It works fine.")
    assert set(result.keys()) == {"vader_compound", "vader_label", "tb_polarity", "tb_subjectivity"}

def test_score_row_compound_in_range():
    result = score_row(analyzer, "Average product, nothing special.")
    assert -1.0 <= result["vader_compound"] <= 1.0

def test_score_row_subjectivity_in_range():
    result = score_row(analyzer, "I think this is okay.")
    assert 0.0 <= result["tb_subjectivity"] <= 1.0

def test_score_row_polarity_in_range():
    result = score_row(analyzer, "Good but not great.")
    assert -1.0 <= result["tb_polarity"] <= 1.0
