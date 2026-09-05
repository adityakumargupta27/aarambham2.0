/**
 * AARAMBHA Backend Deterministic Risk Engine (CommonJS)
 */

const BASE_WEIGHTS = {
  priceDeviation: 0.30,
  progressGap: 0.25,
  bidRisk: 0.20,
  contractorHistory: 0.15,
  documentMismatch: 0.10
};

function calculateDeterministicRisk(inputs = {}) {
  const components = [];
  const findings = [];

  // 1. Normalized Price Deviation (0-100)
  let normPriceDev = 0;
  let priceAssessed = false;
  if (inputs.unitPrice !== undefined && inputs.medianPrice !== undefined && inputs.medianPrice > 0) {
    priceAssessed = true;
    const devPct = ((inputs.unitPrice - inputs.medianPrice) / inputs.medianPrice) * 100;
    normPriceDev = Math.min(100, Math.max(0, devPct * 2.0));
    if (devPct > 15) {
      findings.push(`Unit rate deviation of +${devPct.toFixed(1)}% above GeM/DSR median threshold`);
    }
  }
  components.push({
    key: "priceDeviation",
    name: "Schedule of Rates & Price Deviation",
    rawInput: { unitPrice: inputs.unitPrice, medianPrice: inputs.medianPrice },
    assessed: priceAssessed,
    normalizedScore: parseFloat(normPriceDev.toFixed(1)),
    baseWeight: BASE_WEIGHTS.priceDeviation,
    activeWeight: 0,
    contribution: 0,
    formulaExplanation: priceAssessed
      ? `min(100, max(0, ((unitPrice - median) / median) * 200)) = ${normPriceDev.toFixed(1)}`
      : "Not assessed (Unit rates unavailable in current tender record)"
  });

  // 2. Normalized Progress Gap (0-100)
  let normProgressGap = 0;
  let progressAssessed = false;
  if (inputs.financialUtilization !== undefined && inputs.physicalProgress !== undefined) {
    progressAssessed = true;
    const gap = inputs.financialUtilization - inputs.physicalProgress;
    normProgressGap = Math.min(100, Math.max(0, gap * 2.0));
    if (gap > 15) {
      findings.push(`Disbursement advance gap: Financial release (${inputs.financialUtilization}%) leads physical execution (${inputs.physicalProgress}%) by ${gap.toFixed(1)}%`);
    }
  }
  components.push({
    key: "progressGap",
    name: "Physical Execution vs Financial Disbursement Gap",
    rawInput: { financialUtilization: inputs.financialUtilization, physicalProgress: inputs.physicalProgress },
    assessed: progressAssessed,
    normalizedScore: parseFloat(normProgressGap.toFixed(1)),
    baseWeight: BASE_WEIGHTS.progressGap,
    activeWeight: 0,
    contribution: 0,
    formulaExplanation: progressAssessed
      ? `min(100, max(0, (financial% - physical%) * 2.0)) = ${normProgressGap.toFixed(1)}`
      : "Not assessed (Measurement book progress unverified)"
  });

  // 3. Normalized Bid Risk (0-100)
  let normBidRisk = 0;
  let bidAssessed = false;
  if (inputs.bidderCount !== undefined) {
    bidAssessed = true;
    if (inputs.bidderCount <= 1) {
      normBidRisk = 100;
      findings.push("Single-bidder tender awarded without competitive participation waiver");
    } else if (inputs.bidSpread !== undefined) {
      if (inputs.bidSpread < 2.0) {
        normBidRisk = Math.min(100, Math.max(0, (2.0 - inputs.bidSpread) * 45 + 30));
        findings.push(`Narrow bid spread of ${inputs.bidSpread.toFixed(1)}% (<2% cartelization threshold)`);
      } else {
        normBidRisk = 0;
      }
    }
  }
  components.push({
    key: "bidRisk",
    name: "Tender Participation & Bid Spread Anomaly",
    rawInput: { bidderCount: inputs.bidderCount, bidSpread: inputs.bidSpread },
    assessed: bidAssessed,
    normalizedScore: parseFloat(normBidRisk.toFixed(1)),
    baseWeight: BASE_WEIGHTS.bidRisk,
    activeWeight: 0,
    contribution: 0,
    formulaExplanation: bidAssessed
      ? (inputs.bidderCount !== undefined && inputs.bidderCount <= 1 ? "Single-bidder automatic 100 score" : `Bid spread ${inputs.bidSpread}% normalized to ${normBidRisk.toFixed(1)}`)
      : "Not assessed (Comparative bid sheet not published)"
  });

  // 4. Normalized Contractor History (0-100)
  let normContractor = 0;
  let contractorAssessed = false;
  if (inputs.contractorDelayRate !== undefined) {
    contractorAssessed = true;
    const cancelRate = inputs.contractorCancellationRate || 0;
    normContractor = Math.min(100, inputs.contractorDelayRate * 1.5 + cancelRate * 3.0);
    if (inputs.contractorDelayRate > 30) {
      findings.push(`Contractor has elevated historical project delay rate of ${inputs.contractorDelayRate}%`);
    }
  }
  components.push({
    key: "contractorHistory",
    name: "Contractor Performance & Delay History",
    rawInput: { delayRate: inputs.contractorDelayRate, cancellationRate: inputs.contractorCancellationRate },
    assessed: contractorAssessed,
    normalizedScore: parseFloat(normContractor.toFixed(1)),
    baseWeight: BASE_WEIGHTS.contractorHistory,
    activeWeight: 0,
    contribution: 0,
    formulaExplanation: contractorAssessed
      ? `min(100, (delayRate * 1.5) + (cancellation * 3.0)) = ${normContractor.toFixed(1)}`
      : "Not assessed (Contractor registry history pending resolution)"
  });

  // 5. Normalized Document Mismatch (0-100)
  let normDoc = 0;
  let docAssessed = false;
  if (inputs.documentMismatchCount !== undefined) {
    docAssessed = true;
    normDoc = Math.min(100, inputs.documentMismatchCount * 25);
    if (inputs.documentMismatchCount > 0) {
      findings.push(`${inputs.documentMismatchCount} field mismatch(es) detected between invoice and measurement vouchers`);
    }
  }
  components.push({
    key: "documentMismatch",
    name: "Voucher & Invoice Reconciliation Discrepancies",
    rawInput: { mismatchCount: inputs.documentMismatchCount },
    assessed: docAssessed,
    normalizedScore: parseFloat(normDoc.toFixed(1)),
    baseWeight: BASE_WEIGHTS.documentMismatch,
    activeWeight: 0,
    contribution: 0,
    formulaExplanation: docAssessed
      ? `min(100, mismatchCount * 25) = ${normDoc.toFixed(1)}`
      : "Not assessed (Vouchers pending OCR ingest)"
  });

  // DYNAMIC REWEIGHTING FOR MISSING/UNASSESSED DATA
  const assessedTotalWeight = components
    .filter(c => c.assessed)
    .reduce((sum, c) => sum + c.baseWeight, 0);

  let compositeScore = 0;
  if (assessedTotalWeight > 0) {
    components.forEach(c => {
      if (c.assessed) {
        c.activeWeight = parseFloat((c.baseWeight / assessedTotalWeight).toFixed(4));
        c.contribution = parseFloat((c.activeWeight * c.normalizedScore).toFixed(1));
        compositeScore += c.contribution;
      } else {
        c.activeWeight = 0;
        c.contribution = 0;
      }
    });
  }

  compositeScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

  let riskLevel = "normal";
  if (compositeScore >= 70) riskLevel = "high";
  else if (compositeScore >= 45) riskLevel = "review";
  else if (compositeScore >= 25) riskLevel = "watch";

  let confidence = "high";
  if (assessedTotalWeight < 0.50) confidence = "low";
  else if (assessedTotalWeight < 0.80) confidence = "medium";

  const recommendation =
    riskLevel === "high" || riskLevel === "review"
      ? "Recommend human verification: Inspect measurement book sign-offs and issue clarification request to District Authority."
      : "Routine statutory audit cycle: Retain record in normal monitoring registry.";

  return {
    compositeScore,
    riskLevel,
    confidence,
    assessedWeightRatio: assessedTotalWeight,
    components,
    findings,
    recommendation,
    disclaimer: "This is a deterministic decision-support calculation. Not a judicial finding or allegation of criminality."
  };
}

module.exports = {
  calculateDeterministicRisk,
  BASE_WEIGHTS
};
