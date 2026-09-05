import React, { useState } from "react";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { useEvidence } from "@/contexts/EvidenceContext";
import { LOK_SABHA_MPS } from "@/lib/data/mockData";
import { Link } from "wouter";
import {
  ArrowLeftRight,
  Bot,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  Landmark,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X
} from "lucide-react";

interface CompareStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMpIdA?: string;
  defaultMpIdB?: string;
}

export function CompareStudioModal({
  isOpen,
  onClose,
  defaultMpIdA = "LS-457", // Varanasi
  defaultMpIdB = "LS-195"  // Wayanad
}: CompareStudioModalProps) {
  const { openDrawer } = useEvidence();
  const [selectedIdA, setSelectedIdA] = useState(defaultMpIdA);
  const [selectedIdB, setSelectedIdB] = useState(defaultMpIdB);

  if (!isOpen) return null;

  const mpA = LOK_SABHA_MPS.find(m => m.id === selectedIdA) || LOK_SABHA_MPS[0];
  const mpB = LOK_SABHA_MPS.find(m => m.id === selectedIdB) || LOK_SABHA_MPS[1];

  const rollOverA = (mpA.allocatedRupees ? mpA.allocatedRupees - 147000000 : (mpA.allocatedAmount - 14.7) * 10000000);
  const rollOverCrA = (rollOverA / 10000000).toFixed(2);
  const utilPctA = ((mpA.expenditure / mpA.allocatedAmount) * 100).toFixed(1);

  const rollOverB = (mpB.allocatedRupees ? mpB.allocatedRupees - 147000000 : (mpB.allocatedAmount - 14.7) * 10000000);
  const rollOverCrB = (rollOverB / 10000000).toFixed(2);
  const utilPctB = ((mpB.expenditure / mpB.allocatedAmount) * 100).toFixed(1);

  const allocDelta = (mpA.allocatedAmount - mpB.allocatedAmount).toFixed(2);
  const utilDelta = (parseFloat(utilPctA) - parseFloat(utilPctB)).toFixed(1);

  const handleOpenEvidence = (mp: typeof mpA) => {
    const rollOver = (mp.allocatedRupees ? mp.allocatedRupees - 147000000 : (mp.allocatedAmount - 14.7) * 10000000);
    openDrawer({
      title: `${mp.constituency} (${mp.state}) — Statutory Record`,
      recordId: mp.id,
      entityType: "MP / Constituency",
      provenance: "official_verified",
      sourceName: "MoSPI Official 18th Lok Sabha Register",
      sourceUrl: "https://empoweredindian.in/mplads",
      verifiedAt: "September 2024",
      fields: [
        { name: "Constituency", value: mp.constituency, provenance: "official_verified" },
        { name: "Elected Representative", value: mp.mpName, provenance: "official_verified" },
        { name: "State / UT", value: mp.state, provenance: "official_verified" },
        { name: "Statutory Allocated Limit", value: `₹${(mp.allocatedAmount).toFixed(2)} Cr`, provenance: "official_verified" },
        { name: "Utilized Expenditure", value: `₹${(mp.expenditure).toFixed(2)} Cr`, provenance: "official_verified" },
        { name: "Roll-Over Carry Forward", value: `+₹${(rollOver / 10000000).toFixed(2)} Cr`, provenance: "derived_calculation" }
      ]
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(14,26,55,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1040px",
          maxHeight: "90vh",
          background: "var(--paper-light)",
          borderRadius: "4px",
          border: "1px solid var(--indigo)",
          boxShadow: "0 24px 64px rgba(14,26,55,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--line)",
            background: "var(--paper)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--indigo)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <ArrowLeftRight size={13} color="var(--saffron)" /> Forensic Audit Compare Studio
            </div>
            <h2 style={{ margin: 0, fontSize: "20px", fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
              Side-by-Side Allocation & Fiscal Performance Comparator
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--ink-muted)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Selectors */}
        <div style={{ padding: "16px 24px", background: "var(--paper)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "20px", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Constituency A
            </label>
            <select
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="ledger-search-input"
              style={{ height: "38px", fontSize: "13px" }}
            >
              {LOK_SABHA_MPS.slice(0, 50).map(m => (
                <option key={m.id} value={m.id}>
                  {m.constituency} ({m.state}) — {m.mpName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ padding: "8px 12px", background: "rgba(39,59,115,0.06)", borderRadius: "20px", fontSize: "12px", fontWeight: 700, color: "var(--indigo)" }}>
            VS
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Constituency B
            </label>
            <select
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="ledger-search-input"
              style={{ height: "38px", fontSize: "13px" }}
            >
              {LOK_SABHA_MPS.slice(0, 50).map(m => (
                <option key={m.id} value={m.id}>
                  {m.constituency} ({m.state}) — {m.mpName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Side-by-Side Comparison Body */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: "16px", alignItems: "stretch" }}>
            {/* Column A */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "var(--indigo)", fontWeight: 700 }}>{mpA.id}</span>
                  <h3 style={{ margin: "2px 0 0", fontSize: "18px", fontFamily: "Fraunces, serif" }}>{mpA.constituency}</h3>
                  <div style={{ fontSize: "12px", color: "var(--ink-muted)" }}>{mpA.mpName} • {mpA.state}</div>
                </div>
                <ProvenanceBadge type="official_verified" />
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Statutory Allocated Limit</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                    ₹{mpA.allocatedAmount.toFixed(2)} Cr
                  </div>
                </div>

                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Carried-Forward Roll-Over</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--saffron)" }}>
                    {parseFloat(rollOverCrA) > 0 ? `+₹${rollOverCrA} Cr` : "₹0.00 (Standard Baseline)"}
                  </div>
                </div>

                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Disbursed Expenditure</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>
                    ₹{mpA.expenditure.toFixed(2)} Cr ({utilPctA}%)
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <button
                  onClick={() => handleOpenEvidence(mpA)}
                  className="ledger-btn-secondary"
                  style={{ width: "100%", fontSize: "11px", justifyContent: "center" }}
                >
                  <FileSpreadsheet size={12} /> Inspect Evidence Brief
                </button>
              </div>
            </div>

            {/* Center Delta Analysis */}
            <div style={{ background: "rgba(39,59,115,0.03)", border: "1px dashed var(--line)", padding: "18px 12px", borderRadius: "4px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)", fontWeight: 700, marginBottom: "8px" }}>
                Variance Analysis
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)" }}>Allocation Gap</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--indigo)", fontFamily: "Fraunces, serif" }}>
                  {Math.abs(parseFloat(allocDelta))} Cr
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)" }}>Utilization Gap</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: parseFloat(utilDelta) >= 0 ? "var(--sage)" : "var(--saffron)" }}>
                  {utilDelta}%
                </div>
              </div>

              <div style={{ fontSize: "10px", color: "var(--ink-muted)", lineHeight: 1.4 }}>
                Deterministic delta derived from official MoSPI Lok Sabha ledger.
              </div>
            </div>

            {/* Column B */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px", borderRadius: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontFamily: "ui-monospace, monospace", color: "var(--indigo)", fontWeight: 700 }}>{mpB.id}</span>
                  <h3 style={{ margin: "2px 0 0", fontSize: "18px", fontFamily: "Fraunces, serif" }}>{mpB.constituency}</h3>
                  <div style={{ fontSize: "12px", color: "var(--ink-muted)" }}>{mpB.mpName} • {mpB.state}</div>
                </div>
                <ProvenanceBadge type="official_verified" />
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Statutory Allocated Limit</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                    ₹{mpB.allocatedAmount.toFixed(2)} Cr
                  </div>
                </div>

                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Carried-Forward Roll-Over</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--saffron)" }}>
                    {parseFloat(rollOverCrB) > 0 ? `+₹${rollOverCrB} Cr` : "₹0.00 (Standard Baseline)"}
                  </div>
                </div>

                <div style={{ background: "var(--paper-light)", padding: "10px 12px", borderRadius: "3px" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Disbursed Expenditure</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>
                    ₹{mpB.expenditure.toFixed(2)} Cr ({utilPctB}%)
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <button
                  onClick={() => handleOpenEvidence(mpB)}
                  className="ledger-btn-secondary"
                  style={{ width: "100%", fontSize: "11px", justifyContent: "center" }}
                >
                  <FileSpreadsheet size={12} /> Inspect Evidence Brief
                </button>
              </div>
            </div>
          </div>

          {/* AI Comparative Interrogation Link */}
          <div style={{ background: "rgba(39,59,115,0.05)", border: "1px solid rgba(39,59,115,0.2)", padding: "14px 18px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--indigo)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={13} color="var(--saffron)" /> Grounded AI Comparative Analysis
              </div>
              <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                Interrogate how {mpA.constituency} and {mpB.constituency} compare in roll-over surplus and project execution.
              </div>
            </div>

            <Link
              href={`/ai-investigator?q=${encodeURIComponent(`Compare MPLADS fund utilization and surplus between ${mpA.constituency} and ${mpB.constituency}`)}`}
              onClick={onClose}
              className="ledger-btn-primary"
              style={{ fontSize: "11px", padding: "8px 14px", textDecoration: "none" }}
            >
              <Bot size={13} />
              <span>Query AI Engine</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
