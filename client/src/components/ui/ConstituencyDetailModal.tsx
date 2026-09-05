import React from "react";
import { ProvenanceBadge, ProvenanceField } from "./ProvenanceBadge";
import { useEvidence } from "@/contexts/EvidenceContext";
import { Link } from "wouter";
import {
  AlertTriangle,
  Bot,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FolderKanban,
  HelpCircle,
  Landmark,
  Scale,
  ShieldAlert,
  Sparkles,
  X
} from "lucide-react";

export interface ConstituencyDetailData {
  id: string;
  srNo: number;
  house: "Lok Sabha" | "Rajya Sabha";
  constituency: string;
  mpName: string;
  mpType: "Elected" | "Nominated";
  state: string;
  allocatedRupees?: number;
  allocatedAmount: number; // in Cr
  expenditure: number; // in Cr
  carriedForward: number; // in Cr
  variance: number;
  isBaseline: boolean;
  financialYear: string;
  status: "Normal" | "Accumulation Watch" | "High Accumulation";
  source?: string;
}

interface ConstituencyDetailModalProps {
  mp: ConstituencyDetailData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConstituencyDetailModal({ mp, isOpen, onClose }: ConstituencyDetailModalProps) {
  const { openDrawer } = useEvidence();

  if (!isOpen || !mp) return null;

  const rollOverRupees = (mp.allocatedRupees || 0) - 147000000;
  const rollOverCr = rollOverRupees > 0 ? (rollOverRupees / 10000000).toFixed(2) : "0.00";
  const utilizationPct = ((mp.expenditure / mp.allocatedAmount) * 100).toFixed(1);

  const handleOpenEvidence = () => {
    openDrawer({
      title: `${mp.constituency} (${mp.state}) — Parliamentary Allocation`,
      recordId: mp.id,
      entityType: "MP / Constituency",
      provenance: "official_verified",
      sourceName: "Empowered Indian (MoSPI Portal)",
      sourceUrl: "https://empoweredindian.in/mplads",
      verifiedAt: "September 2024 (18th Lok Sabha Register)",
      fields: [
        { name: "Hon'ble Member of Parliament", value: mp.mpName, provenance: "official_verified", source: "Election Commission of India / MoSPI" },
        { name: "Constituency", value: mp.constituency, provenance: "official_verified", source: "Delimitation Order" },
        { name: "State / UT", value: mp.state, provenance: "official_verified" },
        { name: "Statutory Allocated Limit", value: `₹${(mp.allocatedRupees || 147000000).toLocaleString("en-IN")} (₹${mp.allocatedAmount.toFixed(2)} Cr)`, provenance: "official_verified", source: "MoSPI Allocation Ceilings" },
        { name: "Fresh Term Baseline", value: "₹14,70,00,000 (₹14.70 Cr)", provenance: "official_verified" },
        { name: "Carried-Forward Roll-Over", value: rollOverRupees > 0 ? `+₹${rollOverCr} Cr` : "₹0.00 (Standard Baseline)", provenance: "derived_calculation" },
        { name: "Expenditure Recorded", value: `₹${mp.expenditure.toFixed(2)} Cr (${utilizationPct}% utilized)`, provenance: "derived_calculation" },
        { name: "Unspent Carried Forward", value: `₹${mp.carriedForward.toFixed(2)} Cr`, provenance: "derived_calculation" },
        { name: "Illustrative Linked Public Works", value: "3 works mapped for demonstration", provenance: "demo_illustrative" }
      ],
      findings: mp.status === "High Accumulation"
        ? [`High unspent fund accumulation: ₹${mp.carriedForward.toFixed(2)} Cr unspent balance requires accelerated district DISHA committee review.`]
        : [`Constituency operates within standard allocation velocity guidelines.`]
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(14, 26, 55, 0.55)",
        backdropFilter: "blur(3px)",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          background: "var(--paper-light)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "var(--paper)",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "14px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--indigo)", fontWeight: 700 }}>
                {mp.house} Constituency Telemetry
              </span>
              <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>•</span>
              <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>{mp.id}</span>
              <ProvenanceBadge type="official_verified" size="xs" />
            </div>
            <h2 style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: "22px", color: "var(--ink)", fontWeight: 600 }}>
              {mp.constituency}, {mp.state}
            </h2>
            <div style={{ fontSize: "13px", color: "var(--ink-muted)", marginTop: "4px" }}>
              Hon'ble MP: <strong>{mp.mpName}</strong> ({mp.mpType})
            </div>
          </div>

          <button onClick={onClose} className="ledger-btn-secondary" style={{ padding: "6px 8px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Top Metrics Banner */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700 }}>
                  Statutory Limit
                </span>
                <ProvenanceBadge type="official_verified" size="xs" showIcon={false} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--indigo)", marginTop: "4px" }}>
                ₹{mp.allocatedAmount.toFixed(2)} Cr
              </div>
              {mp.allocatedRupees && (
                <div style={{ fontSize: "10px", color: "var(--ink-muted)", fontFamily: "monospace", marginTop: "2px" }}>
                  ₹{mp.allocatedRupees.toLocaleString("en-IN")}
                </div>
              )}
            </div>

            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700 }}>
                  Roll-Over Surplus
                </span>
                <ProvenanceBadge type="derived_calculation" size="xs" showIcon={false} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: rollOverRupees > 0 ? "var(--saffron)" : "var(--moss)", marginTop: "4px" }}>
                {rollOverRupees > 0 ? `+₹${rollOverCr} Cr` : "₹0.00 (Base)"}
              </div>
              <div style={{ fontSize: "10px", color: "var(--ink-muted)", marginTop: "2px" }}>
                {rollOverRupees > 0 ? "From 17th Lok Sabha" : "Fresh Term Baseline"}
              </div>
            </div>

            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700 }}>
                  Unspent Carried-Forward
                </span>
                <ProvenanceBadge type="derived_calculation" size="xs" showIcon={false} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: mp.status === "High Accumulation" ? "var(--terracotta)" : "var(--ink)", marginTop: "4px" }}>
                ₹{mp.carriedForward.toFixed(2)} Cr
              </div>
              <div style={{ fontSize: "10px", color: "var(--ink-muted)", marginTop: "2px" }}>
                {utilizationPct}% utilized
              </div>
            </div>
          </div>

          {/* Field-level Itemization Grid */}
          <div className="ledger-card" style={{ padding: "16px", margin: 0 }}>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--ink)", marginBottom: "12px" }}>
              Field-Level Provenance Itemization
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <ProvenanceField label="Hon'ble Member" value={mp.mpName} type="official_verified" />
              <ProvenanceField label="Constituency" value={mp.constituency} type="official_verified" />
              <ProvenanceField label="Statutory Allocation" value={`₹${(mp.allocatedRupees || 147000000).toLocaleString('en-IN')}`} type="official_verified" />
              <ProvenanceField label="Roll-Over Amount" value={`+₹${rollOverCr} Cr`} type="derived_calculation" />
              <ProvenanceField label="Expenditure Velocity" value={`${utilizationPct}% Drawdown`} type="derived_calculation" />
              <ProvenanceField label="Active Works Mapped" value="3 Demonstration Works" type="demo_illustrative" />
            </div>
          </div>

          {/* AI Quick Questions for this MP */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "16px", borderRadius: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Sparkles size={14} color="var(--saffron)" />
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "var(--ink)" }}>
                AI Suggested Inquiries
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                href={`/ai-investigator?q=Analyze unspent funds and statutory roll-over for ${encodeURIComponent(mp.constituency)} (${encodeURIComponent(mp.state)})`}
                className="question-bubble"
                style={{ fontSize: "12px", padding: "8px 12px", textDecoration: "none" }}
              >
                <Bot size={14} />
                <span>Audit carried-forward surplus for {mp.constituency}</span>
              </Link>
              <Link
                href={`/ai-investigator?q=What are the primary expenditure and project velocity signals for MP ${encodeURIComponent(mp.mpName)}?`}
                className="question-bubble"
                style={{ fontSize: "12px", padding: "8px 12px", textDecoration: "none" }}
              >
                <Bot size={14} />
                <span>Examine expenditure velocity signals for {mp.mpName}</span>
              </Link>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleOpenEvidence}
              className="ledger-btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <FileSpreadsheet size={14} />
              <span>Open Evidence Drawer & Calculation</span>
            </button>
            <a
              href="https://empoweredindian.in/mplads"
              target="_blank"
              rel="noopener noreferrer"
              className="ledger-btn-secondary"
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={14} />
              <span>MoSPI Source</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
