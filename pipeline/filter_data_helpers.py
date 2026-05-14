"""
Shared helpers for 01_filter_data.py, extracted for testability.
"""

BRANDS: dict[str, list[str]] = {
    "Apple":    ["iphone"],
    "Samsung":  ["galaxy"],
    "Google":   ["google pixel", "pixel"],
    "OnePlus":  ["oneplus", "one plus"],
    "Motorola": ["moto g", "moto e", "moto x", "moto z", "motorola moto"],
    "Nokia":    ["nokia"],
}

# Words that indicate a product is an accessory, not a phone
ACCESSORY_KEYWORDS = [
    "charger", "charging", "cable", "case", "cover", "screen protector",
    "tempered glass", "film", "protector", "holster", "pouch", "wallet",
    "stand", "mount", "holder", "dock", "adapter", "converter", "hub",
    "earphone", "earbuds", "headphone", "headset", "speaker",
    "battery pack", "power bank", "stylus", "stylus pen",
    "keyboard", "lens", "tripod", "selfie stick",
]


def is_accessory(title: str) -> bool:
    """Return True if the product title looks like an accessory, not a phone."""
    t = (title or "").lower()
    return any(kw in t for kw in ACCESSORY_KEYWORDS)


def detect_brand(title: str, brand_field: str | None) -> str | None:
    """Return the matched brand name or None. Returns None for accessories."""
    if is_accessory(title):
        return None
    text = ((title or "") + " " + (brand_field or "")).lower()
    for brand, keywords in BRANDS.items():
        if any(kw in text for kw in keywords):
            return brand
    return None
