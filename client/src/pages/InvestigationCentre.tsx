import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_INVESTIGATIONS, InvestigationCase } from "@/lib/data/mockData";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Plus,
  Scale,
  Search,
  ShieldAlert
} from "lucide-react";

export default function InvestigationCentre() {
  const [activeStatus, setActiveStatus] = useState<"All" | "open" | "under-review" | "escalated" | "resolved">("All");

  const filteredCases = MOCK_INVESTIGATIONS.filter(c => {
    if (activeStatus !== "All" && c.status !== activeStatus) return false;
    return true;
  });

  return (
    <PlatformLayout
      moduleNumber="07"
      moduleName="Investigation Centre & Audit Dossiers"
      subTitle="Formal Inquiry Workflows & Evidence Lockers"
      actions={
        <Link href="/reports" className="ledger-btn-secondary">
          <Download size={13} />
          <span>Export Case Summary</span>
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Case Management & Evidence Vault</div>
        <h1>Vigilance Inquiry Dossiers & Statutory Evidence Trails</h1>
        <p>
          Structured case files linking tenders, contractor PAN records, on-site drone photos, and GFR statutory guidelines.
          Allows auditors to escalate substantiated anomalies to the Public Accounts Committee (PAC) or Central Vigilance Commission (CVC).
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {(["All", "under-review", "open", "escalated", "resolved"] as const).map((st) => {
          const isActive = activeStatus === st;
          const label = st === "All" ? "All Cases" : st.replace("-", " ").toUpperCase();
          return (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className="ledger-btn-secondary"
              style={{
                background: isActive ? "var(--indigo)" : "var(--paper-light)",
                color: isActive ? "var(--paper)" : "var(--ink)",
                borderColor: isActive ? "var(--indigo)" : "var(--line)",
                padding: "8px 16px"
              }}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Cases List */}
      <div style={{ display: "grid", gap: "18px" }}>
        {filteredCases.map((cs) => (
          <div key={cs.id} className="ledger-card" style={{ marginBottom: 0 }}>
            <div className="ledger-card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <strong>{cs.id}</strong>
                  <span className={`risk-pill risk-pill-${cs.riskLevel}`}>
                    Score: {cs.riskScore} • {cs.riskLevel}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--indigo)" }}>
                    Status: {cs.status}
                  </span>
                </div>
                <h3>{cs.title}</h3>
              </div>

              <Link href={`/investigations/${cs.id}`} className="ledger-btn-primary">
                <span>Open Dossier</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            {/* Primary Signal Box */}
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "3px", marginBottom: "14px", fontSize: "12px" }}>
              <strong style={{ color: "var(--terracotta)" }}>Primary Finding: </strong>
              <span>{cs.primarySignal}</span>
            </div>

            {/* Entity metadata */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "12px", marginBottom: "14px", color: "var(--ink)" }}>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Target Project</span>
                <div style={{ fontWeight: 600 }}>{cs.projectName} ({cs.projectId})</div>
              </div>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Subject Contractor</span>
                <div style={{ fontWeight: 600 }}>{cs.contractorName}</div>
              </div>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Evidence Registered</span>
                <div style={{ fontWeight: 600 }}>{cs.evidenceIds.length} Verified Documents</div>
              </div>
            </div>

            {/* Recommended Action preview */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", fontSize: "11px", color: "var(--ink-muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <strong>Next Step:</strong> {cs.recommendedActions[0]}
              </span>
              <span style={{ color: "var(--indigo)", fontWeight: 600 }}>
                {cs.statutoryReferences[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PlatformLayout>
  );
}
