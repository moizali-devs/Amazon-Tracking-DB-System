"""
Shared helpers for 01_filter_data.py, extracted for testability.
"""

BRANDS: dict[str, list[str]] = {
    "Apple":    ["apple", "iphone", "ipad", "airpods", "apple watch"],
    "Samsung":  ["samsung", "galaxy"],
    "Google":   ["google pixel", "google nexus", "pixel phone", "nexus phone"],
    "OnePlus":  ["oneplus", "one plus"],
    "Motorola": ["motorola", "moto g", "moto e", "moto x", "moto z"],
    "Nokia":    ["nokia"],
}


def detect_brand(title: str, brand_field: str | None) -> str | None:
    """Return the matched brand name or None."""
    text = ((title or "") + " " + (brand_field or "")).lower()
    for brand, keywords in BRANDS.items():
        if any(kw in text for kw in keywords):
            return brand
    return None
