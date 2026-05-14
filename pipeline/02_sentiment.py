"""
Step 2: Sentiment scoring on filtered reviews.

Reads:
  data/processed/filtered_reviews.csv

Writes:
  data/processed/scored_reviews.csv

Adds columns:
  vader_compound     float  — VADER compound score [-1.0, 1.0]
  vader_label        str    — positive | neutral | negative
  tb_polarity        float  — TextBlob polarity [-1.0, 1.0]
  tb_subjectivity    float  — TextBlob subjectivity [0.0, 1.0]

Usage:
  python 02_sentiment.py
"""

import csv
import logging
from pathlib import Path

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from tqdm import tqdm
from sentiment_helpers import vader_label, score_row

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

INPUT_FILE  = Path("data/processed/filtered_reviews.csv")
OUTPUT_FILE = Path("data/processed/scored_reviews.csv")

INPUT_COLUMNS = ["product_id", "brand", "product_name", "review_text", "rating", "timestamp"]
OUTPUT_COLUMNS = INPUT_COLUMNS + ["vader_compound", "vader_label", "tb_polarity", "tb_subjectivity"]

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("=== Step 2: Sentiment Scoring ===")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"{INPUT_FILE} not found. Run 01_filter_data.py first.")

    analyzer = SentimentIntensityAnalyzer()

    # Count rows for progress bar
    with open(INPUT_FILE, encoding="utf-8") as f:
        total_rows = sum(1 for _ in f) - 1  # subtract header

    log.info("Scoring %d reviews ...", total_rows)

    label_counts = {"positive": 0, "neutral": 0, "negative": 0}

    with (
        open(INPUT_FILE, encoding="utf-8", newline="") as fin,
        open(OUTPUT_FILE, "w", encoding="utf-8", newline="") as fout,
    ):
        reader = csv.DictReader(fin)
        writer = csv.DictWriter(fout, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()

        for row in tqdm(reader, total=total_rows, unit="reviews"):
            scores = score_row(analyzer, row["review_text"])
            label_counts[scores["vader_label"]] += 1
            writer.writerow({**row, **scores})

    total = sum(label_counts.values())
    log.info("\nSentiment distribution:")
    for label, count in label_counts.items():
        log.info("  %-10s %6d  (%.1f%%)", label, count, 100 * count / total)

    log.info("\nOutput: %s (%d rows)", OUTPUT_FILE, total)
    log.info("Next step: python 03_aspects.py")


if __name__ == "__main__":
    main()
