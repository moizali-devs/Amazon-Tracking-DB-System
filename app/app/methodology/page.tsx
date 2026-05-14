export default function MethodologyPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Methodology</h1>
        <p className="text-sm text-muted-foreground mt-1">
          How sentiment is computed from Amazon product reviews
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">

        {/* Dataset */}
        <Section title="Dataset" step="01">
          <p className="text-foreground/80">
            The analysis is based on the{" "}
            <strong className="text-foreground">
              McAuley Amazon Cell Phones &amp; Accessories
            </strong>{" "}
            5-core dataset, a publicly available corpus of Amazon product reviews compiled by
            Julian McAuley at UC San Diego. The 5-core variant retains only users and items
            with at least five reviews each, ensuring statistical reliability.
          </p>
          <ul className="mt-3 space-y-1.5 text-foreground/70 list-none">
            <StatRow label="Source"   value="McAuley Lab — Amazon Review Data (2018)" />
            <StatRow label="Category" value="Cell Phones & Accessories" />
            <StatRow label="Scope"    value="18 products across 6 brands (top 3 by review count per brand)" />
            <StatRow label="Brands"   value="Apple · Samsung · Google · OnePlus · Motorola · Nokia" />
            <StatRow label="Reviews"  value="~500k–1M sampled from the full dataset" />
          </ul>
        </Section>

        <Divider />

        {/* VADER */}
        <Section title="VADER Sentiment Scoring" step="02">
          <p className="text-foreground/80">
            <strong className="text-foreground">VADER</strong> (Valence Aware Dictionary and
            sEntiment Reasoner) is the primary sentiment engine. It is a lexicon- and
            rule-based model specifically tuned for social media and short informal text, making
            it well-suited to consumer product reviews.
          </p>
          <p className="mt-3 text-foreground/80">
            VADER outputs a <em>compound score</em> in the range{" "}
            <code className="text-indigo-300 bg-white/5 px-1 rounded">[-1.0, +1.0]</code>.
            Each review is classified using the following thresholds:
          </p>
          <div className="mt-4 rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-white/3">
                  <Th>Label</Th>
                  <Th>Condition</Th>
                  <Th>Interpretation</Th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <Td><span className="text-emerald-400 font-medium">Positive</span></Td>
                  <Td><code className="text-indigo-300">compound ≥ 0.05</code></Td>
                  <Td className="text-foreground/60">Clearly positive tone</Td>
                </tr>
                <tr className="border-b border-border/50">
                  <Td><span className="text-amber-400 font-medium">Neutral</span></Td>
                  <Td><code className="text-indigo-300">-0.05 &lt; compound &lt; 0.05</code></Td>
                  <Td className="text-foreground/60">No strong sentiment signal</Td>
                </tr>
                <tr>
                  <Td><span className="text-rose-400 font-medium">Negative</span></Td>
                  <Td><code className="text-indigo-300">compound ≤ -0.05</code></Td>
                  <Td className="text-foreground/60">Clearly negative tone</Td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-foreground/60 text-xs">
            Thresholds follow VADER's original paper recommendations (Hutto &amp; Gilbert, 2014).
          </p>
        </Section>

        <Divider />

        {/* TextBlob */}
        <Section title="TextBlob — Secondary Signal" step="03">
          <p className="text-foreground/80">
            <strong className="text-foreground">TextBlob</strong> provides two supplementary
            metrics that complement VADER's label-based output:
          </p>
          <ul className="mt-3 space-y-3">
            <li>
              <p className="font-medium text-foreground">Polarity</p>
              <p className="text-foreground/70 mt-0.5">
                A float in{" "}
                <code className="text-indigo-300 bg-white/5 px-1 rounded">[-1.0, +1.0]</code>{" "}
                indicating how positive or negative the text is. Used as a cross-check against
                the VADER compound score to flag inconsistencies.
              </p>
            </li>
            <li>
              <p className="font-medium text-foreground">Subjectivity</p>
              <p className="text-foreground/70 mt-0.5">
                A float in{" "}
                <code className="text-indigo-300 bg-white/5 px-1 rounded">[0.0, 1.0]</code>{" "}
                where 0 is fully objective and 1 is fully subjective. Reviews with very low
                subjectivity (e.g. shipping confirmations, serial numbers) are flagged for
                exclusion from aspect scoring.
              </p>
            </li>
          </ul>
        </Section>

        <Divider />

        {/* Aspect extraction */}
        <Section title="Aspect Extraction" step="04">
          <p className="text-foreground/80">
            Aspect-level sentiment is extracted using a keyword co-occurrence approach powered
            by <strong className="text-foreground">spaCy</strong>'s dependency parser. Six
            product aspects are tracked:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Battery", "Camera", "Screen", "Price", "Build Quality", "Delivery"].map((a) => (
              <span
                key={a}
                className="text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-indigo-300"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="mt-4 text-foreground/80">
            For each aspect, a predefined set of seed keywords is matched against review tokens
            (e.g. <em>"battery", "charge", "charging", "mAh"</em> for Battery). When a keyword
            is found, spaCy's dependency graph is walked to collect nearby adjectives and adverbs
            within the same sentence. VADER then scores the extracted snippet, and the result
            is aggregated into the aspect's positive/neutral/negative percentages.
          </p>
          <p className="mt-3 text-foreground/70">
            Only aspects with at least one mention are included in the dashboard; aspects with
            zero keyword hits are hidden rather than shown as 0%.
          </p>
        </Section>

        <Divider />

        {/* Aggregation */}
        <Section title="Aggregation & Output" step="05">
          <p className="text-foreground/80">
            After per-review scoring, results are aggregated per product:
          </p>
          <ul className="mt-3 space-y-2 text-foreground/70">
            <li className="flex gap-2">
              <span className="text-indigo-400 mt-0.5">→</span>
              <span>
                <strong className="text-foreground">Overall sentiment</strong> — counts of
                positive/neutral/negative reviews expressed as percentages of total review
                count.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 mt-0.5">→</span>
              <span>
                <strong className="text-foreground">Aspect scores</strong> — per-aspect
                sentiment percentages plus mention count; top 3 praised and top 3 criticized
                aspects are ranked by positive % descending / ascending respectively.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 mt-0.5">→</span>
              <span>
                <strong className="text-foreground">Monthly sentiment</strong> — reviews are
                bucketed by their Unix timestamp into calendar months
                (<code className="text-indigo-300 bg-white/5 px-1 rounded">YYYY-MM</code>)
                and aggregated independently, producing the time-series used in the Trends
                section.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-foreground/70">
            All results are serialised into a single{" "}
            <code className="text-indigo-300 bg-white/5 px-1 rounded">data.json</code> file
            at pipeline run time and bundled statically into the Next.js build — no runtime
            API calls are made.
          </p>
        </Section>

      </div>
    </div>
  );
}

/* ── Local helpers ─────────────────────────────────────────────────── */

function Section({
  title,
  step,
  children,
}: {
  title: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono text-indigo-400/70 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          {step}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="border-border" />;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex gap-2">
      <span className="text-foreground/40 w-20 shrink-0">{label}</span>
      <span>{value}</span>
    </li>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left text-muted-foreground font-medium">{children}</th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-2.5 ${className}`}>{children}</td>;
}
