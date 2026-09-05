import { useParams, Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_PROJECTS, MOCK_TENDERS, MOCK_CONTRACTS, MOCK_CONTRACTORS, MOCK_EVIDENCE, Project } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  FolderKanban,
  Landmark,
  Scale,
  ShieldAlert
} from "lucide-react";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const project: Project = MOCK_PROJECTS.find(p => p.id === params.id) || MOCK_PROJECTS[0];

  const linkedTender = MOCK_TENDERS.find(t => t.id === project.tenderId);
  const linkedContract = MOCK_CONTRACTS.find(c => c.id === project.contractId);
  const linkedContractor = MOCK_CONTRACTORS.find(c => c.id === project.contractorId);
  const linkedEvidence = MOCK_EVIDENCE.filter(e => e.linkedEntityId === project.id || e.linkedEntityId === project.contractorId);

  const variancePercent = (((project.awardValue - project.sanctionedAmount) / project.sanctionedAmount) * 100).toFixed(1);

  return (
    <PlatformLayout
      moduleNumber="02"
      moduleName="Project 360"
      subTitle={`${project.id} / ${project.name}`}
      actions={
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/projects" className="ledger-btn-secondary">
            <ArrowLeft size={13} />
            <span>Back to Projects</span>
          </Link>
          <Link
            href={`/ai-investigator?q=Analyze project ${project.id} (${encodeURIComponent(project.name)}) and explain all detected risk factors`}
            className="ledger-btn-primary"
          >
            <Bot size={13} />
            <span>AI Investigation Shortcut</span>
          </Link>
        </div>
      }
    >
      {/* Overview Banner */}
      <div className="ledger-header-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className={`risk-pill risk-pill-${project.riskLevel}`}>
            Risk Score: {project.riskScore} / 100 ({project.riskLevel})
          </span>
          <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>Status: <strong>{project.status}</strong></span>
        </div>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "14px", fontSize: "12px", color: "var(--ink-muted)" }}>
          <span><strong>Constituency:</strong> {project.constituency} ({project.state})</span>
          <span><strong>Sector:</strong> {project.projectType}</span>
          <span><strong>Sanction Date:</strong> {project.sanctionDate}</span>
          <span><strong>Target Date:</strong> {project.completionDate}</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="ledger-metrics-grid">
        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Sanctioned Estimate</span>
            <Landmark size={14} color="var(--indigo)" />
          </div>
          <div className="metric-val">₹{project.sanctionedAmount.toFixed(1)} L</div>
          <div className="metric-caption">Baseline approved cost</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Awarded Value</span>
            <Scale size={14} color="var(--saffron)" />
          </div>
          <div className="metric-val">₹{project.awardValue.toFixed(1)} L</div>
          <div className="metric-caption">
            Variance: <strong style={{ color: Number(variancePercent) > 0 ? "var(--terracotta)" : "var(--sage)" }}>
              {Number(variancePercent) > 0 ? `+${variancePercent}%` : `${variancePercent}%`}
            </strong>
          </div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Physical Execution</span>
            <CheckCircle2 size={14} color="var(--sage)" />
          </div>
          <div className="metric-val">{project.physicalProgress}%</div>
          <div className="metric-caption">Verified on-site completion</div>
        </div>

        <div className="ledger-metric-card">
          <div className="metric-kicker">
            <span>Financial Release</span>
            <Clock size={14} color="var(--indigo)" />
          </div>
          <div className="metric-val">{project.financialUtilization}%</div>
          <div className="metric-caption">₹{project.expenditure.toFixed(1)} L disbursed</div>
        </div>
      </div>

      {/* Disparity Warning if Financial leads Physical */}
      {project.financialUtilization > project.physicalProgress + 15 && (
        <div style={{
          background: "rgba(169,87,68,0.1)",
          border: "1px solid rgba(169,87,68,0.4)",
          padding: "16px 20px",
          marginBottom: "20px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <AlertTriangle size={18} color="var(--terracotta)" style={{ marginTop: "2px" }} />
          <div>
            <strong style={{ color: "var(--terracotta)", fontSize: "13px" }}>
              Physical vs. Financial Progress Disparity Alert
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--ink)" }}>
              Financial disbursement ({project.financialUtilization}%) significantly exceeds ground physical verification ({project.physicalProgress}%).
              Under GFR Rule 159, advance disbursements exceeding physical milestones require mandatory vigilance inspection.
            </p>
          </div>
        </div>
      )}

      {/* Relational Entity Trail */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Connected Procurement Trail</h3>
            <small style={{ color: "var(--ink-muted)" }}>Direct links to tender, contract, contractor, and case files</small>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {/* Tender Block */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "14px", borderRadius: "3px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)", fontWeight: 700, marginBottom: "6px" }}>
              Tender Record
            </div>
            <strong>{project.tenderId}</strong>
            <p style={{ margin: "4px 0 8px", fontSize: "12px", color: "var(--ink)" }}>
              {linkedTender?.title || "Multi-Purpose Facility Works"}
            </p>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
              Bidders: {linkedTender?.bidderCount || 2} • Bid Spread: {linkedTender?.bidSpread || 1.6}%
            </div>
            <Link href="/tenders" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--indigo)", fontWeight: 600, marginTop: "8px" }}>
              View Tender Details <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Contract Block */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "14px", borderRadius: "3px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)", fontWeight: 700, marginBottom: "6px" }}>
              Executed Contract
            </div>
            <strong>{project.contractId}</strong>
            <p style={{ margin: "4px 0 8px", fontSize: "12px", color: "var(--ink)" }}>
              Awarded: ₹{project.awardValue.toFixed(1)} Lakhs
            </p>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
              Delay: {linkedContract?.delayDays || 0} days • Status: {linkedContract?.completionStatus || "In Progress"}
            </div>
            <Link href="/contracts" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--indigo)", fontWeight: 600, marginTop: "8px" }}>
              Inspect Contract & Payments <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Contractor Block */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "14px", borderRadius: "3px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)", fontWeight: 700, marginBottom: "6px" }}>
              Awarded Vendor
            </div>
            <strong>{project.contractorName}</strong>
            <p style={{ margin: "4px 0 8px", fontSize: "12px", color: "var(--ink)" }}>
              Reg: {linkedContractor?.registrationNumber || "REG-UP-2018-8821"}
            </p>
            <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
              Historical Delay Rate: {linkedContractor?.delayRate || 38.5}%
            </div>
            <Link href="/contractors" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--indigo)", fontWeight: 600, marginTop: "8px" }}>
              Contractor Profile & Syndicate <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Investigation Case Block */}
          {project.caseId && (
            <div style={{ background: "rgba(169,87,68,0.06)", border: "1px solid rgba(169,87,68,0.3)", padding: "14px", borderRadius: "3px" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--terracotta)", fontWeight: 700, marginBottom: "6px" }}>
                Active Investigation Dossier
              </div>
              <strong style={{ color: "var(--terracotta)" }}>{project.caseId}</strong>
              <p style={{ margin: "4px 0 8px", fontSize: "12px", color: "var(--ink)" }}>
                Under Vigilance Review
              </p>
              <Link href={`/investigations/${project.caseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--terracotta)", fontWeight: 600, marginTop: "8px" }}>
                Open Case Room <ArrowUpRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Linked Evidence Files */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Attached Evidence & Audit Records ({linkedEvidence.length})</h3>
            <small style={{ color: "var(--ink-muted)" }}>Cross-verified documentation from CPPP, PFMS, and satellite surveys</small>
          </div>
          <Link href="/verify" className="ledger-btn-secondary">
            <span>Reconciliation Engine</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {linkedEvidence.length === 0 ? (
          <p style={{ fontSize: "12px", color: "var(--ink-muted)" }}>No external forensic files attached yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {linkedEvidence.map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: "var(--paper)", border: "1px solid var(--line)", padding: "14px", borderRadius: "3px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <FileText size={18} color="var(--indigo)" style={{ marginTop: "2px" }} />
                  <div>
                    <strong style={{ fontSize: "13px" }}>{e.title}</strong>
                    <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>
                      Source: {e.source} • Registered: {e.createdAt} • Type: {e.type}
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--ink)" }}>{e.description}</p>
                  </div>
                </div>
                <span className="risk-pill risk-pill-normal" style={{ whiteSpace: "nowrap" }}>
                  Confidence {e.confidence}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
