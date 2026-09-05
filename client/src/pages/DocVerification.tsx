import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_DOC_VERIFICATION_ITEMS, DocumentVerificationItem } from "@/lib/data/mockData";
import { api } from "@/lib/api";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Upload
} from "lucide-react";

export default function DocVerification() {
  const [items, setItems] = useState<DocumentVerificationItem[]>(MOCK_DOC_VERIFICATION_ITEMS);
  const [selectedItem, setSelectedItem] = useState<DocumentVerificationItem>(items[0]);

  // Test custom reconciliation state
  const [unitPrice, setUnitPrice] = useState(4880);
  const [benchmarkPrice, setBenchmarkPrice] = useState(4120);
  const [bid1, setBid1] = useState(168.2);
  const [bid2, setBid2] = useState(171.0);
  const [phyProgress, setPhyProgress] = useState(60);
  const [finUtil, setFinUtil] = useState(88);
  const [delayRate, setDelayRate] = useState(38);
  const [simResult, setSimResult] = useState<any>(null);

  const runSimulation = () => {
    const res = api.detectAnomalies({
      unitPrice,
      benchmarkPrice,
      bids: [bid1, bid2],
      physicalProgress: phyProgress,
      financialUtilization: finUtil,
      contractorDelayRate: delayRate
    });
    setSimResult(res);
  };

  return (
    <PlatformLayout
      moduleNumber="09"
      moduleName="Document Verification & Reconciliation Engine"
      subTitle="Voucher Mismatch & Measurement Book Cross-Verification"
      actions={
        <Link href="/reports" className="ledger-btn-secondary">
          <FileSpreadsheet size={13} />
          <span>Audit Reconciliation Summary</span>
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Forensic Document Audit</div>
        <h1>Structured Document Reconciliation & Mismatch Detection</h1>
        <p>
          Cross-examines contractor tax invoices and Measurement Books (MB) against statutory District Schedule of Rates (DSR),
          CPPP bid sheets, and PFMS disbursement records to spot quantity inflation and unit-rate deviations.
        </p>
      </div>

      {/* Two Column Layout: Document Verification Queue + Detail Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        {/* Verification Queue */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Audited Document Registry</h3>
              <small style={{ color: "var(--ink-muted)" }}>Select a document to inspect field-level mismatches</small>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--indigo)" }}>
              {items.length} Documents
            </span>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {items.map((item) => {
              const isSelected = selectedItem.id === item.id;
              const isDiscrepancy = item.status !== "Reconciled";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    background: isSelected ? "var(--paper-light)" : "var(--paper)",
                    border: isSelected ? "1.5px solid var(--indigo)" : "1px solid var(--line)",
                    padding: "14px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    transition: "all .16s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileCheck size={16} color={isDiscrepancy ? "var(--terracotta)" : "var(--sage)"} />
                      <strong style={{ fontSize: "13px" }}>{item.refNumber}</strong>
                    </div>
                    <span className={`risk-pill ${isDiscrepancy ? "risk-pill-high" : "risk-pill-normal"}`}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                    Type: {item.documentType} • Sanction: {item.sanctionId}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink)", marginTop: "4px" }}>
                    Contractor: <strong>{item.contractorName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10px", color: "var(--ink-muted)" }}>
                    <span>Matched: {item.matchedFields}/{item.totalFields} Fields</span>
                    <span style={{ color: isDiscrepancy ? "var(--terracotta)" : "var(--sage)", fontWeight: 700 }}>
                      {item.mismatches.length} Mismatches Flagged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Breakdown */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Field Reconciliation: {selectedItem.refNumber}</h3>
              <small style={{ color: "var(--ink-muted)" }}>{selectedItem.documentType} • {selectedItem.contractorName}</small>
            </div>
            <span className={`risk-pill ${selectedItem.status === "Reconciled" ? "risk-pill-normal" : "risk-pill-high"}`}>
              {selectedItem.status}
            </span>
          </div>

          {selectedItem.mismatches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 20px", background: "rgba(112,139,120,0.08)", borderRadius: "3px" }}>
              <CheckCircle2 size={32} color="var(--sage)" style={{ margin: "0 auto 10px" }} />
              <h4 style={{ margin: "0 0 6px", fontFamily: "Fraunces, serif" }}>Complete Verification Match</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-muted)" }}>
                All {selectedItem.matchedFields} extracted fields match the baseline rate schedule, GPS coordinates, and sanctioned voucher milestones.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--terracotta)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={13} /> {selectedItem.mismatches.length} Discrepancies Detected Against Baseline:
              </div>

              {selectedItem.mismatches.map((m, idx) => (
                <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "3px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: "6px" }}>
                    <span>{m.field}</span>
                    <span style={{ color: "var(--terracotta)" }}>{m.variance}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "var(--ink-muted)" }}>
                    <div>Baseline / Database: <strong style={{ color: "var(--ink)" }}>{m.dbValue}</strong></div>
                    <div>Extracted Document: <strong style={{ color: "var(--terracotta)" }}>{m.docValue}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Action */}
          <div style={{ background: "var(--paper-deep)", padding: "14px", borderRadius: "3px", marginTop: "16px", fontSize: "12px" }}>
            <strong style={{ color: "var(--indigo)" }}>Auditor Recommendation:</strong>
            <p style={{ margin: "4px 0 0", color: "var(--ink)" }}>{selectedItem.recommendedAction}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <Link
              href={`/ai-investigator?q=Analyze discrepancy in document ${selectedItem.refNumber} for project ${selectedItem.sanctionId}`}
              className="ledger-btn-primary"
            >
              <Bot size={12} />
              <span>Interrogate with AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Anomaly Calculator Tool */}
      <div className="ledger-card" style={{ marginBottom: 0 }}>
        <div className="ledger-card-header">
          <div>
            <h3>Interactive Anomaly Calculation Sandbox</h3>
            <small style={{ color: "var(--ink-muted)" }}>
              Test custom procurement parameters to compute composite risk scores and verify audit rules
            </small>
          </div>
          <button onClick={runSimulation} className="ledger-btn-primary">
            <RefreshCw size={12} />
            <span>Compute Risk Score</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              Invoiced Unit Rate (₹)
            </label>
            <input
              type="number"
              className="ledger-search-input"
              style={{ paddingLeft: "10px" }}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              DSR Benchmark Rate (₹)
            </label>
            <input
              type="number"
              className="ledger-search-input"
              style={{ paddingLeft: "10px" }}
              value={benchmarkPrice}
              onChange={(e) => setBenchmarkPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              Physical Progress (%)
            </label>
            <input
              type="number"
              className="ledger-search-input"
              style={{ paddingLeft: "10px" }}
              value={phyProgress}
              onChange={(e) => setPhyProgress(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              Financial Release (%)
            </label>
            <input
              type="number"
              className="ledger-search-input"
              style={{ paddingLeft: "10px" }}
              value={finUtil}
              onChange={(e) => setFinUtil(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Output Result */}
        {simResult && (
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "16px 20px", borderRadius: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <span className={`risk-pill risk-pill-${simResult.riskLevel}`}>
                  Score {simResult.compositeScore} / 100 • {simResult.riskLevel}
                </span>
                <span style={{ fontSize: "12px", marginLeft: "12px", color: "var(--ink-muted)" }}>
                  Price Variance: <strong>{simResult.priceVariance}</strong> • Disparity: <strong>{simResult.progressDisparity}</strong>
                </span>
              </div>
            </div>

            <div style={{ fontSize: "12px", marginBottom: "10px" }}>
              <strong>Signal Findings:</strong>
              <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                {simResult.findings.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <p style={{ margin: 0, fontSize: "12px", color: "var(--indigo)", fontWeight: 600 }}>
              Action: {simResult.recommendation}
            </p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
