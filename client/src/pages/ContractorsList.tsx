import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_CONTRACTORS } from "@/lib/data/mockData";
import { useEvidence } from "@/contexts/EvidenceContext";
import { calculateProcurementRisk } from "@/lib/riskCalculator";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Building2,
  Calculator,
  FileSpreadsheet,
  FolderKanban,
  GitBranch,
  Network,
  Search,
  ShieldAlert
} from "lucide-react";

export default function ContractorsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { openDrawer } = useEvidence();

  const handleExplainContractor = (c: typeof MOCK_CONTRACTORS[0]) => {
    const riskCalc = calculateProcurementRisk({
      priceDeviationPct: c.riskScore > 75 ? 22.0 : 5.0,
      progressDisparityPct: c.riskScore > 70 ? 28.0 : 4.0,
      bidSpreadPct: c.riskScore > 80 ? 1.2 : 14.0,
      contractorDelayRatePct: c.delayRate
    });

    openDrawer({
      title: `Contractor Risk Profile: ${c.name} (${c.id})`,
      recordId: c.id,
      entityType: "Contractor",
      provenance: "derived_calculation",
      sourceName: "MCA21 Registry & State Public Works Department",
      sourceUrl: "https://mca.gov.in",
      verifiedAt: "September 2024",
      fields: [
        { name: "Contractor Name", value: c.name, provenance: "official_verified" },
        { name: "Registration / CIN", value: c.registrationNumber, provenance: "official_verified" },
        { name: "Total Public Contracts", value: `₹${(c.totalContractValue / 100).toFixed(2)} Cr (${c.projectCount} Works)`, provenance: "official_verified" },
        { name: "Historical Delay Rate", value: `${c.delayRate}%`, provenance: "derived_calculation" },
        { name: "Contract Cancellation Rate", value: `${c.cancellationRate}%`, provenance: "derived_calculation" },
        { name: "Operating States", value: c.states.join(", "), provenance: "official_verified" }
      ],
      riskCalculation: riskCalc,
      findings: [
        `Historical delay rate of ${c.delayRate}% exceeds CVC acceptable benchmarks.`,
        `Director interlock detected across ${c.connectedEntities.length} corporate entities.`,
        `Composite vendor risk score computed deterministically at ${riskCalc.compositeScore}/100.`
      ],
      recommendation: riskCalc.recommendation
    });
  };

  const filteredContractors = MOCK_CONTRACTORS.filter(c => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.registrationNumber.toLowerCase().includes(q) ||
        c.states.some(s => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <PlatformLayout
      moduleNumber="05"
      moduleName="Contractor Intelligence & Entity Resolution"
      subTitle="Vendor History, Syndicates & Delay Analytics"
      actions={
        <Link href="/risk" className="ledger-btn-secondary">
          <ShieldAlert size={13} />
          <span>Risk Matrix</span>
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Vendor Integrity Registry</div>
        <h1>Contractor Profiles, Historical Delays & Entity Resolution</h1>
        <p>
          Aggregates vendor performance across state jurisdictions. Surfaces shell entities, common director addresses,
          excessive delay rates (&gt;30%), and bid-rotation partnerships.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <div className="ledger-search-box">
            <Search size={14} />
            <input
              type="text"
              className="ledger-search-input"
              placeholder="Search vendor name, registration number, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{filteredContractors.length}</strong> evaluated vendors
        </div>
      </div>

      {/* Contractor Cards */}
      <div style={{ display: "grid", gap: "20px" }}>
        {filteredContractors.map((c) => (
          <div key={c.id} className="ledger-card" style={{ marginBottom: 0 }}>
            <div className="ledger-card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <strong>{c.id}</strong>
                  <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>{c.registrationNumber}</span>
                  <span className={`risk-pill risk-pill-${c.riskLevel}`}>
                    Risk Score: {c.riskScore} • {c.riskLevel}
                  </span>
                  <button
                    onClick={() => handleExplainContractor(c)}
                    className="ledger-btn-secondary"
                    style={{ padding: "2px 8px", fontSize: "10px", height: "22px", gap: "4px" }}
                    title="Inspect deterministic vendor formula in Evidence Drawer"
                  >
                    <Calculator size={10} />
                    <span>Explain Formula</span>
                  </button>
                </div>
                <h3>{c.name}</h3>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Total Contract Volume</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "var(--indigo)", fontWeight: 600 }}>
                  ₹{(c.totalContractValue / 100).toFixed(2)} Cr
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", background: "var(--paper)", border: "1px solid var(--line)", padding: "14px 18px", borderRadius: "3px", marginBottom: "16px", fontSize: "12px" }}>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Projects Awarded</span>
                <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px", color: "var(--indigo)" }}>
                  {c.projectCount} Works
                </div>
              </div>

              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Historical Delay Rate</span>
                <div style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  marginTop: "2px",
                  color: c.delayRate > 35 ? "var(--terracotta)" : c.delayRate > 20 ? "var(--saffron)" : "var(--sage)"
                }}>
                  {c.delayRate}%
                </div>
              </div>

              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Cancellation Rate</span>
                <div style={{ fontWeight: 600, fontSize: "15px", marginTop: "2px" }}>
                  {c.cancellationRate}%
                </div>
              </div>

              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Operating States</span>
                <div style={{ fontWeight: 500, fontSize: "12px", marginTop: "2px" }}>
                  {c.states.join(", ")}
                </div>
              </div>
            </div>

            {/* Connected Entity / Network Warning */}
            <div style={{ background: "var(--paper-light)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "3px", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--indigo)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Network size={13} /> Connected Entities & Director Links (MCA21 Graph)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {c.connectedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      background: ent.includes("Flag") || ent.includes("Pattern") ? "rgba(169,87,68,0.12)" : "var(--paper-deep)",
                      color: ent.includes("Flag") || ent.includes("Pattern") ? "var(--terracotta)" : "var(--ink)",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontWeight: 500
                    }}
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Projects & Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                Linked Works: <strong>{c.linkedProjects.join(", ")}</strong>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link href={`/ai-investigator?q=Analyze contractor ${c.name} (${c.id}) for bid collusion, delays, and related entity networks`} className="ledger-btn-primary">
                  <Bot size={12} />
                  <span>Investigate Vendor</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PlatformLayout>
  );
}
