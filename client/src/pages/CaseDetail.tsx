import { useState } from "react";
import { useParams, Link } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { MOCK_INVESTIGATIONS, MOCK_EVIDENCE, InvestigationCase } from "@/lib/data/mockData";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Gavel,
  Plus,
  Scale,
  Send,
  ShieldAlert,
  User
} from "lucide-react";

export default function CaseDetail() {
  const params = useParams<{ id: string }>();
  const initialCase: InvestigationCase = MOCK_INVESTIGATIONS.find(c => c.id === params.id) || MOCK_INVESTIGATIONS[0];

  const [currentStatus, setCurrentStatus] = useState(initialCase.status);
  const [notes, setNotes] = useState(initialCase.notes);
  const [newNote, setNewNote] = useState("");
  const [authorName, setAuthorName] = useState("Vigilance Officer");

  const caseEvidence = MOCK_EVIDENCE.filter(e => initialCase.evidenceIds.includes(e.id));

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    setNotes([
      ...notes,
      {
        date: today,
        author: authorName,
        role: "Investigation Team",
        comment: newNote.trim()
      }
    ]);
    setNewNote("");
  };

  return (
    <PlatformLayout
      moduleNumber="07"
      moduleName="Case Dossier"
      subTitle={`${initialCase.id} / ${initialCase.title}`}
      actions={
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/investigations" className="ledger-btn-secondary">
            <ArrowLeft size={13} />
            <span>All Cases</span>
          </Link>
          <Link
            href={`/ai-investigator?q=Analyze case ${initialCase.id} and draft formal Show Cause Notice under Rule 151 of GFR 2017`}
            className="ledger-btn-primary"
          >
            <Bot size={13} />
            <span>AI Case Brief</span>
          </Link>
        </div>
      }
    >
      {/* Header Banner */}
      <div className="ledger-header-box">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className={`risk-pill risk-pill-${initialCase.riskLevel}`}>
              Score {initialCase.riskScore} • {initialCase.riskLevel}
            </span>
            <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
              Case ID: <strong>{initialCase.id}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700 }}>Status:</span>
            <select
              className="ledger-select"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as any)}
              style={{ fontWeight: 600, color: "var(--indigo)" }}
            >
              <option value="open">Open</option>
              <option value="under-review">Under Review</option>
              <option value="escalated">Escalated to PAC</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <h1>{initialCase.title}</h1>
        <p style={{ fontSize: "14px", color: "var(--ink)" }}>{initialCase.primarySignal}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "14px", fontSize: "12px", color: "var(--ink-muted)" }}>
          <span><strong>Project:</strong> <Link href={`/projects/${initialCase.projectId}`} style={{ color: "var(--indigo)" }}>{initialCase.projectName} ({initialCase.projectId})</Link></span>
          <span><strong>Contractor:</strong> <Link href="/contractors" style={{ color: "var(--indigo)" }}>{initialCase.contractorName}</Link></span>
          <span><strong>Tender Ref:</strong> <Link href="/tenders" style={{ color: "var(--indigo)" }}>{initialCase.tenderId}</Link></span>
        </div>
      </div>

      {/* Recommended Actions Alert Card */}
      <div className="ledger-card" style={{ background: "rgba(216,138,53,0.06)", borderColor: "rgba(216,138,53,0.3)" }}>
        <div className="ledger-card-header">
          <div>
            <h3 style={{ color: "var(--saffron)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Gavel size={16} /> Recommended Statutory & Vigilance Actions
            </h3>
            <small style={{ color: "var(--ink-muted)" }}>Suggested by AARAMBHA Compliance Engine</small>
          </div>
        </div>
        <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "var(--ink)", lineHeight: 1.6 }}>
          {initialCase.recommendedActions.map((act, idx) => (
            <li key={idx}><strong>{act}</strong></li>
          ))}
        </ol>

        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--line)", fontSize: "11px", color: "var(--ink-muted)" }}>
          <strong>Statutory Governance Framework: </strong>
          {initialCase.statutoryReferences.join(" • ")}
        </div>
      </div>

      {/* Two Column Layout: Evidence Locker & Timeline */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Evidence Locker */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Evidence Locker ({caseEvidence.length})</h3>
              <small style={{ color: "var(--ink-muted)" }}>Cryptographically referenced verification files</small>
            </div>
            <Link href="/verify" className="ledger-btn-secondary" style={{ fontSize: "10px", padding: "4px 8px" }}>
              <span>Reconciliation Tool</span>
            </Link>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {caseEvidence.map((e) => (
              <div key={e.id} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px", borderRadius: "3px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <strong>{e.title}</strong>
                  <span className="risk-pill risk-pill-normal">{e.confidence}% confidence</span>
                </div>
                <div style={{ fontSize: "10px", color: "var(--ink-muted)" }}>
                  Source: {e.source} • Registered: {e.createdAt}
                </div>
                <p style={{ margin: "6px 0 0", color: "var(--ink)", fontSize: "11px" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Investigation Audit Trail & Logs</h3>
              <small style={{ color: "var(--ink-muted)" }}>Chronological events from procurement to inquiry</small>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {initialCase.timeline.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--indigo)", marginTop: "4px" }} />
                  {idx < initialCase.timeline.length - 1 && (
                    <span style={{ width: "1px", flex: 1, background: "var(--line)", margin: "4px 0" }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink-muted)", marginBottom: "2px" }}>
                    {item.date} • {item.actor}
                  </div>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--ink)" }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auditor Working Notes & Commentary */}
      <div className="ledger-card">
        <div className="ledger-card-header">
          <div>
            <h3>Auditor & Vigilance Notes</h3>
            <small style={{ color: "var(--ink-muted)" }}>Internal case annotations and forensic observations</small>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          {notes.map((n, idx) => (
            <div key={idx} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 16px", borderRadius: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--ink-muted)", marginBottom: "4px" }}>
                <span><strong>{n.author}</strong> ({n.role})</span>
                <span>{n.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--ink)" }}>{n.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Note Form */}
        <form onSubmit={addNote} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="ledger-search-input"
            style={{ paddingLeft: "10px", flex: 1, minWidth: "240px" }}
            placeholder="Add case observation, voucher citation, or site inspection note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button type="submit" className="ledger-btn-primary">
            <Plus size={13} />
            <span>Add Note</span>
          </button>
        </form>
      </div>
    </PlatformLayout>
  );
}
