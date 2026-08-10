"""
Tests for 01_filter_data.py - brand detection and product selection logic.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from filter_data_helpers import detect_brand, BRANDS


# ── detect_brand ──────────────────────────────────────────────────────────────

def test_detects_apple_from_iphone_title():
    assert detect_brand("Apple iPhone 13 Pro Max", "") == "Apple"

def test_detects_samsung_from_galaxy_title():
    assert detect_brand("Samsung Galaxy S21 Ultra", "") == "Samsung"

def test_detects_google_from_pixel_title():
    assert detect_brand("Google Pixel 6 Pro", "") == "Google"

def test_detects_oneplus_from_title():
    assert detect_brand("OnePlus 9 Pro 5G", "") == "OnePlus"

def test_detects_motorola_from_moto_g_title():
    assert detect_brand("Motorola Moto G Power", "") == "Motorola"

def test_detects_nokia_from_title():
    assert detect_brand("Nokia 3.4 Smartphone", "") == "Nokia"

def test_detects_brand_from_brand_field_fallback():
    assert detect_brand("Galaxy S21 5G Unlocked", "Samsung") == "Samsung"

def test_returns_none_for_unknown_brand():
    assert detect_brand("Generic Phone Case", "") is None

def test_case_insensitive():
    assert detect_brand("APPLE IPHONE 14", "") == "Apple"

def test_all_brands_listed():
    assert len(BRANDS) > 0
    assert "Apple" in BRANDS
    assert "Samsung" in BRANDS
