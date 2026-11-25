export interface AuditorProfile {
  firmName: string; // e.g., D.N. Adhikari Associates
  icanRegdNo: string; // e.g., 7256"D"
  copNo: string; // Certificate of Practice No., e.g., 2076
  panNo: string; // e.g., 301761268
  membershipClass: 'Class A' | 'Class B' | 'Class C' | 'Class D' | 'FCA' | 'ACA' | 'Registered Auditor';
  auditorName: string; // e.g., Dinanath Adhikari
  address: string; // e.g., Tarakeshwor-10, Kathmandu
  reportDate: string; // e.g., 2081-05-10
  reportPlace: string; // e.g., Kathmandu, Nepal
  udinNumber: string; // Unique Document Identification Number, e.g. 260624RA07256Yzy3t
}

export interface ClientProfile {
  entityName: string; // e.g., N.S. Steel Furniture Center
  proprietorName: string; // e.g., Netra Prasad Sharma
  businessType: string; // e.g., '१. प्राकृतिक व्यक्ति तथा एकल फार्म (Individual & Sole Proprietorship)', etc.
  panNo: string; // e.g., 603363193
  regdNo: string; // e.g., 12345/075/076
  regdDate: string; // e.g., 2072-04-27
  address: string; // e.g., Tikathali, Lalitpur / Kathmandu
  accountingStandard: 'NAS for MEs (साना संस्थाको लागि नेपाल लेखामान)' | 'NFRS for SMEs' | 'Nepal Accounting Standards (NAS)';
  currentFiscalYear: string; // e.g., 2080/81 or 2081/82
  previousFiscalYear: string; // e.g., 2079/80 or 2080/81
  reportingPeriodEnd: string; // e.g., 31st Ashadh 2081 (July 15, 2024)
}

export interface FixedAssetItem {
  id: string;
  name: string; // e.g., Furniture & Fixtures, Computer and Printer, Motor Vehicles, Building
  nepaliName: string;
  block: 'Block A (5% - Building)' | 'Block B (25% - Furniture, Computers)' | 'Block C (20% - Vehicles)' | 'Block D (15% - Machinery, Equipments)' | 'Block E (Intangibles)';
  ratePercent: number; // e.g. 25, 20, 15, 5
  openingBalance: number; // सुरुको मौज्दात
  additionsFirstHalf: number; // श्रावण - पुष (100% absorption)
  additionsSecondHalf: number; // माघ - चैत्र (66.67% absorption) or direct addition
  additionsThirdHalf: number; // वैशाख - असार (33.33% absorption) or direct addition
  totalAdditions: number; // कुल थप
  disposalsDuringYear: number; // बिक्री वा कट्टी
  previousYearNetValue: number; // अघिल्लो वर्षको खुद मौज्दात
}

export interface VatMonthRecord {
  monthName: string; // Shrawan, Bhadra, ...
  nepaliMonth: string; // साउन, भदौ, ...
  taxableSales: number; // Taxable Value (करयोग्य बिक्री)
  salesVat: number; // VAT (१३%)
  discountedSales: number; // Discounted Sales (छुट बिक्री)
  thapGhatSalesVat?: number; // Thap Ghat Sales VAT (थप घट बिक्री भ्याट)
  vatFreeSales?: number; // (kept for backwards-compatibility)
  taxablePurchase: number; // Taxable Value (करयोग्य खरिद)
  purchaseVat: number; // VAT (१३%)
  discountedPurchase: number; // Discounted Purchase (छुट खरिद)
  thapGhatPurchaseVat?: number; // Thap Ghat Purchase VAT (थप घट खरिद भ्याट)
  vatFreePurchase?: number; // (kept for backwards-compatibility)
  payable?: number; // Payable (रकम / (Credit))
  vatPaidToBank: number; // Paid (दाखिला)
  thapGhatVat?: number; // थप/घट समायोजन
}

export interface AdminExpenseItem {
  id: string;
  particular: string; // e.g., Audit Expenses
  nepaliLabel: string; // e.g., लेखापरीक्षण खर्च
  currentYear: number;
  previousYear: number;
}

export interface AuditData {
  auditTemplateType?: 'D2' | 'D3';
  auditor: AuditorProfile;
  client: ClientProfile;

  // Schedule 1: Proprietor's Capital / Equity
  capital: {
    openingCapital: number; // सुरुको पूँजी
    additionalInvestment: number; // थप लगानी
    withdrawalsDrawings: number; // निजी खर्च/निकासी (Drawings)
    previousYearCapital: number;
    previousYearAdditional: number;
  };

  // Schedule 2: Reserves & Surplus
  reserves: {
    openingSurplus: number; // अघिल्लो वर्षसम्मको सञ्चित नाफा
    previousYearOpeningSurplus: number;
  };

  // Schedule 6 / Direct Expenses & Trading Account
  trading: {
    sales: number; // बिक्री आम्दानी (यदि भ्याटबाट सिधै नल्याएमा)
    previousYearSales: number;
    vatFreeSales: number;
    openingStock: number; // सुरु मौज्दात
    previousYearOpeningStock: number;
    purchases: number; // वर्षभरिको खरिद
    previousYearPurchases: number;
    localTransportation: number; // स्थानीय ढुवानी खर्च
    previousYearLocalTransportation: number;
    directWages: number; // प्रत्यक्ष ज्याला
    previousYearDirectWages: number;
    closingStock: number; // अन्तिम मौज्दात
    previousYearClosingStock: number;
    useVatRegisterTotals: boolean; // यदि true भए भ्याट तालिकाबाट स्वतः Sales र Purchase तानिन्छ
  };

  // Other Income
  otherIncome: {
    bankInterest: number;
    miscellaneousIncome: number;
    previousYearBankInterest: number;
    previousYearMiscellaneousIncome: number;
  };

  // Administrative Expenses (Schedule 7)
  adminExpenses: AdminExpenseItem[];

  // Finance Charges
  finance: {
    interestOnLoan: number; // ऋणको ब्याज
    previousYearInterestOnLoan: number;
    bankCharges: number; // बैंक सेवा शुल्क
    previousYearBankCharges: number;
    disallowedInterestSec14: number; // आयकर प्रयोजनका लागि अस्वीकृत ब्याज (उ.द. १४)
  };

  // Fixed Assets (Schedule 3)
  fixedAssets: FixedAssetItem[];

  // Current Assets (Schedule 4, 5, etc.)
  currentAssets: {
    cashAndBank: number; // नगद तथा बैंक मौज्दात
    previousYearCashAndBank: number;
    sundryDebtors: number; // असामी / ग्राहकहरू
    previousYearSundryDebtors: number;
    advanceIncomeTax: number; // अग्रिम आयकर (Advance Tax / TDS receivable)
    previousYearAdvanceIncomeTax: number;
    vatReceivable: number; // मूल्य अभिवृद्धि कर लिनुपर्ने (VAT Receivable)
    previousYearVatReceivable: number;
    loansAndAdvances: number; // पेश्की तथा धरौटी
    previousYearLoansAndAdvances: number;
    useVatRegisterReceivable: boolean;
  };

  // Current Liabilities & Provisions (Schedule 6)
  currentLiabilities: {
    sundryCreditors: number; // साहुहरु (Suppliers)
    previousYearSundryCreditors: number;
    bankOverdraft: number; // बैंक ओभरड्राफ्ट / अल्पकालीन ऋण
    previousYearBankOverdraft: number;
    auditFeePayable: number; // तिर्नुपर्ने लेखापरीक्षण शुल्क
    previousYearAuditFeePayable: number;
    tdsOnAuditFeePayable: number; // लेखापरीक्षण शुल्कमा TDS
    previousYearTdsOnAuditFeePayable: number;
    tdsOnHouseRentPayable: number; // घरभाडा TDS
    previousYearTdsOnHouseRentPayable: number;
    tdsOnTransportationPayable: number; // ढुवानी TDS
    previousYearTdsOnTransportationPayable: number;
    salaryTdsPayable: number; // तलब TDS
    previousYearSalaryTdsPayable: number;
    interestPayable: number; // तिर्न बाँकी ब्याज
    previousYearInterestPayable: number;
    otherPayables: number; // अन्य तिर्नुपर्ने दायित्व / Proprietor A/C
    previousYearOtherPayables: number;
  };

  // Non-Current Liabilities (Note / Schedule for Long Term)
  nonCurrentLiabilities: {
    longTermBankLoans: number; // दीर्घकालीन बैंक ऋण
    previousYearLongTermBankLoans: number;
    otherLongTermBorrowings: number;
    previousYearOtherLongTermBorrowings: number;
  };

  // VAT Monthly Reconciliation (12 Months)
  vatReconciliation: VatMonthRecord[];

  // Daily Transaction Daybook (Aligned with Nepal Government Framework)
  daybook?: DaybookData;

  // Tax Settings
  taxSettings: {
    taxRateType: 'proprietorship_slab' | 'corporate_25' | 'corporate_20' | 'manual';
    manualTaxProvision: number;
    customIncomeTaxSlabsEnabled: boolean;
    maritalStatus: 'individual' | 'couple';
    donationSec12: number;
  };

  // Independent Auditor's Report custom options
  auditorReportOptions: {
    hasQualifiedOpinion: boolean;
    emphasisOfMatter: string;
    customOpinionText: string;
  };
}

export interface CalculatedReport {
  // Trading & COGS
  cogsCurrent: number;
  cogsPrevious: number;
  costOfGoodsAvailableCurrent: number;
  costOfGoodsAvailablePrevious: number;
  grossProfitCurrent: number;
  grossProfitPrevious: number;
  grossProfitMarginPercent: number;

  // P&L
  totalIncomeCurrent: number;
  totalIncomePrevious: number;
  totalAdminExpensesCurrent: number;
  totalAdminExpensesPrevious: number;
  totalDepreciationCurrent: number;
  totalDepreciationPrevious: number;
  operatingProfitCurrent: number;
  operatingProfitPrevious: number;
  totalInterestAndChargesCurrent: number;
  totalInterestAndChargesPrevious: number;
  profitBeforeTaxCurrent: number;
  profitBeforeTaxPrevious: number;

  // Tax
  calculatedTaxLiabilityCurrent: number;
  calculatedTaxLiabilityPrevious: number;
  advanceTaxPaidCurrent: number;
  netTaxPayableOrRefundableCurrent: number;

  // Net Profit
  netProfitAfterTaxCurrent: number;
  netProfitAfterTaxPrevious: number;

  // Capital & Equity
  totalProprietorFundCurrent: number;
  totalProprietorFundPrevious: number;
  closingReservesAndSurplusCurrent: number;
  closingReservesAndSurplusPrevious: number;
  totalEquityCurrent: number;
  totalEquityPrevious: number;

  // Fixed Assets Net Block
  totalFixedAssetsNetBlockCurrent: number;
  totalFixedAssetsNetBlockPrevious: number;

  // Current Assets & Liabilities
  totalCurrentAssetsCurrent: number;
  totalCurrentAssetsPrevious: number;
  totalCurrentLiabilitiesCurrent: number;
  totalCurrentLiabilitiesPrevious: number;
  netCurrentAssetsCurrent: number;
  netCurrentAssetsPrevious: number;

  // Non-Current Liabilities
  totalNonCurrentLiabilitiesCurrent: number;
  totalNonCurrentLiabilitiesPrevious: number;

  // Balance Sheet Totals & Audit Check
  totalLiabilitiesAndEquityCurrent: number;
  totalLiabilitiesAndEquityPrevious: number;
  totalAssetsCurrent: number;
  totalAssetsPrevious: number;
  isBalancedCurrent: boolean;
  isBalancedPrevious: boolean;
  balanceDifferenceCurrent: number;
  balanceDifferencePrevious: number;

  // Monthly VAT Summary
  totalTaxableSalesVatRec: number;
  totalVatFreeSalesVatRec: number;
  totalDiscountedSalesVatRec?: number;
  totalSalesVatRec: number;
  totalThapGhatSalesVatRec?: number;
  totalTaxablePurchaseVatRec: number;
  totalVatFreePurchaseVatRec: number;
  totalDiscountedPurchaseVatRec?: number;
  totalPurchaseVatRec: number;
  totalThapGhatPurchaseVatRec?: number;
  totalVatPaidVatRec?: number;
  totalPayableVatRec?: number;
  netVatPayableOrReceivableVatRec: number;

  // Cash Flow
  cashFlow: {
    cashFromOperations: number;
    cashFromInvesting: number;
    cashFromFinancing: number;
    netChangeInCash: number;
    openingCash: number;
    closingCash: number;
    isCashReconciled: boolean;
  };
}

export type VatTdsType = 'none' | 'vat' | 'tds';
export type VatTdsAction = 'add' | 'deduct';

export interface DaybookEntry {
  id: string;
  day: number; // 0 for opening row, 1 to 32 for month days
  date: string; // e.g., '2081/04/01'
  time?: string; // e.g., '10:30 AM'
  dateTime?: string; // formatted full date and time
  voucherNo: string; // e.g., 'RV-001', 'PV-101', '-'
  particulars: string; // e.g., 'सामान बिक्री (Sales)'
  
  // Particulars Sub-Columns
  principalAmount?: number; // मूल रकम (Principal Amount)
  vatTdsType?: VatTdsType; // 'none' | 'vat' | 'tds'
  vatTdsRate?: number; // e.g., 13, 10, 1.5, 5
  vatTdsAction?: VatTdsAction; // 'add' | 'deduct'
  taxAmount?: number; // Auto-calculated tax adjustment amount
  
  vatTdsDetails?: string; // Detailed formatted note (e.g. • Principal: Rs. 20,000\n• Add 13% VAT: Rs 2,600)
  lf: string; // Ledger Folio, e.g., 'L-12', 'L-45', '-'
  receipts: number; // रकम आम्दानी / Receipts (0 if none)
  payments: number; // रकम खर्च / Payments (0 if none)
  paymentMode: 'bank' | 'cash' | 'contra_deposit' | 'contra_withdrawal' | 'opening';
  bankBalance?: number; // Auto-calculated running bank balance
  cashBalance?: number; // Auto-calculated running cash balance
  remarks: string; // e.g., 'Amount received through bank'
}

export interface DaybookMonthData {
  monthIndex: number; // 0 for Shrawan, 1 for Bhadra, ... 11 for Ashadh
  monthName: string; // 'Shrawan', 'Bhadra', ...
  nepaliMonth: string; // 'साउन', 'भदौ', ...
  totalDays: number; // e.g., 32, 31, 30, 29
  openingBank?: number; // Remainder of previous month's last day
  openingCash?: number; // Remainder of previous month's last day
  entries: DaybookEntry[];
}

export interface DaybookData {
  title?: string;
  subtitle?: string;
  initialFiscalYearOpeningBank: number; // Opening Bank at Shrawan 1
  initialFiscalYearOpeningCash: number; // Opening Cash at Shrawan 1
  activeMonthIndex?: number; // 0 to 11
  months: DaybookMonthData[];
  // Backwards compatibility fields
  date?: string;
  openingBank?: number;
  openingCash?: number;
  entries?: DaybookEntry[];
}

export type AuditTab =
  | 'profile'
  | 'trading'
  | 'daybook'
  | 'expenses'
  | 'fixedAssets'
  | 'balanceSheet'
  | 'vat'
  | 'tax'
  | 'report';
