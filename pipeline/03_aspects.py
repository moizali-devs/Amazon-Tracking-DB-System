"""
Step 3: Aspect extraction on scored reviews.

Reads:
  data/processed/scored_reviews.csv

Writes:
  data/processed/aspects_reviews.csv

Adds columns per aspect (battery, camera, screen, price, build, delivery):
  aspect_battery    str - positive | negative | neutral | "" (not mentioned)
  aspect_camera     str
  aspect_screen     str
  aspect_price      str
  aspect_build      str
  aspect_delivery   str

Strategy:
 - Use keyword matching to detect which aspects are mentioned in a review
 - When an aspect is mentioned, assign it the review's overall VADER label
 - spaCy is used for tokenisation and lemmatisation (improves keyword matching)

Usage:
  python 03_aspects.py
"""

import csv
import logging
from pathlib import Path

import spacy
from tqdm import tqdm

from aspect_helpers import ASPECT_KEYWORDS, extract_aspects, aspects_to_columns

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

INPUT_FILE  = Path("data/processed/scored_reviews.csv")
OUTPUT_FILE = Path("data/processed/aspects_reviews.csv")

SPACY_MODEL   = "en_core_web_sm"
SPACY_BATCH   = 256   # reviews per batch for nlp.pipe

INPUT_COLUMNS = [
    "product_id", "brand", "product_name", "review_text",
    "rating", "timestamp", "vader_compound", "vader_label",
    "tb_polarity", "tb_subjectivity",
]
ASPECT_COLUMNS = [f"aspect_{k}" for k in ASPECT_KEYWORDS]
OUTPUT_COLUMNS = INPUT_COLUMNS + ASPECT_COLUMNS


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("=== Step 3: Aspect Extraction ===")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"{INPUT_FILE} not found. Run 02_sentiment.py first.")

    log.info("Loading spaCy model '%s' ...", SPACY_MODEL)
    # Disable unused pipeline components for speed - we only need tokeniser + lemmatiser
    nlp = spacy.load(SPACY_MODEL, disable=["parser", "ner"])

    # Count rows for progress bar
    with open(INPUT_FILE, encoding="utf-8") as f:
        total_rows = sum(1 for _ in f) - 1

    log.info("Extracting aspects from %d reviews ...", total_rows)

    aspect_mention_counts: dict[str, int] = {k: 0 for k in ASPECT_KEYWORDS}

    with (
        open(INPUT_FILE, encoding="utf-8", newline="") as fin,
        open(OUTPUT_FILE, "w", encoding="utf-8", newline="") as fout,
    ):
        reader = csv.DictReader(fin)
        writer = csv.DictWriter(fout, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()

        rows = list(reader)
        texts = [r["review_text"] for r in rows]

        for row, doc in tqdm(
            zip(rows, nlp.pipe(texts, batch_size=SPACY_BATCH)),
            total=total_rows,
            unit="reviews",
        ):
            aspects = extract_aspects(doc, row["vader_label"])

            for aspect, label in aspects.items():
                if label is not None:
                    aspect_mention_counts[aspect] += 1

            writer.writerow({**row, **aspects_to_columns(aspects)})

    total = total_rows
    log.info("\nAspect mention counts:")
    for aspect, count in aspect_mention_counts.items():
        log.info("  %-12s %6d  (%.1f%% of reviews)", aspect, count, 100 * count / total)

    log.info("\nOutput: %s (%d rows)", OUTPUT_FILE, total)
    log.info("Next step: python 04_aggregate.py")


if __name__ == "__main__":
    main()
