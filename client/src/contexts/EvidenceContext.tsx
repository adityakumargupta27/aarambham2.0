import React, { createContext, useContext, useState } from "react";
import { ProvenanceType } from "@/components/ui/ProvenanceBadge";
import { CalculatedRiskResult } from "@/lib/riskCalculator";

export interface EvidenceDrawerData {
  title: string;
  recordId: string;
  entityType: "MP / Constituency" | "Project / Work" | "Tender / Bid" | "Contractor" | "Payment Voucher" | "Audit Case";
  provenance: ProvenanceType;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  fields: Array<{
    name: string;
    value: string | number;
    provenance: ProvenanceType;
    source?: string;
  }>;
  riskCalculation?: CalculatedRiskResult;
  findings?: string[];
  recommendation?: string;
}

interface EvidenceContextType {
  isOpen: boolean;
  activeData: EvidenceDrawerData | null;
  openDrawer: (data: EvidenceDrawerData) => void;
  closeDrawer: () => void;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeData, setActiveData] = useState<EvidenceDrawerData | null>(null);

  const openDrawer = (data: EvidenceDrawerData) => {
    setActiveData(data);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <EvidenceContext.Provider value={{ isOpen, activeData, openDrawer, closeDrawer }}>
      {children}
    </EvidenceContext.Provider>
  );
}

export function useEvidence() {
  const ctx = useContext(EvidenceContext);
  if (!ctx) {
    throw new Error("useEvidence must be used within an EvidenceProvider");
  }
  return ctx;
}
