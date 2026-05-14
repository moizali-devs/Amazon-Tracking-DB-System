# Pipeline

This folder contains the Python data pipeline that processes the raw Amazon reviews dataset and produces `app/data/data.json` consumed by the Next.js frontend.

## Setup

```bash
cd pipeline
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

## Dataset

Download the McAuley Amazon Cell Phones & Accessories 5-core dataset:

1. Go to: https://cseweb.ucsd.edu/~jmcauley/datasets/amazon_v2/
2. Download: `Cell_Phones_and_Accessories_5.json.gz`
3. Place the file at: `pipeline/data/raw/Cell_Phones_and_Accessories_5.json.gz`

## Running the pipeline

Run all steps in order:

```bash
python 01_filter_data.py
python 02_sentiment.py
python 03_aspects.py
python 04_aggregate.py
```

Each script reads the output of the previous step. The final output is written to `../app/data/data.json`.

## Running tests

```bash
pytest
```
