import React, { useState } from "react";
import { ProvenanceBadge, ProvenanceType } from "@/components/ui/ProvenanceBadge";
import { useEvidence } from "@/contexts/EvidenceContext";
import { calculateProcurementRisk } from "@/lib/riskCalculator";
import {
  ArrowRight,
  Bot,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Landmark,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
  Users
} from "lucide-react";

interface GraphNode {
  id: string;
  stage: "MP Allocation" | "Sanctioned Project" | "Tender NIT" | "Awarded Contractor" | "Payment Disbursement" | "Audit Investigation";
  label: string;
  subLabel: string;
  value: string;
  provenance: ProvenanceType;
  source: string;
  sourceUrl: string;
  verifiedAt: string;
  statusColor: "indigo" | "saffron" | "sage" | "crimson";
  riskScore?: number;
  details: Record<string, string>;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  nodes: GraphNode[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "sc-1",
    title: "Varanasi Infrastructure & Energy Trail (PRJ-001)",
    description: "Traces statutory Lok Sabha allocation into renewable micro-grid procurement flagged for 34.2% unit cost divergence.",
    nodes: [
      {
        id: "LS-457",
        stage: "MP Allocation",
        label: "Varanasi (Uttar Pradesh)",
        subLabel: "Hon'ble MP Shri Narendra Modi",
        value: "₹16,20,70,276.11 Limit",
        provenance: "official_verified",
        source: "MoSPI 18th Lok Sabha Register",
        sourceUrl: "https://empoweredindian.in/mplads",
        verifiedAt: "September 2024",
        statusColor: "indigo",
        details: {
          "Constituency Code": "LS-457",
          "House": "Lok Sabha",
          "Allocation Limit": "₹16.21 Cr",
          "Carried Forward Roll-Over": "+₹1.51 Cr",
          "Baseline Term Ceiling": "₹14.70 Cr"
        }
      },
      {
        id: "PRJ-001",
        stage: "Sanctioned Project",
        label: "High-Altitude Solar Micro-Grid",
        subLabel: "District Executive Engineer Sanction",
        value: "₹14.50 Cr Sanctioned",
        provenance: "demo_illustrative",
        source: "District Works Portal (Simulated)",
        sourceUrl: "https://mplads.gov.in",
        verifiedAt: "12 Oct 2024",
        statusColor: "saffron",
        riskScore: 78,
        details: {
          "Sanction ID": "SAN-2024-VAR-091",
          "Sanctioned Estimate": "₹14.50 Cr",
          "Implementing Agency": "District Renewable Energy Agency",
          "Physical Progress": "45%",
          "Financial Disbursed": "72%"
        }
      },
      {
        id: "T-9281",
        stage: "Tender NIT",
        label: "EPC Solar Installation Tender",
        subLabel: "CPPP E-Procurement Portal",
        value: "₹11.20 Cr Estimate",
        provenance: "demo_illustrative",
        source: "Central Public Procurement Portal (CPPP)",
        sourceUrl: "https://etenders.gov.in",
        verifiedAt: "05 Nov 2024",
        statusColor: "saffron",
        riskScore: 68,
        details: {
          "NIT Reference": "NIT-2024-ELEC-9281",
          "Bidders Count": "3 Bids Submitted",
          "Bid Spread": "1.2% (Close Clustering Indicator)",
          "L1 Bid Value": "₹14.20 Cr (26.7% above estimate)"
        }
      },
      {
        id: "CONT-101",
        stage: "Awarded Contractor",
        label: "Apex Infra Projects Ltd",
        subLabel: "CIN: U45200DL2018PTC334567",
        value: "₹14.20 Cr Contract",
        provenance: "demo_illustrative",
        source: "MCA21 & State PWD Registry",
        sourceUrl: "https://mca.gov.in",
        verifiedAt: "20 Nov 2024",
        statusColor: "crimson",
        riskScore: 82,
        details: {
          "Incorporation Date": "14 Feb 2018",
          "Active Public Contracts": "12 Contracts",
          "Past Project Delay Rate": "41.6%",
          "Common Director Link": "Director shared with L2 Bidder"
        }
      },
      {
        id: "VCH-2024-8891",
        stage: "Payment Disbursement",
        label: "PFMS Milestone-2 Release",
        subLabel: "Voucher #8891 - Civil Works",
        value: "₹4.80 Cr Disbursed",
        provenance: "demo_illustrative",
        source: "PFMS Treasury Ledger",
        sourceUrl: "https://pfms.nic.in",
        verifiedAt: "15 Jan 2025",
        statusColor: "saffron",
        details: {
          "Voucher Date": "15 Jan 2025",
          "Bill Claimed": "₹4.80 Cr",
          "Measured Book Entry": "MB Vol 4, Page 88",
          "Physical Verification Gap": "Engineer site sign-off pending"
        }
      },
      {
        id: "CASE-2025-014",
        stage: "Audit Investigation",
        label: "Vigilance Audit Inquiry",
        subLabel: "Prioritized for Human Vigilance Review",
        value: "Score: 78/100 (HIGH)",
        provenance: "derived_calculation",
        source: "AARAMBHA Deterministic Risk Engine",
        sourceUrl: "/risk-engine",
        verifiedAt: "05 Sep 2026",
        statusColor: "crimson",
        riskScore: 78,
        details: {
          "Indicator Type": "Multi-Factor Discrepancy",
          "Composite Risk": "78/100 (Review Required)",
          "Recommended Action": "Hold milestone 3 disbursement; deploy executive engineer audit"
        }
      }
    ]
  },
  {
    id: "sc-2",
    title: "Wayanad Disaster Mitigation Retaining Works (PRJ-004)",
    description: "Statutory allocation into hill drainage reinforcement with baseline standard parameters.",
    nodes: [
      {
        id: "LS-195",
        stage: "MP Allocation",
        label: "Wayanad (Kerala)",
        subLabel: "18th Lok Sabha Constituency",
        value: "₹14,70,00,000.00 Limit",
        provenance: "official_verified",
        source: "MoSPI 18th Lok Sabha Register",
        sourceUrl: "https://empoweredindian.in/mplads",
        verifiedAt: "September 2024",
        statusColor: "indigo",
        details: {
          "Constituency Code": "LS-195",
          "House": "Lok Sabha",
          "Allocation Limit": "₹14.70 Cr",
          "Baseline Term Ceiling": "₹14.70 Cr",
          "Surplus Roll-Over": "₹0.00 (Normal Baseline)"
        }
      },
      {
        id: "PRJ-004",
        stage: "Sanctioned Project",
        label: "Slope Stabilization Retaining Walls",
        subLabel: "Disaster Management Authority",
        value: "₹4.20 Cr Sanctioned",
        provenance: "demo_illustrative",
        source: "District Administration Order",
        sourceUrl: "https://mplads.gov.in",
        verifiedAt: "10 Aug 2024",
        statusColor: "sage",
        riskScore: 18,
        details: {
          "Sanction ID": "SAN-2024-WAY-012",
          "Sanctioned Amount": "₹4.20 Cr",
          "Physical Progress": "85%",
          "Financial Disbursed": "80%"
        }
      },
      {
        id: "T-8820",
        stage: "Tender NIT",
        label: "Geotechnical Earthworks NIT",
        subLabel: "CPPP E-Tender Portal",
        value: "₹4.10 Cr Estimate",
        provenance: "demo_illustrative",
        source: "CPPP Kerala E-Tender",
        sourceUrl: "https://etenders.gov.in",
        verifiedAt: "25 Aug 2024",
        statusColor: "sage",
        details: {
          "Bidders Count": "6 Independent Bidders",
          "Bid Spread": "14.8% (Healthy Competition)",
          "L1 Bid": "₹3.98 Cr (-2.9% below estimate)"
        }
      },
      {
        id: "CONT-204",
        stage: "Awarded Contractor",
        label: "Malabar Engineering Associates",
        subLabel: "PWD Grade-A Registered",
        value: "₹3.98 Cr Contract",
        provenance: "demo_illustrative",
        source: "Kerala PWD Portal",
        sourceUrl: "https://pwd.kerala.gov.in",
        verifiedAt: "15 Sep 2024",
        statusColor: "sage",
        riskScore: 12,
        details: {
          "Registration": "PWD Grade-A Valid up to 2028",
          "On-Time Completion Rate": "94.2%",
          "Blacklist Record": "Nil / Clean"
        }
      }
    ]
  }
];

export function EvidenceGraphView() {
  const { openDrawer } = useEvidence();
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  const scenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const activeNode = scenario.nodes[selectedNodeIndex] || scenario.nodes[0];

  const handleInspectDrawer = (node: GraphNode) => {
    const riskCalc = node.riskScore
      ? calculateProcurementRisk({
          priceDeviationPct: node.riskScore > 50 ? 34.2 : 4.0,
          progressDisparityPct: node.riskScore > 50 ? 27.0 : 5.0,
          bidSpreadPct: node.riskScore > 50 ? 1.2 : 14.8,
          contractorDelayRatePct: node.riskScore > 50 ? 41.6 : 5.8
        })
      : undefined;

    openDrawer({
      title: `${node.stage}: ${node.label}`,
      recordId: node.id,
      entityType: node.id.startsWith("LS-") ? "MP / Constituency" : node.id.startsWith("PRJ-") ? "Project / Work" : node.id.startsWith("CONT-") ? "Contractor" : node.id.startsWith("T-") ? "Tender / Bid" : "Audit Case",
      provenance: node.provenance,
      sourceName: node.source,
      sourceUrl: node.sourceUrl,
      verifiedAt: node.verifiedAt,
      fields: Object.entries(node.details).map(([k, v]) => ({
        name: k,
        value: v,
        provenance: node.provenance,
        source: node.source
      })),
      riskCalculation: riskCalc,
      recommendation: `Verified against official register "${node.source}". Authorized vigilance officers can download complete brief.`
    });
  };

  return (
    <div className="ledger-card" style={{ background: "var(--paper-light)", borderColor: "rgba(39,59,115,0.3)" }}>
      {/* Graph Header */}
      <div className="ledger-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--indigo)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={13} color="var(--saffron)" /> Procurement Lineage & Evidence Graph
          </div>
          <h2 style={{ fontSize: "18px", margin: "0 0 2px 0" }}>End-to-End Fund Flow Audit Trail</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-muted)" }}>
            Select any node to trace statutory lineage from MP recommendation to tender bidding, contractor execution, and vigilance flags.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div style={{ display: "flex", gap: "6px" }}>
          {SCENARIOS.map(sc => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                setSelectedNodeIndex(0);
              }}
              className={sc.id === activeScenarioId ? "ledger-btn-primary" : "ledger-btn-secondary"}
              style={{ fontSize: "11px", padding: "6px 12px" }}
            >
              <span>{sc.id === "sc-1" ? "Varanasi (High-Risk Trail)" : "Wayanad (Standard Baseline)"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Chain Progression (Horizontal Node Path) */}
      <div style={{ overflowX: "auto", padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: "900px", padding: "0 8px", gap: "10px" }}>
          {scenario.nodes.map((node, idx) => {
            const isSelected = idx === selectedNodeIndex;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeIndex(idx)}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    background: isSelected ? "var(--paper)" : "rgba(255,255,255,0.6)",
                    border: isSelected ? "2px solid var(--indigo)" : "1px solid var(--line)",
                    borderRadius: "4px",
                    padding: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(39,59,115,0.12)" : "none",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)", fontWeight: 700 }}>
                      Step {idx + 1}
                    </span>
                    <ProvenanceBadge type={node.provenance} />
                  </div>

                  <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--indigo)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "2px" }}>
                    {node.stage}
                  </div>

                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {node.label}
                  </div>

                  <div style={{ fontSize: "11px", color: "var(--saffron)", fontWeight: 700, marginTop: "4px", fontFamily: "ui-monospace, monospace" }}>
                    {node.value}
                  </div>
                </div>

                {idx < scenario.nodes.length - 1 && (
                  <div style={{ color: "var(--indigo)", opacity: 0.4, display: "flex", alignItems: "center" }}>
                    <ChevronRight size={18} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Node Detail Grounding Inspector */}
      <div style={{ marginTop: "16px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "var(--indigo)", fontWeight: 700, background: "rgba(39,59,115,0.08)", padding: "2px 6px", borderRadius: "3px" }}>
                {activeNode.id}
              </span>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)", fontWeight: 700 }}>
                {activeNode.stage}
              </span>
              <ProvenanceBadge type={activeNode.provenance} />
            </div>

            <h3 style={{ margin: "0 0 2px 0", fontSize: "18px", fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
              {activeNode.label}
            </h3>
            <div style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
              {activeNode.subLabel} • Verified at: {activeNode.verifiedAt}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {activeNode.riskScore && (
              <span className={`risk-pill ${activeNode.riskScore >= 70 ? "risk-pill-high" : activeNode.riskScore >= 40 ? "risk-pill-medium" : "risk-pill-normal"}`}>
                Risk Score: {activeNode.riskScore}/100
              </span>
            )}
            <button
              onClick={() => handleInspectDrawer(activeNode)}
              className="ledger-btn-primary"
              style={{ fontSize: "11px", padding: "6px 12px" }}
            >
              <FileSpreadsheet size={13} />
              <span>Inspect in Evidence Drawer</span>
            </button>
          </div>
        </div>

        {/* Node Fields Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "14px" }}>
          {Object.entries(activeNode.details).map(([key, val]) => (
            <div key={key} style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginBottom: "2px" }}>{key}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Source Citation & Integrity Stamp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "10px", fontSize: "11px", color: "var(--ink-muted)", flexWrap: "wrap", gap: "8px" }}>
          <div>
            Data Source: <strong style={{ color: "var(--ink)" }}>{activeNode.source}</strong>
          </div>
          {activeNode.sourceUrl && (
            <a
              href={activeNode.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--indigo)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span>View Source Register</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
