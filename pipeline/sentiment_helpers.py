"""
Shared helpers for 02_sentiment.py, extracted for testability.
"""

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob

POSITIVE_THRESHOLD =  0.05
NEGATIVE_THRESHOLD = -0.05


def vader_label(compound: float) -> str:
    """Map a VADER compound score to a sentiment label."""
    if compound >= POSITIVE_THRESHOLD:
        return "positive"
    if compound <= NEGATIVE_THRESHOLD:
        return "negative"
    return "neutral"


def score_row(analyzer: SentimentIntensityAnalyzer, text: str) -> dict:
    """Return VADER and TextBlob scores for a single review text."""
    compound = analyzer.polarity_scores(text)["compound"]
    blob = TextBlob(text)
    return {
        "vader_compound":  round(compound, 4),
        "vader_label":     vader_label(compound),
        "tb_polarity":     round(blob.sentiment.polarity, 4),
        "tb_subjectivity": round(blob.sentiment.subjectivity, 4),
    }
