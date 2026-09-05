import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { api, GroundedAiResponse } from "@/lib/api";
import { useEvidence } from "@/contexts/EvidenceContext";
import { ProvenanceBadge } from "@/components/ui/ProvenanceBadge";
import { calculateProcurementRisk } from "@/lib/riskCalculator";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Calculator,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Info,
  Lightbulb,
  Scale,
  Search,
  Send,
  ShieldAlert,
  Sparkles
} from "lucide-react";

const STARTER_QUESTIONS = [
  "What is the official allocation for Varanasi (LS-457)?",
  "What does MPLADS fund allocation mean?",
  "How does AARAMBHA calculate a risk indicator?",
  "What evidence should an auditor review before escalating a tender?",
  "How should I use this platform for a constituency review?"
];

export default function AiInvestigator() {
  const [location] = useLocation();
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeResponse, setActiveResponse] = useState<GroundedAiResponse | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const { openDrawer } = useEvidence();

  // Check URL query parameters for prefilled query
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");
    if (q) {
      setQuestion(q);
      handleExecuteQuery(q);
    }
  }, []);

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsThinking(true);
    setAskedQuestion(queryText);
    try {
      const res = await api.queryAiInvestigator(queryText);
      setActiveResponse(res);
    } catch {
      // Handled gracefully in api.ts
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteQuery(question);
  };

  const handleOpenEvidenceDrawer = () => {
    if (!activeResponse) return;
    
    // Convert activeResponse to EvidenceDrawerData
    const firstEv = activeResponse.evidence[0];
    const recordId = firstEv ? firstEv.recordId : "QUERY-AUDIT";
    const entityType = recordId.startsWith("LS-") ? "MP / Constituency" : recordId.startsWith("PRJ-") ? "Project / Work" : recordId.startsWith("CONT-") ? "Contractor" : "Audit Case";
    
    const riskCalc = activeResponse.calculations.length > 0
      ? calculateProcurementRisk({
          priceDeviationPct: 34.2,
          progressDisparityPct: 28.0,
          bidSpreadPct: 18.5,
          contractorDelayRatePct: 40.0
        })
      : undefined;

    openDrawer({
      title: `AI Investigation Brief: "${askedQuestion}"`,
      recordId,
      entityType: entityType as any,
      provenance: activeResponse.findingType === "verified_fact" ? "official_verified" : "derived_calculation",
      sourceName: firstEv ? firstEv.sourceName : "AARAMBHA Grounded Engine",
      sourceUrl: firstEv ? firstEv.sourceUrl : "https://empoweredindian.in/mplads",
      verifiedAt: activeResponse.dataFreshness,
      fields: activeResponse.evidence.map(e => ({
        name: `${e.field} (${e.recordId})`,
        value: e.value,
        provenance: e.provenance,
        source: e.sourceName
      })),
      riskCalculation: riskCalc,
      findings: activeResponse.recommendedActions,
      recommendation: activeResponse.answer
    });
  };

  return (
    <PlatformLayout
      moduleNumber="08"
      moduleName="AI Investigator"
      subTitle="Grounded Retrieval & Explainable Deterministic Inquiry"
    >
      <div className="ledger-header-box">
        <div className="eyebrow"><span className="eyebrow-dot" /> Evidence-Grounded Decision Support</div>
        <h1>Interrogate Public Procurement Trails with Strict Evidence Grounding</h1>
        <p>
          Ask questions in plain language across 543 Lok Sabha parliamentary records, state MP allocations,
          contractor registries, and tender bid records. The engine retrieves matching official database records, runs
          deterministic mathematical formulas, and provides verifiable evidence citations with zero hallucination.
        </p>
      </div>

      {/* Query Bar */}
      <div className="ledger-card" style={{ background: "var(--paper-light)", borderColor: "var(--indigo)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", color: "var(--indigo)" }} />
            <input
              type="text"
              className="ledger-search-input"
              style={{
                height: "48px",
                paddingLeft: "42px",
                fontSize: "14px",
                background: "var(--paper)",
                border: "1px solid var(--line)"
              }}
              placeholder="Ask an evidence-grounded question (e.g., What is Varanasi's allocation? Check PRJ-001 risk...)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ledger-btn-primary"
            style={{ height: "48px", padding: "0 22px", fontSize: "12px" }}
            disabled={isThinking}
          >
            {isThinking ? (
              <span>Resolving records...</span>
            ) : (
              <>
                <span>Interrogate</span>
                <Send size={13} />
              </>
            )}
          </button>
        </form>

        {/* Starter Query Bubbles */}
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <Lightbulb size={12} /> Suggested Inquiries:
          </span>
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q);
                handleExecuteQuery(q);
              }}
              className="ledger-btn-secondary"
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                background: "var(--paper)",
                borderColor: "rgba(39,59,115,0.18)"
              }}
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thinking State */}
      {isThinking && (
        <div className="ledger-card" style={{ textAlign: "center", padding: "40px" }}>
          <Bot size={28} color="var(--indigo)" style={{ animation: "pulse 1.5s infinite" }} />
          <h3 style={{ margin: "12px 0 4px", fontFamily: "Fraunces, serif" }}>Querying Official Parliamentary & Tender Databases...</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-muted)" }}>
            Extracting entities, matching official MoSPI MPLADS registers, and calculating deterministic variance.
          </p>
        </div>
      )}

      {/* Grounded Response View */}
      {activeResponse && !isThinking && (
        <div className="ledger-card" style={{ borderColor: "rgba(39,59,115,0.35)", background: "var(--paper-light)" }}>
          {/* Header Metadata Bar */}
          <div className="ledger-card-header" style={{ alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--indigo)", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={12} color="var(--saffron)" /> AARAMBHA Grounded Synthesis
              </div>
              <h2 style={{ fontSize: "18px", margin: "0 0 4px 0" }}>Query: "{askedQuestion}"</h2>
              <div style={{ fontSize: "11px", color: "var(--ink-muted)", display: "flex", gap: "12px", alignItems: "center" }}>
                <span>Freshness: <strong>{activeResponse.dataFreshness}</strong></span>
                <span>•</span>
                <span>Confidence: <strong style={{ color: activeResponse.confidence === "high" ? "var(--sage)" : activeResponse.confidence === "medium" ? "var(--saffron)" : "var(--ink-muted)" }}>{activeResponse.confidence.toUpperCase()}</strong></span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              {activeResponse.findingType === "verified_fact" && (
                <span className="risk-pill risk-pill-normal" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} /> Official Verified Fact
                </span>
              )}
              {activeResponse.findingType === "risk_indicator" && (
                <span className="risk-pill risk-pill-high" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <AlertTriangle size={12} /> Analytical Risk Indicator
                </span>
              )}
              {activeResponse.findingType === "derived_calculation" && (
                <span className="risk-pill risk-pill-medium" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calculator size={12} /> Derived Calculation
                </span>
              )}
              {activeResponse.findingType === "insufficient_data" && (
                <span className="risk-pill" style={{ background: "rgba(100,116,139,0.1)", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Info size={12} /> Insufficient Data
                </span>
              )}

              {activeResponse.evidence.length > 0 && (
                <button
                  onClick={handleOpenEvidenceDrawer}
                  className="ledger-btn-secondary"
                  style={{ fontSize: "11px", padding: "4px 10px", background: "var(--paper)", borderColor: "var(--indigo)", color: "var(--indigo)" }}
                >
                  <FileSpreadsheet size={12} />
                  <span>Inspect in Evidence Drawer</span>
                </button>
              )}
            </div>
          </div>

          {/* Answer Box */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "4px", marginBottom: "18px" }}>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.65, color: "var(--ink)" }}>
              {activeResponse.answer}
            </p>
          </div>

          {/* Grounded Evidence Cited */}
          {activeResponse.evidence.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--indigo)", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={13} /> Official Grounding Records Cited ({activeResponse.evidence.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                {activeResponse.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      padding: "12px 14px",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "var(--indigo)", fontWeight: 700 }}>
                          {ev.recordId}
                        </span>
                        <ProvenanceBadge type={ev.provenance} />
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginBottom: "2px" }}>
                        {ev.field}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
                        {ev.value}
                      </div>
                    </div>

                    <div style={{ borderTop: "1px dashed var(--line)", paddingTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "var(--ink-muted)" }}>
                      <span>{ev.sourceName}</span>
                      {ev.sourceUrl && (
                        <a
                          href={ev.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--indigo)", display: "flex", alignItems: "center", gap: "2px", textDecoration: "none" }}
                        >
                          Official Link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deterministic Calculations Applied */}
          {activeResponse.calculations.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--saffron)", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Calculator size={13} /> Deterministic Calculations Executed
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "10px" }}>
                {activeResponse.calculations.map((calc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(216,138,53,0.04)",
                      border: "1px solid rgba(216,138,53,0.3)",
                      padding: "12px 14px",
                      borderRadius: "4px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "12px", color: "var(--ink)" }}>{calc.name}</strong>
                      <ProvenanceBadge type="derived_calculation" />
                    </div>
                    <div style={{ fontSize: "11px", fontFamily: "ui-monospace, monospace", color: "var(--ink-muted)", background: "var(--paper)", padding: "4px 8px", borderRadius: "3px", marginBottom: "6px" }}>
                      Formula: {calc.formula}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                      <span style={{ color: "var(--ink-muted)" }}>
                        Inputs: {Object.entries(calc.inputs).map(([k, v]) => `${k}=${v}`).join(", ")}
                      </span>
                      <span style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "ui-monospace, monospace" }}>
                        Result: {calc.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {activeResponse.recommendedActions.length > 0 && (
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "14px 16px", borderRadius: "4px", marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--sage)", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} /> Recommended Audit & Human Review Steps
              </div>
              <ol style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--ink)", lineHeight: 1.6 }}>
                {activeResponse.recommendedActions.map((act, idx) => (
                  <li key={idx} style={{ marginBottom: "4px" }}>{act}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Mandatory Analytical Neutrality Disclaimer */}
          <div style={{ background: "rgba(39,59,115,0.04)", border: "1px solid rgba(39,59,115,0.15)", padding: "12px 14px", borderRadius: "4px", fontSize: "11px", color: "var(--ink-muted)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--indigo)" }}>STATUTORY NEUTRALITY NOTICE:</strong> {activeResponse.disclaimer} All indicators are derived from public registers and analytical formulas to prioritize human verification. AARAMBHA does not pronounce judicial guilt, corruption, or legal culpability.
          </div>
        </div>
      )}
    </PlatformLayout>
  );
}
