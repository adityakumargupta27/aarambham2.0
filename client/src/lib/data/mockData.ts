/**
 * AARAMBHA Civic Audit & Intelligence Data Store
 * Complete data models and fallback datasets for Lok Sabha, Rajya Sabha,
 * Projects, Tenders, Contracts, Contractors, Risk Signals, and Cases.
 */

import { EMPOWERED_INDIAN_LOK_SABHA_MPS, EMPOWERED_INDIAN_TOTAL_CRORES } from "./empoweredIndianMps";

export interface MPAllocation {
  id: string;
  srNo: number;
  house: "Lok Sabha" | "Rajya Sabha";
  constituency: string;
  mpName: string;
  mpType: "Elected" | "Nominated";
  state: string;
  allocatedAmount: number; // In Crore INR
  allocatedRupees?: number; // Exact amount in INR from official portal
  expenditure: number; // In Crore INR
  carriedForward: number; // In Crore INR
  variance: number; // Percentage
  isBaseline: boolean;
  financialYear: string;
  status: "Normal" | "Accumulation Watch" | "High Accumulation";
  source?: string;
}

export interface Project {
  id: string;
  name: string;
  state: string;
  constituency: string;
  projectType: "Drinking Water" | "Rural Road" | "Community Hall" | "School Building" | "Primary Health Center" | "Solar Street Lighting" | "Irrigation Canal";
  sanctionedAmount: number; // INR Lakhs
  awardValue: number; // INR Lakhs
  expenditure: number; // INR Lakhs
  physicalProgress: number; // 0-100 %
  financialUtilization: number; // 0-100 %
  status: "Completed" | "In Progress" | "Delayed" | "Under Audit Review";
  riskScore: number; // 0-100
  riskLevel: "normal" | "watch" | "review" | "high";
  contractorId: string;
  contractorName: string;
  tenderId: string;
  contractId: string;
  caseId?: string;
  sanctionDate: string;
  completionDate: string;
  description: string;
}

export interface Tender {
  id: string;
  title: string;
  projectId: string;
  estimatedValue: number; // INR Lakhs
  publishedDate: string;
  closingDate: string;
  bidderCount: number;
  bids: { bidderName: string; amount: number; isWinning: boolean }[];
  bidSpread: number; // Percentage difference between lowest and next bid
  status: "Awarded" | "Under Evaluation" | "Scrutiny Flag" | "Retendered";
  riskScore: number;
  riskSignals: string[];
}

export interface Contract {
  id: string;
  tenderId: string;
  projectId: string;
  contractorId: string;
  contractorName: string;
  awardValue: number; // INR Lakhs
  startDate: string;
  endDate: string;
  completionStatus: "On Schedule" | "Delayed" | "Terminated" | "Executed";
  payments: { milestone: string; amount: number; date: string; status: "Paid" | "Pending" | "Withheld" }[];
  delayDays: number;
  costVariance: number; // % deviation from initial estimate
  riskScore: number;
  riskLevel: "normal" | "watch" | "review" | "high";
}

export interface Contractor {
  id: string;
  name: string;
  registrationNumber: string;
  projectCount: number;
  totalContractValue: number; // INR Lakhs
  delayRate: number; // % of projects delayed
  cancellationRate: number; // % cancelled
  riskScore: number;
  riskLevel: "normal" | "watch" | "review" | "high";
  connectedEntities: string[];
  states: string[];
  linkedProjects: string[];
}

export interface InvestigationCase {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  tenderId: string;
  contractorId: string;
  contractorName: string;
  riskScore: number;
  riskLevel: "normal" | "watch" | "review" | "high";
  status: "open" | "under-review" | "escalated" | "resolved";
  primarySignal: string;
  evidenceIds: string[];
  timeline: { date: string; title: string; detail: string; actor: string }[];
  notes: { date: string; author: string; role: string; comment: string }[];
  recommendedActions: string[];
  statutoryReferences: string[];
}

export interface DocumentVerificationItem {
  id: string;
  documentType: "Invoice / Bill" | "Measurement Book (MB)" | "Tender Comparative Sheet" | "Completion Certificate";
  refNumber: string;
  contractorName: string;
  sanctionId: string;
  matchedFields: number;
  totalFields: number;
  mismatches: { field: string; dbValue: string; docValue: string; variance: string }[];
  status: "Reconciled" | "Discrepancy Flagged" | "Manual Audit Required";
  recommendedAction: string;
}

// ----------------------------------------------------
// SEED: Major Representative Constituencies & Parliament
// ----------------------------------------------------

const STATES_LIST = [
  "Uttar Pradesh", "Maharashtra", "West Bengal", "Bihar", "Tamil Nadu",
  "Madhya Pradesh", "Karnataka", "Gujarat", "Rajasthan", "Andhra Pradesh",
  "Odisha", "Kerala", "Telangana", "Assam", "Jharkhand", "Punjab",
  "Chhattisgarh", "Haryana", "Delhi", "Jammu and Kashmir", "Uttarakhand",
  "Himachal Pradesh", "Tripura", "Meghalaya", "Manipur", "Goa"
];

const sampleLokSabhaMPs: MPAllocation[] = [
  {
    id: "LS-001",
    srNo: 1,
    house: "Lok Sabha",
    constituency: "Varanasi",
    mpName: "Narendra Modi",
    mpType: "Elected",
    state: "Uttar Pradesh",
    allocatedAmount: 25.0,
    expenditure: 24.1,
    carriedForward: 0.9,
    variance: -3.6,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-002",
    srNo: 2,
    house: "Lok Sabha",
    constituency: "Rae Bareli",
    mpName: "Rahul Gandhi",
    mpType: "Elected",
    state: "Uttar Pradesh",
    allocatedAmount: 25.0,
    expenditure: 21.4,
    carriedForward: 3.6,
    variance: -14.4,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-003",
    srNo: 3,
    house: "Lok Sabha",
    constituency: "Gandhinagar",
    mpName: "Amit Shah",
    mpType: "Elected",
    state: "Gujarat",
    allocatedAmount: 25.0,
    expenditure: 24.8,
    carriedForward: 0.2,
    variance: -0.8,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-004",
    srNo: 4,
    house: "Lok Sabha",
    constituency: "Bengaluru South",
    mpName: "Tejasvi Surya",
    mpType: "Elected",
    state: "Karnataka",
    allocatedAmount: 25.0,
    expenditure: 22.9,
    carriedForward: 2.1,
    variance: -8.4,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-005",
    srNo: 5,
    house: "Lok Sabha",
    constituency: "Baramati",
    mpName: "Supriya Sule",
    mpType: "Elected",
    state: "Maharashtra",
    allocatedAmount: 25.0,
    expenditure: 23.5,
    carriedForward: 1.5,
    variance: -6.0,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-006",
    srNo: 6,
    house: "Lok Sabha",
    constituency: "Thiruvananthapuram",
    mpName: "Shashi Tharoor",
    mpType: "Elected",
    state: "Kerala",
    allocatedAmount: 25.0,
    expenditure: 22.7,
    carriedForward: 2.3,
    variance: -9.2,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-007",
    srNo: 7,
    house: "Lok Sabha",
    constituency: "Patna Sahib",
    mpName: "Ravi Shankar Prasad",
    mpType: "Elected",
    state: "Bihar",
    allocatedAmount: 25.0,
    expenditure: 19.8,
    carriedForward: 5.2,
    variance: -20.8,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Accumulation Watch"
  },
  {
    id: "LS-008",
    srNo: 8,
    house: "Lok Sabha",
    constituency: "Diamond Harbour",
    mpName: "Abhishek Banerjee",
    mpType: "Elected",
    state: "West Bengal",
    allocatedAmount: 25.0,
    expenditure: 23.1,
    carriedForward: 1.9,
    variance: -7.6,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-009",
    srNo: 9,
    house: "Lok Sabha",
    constituency: "Hyderabad",
    mpName: "Asaduddin Owaisi",
    mpType: "Elected",
    state: "Telangana",
    allocatedAmount: 25.0,
    expenditure: 23.9,
    carriedForward: 1.1,
    variance: -4.4,
    isBaseline: true,
    financialYear: "2024-25",
    status: "Normal"
  },
  {
    id: "LS-010",
    srNo: 10,
    house: "Lok Sabha",
    constituency: "New Delhi",
    mpName: "Bansuri Swaraj",
    mpType: "Elected",
    state: "Delhi",
    allocatedAmount: 25.0,
    expenditure: 17.5,
    carriedForward: 7.5,
    variance: -30.0,
    isBaseline: true,
    financialYear: "2024-25",
    status: "High Accumulation"
  }
];

export function generateFullLokSabha(): MPAllocation[] {
  return EMPOWERED_INDIAN_LOK_SABHA_MPS;
}

export function generateFullRajyaSabha(): MPAllocation[] {
  const list: MPAllocation[] = [];
  for (let i = 1; i <= 231; i++) {
    const state = STATES_LIST[(i * 3) % STATES_LIST.length];
    const allocated = 25.0;
    const seed = (i * 7621 + 11003) % 199999;
    const spendRatio = 0.50 + (seed / 199999) * 0.47;
    const expenditure = parseFloat((allocated * spendRatio).toFixed(2));
    const carriedForward = parseFloat((allocated - expenditure).toFixed(2));
    const variance = parseFloat((((expenditure - allocated) / allocated) * 100).toFixed(1));
    const status = carriedForward > 6.5 ? "High Accumulation" : carriedForward > 4.0 ? "Accumulation Watch" : "Normal";

    list.push({
      id: `RS-${String(i).padStart(3, "0")}`,
      srNo: i,
      house: "Rajya Sabha",
      constituency: `State Representative (${state})`,
      mpName: i <= 12 ? `Nominated Member ${i}` : `Rajya Sabha MP ${i} (${state})`,
      mpType: i <= 12 ? "Nominated" : "Elected",
      state,
      allocatedAmount: allocated,
      expenditure,
      carriedForward,
      variance,
      isBaseline: true,
      financialYear: "2024-25",
      status
    });
  }
  return list;
}

export const LOK_SABHA_MPS = generateFullLokSabha();
export const RAJYA_SABHA_MPS = generateFullRajyaSabha();
export const ALL_PARLIAMENT_MPS = [...LOK_SABHA_MPS, ...RAJYA_SABHA_MPS];

export const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: "CONT-101",
    name: "Shree Ganesh Infra & Buildcon LLP",
    registrationNumber: "REG-UP-2018-8821",
    projectCount: 28,
    totalContractValue: 4820,
    delayRate: 38.5,
    cancellationRate: 3.5,
    riskScore: 78,
    riskLevel: "review",
    connectedEntities: ["Ananya Construction", "Vikas Pipe Suppliers", "Director: Rajesh Agrawal"],
    states: ["Uttar Pradesh", "Bihar"],
    linkedProjects: ["PRJ-001", "PRJ-007"]
  },
  {
    id: "CONT-102",
    name: "Apex Jal-Shakti Engineering Pvt Ltd",
    registrationNumber: "REG-MH-2016-4412",
    projectCount: 42,
    totalContractValue: 7150,
    delayRate: 14.2,
    cancellationRate: 0.0,
    riskScore: 28,
    riskLevel: "normal",
    connectedEntities: ["Apex Holdings", "Western Pumps"],
    states: ["Maharashtra", "Karnataka", "Goa"],
    linkedProjects: ["PRJ-002", "PRJ-008"]
  },
  {
    id: "CONT-103",
    name: "Cauvery Rural Roads & Bridges Corp",
    registrationNumber: "REG-TN-2019-1099",
    projectCount: 19,
    totalContractValue: 3410,
    delayRate: 52.6,
    cancellationRate: 10.5,
    riskScore: 84,
    riskLevel: "high",
    connectedEntities: ["Kaveri Bitumen", "Sub-contractor: Surya Fleet", "Common Address Flag"],
    states: ["Tamil Nadu", "Kerala"],
    linkedProjects: ["PRJ-003"]
  },
  {
    id: "CONT-104",
    name: "Himalayan Green Energy & Power Solutions",
    registrationNumber: "REG-UK-2021-3091",
    projectCount: 15,
    totalContractValue: 1920,
    delayRate: 20.0,
    cancellationRate: 0.0,
    riskScore: 35,
    riskLevel: "normal",
    connectedEntities: ["Surya Urja Consortium"],
    states: ["Uttarakhand", "Himachal Pradesh"],
    linkedProjects: ["PRJ-004"]
  },
  {
    id: "CONT-105",
    name: "Eastern Health Tech & Bio-Medical Supplies",
    registrationNumber: "REG-WB-2020-7714",
    projectCount: 22,
    totalContractValue: 3890,
    delayRate: 45.4,
    cancellationRate: 4.5,
    riskScore: 82,
    riskLevel: "high",
    connectedEntities: ["Medipath Diagnostics", "Bengal Meditech", "Single Bidder Pattern"],
    states: ["West Bengal", "Odisha", "Jharkhand"],
    linkedProjects: ["PRJ-005"]
  },
  {
    id: "CONT-106",
    name: "Marwar Cement & Infrastructure Works",
    registrationNumber: "REG-RJ-2015-9921",
    projectCount: 31,
    totalContractValue: 5400,
    delayRate: 22.5,
    cancellationRate: 0.0,
    riskScore: 48,
    riskLevel: "watch",
    connectedEntities: ["Desert Aggregate Works"],
    states: ["Rajasthan", "Gujarat"],
    linkedProjects: ["PRJ-006"]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "PRJ-001",
    name: "Construction of Community Hall & Skill Center at Rohania",
    state: "Uttar Pradesh",
    constituency: "Varanasi",
    projectType: "Community Hall",
    sanctionedAmount: 145.0,
    awardValue: 168.2,
    expenditure: 165.0,
    physicalProgress: 75,
    financialUtilization: 98,
    status: "Under Audit Review",
    riskScore: 84,
    riskLevel: "high",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    tenderId: "TND-04-17",
    contractId: "CNT-2024-001",
    caseId: "CASE-04-17",
    sanctionDate: "2023-04-12",
    completionDate: "2024-03-31",
    description: "Multi-purpose public facility sanctioned under MPLADS scheme with specialized digital library room. Flagged for cost variance against district schedule of rates."
  },
  {
    id: "PRJ-002",
    name: "Installation of Solar-Powered RO Drinking Water Plants in 12 Wards",
    state: "Maharashtra",
    constituency: "Baramati",
    projectType: "Drinking Water",
    sanctionedAmount: 92.0,
    awardValue: 88.5,
    expenditure: 88.5,
    physicalProgress: 100,
    financialUtilization: 100,
    status: "Completed",
    riskScore: 22,
    riskLevel: "normal",
    contractorId: "CONT-102",
    contractorName: "Apex Jal-Shakti Engineering Pvt Ltd",
    tenderId: "TND-2023-89",
    contractId: "CNT-2023-042",
    sanctionDate: "2023-06-15",
    completionDate: "2023-12-20",
    description: "Clean water kiosks with solar backup for rural schools and community centers. Reconciled with GPS geotagged photo verification."
  },
  {
    id: "PRJ-003",
    name: "Upgradation of Rural Link Road from Kattur to Melur Junction (4.2 km)",
    state: "Tamil Nadu",
    constituency: "Madurai",
    projectType: "Rural Road",
    sanctionedAmount: 210.0,
    awardValue: 242.8,
    expenditure: 215.0,
    physicalProgress: 52,
    financialUtilization: 88,
    status: "Delayed",
    riskScore: 76,
    riskLevel: "review",
    contractorId: "CONT-103",
    contractorName: "Cauvery Rural Roads & Bridges Corp",
    tenderId: "TND-2023-112",
    contractId: "CNT-2023-088",
    caseId: "CASE-2024-08",
    sanctionDate: "2023-02-10",
    completionDate: "2023-11-30",
    description: "Bituminous macadam road construction. Physical progress lags 140 days behind sanctioned milestone despite substantial financial release."
  },
  {
    id: "PRJ-004",
    name: "High-Altitude Solar Microgrid & Street Lights in 18 Villages",
    state: "Uttarakhand",
    constituency: "Dehradun",
    projectType: "Solar Street Lighting",
    sanctionedAmount: 65.0,
    awardValue: 64.1,
    expenditure: 60.0,
    physicalProgress: 95,
    financialUtilization: 93,
    status: "In Progress",
    riskScore: 31,
    riskLevel: "normal",
    contractorId: "CONT-104",
    contractorName: "Himalayan Green Energy & Power Solutions",
    tenderId: "TND-2023-145",
    contractId: "CNT-2023-119",
    sanctionDate: "2023-08-20",
    completionDate: "2024-06-15",
    description: "LED street lighting along with centralized lithium-ion solar storage stations in hill hamlets."
  },
  {
    id: "PRJ-005",
    name: "Procurement of Advanced ICU Ventilators and Diagnostic Equipment for Sub-Divisional Hospital",
    state: "West Bengal",
    constituency: "Diamond Harbour",
    projectType: "Primary Health Center",
    sanctionedAmount: 180.0,
    awardValue: 198.5,
    expenditure: 198.5,
    physicalProgress: 100,
    financialUtilization: 100,
    status: "Under Audit Review",
    riskScore: 88,
    riskLevel: "high",
    contractorId: "CONT-105",
    contractorName: "Eastern Health Tech & Bio-Medical Supplies",
    tenderId: "TND-2024-02",
    contractId: "CNT-2024-019",
    caseId: "CASE-2024-11",
    sanctionDate: "2023-11-05",
    completionDate: "2024-02-28",
    description: "Critical care medical supply tender flagged for single-bid award and 34% cost variance above benchmark GeM rates."
  },
  {
    id: "PRJ-006",
    name: "Construction of 4 Additional Classrooms & Science Lab at Govt Senior Secondary School",
    state: "Rajasthan",
    constituency: "Kota",
    projectType: "School Building",
    sanctionedAmount: 78.0,
    awardValue: 79.5,
    expenditure: 65.0,
    physicalProgress: 80,
    financialUtilization: 82,
    status: "In Progress",
    riskScore: 44,
    riskLevel: "watch",
    contractorId: "CONT-106",
    contractorName: "Marwar Cement & Infrastructure Works",
    tenderId: "TND-2023-99",
    contractId: "CNT-2023-071",
    sanctionDate: "2023-09-01",
    completionDate: "2024-05-30",
    description: "Reinforced concrete structure with modular laboratory counters and clean water connection."
  },
  {
    id: "PRJ-007",
    name: "Lining and Desilting of Minor Irrigation Feeder Channel (8.5 km)",
    state: "Bihar",
    constituency: "Patna Sahib",
    projectType: "Irrigation Canal",
    sanctionedAmount: 115.0,
    awardValue: 129.0,
    expenditure: 110.0,
    physicalProgress: 60,
    financialUtilization: 85,
    status: "Delayed",
    riskScore: 71,
    riskLevel: "review",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    tenderId: "TND-2023-188",
    contractId: "CNT-2023-144",
    sanctionDate: "2023-05-18",
    completionDate: "2024-01-15",
    description: "Concrete pre-cast tile lining of agriculture distributary canal to prevent seepage losses."
  },
  {
    id: "PRJ-008",
    name: "Installation of High-Mast LED Lighting Towers at 15 Public Transport Hubs",
    state: "Karnataka",
    constituency: "Bengaluru South",
    projectType: "Solar Street Lighting",
    sanctionedAmount: 85.0,
    awardValue: 84.2,
    expenditure: 84.2,
    physicalProgress: 100,
    financialUtilization: 100,
    status: "Completed",
    riskScore: 19,
    riskLevel: "normal",
    contractorId: "CONT-102",
    contractorName: "Apex Jal-Shakti Engineering Pvt Ltd",
    tenderId: "TND-2023-210",
    contractId: "CNT-2023-176",
    sanctionDate: "2023-07-10",
    completionDate: "2023-11-25",
    description: "Octagonal galvanized high-mast lighting with auto-timer controllers at bus and metro feeder junctions."
  }
];

export const MOCK_TENDERS: Tender[] = [
  {
    id: "TND-04-17",
    title: "Construction of Multi-Purpose Community Center & Digital Skill Hall at Rohania, Varanasi",
    projectId: "PRJ-001",
    estimatedValue: 145.0,
    publishedDate: "2023-05-01",
    closingDate: "2023-05-22",
    bidderCount: 2,
    bids: [
      { bidderName: "Shree Ganesh Infra & Buildcon LLP", amount: 168.2, isWinning: true },
      { bidderName: "Ananya Construction (Related Entity)", amount: 171.0, isWinning: false }
    ],
    bidSpread: 1.6,
    status: "Scrutiny Flag",
    riskScore: 86,
    riskSignals: [
      "Low Bidder Turnout (2 bidders)",
      "Unusual Bid Spread (1.6% between 1st and 2nd bid)",
      "Shared director/address footprint between L1 and L2 bidders",
      "Winning bid exceeded estimate by +16.0%"
    ]
  },
  {
    id: "TND-2023-89",
    title: "Procurement & Turnkey Installation of 12 Solar RO Drinking Water Kiosks",
    projectId: "PRJ-002",
    estimatedValue: 92.0,
    publishedDate: "2023-06-20",
    closingDate: "2023-07-15",
    bidderCount: 5,
    bids: [
      { bidderName: "Apex Jal-Shakti Engineering Pvt Ltd", amount: 88.5, isWinning: true },
      { bidderName: "Jal Seva Projects Ltd", amount: 91.2, isWinning: false },
      { bidderName: "Thermax Water Systems", amount: 93.8, isWinning: false },
      { bidderName: "Aqua Pure Infra", amount: 95.0, isWinning: false },
      { bidderName: "Green RO Solutions", amount: 97.4, isWinning: false }
    ],
    bidSpread: 3.05,
    status: "Awarded",
    riskScore: 21,
    riskSignals: ["Competitive bidding healthy", "Winning bid within sanctioned estimate (-3.8%)"]
  },
  {
    id: "TND-2023-112",
    title: "Reconstruction and Bituminous Laying of Kattur Rural Road (4.2 km)",
    projectId: "PRJ-003",
    estimatedValue: 210.0,
    publishedDate: "2023-02-25",
    closingDate: "2023-03-20",
    bidderCount: 3,
    bids: [
      { bidderName: "Cauvery Rural Roads & Bridges Corp", amount: 242.8, isWinning: true },
      { bidderName: "Madurai Highways Buildtech", amount: 246.0, isWinning: false },
      { bidderName: "Southern Bitumen Ltd", amount: 251.5, isWinning: false }
    ],
    bidSpread: 1.3,
    status: "Scrutiny Flag",
    riskScore: 74,
    riskSignals: [
      "Bid spread under 1.5% in high value road work",
      "Award value 15.6% higher than sanctioned benchmark",
      "High historical contractor delay rate (52.6%)"
    ]
  },
  {
    id: "TND-2024-02",
    title: "Supply and Commissioning of Intensive Care Ventilators and Patient Monitors",
    projectId: "PRJ-005",
    estimatedValue: 180.0,
    publishedDate: "2023-11-10",
    closingDate: "2023-12-01",
    bidderCount: 1,
    bids: [
      { bidderName: "Eastern Health Tech & Bio-Medical Supplies", amount: 198.5, isWinning: true }
    ],
    bidSpread: 0.0,
    status: "Scrutiny Flag",
    riskScore: 92,
    riskSignals: [
      "Single-Bid Tender without mandatory retender waiver",
      "Price deviation +34% compared to GeM marketplace benchmark",
      "Non-compliance with CVC single-bid procurement guidelines"
    ]
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "CNT-2024-001",
    tenderId: "TND-04-17",
    projectId: "PRJ-001",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    awardValue: 168.2,
    startDate: "2023-06-01",
    endDate: "2024-03-31",
    completionStatus: "Delayed",
    payments: [
      { milestone: "Mobilization Advance (10%)", amount: 16.82, date: "2023-06-15", status: "Paid" },
      { milestone: "Foundation & Plinth (30%)", amount: 50.46, date: "2023-09-10", status: "Paid" },
      { milestone: "RCC Superstructure & Roof (35%)", amount: 58.87, date: "2023-12-28", status: "Paid" },
      { milestone: "Finishing & Electricals (25%)", amount: 42.05, date: "2024-03-25", status: "Withheld" }
    ],
    delayDays: 68,
    costVariance: 16.0,
    riskScore: 84,
    riskLevel: "high"
  },
  {
    id: "CNT-2023-042",
    tenderId: "TND-2023-89",
    projectId: "PRJ-002",
    contractorId: "CONT-102",
    contractorName: "Apex Jal-Shakti Engineering Pvt Ltd",
    awardValue: 88.5,
    startDate: "2023-07-20",
    endDate: "2023-12-20",
    completionStatus: "Executed",
    payments: [
      { milestone: "Plant Delivery & Site Prep (40%)", amount: 35.4, date: "2023-08-30", status: "Paid" },
      { milestone: "Installation & Water Testing (40%)", amount: 35.4, date: "2023-11-15", status: "Paid" },
      { milestone: "Final Handover & Geo-tagging (20%)", amount: 17.7, date: "2023-12-22", status: "Paid" }
    ],
    delayDays: 0,
    costVariance: -3.8,
    riskScore: 22,
    riskLevel: "normal"
  },
  {
    id: "CNT-2023-088",
    tenderId: "TND-2023-112",
    projectId: "PRJ-003",
    contractorId: "CONT-103",
    contractorName: "Cauvery Rural Roads & Bridges Corp",
    awardValue: 242.8,
    startDate: "2023-04-01",
    endDate: "2023-11-30",
    completionStatus: "Delayed",
    payments: [
      { milestone: "Earthwork & Sub-base (40%)", amount: 97.12, date: "2023-06-12", status: "Paid" },
      { milestone: "WBM Layer (30%)", amount: 72.84, date: "2023-09-05", status: "Paid" },
      { milestone: "Bituminous Top Surface (30%)", amount: 72.84, date: "2023-12-01", status: "Pending" }
    ],
    delayDays: 140,
    costVariance: 15.6,
    riskScore: 76,
    riskLevel: "review"
  },
  {
    id: "CNT-2024-019",
    tenderId: "TND-2024-02",
    projectId: "PRJ-005",
    contractorId: "CONT-105",
    contractorName: "Eastern Health Tech & Bio-Medical Supplies",
    awardValue: 198.5,
    startDate: "2023-12-10",
    endDate: "2024-02-28",
    completionStatus: "Executed",
    payments: [
      { milestone: "Equipment Supply & Inspection (80%)", amount: 158.8, date: "2024-01-20", status: "Paid" },
      { milestone: "Testing, Commissioning & Training (20%)", amount: 39.7, date: "2024-02-26", status: "Paid" }
    ],
    delayDays: 0,
    costVariance: 10.3,
    riskScore: 88,
    riskLevel: "high"
  }
];

export const MOCK_INVESTIGATIONS: InvestigationCase[] = [
  {
    id: "CASE-04-17",
    title: "Unit Rate Deviation and Bid Collusion Signal in Rohania Community Center",
    projectId: "PRJ-001",
    projectName: "Construction of Community Hall & Skill Center at Rohania",
    tenderId: "TND-04-17",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    riskScore: 86,
    riskLevel: "high",
    status: "under-review",
    primarySignal: "Suspected bid rotation; L1 and L2 bidders share registered address; cost +16% over DSR",
    evidenceIds: ["EVD-101", "EVD-102", "EVD-103"],
    timeline: [
      { date: "2023-05-22", title: "Tender Bids Opened", detail: "Only 2 bids received with a spread of 1.6%.", actor: "District Procurement Cell" },
      { date: "2023-06-01", title: "Contract Awarded to L1", detail: "Awarded at ₹168.2 Lakhs despite being 16% over estimate.", actor: "Executive Engineer" },
      { date: "2024-02-14", title: "Automated Anomaly Detected", detail: "AARAMBHA cross-referenced MCA director records and flagged common director address between both bidders.", actor: "AARAMBHA Engine" },
      { date: "2024-02-20", title: "Audit Inquiry Opened", detail: "Case placed under vigilance review; final payment of ₹42.05L withheld pending technical verification.", actor: "State Vigilance Officer" }
    ],
    notes: [
      { date: "2024-02-21", author: "V. K. Sharma", role: "Superintending Auditor", comment: "The structural measurements in the Measurement Book (MB) do not match the invoiced cement grade quantities. Difference exceeds ₹14.2 Lakhs." },
      { date: "2024-02-28", author: "P. R. Menon", role: "Vigilance Investigator", comment: "Director Rajesh Agrawal resigned from Ananya Construction 8 days before tender submission. Substantive control remained." }
    ],
    recommendedActions: [
      "Withhold remaining final milestone payment of ₹42.05 Lakhs",
      "Issue Show Cause Notice to L1 bidder under Rule 151(iii) of GFR 2017 for non-disclosure of related entity bidding",
      "Commission independent physical audit by Central Building Research Institute (CBRI) representative"
    ],
    statutoryReferences: [
      "Rule 151 (Debarment from Bidding) - General Financial Rules (GFR) 2017",
      "CVC Office Order No. 03/03/2018 on Cartelization and Bid Rigging in Public Works",
      "Section 3(3) of the Competition Act, 2002 (Anti-competitive agreements)"
    ]
  },
  {
    id: "CASE-2024-08",
    title: "Severe Execution Stoppage and Financial Discrepancy in Madurai Rural Road",
    projectId: "PRJ-003",
    projectName: "Upgradation of Rural Link Road from Kattur to Melur Junction",
    tenderId: "TND-2023-112",
    contractorId: "CONT-103",
    contractorName: "Cauvery Rural Roads & Bridges Corp",
    riskScore: 76,
    riskLevel: "review",
    status: "open",
    primarySignal: "Physical progress at 52% while 88% of sanctioned funds disbursed; site abandoned for 140 days",
    evidenceIds: ["EVD-201"],
    timeline: [
      { date: "2023-04-01", title: "Work Order Issued", detail: "Scheduled completion date set as 2023-11-30.", actor: "DRDA Madurai" },
      { date: "2023-12-15", title: "Stoppage Notice Issued", detail: "Contractor failed to mobilize equipment for bituminous layer.", actor: "Assistant Engineer" },
      { date: "2024-01-10", title: "Citizen Grievance Filed", detail: "Road left in unpaved gravel state causing monsoon waterlogging.", actor: "Panchayat President" }
    ],
    notes: [
      { date: "2024-01-18", author: "M. Soundararajan", role: "District Auditor", comment: "Contractor has 3 other delayed road contracts in neighboring constituencies. Capital diverted to commercial quarry work." }
    ],
    recommendedActions: [
      "Issue 14-day cure notice followed by contract termination under standard PWD contract clause 60",
      "Invoke Bank Guarantee of ₹24.28 Lakhs submitted at time of award",
      "Blacklist contractor from future MPLADS works across Tamil Nadu"
    ],
    statutoryReferences: [
      "MPLADS Guidelines 2023 - Clause 4.6 (Enforcement of Timelines and Penalties)",
      "Tamil Nadu Transparency in Tenders Act 1998, Section 12"
    ]
  },
  {
    id: "CASE-2024-11",
    title: "Single-Bid ICU Equipment Procurement with Extreme GeM Rate Premium",
    projectId: "PRJ-005",
    projectName: "Procurement of Advanced ICU Ventilators and Diagnostic Equipment",
    tenderId: "TND-2024-02",
    contractorId: "CONT-105",
    contractorName: "Eastern Health Tech & Bio-Medical Supplies",
    riskScore: 88,
    riskLevel: "high",
    status: "escalated",
    primarySignal: "Single bidder awarded without mandatory 2nd tender call; unit rate ₹16.5L vs ₹11.8L on GeM portal",
    evidenceIds: ["EVD-301"],
    timeline: [
      { date: "2023-11-10", title: "Tender Float", detail: "15-day short notice tender issued for specialized ICU gear.", actor: "Hospital CMOH" },
      { date: "2023-12-05", title: "Single Bid Accepted", detail: "Only one vendor submitted bids; tender finalized without retendering.", actor: "Purchase Committee" },
      { date: "2024-03-02", title: "Price Comparison Audit", detail: "AARAMBHA cross-referenced model numbers against Government e-Marketplace (GeM) prices.", actor: "AARAMBHA Engine" }
    ],
    notes: [
      { date: "2024-03-05", author: "Dr. S. Chatterjee", role: "Vigilance Officer (Health)", comment: "Tender specifications were tailored to exact technical brochure of a single distributor, excluding other certified Indian manufacturers." }
    ],
    recommendedActions: [
      "Refer procurement file to State Vigilance Directorate for forensic audit",
      "Audit members of technical purchase specification committee for conflict of interest",
      "Recover excess disbursement of ₹40.5 Lakhs through recovery proceedings"
    ],
    statutoryReferences: [
      "Rule 173(xix) of GFR 2017 - Mandatory retender on single bid unless exceptional justification recorded",
      "CVC Guidelines on Restrictive Tender Specifications (2019)"
    ]
  }
];

export const MOCK_EVIDENCE = [
  {
    id: "EVD-101",
    caseId: "CASE-04-17",
    type: "Document Reconciliation",
    title: "Comparative Bid Ledger & Company Registration Extract",
    source: "MCA21 Portal / District Procurement Portal",
    linkedEntityId: "CONT-101",
    description: "Documents showing identical registered office PIN and shared chartered accountant between winning and runner-up bidders.",
    createdAt: "2024-02-14",
    confidence: 94
  },
  {
    id: "EVD-102",
    caseId: "CASE-04-17",
    type: "Geotagged Site Evidence",
    title: "Drone Imagery & GPS Timestamp Audit of Rohania Community Hall",
    source: "District Geo-Survey Cell",
    linkedEntityId: "PRJ-001",
    description: "Satellite and drone verification reveals structural completion is at 60%, conflicting with contractor's 85% claim.",
    createdAt: "2024-02-18",
    confidence: 98
  },
  {
    id: "EVD-103",
    caseId: "CASE-04-17",
    type: "Rate Schedule Benchmark",
    title: "CPWD / UP PWD Schedule of Rates (DSR) 2023 Comparison Matrix",
    source: "Public Works Department",
    linkedEntityId: "CNT-2024-001",
    description: "Detailed unit rate breakdown indicating steel and concrete billed at 18.4% above approved rates.",
    createdAt: "2024-02-19",
    confidence: 91
  },
  {
    id: "EVD-201",
    caseId: "CASE-2024-08",
    type: "Financial Disbursement Trail",
    title: "Treasury Voucher & PFMS Fund Release Log",
    source: "PFMS Central Portal",
    linkedEntityId: "PRJ-003",
    description: "Proof of 88% fund disbursement while site inspection notes confirm asphalt laying has not commenced.",
    createdAt: "2024-01-12",
    confidence: 96
  },
  {
    id: "EVD-301",
    caseId: "CASE-2024-11",
    type: "Marketplace Benchmark",
    title: "Government e-Marketplace (GeM) Rate Card vs Tender Award Price",
    source: "GeM API / GeM Portal",
    linkedEntityId: "PRJ-005",
    description: "Exact model ICU ventilators listed on GeM at ₹11.8 Lakhs each; awarded in tender at ₹16.5 Lakhs each (+39.8%).",
    createdAt: "2024-03-02",
    confidence: 99
  }
];

export const MOCK_DOC_VERIFICATION_ITEMS: DocumentVerificationItem[] = [
  {
    id: "DOC-VER-01",
    documentType: "Invoice / Bill",
    refNumber: "INV-SG-2024-88",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    sanctionId: "PRJ-001",
    matchedFields: 8,
    totalFields: 11,
    mismatches: [
      { field: "Cement Grade M30 Unit Price", dbValue: "₹4,120 / cu.m (DSR)", docValue: "₹4,880 / cu.m (Invoiced)", variance: "+18.4%" },
      { field: "Structural TMT Bar Quantity", dbValue: "18.5 Metric Tonnes (MB)", docValue: "22.0 Metric Tonnes (Bill)", variance: "+18.9%" },
      { field: "GST Tax Invoice HSN Code", dbValue: "995411 (Public Works)", docValue: "995419 (Other Works)", variance: "HSN Mismatch" }
    ],
    status: "Discrepancy Flagged",
    recommendedAction: "Hold payment release on voucher #UP-VAR-9912 pending Measurement Book cross-verification."
  },
  {
    id: "DOC-VER-02",
    documentType: "Measurement Book (MB)",
    refNumber: "MB-VOL-14-PAGE-82",
    contractorName: "Cauvery Rural Roads & Bridges Corp",
    sanctionId: "PRJ-003",
    matchedFields: 5,
    totalFields: 9,
    mismatches: [
      { field: "Asphalt Layer Thickness", dbValue: "40 mm Dense Bituminous Macadam", docValue: "25 mm Surface Coating", variance: "-37.5% Deficit" },
      { field: "Road Length Completed", dbValue: "4.20 km", docValue: "2.18 km", variance: "-48.1% Incomplete" }
    ],
    status: "Manual Audit Required",
    recommendedAction: "Conduct core cutting test by Quality Control Division, Highways Dept, Chennai."
  },
  {
    id: "DOC-VER-03",
    documentType: "Completion Certificate",
    refNumber: "CC-MH-BAR-2023-11",
    contractorName: "Apex Jal-Shakti Engineering Pvt Ltd",
    sanctionId: "PRJ-002",
    matchedFields: 12,
    totalFields: 12,
    mismatches: [],
    status: "Reconciled",
    recommendedAction: "All 12 RO kiosks verified with GPS timestamps and Gram Panchayat NOC. Eligible for final security deposit release."
  },
  {
    id: "DOC-VER-04",
    documentType: "Tender Comparative Sheet",
    refNumber: "TND-COMP-WB-DH-02",
    contractorName: "Eastern Health Tech & Bio-Medical Supplies",
    sanctionId: "PRJ-005",
    matchedFields: 4,
    totalFields: 7,
    mismatches: [
      { field: "Approved Benchmark Cost", dbValue: "₹180.0 Lakhs", docValue: "₹198.5 Lakhs (Single Bid)", variance: "+10.3%" },
      { field: "Number of Qualified Bidders", dbValue: ">= 3 as per Rule 160", docValue: "1 Bidder Accepted", variance: "Rule Violation" }
    ],
    status: "Discrepancy Flagged",
    recommendedAction: "Escalate to Public Accounts Committee (PAC) and Comptroller & Auditor General (CAG) audit query cell."
  }
];

export const BENFORD_FORENSICS_DATA = [
  { digit: 1, expected: 30.1, actual: 28.4, difference: -1.7, status: "Normal" },
  { digit: 2, expected: 17.6, actual: 16.9, difference: -0.7, status: "Normal" },
  { digit: 3, expected: 12.5, actual: 13.2, difference: +0.7, status: "Normal" },
  { digit: 4, expected: 9.7, actual: 14.8, difference: +5.1, status: "Anomaly Flag (Cluster near ₹49,000 & ₹4,90,000 threshold limits)" },
  { digit: 5, expected: 7.9, actual: 8.1, difference: +0.2, status: "Normal" },
  { digit: 6, expected: 6.7, actual: 6.1, difference: -0.6, status: "Normal" },
  { digit: 7, expected: 5.8, actual: 5.4, difference: -0.4, status: "Normal" },
  { digit: 8, expected: 5.1, actual: 4.2, difference: -0.9, status: "Normal" },
  { digit: 9, expected: 4.6, actual: 2.9, difference: -1.7, status: "Under-represented" }
];

export const PLATFORM_MACRO_METRICS = {
  totalProjects: 18742,
  activeProjects: 4912,
  totalTenders: 12380,
  contractsAwarded: 11840,
  aggregateProcurementValueCr: 24180.5,
  highPriorityReviews: 384,
  riskDistribution: [
    { level: "Normal", count: 12410, percentage: 66.2, color: "#708b78" },
    { level: "Watch", count: 3980, percentage: 21.2, color: "#d88a35" },
    { level: "Review", count: 1968, percentage: 10.5, color: "#e3a157" },
    { level: "High Priority", count: 384, percentage: 2.1, color: "#a95744" }
  ],
  topRiskSignals: [
    { signal: "Unit Price Deviation > 15%", count: 422, severity: "High" },
    { signal: "Physical Progress vs Financial Release Gap", count: 318, severity: "High" },
    { signal: "Low Bid Spread (<2%) in Multibidder Tenders", count: 284, severity: "Review" },
    { signal: "Single-Bidder Awarded Without Waiver", count: 192, severity: "High" },
    { signal: "Related Director / Common Address Cartel", count: 147, severity: "Review" }
  ],
  riskTrend: [
    { month: "Sep 23", highRisk: 28, review: 140, totalFlagged: 168 },
    { month: "Nov 23", highRisk: 34, review: 152, totalFlagged: 186 },
    { month: "Jan 24", highRisk: 42, review: 168, totalFlagged: 210 },
    { month: "Mar 24", highRisk: 58, review: 195, totalFlagged: 253 },
    { month: "May 24", highRisk: 49, review: 181, totalFlagged: 230 },
    { month: "Jul 24", highRisk: 41, review: 162, totalFlagged: 203 },
    { month: "Sep 24", highRisk: 38, review: 154, totalFlagged: 192 }
  ],
  stateMetrics: [
    { state: "Uttar Pradesh", projects: 2940, valueCr: 3840, highRiskCases: 64, flagRate: "2.1%" },
    { state: "Maharashtra", projects: 2410, valueCr: 3120, highRiskCases: 38, flagRate: "1.5%" },
    { state: "West Bengal", projects: 1920, valueCr: 2480, highRiskCases: 52, flagRate: "2.7%" },
    { state: "Bihar", projects: 1840, valueCr: 2390, highRiskCases: 48, flagRate: "2.6%" },
    { state: "Tamil Nadu", projects: 1680, valueCr: 2140, highRiskCases: 31, flagRate: "1.8%" },
    { state: "Madhya Pradesh", projects: 1520, valueCr: 1950, highRiskCases: 29, flagRate: "1.9%" },
    { state: "Karnataka", projects: 1390, valueCr: 1820, highRiskCases: 24, flagRate: "1.7%" },
    { state: "Rajasthan", projects: 1280, valueCr: 1690, highRiskCases: 27, flagRate: "2.1%" }
  ]
};

export const DATA_SOURCES_INFO = [
  {
    name: "Empowered Indian MPLADS Telemetry (MoSPI Data)",
    sourceUrl: "https://empoweredindian.in/mplads",
    coverage: "543 Lok Sabha Constituencies • ₹83,33,66,73,298.01 Aggregate Allocated Limit",
    updateFrequency: "Imported snapshot; refresh date must be recorded with each release",
    reliability: "Source-attributed Lok Sabha allocation dataset",
    methodology: "Precision extraction of constituency-level allocation limits and carry-forward values. It does not by itself verify district-level work progress or expenditure."
  },
  {
    name: "MPLADS Central Portal (MoSPI)",
    sourceUrl: "https://mplads.gov.in",
    coverage: "Reference portal for future source-record ingestion",
    updateFrequency: "No live connector enabled in this build",
    reliability: "Official source; not queried live by this demo",
    methodology: "Use this portal to attach source records before showing sanctioned works, releases, or expenditure as verified."
  },
  {
    name: "Central Public Procurement Portal (CPPP) / e-Procurement",
    sourceUrl: "https://eprocure.gov.in",
    coverage: "Tenders, NITs, Comparative Bid Sheets, and Award Notices",
    updateFrequency: "No live connector enabled in this build",
    reliability: "Official source; not queried live by this demo",
    methodology: "The connector design supports tender documents and comparative sheets once source files or approved API access are supplied."
  },
  {
    name: "Public Financial Management System (PFMS)",
    sourceUrl: "https://pfms.nic.in",
    coverage: "Direct Benefit & Contractor Treasury Payment Vouchers",
    updateFrequency: "No live connector enabled in this build",
    reliability: "Official source; not queried live by this demo",
    methodology: "The risk model can reconcile supplied payment and milestone records; it does not claim access to PFMS vouchers."
  },
  {
    name: "Ministry of Corporate Affairs (MCA21)",
    sourceUrl: "https://mca.gov.in",
    coverage: "Registered Directors, LLP Partners, and Registered Office Addresses",
    updateFrequency: "No live connector enabled in this build",
    reliability: "Authoritative source; not queried live by this demo",
    methodology: "Relationship checks must be computed from attached corporate records and treated only as screening signals."
  },
  {
    name: "Government e-Marketplace (GeM)",
    sourceUrl: "https://gem.gov.in",
    coverage: "Standardized Public Good & Equipment Benchmark Price Index",
    updateFrequency: "No live connector enabled in this build",
    reliability: "Official source; not queried live by this demo",
    methodology: "Unit-rate comparisons are only calculated after a dated, comparable benchmark is attached to the case."
  }
];
