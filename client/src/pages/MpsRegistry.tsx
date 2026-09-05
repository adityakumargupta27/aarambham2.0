import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { ALL_PARLIAMENT_MPS, LOK_SABHA_MPS, RAJYA_SABHA_MPS, MPAllocation } from "@/lib/data/mockData";
import { EMPOWERED_INDIAN_TOTAL_CRORES, EMPOWERED_INDIAN_TOTAL_RUPEES } from "@/lib/data/empoweredIndianMps";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { ConstituencyDetailModal } from "@/components/ui/ConstituencyDetailModal";
import { CompareStudioModal } from "@/components/ui/CompareStudioModal";
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowUpDown,
  Bot,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Landmark,
  Search
} from "lucide-react";

export default function MpsRegistry() {
  const [activeTab, setActiveTab] = useState<"Lok Sabha" | "Rajya Sabha" | "All">("Lok Sabha");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [surplusOnly, setSurplusOnly] = useState(false);
  const [sortField, setSortField] = useState<"expenditure" | "carriedForward" | "constituency" | "state">("carriedForward");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMpModal, setSelectedMpModal] = useState<MPAllocation | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const pageSize = 20;

  // Derive unique states
  const states = useMemo(() => {
    const s = new Set<string>();
    ALL_PARLIAMENT_MPS.forEach(m => s.add(m.state));
    return Array.from(s).sort();
  }, []);

  // Filter & sort
  const filteredRecords = useMemo(() => {
    let dataset = activeTab === "Lok Sabha"
      ? LOK_SABHA_MPS
      : activeTab === "Rajya Sabha"
      ? RAJYA_SABHA_MPS
      : ALL_PARLIAMENT_MPS;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      dataset = dataset.filter(
        m => m.mpName.toLowerCase().includes(q) || m.constituency.toLowerCase().includes(q) || m.state.toLowerCase().includes(q)
      );
    }

    if (selectedState !== "All") {
      dataset = dataset.filter(m => m.state === selectedState);
    }

    if (surplusOnly) {
      dataset = dataset.filter(m => m.status === "High Accumulation" || m.status === "Accumulation Watch");
    }

    return [...dataset].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [activeTab, searchTerm, selectedState, surplusOnly, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: "expenditure" | "carriedForward" | "constituency" | "state") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = ["ID,House,Constituency,MP Name,State,Allocated (Cr),Expenditure (Cr),Unspent Carried-Forward (Cr),Variance (%),Status"];
    const rows = filteredRecords.map(m =>
      `"${m.id}","${m.house}","${m.constituency}","${m.mpName}","${m.state}",${m.allocatedAmount},${m.expenditure},${m.carriedForward},${m.variance}%,"${m.status}"`
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AARAMBHA_Parliament_Allocations_${activeTab.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PlatformLayout
      moduleNumber="01"
      moduleName="Parliament MPs & Constituency Allocation Registry"
      subTitle="543 sourced Lok Sabha records + illustrative workflow records"
      actions={
        <button onClick={exportCSV} className="ledger-btn-secondary">
          <Download size={13} />
          <span>Export CSV ({filteredRecords.length})</span>
        </button>
      }
    >
      {/* Title & Explanatory Banner */}
      <div className="ledger-header-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> Statutory MPLADS Register • 18th Lok Sabha</div>
            <h1>Parliamentary Allocation & Carried-Forward Registry</h1>
            <p>
              Source-attributed tracking of allocation limits across India's 543 Lok Sabha constituencies.
              The Lok Sabha register is imported from the cited source; other module records are labelled separately.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="ledger-btn-primary"
              style={{ fontSize: "11px", gap: "6px", height: "34px", padding: "0 12px" }}
            >
              <ArrowLeftRight size={12} />
              <span>Compare Studio</span>
            </button>
            <a
              href="https://empoweredindian.in/mplads"
              target="_blank"
              rel="noopener noreferrer"
              className="ledger-btn-secondary"
              style={{ fontSize: "11px", gap: "6px", textDecoration: "none", height: "34px", padding: "0 12px", display: "inline-flex", alignItems: "center" }}
            >
              <span>Empowered Indian Source</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Live Empirical Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
          <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid var(--line)", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
              Total Allocated Limit
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--indigo)", marginTop: "4px" }}>
              ₹{EMPOWERED_INDIAN_TOTAL_CRORES} Cr
            </div>
            <div style={{ fontSize: "10px", color: "var(--ink-muted)", fontFamily: "monospace", marginTop: "2px" }}>
              ₹{EMPOWERED_INDIAN_TOTAL_RUPEES.toLocaleString("en-IN")}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid var(--line)", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
              Lok Sabha Seats
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>
              543 Constituencies
            </div>
            <div style={{ fontSize: "10px", color: "var(--ink-muted)", marginTop: "2px" }}>
              28 States + 8 Union Territories
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid var(--line)", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
              Fresh Term Baseline
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--moss)", marginTop: "4px" }}>
              ₹14.70 Cr
            </div>
            <div style={{ fontSize: "10px", color: "var(--ink-muted)", fontFamily: "monospace", marginTop: "2px" }}>
              ₹14,70,00,000 per MP
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid var(--line)", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700, letterSpacing: "0.04em" }}>
              Peak Allocation Limit
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--terracotta)", marginTop: "4px" }}>
              ₹32.75 Cr
            </div>
            <div style={{ fontSize: "10px", color: "var(--ink-muted)", marginTop: "2px" }}>
              Malkajgiri (Telangana) with roll-over
            </div>
          </div>
        </div>
      </div>

      {/* House Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {(["Lok Sabha", "Rajya Sabha", "All"] as const).map((tab) => {
          const count = tab === "Lok Sabha" ? 543 : tab === "Rajya Sabha" ? 231 : 774;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className="ledger-btn-secondary"
              style={{
                background: isActive ? "var(--indigo)" : "var(--paper-light)",
                color: isActive ? "var(--paper)" : "var(--ink)",
                borderColor: isActive ? "var(--indigo)" : "var(--line)",
                padding: "8px 16px"
              }}
            >
              <Landmark size={14} />
              <span>{tab === "All" ? "Combined Parliament" : tab} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="ledger-filter-bar">
        <div className="filter-group">
          <div className="ledger-search-box">
            <Search size={14} />
            <input
              type="text"
              className="ledger-search-input"
              placeholder="Search by MP, constituency, or city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="ledger-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All States / UTs ({states.length})</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={surplusOnly}
              onChange={(e) => {
                setSurplusOnly(e.target.checked);
                setCurrentPage(1);
              }}
            />
            <span>High Accumulation Only (Unspent &gt; ₹4.0 Cr)</span>
          </label>
        </div>

        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Showing <strong>{paginatedRecords.length}</strong> of <strong>{filteredRecords.length}</strong> records
        </div>
      </div>

      {/* Allocations Table */}
      <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => toggleSort("constituency")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Constituency / House <ArrowUpDown size={11} />
                </div>
              </th>
              <th>Member of Parliament</th>
              <th onClick={() => toggleSort("state")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  State / UT <ArrowUpDown size={11} />
                </div>
              </th>
              <th>Allocated Baseline</th>
              <th onClick={() => toggleSort("expenditure")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Expenditure <ArrowUpDown size={11} />
                </div>
              </th>
              <th onClick={() => toggleSort("carriedForward")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Unspent Balance <ArrowUpDown size={11} />
                </div>
              </th>
              <th>Status</th>
              <th>Audit Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((m) => {
              const isHighAccumulation = m.status === "High Accumulation";
              const isWatch = m.status === "Accumulation Watch";
              return (
                <tr
                  key={m.id}
                  style={{
                    background: isHighAccumulation ? "rgba(169,87,68,0.06)" : undefined
                  }}
                >
                  <td><strong>{m.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.constituency}</div>
                    <small style={{ color: "var(--ink-muted)", fontSize: "10px" }}>{m.house} • {m.financialYear}</small>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{m.mpName}</div>
                    <small style={{ color: "var(--ink-muted)", fontSize: "10px" }}>{m.mpType}</small>
                  </td>
                  <td>{m.state}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>₹{m.allocatedAmount.toFixed(2)} Cr</div>
                    {m.allocatedRupees ? (
                      <div style={{ fontSize: "10px", color: "var(--ink-muted)", fontFamily: "monospace" }}>
                        ₹{m.allocatedRupees.toLocaleString("en-IN")}
                      </div>
                    ) : null}
                    {m.allocatedRupees && m.allocatedRupees > 147000000 ? (
                      <span style={{ fontSize: "9px", background: "rgba(216, 138, 53, 0.15)", color: "#9a5611", padding: "1px 4px", borderRadius: "3px", display: "inline-block", marginTop: "2px" }}>
                        +₹{((m.allocatedRupees - 147000000) / 10000000).toFixed(2)} Cr Roll-Over
                      </span>
                    ) : (
                      <span style={{ fontSize: "9px", background: "rgba(112, 139, 120, 0.12)", color: "#3f624d", padding: "1px 4px", borderRadius: "3px", display: "inline-block", marginTop: "2px" }}>
                        Statutory Base
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>₹{m.expenditure.toFixed(1)} Cr</strong>
                    <div style={{ fontSize: "10px", color: "var(--ink-muted)" }}>
                      ({((m.expenditure / m.allocatedAmount) * 100).toFixed(0)}% utilized)
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: isHighAccumulation ? "var(--terracotta)" : isWatch ? "var(--saffron)" : "var(--indigo)"
                    }}>
                      ₹{m.carriedForward.toFixed(2)} Cr
                    </span>
                  </td>
                  <td>
                    {isHighAccumulation ? (
                      <span className="risk-pill risk-pill-high">
                        <AlertTriangle size={10} /> High Accumulation
                      </span>
                    ) : isWatch ? (
                      <span className="risk-pill risk-pill-watch">Watch</span>
                    ) : (
                      <span className="risk-pill risk-pill-normal">Balanced</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        onClick={() => setSelectedMpModal(m)}
                        className="ledger-btn-secondary"
                        style={{ padding: "4px 8px", fontSize: "10px" }}
                        title="Open full statutory MP profile & works"
                      >
                        <Eye size={11} />
                        <span>Inspect</span>
                      </button>
                      <Link
                        href={`/ai-investigator?q=Analyze unspent funds and project distribution in ${encodeURIComponent(m.constituency)} (${encodeURIComponent(m.state)})`}
                        className="ledger-btn-secondary"
                        style={{ padding: "4px 8px", fontSize: "10px" }}
                        title="Interrogate constituency records with AI"
                      >
                        <Bot size={11} />
                        <span>AI Query</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: "flex", alignItems: "center", justifySelf: "stretch", justifyContent: "space-between", marginTop: "16px" }}>
        <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
          Page {currentPage} of {totalPages} ({filteredRecords.length} records)
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="ledger-btn-secondary"
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="ledger-btn-secondary"
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Constituency Drill-Down Modal */}
      <ConstituencyDetailModal
        mp={selectedMpModal as any}
        isOpen={!!selectedMpModal}
        onClose={() => setSelectedMpModal(null)}
      />

      {/* Side-by-Side Compare Studio Modal */}
      <CompareStudioModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </PlatformLayout>
  );
}
