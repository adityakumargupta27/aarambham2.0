import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_TENDERS } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Calendar,
  FileCheck2,
  Scale,
  Search,
  Users
} from "lucide-react";

export default function TendersList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenders = MOCK_TENDERS.filter(t => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.projectId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <PlatformLayout
      moduleNumber="03"
      moduleName="Tenders & Bidding Intelligence"
      subTitle="Bid Collusion & Cartel Rotation Surveillance"
      actions={
        <Link href="/contracts" className="ledger-btn-secondary">
          <span>Contracts Module</span>
          <ArrowUpRight size={13} />
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> e-Procurement Audit</div>
        <h1>Tenders & Competitive Bidding Integrity Register</h1>
        <p>
          Continuous screening for anti-competitive bidding practices under Competition Act 2002:
          artificially low bidder turnouts, narrow bid spreads (&lt;2%), identical bidder pair submissions, and single-bidder awards.
        </p>
      </div>

      {/* Filter bar */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <div className="ledger-search-box">
            <Search size={14} />
            <input
              type="text"
              className="ledger-search-input"
              placeholder="Search tender title, ID, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{filteredTenders.length}</strong> public procurement tenders
        </div>
      </div>

      {/* Tenders Grid */}
      <div style={{ display: "grid", gap: "18px" }}>
        {filteredTenders.map((t) => (
          <div key={t.id} className="ledger-card" style={{ marginBottom: 0 }}>
            <div className="ledger-card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <strong>{t.id}</strong>
                  <span className={`risk-pill ${t.riskScore > 75 ? "risk-pill-high" : "risk-pill-normal"}`}>
                    Risk Score: {t.riskScore} • {t.status}
                  </span>
                </div>
                <h3>{t.title}</h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Estimated Value</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "var(--indigo)", fontWeight: 600 }}>
                  ₹{t.estimatedValue.toFixed(1)} Lakhs
                </div>
              </div>
            </div>

            {/* Bidding Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 16px", borderRadius: "3px", marginBottom: "16px", fontSize: "12px" }}>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Bidders Received</span>
                <div style={{ fontWeight: 600, marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={14} /> {t.bidderCount} {t.bidderCount === 1 ? "(Single Bid Alert!)" : "Vendors"}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Bid Spread</span>
                <div style={{ fontWeight: 600, marginTop: "2px", color: t.bidSpread < 2.0 && t.bidderCount > 1 ? "var(--terracotta)" : "var(--ink)" }}>
                  {t.bidSpread.toFixed(1)}% {t.bidSpread < 2.0 && t.bidderCount > 1 ? "(Suspicious Spread)" : ""}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Notice Published</span>
                <div style={{ fontWeight: 500, marginTop: "2px" }}>{t.publishedDate}</div>
              </div>
              <div>
                <span style={{ color: "var(--ink-muted)", fontSize: "10px", textTransform: "uppercase" }}>Bids Closed</span>
                <div style={{ fontWeight: 500, marginTop: "2px" }}>{t.closingDate}</div>
              </div>
            </div>

            {/* Risk Signals Alert Box */}
            {t.riskSignals.length > 0 && (
              <div style={{ background: "rgba(216,138,53,0.08)", border: "1px solid rgba(216,138,53,0.3)", padding: "12px 14px", borderRadius: "3px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--saffron)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={12} /> Detected Forensic Signals
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--ink)" }}>
                  {t.riskSignals.map((sig, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>{sig}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bids Comparative Table */}
            <div style={{ fontSize: "12px" }}>
              <div style={{ fontWeight: 600, marginBottom: "8px", color: "var(--ink-muted)", fontSize: "11px", textTransform: "uppercase" }}>
                Submitted Commercial Quotes
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                {t.bids.map((b, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: b.isWinning ? "rgba(112,139,120,0.1)" : "var(--paper-light)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 5px", background: b.isWinning ? "var(--sage)" : "var(--paper-deep)", color: b.isWinning ? "#fff" : "var(--ink)", borderRadius: "2px" }}>
                        {b.isWinning ? "L1 (Awarded)" : `L${idx + 1}`}
                      </span>
                      <span style={{ fontWeight: 600 }}>{b.bidderName}</span>
                    </div>
                    <strong>₹{b.amount.toFixed(1)} Lakhs</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
              <Link href={`/projects/${t.projectId}`} className="ledger-btn-secondary">
                <span>View Linked Project ({t.projectId})</span>
                <ArrowUpRight size={12} />
              </Link>
              <Link href={`/ai-investigator?q=Analyze tender ${t.id} for potential bid rigging or collusion indicators`} className="ledger-btn-primary">
                <Bot size={12} />
                <span>Interrogate with AI</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PlatformLayout>
  );
}
