import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { DATA_SOURCES_INFO } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Database,
  ExternalLink,
  HelpCircle,
  Scale,
  ShieldCheck
} from "lucide-react";

export default function DataSources() {
  return (
    <PlatformLayout
      moduleNumber="11"
      moduleName="Data Sources & Methodology"
      subTitle="Statutory Registers, Composite Scoring Formula & Governance Limits"
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Transparency & Governance Integrity</div>
        <h1>Data Ingestion Registry & Composite Risk Methodology</h1>
        <p>
          Every answer identifies its evidence state. The imported Lok Sabha allocation register is source-attributed;
          procurement, payment, and corporate connectors remain illustrative until live records are ingested.
        </p>
      </div>

      {/* Primary Ingestion Sources */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Official Data Ingestion Pipelines</h3>
            <small style={{ color: "var(--ink-muted)" }}>Cross-referenced statutory and administrative repositories</small>
          </div>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {DATA_SOURCES_INFO.map((src, idx) => (
            <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Database size={16} color="var(--indigo)" />
                    <strong style={{ fontSize: "15px" }}>{src.name}</strong>
                  </div>
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "11px", color: "var(--indigo)", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "2px" }}
                  >
                    <span>{src.sourceUrl}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <span className="risk-pill risk-pill-normal">
                    {src.reliability}
                  </span>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: "var(--paper-deep)", border: "1px solid var(--line)", borderRadius: "2px" }}>
                    {src.updateFrequency}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "var(--ink)", marginBottom: "6px" }}>
                <strong>Coverage: </strong> {src.coverage}
              </div>

              <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>
                <strong>Methodology: </strong> {src.methodology}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Calculation Methodology Box */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Composite Risk Score (0–100) Formulation</h3>
            <small style={{ color: "var(--ink-muted)" }}>Multi-factor econometric and procedural weighting</small>
          </div>
        </div>

        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "3px", marginBottom: "18px", fontSize: "13px", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            AARAMBHA calculates a deterministic, normalized composite risk score S ∈ [0, 100] using five weighted vectors. Missing inputs are excluded and the remaining weights are re-normalized.
          </p>
          <div style={{ background: "var(--paper-light)", border: "1px solid var(--line)", padding: "12px 16px", margin: "12px 0", fontFamily: "monospace", fontSize: "12px" }}>
            Score = normalized weighted sum of Price (30%), Progress (25%), Bid (20%), Contractor (15%), and Document (10%) signals
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li><strong>Price Variance (30% base weight):</strong> Unit-rate deviation above the supplied DSR or GeM benchmark.</li>
            <li><strong>Bid Pattern (20% base weight):</strong> A mathematical screening signal based on bidder count and L1/L2 spread; not proof of coordination.</li>
            <li><strong>Execution Gap (25% base weight):</strong> Difference between supplied financial and physical progress.</li>
            <li><strong>Contractor History (15%) and document mismatch (10%):</strong> Assessed only when the corresponding evidence is supplied.</li>
          </ul>
        </div>

        {/* Score Thresholds */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div style={{ background: "rgba(112,139,120,0.1)", border: "1px solid rgba(112,139,120,0.3)", padding: "12px" }}>
            <strong style={{ color: "var(--sage)" }}>0–39: Normal</strong>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>Pattern within statistical benchmark</div>
          </div>
          <div style={{ background: "rgba(216,138,53,0.1)", border: "1px solid rgba(216,138,53,0.3)", padding: "12px" }}>
            <strong style={{ color: "var(--saffron)" }}>40–59: Watch</strong>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>Minor timeline or spread variances</div>
          </div>
          <div style={{ background: "rgba(227,161,87,0.15)", border: "1px solid rgba(227,161,87,0.4)", padding: "12px" }}>
            <strong style={{ color: "var(--saffron)" }}>60–79: Review</strong>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>Requires technical on-site check</div>
          </div>
          <div style={{ background: "rgba(169,87,68,0.12)", border: "1px solid rgba(169,87,68,0.4)", padding: "12px" }}>
            <strong style={{ color: "var(--terracotta)" }}>80–100: High Priority</strong>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>Escalate for vigilance audit</div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimers */}
      <div className="ledger-card" style={{ background: "rgba(233,225,213,0.4)", marginBottom: 0 }}>
        <h4 style={{ margin: "0 0 8px", fontFamily: "Fraunces, serif", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={16} /> Statutory & Governance Disclaimer
        </h4>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--ink)", lineHeight: 1.6 }}>
          AARAMBHA is an independent analytical civic technology platform developed for demonstration and public accountability research.
          Risk scores and anomaly flags are mathematical indicators intended to assist human auditors in prioritizing case reviews.
          They do not constitute legal determinations, criminal allegations, or judicial findings. Official administrative action
          must be grounded in statutory inquiries conducted under the General Financial Rules (GFR) 2017 and Central Vigilance Commission guidelines.
        </p>
      </div>
    </PlatformLayout>
  );
}
