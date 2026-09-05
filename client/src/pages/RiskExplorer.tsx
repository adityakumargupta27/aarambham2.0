import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { BENFORD_FORENSICS_DATA, MOCK_PROJECTS, PLATFORM_MACRO_METRICS } from "@/lib/data/mockData";
import { EvidenceGraphView } from "@/components/charts/EvidenceGraphView";
import { useEvidence } from "@/contexts/EvidenceContext";
import { calculateProcurementRisk } from "@/lib/riskCalculator";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  Calculator,
  FileSpreadsheet,
  Filter,
  Layers,
  Scale,
  Search,
  ShieldAlert
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const RISK_CATEGORIES = [
  "All Categories",
  "Price anomaly",
  "Bid pattern anomaly",
  "Contractor history risk",
  "Execution variance",
  "Document mismatch",
  "Duplicate work risk",
  "Unusual payment pattern",
  "Benford's law anomaly",
  "Related network signal"
];

export default function RiskExplorer() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [minScore, setMinScore] = useState(0);
  const { openDrawer } = useEvidence();

  const handleExplainScore = (project: typeof MOCK_PROJECTS[0]) => {
    const riskCalc = calculateProcurementRisk({
      priceDeviationPct: project.riskScore > 75 ? 24.5 : 8.2,
      progressDisparityPct: project.riskScore > 70 ? 36.0 : 4.5,
      bidSpreadPct: project.riskScore > 80 ? 1.4 : 12.0,
      contractorDelayRatePct: project.riskScore > 70 ? 41.6 : 6.0
    });

    openDrawer({
      title: `Risk Formula Audit: ${project.name} (${project.id})`,
      recordId: project.id,
      entityType: "Project / Work",
      provenance: "derived_calculation",
      sourceName: "District Works Execution Ledger & CPPP NIT",
      sourceUrl: "https://mplads.gov.in",
      verifiedAt: "12 Oct 2024",
      fields: [
        { name: "Project ID", value: project.id, provenance: "official_verified" },
        { name: "Constituency", value: `${project.constituency}, ${project.state}`, provenance: "official_verified" },
        { name: "Contractor", value: project.contractorName, provenance: "official_verified" },
        { name: "Sanctioned Value", value: `₹${project.sanctionedAmount.toFixed(2)} Lakhs`, provenance: "official_verified" },
        { name: "Physical Progress", value: "52%", provenance: "derived_calculation" },
        { name: "Financial Disbursed", value: "88%", provenance: "derived_calculation" }
      ],
      riskCalculation: riskCalc,
      findings: [
        `Composite Risk Score computed deterministically at ${riskCalc.compositeScore}/100.`,
        "Physical progress lagging behind financial disbursement by 36% disparity gap.",
        "Unit price variance exceeding Delhi Schedule of Rates (DSR) benchmark."
      ],
      recommendation: riskCalc.recommendation
    });
  };

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      if (p.riskScore < minScore) return false;
      if (selectedLevel !== "All" && p.riskLevel !== selectedLevel.toLowerCase()) return false;
      return true;
    });
  }, [minScore, selectedLevel]);

  return (
    <PlatformLayout
      moduleNumber="06"
      moduleName="Risk Intelligence & Anomaly Explorer"
      subTitle="9 Forensic Anomaly Categories & Automated Scoring"
      actions={
        <Link href="/ai-investigator?q=What are the top 3 highest risk procurement signals active across India right now?" className="ledger-btn-primary">
          <Bot size={13} />
          <span>Ask AI Investigator</span>
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Multi-Dimensional Forensic Engine</div>
        <h1>Public Procurement Risk Matrix & Anomaly Detection</h1>
        <p>
          Calculates algorithmic risk indicators across 9 civic dimensions to help auditors triage high-risk anomalies.
          Scores highlight deviation from historical medians, Benford's law violations, and contractor coordination.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="ledger-metrics-grid">
        <div className="ledger-metric-card" style={{ borderColor: "rgba(169,87,68,0.4)" }}>
          <div className="metric-kicker">
            <span style={{ color: "var(--terracotta)" }}>High Priority (Score 80–100)</span>
            <AlertOctagon size={14} color="var(--terracotta)" />
          </div>
          <div className="metric-val" style={{ color: "var(--terracotta)" }}>384</div>
          <div className="metric-caption">Immediate review recommended</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span style={{ color: "var(--saffron)" }}>Review Required (60–79)</span>
            <AlertTriangle size={14} color="var(--saffron)" />
          </div>
          <div className="metric-val" style={{ color: "var(--saffron)" }}>1,968</div>
          <div className="metric-caption">Requires technical site verification</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Watch Status (40–59)</span>
            <Scale size={14} color="var(--indigo)" />
          </div>
          <div className="metric-val">3,980</div>
          <div className="metric-caption">Elevated timeline delay signals</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Normal Range (0–39)</span>
            <ShieldAlert size={14} color="var(--sage)" />
          </div>
          <div className="metric-val" style={{ color: "var(--sage)" }}>12,410</div>
          <div className="metric-caption">Standard milestone monitoring</div>
        </div>
      </div>

      {/* Filter and Sensitivity Slider */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <select
            className="ledger-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {RISK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="ledger-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Priority</option>
            <option value="Review">Review</option>
            <option value="Watch">Watch</option>
            <option value="Normal">Normal</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600 }}>
            <span>Min Risk Score: <strong>{minScore}</strong></span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ accentColor: "var(--indigo)", cursor: "pointer" }}
            />
          </div>
        </div>

        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{filteredProjects.length}</strong> matching records
        </div>
      </div>

      {/* Benford's Law Forensic Visualizer */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Benford's Law Forensic Payment Distribution</h3>
            <small style={{ color: "var(--ink-muted)" }}>
              First-digit frequency of 142,000 disbursement vouchers vs Benford's mathematical standard
            </small>
          </div>
          <span style={{ fontSize: "11px", color: "var(--terracotta)", fontWeight: 700 }}>
            Digit 4 Threshold Clustering Flagged (+5.1%)
          </span>
        </div>

        <div style={{ height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BENFORD_FORENSICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="digit" tick={{ fontSize: 11 }} stroke="rgba(39,59,115,0.4)" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgba(39,59,115,0.4)" />
              <Tooltip contentStyle={{ background: "#fbf8f2", border: "1px solid rgba(39,59,115,0.2)", fontSize: "11px" }} />
              <Bar dataKey="expected" fill="#273b73" name="Expected Mathematical %" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" fill="#d88a35" name="Actual Voucher %" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p style={{ margin: "10px 0 0", fontSize: "11px", color: "var(--ink-muted)", lineHeight: 1.4 }}>
          * Significant clustering at leading digit <strong>4</strong> correlates with contracts split just under
          statutory ₹50,000 / ₹5,00,000 thresholds to evade mandatory open e-tendering rules.
        </p>
      </div>

      {/* Procurement Lineage & Evidence Graph */}
      <div style={{ marginBottom: "24px" }}>
        <EvidenceGraphView />
      </div>

      {/* Prioritized Project Triage */}
      <div className="ledger-card" style={{ marginBottom: 0 }}>
        <div className="ledger-card-header">
          <div>
            <h3>High-Risk Project Prioritization Triage</h3>
            <small style={{ color: "var(--ink-muted)" }}>Records flagged for immediate field audit or technical inspection</small>
          </div>
          <Link href="/investigations" className="ledger-btn-secondary">
            <span>Investigation Room</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="ledger-table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project / Constituency</th>
                <th>Risk Score</th>
                <th>Primary Discrepancy Signal</th>
                <th>Contractor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <small style={{ color: "var(--ink-muted)" }}>{p.constituency}, {p.state}</small>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span className={`risk-pill risk-pill-${p.riskLevel}`}>
                        Score {p.riskScore} • {p.riskLevel}
                      </span>
                      <button
                        onClick={() => handleExplainScore(p)}
                        className="ledger-btn-secondary"
                        style={{ padding: "2px 6px", fontSize: "10px", height: "22px", gap: "3px" }}
                        title="Open deterministic risk calculation breakdown"
                      >
                        <Calculator size={10} />
                        <span>Explain</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "11px", color: p.riskScore > 75 ? "var(--terracotta)" : "var(--ink)" }}>
                      {p.riskScore > 80
                        ? "Unit price deviation +18.4% above DSR benchmark"
                        : p.riskScore > 70
                        ? "Physical progress (52%) severely lagging financial disbursements (88%)"
                        : "Milestone timeline delay beyond 60 days"}
                    </span>
                  </td>
                  <td>{p.contractorName}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link href={`/projects/${p.id}`} className="ledger-btn-secondary" style={{ padding: "4px 8px", fontSize: "10px" }}>
                        <span>Project 360</span>
                      </Link>
                      {p.caseId ? (
                        <Link href={`/investigations/${p.caseId}`} className="ledger-btn-primary" style={{ padding: "4px 8px", fontSize: "10px" }}>
                          <span>Case Room</span>
                        </Link>
                      ) : (
                        <Link href={`/ai-investigator?q=Generate risk inquiry report for ${p.id}`} className="ledger-btn-secondary" style={{ padding: "4px 8px", fontSize: "10px" }}>
                          <Bot size={11} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformLayout>
  );
}
