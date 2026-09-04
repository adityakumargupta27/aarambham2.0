# AARAMBHA design direction

## Three directions considered

### Theme Name: Paper Ledger
Very Brief Intro: A warm, editorial civic-intelligence system inspired by annotated public records, Indian paper archives, and the quiet confidence of an audit room. Deep indigo anchors the experience while saffron signals attention and action.
Probability: 0.07

### Theme Name: Quiet Observatory
Very Brief Intro: A light, atmospheric interface that treats public data like a constellation: sparse, calm, and precise, with subtle celestial lines and cool mineral tones. The mood is patient discovery rather than urgency.
Probability: 0.04

### Theme Name: Saffron Signal
Very Brief Intro: A sharper, higher-contrast direction built around signal colors, field-notes, and rapid anomaly scanning. More operational and energetic, with a stronger emphasis on live alert moments.
Probability: 0.08

## Chosen direction: Paper Ledger

### Design Movement
Editorial modernism with civic-documentary cues: archival paper, marginal notes, restrained cartographic linework, and a contemporary data-product sensibility.

### Core Principles
1. **Evidence before spectacle.** Every visual cue should imply traceability, not hype.
2. **Quiet authority.** Use confident spacing, grounded color, and typographic contrast rather than noisy gradients or dashboard chrome.
3. **Human-scale complexity.** Break a national-scale problem into legible cards, field notes, and named workflows.
4. **Attention has a color.** Reserve saffron for risk, action, and the moments that need a decision.

### Color Philosophy
The page sits on a warm, almost unbleached paper background so the product feels rooted in real public records instead of synthetic software space. Ink blue-black is the voice of governance and trust. A deep indigo is the platform’s ownable signature: precise, intelligent, and unmistakably digital. Saffron is used sparingly as a signal color for attention and movement; muted terracotta and sage provide human warmth without becoming decorative.

### Layout Paradigm
Use an asymmetric editorial composition: the hero begins with a left-aligned statement and a right-side intelligence panel; later sections alternate between wide narratives and narrow margin notes. Avoid a centered stack of interchangeable cards. Let the page breathe with offset columns, ruled dividers, and a few intentionally oversized numbers.

### Signature Elements
- A fine-grain paper texture with hairline rules and small coordinate/date labels.
- Saffron annotation bars and underlines that behave like editorial marks.
- Indigo data ribbons and evidence chips that connect text to action.

### Interaction Philosophy
Interactions should feel like examining a record: a cursor reveals a little more evidence, cards lift by a few pixels, and links underline with a deliberate ink stroke. Use small transitions and state changes, never ornamental motion. Buttons should feel decisive; links should feel investigatory.

### Animation
On load, reveal the wordmark, hero statement, and right-side intelligence panel in a staggered 40–60ms rhythm. Animate only opacity and transform. Let the small signal line in the hero gently travel once, then rest. On hover, raise cards by 3px and shift borders from paper gray to indigo. Respect reduced-motion preferences.

### Typography System
Display: **Fraunces** for high-contrast editorial headlines and large numerals. Body/UI: **DM Sans** for legibility, compact labels, and data annotations. Use Fraunces for only the highest-level statements; use DM Sans with strong weight changes for controls, labels, and explanatory copy. Uppercase labels are small and letter-spaced.

### Brand Essence
AARAMBHA is an evidence-led intelligence layer for people responsible for the public purse, built to turn fragmented MPLADS records into earlier, clearer decisions.
Personality adjectives: **watchful, grounded, lucid**.

### Brand Voice
Headlines are clear, concise, and slightly editorial. CTAs sound like a next action, not a sales pitch. Microcopy names what is known, what is inferred, and what needs attention.

Example lines:
- “See the signal before it becomes a finding.”
- “Trace every allocation from sanction to asset.”

### Wordmark & Logo
The mark is a compact indigo monogram built from three offset ledger lines forming an upward-facing aperture: a visual metaphor for opening a record and seeing what is underneath. The wordmark uses a refined serif for “AARAMBHA” paired with a small mono-style descriptor for “MPLADS INTELLIGENCE”.

### Signature Brand Color
**AARAMBHA Indigo — #273B73**. It is darker and more archival than standard product blue, giving the platform an ownable sense of institutional memory and analytical clarity.

## Landing-page content decisions

The page will remain a single responsive landing page with a compact top navigation, no sidebar, and no fabricated government affiliation. Illustrative metrics will be explicitly labelled as platform coverage examples rather than official claims. The content hierarchy will be:

1. Hero: value proposition, supporting statement, primary and secondary actions, and an illustrative live intelligence panel.
2. Proof strip: monitored constituencies, projects analysed, procurement value tracked, and high-priority reviews identified, all marked as coverage examples.
3. Capability narrative: fund monitoring, project-to-contract intelligence, AI risk detection, investigator workflows, and investigation centre.
4. How it works: ingest, connect, detect, investigate, act.
5. AI Investigator: sample natural-language questions with evidence-led answer states.
6. Risk intelligence: anomaly categories and a compact risk ladder.
7. Data transparency: source coverage, freshness, reliability, and methodology cues.
8. Final CTA: explore intelligence and read the methodology.

## Implementation reminders

- Keep this style reminder at the top of every CSS, component, and page file: Paper Ledger editorial modernism; warm paper, ink blue-black, AARAMBHA indigo, sparse saffron annotation; asymmetrical layouts; evidence-led voice.
- Do not present illustrative numbers as government statistics.
- Keep CTAs visually obvious but not salesy.
- Avoid purple gradients, generic dashboard framing, excessive pills, and default Inter typography.
