import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_CONTRACTS } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  Search,
  SlidersHorizontal
} from "lucide-react";

export default function ContractsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredContracts = MOCK_CONTRACTS.filter(c => {
    if (statusFilter !== "All" && c.completionStatus !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.contractorName.toLowerCase().includes(q) ||
        c.projectId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PlatformLayout
      moduleNumber="04"
      moduleName="Contracts & Disbursement Audit Register"
      subTitle="Executed Contracts & Milestone Cashflow Tracking"
      actions={
        <Link href="/verify" className="ledger-btn-secondary">
          <SlidersHorizontal size={13} />
          <span>Voucher Reconciliation</span>
        </Link>
      }
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Execution & Treasury Tracking</div>
        <h1>Contracts, Milestone Vouchers & Timeline Delay Register</h1>
        <p>
          Reconciles contract agreement values against PFMS electronic treasury disbursements,
          contractor delay penalties, milestone completion certificates, and cost escalations.
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
              placeholder="Search contract ID, vendor, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="ledger-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Execution Statuses</option>
            <option value="Delayed">Delayed</option>
            <option value="Executed">Executed</option>
            <option value="On Schedule">On Schedule</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{filteredContracts.length}</strong> contracts
        </div>
      </div>

      {/* Contracts Table */}
      <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Linked Project</th>
              <th>Awarded Contractor</th>
              <th>Award Value</th>
              <th>Timeline (Start / End)</th>
              <th>Execution Delay</th>
              <th>Cost Variance</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.id}</strong></td>
                <td>
                  <Link href={`/projects/${c.projectId}`} style={{ color: "var(--indigo)", fontWeight: 600 }}>
                    {c.projectId}
                  </Link>
                </td>
                <td>
                  <Link href="/contractors" style={{ fontWeight: 500 }}>
                    {c.contractorName}
                  </Link>
                </td>
                <td><strong>₹{c.awardValue.toFixed(1)} L</strong></td>
                <td>
                  <div style={{ fontSize: "11px" }}>{c.startDate}</div>
                  <small style={{ color: "var(--ink-muted)" }}>to {c.endDate}</small>
                </td>
                <td>
                  <span style={{
                    fontWeight: 600,
                    color: c.delayDays > 60 ? "var(--terracotta)" : c.delayDays > 0 ? "var(--saffron)" : "var(--sage)"
                  }}>
                    {c.delayDays > 0 ? `${c.delayDays} days delay` : "On Schedule"}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontWeight: 600,
                    color: c.costVariance > 10 ? "var(--terracotta)" : c.costVariance > 0 ? "var(--saffron)" : "var(--sage)"
                  }}>
                    {c.costVariance > 0 ? `+${c.costVariance.toFixed(1)}%` : `${c.costVariance.toFixed(1)}%`}
                  </span>
                </td>
                <td>
                  <span className={`risk-pill risk-pill-${c.riskLevel}`}>
                    {c.riskScore} • {c.riskLevel}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>{c.completionStatus}</span>
                </td>
                <td>
                  <Link
                    href={`/ai-investigator?q=Inspect payment vouchers and execution delay on contract ${c.id}`}
                    className="ledger-btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "10px" }}
                  >
                    <Bot size={11} />
                    <span>Audit Trail</span>
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
