# PRD: Customer Sentiment Analysis Dashboard

**Project:** Amazon Product Review Sentiment Dashboard
**Type:** Portfolio Project
**Team:** Moiz Ali, Ayesha Aleem, Zainab Fatima
**Date:** May 2026

---

## Problem Statement

Online shoppers browsing Amazon are confronted with thousands of product reviews that are impossible to read in full. Star ratings provide only a surface-level summary and fail to communicate the specific reasons behind customer satisfaction or dissatisfaction. Buyers make uninformed purchase decisions, and sellers remain unaware of the precise pain points affecting their products. There is no readily accessible, visually rich tool that converts the raw volume of Amazon reviews into structured, actionable sentiment insights.

---

## Solution

A publicly accessible, static web dashboard that pre-processes a large Amazon Cell Phones & Accessories review dataset offline using NLP techniques (VADER, TextBlob, spaCy), serializes all results into a static JSON file, and serves them through a polished Next.js frontend deployed on Vercel. The dashboard allows users to explore sentiment breakdowns by product and brand, understand which specific product aspects drive positive or negative sentiment, track how sentiment changes over time, and compare competing products side by side — all without reading a single review.

---

## User Stories

### Browsing & Discovery

1. As a buyer, I want to see an overview of overall sentiment for any of the 18 tracked products, so that I can quickly assess whether a product is well-received.
2. As a buyer, I want to browse products organized by brand, so that I can explore options within a brand I already trust.
3. As a buyer, I want to see the total number of reviews analyzed for each product, so that I can judge the statistical confidence of the sentiment scores.
4. As a buyer, I want to see a star-rating distribution alongside sentiment scores, so that I can cross-reference NLP sentiment with traditional ratings.
5. As a buyer, I want to search or filter products by brand name, so that I can quickly find the product I am interested in.
6. As a buyer, I want the dashboard to load quickly without a backend, so that I am not waiting on server cold starts.

### Sentiment Overview

7. As a buyer, I want to see a donut or pie chart showing the positive/neutral/negative split for a product, so that I can grasp overall sentiment at a glance.
8. As a buyer, I want to see a headline sentiment score (e.g. 72% positive) displayed prominently on the product card, so that I can compare products without drilling in.
9. As a buyer, I want to see the most recent sentiment snapshot (last 3 months of reviews), so that I understand current opinion rather than historical averages only.

### Aspect-Level Feedback

10. As a buyer, I want to see which specific product aspects (battery, camera, price, build quality, delivery, screen) are praised or criticized, so that I can evaluate the product against my personal priorities.
11. As a buyer, I want to see each aspect represented as a sentiment percentage bar, so that I can instantly see relative strengths and weaknesses.
12. As a buyer, I want to see the top 3 most praised aspects and top 3 most criticized aspects highlighted, so that I get a quick summary without reading all aspect scores.
13. As a seller, I want to see which aspects have the lowest sentiment scores for my product category, so that I can identify the most impactful areas for product improvement.
14. As a seller, I want to see how aspect sentiment compares across competing brands, so that I can benchmark my product's weaknesses against the competition.

### Sentiment Over Time

15. As a buyer, I want to see a line chart of monthly sentiment scores over time for a product, so that I can detect whether opinion is improving or declining.
16. As a buyer, I want to see notable sentiment drops annotated or highlighted on the timeline, so that I can investigate what may have caused them.
17. As a researcher, I want to filter the time range of the sentiment trend chart, so that I can focus on a specific period.
18. As a researcher, I want to compare sentiment trends for two products on the same chart, so that I can see how their trajectories diverge over time.

### Product Comparison

19. As a buyer, I want to select 2 or 3 products and view their sentiment scores side by side, so that I can make a data-backed purchase decision.
20. As a buyer, I want to see a radar/spider chart comparing aspect scores across selected products, so that I can visually identify which product wins on which dimensions.
21. As a buyer, I want to compare products across different brands (e.g. Apple vs Samsung vs OnePlus), so that I can evaluate across price tiers.
22. As a buyer, I want to see a bar chart comparing overall positive sentiment percentage across my selected products, so that I have a single clear winner metric.
23. As a buyer, I want to reset my product comparison selection easily, so that I can start a new comparison without reloading the page.

### Design & UX

24. As a user, I want the dashboard to use a dark, professional aesthetic, so that it feels like a polished data product rather than a student project.
25. As a user, I want smooth transitions and subtle animations on charts, so that the experience feels modern and responsive.
26. As a user, I want the dashboard to be fully responsive on mobile and tablet, so that I can use it from any device.
27. As a user, I want clear section headings and navigation, so that I can jump between Overview, Aspects, Trends, and Comparison without confusion.
28. As a user, I want empty/loading states handled gracefully, so that the UI never looks broken.

### Pipeline & Data

29. As a developer, I want a reproducible Python pipeline script, so that the data.json file can be regenerated if the dataset or analysis logic changes.
30. As a developer, I want the pipeline to be runnable with a single command, so that onboarding is frictionless.
31. As a developer, I want the output data.json schema to be stable and documented, so that frontend components can consume it reliably.

---

## Implementation Decisions

### Repo Structure
- Monorepo with two top-level folders: `/pipeline` (Python) and `/app` (Next.js)
- `data.json` lives in `/app/public/data` or `/app/src/data` so it is bundled at build time
- A single `README.md` at root documents the full workflow end to end

### Data Pipeline (`/pipeline`)
- **Dataset:** McAuley Amazon Cell Phones & Accessories 5-core dataset (~1.5GB JSON)
- **Brands tracked:** Apple, Samsung, Google Pixel, OnePlus, Motorola, Nokia
- **Products per brand:** Top 3 by review count = 18 products total
- **Sentiment engine:** VADER as primary scorer, TextBlob for polarity/subjectivity as secondary
- **Aspect extraction:** spaCy noun/adjective co-occurrence around predefined aspect keywords (battery, camera, screen, price, build, delivery)
- **Output:** A single `data.json` containing per-product sentiment summaries, aspect scores, monthly sentiment timeseries, and review count metadata
- Pipeline is pure Python, runs offline, no API keys or GPU required
- Processing target: ~500k–1M reviews sampled from the full dataset

### Frontend (`/app`)
- **Framework:** Next.js 14 (App Router)
- **UI components:** shadcn/ui for layout primitives (cards, tabs, dropdowns, sidebar)
- **Charts:** Recharts for all visualizations (donut, bar, line, radar)
- **Styling:** Tailwind CSS, dark theme by default
- **Data loading:** `data.json` imported at build time via static generation — no runtime API calls
- **Routing:** Single-page feel with tab/section navigation; optional dynamic routes per product (`/product/[id]`)
- **Deployment:** Vercel, triggered on push to `main`

### Data Schema (conceptual)
- Each product entry contains: `id`, `brand`, `name`, `reviewCount`, `overallSentiment` (pos/neu/neg percentages), `aspectScores` (object keyed by aspect), `monthlySentiment` (array of `{month, positive, neutral, negative}`), `topPraisedAspects`, `topCriticizedAspects`

### Dashboard Sections
1. **Landing/Overview** — brand filter, product grid with sentiment headline cards
2. **Product Detail** — donut chart, aspect bar chart, top praised/criticized summary
3. **Sentiment Over Time** — line chart with time range selector
4. **Compare** — multi-product selector, radar chart, side-by-side bar chart

---

## Testing Decisions

### What makes a good test
- Test external behavior and outputs, not internal implementation details
- Tests should remain valid even if internal logic is refactored
- Pipeline tests should assert on output schema correctness and value ranges, not on specific algorithm internals

### Modules to test

**Python pipeline:**
- Sentiment scorer: given a known review text, assert the VADER compound score falls in the expected range and maps to the correct label
- Aspect extractor: given a review mentioning "battery life is great", assert "battery" is extracted with positive association
- Data aggregator: given a small fixture dataset, assert the output JSON matches the expected schema with correct field types and value constraints (percentages sum to 100, monthly array is sorted chronologically)

**Next.js frontend:**
- Data loading utility: given a mock `data.json`, assert products are correctly parsed and accessible by brand/id
- Comparison selector: assert that selecting more than 3 products is prevented, and deselection works correctly
- Chart data transformers: given a product's `monthlySentiment` array, assert the Recharts-compatible data structure is produced correctly

---

## Out of Scope

- Live or real-time review ingestion — data is static and pre-computed offline
- User authentication or personalized dashboards
- Seller-facing account management or product claiming
- Scraping Amazon directly — dataset is sourced from Kaggle/McAuley public data only
- Reviews outside the Cell Phones & Accessories category
- Products beyond the 18 selected (6 brands × 3 products)
- Multi-language review support — English only
- Advanced ML models (BERT, transformers) — VADER + TextBlob only
- A backend API or database — all data is bundled statically

---

## Further Notes

- The project doubles as an academic submission for Introduction to Data Science (May 2026) and a portfolio piece, so code quality, documentation, and visual polish are equally important
- The Python pipeline should be well-commented and readable as a demonstration of the NLP methodology
- The GitHub repository should include a `README.md` with a live demo link, dataset download instructions, and a one-command pipeline run guide
- Consider adding a "Methodology" section to the dashboard itself (a static page) explaining how sentiment is computed, which strengthens the academic credibility of the project
