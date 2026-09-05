import { useState } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { PLATFORM_MACRO_METRICS, MOCK_PROJECTS } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FolderKanban,
  Landmark,
  Scale,
  ShieldAlert
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function Overview() {
  const [selectedState, setSelectedState] = useState("All");
  const [selectedFy, setSelectedFy] = useState("2024-25");

  const metrics = PLATFORM_MACRO_METRICS;
  const pieColors = ["#708b78", "#d88a35", "#e3a157", "#a95744"];

  const filteredStateData = selectedState === "All"
    ? metrics.stateMetrics
    : metrics.stateMetrics.filter(s => s.state === selectedState);

  return (
    <PlatformLayout
      moduleNumber="00"
      moduleName="Overview"
      subTitle="Public Procurement & Fund Oversight Telemetry"
      actions={
        <Link href="/reports" className="ledger-btn-secondary">
          <Download size={13} />
          <span>Export Dossier</span>
        </Link>
      }
    >
      {/* Title & Scope */}
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Master Oversight Control</div>
        <h1>Public Procurement & MPLADS Allocation Overview</h1>
        <p>
          Continuous tracking layer cross-referencing parliamentary fund releases, municipal tenders,
          contractor execution timelines, and algorithmic anomaly signals across India's constituencies.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="ledger-metrics-grid">
        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Total Projects</span>
            <FolderKanban size={14} color="var(--indigo)" />
          </div>
          <div className="metric-val">{metrics.totalProjects.toLocaleString()}</div>
          <div className="metric-caption">4,912 active in execution</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Procurement Tracked</span>
            <Landmark size={14} color="var(--saffron)" />
          </div>
          <div className="metric-val">₹{metrics.aggregateProcurementValueCr.toLocaleString()} Cr</div>
          <div className="metric-caption">Sanctioned via 543 constituencies</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Contracts Awarded</span>
            <FileCheck2 size={14} color="var(--indigo)" />
          </div>
          <div className="metric-val">{metrics.contractsAwarded.toLocaleString()}</div>
          <div className="metric-caption">Across 12,380 public tenders</div>
        </div>

        <div className="ledger-metric-card" style={{ borderColor: "rgba(169,87,68,0.4)" }}>
          <div className="metric-kicker">
            <span style={{ color: "var(--terracotta)" }}>High Priority Reviews</span>
            <ShieldAlert size={14} color="var(--terracotta)" />
          </div>
          <div className="metric-val" style={{ color: "var(--terracotta)" }}>{metrics.highPriorityReviews}</div>
          <div className="metric-caption">Require immediate human audit</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
            Data Filters:
          </span>
          <select
            className="ledger-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All States & UTs</option>
            {metrics.stateMetrics.map(s => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>
          <select
            className="ledger-select"
            value={selectedFy}
            onChange={(e) => setSelectedFy(e.target.value)}
          >
            <option value="2024-25">FY 2024–25 (Active)</option>
            <option value="2023-24">FY 2023–24</option>
            <option value="2022-23">FY 2022–23</option>
          </select>
        </div>

        <div className="filter-group">
          <Link href="/mps" className="ledger-btn-secondary">
            <Landmark size={12} />
            <span>543 Lok Sabha Seats</span>
          </Link>
          <Link href="/risk" className="ledger-btn-primary">
            <ShieldAlert size={12} />
            <span>Risk Matrix</span>
          </Link>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Risk Distribution Donut */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Risk Classification Breakdown</h3>
              <small style={{ color: "var(--ink-muted)", fontSize: "11px" }}>Total 18,742 tracked records</small>
            </div>
            <Link href="/risk" style={{ fontSize: "11px", color: "var(--indigo)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              Explore <ArrowUpRight size={12} />
            </Link>
          </div>
          <div style={{ height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {metrics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fbf8f2", border: "1px solid rgba(39,59,115,0.2)", fontSize: "11px" }}
                  formatter={(val: number) => [`${val.toLocaleString()} records`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginTop: "10px", fontSize: "11px" }}>
            {metrics.riskDistribution.map((r, idx) => (
              <div key={r.level} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: pieColors[idx] }} />
                <span>{r.level}: <strong>{r.percentage}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Trend Timeline */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Risk Signals Detected Over Time</h3>
              <small style={{ color: "var(--ink-muted)", fontSize: "11px" }}>Bi-monthly audit ingestion trend</small>
            </div>
            <span style={{ fontSize: "11px", color: "var(--saffron)", fontWeight: 600 }}>Rolling 12 Months</span>
          </div>
          <div style={{ height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="rgba(39,59,115,0.4)" />
                <YAxis tick={{ fontSize: 10 }} stroke="rgba(39,59,115,0.4)" />
                <Tooltip contentStyle={{ background: "#fbf8f2", border: "1px solid rgba(39,59,115,0.2)", fontSize: "11px" }} />
                <Area type="monotone" dataKey="totalFlagged" stroke="#273b73" fill="#273b73" fillOpacity={0.15} name="Total Flagged" />
                <Area type="monotone" dataKey="highRisk" stroke="#a95744" fill="#a95744" fillOpacity={0.4} name="High Priority" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px", color: "var(--ink-muted)" }}>
            <span>• Indigo: Total Anomalies</span>
            <span>• Terracotta: High Priority Escalations</span>
          </div>
        </div>
      </div>

      {/* State Breakdown Bar Chart */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>State-Level Public Works & Risk Allocation</h3>
            <small style={{ color: "var(--ink-muted)", fontSize: "11px" }}>Tracked value (₹ Cr) vs High-Priority Flag Rate</small>
          </div>
          <Link href="/mps" style={{ fontSize: "11px", color: "var(--indigo)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
            View All State Tables <ArrowUpRight size={12} />
          </Link>
        </div>
        <div style={{ height: "240px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredStateData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="state" tick={{ fontSize: 10 }} stroke="rgba(39,59,115,0.4)" />
              <YAxis tick={{ fontSize: 10 }} stroke="rgba(39,59,115,0.4)" />
              <Tooltip contentStyle={{ background: "#fbf8f2", border: "1px solid rgba(39,59,115,0.2)", fontSize: "11px" }} />
              <Bar dataKey="valueCr" fill="#273b73" name="Sanctioned Value (₹ Cr)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="highRiskCases" fill="#d88a35" name="Flagged Risk Cases" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Review Queue Table */}
      <div className="ledger-card" style={{ marginBottom: 0 }}>
        <div className="ledger-card-header">
          <div>
            <h3>Active Priority Review Queue</h3>
            <small style={{ color: "var(--ink-muted)", fontSize: "11px" }}>Highest priority records flagged for auditor or vigilance action</small>
          </div>
          <Link href="/investigations" className="ledger-btn-secondary">
            <span>Investigation Centre ({metrics.highPriorityReviews})</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="ledger-table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Work / Constituency</th>
                <th>Contractor</th>
                <th>Sanctioned Value</th>
                <th>Progress (Phy/Fin)</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROJECTS.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <small style={{ color: "var(--ink-muted)" }}>{p.constituency}, {p.state} • {p.projectType}</small>
                  </td>
                  <td>{p.contractorName}</td>
                  <td>₹{p.sanctionedAmount.toFixed(1)} L</td>
                  <td>
                    <div className="progress-track-wrap">
                      <div className="progress-track-header">
                        <span>P: {p.physicalProgress}%</span>
                        <span>F: {p.financialUtilization}%</span>
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
                    <span className={`risk-pill risk-pill-${p.riskLevel}`}>
                      Score {p.riskScore} • {p.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "11px", fontWeight: 600 }}>{p.status}</span>
                  </td>
                  <td>
                    <Link href={`/projects/${p.id}`} className="ledger-btn-secondary" style={{ padding: "4px 8px", fontSize: "10px" }}>
                      <span>Project 360</span>
                      <ArrowUpRight size={11} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformLayout>
  );
}
