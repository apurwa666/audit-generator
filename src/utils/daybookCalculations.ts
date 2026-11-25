import { DaybookData, DaybookMonthData, DaybookEntry, VatTdsType, VatTdsAction } from '../types/audit';

export interface NepaliMonthMeta {
  index: number;
  name: string;
  nepaliName: string;
  defaultDays: number;
  monthCode: string; // '04' for Shrawan, etc.
}

export const NEPALI_MONTHS_CONFIG: NepaliMonthMeta[] = [
  { index: 0, name: 'Shrawan', nepaliName: 'साउन', defaultDays: 32, monthCode: '04' },
  { index: 1, name: 'Bhadra', nepaliName: 'भदौ', defaultDays: 31, monthCode: '05' },
  { index: 2, name: 'Ashwin', nepaliName: 'असोज', defaultDays: 30, monthCode: '06' },
  { index: 3, name: 'Kartik', nepaliName: 'कात्तिक', defaultDays: 30, monthCode: '07' },
  { index: 4, name: 'Mangsir', nepaliName: 'मङ्सिर', defaultDays: 29, monthCode: '08' },
  { index: 5, name: 'Poush', nepaliName: 'पुस', defaultDays: 29, monthCode: '09' },
  { index: 6, name: 'Magh', nepaliName: 'माघ', defaultDays: 30, monthCode: '10' },
  { index: 7, name: 'Falgun', nepaliName: 'फागुन', defaultDays: 30, monthCode: '11' },
  { index: 8, name: 'Chaitra', nepaliName: 'चैत', defaultDays: 30, monthCode: '12' },
  { index: 9, name: 'Baisakh', nepaliName: 'वैशाख', defaultDays: 31, monthCode: '01' },
  { index: 10, name: 'Jestha', nepaliName: 'जेठ', defaultDays: 31, monthCode: '02' },
  { index: 11, name: 'Ashadh', nepaliName: 'असार', defaultDays: 32, monthCode: '03' },
];

export interface DaybookMonthSummary {
  monthIndex: number;
  monthName: string;
  nepaliMonth: string;
  openingBank: number;
  openingCash: number;
  totalReceipts: number;
  totalPayments: number;
  closingBank: number;
  closingCash: number;
  isBalanced: boolean;
}

export interface DaybookFullCalculation {
  processedMonths: DaybookMonthData[];
  monthSummaries: DaybookMonthSummary[];
  fiscalYearTotals: {
    totalReceipts: number;
    totalPayments: number;
    initialOpeningTotal: number;
    finalClosingTotal: number;
    finalClosingBank: number;
    finalClosingCash: number;
  };
}

/**
 * Calculates VAT or TDS adjustment amount and formatted notes
 */
export function computeVatTdsAdjustment(
  principalAmount?: number,
  vatTdsType?: VatTdsType,
  vatTdsRate?: number,
  vatTdsAction?: VatTdsAction
): {
  taxAmount: number;
  netAmount: number;
  detailsNote: string;
} {
  const principal = principalAmount || 0;
  if (!vatTdsType || vatTdsType === 'none' || !vatTdsRate || vatTdsRate <= 0 || principal <= 0) {
    return {
      taxAmount: 0,
      netAmount: principal,
      detailsNote: principal > 0 ? `• Principal: Rs. ${principal.toLocaleString('en-IN')}` : '',
    };
  }

  const taxAmount = Math.round(principal * (vatTdsRate / 100) * 100) / 100;
  const isAdd = vatTdsAction === 'add';
  const netAmount = isAdd ? principal + taxAmount : principal - taxAmount;

  const typeName = vatTdsType === 'vat' ? 'VAT' : 'TDS';
  const actionLabel = isAdd ? 'Add' : 'Deduct';
  const detailsNote = `• Principal Amount (Gross): Rs. ${principal.toLocaleString('en-IN')}\n• ${actionLabel} ${vatTdsRate}% ${typeName}: Rs. ${taxAmount.toLocaleString('en-IN')}\n• Net Amount: Rs. ${netAmount.toLocaleString('en-IN')}`;

  return {
    taxAmount,
    netAmount,
    detailsNote,
  };
}

/**
 * Creates a clean, blank Daybook Month with empty rows matching the month's total days.
 * Row 0 is the Opening Balance row.
 */
export function createBlankMonthData(
  monthMeta: NepaliMonthMeta,
  fiscalYear: string = '2081/82'
): DaybookMonthData {
  // Determine year for the month based on BS fiscal year (e.g. '2081/82')
  const parts = fiscalYear.split('/');
  const startYear = parseInt(parts[0], 10) || 2081;
  const endYear = parts[1] ? (parts[1].length === 2 ? Math.floor(startYear / 100) * 100 + parseInt(parts[1], 10) : parseInt(parts[1], 10)) : startYear + 1;
  
  // Shrawan to Chaitra are in startYear, Baisakh to Ashadh in endYear
  const yearForMonth = monthMeta.index <= 8 ? startYear : endYear;

  const entries: DaybookEntry[] = [];

  // Row 0: Opening Balance row (Remainder of previous month's last day)
  const monthCodeFormatted = monthMeta.monthCode;
  entries.push({
    id: `m${monthMeta.index}-day0-opening`,
    day: 0,
    date: `${yearForMonth}/${monthCodeFormatted}/01`,
    time: '10:00 AM',
    dateTime: `${yearForMonth}/${monthCodeFormatted}/01 10:00 AM`,
    voucherNo: '-',
    particulars: `Opening Balance (B/D) - अघिल्लो महिनाको मौज्दात`,
    principalAmount: 0,
    vatTdsType: 'none',
    vatTdsRate: 0,
    vatTdsAction: 'add',
    taxAmount: 0,
    vatTdsDetails: '',
    lf: '-',
    receipts: 0,
    payments: 0,
    paymentMode: 'opening',
    bankBalance: 0,
    cashBalance: 0,
    remarks: 'Remainder of the previous month',
  });

  // Daily blank rows: Day 1 to totalDays
  for (let dayNum = 1; dayNum <= monthMeta.defaultDays; dayNum++) {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${yearForMonth}/${monthCodeFormatted}/${dayStr}`;

    entries.push({
      id: `m${monthMeta.index}-day${dayNum}`,
      day: dayNum,
      date: dateStr,
      time: '10:00 AM',
      dateTime: `${dateStr} 10:00 AM`,
      voucherNo: '',
      particulars: '',
      principalAmount: 0,
      vatTdsType: 'none',
      vatTdsRate: 0,
      vatTdsAction: 'add',
      taxAmount: 0,
      vatTdsDetails: '',
      lf: '',
      receipts: 0,
      payments: 0,
      paymentMode: 'bank',
      bankBalance: 0,
      cashBalance: 0,
      remarks: '',
    });
  }

  return {
    monthIndex: monthMeta.index,
    monthName: monthMeta.name,
    nepaliMonth: monthMeta.nepaliName,
    totalDays: monthMeta.defaultDays,
    openingBank: 0,
    openingCash: 0,
    entries,
  };
}

/**
 * Initializes a full 12-month blank daybook data structure.
 */
export function getDefaultDaybookData(fiscalYear: string = '2081/82'): DaybookData {
  const months: DaybookMonthData[] = NEPALI_MONTHS_CONFIG.map((m) =>
    createBlankMonthData(m, fiscalYear)
  );

  return {
    title: 'DAILY TRANSACTION DAYBOOK',
    subtitle: 'Aligned with Nepal Government Framework (Non-Trading Operations)',
    initialFiscalYearOpeningBank: 0,
    initialFiscalYearOpeningCash: 0,
    activeMonthIndex: 0, // Shrawan
    months,
  };
}

/**
 * Calculates all 12 months sequentially.
 * The first entry of Month 0 (Shrawan) is the initial fiscal year opening balance.
 * The first entry of every subsequent month is the exact remainder of the previous month's last day!
 */
export function calculateAllDaybookMonths(daybook: DaybookData): DaybookFullCalculation {
  // Normalize months array in case of legacy structure
  let months: DaybookMonthData[] = [];
  if (daybook.months && Array.isArray(daybook.months) && daybook.months.length === 12) {
    months = daybook.months;
  } else {
    // Generate fresh 12 blank months
    months = NEPALI_MONTHS_CONFIG.map((m) => createBlankMonthData(m));
  }

  let runningBank = daybook.initialFiscalYearOpeningBank || daybook.openingBank || 0;
  let runningCash = daybook.initialFiscalYearOpeningCash || daybook.openingCash || 0;

  const processedMonths: DaybookMonthData[] = [];
  const monthSummaries: DaybookMonthSummary[] = [];

  let grandTotalReceipts = 0;
  let grandTotalPayments = 0;

  months.forEach((month, mIdx) => {
    const monthOpeningBank = runningBank;
    const monthOpeningCash = runningCash;

    let monthReceipts = 0;
    let monthPayments = 0;

    const processedEntries: DaybookEntry[] = month.entries.map((entry, eIdx) => {
      const isOpeningRow = entry.day === 0 || entry.paymentMode === 'opening' || eIdx === 0;

      if (isOpeningRow) {
        return {
          ...entry,
          receipts: 0,
          payments: 0,
          paymentMode: 'opening',
          bankBalance: runningBank,
          cashBalance: runningCash,
          particulars:
            entry.particulars && !entry.particulars.startsWith('Opening Balance')
              ? entry.particulars
              : `Opening Balance (B/D) - ${mIdx === 0 ? 'प्रारम्भिक मौज्दात' : 'अघिल्लो महिनाको बाँकी'}`,
          remarks:
            entry.remarks ||
            (mIdx === 0 ? 'Initial opening balance' : 'Remainder of the previous month'),
        };
      }

      const rec = Number(entry.receipts) || 0;
      const pay = Number(entry.payments) || 0;

      monthReceipts += rec;
      monthPayments += pay;

      if (entry.paymentMode === 'bank') {
        runningBank = runningBank + rec - pay;
      } else if (entry.paymentMode === 'cash') {
        runningCash = runningCash + rec - pay;
      } else if (entry.paymentMode === 'contra_deposit') {
        // Cash deposited into bank
        const amt = rec || pay || 0;
        runningBank += amt;
        runningCash -= amt;
      } else if (entry.paymentMode === 'contra_withdrawal') {
        // Cash withdrawn from bank
        const amt = rec || pay || 0;
        runningBank -= amt;
        runningCash += amt;
      }

      return {
        ...entry,
        receipts: rec,
        payments: pay,
        bankBalance: runningBank,
        cashBalance: runningCash,
      };
    });

    grandTotalReceipts += monthReceipts;
    grandTotalPayments += monthPayments;

    const closingBank = runningBank;
    const closingCash = runningCash;

    const expectedTotal = monthOpeningBank + monthOpeningCash + monthReceipts - monthPayments;
    const actualTotal = closingBank + closingCash;
    const isBalanced = Math.abs(expectedTotal - actualTotal) < 0.01;

    processedMonths.push({
      ...month,
      openingBank: monthOpeningBank,
      openingCash: monthOpeningCash,
      entries: processedEntries,
    });

    monthSummaries.push({
      monthIndex: mIdx,
      monthName: month.monthName,
      nepaliMonth: month.nepaliMonth,
      openingBank: monthOpeningBank,
      openingCash: monthOpeningCash,
      totalReceipts: monthReceipts,
      totalPayments: monthPayments,
      closingBank,
      closingCash,
      isBalanced,
    });
  });

  const initialOpeningTotal =
    (daybook.initialFiscalYearOpeningBank || daybook.openingBank || 0) +
    (daybook.initialFiscalYearOpeningCash || daybook.openingCash || 0);

  return {
    processedMonths,
    monthSummaries,
    fiscalYearTotals: {
      totalReceipts: grandTotalReceipts,
      totalPayments: grandTotalPayments,
      initialOpeningTotal,
      finalClosingTotal: runningBank + runningCash,
      finalClosingBank: runningBank,
      finalClosingCash: runningCash,
    },
  };
}

/**
 * Backward compatibility helper for single daybook calculations
 */
export function calculateDaybook(daybook: DaybookData) {
  const result = calculateAllDaybookMonths(daybook);
  const activeIdx = daybook.activeMonthIndex || 0;
  const activeMonth = result.processedMonths[activeIdx] || result.processedMonths[0];
  const summary = result.monthSummaries[activeIdx] || result.monthSummaries[0];

  return {
    processedEntries: activeMonth ? activeMonth.entries : [],
    summary: {
      totalReceipts: summary ? summary.totalReceipts : 0,
      totalPayments: summary ? summary.totalPayments : 0,
      closingBank: summary ? summary.closingBank : 0,
      closingCash: summary ? summary.closingCash : 0,
      isBalanced: summary ? summary.isBalanced : true,
      totalCashReceipts: 0,
      totalCashPayments: 0,
      totalBankReceipts: 0,
      totalBankPayments: 0,
    },
    fullResult: result,
  };
}
