/*
 * Style reminder: Paper Ledger editorial modernism; warm paper, ink blue-black,
 * AARAMBHA indigo, sparse saffron annotation; asymmetrical layouts; evidence-led voice.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  ChevronRight,
  Database,
  FileCheck2,
  GitBranch,
  Landmark,
  Layers3,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const heroImage = "/assets/aarambha-hero.webp";

const navItems = [
  ["Platform", "#platform"],
  ["Intelligence engine", "#engine"],
  ["Data coverage", "#coverage"],
  ["How it works", "#how-it-works"],
  ["Impact", "#impact"],
];

const capabilities = [
  {
    number: "01",
    icon: Landmark,
    title: "MPLADS fund monitoring",
    copy: "Follow allocations, carried-forward balances, spending patterns, and high-value works across constituencies.",
    tags: ["MP + constituency", "Fund status", "Searchable"],
    tone: "indigo",
    href: "/mps",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "Project-to-contract intelligence",
    copy: "Connect sanctions to tenders, contractors, values, timelines, and execution status in one traceable record.",
    tags: ["Tender trail", "Contractors", "Execution"],
    tone: "paper",
    href: "/projects",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "AI risk detection",
    copy: "Surface price anomalies, duplicate works, bid irregularities, delays, and financial-versus-physical gaps.",
    tags: ["Normal", "Watch", "Review", "High priority"],
    tone: "saffron",
    href: "/risk",
  },
  {
    number: "04",
    icon: FileCheck2,
    title: "Investigation centre",
    copy: "Create cases, link evidence, record notes, and move from signal to an accountable next action.",
    tags: ["Cases", "Evidence", "Reports"],
    tone: "sage",
    href: "/investigations",
  },
];

const steps = [
  ["01", "Ingest data", "Bring together MPLADS, procurement, tender, contract, and public-record sources."],
  ["02", "Connect entities", "Resolve the relationships between MPs, constituencies, works, vendors, and payments."],
  ["03", "Detect risk", "Score anomalies against patterns, norms, timelines, and comparable works."],
  ["04", "Investigate evidence", "Ask the AI investigator for linked context, not unsupported conclusions."],
  ["05", "Take action", "Escalate, review, report, or monitor with a clear audit trail."],
];

const anomalyRows = [
  ["Cost signal", "Unit cost outside comparable range", "Review"],
  ["Timeline signal", "Physical progress lags sanctioned schedule", "Watch"],
  ["Entity signal", "Repeated awards across connected records", "Review"],
  ["Document signal", "Mismatch between tender and payment trail", "High priority"],
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return <span className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-hidden="true"><span className="brand-mark-line mark-line-a" /><span className="brand-mark-line mark-line-b" /><span className="brand-mark-line mark-line-c" /><span className="brand-mark-notch" /></span>;
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`section-label ${dark ? "section-label-dark" : ""}`}>
      <span className="label-rule" />
      <span>{children}</span>
    </div>
  );
}

function ArrowLink({ children, href = "#platform", dark = false }: { children: React.ReactNode; href?: string; dark?: boolean }) {
  return (
    <a className={`arrow-link ${dark ? "arrow-link-dark" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.8} />
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealNodes.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${Math.min(index * 35, 210)}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="AARAMBHA home">
          <BrandMark />
          <span className="brand-wordmark">
            <strong>AARAMBHA</strong>
            <small>MPLADS intelligence</small>
          </span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? "mobile-nav-open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <Link className="nav-cta" href="/overview" onClick={() => setMenuOpen(false)}>
            Explore platform <ArrowUpRight size={14} />
          </Link>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-art" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Public fund intelligence / India</div>
            <h1>See the signal before it becomes a finding.</h1>
            <p className="hero-lead">AARAMBHA brings MPLADS allocations, projects, tenders, contracts, and execution evidence into one intelligent oversight layer.</p>
            <div className="hero-actions">
              <Link href="/overview" className="button button-saffron">Explore platform <ArrowUpRight size={16} /></Link>
              <a href="#how-it-works" className="text-action text-action-light">How it works <ArrowRight size={16} /></a>
            </div>
            <div className="hero-note"><span className="note-line" /> Evidence-led. Auditable. Built for earlier decisions.</div>
          </div>
        </div>
        <div className="hero-rail container"><span>01</span><span className="rail-line" /><span>Oversight, with context.</span><span className="rail-end">Scroll to explore <ChevronRight size={14} /></span></div>
      </section>

      <section className="proof-strip reveal-on-scroll" aria-label="Illustrative platform coverage">
        <div className="container proof-grid">
          <div className="proof-intro"><span className="proof-mark">A</span><p>One platform for the questions behind public spending.</p></div>
          <div className="proof-stat"><span className="stat-value">543</span><span className="stat-label">constituencies<br />mapped*</span></div>
          <div className="proof-stat"><span className="stat-value">18.7k</span><span className="stat-label">project records<br />analysed*</span></div>
          <div className="proof-stat"><span className="stat-value">₹2.4T</span><span className="stat-label">procurement value<br />tracked*</span></div>
          <div className="proof-stat"><span className="stat-value">4×</span><span className="stat-label">risk views<br />to act faster*</span></div>
        </div>
        <div className="container proof-footnote">* Illustrative coverage examples for product demonstration. Not official government statistics.</div>
      </section>

      <section className="section section-platform reveal-on-scroll" id="platform">
        <div className="container">
          <div className="section-intro split-intro">
            <div><SectionLabel>01 / The platform</SectionLabel><h2>From fragmented records to a readable trail.</h2></div>
            <p>Public-fund oversight becomes more useful when every allocation can be followed across the full life of a work — from approval to payment to asset.</p>
          </div>
          <div className="capability-grid">
            <article className="capability-card capability-feature reveal-on-scroll">
              <div className="capability-top"><span className="card-index">00 / overview</span><span className="card-icon"><Layers3 size={18} /></span></div>
              <div className="feature-card-body"><div><h3>Read the full context, not just the number.</h3><p>See how funds move across people, places, contracts, and time. AARAMBHA turns raw administrative records into a connected view that makes anomalies easier to question and decisions easier to defend.</p></div><ArrowLink href="/overview">Explore the intelligence engine</ArrowLink></div>
              <div className="ledger-visual" role="img" aria-label="Abstract record trail from sanction to community asset"><div className="ledger-exhibit"><span className="ledger-sheet ledger-sheet-back" /><span className="ledger-sheet ledger-sheet-front" /><span className="ledger-route route-one" /><span className="ledger-route route-two" /><span className="ledger-node node-one" /><span className="ledger-node node-two" /><span className="ledger-node node-three" /><span className="ledger-asset" /></div><span className="visual-stamp">Trace / 001</span></div>
            </article>
            {capabilities.map((item) => {
              const Icon = item.icon;
              return <article key={item.number} className={`capability-card capability-${item.tone} reveal-on-scroll`}><div className="capability-top"><span className="card-index">{item.number} / capability</span><span className="card-icon"><Icon size={18} /></span></div><h3>{item.title}</h3><p>{item.copy}</p><div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={item.href} className="card-arrow" aria-label={`Open ${item.title}`}><ArrowUpRight size={16} /></Link></article>;
            })}
          </div>
        </div>
      </section>

      <section className="section engine-section reveal-on-scroll" id="engine">
        <div className="container engine-grid">
          <div className="engine-image-wrap"><div className="evidence-exhibit" role="img" aria-label="Abstract linked evidence board with a highlighted anomaly"><div className="exhibit-topline"><span>Evidence register / 04—17</span><span>Linked records</span></div><div className="evidence-board"><span className="board-line line-a" /><span className="board-line line-b" /><span className="board-line line-c" /><span className="board-node board-node-a" /><span className="board-node board-node-b" /><span className="board-node board-node-c" /><span className="board-node board-node-d" /><span className="board-focus"><span>risk</span></span></div><div className="exhibit-side-note">Contractor / 014<br />Tender / 007<br />Payment / 022</div></div><div className="image-caption"><span>Evidence view</span><span>Linked / contextual / explainable</span></div></div>
          <div className="engine-copy"><SectionLabel dark>02 / Intelligence engine</SectionLabel><h2>Ask a sharper question.<br /><em>Get the evidence trail.</em></h2><p>AARAMBHA’s AI Investigator helps users interrogate a project, contractor, tender, or risk case in plain language — then points back to the records that support the answer.</p><div className="question-stack"><Link href="/ai-investigator?q=Why was this contract flagged?" className="question-bubble"><Search size={15} /><span>Why was this contract flagged?</span><ArrowUpRight size={14} /></Link><Link href="/ai-investigator?q=Which evidence supports this risk score?" className="question-bubble"><Search size={15} /><span>Which evidence supports this risk score?</span><ArrowUpRight size={14} /></Link><Link href="/ai-investigator?q=Show projects with high carried-forward funds." className="question-bubble"><Search size={15} /><span>Show projects with high carried-forward funds.</span><ArrowUpRight size={14} /></Link></div><div className="engine-quote"><Bot size={18} /><span>Answers should be explainable enough to act on — and clear enough to challenge.</span></div></div>
        </div>
      </section>

      <section className="section process-section reveal-on-scroll" id="how-it-works">
        <div className="container">
          <div className="process-heading"><div><SectionLabel>03 / Method</SectionLabel><h2>Five moves from data to decision.</h2></div><p>Designed for the people who need to see what changed, what matters, and what happens next.</p></div>
          <div className="steps-row">{steps.map(([num, title, copy], index) => <div className="step-item reveal-on-scroll" key={num}><div className="step-number">{num}</div><div className="step-line"><span style={{ width: index === steps.length - 1 ? "0%" : "100%" }} /></div><h3>{title}</h3><p>{copy}</p></div>)}</div>
        </div>
      </section>

      <section className="section risk-section reveal-on-scroll" id="impact">
        <div className="container risk-grid">
          <div className="risk-copy"><SectionLabel>04 / Risk intelligence</SectionLabel><h2>Prioritise the records that deserve a closer look.</h2><p>Risk scores are not verdicts. They are a practical way to bring unusual patterns to the surface, show why they matter, and direct attention where human review can make the difference.</p><div className="risk-ladder"><div><span className="ladder-dot dot-normal" /><span>Normal</span><small>Pattern within range</small></div><div><span className="ladder-dot dot-watch" /><span>Watch</span><small>Worth monitoring</small></div><div><span className="ladder-dot dot-review" /><span>Review</span><small>Evidence to examine</small></div><div><span className="ladder-dot dot-high" /><span>High priority</span><small>Escalate with context</small></div></div></div>
          <div className="risk-visual"><div className="signal-exhibit" role="img" aria-label="Abstract field of risk signals and contractor networks"><span className="signal-grid" /><span className="signal-cluster cluster-a" /><span className="signal-cluster cluster-b" /><span className="signal-cluster cluster-c" /><span className="signal-cluster cluster-d" /><span className="signal-route signal-route-a" /><span className="signal-route signal-route-b" /><span className="signal-route signal-route-c" /></div><div className="signal-annotation annotation-top"><span /> Cost anomalies / 08</div><div className="signal-annotation annotation-bottom"><span /> Contractor network / 14</div></div>
        </div>
        <div className="container anomaly-table-wrap"><div className="table-header"><span>Illustrative signals</span><span>Explainable by design <BadgeCheck size={14} /></span></div>{anomalyRows.map(([type, description, status]) => <Link href="/risk" className="anomaly-row" key={type}><span className="anomaly-type">{type}</span><span className="anomaly-description">{description}</span><span className={`risk-badge risk-${status.toLowerCase().replace(" ", "-")}`}>{status}</span><ArrowUpRight size={15} /></Link>)}</div>
      </section>

      <section className="section coverage-section reveal-on-scroll" id="coverage">
        <div className="container coverage-grid"><div><SectionLabel>05 / Data transparency</SectionLabel><h2>Trust is built into the way the data is shown.</h2><p>Every insight is grounded in a visible source trail. AARAMBHA makes freshness, reliability, and methodology part of the experience — so users can understand both the finding and its limits.</p><ArrowLink href="/methodology">Read the methodology</ArrowLink></div><div className="coverage-card"><div className="coverage-card-head"><BrandMark compact /><Database size={18} /><span>Source register</span><span className="coverage-status"><span /> Current view</span></div><div className="source-row"><span className="source-icon"><Landmark size={15} /></span><span><b>MPLADS records</b><small>Allocations / works / sanctions</small></span><strong>Verified</strong></div><div className="source-row"><span className="source-icon"><GitBranch size={15} /></span><span><b>Procurement records</b><small>Tenders / awards / contracts</small></span><strong>Linked</strong></div><div className="source-row"><span className="source-icon"><Activity size={15} /></span><span><b>Execution signals</b><small>Progress / payment / completion</small></span><strong>Tracked</strong></div><div className="coverage-card-foot"><span>Last updated / illustrative</span><span>Methodology v0.9 <ArrowUpRight size={13} /></span></div></div></div>
      </section>

      <section className="section explore-section reveal-on-scroll" id="explore">
        <div className="container explore-inner"><div className="explore-mark"><BrandMark compact /></div><div><SectionLabel dark>06 / Next move</SectionLabel><h2>Make public data easier to question — and easier to trust.</h2><p>Explore how AARAMBHA can help your team move from raw records to earlier, evidence-backed oversight.</p></div><div className="explore-actions"><Link href="/overview" className="button button-paper">Explore the platform <ArrowUpRight size={16} /></Link><Link href="/methodology" className="text-action text-action-light">View data coverage <ArrowRight size={16} /></Link></div></div>
      </section>

      <footer className="site-footer"><div className="container footer-main"><a className="brand-lockup" href="#top"><BrandMark /><span className="brand-wordmark"><strong>AARAMBHA</strong><small>MPLADS intelligence</small></span></a><p>Evidence-led monitoring for public works, procurement, and the people responsible for both.</p><div className="footer-links"><Link href="/overview">Platform</Link><Link href="/ai-investigator">Intelligence engine</Link><Link href="/methodology">Data coverage</Link><Link href="/reports">Reports</Link></div></div><div className="container footer-bottom"><span>© 2026 AARAMBHA / Concept product for civic intelligence.</span><span>No government affiliation claimed.</span></div></footer>
    </main>
  );
}
