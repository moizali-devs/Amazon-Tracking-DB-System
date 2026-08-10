"""
Tests for 03_aspects.py - aspect extraction and keyword matching.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import spacy
from aspect_helpers import ASPECT_KEYWORDS, extract_aspects, aspects_to_columns

nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])


# ── extract_aspects ───────────────────────────────────────────────────────────

def test_battery_mentioned_positive():
    doc = nlp("The battery life is great, lasts all day.")
    result = extract_aspects(doc, "positive")
    assert result["battery"] == "positive"

def test_battery_mentioned_negative():
    doc = nlp("Battery drains so fast, terrible.")
    result = extract_aspects(doc, "negative")
    assert result["battery"] == "negative"

def test_price_mentioned_positive():
    doc = nlp("Great value for money, totally worth it.")
    result = extract_aspects(doc, "positive")
    assert result["price"] == "positive"

def test_price_mentioned_negative():
    doc = nlp("Way too expensive for what you get.")
    result = extract_aspects(doc, "negative")
    assert result["price"] == "negative"

def test_screen_mentioned():
    doc = nlp("The screen protector fits perfectly on my display.")
    result = extract_aspects(doc, "positive")
    assert result["screen"] == "positive"

def test_delivery_mentioned():
    doc = nlp("Fast shipping, arrived in two days.")
    result = extract_aspects(doc, "positive")
    assert result["delivery"] == "positive"

def test_build_mentioned():
    doc = nlp("The build quality feels very sturdy and solid.")
    result = extract_aspects(doc, "positive")
    assert result["build"] == "positive"

def test_camera_mentioned():
    doc = nlp("Takes amazing photos, the camera is brilliant.")
    result = extract_aspects(doc, "positive")
    assert result["camera"] == "positive"

def test_unmentioned_aspect_is_none():
    doc = nlp("Great value for the price.")
    result = extract_aspects(doc, "positive")
    assert result["camera"] is None
    assert result["battery"] is None

def test_multiple_aspects_detected():
    doc = nlp("Great price and fast delivery, love the screen protector.")
    result = extract_aspects(doc, "positive")
    assert result["price"] == "positive"
    assert result["delivery"] == "positive"
    assert result["screen"] == "positive"

def test_all_aspects_present_in_result():
    doc = nlp("Some review text.")
    result = extract_aspects(doc, "neutral")
    assert set(result.keys()) == set(ASPECT_KEYWORDS.keys())


# ── aspects_to_columns ────────────────────────────────────────────────────────

def test_aspects_to_columns_none_becomes_empty_string():
    aspects = {"battery": None, "camera": "positive"}
    cols = aspects_to_columns(aspects)
    assert cols["aspect_battery"] == ""
    assert cols["aspect_camera"] == "positive"

def test_aspects_to_columns_keys_prefixed():
    aspects = {"price": "negative"}
    cols = aspects_to_columns(aspects)
    assert "aspect_price" in cols
