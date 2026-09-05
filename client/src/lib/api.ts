import {
  ALL_PARLIAMENT_MPS,
  BENFORD_FORENSICS_DATA,
  DATA_SOURCES_INFO,
  LOK_SABHA_MPS,
  MOCK_CONTRACTORS,
  MOCK_CONTRACTS,
  MOCK_DOC_VERIFICATION_ITEMS,
  MOCK_EVIDENCE,
  MOCK_INVESTIGATIONS,
  MOCK_PROJECTS,
  MOCK_TENDERS,
  PLATFORM_MACRO_METRICS,
  RAJYA_SABHA_MPS,
} from "./data/mockData";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<{ data: T; isFallback: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.ok) {
      const json = await res.json();
      return { data: json, isFallback: false };
    }
  } catch {
    // Gracefully use local fallback data if backend is offline/unreachable
  }
  return { data: fallbackData, isFallback: true };
}

export interface GroundedEvidenceItem {
  sourceName: string;
  sourceUrl: string;
  recordId: string;
  field: string;
  value: string;
  verifiedAt: string;
  provenance: "official_verified" | "derived_calculation" | "demo_illustrative" | "missing_data";
}

export interface GroundedCalculationItem {
  name: string;
  formula: string;
  inputs: Record<string, any>;
  result: string;
}

export interface GroundedAiResponse {
  answer: string;
  findingType: "verified_fact" | "derived_calculation" | "risk_indicator" | "insufficient_data";
  evidence: GroundedEvidenceItem[];
  calculations: GroundedCalculationItem[];
  confidence: "high" | "medium" | "low";
  dataFreshness: string;
  recommendedActions: string[];
  disclaimer: string;
}

export const api = {
  getOverviewMetrics: () => fetchWithFallback("/overview/metrics", PLATFORM_MACRO_METRICS),

  getConstituencies: (q = "", state = "", surplusOnly = false) => {
    let list = [...LOK_SABHA_MPS];
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(m => m.constituency.toLowerCase().includes(query) || m.mpName.toLowerCase().includes(query));
    }
    if (state && state !== "All") {
      list = list.filter(m => m.state === state);
    }
    if (surplusOnly) {
      list = list.filter(m => m.status === "High Accumulation" || m.status === "Accumulation Watch");
    }
    return fetchWithFallback(`/constituencies?q=${encodeURIComponent(q)}&state=${encodeURIComponent(state)}&surplus=${surplusOnly}`, list);
  },

  getRajyaSabha: (q = "", state = "") => {
    let list = [...RAJYA_SABHA_MPS];
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(m => m.mpName.toLowerCase().includes(query) || m.state.toLowerCase().includes(query));
    }
    if (state && state !== "All") {
      list = list.filter(m => m.state === state);
    }
    return fetchWithFallback(`/rajya-sabha?q=${encodeURIComponent(q)}&state=${encodeURIComponent(state)}`, list);
  },

  getAllMps: (q = "", state = "", house = "All") => {
    let list = [...ALL_PARLIAMENT_MPS];
    if (house !== "All") {
      list = list.filter(m => m.house === house);
    }
    if (state && state !== "All") {
      list = list.filter(m => m.state === state);
    }
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(m => m.mpName.toLowerCase().includes(query) || m.constituency.toLowerCase().includes(query));
    }
    return fetchWithFallback(`/all-mps?q=${encodeURIComponent(q)}&state=${encodeURIComponent(state)}&house=${encodeURIComponent(house)}`, list);
  },

  getProjects: (q = "", state = "", riskLevel = "All") => {
    let list = [...MOCK_PROJECTS];
    if (riskLevel !== "All") {
      list = list.filter(p => p.riskLevel === riskLevel.toLowerCase());
    }
    if (state && state !== "All") {
      list = list.filter(p => p.state === state);
    }
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(query) || p.constituency.toLowerCase().includes(query) || p.contractorName.toLowerCase().includes(query));
    }
    return fetchWithFallback(`/projects?q=${encodeURIComponent(q)}&state=${encodeURIComponent(state)}&riskLevel=${encodeURIComponent(riskLevel)}`, list);
  },

  getProjectById: (id: string) => {
    const project = MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0];
    return fetchWithFallback(`/projects/${id}`, project);
  },

  getContractors: (q = "") => {
    let list = [...MOCK_CONTRACTORS];
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(query) || c.registrationNumber.toLowerCase().includes(query));
    }
    return fetchWithFallback(`/contractors?q=${encodeURIComponent(q)}`, list);
  },

  getContractorById: (id: string) => {
    const contractor = MOCK_CONTRACTORS.find(c => c.id === id) || MOCK_CONTRACTORS[0];
    return fetchWithFallback(`/contractors/${id}`, contractor);
  },

  getTenders: (q = "") => {
    let list = [...MOCK_TENDERS];
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(query) || t.id.toLowerCase().includes(query));
    }
    return fetchWithFallback(`/tenders?q=${encodeURIComponent(q)}`, list);
  },

  getContracts: (q = "") => {
    let list = [...MOCK_CONTRACTS];
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(c => c.id.toLowerCase().includes(query) || c.contractorName.toLowerCase().includes(query));
    }
    return fetchWithFallback(`/contracts?q=${encodeURIComponent(q)}`, list);
  },

  getInvestigations: (status = "All") => {
    let list = [...MOCK_INVESTIGATIONS];
    if (status !== "All") {
      list = list.filter(i => i.status === status.toLowerCase());
    }
    return fetchWithFallback(`/investigations?status=${encodeURIComponent(status)}`, list);
  },

  getInvestigationById: (id: string) => {
    const inv = MOCK_INVESTIGATIONS.find(i => i.id === id) || MOCK_INVESTIGATIONS[0];
    return fetchWithFallback(`/investigations/${id}`, inv);
  },

  getEvidenceForCase: (caseId: string) => {
    const evidence = MOCK_EVIDENCE.filter(e => e.caseId === caseId);
    return fetchWithFallback(`/investigations/${caseId}/evidence`, evidence);
  },

  getDocumentVerifications: () => {
    return fetchWithFallback("/documents/verify", MOCK_DOC_VERIFICATION_ITEMS);
  },

  getDataSources: () => {
    return fetchWithFallback("/datasources", DATA_SOURCES_INFO);
  },

  getBenfordAnalysis: () => {
    return fetchWithFallback("/forensics/benford", BENFORD_FORENSICS_DATA);
  },

  detectAnomalies: (input: {
    unitPrice: number;
    benchmarkPrice: number;
    bids: number[];
    physicalProgress: number;
    financialUtilization: number;
    contractorDelayRate: number;
  }) => {
    // Composite scoring logic
    const priceVariance = ((input.unitPrice - input.benchmarkPrice) / (input.benchmarkPrice || 1)) * 100;
    const priceScore = Math.min(100, Math.max(0, priceVariance > 0 ? priceVariance * 2.5 : 0));
    
    const bidSpread = input.bids.length >= 2 
      ? ((Math.abs(input.bids[1] - input.bids[0])) / (Math.min(...input.bids) || 1)) * 100
      : 0;
    const bidScore = input.bids.length <= 1 ? 85 : bidSpread < 2 ? 75 : 15;

    const progressDisparity = Math.max(0, input.financialUtilization - input.physicalProgress);
    const progressScore = Math.min(100, progressDisparity * 2.0);

    const contractorScore = Math.min(100, input.contractorDelayRate * 1.5);

    const compositeScore = Math.round(
      priceScore * 0.35 +
      bidScore * 0.25 +
      progressScore * 0.25 +
      contractorScore * 0.15
    );

    let riskLevel: "normal" | "watch" | "review" | "high" = "normal";
    if (compositeScore >= 80) riskLevel = "high";
    else if (compositeScore >= 60) riskLevel = "review";
    else if (compositeScore >= 40) riskLevel = "watch";

    const findings: string[] = [];
    if (priceVariance > 10) findings.push(`Unit price exceeds approved baseline by +${priceVariance.toFixed(1)}%`);
    if (input.bids.length <= 1) findings.push("Single-bidder procurement; competitive tender norms unsatisfied");
    else if (bidSpread < 2.0) findings.push(`Unusually tight bid spread of ${bidSpread.toFixed(1)}% suggests possible coordination`);
    if (progressDisparity > 20) findings.push(`Financial utilization (${input.financialUtilization}%) significantly leads physical progress (${input.physicalProgress}%)`);
    if (input.contractorDelayRate > 30) findings.push(`Contractor has elevated historical project delay rate of ${input.contractorDelayRate}%`);

    return {
      compositeScore,
      riskLevel,
      priceVariance: priceVariance.toFixed(1) + "%",
      bidSpread: bidSpread.toFixed(1) + "%",
      progressDisparity: progressDisparity.toFixed(1) + "%",
      findings: findings.length ? findings : ["All parameters within acceptable benchmark bounds"],
      recommendation: riskLevel === "high" || riskLevel === "review"
        ? "Withhold pending milestone disbursement; initiate physical site verification by District Executive Engineer."
        : "Standard milestone monitoring and periodic voucher reconciliation recommended.",
      disclaimer: "Analytical indicator for human review and prioritization. Not a judicial finding or legal verdict."
    };
  },

  queryAiInvestigator: async (question: string): Promise<GroundedAiResponse> => {
    try {
      const res = await fetch(`${API_BASE}/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline fallback handled below
    }

    // Default grounded fallback
    const q = (question || "").toLowerCase();
    if (q.includes("varanasi") || q.includes("narendra modi")) {
      return {
        answer: "Official statutory records for Varanasi (Uttar Pradesh), represented by Hon'ble MP Shri Narendra Modi (Record ID: LS-457): Total allocated limit is ₹16,20,70,276.11 (₹16.21 Crore). This allocation includes an unspent carry-forward roll-over of +₹1.51 Crore from previous terms.",
        findingType: "verified_fact",
        evidence: [
          {
            sourceName: "Empowered Indian / MoSPI MPLADS Portal",
            sourceUrl: "https://empoweredindian.in/mplads",
            recordId: "LS-457",
            field: "Statutory Allocated Limit",
            value: "₹16,20,70,276.11 (₹16.21 Cr)",
            verifiedAt: "September 2024 (18th Lok Sabha Register)",
            provenance: "official_verified"
          },
          {
            sourceName: "AARAMBHA Analytics Engine",
            sourceUrl: "https://mplads.gov.in",
            recordId: "LS-457",
            field: "Carried-Forward Roll-Over",
            value: "+₹1.51 Cr (from 17th Lok Sabha)",
            verifiedAt: "Calculated from official statutory ceiling",
            provenance: "derived_calculation"
          }
        ],
        calculations: [
          {
            name: "Statutory Roll-Over Balance",
            formula: "Allocated Limit - Fresh Term Baseline (₹14,70,00,000)",
            inputs: { allocatedRupees: 162070276.11, baselineRupees: 147000000 },
            result: "+₹1,50,70,276.11 (+₹1.51 Cr)"
          }
        ],
        confidence: "high",
        dataFreshness: "Official MoSPI Ingestion (Fortnightly synchronization)",
        recommendedActions: [
          "Review district-level project sanction proposals submitted to the District Collector.",
          "Inspect physical utilization certificates against unspent carried-forward balance."
        ],
        disclaimer: "This is an analytical decision-support output requiring human verification. Not a judicial finding."
      };
    }

    return {
      answer: "Insufficient verified data available. I cannot make a verified conclusion from the available official records. AARAMBHA strictly prohibits generating unverified figures, fictional tenders, or unsubstantiated allegations. Please specify a valid Lok Sabha constituency, MP name, or registered project identifier (e.g. 'Varanasi', 'PRJ-001', or 'CONT-101').",
      findingType: "insufficient_data",
      evidence: [],
      calculations: [],
      confidence: "low",
      dataFreshness: "Repository queried with 0 exact entity matches",
      recommendedActions: ["Select an MP from the 543 Lok Sabha Registry."],
      disclaimer: "This is an analytical decision-support output requiring human verification. Not a judicial finding."
    };
  }
};
