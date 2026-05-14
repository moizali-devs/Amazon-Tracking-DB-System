"""
Step 4: Aggregate reviews into data.json for the Next.js frontend.

Reads:
  data/processed/aspects_reviews.csv

Writes:
  ../app/data/data.json

Output schema per product:
  {
    id, brand, name, reviewCount,
    overallSentiment: { positive, neutral, negative },
    aspectScores: {
      battery|camera|screen|price|build|delivery: {
        positive, neutral, negative, mentionCount
      }
    },
    monthlySentiment: [{ month, reviewCount, positive, neutral, negative }],
    topPraisedAspects:    [str, str, str],
    topCriticizedAspects: [str, str, str],
  }

Usage:
  python 04_aggregate.py
"""

import csv
import json
import logging
from collections import defaultdict
from pathlib import Path

from aggregate_helpers import build_product_entry

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

INPUT_FILE  = Path("data/processed/aspects_reviews.csv")
OUTPUT_FILE = Path("../app/data/data.json")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("=== Step 4: Aggregate → data.json ===")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"{INPUT_FILE} not found. Run 03_aspects.py first.")

    log.info("Reading %s ...", INPUT_FILE)
    by_product: dict[str, list[dict]] = defaultdict(list)

    with open(INPUT_FILE, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            by_product[row["product_id"]].append(row)

    total_reviews = sum(len(v) for v in by_product.values())
    log.info("Loaded %d reviews across %d products.", total_reviews, len(by_product))

    products = []
    for product_id, rows in by_product.items():
        entry = build_product_entry(product_id, rows)
        products.append(entry)
        log.info(
            "  [%s] %-65s %5d reviews  sentiment: +%.0f%% -%.0f%%",
            entry["brand"],
            entry["name"][:65],
            entry["reviewCount"],
            entry["overallSentiment"]["positive"],
            entry["overallSentiment"]["negative"],
        )

    # Sort: by brand alphabetically, then by reviewCount descending within brand
    products.sort(key=lambda p: (p["brand"], -p["reviewCount"]))

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    log.info("\nWrote %d products to %s", len(products), OUTPUT_FILE)
    log.info("Pipeline complete. Start the Next.js app: cd ../app && npm run dev")


if __name__ == "__main__":
    main()
