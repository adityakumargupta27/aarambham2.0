# AARAMBHA (आरम्भ) — Public Fund, Procurement & Civic Audit Intelligence Layer

A unified analytical oversight platform for auditors, vigilance officers, administrators, researchers, and public accountability bodies to trace public fund allocation from Members of Parliament and constituency levels through projects, tenders, contracts, contractors, payments, and risk investigations.

---

## 🏛️ Key Capabilities

- **Parliamentary Allocations Registry**: Trace 543 Lok Sabha and 231 Rajya Sabha (774 total) MP fund allocations, expenditure rates, and unspent surplus accumulations.
- **Project-to-Contract Traceability**: Connect sanctioned works to underlying tenders, awarded contractors, timeline milestones, and physical vs. financial delivery.
- **Bid Collusion & Tender Integrity**: Screen municipal and state e-tenders for narrow bid spreads (<2%), single-bid awards, and bidder rotation patterns.
- **Contractor Network Resolution**: Uncover shared director footprints, common registered office addresses (MCA21), and chronic delay history (>30%).
- **Multi-Dimensional Risk Matrix**: Automated 0–100 composite scoring across 9 forensic dimensions including Benford's Law distribution analysis.
- **Vigilance Case Dossiers**: Manage active inquiry files with cryptographically referenced evidence, timeline events, auditor notes, and GFR 2017 statutory references.
- **Natural Language AI Investigator**: Ask plain-language questions ("Why was this contract flagged?", "Show projects with high carried-forward funds") and receive structured, cited evidence.
- **Document Reconciliation**: Cross-verify contractor tax invoices and Measurement Books (MB) against Schedule of Rates (DSR) to flag unit rate inflation.
- **Statutory Reports Studio**: Generate audit briefs, PAC submissions, contractor profiles, and exportable CSVs.

---

## 🧭 Navigation & Architecture

- **Clean Top Navigation**: In accordance with system specifications, **no sidebar** is used. All platform modules are directly accessible via the top navigation bar or contextual links.
- **Paper Ledger Editorial Aesthetic**: Warm paper palette (`#f4efe7`), ink black typography (`#192134`), AARAMBHA indigo (`#273b73`), and sparse saffron annotations (`#d88a35`).
- **Dual Data Mode**: Communicates with the Express REST API (`/api/v1/...`) with automatic local fallback if offline or in demo mode.

---

## 🚀 Quick Start

### 1. Installation
```bash
pnpm install
# or
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Development Server
```bash
npm run dev
```
Access the application at `http://localhost:5173/`.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📡 REST API Endpoints (`/api/v1`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health status |
| `GET` | `/api/v1/overview/metrics` | Macro procurement and risk distribution metrics |
| `GET` | `/api/v1/constituencies` | 543 Lok Sabha allocations with search and surplus filters |
| `GET` | `/api/v1/rajya-sabha` | 231 Rajya Sabha allocations |
| `GET` | `/api/v1/all-mps` | Combined 774 Parliament records |
| `GET` | `/api/v1/projects` | Filtered list of works with risk scores |
| `GET` | `/api/v1/projects/:id` | Project 360 detailed audit record |
| `GET` | `/api/v1/contractors` | Contractor directory with delay rates and MCA links |
| `GET` | `/api/v1/tenders` | Tender notices with bid spread analysis |
| `GET` | `/api/v1/contracts` | Executed contracts and milestone disbursement logs |
| `GET` | `/api/v1/investigations` | Active case dossiers and status pipelines |
| `GET` | `/api/v1/datasources` | Ingestion sources, update frequency, and reliability index |
| `POST` | `/api/v1/anomalies/detect` | Composite risk score calculation (0–100) |
| `POST` | `/api/v1/documents/verify` | Invoice / Measurement Book reconciliation |
| `POST` | `/api/v1/ai/query` | Structured AI explanation and cited evidence |
| `GET` | `/api/v1/forensics/benford` | First-digit distribution vs Benford's Law |
| `GET` | `/api/v1/pfms/smart-lock` | Smart-lock disbursement status |
| `POST` | `/api/v1/legal/show-cause-notice` | Draft Show Cause Notice under Rule 151 GFR 2017 |
| `GET` | `/api/v1/syndicate/network` | Contractor and director syndicate network graph |

---

## ⚖️ Governance & Disclaimer

AARAMBHA is an analytical civic technology platform developed for research and demonstration. Risk scores and anomaly alerts are quantitative indicators intended to assist human auditors in prioritizing reviews. They do not constitute legal allegations or judicial findings. Official administrative actions must follow statutory proceedings under the General Financial Rules (GFR) 2017 and CVC guidelines.
