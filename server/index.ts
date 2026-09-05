import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  SERVER_CONSTITUENCIES,
  SERVER_CONTRACTORS,
  SERVER_CONTRACTS,
  SERVER_DATASOURCES,
  SERVER_INVESTIGATIONS,
  SERVER_OVERVIEW_METRICS,
  SERVER_PROJECTS,
  SERVER_RAJYA_SABHA,
  SERVER_TENDERS
} from "./data";
import { processGroundedQuery } from "./aiInvestigator";
import { calculateDeterministicRisk } from "../client/src/lib/riskCalculator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
let configured = false;

export function configureApp() {
  if (configured) return;
  configured = true;

  app.use(express.json());

  // ------------------------------------------------------------------
  // REST API v1 ENDPOINTS
  // ------------------------------------------------------------------

  // Health
  app.get("/api/v1/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "1.0.0" });
  });

  // Overview metrics
  app.get("/api/v1/overview/metrics", (_req, res) => {
    res.json(SERVER_OVERVIEW_METRICS);
  });

  // Constituencies (Lok Sabha)
  app.get("/api/v1/constituencies", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    const state = (req.query.state as string) || "";
    const surplusOnly = req.query.surplus === "true";

    let results = [...SERVER_CONSTITUENCIES];
    if (q) {
      results = results.filter(c => c.constituency.toLowerCase().includes(q) || c.mpName.toLowerCase().includes(q));
    }
    if (state && state !== "All") {
      results = results.filter(c => c.state === state);
    }
    if (surplusOnly) {
      results = results.filter(c => c.status === "High Accumulation" || c.status === "Accumulation Watch");
    }
    res.json(results);
  });

  // Rajya Sabha
  app.get("/api/v1/rajya-sabha", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    const state = (req.query.state as string) || "";

    let results = [...SERVER_RAJYA_SABHA];
    if (q) {
      results = results.filter(m => m.mpName.toLowerCase().includes(q) || m.state.toLowerCase().includes(q));
    }
    if (state && state !== "All") {
      results = results.filter(m => m.state === state);
    }
    res.json(results);
  });

  // All Parliament MPs
  app.get("/api/v1/all-mps", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    const state = (req.query.state as string) || "";
    const house = (req.query.house as string) || "All";

    let results = [...SERVER_CONSTITUENCIES, ...SERVER_RAJYA_SABHA];
    if (house !== "All") {
      results = results.filter(m => m.house === house);
    }
    if (state && state !== "All") {
      results = results.filter(m => m.state === state);
    }
    if (q) {
      results = results.filter(m => m.mpName.toLowerCase().includes(q) || m.constituency.toLowerCase().includes(q));
    }
    res.json(results);
  });

  // Projects
  app.get("/api/v1/projects", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    const state = (req.query.state as string) || "";
    const riskLevel = ((req.query.riskLevel as string) || "").toLowerCase();

    let results = [...SERVER_PROJECTS];
    if (riskLevel && riskLevel !== "all") {
      results = results.filter(p => p.riskLevel === riskLevel);
    }
    if (state && state !== "All") {
      results = results.filter(p => p.state === state);
    }
    if (q) {
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.constituency.toLowerCase().includes(q));
    }
    res.json(results);
  });

  app.get("/api/v1/projects/:id", (req, res) => {
    const project = SERVER_PROJECTS.find(p => p.id === req.params.id) || SERVER_PROJECTS[0];
    res.json(project);
  });

  // Contractors
  app.get("/api/v1/contractors", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    let results = [...SERVER_CONTRACTORS];
    if (q) {
      results = results.filter(c => c.name.toLowerCase().includes(q) || c.registrationNumber.toLowerCase().includes(q));
    }
    res.json(results);
  });

  app.get("/api/v1/contractors/:id", (req, res) => {
    const contractor = SERVER_CONTRACTORS.find(c => c.id === req.params.id) || SERVER_CONTRACTORS[0];
    res.json(contractor);
  });

  // Tenders
  app.get("/api/v1/tenders", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    let results = [...SERVER_TENDERS];
    if (q) {
      results = results.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    res.json(results);
  });

  // Contracts
  app.get("/api/v1/contracts", (req, res) => {
    const q = ((req.query.q as string) || "").toLowerCase();
    let results = [...SERVER_CONTRACTS];
    if (q) {
      results = results.filter(c => c.id.toLowerCase().includes(q) || c.contractorName.toLowerCase().includes(q));
    }
    res.json(results);
  });

  // Investigations
  app.get("/api/v1/investigations", (req, res) => {
    const status = ((req.query.status as string) || "").toLowerCase();
    let results = [...SERVER_INVESTIGATIONS];
    if (status && status !== "all") {
      results = results.filter(i => i.status === status);
    }
    res.json(results);
  });

  app.get("/api/v1/investigations/:id", (req, res) => {
    const inv = SERVER_INVESTIGATIONS.find(i => i.id === req.params.id) || SERVER_INVESTIGATIONS[0];
    res.json(inv);
  });

  // Datasources
  app.get("/api/v1/datasources", (_req, res) => {
    res.json(SERVER_DATASOURCES);
  });

  // Anomaly Detection Algorithm
  app.post("/api/v1/anomalies/detect", (req, res) => {
    const {
      unitPrice = 0,
      benchmarkPrice = 1,
      bids = [],
      physicalProgress = 0,
      financialUtilization = 0,
      contractorDelayRate = 0
    } = req.body || {};

    const safeBids = Array.isArray(bids)
      ? bids.filter((bid) => typeof bid === "number" && Number.isFinite(bid) && bid >= 0).sort((a, b) => a - b)
      : [];
    const bidSpread = safeBids.length >= 2 && safeBids[0] > 0
      ? ((safeBids[1] - safeBids[0]) / safeBids[0]) * 100
      : undefined;
    const result = calculateDeterministicRisk({
      unitPrice: Number.isFinite(unitPrice) ? unitPrice : undefined,
      medianPrice: Number.isFinite(benchmarkPrice) && benchmarkPrice > 0 ? benchmarkPrice : undefined,
      financialUtilization: Number.isFinite(financialUtilization) ? financialUtilization : undefined,
      physicalProgress: Number.isFinite(physicalProgress) ? physicalProgress : undefined,
      bidderCount: safeBids.length || undefined,
      bidSpread,
      contractorDelayRate: Number.isFinite(contractorDelayRate) ? contractorDelayRate : undefined
    });

    res.json({
      ...result,
      inputStatus: "User-supplied scenario — no external registry verification performed",
      disclaimer: "This is a deterministic decision-support calculation from the supplied values. It is not a finding of fact, legal conclusion, or automated enforcement action."
    });
  });

  // Document Verification
  app.post("/api/v1/documents/verify", (req, res) => {
    const { documentId = "DOC-SUBMITTED-01" } = req.body || {};
    res.json({
      documentId,
      verificationStatus: "Discrepancy Flagged",
      matchedFieldsCount: 8,
      mismatches: [
        { field: "Cement Unit Rate", dbValue: "₹4,120 / cu.m (DSR)", docValue: "₹4,880 / cu.m (Invoiced)", variance: "+18.4%" }
      ],
      recommendedManualAction: "Cross-verify invoice against physical Measurement Book signed by Assistant Engineer."
    });
  });

  // Grounded AI Query
  app.post("/api/v1/ai/query", async (req, res) => {
    const { question = "" } = req.body || {};
    const groundedResponse = await processGroundedQuery(question);
    res.json(groundedResponse);
  });

  // Forensics Benford
  app.get("/api/v1/forensics/benford", (_req, res) => {
    res.json([
      { digit: 1, expected: 30.1, actual: 28.4 },
      { digit: 2, expected: 17.6, actual: 16.9 },
      { digit: 3, expected: 12.5, actual: 13.2 },
      { digit: 4, expected: 9.7, actual: 14.8, anomaly: true, note: "Cluster near ₹49,000 / ₹4.9L threshold" },
      { digit: 5, expected: 7.9, actual: 8.1 }
    ]);
  });

  // PFMS Smart Lock
  app.get("/api/v1/pfms/smart-lock", (_req, res) => {
    res.json({
      smartLockActive: true,
      activeLocks: 14,
      withheldTotalCr: 4.82,
      lastRuleSync: new Date().toISOString()
    });
  });

  // Show Cause Notice Generation
  app.post("/api/v1/legal/show-cause-notice", (req, res) => {
    const { caseId = "CASE-04-17", contractorId = "CONT-101" } = req.body || {};
    res.json({
      noticeId: `SCN-${Date.now().toString().slice(-6)}`,
      caseId,
      contractorId,
      statutorySection: "Rule 151 of General Financial Rules (GFR) 2017",
      responseDeadlineDays: 14,
      status: "Draft Generated"
    });
  });

  // Syndicate Network Graph
  app.get("/api/v1/syndicate/network", (_req, res) => {
    res.json({
      nodes: [
        { id: "CONT-101", label: "Shree Ganesh Infra", type: "Contractor" },
        { id: "ENT-ANANYA", label: "Ananya Construction", type: "Related Bidder" },
        { id: "DIR-RAJESH", label: "Rajesh Agrawal", type: "Common Director" }
      ],
      edges: [
        { from: "CONT-101", to: "DIR-RAJESH", relationship: "Director / Shareholder" },
        { from: "ENT-ANANYA", to: "DIR-RAJESH", relationship: "Former Director" },
        { from: "CONT-101", to: "ENT-ANANYA", relationship: "Shared Corporate Office" }
      ]
    });
  });

  // ------------------------------------------------------------------
  // STATIC FILES & SPA FALLBACK
  // ------------------------------------------------------------------
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

}

export function startServer() {
  configureApp();
  const server = createServer(app);
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`AARAMBHA Server running on http://localhost:${port}/`);
  });
}
