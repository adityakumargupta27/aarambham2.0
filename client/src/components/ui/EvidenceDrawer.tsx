import { useState } from "react";
import { useEvidence } from "@/contexts/EvidenceContext";
import { ProvenanceBadge } from "./ProvenanceBadge";
import {
  Calculator,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Info,
  Scale,
  ShieldAlert,
  X
} from "lucide-react";

export function EvidenceDrawer() {
  const { isOpen, activeData, closeDrawer } = useEvidence();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeData) return null;

  const handleExportBrief = () => {
    const lines = [
      `# AARAMBHA CIVIC AUDIT & EVIDENCE BRIEF`,
      `Document Reference: BRIEF-${activeData.recordId}-${new Date().toISOString().slice(0, 10)}`,
      `Date Generated: ${new Date().toLocaleString("en-IN")}`,
      `Security Class: Analytical Decision-Support Output (Human Verification Required)`,
      `--------------------------------------------------------------------------------`,
      ``,
      `## 1. TARGET ENTITY RECORD`,
      `- Entity Type: ${activeData.entityType}`,
      `- Record Identifier: ${activeData.recordId}`,
      `- Title / Name: ${activeData.title}`,
      `- Primary Data Source: ${activeData.sourceName} (${activeData.sourceUrl})`,
      `- Verification Timestamp: ${activeData.verifiedAt}`,
      `- Overall Provenance: ${activeData.provenance}`,
      ``,
      `## 2. STATED EVIDENCE FIELDS`,
      ...activeData.fields.map(
        f => `- ${f.name}: ${f.value} [Provenance: ${f.provenance}${f.source ? ` | Source: ${f.source}` : ""}]`
      ),
      ``
    ];

    if (activeData.riskCalculation) {
      const calc = activeData.riskCalculation;
      lines.push(
        `## 3. DETERMINISTIC RISK CALCULATION BREAKDOWN`,
        `- Composite Risk Score: ${calc.compositeScore}/100 (${calc.riskLevel.toUpperCase()})`,
        `- Confidence Level: ${calc.confidence.toUpperCase()} (Assessed Weight: ${(calc.assessedWeightRatio * 100).toFixed(0)}%)`,
        `- Recommendation: ${calc.recommendation}`,
        ``,
        `### Formula Components (Normalized 0–100 & Rescaled):`,
        ...calc.components.map(c => 
          `  * ${c.name}: Normalized Score = ${c.normalizedScore} | Base Weight = ${(c.baseWeight * 100).toFixed(0)}% | Active Weight = ${(c.activeWeight * 100).toFixed(1)}% | Sub-Contribution = ${c.contribution} [${c.assessed ? "Assessed" : "NOT ASSESSED"}]`
        ),
        ``
      );
    }

    if (activeData.findings && activeData.findings.length > 0) {
      lines.push(`## 4. DETECTED RISK SIGNALS & ANOMALIES`, ...activeData.findings.map(f => `- ${f}`), ``);
    }

    lines.push(
      `--------------------------------------------------------------------------------`,
      `STATUTORY DISCLAIMER:`,
      `AARAMBHA is an evidence-first decision-support platform. It does not determine guilt,`,
      `allege fraud, or replace official investigation. All indicators require human verification.`
    );

    const fullBrief = lines.join("\n");

    // Copy to clipboard
    navigator.clipboard.writeText(fullBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Download file
    const blob = new Blob([fullBrief], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AARAMBHA_Evidence_Brief_${activeData.recordId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(14, 26, 55, 0.45)",
        backdropFilter: "blur(2px)",
        transition: "all 0.2s ease"
      }}
      onClick={closeDrawer}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          height: "100%",
          background: "var(--paper-light)",
          borderLeft: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
            background: "var(--paper)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "14px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--indigo)", fontWeight: 700 }}>
                {activeData.entityType}
              </span>
              <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>•</span>
              <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "var(--ink)" }}>
                {activeData.recordId}
              </span>
              <ProvenanceBadge type={activeData.provenance} size="xs" />
            </div>
            <h2 style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: "19px", color: "var(--ink)", fontWeight: 600 }}>
              {activeData.title}
            </h2>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Verified via {activeData.sourceName}</span>
              <span>•</span>
              <span>{activeData.verifiedAt}</span>
            </div>
          </div>

          <button
            onClick={closeDrawer}
            className="ledger-btn-secondary"
            style={{ padding: "6px 8px" }}
            aria-label="Close evidence panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Quick Actions Bar */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={handleExportBrief}
              className="ledger-btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {copied ? <Check size={14} /> : <Download size={14} />}
              <span>{copied ? "Dossier Copied & Downloaded!" : "Export Evidence Brief (.md)"}</span>
            </button>
            <a
              href={activeData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ledger-btn-secondary"
              style={{ padding: "8px 12px", textDecoration: "none" }}
              title="Open authoritative statutory portal"
            >
              <ExternalLink size={14} />
              <span>Source Portal</span>
            </a>
          </div>

          {/* Stored Fields & Provenance Itemization */}
          <div className="ledger-card" style={{ padding: "16px", margin: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FileSpreadsheet size={15} color="var(--indigo)" />
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--ink)" }}>
                  Verified Field Registry
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--ink-muted)" }}>
                {activeData.fields.length} itemized fields
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeData.fields.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: "3px"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--ink-muted)", fontWeight: 500 }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>
                      {f.value}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <ProvenanceBadge type={f.provenance} size="xs" />
                    {f.source && (
                      <div style={{ fontSize: "9px", color: "var(--ink-muted)", marginTop: "3px" }}>
                        {f.source}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deterministic Calculation Breakdown */}
          {activeData.riskCalculation && (
            <div className="ledger-card" style={{ padding: "16px", margin: 0, borderColor: "rgba(39,59,115,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calculator size={15} color="var(--indigo)" />
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--ink)" }}>
                    Deterministic Math & Normalization
                  </span>
                </div>
                <span
                  className={`risk-pill risk-pill-${activeData.riskCalculation.riskLevel}`}
                  style={{ fontSize: "10px" }}
                >
                  Score: {activeData.riskCalculation.compositeScore}/100 ({activeData.riskCalculation.riskLevel.toUpperCase()})
                </span>
              </div>

              <p style={{ fontSize: "11px", color: "var(--ink-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
                Scores are generated deterministically in code—never by an LLM. Each category is normalized from 0 to 100.
                When data fields are missing, they are marked <em>“not assessed”</em> and active weights are proportionally rescaled to 100%.
              </p>

              {/* Components Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "var(--paper-deep)", borderBottom: "1px solid var(--line)" }}>
                      <th style={{ padding: "6px 8px" }}>Component</th>
                      <th style={{ padding: "6px 8px" }}>Norm Score</th>
                      <th style={{ padding: "6px 8px" }}>Base Wt</th>
                      <th style={{ padding: "6px 8px" }}>Active Wt</th>
                      <th style={{ padding: "6px 8px" }}>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.riskCalculation.components.map((c, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--line)", background: c.assessed ? undefined : "rgba(100,112,132,0.06)" }}>
                        <td style={{ padding: "6px 8px" }}>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: "9px", color: "var(--ink-muted)" }}>
                            {c.formulaExplanation}
                          </div>
                        </td>
                        <td style={{ padding: "6px 8px", fontFamily: "monospace", fontWeight: 600 }}>
                          {c.assessed ? c.normalizedScore : <span style={{ color: "var(--ink-muted)" }}>N/A</span>}
                        </td>
                        <td style={{ padding: "6px 8px", color: "var(--ink-muted)" }}>
                          {(c.baseWeight * 100).toFixed(0)}%
                        </td>
                        <td style={{ padding: "6px 8px", fontWeight: 600, color: "var(--indigo)" }}>
                          {c.assessed ? `${(c.activeWeight * 100).toFixed(1)}%` : "0%"}
                        </td>
                        <td style={{ padding: "6px 8px", fontWeight: 700, color: c.contribution > 15 ? "var(--terracotta)" : "var(--ink)" }}>
                          {c.assessed ? `+${c.contribution}` : "Not Assessed"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Confidence note */}
              <div style={{ marginTop: "12px", padding: "8px 10px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "3px", fontSize: "11px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  Assessed Coverage: <strong>{((activeData.riskCalculation.assessedWeightRatio || 1) * 100).toFixed(0)}%</strong> of full formula
                </span>
                <span style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: 700, color: "var(--indigo)" }}>
                  Confidence: {activeData.riskCalculation.confidence}
                </span>
              </div>
            </div>
          )}

          {/* Detected Anomaly Signals */}
          {activeData.findings && activeData.findings.length > 0 && (
            <div className="ledger-card" style={{ padding: "16px", margin: 0, borderColor: "rgba(169,87,68,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <ShieldAlert size={15} color="var(--terracotta)" />
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--terracotta)" }}>
                  Analytical Risk Signals
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--ink)", display: "flex", flexDirection: "column", gap: "6px" }}>
                {activeData.findings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal / Statutory Safeguard Box */}
          <div style={{ padding: "14px", background: "rgba(39,59,115,0.06)", border: "1px solid var(--line)", borderRadius: "3px", fontSize: "11px", color: "var(--ink-muted)", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
              <Scale size={13} color="var(--indigo)" />
              <span>Statutory Neutrality & Audit Disclaimer</span>
            </div>
            AARAMBHA is an evidence-first decision-support platform. It does not determine guilt, allege fraud, or replace official investigation. It retrieves verified records, runs transparent deterministic calculations, and helps reviewers identify records requiring further examination.
          </div>
        </div>
      </div>
    </div>
  );
}
