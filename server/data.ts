import { EMPOWERED_INDIAN_LOK_SABHA_MPS } from "./empoweredIndianMps";

// Server-side seed data for AARAMBHA Public Fund & Procurement Intelligence API

export const SERVER_OVERVIEW_METRICS = {
  totalProjects: 18742,
  activeProjects: 4912,
  totalTenders: 12380,
  contractsAwarded: 11840,
  aggregateProcurementValueCr: 24180.5,
  aggregateMpladsAllocationCr: 8333.67,
  highPriorityReviews: 384,
  riskDistribution: [
    { level: "Normal", count: 12410, percentage: 66.2 },
    { level: "Watch", count: 3980, percentage: 21.2 },
    { level: "Review", count: 1968, percentage: 10.5 },
    { level: "High Priority", count: 384, percentage: 2.1 }
  ]
};

export const SERVER_CONSTITUENCIES = EMPOWERED_INDIAN_LOK_SABHA_MPS;


export const SERVER_RAJYA_SABHA = [
  { id: "RS-001", house: "Rajya Sabha", constituency: "State Representative (Maharashtra)", mpName: "Rajya Sabha MP 1 (Maharashtra)", state: "Maharashtra", allocatedAmount: 25.0, expenditure: 23.2, carriedForward: 1.8, status: "Normal" },
  { id: "RS-002", house: "Rajya Sabha", constituency: "State Representative (Tamil Nadu)", mpName: "Rajya Sabha MP 2 (Tamil Nadu)", state: "Tamil Nadu", allocatedAmount: 25.0, expenditure: 22.5, carriedForward: 2.5, status: "Normal" },
  { id: "RS-003", house: "Rajya Sabha", constituency: "State Representative (West Bengal)", mpName: "Rajya Sabha MP 3 (West Bengal)", state: "West Bengal", allocatedAmount: 25.0, expenditure: 18.9, carriedForward: 6.1, status: "High Accumulation" }
];

export const SERVER_PROJECTS = [
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
    caseId: "CASE-04-17"
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
    contractId: "CNT-2023-042"
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
    caseId: "CASE-2024-08"
  }
];

export const SERVER_CONTRACTORS = [
  {
    id: "CONT-101",
    name: "Shree Ganesh Infra & Buildcon LLP",
    registrationNumber: "REG-UP-2018-8821",
    projectCount: 28,
    totalContractValue: 4820,
    delayRate: 38.5,
    riskScore: 78,
    riskLevel: "review",
    connectedEntities: ["Ananya Construction", "Vikas Pipe Suppliers"]
  },
  {
    id: "CONT-102",
    name: "Apex Jal-Shakti Engineering Pvt Ltd",
    registrationNumber: "REG-MH-2016-4412",
    projectCount: 42,
    totalContractValue: 7150,
    delayRate: 14.2,
    riskScore: 28,
    riskLevel: "normal",
    connectedEntities: ["Apex Holdings", "Western Pumps"]
  },
  {
    id: "CONT-103",
    name: "Cauvery Rural Roads & Bridges Corp",
    registrationNumber: "REG-TN-2019-1099",
    projectCount: 19,
    totalContractValue: 3410,
    delayRate: 52.6,
    riskScore: 84,
    riskLevel: "high",
    connectedEntities: ["Kaveri Bitumen", "Surya Fleet"]
  }
];

export const SERVER_TENDERS = [
  {
    id: "TND-04-17",
    title: "Construction of Multi-Purpose Community Center & Digital Skill Hall at Rohania",
    projectId: "PRJ-001",
    estimatedValue: 145.0,
    publishedDate: "2023-05-01",
    bidderCount: 2,
    bidSpread: 1.6,
    status: "Scrutiny Flag",
    riskScore: 86
  }
];

export const SERVER_CONTRACTS = [
  {
    id: "CNT-2024-001",
    tenderId: "TND-04-17",
    projectId: "PRJ-001",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    awardValue: 168.2,
    completionStatus: "Delayed",
    delayDays: 68,
    costVariance: 16.0,
    riskScore: 84,
    riskLevel: "high"
  }
];

export const SERVER_INVESTIGATIONS = [
  {
    id: "CASE-04-17",
    title: "Unit Rate Deviation and Bid Collusion Signal in Rohania Community Center",
    projectId: "PRJ-001",
    contractorId: "CONT-101",
    contractorName: "Shree Ganesh Infra & Buildcon LLP",
    riskScore: 86,
    riskLevel: "high",
    status: "under-review",
    primarySignal: "Suspected bid rotation; L1 and L2 share registered address"
  }
];

export const SERVER_DATASOURCES = [
  { name: "MPLADS Central Portal (MoSPI)", sourceUrl: "https://mplads.gov.in", coverage: "543 Lok Sabha + 231 Rajya Sabha", reliability: "Official Statutory Register" },
  { name: "Central Public Procurement Portal (CPPP)", sourceUrl: "https://eprocure.gov.in", coverage: "Tenders and Bid Comparative Sheets", reliability: "Statutory e-Tender Records" },
  { name: "Public Financial Management System (PFMS)", sourceUrl: "https://pfms.nic.in", coverage: "Treasury Disbursement Vouchers", reliability: "Ministry of Finance" }
];
