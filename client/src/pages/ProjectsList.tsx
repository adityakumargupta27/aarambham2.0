import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_PROJECTS, Project } from "@/lib/data/mockData";
import { useEvidence } from "@/contexts/EvidenceContext";
import { calculateProcurementRisk } from "@/lib/riskCalculator";
import {
  ArrowUpRight,
  Bot,
  Calculator,
  Filter,
  FolderKanban,
  Search,
  ShieldAlert
} from "lucide-react";

export default function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const { openDrawer } = useEvidence();

  const handleExplainScore = (project: Project) => {
    const priceDevPct = ((project.awardValue - project.sanctionedAmount) / project.sanctionedAmount) * 100;
    const progressDisparity = project.financialUtilization - project.physicalProgress;
    const riskCalc = calculateProcurementRisk({
      priceDeviationPct: Math.max(0, priceDevPct),
      progressDisparityPct: Math.max(0, progressDisparity),
      bidSpreadPct: project.riskScore > 75 ? 1.5 : 12.5,
      contractorDelayRatePct: project.riskScore > 70 ? 38.0 : 8.0
    });

    openDrawer({
      title: `Project Risk Audit: ${project.name}`,
      recordId: project.id,
      entityType: "Project / Work",
      provenance: "derived_calculation",
      sourceName: "District Works Portal & Technical Sanction Register",
      sourceUrl: "https://mplads.gov.in",
      verifiedAt: `${project.sanctionDate} (Sanction baseline)`,
      fields: [
        { name: "Project ID", value: project.id, provenance: "official_verified" },
        { name: "Project Title", value: project.name, provenance: "official_verified" },
        { name: "Constituency", value: `${project.constituency}, ${project.state}`, provenance: "official_verified" },
        { name: "Contractor", value: project.contractorName, provenance: "official_verified" },
        { name: "Sanctioned Estimate", value: `₹${project.sanctionedAmount.toFixed(2)} Lakhs`, provenance: "official_verified" },
        { name: "Awarded Contract Value", value: `₹${project.awardValue.toFixed(2)} Lakhs`, provenance: "official_verified" },
        { name: "Physical Completion", value: `${project.physicalProgress}%`, provenance: "derived_calculation" },
        { name: "Financial Released", value: `${project.financialUtilization}%`, provenance: "derived_calculation" },
        { name: "Progress Disparity Gap", value: `${progressDisparity > 0 ? `+${progressDisparity}%` : `${progressDisparity}%`}`, provenance: "derived_calculation" }
      ],
      riskCalculation: riskCalc,
      findings: [
        `Deterministic Risk Score: ${riskCalc.compositeScore}/100 (${riskCalc.riskLevel.toUpperCase()}).`,
        `Financial disbursement (${project.financialUtilization}%) vs physical progress (${project.physicalProgress}%).`,
        `Contract price variance of ${priceDevPct.toFixed(1)}% compared to approved statutory sanction.`
      ],
      recommendation: riskCalc.recommendation
    });
  };

  const states = useMemo(() => {
    return Array.from(new Set(MOCK_PROJECTS.map(p => p.state))).sort();
  }, []);

  const projectTypes = useMemo(() => {
    return Array.from(new Set(MOCK_PROJECTS.map(p => p.projectType))).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      if (selectedState !== "All" && p.state !== selectedState) return false;
      if (selectedType !== "All" && p.projectType !== selectedType) return false;
      if (selectedRisk !== "All" && p.riskLevel !== selectedRisk.toLowerCase()) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.constituency.toLowerCase().includes(q) ||
          p.contractorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchTerm, selectedState, selectedType, selectedRisk]);

  return (
    <PlatformLayout
      moduleNumber="02"
      moduleName="Projects Directory & Execution Register"
      subTitle="Traceable Project-to-Contract Trail"
      actions={
        <Link href="/contracts" className="ledger-btn-secondary">
          <span>Contracts Module</span>
          <ArrowUpRight size={13} />
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Works & Infrastructure Register</div>
        <h1>MPLADS Projects & Physical-Financial Discrepancy Register</h1>
        <p>
          Every sanctioned works project is connected to its underlying tender, contractor, milestone disbursements,
          and physical completion indicators. Discrepancies between cash drawdown and ground execution trigger automatic audit alerts.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <div className="ledger-search-box">
            <Search size={14} />
            <input
              type="text"
              className="ledger-search-input"
              placeholder="Search works, ID, contractor, or constituency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="ledger-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="ledger-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Sectors / Types</option>
            {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            className="ledger-select"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Priority</option>
            <option value="Review">Review</option>
            <option value="Watch">Watch</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{filteredProjects.length}</strong> of <strong>{MOCK_PROJECTS.length}</strong> projects
        </div>
      </div>

      {/* Projects Table */}
      <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name & Details</th>
              <th>Sector</th>
              <th>Location</th>
              <th>Sanction / Award</th>
              <th>Progress (Phy vs Fin)</th>
              <th>Contractor</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 600, maxWidth: "260px" }}>{p.name}</div>
                  <small style={{ color: "var(--ink-muted)", fontSize: "10px" }}>
                    Sanctioned: {p.sanctionDate} • Target: {p.completionDate}
                  </small>
                </td>
                <td>{p.projectType}</td>
                <td>
                  <div>{p.constituency}</div>
                  <small style={{ color: "var(--ink-muted)" }}>{p.state}</small>
                </td>
                <td>
                  <div>₹{p.sanctionedAmount.toFixed(1)} L (Sanct.)</div>
                  <small style={{ color: "var(--ink-muted)" }}>₹{p.awardValue.toFixed(1)} L (Award)</small>
                </td>
                <td>
                  <div className="progress-track-wrap">
                    <div className="progress-track-header">
                      <span>Phy: {p.physicalProgress}%</span>
                      <span>Fin: {p.financialUtilization}%</span>
                    </div>
                    <div className="progress-track-bar">
                      <div
                        className={`progress-track-fill ${p.financialUtilization > p.physicalProgress + 20 ? "progress-track-fill-saffron" : ""}`}
                        style={{ width: `${p.physicalProgress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Link href={`/contractors`} style={{ color: "var(--indigo)", fontWeight: 500 }}>
                    {p.contractorName}
                  </Link>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className={`risk-pill risk-pill-${p.riskLevel}`}>
                      {p.riskScore} • {p.riskLevel}
                    </span>
                    <button
                      onClick={() => handleExplainScore(p)}
                      className="ledger-btn-secondary"
                      style={{ padding: "2px 6px", fontSize: "10px", height: "22px", gap: "3px" }}
                      title="Inspect deterministic formula breakdown in Evidence Drawer"
                    >
                      <Calculator size={10} />
                      <span>Explain</span>
                    </button>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>{p.status}</span>
                </td>
                <td>
                  <Link href={`/projects/${p.id}`} className="ledger-btn-primary" style={{ padding: "4px 8px", fontSize: "10px" }}>
                    <span>Project 360</span>
                    <ArrowUpRight size={11} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlatformLayout>
  );
}
