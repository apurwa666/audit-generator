import * as XLSX from 'xlsx';
import { AuditData, CalculatedReport, DaybookEntry, DaybookMonthData } from '../types/audit';
import { calculateAllDaybookMonths, calculateDaybook, getDefaultDaybookData } from './daybookCalculations';
import { calculateFixedAssetAmounts, getFixedAssetAdditions } from './auditCalculations';

export function exportAuditToExcel(data: AuditData, report: CalculatedReport) {
  const wb = XLSX.utils.book_new();

  // 1. Balance Sheet Sheet
  const bsRows = [
    [data.client.entityName.toUpperCase()],
    [data.client.address],
    [`PAN: ${data.client.panNo || 'N/A'}`],
    ['STATEMENT OF FINANCIAL POSITION / BALANCE SHEET (वासलात)'],
    [`As at ${data.client.reportingPeriodEnd}`],
    [''],
    ['Particulars (विवरण)', 'Schedule (अनुसूची)', `F.Y. ${data.client.currentFiscalYear} (रु.)`, `F.Y. ${data.client.previousFiscalYear} (रु.)`],
    ['CAPITAL & LIABILITIES (पूँजी तथा दायित्व)'],
    ["Proprietor's Capital (स्वामित्व पूँजी)", '1', data.capital.openingCapital, data.capital.previousYearCapital],
    ['Additional Investment (थप लगानी)', '', data.capital.additionalInvestment, data.capital.previousYearAdditional],
    ['Reserve and Surplus (जगेडा तथा कोष)', '2', report.closingReservesAndSurplusCurrent, report.closingReservesAndSurplusPrevious],
    ['Total Capital / Equity (कुल स्वामित्व पूँजी)', '', report.totalEquityCurrent, report.totalEquityPrevious],
    [''],
    ['NON-CURRENT LIABILITIES (दीर्घकालीन दायित्व)'],
    ['Long Term Loans & Borrowings (दीर्घकालीन बैंक ऋण)', '3', data.nonCurrentLiabilities.longTermBankLoans, data.nonCurrentLiabilities.previousYearLongTermBankLoans],
    ['Other Long-Term Borrowings (अन्य दीर्घकालीन ऋण)', '', data.nonCurrentLiabilities.otherLongTermBorrowings, data.nonCurrentLiabilities.previousYearOtherLongTermBorrowings],
    ['Total Non-Current Liabilities', '', report.totalNonCurrentLiabilitiesCurrent, report.totalNonCurrentLiabilitiesPrevious],
    [''],
    ['TOTAL CAPITAL & LIABILITIES (पूँजी तथा दीर्घकालीन दायित्व)', '', report.totalLiabilitiesAndEquityCurrent, report.totalLiabilitiesAndEquityPrevious],
    [''],
    ['ASSETS (सम्पत्ति)'],
    ['Fixed Assets Net Block (स्थिर सम्पत्ति खुद मौज्दात)', '4', report.totalFixedAssetsNetBlockCurrent, report.totalFixedAssetsNetBlockPrevious],
    [''],
    ['CURRENT ASSETS, ADVANCES & DEPOSITS (चालु सम्पत्ति तथा पेश्की)'],
    ['Cash & Bank Balance (नगद तथा बैंक मौज्दात)', '5', data.currentAssets.cashAndBank, data.currentAssets.previousYearCashAndBank],
    ['Closing Inventory / Stock (अन्तिम मौज्दात)', '6', data.trading.closingStock, data.trading.previousYearClosingStock],
    ['Sundry Debtors & Receivables (असामीहरु)', '7', data.currentAssets.sundryDebtors, data.currentAssets.previousYearSundryDebtors],
    ['VAT Receivable (लिनुपर्ने भ्याट)', '8', data.currentAssets.vatReceivable, data.currentAssets.previousYearVatReceivable],
    ['Advance Income Tax (अग्रिम आयकर)', '8', data.currentAssets.advanceIncomeTax, data.currentAssets.previousYearAdvanceIncomeTax],
    ['Loans & Advances / Deposit (धरौटी तथा पेश्की)', '8', data.currentAssets.loansAndAdvances, data.currentAssets.previousYearLoansAndAdvances],
    ['Total Current Assets (A)', '', report.totalCurrentAssetsCurrent, report.totalCurrentAssetsPrevious],
    [''],
    ['CURRENT LIABILITIES & PROVISIONS (चालु दायित्व तथा व्यवस्थाहरु)'],
    ['Sundry Creditors (साहुहरु)', '9', data.currentLiabilities.sundryCreditors, data.currentLiabilities.previousYearSundryCreditors],
    ['Bank Overdraft / Short-Term Loan (बैंक ओभरड्राफ्ट)', '9', data.currentLiabilities.bankOverdraft, data.currentLiabilities.previousYearBankOverdraft],
    ['Audit Fee Payable (लेखापरीक्षण शुल्क तिर्नुपर्ने)', '9', data.currentLiabilities.auditFeePayable, data.currentLiabilities.previousYearAuditFeePayable],
    ['TDS on Audit Fee (लेखापरीक्षण शुल्क TDS)', '9', data.currentLiabilities.tdsOnAuditFeePayable, data.currentLiabilities.previousYearTdsOnAuditFeePayable],
    ['TDS on House Rent (घरभाडा TDS)', '9', data.currentLiabilities.tdsOnHouseRentPayable, data.currentLiabilities.previousYearTdsOnHouseRentPayable],
    ['TDS on Transportation (ढुवानी TDS)', '9', data.currentLiabilities.tdsOnTransportationPayable, data.currentLiabilities.previousYearTdsOnTransportationPayable],
    ['Salary TDS Payable (पारिश्रमिक कर TDS)', '9', data.currentLiabilities.salaryTdsPayable, data.currentLiabilities.previousYearSalaryTdsPayable],
    ['Interest Payable (तिर्न बाँकी ब्याज)', '9', data.currentLiabilities.interestPayable, data.currentLiabilities.previousYearInterestPayable],
    ['Other Payables / Proprietor A/C', '9', data.currentLiabilities.otherPayables, data.currentLiabilities.previousYearOtherPayables],
    ['Provision for Income Tax (आयकर व्यवस्था)', '10', report.calculatedTaxLiabilityCurrent, report.calculatedTaxLiabilityPrevious],
    ['Total Current Liabilities (B)', '', report.totalCurrentLiabilitiesCurrent, report.totalCurrentLiabilitiesPrevious],
    [''],
    ['Net Current Assets (चालु सम्पत्ति - चालु दायित्व) (A - B)', '', report.netCurrentAssetsCurrent, report.netCurrentAssetsPrevious],
    [''],
    ['TOTAL ASSETS (Net Block + Net Current Assets)', '', report.totalAssetsCurrent, report.totalAssetsPrevious],
    ['Balance Discrepancy / Check', '', report.balanceDifferenceCurrent < 1 ? 'BALANCED (सन्तुलित)' : `Diff: रु. ${report.balanceDifferenceCurrent.toFixed(2)}`, '']
  ];
  const wsBS = XLSX.utils.aoa_to_sheet(bsRows);
  XLSX.utils.book_append_sheet(wb, wsBS, 'Balance Sheet (वासलात)');

  // 2. Trading Account Sheet
  const tradingRows = [
    [data.client.entityName.toUpperCase()],
    ['TRADING ACCOUNT / STATEMENT OF COST OF SALES (व्यापार हिसाब)'],
    [`For the year ended ${data.client.reportingPeriodEnd}`],
    [''],
    ['Particulars (विवरण)', `F.Y. ${data.client.currentFiscalYear} (रु.)`, `F.Y. ${data.client.previousFiscalYear} (रु.)`],
    ['Opening Stock (सुरु मौज्दात)', data.trading.openingStock, data.trading.previousYearOpeningStock],
    ['Add: Purchases during the year (वर्षको कुल खरिद)', data.trading.purchases, data.trading.previousYearPurchases],
    ['Add: Local Transportation & Freight Inwards (ढुवानी खर्च)', data.trading.localTransportation, data.trading.previousYearLocalTransportation],
    ['Add: Direct Wages & Labor (प्रत्यक्ष ज्याला)', data.trading.directWages, data.trading.previousYearDirectWages],
    ['Total Cost of Goods Available for Sale', report.costOfGoodsAvailableCurrent, report.costOfGoodsAvailablePrevious],
    ['Less: Closing Stock (अन्तिम मौज्दात)', data.trading.closingStock, data.trading.previousYearClosingStock],
    ['Cost of Goods Sold / COGS (बिक्री भएको मालको लागत)', report.cogsCurrent, report.cogsPrevious],
    [''],
    ['Sales Revenue / Turnover (बिक्री आम्दानी)', report.totalIncomeCurrent, report.totalIncomePrevious],
    ['GROSS PROFIT (कुल नाफा - P&L मा सारिएको)', report.grossProfitCurrent, report.grossProfitPrevious],
    ['Gross Profit Margin (%)', `${report.grossProfitMarginPercent.toFixed(2)}%`, '']
  ];
  const wsTrading = XLSX.utils.aoa_to_sheet(tradingRows);
  XLSX.utils.book_append_sheet(wb, wsTrading, 'Trading Account (व्यापार)');

  // 3. Profit & Loss Account Sheet
  const plRows = [
    [data.client.entityName.toUpperCase()],
    ['STATEMENT OF PROFIT OR LOSS (नाफा नोक्सान हिसाब)'],
    [`For the year ended ${data.client.reportingPeriodEnd}`],
    [''],
    ['Particulars (विवरण)', 'Schedule (अनुसूची)', `F.Y. ${data.client.currentFiscalYear} (रु.)`, `F.Y. ${data.client.previousFiscalYear} (रु.)`],
    ['Gross Profit from Trading (व्यापार हिसाबबाट आएको कुल नाफा)', '', report.grossProfitCurrent, report.grossProfitPrevious],
    ['Add: Other Income (अन्य आम्दानी)', '9', (data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome), (data.otherIncome.previousYearBankInterest + data.otherIncome.previousYearMiscellaneousIncome)],
    ['Total Operating Gross Revenue', '', (report.grossProfitCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome), (report.grossProfitPrevious + data.otherIncome.previousYearBankInterest + data.otherIncome.previousYearMiscellaneousIncome)],
    [''],
    ['Less: Administrative Expenses (प्रशासनिक खर्चहरु)', '11', report.totalAdminExpensesCurrent, report.totalAdminExpensesPrevious],
    ['OPERATING PROFIT (सञ्चालन नाफा)', '', report.operatingProfitCurrent, report.operatingProfitPrevious],
    [''],
    ['Less: Depreciation (ह्रासकट्टी)', '4', report.totalDepreciationCurrent, report.totalDepreciationPrevious],
    ['Less: Interest & Bank Charges (ऋणको ब्याज तथा शुल्क)', '12', report.totalInterestAndChargesCurrent, report.totalInterestAndChargesPrevious],
    [''],
    ['PROFIT / (LOSS) BEFORE TAX (कर अघिको नाफा)', '', report.profitBeforeTaxCurrent, report.profitBeforeTaxPrevious],
    ['Less: Provision for Income Tax (आयकर व्यवस्था)', '10', report.calculatedTaxLiabilityCurrent, report.calculatedTaxLiabilityPrevious],
    ['NET PROFIT / (LOSS) FOR THE YEAR', '', report.netProfitAfterTaxCurrent, report.netProfitAfterTaxPrevious]
  ];
  const wsPL = XLSX.utils.aoa_to_sheet(plRows);
  XLSX.utils.book_append_sheet(wb, wsPL, 'Profit & Loss (नाफा नोक्सान)');

  // 4. Cash Flow Statement Sheet
  const cfRows = [
    [data.client.entityName.toUpperCase()],
    ['STATEMENT OF CASH FLOWS (नगद प्रवाह विवरण)'],
    [`For the year ended ${data.client.reportingPeriodEnd}`],
    [''],
    ['Particulars (विवरण)', `F.Y. ${data.client.currentFiscalYear} (रु.)`, `F.Y. ${data.client.previousFiscalYear} (रु.)`],
    ['A. CASH FLOW FROM OPERATING ACTIVITIES (सञ्चालन क्रियाकलापबाट नगद प्रवाह)'],
    ['Net Profit Before Tax (कर अघिको खुद नाफा)', report.profitBeforeTaxCurrent, report.profitBeforeTaxPrevious],
    ['Add: Depreciation (ह्रासकट्टी समायोजन)', report.totalDepreciationCurrent, report.totalDepreciationPrevious],
    ['Operating Cashflow Before Working Capital Changes', report.profitBeforeTaxCurrent + report.totalDepreciationCurrent, report.profitBeforeTaxPrevious + report.totalDepreciationPrevious],
    ['(Increase)/Decrease in Current Assets', report.totalCurrentAssetsPrevious - report.totalCurrentAssetsCurrent, 0],
    ['Increase/(Decrease) in Current Liabilities', report.totalCurrentLiabilitiesCurrent - report.totalCurrentLiabilitiesPrevious, 0],
    ['Less: Income Tax Paid / Provision', -report.calculatedTaxLiabilityCurrent, -report.calculatedTaxLiabilityPrevious],
    ['Net Cash Flow From Operating Activities (A)', report.cashFlow.cashFromOperations, report.profitBeforeTaxPrevious],
    [''],
    ['B. CASH FLOW FROM INVESTING ACTIVITIES (लगानी क्रियाकलापबाट नगद प्रवाह)'],
    ['Purchase / Additions to Fixed Assets', report.cashFlow.cashFromInvesting, 0],
    ['Net Cash Flow from Investing Activities (B)', report.cashFlow.cashFromInvesting, 0],
    [''],
    ['C. CASH FLOW FROM FINANCING ACTIVITIES (वित्तीय क्रियाकलापबाट नगद प्रवाह)'],
    ['Proprietor Fresh Capital Injected', data.capital.additionalInvestment, data.capital.previousYearAdditional],
    ['Less: Proprietor Withdrawals / Drawings', -data.capital.withdrawalsDrawings, 0],
    ['Change in Bank Loans & Borrowings', (data.nonCurrentLiabilities.longTermBankLoans - data.nonCurrentLiabilities.previousYearLongTermBankLoans) + (data.currentLiabilities.bankOverdraft - data.currentLiabilities.previousYearBankOverdraft), 0],
    ['Net Cash Flow from Financing Activities (C)', report.cashFlow.cashFromFinancing, data.capital.previousYearAdditional],
    [''],
    ['Net Increase / (Decrease) in Cash & Cash Equivalents (A + B + C)', report.cashFlow.netChangeInCash, data.currentAssets.cashAndBank - data.currentAssets.previousYearCashAndBank],
    ['Add: Cash & Bank at Beginning of Year', data.currentAssets.previousYearCashAndBank, data.currentAssets.previousYearCashAndBank],
    ['CASH & BANK AT END OF YEAR', data.currentAssets.cashAndBank, data.currentAssets.previousYearCashAndBank]
  ];
  const wsCF = XLSX.utils.aoa_to_sheet(cfRows);
  XLSX.utils.book_append_sheet(wb, wsCF, 'Cash Flow (नगद प्रवाह)');

  // 5. Statement of Changes in Equity Sheet
  const equityRows = [
    [data.client.entityName.toUpperCase()],
    ['STATEMENT OF CHANGES IN EQUITY (स्वामित्व पूँजी परिवर्तन विवरण)'],
    [`For the year ended ${data.client.reportingPeriodEnd}`],
    [''],
    ['F.Y. ' + data.client.currentFiscalYear + ' Current Year:'],
    ['Particulars', 'Proprietor Capital', 'Retained Earnings / Surplus', 'Total Equity'],
    ['Beginning Balance (श्रावण १ गतेको मौज्दात)', data.capital.openingCapital, data.reserves.openingSurplus, data.capital.openingCapital + data.reserves.openingSurplus],
    ['Add: Fresh Capital Introduced (थप पूँजी)', data.capital.additionalInvestment, 0, data.capital.additionalInvestment],
    ['Add: Net Profit After Tax for the Year', 0, report.netProfitAfterTaxCurrent, report.netProfitAfterTaxCurrent],
    ['Less: Proprietor Withdrawals / Drawings', -data.capital.withdrawalsDrawings, 0, -data.capital.withdrawalsDrawings],
    ['Ending Equity Balance (असार मसान्तको मौज्दात)', data.capital.openingCapital + data.capital.additionalInvestment - data.capital.withdrawalsDrawings, data.reserves.openingSurplus + report.netProfitAfterTaxCurrent, report.totalEquityCurrent],
    [''],
    ['F.Y. ' + data.client.previousFiscalYear + ' Comparative Year:'],
    ['Beginning Balance', data.capital.previousYearCapital, data.reserves.previousYearOpeningSurplus, data.capital.previousYearCapital + data.reserves.previousYearOpeningSurplus],
    ['Net Profit for Previous Year', 0, report.netProfitAfterTaxPrevious, report.netProfitAfterTaxPrevious],
    ['Ending Equity Balance', data.capital.previousYearCapital, data.reserves.previousYearOpeningSurplus + report.netProfitAfterTaxPrevious, report.totalEquityPrevious]
  ];
  const wsEquity = XLSX.utils.aoa_to_sheet(equityRows);
  XLSX.utils.book_append_sheet(wb, wsEquity, 'Equity (पूँजी परिवर्तन)');

  // 6. Fixed Assets Schedule Sheet
  const faRows = [
    [data.client.entityName.toUpperCase()],
    ['SCHEDULE 4: FIXED ASSETS & DEPRECIATION (स्थिर सम्पत्ति तथा ह्रासकट्टी विवरण)'],
    [`Under Income Tax Act, 2058 (आयकर ऐन, २०५८ बमोजिम) as at ${data.client.reportingPeriodEnd}`],
    [''],
    ['Particulars (विवरण)', 'Block (वर्ग)', 'Opening Balance (सुरु मौज्दात)', 'Additions (थप)', 'Disposals (बिक्री/कट्टी)', 'Total for Depreciation', 'Rate %', 'Depreciation Amount (ह्रासकट्टी)', 'Net Block / Closing Balance (खुद मौज्दात)'],
  ];

  data.fixedAssets.forEach(fa => {
    const figures = calculateFixedAssetAmounts(fa);
    const adds = figures.additions;
    const forDepr = figures.depreciationBase;
    const deprAmt = figures.depreciation;
    const net = figures.netBookValue;
    faRows.push([
      fa.name,
      fa.block,
      fa.openingBalance as any,
      adds as any,
      fa.disposalsDuringYear as any,
      forDepr as any,
      `${fa.ratePercent}%` as any,
      deprAmt as any,
      net as any
    ]);
  });
  faRows.push([
    'TOTAL (कुल)',
    '',
    data.fixedAssets.reduce((s, a) => s + a.openingBalance, 0) as any,
    data.fixedAssets.reduce((s, a) => s + getFixedAssetAdditions(a), 0) as any,
    data.fixedAssets.reduce((s, a) => s + a.disposalsDuringYear, 0) as any,
    '' as any,
    '' as any,
    report.totalDepreciationCurrent as any,
    report.totalFixedAssetsNetBlockCurrent as any
  ]);
  const wsFA = XLSX.utils.aoa_to_sheet(faRows);
  XLSX.utils.book_append_sheet(wb, wsFA, 'Fixed Assets (स्थिर सम्पत्ति)');

  // 7. Statement of Income Tax Computation Sheet
  const taxableBusinessIncome = Math.max(
    0,
    report.profitBeforeTaxCurrent +
      (data.finance.disallowedInterestSec14 || 0) -
      (data.taxSettings.donationSec12 || 0)
  );

  const taxRows = [
    [data.client.entityName.toUpperCase()],
    ['STATEMENT OF INCOME TAX COMPUTATION (आयकर गणना विवरण)'],
    [`Fiscal Year ${data.client.currentFiscalYear} (Assessment Year ${parseInt(data.client.currentFiscalYear.slice(0, 2)) + 1}/${parseInt(data.client.currentFiscalYear.slice(5)) + 1})`],
    [`PAN: ${data.client.panNo || 'N/A'}`],
    [''],
    ['Particulars (विवरण)', 'As per P&L A/C (रु.)', 'For Income Tax Purpose (रु.)', 'Remarks / Section'],
    ['Sales / Turnover from Operations', report.totalIncomeCurrent, report.totalIncomeCurrent, 'Sec 7(2)(Kha)'],
    ['Other Income (Interest / Misc)', data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome, data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome, 'Sec 7(2)'],
    ['GROSS INCOME (कुल आम्दानी)', report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome, report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome, ''],
    [''],
    ['Less: Cost of Goods Sold (बिक्री भएको मालको लागत)', report.cogsCurrent, report.cogsCurrent, 'Sec 15'],
    ['Less: Depreciation Allowable (ह्रासकट्टी)', report.totalDepreciationCurrent, report.totalDepreciationCurrent, 'Sec 19 & Sched 2'],
    ['Less: Administrative & Operating Expenses (प्रशासनिक खर्च)', report.totalAdminExpensesCurrent, report.totalAdminExpensesCurrent, 'Sec 13'],
    ['Less: Admissible Interest on Loan (ऋणको ब्याज)', data.finance.interestOnLoan, Math.max(0, data.finance.interestOnLoan - (data.finance.disallowedInterestSec14 || 0)), data.finance.disallowedInterestSec14 > 0 ? `Sec 14 Disallowed: रु. ${data.finance.disallowedInterestSec14}` : 'Sec 14 Admissible'],
    [''],
    ['TAXABLE INCOME FROM BUSINESS (करयोग्य व्यवसाय आय)', report.profitBeforeTaxCurrent, taxableBusinessIncome, 'Assessable Income'],
    [''],
    ['TAX LIABILITY COMPUTATION (आयकर दायित्व गणना):'],
    ['Assessment Method', data.taxSettings.taxRateType === 'proprietorship_slab' ? `Proprietorship Slab (${data.taxSettings.maritalStatus})` : data.taxSettings.taxRateType, '', ''],
    ['Total Income Tax Liability (कुल आयकर दायित्व)', report.calculatedTaxLiabilityCurrent, '', ''],
    ['Less: Advance Income Tax Paid / TDS (कट्टी भएको अग्रिम कर)', report.advanceTaxPaidCurrent, '', 'From Schedule 8 / Advance Tax'],
    ['NET TAX PAYABLE / (REFUNDABLE) TO IRD', report.netTaxPayableOrRefundableCurrent, '', report.netTaxPayableOrRefundableCurrent >= 0 ? 'Payable to Inland Revenue' : 'Refundable / Carry Forward']
  ];
  const wsTax = XLSX.utils.aoa_to_sheet(taxRows);
  XLSX.utils.book_append_sheet(wb, wsTax, 'Tax Computation (आयकर)');

  // 8. Financial Schedules Sheet (Schedules 1 to 12)
  const schedRows = [
    [data.client.entityName.toUpperCase()],
    ['FINANCIAL STATEMENT SCHEDULES (वित्तीय विवरणका सम्बन्धित अनुसूचीहरू)'],
    [`As at ${data.client.reportingPeriodEnd}`],
    [''],
    ['SCHEDULE 1: PROPRIETOR CAPITAL (स्वामित्व पूँजी)'],
    ['Particulars', `F.Y. ${data.client.currentFiscalYear}`, `F.Y. ${data.client.previousFiscalYear}`],
    ['Opening Capital', data.capital.openingCapital, data.capital.previousYearCapital],
    ['Additional Investment', data.capital.additionalInvestment, data.capital.previousYearAdditional],
    ['Total Proprietor Capital', report.totalProprietorFundCurrent, report.totalProprietorFundPrevious],
    [''],
    ['SCHEDULE 2: RESERVES & SURPLUS (जगेडा तथा कोष)'],
    ['Opening Surplus', data.reserves.openingSurplus, data.reserves.previousYearOpeningSurplus],
    ['Add: Current Year Net Profit After Tax', report.netProfitAfterTaxCurrent, report.netProfitAfterTaxPrevious],
    ['Total Reserves & Surplus', report.closingReservesAndSurplusCurrent, report.closingReservesAndSurplusPrevious],
    [''],
    ['SCHEDULE 3: LONG TERM LIABILITIES (दीर्घकालीन ऋण दायित्व)'],
    ['Long-Term Bank Loan', data.nonCurrentLiabilities.longTermBankLoans, data.nonCurrentLiabilities.previousYearLongTermBankLoans],
    ['Other Long-Term Borrowings', data.nonCurrentLiabilities.otherLongTermBorrowings, data.nonCurrentLiabilities.previousYearOtherLongTermBorrowings],
    ['Total Long-Term Liabilities', report.totalNonCurrentLiabilitiesCurrent, report.totalNonCurrentLiabilitiesPrevious],
    [''],
    ['SCHEDULE 5: CASH & BANK BALANCES (नगद तथा बैंक मौज्दात)'],
    ['Cash and Bank Balances', data.currentAssets.cashAndBank, data.currentAssets.previousYearCashAndBank],
    [''],
    ['SCHEDULE 6: INVENTORIES (अन्तिम मौज्दात)'],
    ['Stock in Trade / Inventories', data.trading.closingStock, data.trading.previousYearClosingStock],
    [''],
    ['SCHEDULE 7: SUNDRY DEBTORS & RECEIVABLES (असामी तथा पाउनुपर्ने)'],
    ['Sundry Debtors (ग्राहकहरु)', data.currentAssets.sundryDebtors, data.currentAssets.previousYearSundryDebtors],
    [''],
    ['SCHEDULE 8: ADVANCES & DEPOSITS (पेश्की तथा धरौटी)'],
    ['VAT Receivable', data.currentAssets.vatReceivable, data.currentAssets.previousYearVatReceivable],
    ['Advance Income Tax', data.currentAssets.advanceIncomeTax, data.currentAssets.previousYearAdvanceIncomeTax],
    ['Loans, Advances & Security Deposits', data.currentAssets.loansAndAdvances, data.currentAssets.previousYearLoansAndAdvances],
    [''],
    ['SCHEDULE 9: SUNDRY CREDITORS & CURRENT LIABILITIES (साहुहरु तथा चालु दायित्वहरू)'],
    ['Sundry Creditors (आपूर्तिकर्ता साहुहरु)', data.currentLiabilities.sundryCreditors, data.currentLiabilities.previousYearSundryCreditors],
    ['Bank Overdraft / Short-Term Loan', data.currentLiabilities.bankOverdraft, data.currentLiabilities.previousYearBankOverdraft],
    ['Audit Fee Payable', data.currentLiabilities.auditFeePayable, data.currentLiabilities.previousYearAuditFeePayable],
    ['TDS on Audit Fee Payable (1.5%)', data.currentLiabilities.tdsOnAuditFeePayable, data.currentLiabilities.previousYearTdsOnAuditFeePayable],
    ['TDS on House Rent Payable (10%)', data.currentLiabilities.tdsOnHouseRentPayable, data.currentLiabilities.previousYearTdsOnHouseRentPayable],
    ['TDS on Transportation Payable', data.currentLiabilities.tdsOnTransportationPayable, data.currentLiabilities.previousYearTdsOnTransportationPayable],
    ['Salary TDS Payable', data.currentLiabilities.salaryTdsPayable, data.currentLiabilities.previousYearSalaryTdsPayable],
    ['Interest Payable', data.currentLiabilities.interestPayable, data.currentLiabilities.previousYearInterestPayable],
    ['Other Payables / Proprietor Account', data.currentLiabilities.otherPayables, data.currentLiabilities.previousYearOtherPayables],
    ['Provision for Income Tax', report.calculatedTaxLiabilityCurrent, report.calculatedTaxLiabilityPrevious],
    ['Total Current Liabilities', report.totalCurrentLiabilitiesCurrent, report.totalCurrentLiabilitiesPrevious],
    [''],
    ['SCHEDULE 11: ADMINISTRATIVE EXPENSES (प्रशासनिक खर्चहरु)'],
    ['Particulars (विवरण)', `F.Y. ${data.client.currentFiscalYear}`, `F.Y. ${data.client.previousFiscalYear}`]
  ];

  data.adminExpenses.forEach(ae => {
    schedRows.push([`${ae.particular} (${ae.nepaliLabel})`, ae.currentYear as any, ae.previousYear as any]);
  });
  schedRows.push(['TOTAL ADMINISTRATIVE EXPENSES', report.totalAdminExpensesCurrent as any, report.totalAdminExpensesPrevious as any]);

  const wsSched = XLSX.utils.aoa_to_sheet(schedRows);
  XLSX.utils.book_append_sheet(wb, wsSched, 'Schedules (अनुसूचीहरु)');

  // 9. VAT Reconciliation Sheet (IRD 10-Column Format)
  const totalTaxSales = report.totalTaxableSalesVatRec;
  const totalDiscSales = report.totalDiscountedSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedSales || m.vatFreeSales || 0), 0);
  const totalSalesAll = totalTaxSales + totalDiscSales;

  const totalTaxPur = report.totalTaxablePurchaseVatRec;
  const totalDiscPur = report.totalDiscountedPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedPurchase || m.vatFreePurchase || 0), 0);
  const totalPurAll = totalTaxPur + totalDiscPur;

  const vatRows = [
    [data.client.entityName.toUpperCase()],
    [`${data.client.address.toUpperCase()}`],
    ['VAT RECONCILIATION STATEMENT (मासिक मूल्य अभिवृद्धि कर मिलान तालिका)'],
    [`Fiscal Year ${data.client.currentFiscalYear}`],
    [''],
    [
      'Month',
      'Sales: Taxable Value',
      'Sales: VAT',
      'Sales: Discounted Sales',
      'Sales: Thap Ghat Sales VAT',
      'Purchase: Taxable Value',
      'Purchase: VAT',
      'Purchase: Discounted Purchase',
      'Purchase: Thap Ghat Purchase VAT',
      'Payable',
      'Paid'
    ]
  ];
  data.vatReconciliation.forEach(m => {
    const discSales = m.discountedSales !== undefined ? m.discountedSales : (m.vatFreeSales || 0);
    const discPur = m.discountedPurchase !== undefined ? m.discountedPurchase : (m.vatFreePurchase || 0);
    const calcNet = ((m.salesVat || 0) + (m.thapGhatSalesVat || 0)) - ((m.purchaseVat || 0) + (m.thapGhatPurchaseVat || 0));
    const payVal = m.payable !== undefined ? m.payable : calcNet;

    vatRows.push([
      `${m.monthName} (${m.nepaliMonth || ''})`,
      m.taxableSales as any,
      m.salesVat as any,
      discSales as any,
      (m.thapGhatSalesVat || 0) as any,
      m.taxablePurchase as any,
      m.purchaseVat as any,
      discPur as any,
      (m.thapGhatPurchaseVat || 0) as any,
      payVal as any,
      (m.vatPaidToBank || 0) as any
    ]);
  });
  vatRows.push([
    'Total (कुल)',
    totalTaxSales as any,
    report.totalSalesVatRec as any,
    totalDiscSales as any,
    (report.totalThapGhatSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.thapGhatSalesVat || 0), 0)) as any,
    totalTaxPur as any,
    report.totalPurchaseVatRec as any,
    totalDiscPur as any,
    (report.totalThapGhatPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.thapGhatPurchaseVat || 0), 0)) as any,
    data.vatReconciliation.reduce((s, m) => s + (m.payable || 0), 0) as any,
    data.vatReconciliation.reduce((s, m) => s + (m.vatPaidToBank || 0), 0) as any
  ]);

  vatRows.push(['']);
  vatRows.push(['SALES DURING THE YEAR', '', 'PURCHASES DURING THE YEAR']);
  vatRows.push(['Taxable Sales', totalTaxSales as any, 'Taxable Purchase', totalTaxPur as any]);
  vatRows.push(['VAT Free Sales', totalDiscSales as any, 'VAT Free Purchase', totalDiscPur as any]);
  vatRows.push(['Total Sales', totalSalesAll as any, 'Total Purchase', totalPurAll as any]);

  const wsVAT = XLSX.utils.aoa_to_sheet(vatRows);
  XLSX.utils.book_append_sheet(wb, wsVAT, 'VAT Reconciliation (भ्याट मिलान)');

  // 10. Daily Transaction Daybook Sheet (Aligned with Nepal Government Framework)
  const daybookData = data.daybook || getDefaultDaybookData(data.client.currentFiscalYear);
  const { processedMonths, monthSummaries } = calculateAllDaybookMonths(daybookData);

  const daybookRows: any[][] = [
    [daybookData.title || 'DAILY TRANSACTION DAYBOOK'],
    [daybookData.subtitle || 'Aligned with Nepal Government Framework (Non-Trading Operations)'],
    [`Fiscal Year: ${data.client.currentFiscalYear}`],
    [''],
  ];

  processedMonths.forEach((month: DaybookMonthData, mIdx: number) => {
    const summary = monthSummaries[mIdx];
    daybookRows.push([`MONTH: ${month.nepaliMonth.toUpperCase()} (${month.monthName.toUpperCase()}) — ${month.totalDays} DAYS`]);
    daybookRows.push([
      'Date / Time',
      'Voucher No.',
      'Particulars',
      'Principal Amount (Rs.)',
      'VAT / TDS Rate & Action',
      'Tax Adjustment (Rs.)',
      'L.F. (LF)',
      'Receipts (Rs.)',
      'Payments (Rs.)',
      'Account Mode',
      'Bank Balance (Rs.)',
      'Cash Balance (Rs.)',
      'Remarks'
    ]);

    month.entries.forEach((row: DaybookEntry) => {
      daybookRows.push([
        row.dateTime || row.date,
        row.voucherNo,
        row.particulars,
        (row.principalAmount ? row.principalAmount : '-') as any,
        row.vatTdsType && row.vatTdsType !== 'none' ? `${row.vatTdsAction === 'add' ? '+' : '-'} ${row.vatTdsRate}% ${row.vatTdsType.toUpperCase()}` : '-',
        (row.taxAmount ? row.taxAmount : '-') as any,
        row.lf,
        (row.receipts ? row.receipts : '-') as any,
        (row.payments ? row.payments : '-') as any,
        row.paymentMode,
        (row.bankBalance || 0) as any,
        (row.cashBalance || 0) as any,
        row.remarks
      ]);
    });

    daybookRows.push([
      `${month.nepaliMonth} End`,
      '-',
      'TOTAL (कुल महिनाको जोड)',
      '-',
      '-',
      '-',
      '-',
      summary.totalReceipts as any,
      summary.totalPayments as any,
      '-',
      summary.closingBank as any,
      summary.closingCash as any,
      'End of month balance'
    ]);
    daybookRows.push(['']); // Blank separator
  });

  const wsDaybook = XLSX.utils.aoa_to_sheet(daybookRows);
  XLSX.utils.book_append_sheet(wb, wsDaybook, 'Daily Daybook (दैनिक खाता)');

  // Generate file name
  const cleanName = (data.client.entityName || 'Audit_Report').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Full_Audit_Report_${data.client.currentFiscalYear.replace('/', '-')}.xlsx`;

  XLSX.writeFile(wb, filename);
}
