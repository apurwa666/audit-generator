import { AuditData, CalculatedReport } from '../types/audit';

export interface FixedAssetCalculation {
  additions: number;
  depreciationBase: number;
  depreciation: number;
  netBookValue: number;
}

/** Resolve the single additions value consistently across the calculation, preview, and export. */
export function getFixedAssetAdditions(asset: AuditData['fixedAssets'][number]): number {
  if (asset.totalAdditions !== undefined && asset.totalAdditions !== null && asset.totalAdditions !== 0) {
    return asset.totalAdditions;
  }

  return (asset.additionsFirstHalf || 0) + (asset.additionsSecondHalf || 0) + (asset.additionsThirdHalf || 0);
}

export function calculateFixedAssetAmounts(
  asset: AuditData['fixedAssets'][number]
): FixedAssetCalculation {
  const additions = getFixedAssetAdditions(asset);
  const depreciationBase = Math.max(
    0,
    (asset.openingBalance || 0) + additions - (asset.disposalsDuringYear || 0)
  );
  const depreciation = (depreciationBase * (asset.ratePercent || 0)) / 100;

  return {
    additions,
    depreciationBase,
    depreciation,
    netBookValue: depreciationBase - depreciation,
  };
}

export function calculateAuditReport(data: AuditData): CalculatedReport {
  // 1. VAT Reconciliation Totals
  const totalTaxableSalesVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.taxableSales || 0), 0);
  const totalDiscountedSalesVatRec = data.vatReconciliation.reduce(
    (sum, m) => sum + (m.discountedSales !== undefined ? m.discountedSales : (m.vatFreeSales || 0)),
    0
  );
  const totalVatFreeSalesVatRec = totalDiscountedSalesVatRec;
  const totalSalesVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.salesVat || 0), 0);
  const totalThapGhatSalesVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.thapGhatSalesVat || 0), 0);

  const totalTaxablePurchaseVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.taxablePurchase || 0), 0);
  const totalDiscountedPurchaseVatRec = data.vatReconciliation.reduce(
    (sum, m) => sum + (m.discountedPurchase !== undefined ? m.discountedPurchase : (m.vatFreePurchase || 0)),
    0
  );
  const totalVatFreePurchaseVatRec = totalDiscountedPurchaseVatRec;
  const totalPurchaseVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.purchaseVat || 0), 0);
  const totalThapGhatPurchaseVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.thapGhatPurchaseVat || 0), 0);
  const totalVatPaidVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.vatPaidToBank || 0), 0);
  const totalPayableVatRec = data.vatReconciliation.reduce((sum, m) => sum + (m.payable || 0), 0);
  const totalThapGhatVat = data.vatReconciliation.reduce((sum, m) => sum + (m.thapGhatVat || 0), 0);

  const netVatPayableOrReceivableVatRec =
    (totalSalesVatRec + totalThapGhatSalesVatRec) -
    (totalPurchaseVatRec + totalThapGhatPurchaseVatRec) -
    totalVatPaidVatRec +
    totalThapGhatVat;

  // Effective Sales and Purchases (auto-pull from VAT register if configured)
  const currentSales = data.trading.useVatRegisterTotals && totalTaxableSalesVatRec > 0
    ? totalTaxableSalesVatRec + totalVatFreeSalesVatRec
    : (data.trading.sales || 0);

  const currentPurchases = data.trading.useVatRegisterTotals && totalTaxablePurchaseVatRec > 0
    ? totalTaxablePurchaseVatRec + totalVatFreePurchaseVatRec
    : (data.trading.purchases || 0);

  const previousSales = data.trading.previousYearSales || 0;
  const previousPurchases = data.trading.previousYearPurchases || 0;

  // 2. Fixed Assets & Depreciation (Schedule 3)
  let totalDepreciationCurrent = 0;
  let totalFixedAssetsNetBlockCurrent = 0;
  let totalDepreciationPrevious = 0;
  let totalFixedAssetsNetBlockPrevious = 0;

  data.fixedAssets.forEach((asset) => {
    const figures = calculateFixedAssetAmounts(asset);
    totalDepreciationCurrent += figures.depreciation;
    totalFixedAssetsNetBlockCurrent += figures.netBookValue;

    // Comparative net book value is supplied directly for the prior year.
    totalFixedAssetsNetBlockPrevious += asset.previousYearNetValue || 0;
  });

  // Prior-year depreciation cannot be derived reliably from closing net book value alone.
  // Do not invent a fixed 25% comparative charge when the prior-year movement schedule is absent.
  totalDepreciationPrevious = 0;

  // 3. Trading & Cost of Goods Sold. Mirrors workbook: opening stock + purchases + direct costs - closing stock.\n  // Do not clamp COGS at zero: that hides inconsistent/negative stock movements which should be reviewed.
  const costOfGoodsAvailableCurrent =
    (data.trading.openingStock || 0) +
    currentPurchases +
    (data.trading.localTransportation || 0) +
    (data.trading.directWages || 0);

  const cogsCurrent = costOfGoodsAvailableCurrent - (data.trading.closingStock || 0);
  const grossProfitCurrent = currentSales - cogsCurrent;
  const grossProfitMarginPercent = currentSales > 0 ? (grossProfitCurrent / currentSales) * 100 : 0;

  const costOfGoodsAvailablePrevious =
    (data.trading.previousYearOpeningStock || 0) +
    previousPurchases +
    (data.trading.previousYearLocalTransportation || 0) +
    (data.trading.previousYearDirectWages || 0);

  const cogsPrevious = costOfGoodsAvailablePrevious - (data.trading.previousYearClosingStock || 0);
  const grossProfitPrevious = previousSales - cogsPrevious;

  // 4. Other Income & Administrative Expenses (Schedule 7)
  const totalOtherIncomeCurrent = (data.otherIncome.bankInterest || 0) + (data.otherIncome.miscellaneousIncome || 0);
  const totalOtherIncomePrevious = (data.otherIncome.previousYearBankInterest || 0) + (data.otherIncome.previousYearMiscellaneousIncome || 0);

  const totalIncomeCurrent = currentSales + totalOtherIncomeCurrent;
  const totalIncomePrevious = previousSales + totalOtherIncomePrevious;

  const totalAdminExpensesCurrent = data.adminExpenses.reduce((sum, item) => sum + (item.currentYear || 0), 0);
  const totalAdminExpensesPrevious = data.adminExpenses.reduce((sum, item) => sum + (item.previousYear || 0), 0);

  const operatingProfitCurrent = grossProfitCurrent + totalOtherIncomeCurrent - totalAdminExpensesCurrent;
  const operatingProfitPrevious = grossProfitPrevious + totalOtherIncomePrevious - totalAdminExpensesPrevious;

  const totalInterestAndChargesCurrent = (data.finance.interestOnLoan || 0) + (data.finance.bankCharges || 0);
  const totalInterestAndChargesPrevious = (data.finance.previousYearInterestOnLoan || 0) + (data.finance.previousYearBankCharges || 0);

  const profitBeforeTaxCurrent = operatingProfitCurrent - totalDepreciationCurrent - totalInterestAndChargesCurrent;
  const profitBeforeTaxPrevious = operatingProfitPrevious - totalDepreciationPrevious - totalInterestAndChargesPrevious;

  // 5. Income Tax Calculation (Schedule 8 / Nepal Income Tax Act 2058)
  let calculatedTaxLiabilityCurrent = 0;
  let calculatedTaxLiabilityPrevious = 0;

  // Taxable business income can include Section 14 disallowed interest adjustment
  const taxableBusinessIncome = Math.max(0, profitBeforeTaxCurrent + (data.finance.disallowedInterestSec14 || 0) - (data.taxSettings.donationSec12 || 0));

  if (data.taxSettings.taxRateType === 'manual') {
    calculatedTaxLiabilityCurrent = data.taxSettings.manualTaxProvision || 0;
  } else if (data.taxSettings.taxRateType === 'corporate_25') {
    calculatedTaxLiabilityCurrent = taxableBusinessIncome > 0 ? taxableBusinessIncome * 0.25 : 0;
  } else if (data.taxSettings.taxRateType === 'corporate_20') {
    calculatedTaxLiabilityCurrent = taxableBusinessIncome > 0 ? taxableBusinessIncome * 0.20 : 0;
  } else {
    // Standard Nepal Income Tax Slabs for Proprietorship / Natural Person (As reflected in sample D3):
    // Couple slab: 0 to 600,000: 0%
    // 600,000 to 800,000: 10% (Rs. 20,000)
    // 800,000 to 1,100,000: 20% (Rs. 60,000)
    // 1,100,000 to 2,000,000: 30% (Rs. 270,000)
    // 2,000,000 to 5,000,000: 36%
    // Above 5,000,000: 39%
    const isCouple = data.taxSettings.maritalStatus === 'couple';
    const firstThreshold = isCouple ? 600000 : 500000;
    const secondThreshold = isCouple ? 800000 : 700000;
    const thirdThreshold = isCouple ? 1100000 : 1000000;
    const fourthThreshold = 2000000;
    const fifthThreshold = 5000000;

    let income = taxableBusinessIncome;
    let tax = 0;

    if (income > 0) {
      if (income <= firstThreshold) {
        tax = 0; // Sole proprietorship business income exemption under basic slab
      } else {
        // First tier is 0
        income -= firstThreshold;

        // Second tier (e.g. 200k @ 10%)
        const tier2Range = secondThreshold - firstThreshold;
        const tier2Taxable = Math.min(income, tier2Range);
        tax += tier2Taxable * 0.10;
        income -= tier2Taxable;

        if (income > 0) {
          // Third tier (e.g. 300k @ 20%)
          const tier3Range = thirdThreshold - secondThreshold;
          const tier3Taxable = Math.min(income, tier3Range);
          tax += tier3Taxable * 0.20;
          income -= tier3Taxable;
        }

        if (income > 0) {
          // Fourth tier (up to 2M @ 30%)
          const tier4Range = fourthThreshold - thirdThreshold;
          const tier4Taxable = Math.min(income, tier4Range);
          tax += tier4Taxable * 0.30;
          income -= tier4Taxable;
        }

        if (income > 0) {
          // Fifth tier (2M to 5M @ 36%)
          const tier5Range = fifthThreshold - fourthThreshold;
          const tier5Taxable = Math.min(income, tier5Range);
          tax += tier5Taxable * 0.36;
          income -= tier5Taxable;
        }

        if (income > 0) {
          // Above 5M @ 39%
          tax += income * 0.39;
        }
      }
    }
    calculatedTaxLiabilityCurrent = tax;
  }

  const advanceTaxPaidCurrent = data.currentAssets.advanceIncomeTax || 0;
  const netTaxPayableOrRefundableCurrent = calculatedTaxLiabilityCurrent - advanceTaxPaidCurrent;

  // 6. Net Profit After Tax
  const netProfitAfterTaxCurrent = profitBeforeTaxCurrent - calculatedTaxLiabilityCurrent;
  const netProfitAfterTaxPrevious = profitBeforeTaxPrevious - calculatedTaxLiabilityPrevious;

  // 7. Reserves & Surplus (Schedule 2)
  const closingReservesAndSurplusCurrent =
    (data.reserves.openingSurplus || 0) +
    netProfitAfterTaxCurrent -
    (data.capital.withdrawalsDrawings || 0);

  const closingReservesAndSurplusPrevious =
    (data.reserves.previousYearOpeningSurplus || 0) + netProfitAfterTaxPrevious;

  // 8. Capital & Equity (Schedule 1)
  const totalProprietorFundCurrent =
    (data.capital.openingCapital || 0) + (data.capital.additionalInvestment || 0);

  const totalProprietorFundPrevious =
    (data.capital.previousYearCapital || 0) + (data.capital.previousYearAdditional || 0);

  const totalEquityCurrent = totalProprietorFundCurrent + closingReservesAndSurplusCurrent;
  const totalEquityPrevious = totalProprietorFundPrevious + closingReservesAndSurplusPrevious;

  // 9. Current Assets (Schedule 4, 5, etc.)
  const effectiveVatReceivable = data.currentAssets.useVatRegisterReceivable && netVatPayableOrReceivableVatRec < 0
    ? Math.abs(netVatPayableOrReceivableVatRec)
    : (data.currentAssets.vatReceivable || 0);

  const totalCurrentAssetsCurrent =
    (data.currentAssets.cashAndBank || 0) +
    (data.trading.closingStock || 0) +
    (data.currentAssets.sundryDebtors || 0) +
    effectiveVatReceivable +
    (data.currentAssets.advanceIncomeTax || 0) +
    (data.currentAssets.loansAndAdvances || 0);

  const totalCurrentAssetsPrevious =
    (data.currentAssets.previousYearCashAndBank || 0) +
    (data.trading.previousYearClosingStock || 0) +
    (data.currentAssets.previousYearSundryDebtors || 0) +
    (data.currentAssets.previousYearVatReceivable || 0) +
    (data.currentAssets.previousYearAdvanceIncomeTax || 0) +
    (data.currentAssets.previousYearLoansAndAdvances || 0);

  // 10. Current Liabilities & Provisions (Schedule 6)
  const effectiveVatPayable = data.currentAssets.useVatRegisterReceivable && netVatPayableOrReceivableVatRec > 0
    ? netVatPayableOrReceivableVatRec
    : 0;

  const totalCurrentLiabilitiesCurrent =
    (data.currentLiabilities.sundryCreditors || 0) +
    (data.currentLiabilities.bankOverdraft || 0) +
    (data.currentLiabilities.auditFeePayable || 0) +
    (data.currentLiabilities.tdsOnAuditFeePayable || 0) +
    (data.currentLiabilities.tdsOnHouseRentPayable || 0) +
    (data.currentLiabilities.tdsOnTransportationPayable || 0) +
    (data.currentLiabilities.salaryTdsPayable || 0) +
    (data.currentLiabilities.interestPayable || 0) +
    (data.currentLiabilities.otherPayables || 0) +
    effectiveVatPayable +
    calculatedTaxLiabilityCurrent;

  const totalCurrentLiabilitiesPrevious =
    (data.currentLiabilities.previousYearSundryCreditors || 0) +
    (data.currentLiabilities.previousYearBankOverdraft || 0) +
    (data.currentLiabilities.previousYearAuditFeePayable || 0) +
    (data.currentLiabilities.previousYearTdsOnAuditFeePayable || 0) +
    (data.currentLiabilities.previousYearTdsOnHouseRentPayable || 0) +
    (data.currentLiabilities.previousYearTdsOnTransportationPayable || 0) +
    (data.currentLiabilities.previousYearSalaryTdsPayable || 0) +
    (data.currentLiabilities.previousYearInterestPayable || 0) +
    (data.currentLiabilities.previousYearOtherPayables || 0) +
    calculatedTaxLiabilityPrevious;

  const netCurrentAssetsCurrent = totalCurrentAssetsCurrent - totalCurrentLiabilitiesCurrent;
  const netCurrentAssetsPrevious = totalCurrentAssetsPrevious - totalCurrentLiabilitiesPrevious;

  // 11. Non-Current Liabilities
  const totalNonCurrentLiabilitiesCurrent =
    (data.nonCurrentLiabilities.longTermBankLoans || 0) +
    (data.nonCurrentLiabilities.otherLongTermBorrowings || 0);

  const totalNonCurrentLiabilitiesPrevious =
    (data.nonCurrentLiabilities.previousYearLongTermBankLoans || 0) +
    (data.nonCurrentLiabilities.previousYearOtherLongTermBorrowings || 0);

  // 12. Balance Sheet Totals & Verification
  // In Nepal Format (D2 & D3):
  // Capital & Liabilities = Total Equity + Non-Current Liabilities + (Current Liabilities if gross format)
  // or Net Assets Presentation: Total Capital & Liabilities = Total Equity + Non-Current Liabilities
  // Total Assets = Net Block + Net Current Assets
  // We compute both gross and net representations:
  const totalLiabilitiesAndEquityCurrent = totalEquityCurrent + totalNonCurrentLiabilitiesCurrent;
  const totalAssetsCurrent = totalFixedAssetsNetBlockCurrent + netCurrentAssetsCurrent;

  const totalLiabilitiesAndEquityPrevious = totalEquityPrevious + totalNonCurrentLiabilitiesPrevious;
  const totalAssetsPrevious = totalFixedAssetsNetBlockPrevious + netCurrentAssetsPrevious;

  const diffCurrent = Math.abs(totalLiabilitiesAndEquityCurrent - totalAssetsCurrent);
  const diffPrevious = Math.abs(totalLiabilitiesAndEquityPrevious - totalAssetsPrevious);

  const isBalancedCurrent = diffCurrent < 1.0; // within 1 rupee rounding
  const isBalancedPrevious = diffPrevious < 1.0;

  // 13. Cash Flow Statement Calculation
  // Operating: Net Profit + Depr + delta WC
  const changeInCurrentAssets = totalCurrentAssetsPrevious - totalCurrentAssetsCurrent;
  const changeInCurrentLiabilities = totalCurrentLiabilitiesCurrent - totalCurrentLiabilitiesPrevious;
  const workingCapitalChange = changeInCurrentAssets + changeInCurrentLiabilities;

  const cashFromOperations = profitBeforeTaxCurrent + totalDepreciationCurrent + workingCapitalChange - calculatedTaxLiabilityCurrent;

  // Investing: purchase/sales of fixed assets
  const totalFixedAssetAdditions = data.fixedAssets.reduce((sum, asset) => sum + getFixedAssetAdditions(asset), 0);
  const totalFixedAssetDisposals = data.fixedAssets.reduce((sum, a) => sum + (a.disposalsDuringYear || 0), 0);
  const cashFromInvesting = totalFixedAssetDisposals - totalFixedAssetAdditions;

  // Financing: capital additions, loans, drawings
  const changeInLoans = (data.nonCurrentLiabilities.longTermBankLoans - data.nonCurrentLiabilities.previousYearLongTermBankLoans) +
    (data.currentLiabilities.bankOverdraft - data.currentLiabilities.previousYearBankOverdraft);
  const capitalInjected = data.capital.additionalInvestment || 0;
  const drawingsTaken = data.capital.withdrawalsDrawings || 0;
  const cashFromFinancing = capitalInjected + changeInLoans - drawingsTaken;

  const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;
  const openingCash = data.currentAssets.previousYearCashAndBank || 0;
  const closingCash = data.currentAssets.cashAndBank || 0;
  const isCashReconciled = Math.abs((openingCash + netChangeInCash) - closingCash) < 2.0;

  return {
    cogsCurrent,
    cogsPrevious,
    costOfGoodsAvailableCurrent,
    costOfGoodsAvailablePrevious,
    grossProfitCurrent,
    grossProfitPrevious,
    grossProfitMarginPercent,

    totalIncomeCurrent,
    totalIncomePrevious,
    totalAdminExpensesCurrent,
    totalAdminExpensesPrevious,
    totalDepreciationCurrent,
    totalDepreciationPrevious,
    operatingProfitCurrent,
    operatingProfitPrevious,
    totalInterestAndChargesCurrent,
    totalInterestAndChargesPrevious,
    profitBeforeTaxCurrent,
    profitBeforeTaxPrevious,

    calculatedTaxLiabilityCurrent,
    calculatedTaxLiabilityPrevious,
    advanceTaxPaidCurrent,
    netTaxPayableOrRefundableCurrent,

    netProfitAfterTaxCurrent,
    netProfitAfterTaxPrevious,

    totalProprietorFundCurrent,
    totalProprietorFundPrevious,
    closingReservesAndSurplusCurrent,
    closingReservesAndSurplusPrevious,
    totalEquityCurrent,
    totalEquityPrevious,

    totalFixedAssetsNetBlockCurrent,
    totalFixedAssetsNetBlockPrevious,

    totalCurrentAssetsCurrent,
    totalCurrentAssetsPrevious,
    totalCurrentLiabilitiesCurrent,
    totalCurrentLiabilitiesPrevious,
    netCurrentAssetsCurrent,
    netCurrentAssetsPrevious,

    totalNonCurrentLiabilitiesCurrent,
    totalNonCurrentLiabilitiesPrevious,

    totalLiabilitiesAndEquityCurrent,
    totalLiabilitiesAndEquityPrevious,
    totalAssetsCurrent,
    totalAssetsPrevious,
    isBalancedCurrent,
    isBalancedPrevious,
    balanceDifferenceCurrent: diffCurrent,
    balanceDifferencePrevious: diffPrevious,

    totalTaxableSalesVatRec,
    totalVatFreeSalesVatRec,
    totalDiscountedSalesVatRec,
    totalSalesVatRec,
    totalThapGhatSalesVatRec,
    totalTaxablePurchaseVatRec,
    totalVatFreePurchaseVatRec,
    totalDiscountedPurchaseVatRec,
    totalPurchaseVatRec,
    totalThapGhatPurchaseVatRec,
    totalVatPaidVatRec,
    totalPayableVatRec,
    netVatPayableOrReceivableVatRec,

    cashFlow: {
      cashFromOperations,
      cashFromInvesting,
      cashFromFinancing,
      netChangeInCash,
      openingCash,
      closingCash,
      isCashReconciled
    }
  };
}

export function formatNPR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0.00';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format to 2 decimal places
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return isNegative ? `(${formatted})` : formatted;
}

export function checkAuditDataCompleteness(data: AuditData): {
  isComplete: boolean;
  missingFields: string[];
} {
  const missing: string[] = [];

  if (!data.client.entityName?.trim()) {
    missing.push('संस्था / फर्मको नाम (Client Enterprise Name)');
  }
  if (!data.client.proprietorName?.trim()) {
    missing.push('प्रोप्राइटर / सञ्चालकको नाम (Proprietor Name)');
  }
  if (!data.client.panNo?.trim()) {
    missing.push('प्यान वा भ्याट नम्बर (PAN/VAT No.)');
  }
  if (!data.client.address?.trim()) {
    missing.push('फर्मको ठेगाना (Client Enterprise Address)');
  }
  if (!data.client.currentFiscalYear?.trim()) {
    missing.push('चालु आर्थिक वर्ष (Current Fiscal Year)');
  }

  // Auditor information is mandatory ONLY for D3 reports; in D2 reports, auditor info is optional
  const isD3 = (data.auditTemplateType || 'D2') === 'D3';
  if (isD3) {
    if (!data.auditor.firmName?.trim()) {
      missing.push('लेखापरीक्षक फर्मको नाम (Auditor Firm Name)');
    }
    if (!data.auditor.auditorName?.trim()) {
      missing.push('लेखापरीक्षकको नाम (Auditor Full Name)');
    }
    if (!data.auditor.icanRegdNo?.trim()) {
      missing.push('आईक्यान दर्ता नम्बर (ICAN Regd. No.)');
    }
    if (!data.auditor.copNo?.trim()) {
      missing.push('सीओपी प्रमाणपत्र नम्बर (COP No.)');
    }
    if (!data.auditor.address?.trim()) {
      missing.push('लेखापरीक्षक फर्मको ठेगाना (Auditor Firm Address)');
    }
  }
  // Note: ICAN UDIN is typically generated after draft finalization, so it is recommended but doesn't hard-block draft view
  if (!data.auditor.udinNumber?.trim()) {
    // Keep as advisory or prompt in preview rather than blocking report access
  }

  return {
    isComplete: missing.length === 0,
    missingFields: missing,
  };
}

export const computeAuditReport = calculateAuditReport;
