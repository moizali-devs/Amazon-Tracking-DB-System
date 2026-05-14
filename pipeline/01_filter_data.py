"""
Step 1: Filter raw McAuley 2023 dataset to 18 target products.

Reads:
  ../raw-datasets/Cell_Phones_and_Accessories.jsonl.gz          (reviews, JSON-lines)
  ../raw-datasets/meta_Cell_Phones_and_Accessories.jsonl(1).gz  (metadata, JSON-lines)

Writes:
  data/processed/filtered_reviews.csv

Usage:
  python 01_filter_data.py
"""

import gzip
import json
import csv
import logging
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from filter_data_helpers import BRANDS, detect_brand

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────

RAW_DIR = Path("../raw-datasets")
PROCESSED_DIR = Path("data/processed")
REVIEWS_FILE = RAW_DIR / "Cell_Phones_and_Accessories.jsonl.gz"
META_FILE = RAW_DIR / "meta_Cell_Phones_and_Accessories.jsonl(1).gz"
OUTPUT_FILE = PROCESSED_DIR / "filtered_reviews.csv"

PRODUCTS_PER_BRAND = 3
MAX_REVIEWS = 1_000_000

OUTPUT_COLUMNS = [
    "product_id",
    "brand",
    "product_name",
    "review_text",
    "rating",
    "timestamp",
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def iter_gz_json(path: Path):
    """Yield parsed objects from a gzipped JSON-lines file."""
    with gzip.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


def parse_timestamp(ts) -> str:
    """Convert 2023 dataset timestamp (milliseconds) to YYYY-MM string."""
    if not ts:
        return ""
    try:
        return datetime.fromtimestamp(int(ts) / 1000, tz=timezone.utc).strftime("%Y-%m")
    except (ValueError, OSError):
        return ""


# ── Main ──────────────────────────────────────────────────────────────────────

def build_product_index() -> dict[str, dict]:
    """
    Read 2023 metadata file and return a dict mapping parent_asin → {brand, name}.
    Only includes products that match one of the target brands.
    """
    if not META_FILE.exists():
        raise FileNotFoundError(f"Metadata file not found: {META_FILE}")

    log.info("Reading product metadata from %s ...", META_FILE)
    index: dict[str, dict] = {}
    total = 0

    for record in iter_gz_json(META_FILE):
        total += 1
        # 2023 format uses parent_asin as the canonical product identifier
        asin = record.get("parent_asin", "").strip()
        title = record.get("title", "")
        store = record.get("store", "")  # brand field in 2023 format

        if not asin or not title:
            continue

        brand = detect_brand(title, store)
        if brand:
            index[asin] = {"brand": brand, "name": title}

        if total % 200_000 == 0:
            log.info("  Scanned %d metadata records ...", total)

    log.info("Scanned %d products, %d matched target brands.", total, len(index))
    return index


def select_top_products(product_index: dict[str, dict]) -> set[str]:
    """
    Count reviews per product in the reviews file, pick top PRODUCTS_PER_BRAND per brand.
    Returns the set of selected parent_asins.
    """
    if not REVIEWS_FILE.exists():
        raise FileNotFoundError(f"Reviews file not found: {REVIEWS_FILE}")

    log.info("Counting reviews per product ...")
    review_counts: dict[str, int] = defaultdict(int)

    for i, record in enumerate(iter_gz_json(REVIEWS_FILE)):
        # 2023 format: use parent_asin for product grouping
        asin = record.get("parent_asin", "")
        if asin in product_index:
            review_counts[asin] += 1
        if i % 500_000 == 0 and i > 0:
            log.info("  Scanned %d reviews ...", i)

    # Group by brand and pick top N by review count
    brand_products: dict[str, list[tuple[int, str]]] = defaultdict(list)
    for asin, count in review_counts.items():
        brand = product_index[asin]["brand"]
        brand_products[brand].append((count, asin))

    selected: set[str] = set()
    log.info("\nSelected products:")
    for brand in BRANDS:
        candidates = sorted(brand_products.get(brand, []), reverse=True)
        top = candidates[:PRODUCTS_PER_BRAND]
        if not top:
            log.warning("  [%s] No products found!", brand)
        for count, asin in top:
            name = product_index[asin]["name"][:70]
            log.info("  [%s] %s (%d reviews) — %s", brand, asin, count, name)
            selected.add(asin)

    log.info("\nTotal selected: %d products across %d brands.", len(selected), len(BRANDS))
    return selected


def write_filtered_csv(
    product_index: dict[str, dict],
    selected_asins: set[str],
    output_file: Path,
) -> int:
    """
    Stream through reviews file and write matching rows to CSV.
    Returns total rows written.
    """
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    written = 0
    skipped_no_text = 0

    log.info("Writing filtered reviews to %s ...", output_file)

    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()

        for record in iter_gz_json(REVIEWS_FILE):
            if written >= MAX_REVIEWS:
                log.info("Reached %d review cap.", MAX_REVIEWS)
                break

            asin = record.get("parent_asin", "")
            if asin not in selected_asins:
                continue

            # 2023 format: review text is in 'text', not 'reviewText'
            review_text = record.get("text", "").strip()
            if not review_text:
                skipped_no_text += 1
                continue

            # 2023 format: 'rating' (not 'overall'), 'timestamp' in ms (not unixReviewTime)
            rating = record.get("rating", None)
            timestamp = parse_timestamp(record.get("timestamp"))

            writer.writerow({
                "product_id": asin,
                "brand": product_index[asin]["brand"],
                "product_name": product_index[asin]["name"],
                "review_text": review_text,
                "rating": rating,
                "timestamp": timestamp,
            })
            written += 1

            if written % 100_000 == 0:
                log.info("  Written %d reviews ...", written)

    log.info("Done. %d reviews written, %d skipped (no text).", written, skipped_no_text)
    return written


def main():
    log.info("=== Step 1: Filter Data (2023 dataset) ===")

    product_index = build_product_index()
    selected_asins = select_top_products(product_index)
    count = write_filtered_csv(product_index, selected_asins, OUTPUT_FILE)

    log.info("\nOutput: %s (%d rows)", OUTPUT_FILE, count)
    log.info("Next step: python 02_sentiment.py")


if __name__ == "__main__":
    main()
