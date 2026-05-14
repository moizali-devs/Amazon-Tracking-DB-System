"""
Shared helpers for 01_filter_data.py, extracted for testability.

PHONE_ASINS is the authoritative allowlist of the 3 most-reviewed actual
handsets per brand, verified by scanning the McAuley 2023 dataset directly.
The pipeline uses this list exclusively — no keyword heuristics.
"""

BRANDS: list[str] = [
    "Apple", "Samsung", "Google", "OnePlus", "Motorola", "Nokia",
]

# Top 3 most-reviewed actual phone ASINs per brand (verified from dataset scan)
PHONE_ASINS: dict[str, str] = {
    # Apple — iPhone XR, iPhone 8, iPhone 11
    "B08L97BW9J": "Apple",
    "B086RM3DQS": "Apple",
    "B097M74GSR": "Apple",
    # Samsung — Galaxy S5, Galaxy S10+, Galaxy S10
    "B00WZZ64QW": "Samsung",
    "B09HPPL95L": "Samsung",
    "B09J3G4TVZ": "Samsung",
    # Google — Pixel 5, Pixel 4 XL, Pixel 4
    "B08MTQ3FQJ": "Google",
    "B0B47QHD1P": "Google",
    "B0BJNSBNZK": "Google",
    # OnePlus — OnePlus 8, OnePlus 2, OnePlus 6T
    "B087NMN917": "OnePlus",
    "B015FZLA8A": "OnePlus",
    "B07V3TL48P": "OnePlus",
    # Motorola — Moto G 2nd gen, Moto G 3rd gen, Moto G 1st gen
    "B00NOSVK54": "Motorola",
    "B0127MKEAE": "Motorola",
    "B00GWR36F6": "Motorola",
    # Nokia — Nokia 5800, Nokia 6, Nokia 2760 Flip
    "B001SEAOC6": "Nokia",
    "B072C2F3X1": "Nokia",
    "B09T2QF3MP": "Nokia",
}


def detect_brand(title: str, brand_field: str | None) -> str | None:
    """
    Legacy keyword helper — no longer used by the main pipeline (which uses
    PHONE_ASINS directly), but kept for backwards-compatibility with tests.
    """
    text = ((title or "") + " " + (brand_field or "")).lower()
    keyword_map = {
        "Apple":    ["iphone"],
        "Samsung":  ["galaxy"],
        "Google":   ["google pixel", "pixel"],
        "OnePlus":  ["oneplus", "one plus"],
        "Motorola": ["moto g", "moto e", "moto x", "moto z"],
        "Nokia":    ["nokia"],
    }
    for brand, keywords in keyword_map.items():
        if any(kw in text for kw in keywords):
            return brand
    return None
