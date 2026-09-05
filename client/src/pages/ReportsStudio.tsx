import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import {
  MOCK_PROJECTS,
  MOCK_CONTRACTORS,
  MOCK_INVESTIGATIONS,
  LOK_SABHA_MPS,
  PLATFORM_MACRO_METRICS
} from "@/lib/data/mockData";
import {
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Landmark,
  Printer,
  ShieldAlert
} from "lucide-react";

type ReportType =
  | "investigation-brief"
  | "risk-summary"
  | "constituency-allocation"
  | "contractor-profile"
  | "project-360"
  | "high-priority-review";

export default function ReportsStudio() {
  const [activeReport, setActiveReport] = useState<ReportType>("investigation-brief");

  const printReport = () => {
    window.print();
  };

  const downloadCSV = () => {
    let csv = "";
    let filename = "";
    if (activeReport === "constituency-allocation") {
      csv = "ID,Constituency,MP,State,Allocated (Cr),Expenditure (Cr),Unspent (Cr)\n" +
        LOK_SABHA_MPS.slice(0, 50).map(m => `"${m.id}","${m.constituency}","${m.mpName}","${m.state}",${m.allocatedAmount},${m.expenditure},${m.carriedForward}`).join("\n");
      filename = "AARAMBHA_Constituency_Allocations.csv";
    } else if (activeReport === "contractor-profile") {
      csv = "ID,Name,Projects,Total Value (Lakhs),Delay Rate (%),Risk Score\n" +
        MOCK_CONTRACTORS.map(c => `"${c.id}","${c.name}",${c.projectCount},${c.totalContractValue},${c.delayRate},${c.riskScore}`).join("\n");
      filename = "AARAMBHA_Contractor_Profiles.csv";
    } else {
      csv = "ID,Name,Constituency,Sanctioned (Lakhs),Awarded (Lakhs),Phy %,Fin %,Risk Score\n" +
        MOCK_PROJECTS.map(p => `"${p.id}","${p.name}","${p.constituency}",${p.sanctionedAmount},${p.awardValue},${p.physicalProgress},${p.financialUtilization},${p.riskScore}`).join("\n");
      filename = `AARAMBHA_${activeReport}.csv`;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PlatformLayout
      moduleNumber="10"
      moduleName="Statutory Reports Studio"
      subTitle="Audit Dossiers, PAC Submissions & Parliamentary Briefs"
      actions={
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={printReport} className="ledger-btn-secondary">
            <Printer size={13} />
            <span>Print / Save PDF</span>
          </button>
          <button onClick={downloadCSV} className="ledger-btn-primary">
            <Download size={13} />
            <span>Download CSV Data</span>
          </button>
        </div>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Audit Documentation Engine</div>
        <h1>Statutory Audit Reports & Executive Summaries</h1>
        <p>
          Standardized report templates designed for submission to District Collectors, State Vigilance Directorates,
          the Public Accounts Committee (PAC), and the Comptroller & Auditor General (CAG).
        </p>
      </div>

      {/* Report Template Selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {[
          { id: "investigation-brief", label: "Investigation Brief (Case #04-17)" },
          { id: "risk-summary", label: "Executive Risk Summary" },
          { id: "constituency-allocation", label: "Constituency Allocation Audit" },
          { id: "contractor-profile", label: "Contractor Risk Profiles" },
          { id: "project-360", label: "Project 360 Audit Sheet" },
          { id: "high-priority-review", label: "High-Priority Review Queue" },
        ].map((tpl) => {
          const isActive = activeReport === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setActiveReport(tpl.id as ReportType)}
              className="ledger-btn-secondary"
              style={{
                background: isActive ? "var(--indigo)" : "var(--paper-light)",
                color: isActive ? "var(--paper)" : "var(--ink)",
                borderColor: isActive ? "var(--indigo)" : "var(--line)",
                padding: "8px 14px",
                fontSize: "11px"
              }}
            >
              <span>{tpl.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Sheet Wrapper */}
      <div style={{
        background: "var(--paper-light)",
        border: "1px solid var(--line)",
        padding: "36px 40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        fontFamily: "DM Sans, sans-serif"
      }}>
        {/* Document Letterhead */}
        <div style={{ borderBottom: "2px solid var(--indigo)", paddingBottom: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--indigo)", fontWeight: 700 }}>
              AARAMBHA CIVIC AUDIT & OVERSIGHT LAYER
            </div>
            <h2 style={{ margin: "6px 0 0", fontFamily: "Fraunces, serif", fontSize: "24px", color: "var(--ink)" }}>
              {activeReport === "investigation-brief" && "FORMAL INVESTIGATION BRIEF / CASE 04—17"}
              {activeReport === "risk-summary" && "NATIONAL PROCUREMENT RISK TELEMETRY REPORT"}
              {activeReport === "constituency-allocation" && "PARLIAMENTARY MPLADS CONSTITUENCY FUND AUDIT"}
              {activeReport === "contractor-profile" && "VENDOR RISK ASSESSMENT & DELAY REGISTER"}
              {activeReport === "project-360" && "PROJECT 360 TECHNICAL & FINANCIAL RECONCILIATION"}
              {activeReport === "high-priority-review" && "HIGH-PRIORITY ESCALATION AUDIT QUEUE"}
            </h2>
          </div>

          <div style={{ textAlign: "right", fontSize: "11px", color: "var(--ink-muted)" }}>
            <div>Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
            <div>Ref: AAR-REP-{Date.now().toString().slice(-6)}</div>
            <div>Classification: <strong>Auditor Confidential</strong></div>
          </div>
        </div>

        {/* Dynamic Content based on Active Report */}
        {activeReport === "investigation-brief" && (
          <div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "16px", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 6px", fontFamily: "Fraunces, serif" }}>Subject: Rohania Community Center Unit Cost Inflation & Bid Collusion</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>
                Audit inquiry regarding Contract #CNT-2024-001 awarded to Shree Ganesh Infra & Buildcon LLP for ₹168.2 Lakhs.
                Field measurements and corporate registry linkages indicate substantive grounds for proceedings under Rule 151(iii) of GFR 2017.
              </p>
            </div>

            <h4 style={{ fontFamily: "Fraunces, serif", marginBottom: "8px" }}>Key Findings Summary</h4>
            <ul style={{ fontSize: "13px", lineHeight: 1.6, paddingLeft: "20px", marginBottom: "20px" }}>
              <li><strong>Narrow Bid Spread: </strong> Winning bidder exceeded second bidder by merely 1.6% in a 2-bidder contest.</li>
              <li><strong>Common Address Footprint: </strong> L1 and L2 bidders share registered corporate office address and legal counsel in MCA21 filings.</li>
              <li><strong>Physical-to-Invoiced Disparity: </strong> Drone surveillance confirms roof completion at 60%, conflicting with contractor's billed 85% claim.</li>
              <li><strong>Rate Deviation: </strong> Unit rates for M30 grade concrete invoiced at ₹4,880/cu.m against approved DSR rate of ₹4,120/cu.m (+18.4%).</li>
            </ul>

            <h4 style={{ fontFamily: "Fraunces, serif", marginBottom: "8px" }}>Formal Auditor Recommendation</h4>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--ink)" }}>
              It is recommended to immediately withhold the final milestone payment of ₹42.05 Lakhs, issue a formal Show Cause Notice,
              and refer the matter to the State Vigilance Directorate for forensic audit.
            </p>
          </div>
        )}

        {activeReport === "risk-summary" && (
          <div>
            <p style={{ fontSize: "13px", color: "var(--ink)", marginBottom: "20px" }}>
              Comprehensive snapshot across 18,742 projects and ₹24,180.5 Cr in tracked procurement.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
              <div style={{ background: "var(--paper)", padding: "12px", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)", textTransform: "uppercase" }}>High Priority</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--terracotta)" }}>384 Records</div>
              </div>
              <div style={{ background: "var(--paper)", padding: "12px", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)", textTransform: "uppercase" }}>Review Required</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--saffron)" }}>1,968 Records</div>
              </div>
              <div style={{ background: "var(--paper)", padding: "12px", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)", textTransform: "uppercase" }}>Watch List</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--indigo)" }}>3,980 Records</div>
              </div>
              <div style={{ background: "var(--paper)", padding: "12px", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)", textTransform: "uppercase" }}>Normal Range</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--sage)" }}>12,410 Records</div>
              </div>
            </div>
          </div>
        )}

        {activeReport === "constituency-allocation" && (
          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Constituency</th>
                  <th>Member of Parliament</th>
                  <th>State</th>
                  <th>Allocated Baseline</th>
                  <th>Expenditure</th>
                  <th>Unspent Carried-Forward</th>
                </tr>
              </thead>
              <tbody>
                {LOK_SABHA_MPS.slice(0, 8).map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.constituency}</strong></td>
                    <td>{m.mpName}</td>
                    <td>{m.state}</td>
                    <td>₹{m.allocatedAmount.toFixed(1)} Cr</td>
                    <td>₹{m.expenditure.toFixed(1)} Cr</td>
                    <td><strong>₹{m.carriedForward.toFixed(2)} Cr</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === "contractor-profile" && (
          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Registration</th>
                  <th>Projects</th>
                  <th>Total Contract Volume</th>
                  <th>Historical Delay Rate</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CONTRACTORS.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.registrationNumber}</td>
                    <td>{c.projectCount}</td>
                    <td>₹{(c.totalContractValue / 100).toFixed(2)} Cr</td>
                    <td><strong style={{ color: c.delayRate > 30 ? "var(--terracotta)" : "var(--sage)" }}>{c.delayRate}%</strong></td>
                    <td><span className={`risk-pill risk-pill-${c.riskLevel}`}>{c.riskScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === "project-360" && (
          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Name</th>
                  <th>Constituency</th>
                  <th>Sanctioned Amount</th>
                  <th>Award Value</th>
                  <th>Progress</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PROJECTS.slice(0, 6).map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.constituency}</td>
                    <td>₹{p.sanctionedAmount.toFixed(1)} L</td>
                    <td>₹{p.awardValue.toFixed(1)} L</td>
                    <td>P: {p.physicalProgress}% / F: {p.financialUtilization}%</td>
                    <td><span className={`risk-pill risk-pill-${p.riskLevel}`}>{p.riskScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === "high-priority-review" && (
          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Work Name</th>
                  <th>Risk Score</th>
                  <th>Contractor</th>
                  <th>Flagged Deviation</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PROJECTS.filter(p => p.riskLevel === "high" || p.riskLevel === "review").map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.name}</td>
                    <td><span className={`risk-pill risk-pill-${p.riskLevel}`}>{p.riskScore} • {p.riskLevel}</span></td>
                    <td>{p.contractorName}</td>
                    <td>
                      <span style={{ color: "var(--terracotta)", fontWeight: 600 }}>
                        {p.riskScore > 80 ? "Unit rate deviation +18.4% above DSR" : "Progress lagging disbursement by 36%"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature & Disclaimer Footer */}
        <div style={{ marginTop: "36px", paddingTop: "20px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "11px", color: "var(--ink-muted)" }}>
          <div>
            <div>Authenticated by AARAMBHA Civic Audit Engine</div>
            <div>Statutory Reference: GFR 2017 & CVC Procurement Guidelines</div>
          </div>
          <div style={{ textAlign: "right", borderTop: "1px dotted var(--ink)", paddingTop: "6px", width: "180px" }}>
            Investigating Officer Signature
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
