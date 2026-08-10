export default function MethodologyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-8 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading font-black text-3xl text-foreground tracking-tight">
          Methodology
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          How we compute sentiment from Amazon product reviews
        </p>
      </div>

      <div className="space-y-12 text-sm leading-relaxed">

        <Section title="Dataset" step="01">
          <p className="text-foreground/75">
            The analysis is based on the{" "}
            <strong className="text-foreground">McAuley Amazon Cell Phones &amp; Accessories</strong>{" "}
            5-core dataset, a publicly available corpus compiled by Julian McAuley at UC San Diego.
            The 5-core variant retains only users and items with at least five reviews each,
            ensuring statistical reliability.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-card overflow-hidden">
            {[
              ["Source",   "McAuley Lab - Amazon Review Data (2018)"],
              ["Category", "Cell Phones & Accessories"],
              ["Scope",    "18 products across 6 brands (top 3 by review count per brand)"],
              ["Brands",   "Apple · Samsung · Google · OnePlus · Motorola · Nokia"],
              ["Reviews",  "~500k–1M sampled from the full dataset"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 px-4 py-2.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground w-20 shrink-0 text-xs pt-0.5">{label}</span>
                <span className="text-foreground/80 text-xs">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="VADER Sentiment Scoring" step="02">
          <p className="text-foreground/75">
            <strong className="text-foreground">VADER</strong> (Valence Aware Dictionary and sEntiment Reasoner)
            is the primary sentiment engine. Tuned for social media and informal text, it outputs a
            <em> compound score</em> in{" "}
            <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">[-1.0, +1.0]</code>.
          </p>
          <div className="mt-4 rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-white/3">
                  <Th>Label</Th>
                  <Th>Condition</Th>
                  <Th>Meaning</Th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <Td><span className="text-emerald-400 font-semibold">Positive</span></Td>
                  <Td><code className="text-accent/80 text-[11px]">compound ≥ 0.05</code></Td>
                  <Td className="text-muted-foreground">Clearly positive tone</Td>
                </tr>
                <tr className="border-b border-border/40">
                  <Td><span className="text-amber-400 font-semibold">Neutral</span></Td>
                  <Td><code className="text-accent/80 text-[11px]">-0.05 &lt; c &lt; 0.05</code></Td>
                  <Td className="text-muted-foreground">No strong signal</Td>
                </tr>
                <tr>
                  <Td><span className="text-rose-400 font-semibold">Negative</span></Td>
                  <Td><code className="text-accent/80 text-[11px]">compound ≤ -0.05</code></Td>
                  <Td className="text-muted-foreground">Clearly negative tone</Td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="TextBlob - Secondary Signal" step="03">
          <p className="text-foreground/75">
            <strong className="text-foreground">TextBlob</strong> provides two supplementary metrics that
            complement VADER&apos;s output:
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground text-xs mb-1">Polarity</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                A float in <code className="text-accent/80">[-1.0, +1.0]</code>. Used as a cross-check
                against the VADER compound score to flag inconsistencies.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground text-xs mb-1">Subjectivity</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                A float in <code className="text-accent/80">[0.0, 1.0]</code>. Reviews with very low
                subjectivity (e.g. shipping confirmations) are excluded from aspect scoring.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Aspect Extraction" step="04">
          <p className="text-foreground/75">
            Aspect-level sentiment is extracted using keyword co-occurrence powered by{" "}
            <strong className="text-foreground">spaCy</strong>&apos;s dependency parser. Six aspects are tracked:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Battery", "Camera", "Screen", "Price", "Build Quality", "Delivery"].map((a) => (
              <span
                key={a}
                className="text-xs px-3 py-1 rounded-full border border-accent/30 bg-accent/8 text-accent font-medium"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="mt-4 text-foreground/75">
            For each aspect, predefined seed keywords are matched against review tokens. spaCy&apos;s
            dependency graph is then walked to collect nearby adjectives and adverbs. VADER scores the
            extracted snippet, and results are aggregated into positive/neutral/negative percentages.
          </p>
        </Section>

        <Section title="Aggregation & Output" step="05">
          <p className="text-foreground/75">
            After per-review scoring, results are aggregated per product into three outputs:
          </p>
          <div className="mt-4 space-y-2">
            {[
              ["Overall sentiment",    "Positive/neutral/negative review counts as percentages of total."],
              ["Aspect scores",        "Per-aspect sentiment percentages plus mention count. Top 3 praised and criticized aspects ranked."],
              ["Monthly sentiment",    "Reviews bucketed by calendar month into a time-series used in the Trends section."],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <span className="text-accent mt-0.5 text-xs shrink-0">→</span>
                <div>
                  <p className="text-foreground font-semibold text-xs mb-0.5">{title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-foreground/60 text-xs">
            All results are serialised into a single{" "}
            <code className="text-accent/80">data.json</code> file and bundled statically - no runtime
            API calls are made.
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({
  title, step, children,
}: {
  title: string; step: string; children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[10px] font-mono text-accent/70 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
          {step}
        </span>
        <h2 className="font-heading font-bold text-base text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-muted-foreground text-[11px] font-medium">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 text-xs ${className}`}>{children}</td>;
}
