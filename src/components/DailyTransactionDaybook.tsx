import React, { useState, useMemo } from 'react';
import {
  AuditData,
  DaybookData,
  DaybookEntry,
  VatTdsType,
  VatTdsAction,
} from '../types/audit';
import {
  calculateAllDaybookMonths,
  getDefaultDaybookData,
  NEPALI_MONTHS_CONFIG,
  computeVatTdsAdjustment,
} from '../utils/daybookCalculations';
import { formatNPR } from '../utils/auditCalculations';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  Calculator,
  RotateCcw,
  CheckCircle2,
  Building,
  Banknote,
  FileSpreadsheet,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface DailyTransactionDaybookProps {
  data: AuditData;
  onChange: (daybook: DaybookData) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const DailyTransactionDaybook: React.FC<DailyTransactionDaybookProps> = ({
  data,
  onChange,
  fontSize,
}) => {
  const currentFiscalYear = data.client?.currentFiscalYear || '2081/82';

  // Ensure 12-month data structure exists
  const daybook = useMemo(() => {
    if (data.daybook && Array.isArray(data.daybook.months) && data.daybook.months.length === 12) {
      return data.daybook;
    }
    return getDefaultDaybookData(currentFiscalYear);
  }, [data.daybook, currentFiscalYear]);

  // Selected Month Index (0 for Shrawan to 11 for Ashadh)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(daybook.activeMonthIndex || 0);

  // Full calculation of all 12 months with carry-forward
  const calculationResult = useMemo(() => {
    return calculateAllDaybookMonths(daybook);
  }, [daybook]);

  const activeProcessedMonth = calculationResult.processedMonths[selectedMonthIdx];
  const activeMonthSummary = calculationResult.monthSummaries[selectedMonthIdx];

  // Helper to update daybook state
  const updateDaybook = (updated: DaybookData) => {
    onChange(updated);
  };

  // Change Month via Dropdown
  const handleMonthChange = (newIdx: number) => {
    setSelectedMonthIdx(newIdx);
    updateDaybook({
      ...daybook,
      activeMonthIndex: newIdx,
    });
  };

  // Initial Fiscal Year Opening Balances (Shrawan 1)
  const handleInitialOpeningChange = (field: 'bank' | 'cash', val: string) => {
    const num = parseFloat(val) || 0;
    const updated: DaybookData = {
      ...daybook,
      initialFiscalYearOpeningBank:
        field === 'bank' ? num : daybook.initialFiscalYearOpeningBank || 0,
      initialFiscalYearOpeningCash:
        field === 'cash' ? num : daybook.initialFiscalYearOpeningCash || 0,
      openingBank: field === 'bank' ? num : daybook.openingBank || 0,
      openingCash: field === 'cash' ? num : daybook.openingCash || 0,
    };
    updateDaybook(updated);
  };

  // Update specific cell in the active month's entries
  const updateEntryCell = (
    entryIndex: number,
    field: keyof DaybookEntry,
    value: any
  ) => {
    const updatedMonths = [...daybook.months];
    const monthEntries = [...updatedMonths[selectedMonthIdx].entries];
    const entry = { ...monthEntries[entryIndex], [field]: value };

    // Auto-calculate Net and Tax if Principal Amount or VAT/TDS settings change
    if (
      field === 'principalAmount' ||
      field === 'vatTdsType' ||
      field === 'vatTdsRate' ||
      field === 'vatTdsAction'
    ) {
      const pAmt = field === 'principalAmount' ? parseFloat(value) || 0 : entry.principalAmount || 0;
      const vType = field === 'vatTdsType' ? value : entry.vatTdsType || 'none';
      const vRate = field === 'vatTdsRate' ? parseFloat(value) || 0 : entry.vatTdsRate || 0;
      const vAction = field === 'vatTdsAction' ? value : entry.vatTdsAction || 'add';

      const adj = computeVatTdsAdjustment(pAmt, vType, vRate, vAction);
      entry.taxAmount = adj.taxAmount;
      entry.vatTdsDetails = adj.detailsNote;

      if (vType !== 'none' && pAmt > 0) {
        if (entry.payments > 0 || vType === 'tds') {
          entry.payments = adj.netAmount;
        } else {
          entry.receipts = adj.netAmount;
        }
      } else if (pAmt > 0 && entry.receipts === 0 && entry.payments === 0) {
        entry.receipts = pAmt;
      }
    }

    monthEntries[entryIndex] = entry;
    updatedMonths[selectedMonthIdx] = {
      ...updatedMonths[selectedMonthIdx],
      entries: monthEntries,
    };

    updateDaybook({
      ...daybook,
      months: updatedMonths,
    });
  };

  // Dedicated VAT/TDS configuration handler supporting any custom percentage rate
  const handleVatTdsConfig = (
    entryIndex: number,
    updates: {
      type?: VatTdsType;
      rate?: number;
      action?: VatTdsAction;
    }
  ) => {
    const updatedMonths = [...daybook.months];
    const monthEntries = [...updatedMonths[selectedMonthIdx].entries];
    const entry = { ...monthEntries[entryIndex] };

    const newType = updates.type !== undefined ? updates.type : (entry.vatTdsType || 'none');
    const newRate = updates.rate !== undefined ? updates.rate : (entry.vatTdsRate ?? (newType === 'vat' ? 13 : newType === 'tds' ? 10 : 0));
    const newAction = updates.action !== undefined ? updates.action : (entry.vatTdsAction || (newType === 'tds' ? 'deduct' : 'add'));

    entry.vatTdsType = newType;
    entry.vatTdsRate = newRate;
    entry.vatTdsAction = newAction;

    const pAmt = entry.principalAmount || 0;
    const adj = computeVatTdsAdjustment(pAmt, newType, newRate, newAction);
    entry.taxAmount = adj.taxAmount;
    entry.vatTdsDetails = adj.detailsNote;

    if (newType !== 'none' && pAmt > 0) {
      if (entry.payments > 0 || newType === 'tds') {
        entry.payments = adj.netAmount;
        if (entry.receipts > 0) entry.receipts = 0;
      } else {
        entry.receipts = adj.netAmount;
        if (entry.payments > 0) entry.payments = 0;
      }
    }

    monthEntries[entryIndex] = entry;
    updatedMonths[selectedMonthIdx] = {
      ...updatedMonths[selectedMonthIdx],
      entries: monthEntries,
    };

    updateDaybook({
      ...daybook,
      months: updatedMonths,
    });
  };

  // Add an extra entry for multiple transactions on the same day
  const addExtraEntryForDay = (afterIndex: number, dayNum: number, dateStr: string) => {
    const updatedMonths = [...daybook.months];
    const monthEntries = [...updatedMonths[selectedMonthIdx].entries];

    const newEntry: DaybookEntry = {
      id: `m${selectedMonthIdx}-day${dayNum}-extra-${Date.now()}`,
      day: dayNum,
      date: dateStr,
      time: '02:00 PM',
      dateTime: `${dateStr} 02:00 PM`,
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
    };

    monthEntries.splice(afterIndex + 1, 0, newEntry);
    updatedMonths[selectedMonthIdx] = {
      ...updatedMonths[selectedMonthIdx],
      entries: monthEntries,
    };

    updateDaybook({
      ...daybook,
      months: updatedMonths,
    });
  };

  // Clear or delete row
  const deleteEntry = (index: number) => {
    if (index === 0) {
      alert('प्रारम्भिक मौज्दात (Opening Balance) मेटाउन मिल्दैन। रकम परिवर्तन गर्न सक्नुहुन्छ।');
      return;
    }

    const updatedMonths = [...daybook.months];
    const monthEntries = [...updatedMonths[selectedMonthIdx].entries];

    // If it's a base day row (total entries === totalDays + 1), just clear fields rather than deleting the day
    if (monthEntries.length <= updatedMonths[selectedMonthIdx].totalDays + 1) {
      monthEntries[index] = {
        ...monthEntries[index],
        voucherNo: '',
        particulars: '',
        principalAmount: 0,
        vatTdsType: 'none',
        vatTdsRate: 0,
        taxAmount: 0,
        vatTdsDetails: '',
        lf: '',
        receipts: 0,
        payments: 0,
        remarks: '',
      };
    } else {
      // It's an extra row, can remove
      monthEntries.splice(index, 1);
    }

    updatedMonths[selectedMonthIdx] = {
      ...updatedMonths[selectedMonthIdx],
      entries: monthEntries,
    };

    updateDaybook({
      ...daybook,
      months: updatedMonths,
    });
  };

  // Reset entire active month to blank entries
  const handleResetActiveMonth = () => {
    if (
      window.confirm(
        `के तपाईं ${activeProcessedMonth.nepaliMonth} (${activeProcessedMonth.monthName}) महिनाको सम्पूर्ण प्रविष्टि खाली गर्न चाहनुहुन्छ?`
      )
    ) {
      const updatedMonths = [...daybook.months];
      const monthMeta = NEPALI_MONTHS_CONFIG[selectedMonthIdx];
      const freshMonth = NEPALI_MONTHS_CONFIG.find((m) => m.index === selectedMonthIdx);
      if (freshMonth) {
        const fresh = getDefaultDaybookData(currentFiscalYear).months[selectedMonthIdx];
        updatedMonths[selectedMonthIdx] = fresh;
        updateDaybook({
          ...daybook,
          months: updatedMonths,
        });
      }
    }
  };

  // Print Daybook
  const handlePrint = () => {
    window.print();
  };

  const inputClass =
    fontSize === 'xlarge'
      ? 'text-sm p-1.5'
      : fontSize === 'large'
      ? 'text-xs p-1'
      : 'text-[11px] p-1';

  return (
    <div className="space-y-6">
      {/* Top Banner & Month Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  दैनिक कारोबार खाता (Daily Transaction Daybook)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  नेपाल सरकारको लेखा ढाँचा — साउन देखि असारसम्म १२ वटै महिनाको दैनिक कारोबार तालिका
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print / Save as PDF (प्रिन्ट गर्नुहोस्)</span>
            </button>

            <button
              type="button"
              onClick={handleResetActiveMonth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs transition cursor-pointer border border-slate-300"
              title="यो महिना खाली गर्नुहोस्"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>महिना खाली गर्नुहोस् (Reset Month)</span>
            </button>
          </div>
        </div>

        {/* 12-Month Navigation and Selector Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 border-2 border-sky-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>महिना छनौट गर्नुहोस् (Select Month):</span>
            </label>

            {/* Dropdown Menu for 12 Months */}
            <select
              value={selectedMonthIdx}
              onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
              className="bg-white border-2 border-sky-500 rounded-xl px-4 py-2 text-sm sm:text-base font-black text-sky-950 shadow-xs focus:ring-2 focus:ring-sky-600 cursor-pointer"
            >
              {NEPALI_MONTHS_CONFIG.map((m) => (
                <option key={m.index} value={m.index} className="font-bold py-1">
                  {m.index + 1}. {m.nepaliName} ({m.name}) — {m.defaultDays} दिन
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={selectedMonthIdx === 0}
                onClick={() => handleMonthChange(selectedMonthIdx - 1)}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer transition shadow-2xs"
                title="अघिल्लो महिना"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={selectedMonthIdx === 11}
                onClick={() => handleMonthChange(selectedMonthIdx + 1)}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer transition shadow-2xs"
                title="पछिल्लो महिना"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month & Total Days Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              आर्थिक वर्ष: <strong className="text-slate-900 font-mono">{currentFiscalYear}</strong>
            </span>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-300">
              कुल दिनहरू: <strong>{activeProcessedMonth.totalDays} दिन</strong>
            </span>
          </div>
        </div>

        {/* First Entry Info / Fiscal Opening Balance Box */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80">
          {selectedMonthIdx === 0 ? (
            /* Month 0 (Shrawan): Editable Initial Opening Balances */
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    आर्थिक वर्षको प्रारम्भिक मौज्दात (Shrawan 1 Opening Balances):
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  पहिलो महिनाको सुरुवाती मौज्दात
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    सुरुवाती बैंक मौज्दात (Opening Bank Balance):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rs.</span>
                    <input
                      type="number"
                      value={daybook.initialFiscalYearOpeningBank || ''}
                      onChange={(e) => handleInitialOpeningChange('bank', e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 font-bold pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    सुरुवाती नगद मौज्दात (Opening Cash Balance):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rs.</span>
                    <input
                      type="number"
                      value={daybook.initialFiscalYearOpeningCash || ''}
                      onChange={(e) => handleInitialOpeningChange('cash', e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 font-bold pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Months 1-11: Auto-carried from previous month's last day */
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-slate-800">
                  यो महिनाको पहिलो प्रविष्टि अघिल्लो महिना (
                  <strong>{NEPALI_MONTHS_CONFIG[selectedMonthIdx - 1]?.nepaliName}</strong>) को अन्तिम दिनको मौज्दातबाट स्वतः सारिएको हो:
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold">
                <span className="bg-sky-50 text-sky-950 px-2.5 py-1 rounded border border-sky-200">
                  बैंक: Rs. {formatNPR(activeMonthSummary.openingBank)}
                </span>
                <span className="bg-amber-50 text-amber-950 px-2.5 py-1 rounded border border-amber-200">
                  नगद: Rs. {formatNPR(activeMonthSummary.openingCash)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Monthly Summary Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono">
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
            <span className="block text-emerald-800 font-sans text-xs font-bold">
              महिनाको कुल आम्दानी (Receipts):
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-950">
              Rs. {formatNPR(activeMonthSummary.totalReceipts)}
            </span>
          </div>

          <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200">
            <span className="block text-rose-800 font-sans text-xs font-bold">
              महिनाको कुल खर्च (Payments):
            </span>
            <span className="text-base sm:text-lg font-black text-rose-950">
              Rs. {formatNPR(activeMonthSummary.totalPayments)}
            </span>
          </div>

          <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200">
            <span className="block text-sky-800 font-sans text-xs font-bold">
              अन्तिम बैंक मौज्दात (Closing Bank):
            </span>
            <span className="text-base sm:text-lg font-black text-sky-950">
              Rs. {formatNPR(activeMonthSummary.closingBank)}
            </span>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
            <span className="block text-amber-800 font-sans text-xs font-bold">
              अन्तिम नगद मौज्दात (Closing Cash):
            </span>
            <span className="text-base sm:text-lg font-black text-amber-950">
              Rs. {formatNPR(activeMonthSummary.closingCash)}
            </span>
          </div>
        </div>
      </div>

      {/* Official Government Daybook Table matching the uploaded image */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden printable-daybook-container">
        {/* Document Header - Exact styling as screenshot */}
        <div className="p-6 text-center border-b border-slate-200 bg-white">
          <div className="flex justify-center mb-3 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#0e3b60] hover:bg-[#092a47] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#0e3b60] tracking-wider uppercase font-sans">
            {daybook.title || 'DAILY TRANSACTION DAYBOOK'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 italic font-medium mt-1">
            {daybook.subtitle || 'Aligned with Nepal Government Framework (Non-Trading Operations)'}
          </p>
          <p className="text-xs font-bold text-slate-800 mt-1 uppercase font-sans">
            {activeProcessedMonth.nepaliMonth} ({activeProcessedMonth.monthName}) — Fiscal Year {currentFiscalYear}
          </p>
        </div>

        {/* 10-Column Table with Particulars Sub-Columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px] border-t border-slate-300">
            <thead>
              {/* Row 1: Group Headers */}
              <tr className="bg-[#0e3b60] text-white text-xs sm:text-sm font-bold">
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-center w-36">
                  Date / Time<br />
                  <span className="text-[11px] font-normal text-slate-200">(मिति र समय)</span>
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-center w-24">
                  Voucher No.<br />
                  <span className="text-[11px] font-normal text-slate-200">(भौचर नं.)</span>
                </th>
                <th colSpan={3} className="py-2 px-3 border-r border-[#1a4f7c] text-center bg-[#0b3152]">
                  Particulars (including VAT/TDS details)<br />
                  <span className="text-[11px] font-normal text-slate-200">
                    कारोबार विवरण तथा कर समायोजन
                  </span>
                </th>
                <th rowSpan={2} className="py-3 px-1 border-r border-[#1a4f7c] text-center w-14">
                  L.F.<br />(LF)
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-right w-28">
                  Receipts<br />
                  <span className="text-[11px] font-normal text-slate-200">(आम्दानी)</span>
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-right w-28">
                  Payments<br />
                  <span className="text-[11px] font-normal text-slate-200">(खर्च)</span>
                </th>
                <th rowSpan={2} className="py-3 px-1 border-r border-[#1a4f7c] text-center w-20">
                  Mode<br />
                  <span className="text-[11px] font-normal text-slate-200">(खाता)</span>
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-right w-32 bg-[#092a47]">
                  Bank Balance<br />
                  <span className="text-[11px] font-normal text-slate-200">(बैंक मौज्दात)</span>
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-right w-32 bg-[#092a47]">
                  Cash Balance<br />
                  <span className="text-[11px] font-normal text-slate-200">(नगद मौज्दात)</span>
                </th>
                <th rowSpan={2} className="py-3 px-2 border-r border-[#1a4f7c] text-left w-36">
                  Remarks<br />
                  <span className="text-[11px] font-normal text-slate-200">(कैफियत)</span>
                </th>
                <th rowSpan={2} className="py-3 px-1 text-center w-14 no-print bg-[#08243c]">
                  Action
                </th>
              </tr>

              {/* Row 2: Sub-headers for Particulars */}
              <tr className="bg-[#124b7a] text-slate-100 text-[11px] font-bold">
                <th className="py-1.5 px-2 text-left min-w-[190px] border-r border-[#1a4f7c]">
                  Description (विवरण)
                </th>
                <th className="py-1.5 px-2 text-right w-28 border-r border-[#1a4f7c] text-amber-200">
                  Principal Amount<br />(मूल रकम)
                </th>
                <th className="py-1.5 px-2 text-left min-w-[210px] w-64 border-r border-[#1a4f7c] text-emerald-200">
                  VAT / TDS & % Rate<br />(कर: दर % र थप/कट्टी)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-300 text-xs sm:text-sm font-sans">
              {activeProcessedMonth.entries.map((row, index) => {
                const isOpening = row.paymentMode === 'opening' || index === 0;

                return (
                  <tr
                    key={row.id || index}
                    className={`align-top ${
                      isOpening
                        ? 'bg-amber-50/60 font-bold border-b-2 border-amber-300'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-sky-50/40'
                        : 'bg-slate-50/60 hover:bg-sky-50/40'
                    }`}
                  >
                    {/* Date / Time */}
                    <td className="py-2 px-2 border-r border-slate-300 text-slate-900 font-mono text-center">
                      {isOpening ? (
                        <span className="font-bold text-slate-800">{row.date}</span>
                      ) : (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={row.date}
                            onChange={(e) => updateEntryCell(index, 'date', e.target.value)}
                            placeholder="YYYY/MM/DD"
                            className="w-full text-center bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-0.5 text-xs font-mono font-semibold"
                          />
                          <input
                            type="text"
                            value={row.time || ''}
                            onChange={(e) => updateEntryCell(index, 'time', e.target.value)}
                            placeholder="10:00 AM"
                            className="w-full text-center text-[10px] text-slate-500 bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-0.5 font-mono"
                          />
                        </div>
                      )}
                    </td>

                    {/* Voucher No. */}
                    <td className="py-2 px-2 border-r border-slate-300 text-slate-900 font-mono text-center">
                      {isOpening ? (
                        <span className="text-slate-400 font-bold">-</span>
                      ) : (
                        <input
                          type="text"
                          value={row.voucherNo}
                          onChange={(e) => updateEntryCell(index, 'voucherNo', e.target.value)}
                          placeholder="RV-01"
                          className="w-full text-center bg-transparent border border-slate-200/60 focus:border-sky-500 rounded p-1 text-xs font-mono font-bold"
                        />
                      )}
                    </td>

                    {/* Particulars: Description */}
                    <td className="py-2 px-2 border-r border-slate-300 text-slate-900">
                      {isOpening ? (
                        <div className="py-1">
                          <div className="text-xs sm:text-sm font-black text-amber-950">
                            {row.particulars}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            {selectedMonthIdx === 0
                              ? 'Remainder of the previous fiscal year'
                              : `Remainder of ${NEPALI_MONTHS_CONFIG[selectedMonthIdx - 1]?.nepaliName}'s last day`}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={row.particulars}
                            onChange={(e) => updateEntryCell(index, 'particulars', e.target.value)}
                            placeholder="उदा: सामान बिक्री (Sales) वा घरभाडा (Rent)"
                            className="w-full font-bold text-slate-900 bg-white border border-slate-200 rounded p-1 text-xs sm:text-sm focus:ring-1 focus:ring-sky-500"
                          />

                          {/* Detail bullet lines auto-generated */}
                          {row.vatTdsDetails && (
                            <div className="mt-1 text-[11px] text-slate-600 font-mono whitespace-pre-line leading-relaxed pl-1 bg-slate-50 p-1 rounded border border-slate-200">
                              {row.vatTdsDetails}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Particulars Sub-column 1: Principal Amount (मूल रकम) */}
                    <td className="py-2 px-2 border-r border-slate-300 text-right">
                      {isOpening ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <input
                          type="number"
                          value={row.principalAmount || ''}
                          onChange={(e) => updateEntryCell(index, 'principalAmount', e.target.value)}
                          placeholder="0.00"
                          className="w-full text-right bg-white border border-amber-200/80 rounded font-mono font-bold text-slate-900 p-1 text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      )}
                    </td>

                    {/* Particulars Sub-column 2: VAT / TDS & Typeable % Rate Selection */}
                    <td className="py-2 px-2 border-r border-slate-300 min-w-[210px]">
                      {isOpening ? (
                        <span className="text-slate-400 text-xs">-</span>
                      ) : (
                        <div className="space-y-1.5">
                          {/* Print view only */}
                          <div className="hidden print:block text-xs font-mono">
                            {row.vatTdsType === 'none' || !row.vatTdsType
                              ? '-'
                              : `${row.vatTdsType.toUpperCase()} ${row.vatTdsRate || 0}% (${
                                  row.vatTdsAction === 'add' ? '+' : '-'
                                }Rs. ${formatNPR(row.taxAmount || 0)})`}
                          </div>

                          {/* Screen interactive form */}
                          <div className="no-print space-y-1.5">
                            {/* Row 1: Type Selector + Add/Deduct Toggle Button */}
                            <div className="flex items-center gap-1">
                              <select
                                value={row.vatTdsType || 'none'}
                                onChange={(e) => {
                                  const nextType = e.target.value as VatTdsType;
                                  handleVatTdsConfig(index, {
                                    type: nextType,
                                    rate: nextType === 'vat' ? 13 : nextType === 'tds' ? 10 : 0,
                                    action: nextType === 'tds' ? 'deduct' : 'add',
                                  });
                                }}
                                className="flex-1 bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-bold text-slate-900 shadow-2xs focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="none">कर छैन (None)</option>
                                <option value="vat">भ्याट (VAT)</option>
                                <option value="tds">टीडीएस (TDS)</option>
                              </select>

                              {row.vatTdsType && row.vatTdsType !== 'none' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextAction: VatTdsAction =
                                      row.vatTdsAction === 'add' ? 'deduct' : 'add';
                                    handleVatTdsConfig(index, { action: nextAction });
                                  }}
                                  className={`px-2 py-1 text-[10px] font-black rounded border cursor-pointer transition shrink-0 ${
                                    row.vatTdsAction === 'add'
                                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200'
                                      : 'bg-rose-100 text-rose-950 border-rose-300 hover:bg-rose-200'
                                  }`}
                                  title="क्लिक गरी थप (+) वा कट्टी (-) परिवर्तन गर्नुहोस्"
                                >
                                  {row.vatTdsAction === 'add' ? '+ थप (Add)' : '- कट्टी (Deduct)'}
                                </button>
                              )}
                            </div>

                            {/* Row 2: Typeable % Rate input + Quick Clickable Rate Pills */}
                            {row.vatTdsType && row.vatTdsType !== 'none' && (
                              <div className="space-y-1 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[10px] font-extrabold text-slate-700 shrink-0">
                                    दर (%):
                                  </label>
                                  <div className="relative flex-1">
                                    <input
                                      type="number"
                                      step="any"
                                      min="0"
                                      max="100"
                                      value={row.vatTdsRate !== undefined ? row.vatTdsRate : ''}
                                      onChange={(e) => {
                                        const r = parseFloat(e.target.value);
                                        handleVatTdsConfig(index, {
                                          rate: isNaN(r) ? 0 : r,
                                        });
                                      }}
                                      placeholder="उदा: 13, 10, 1.5..."
                                      className="w-full bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-mono font-black text-slate-900 pr-5 focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <span className="absolute right-1.5 top-0.5 text-xs font-bold text-slate-400">
                                      %
                                    </span>
                                  </div>
                                </div>

                                {/* Quick Rate Pill Buttons for Instant 1-Click Set */}
                                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                  <span className="text-[9px] text-slate-400 font-bold">द्रुत:</span>
                                  {(row.vatTdsType === 'vat'
                                    ? [13, 0]
                                    : [10, 1.5, 5, 2.5, 1]
                                  ).map((rateChoice) => (
                                    <button
                                      key={rateChoice}
                                      type="button"
                                      onClick={() => handleVatTdsConfig(index, { rate: rateChoice })}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition border ${
                                        row.vatTdsRate === rateChoice
                                          ? 'bg-indigo-600 text-white border-indigo-700'
                                          : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                                      }`}
                                    >
                                      {rateChoice}%
                                    </button>
                                  ))}
                                </div>

                                {/* Live Computed Tax Display */}
                                {row.taxAmount !== undefined && row.taxAmount > 0 ? (
                                  <div className="pt-0.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-700 border-t border-slate-200">
                                    <span>
                                      {row.vatTdsAction === 'add' ? '+ कर:' : '- कट्टी कर:'}
                                    </span>
                                    <span
                                      className={
                                        row.vatTdsAction === 'add'
                                          ? 'text-emerald-700'
                                          : 'text-rose-700'
                                      }
                                    >
                                      Rs. {formatNPR(row.taxAmount)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* L.F. (LF) */}
                    <td className="py-2 px-1 border-r border-slate-300 text-center font-mono text-xs">
                      {isOpening ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <input
                          type="text"
                          value={row.lf}
                          onChange={(e) => updateEntryCell(index, 'lf', e.target.value)}
                          placeholder="L-12"
                          className="w-full text-center bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-0.5 text-xs font-mono"
                        />
                      )}
                    </td>

                    {/* Receipts */}
                    <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-bold text-emerald-950">
                      {isOpening ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <input
                          type="number"
                          value={row.receipts || ''}
                          onChange={(e) => updateEntryCell(index, 'receipts', e.target.value)}
                          placeholder="0.00"
                          className="w-full text-right bg-white border border-emerald-200/80 rounded p-1 text-xs font-mono font-bold text-emerald-900 focus:ring-1 focus:ring-emerald-500"
                        />
                      )}
                    </td>

                    {/* Payments */}
                    <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-bold text-rose-950">
                      {isOpening ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <input
                          type="number"
                          value={row.payments || ''}
                          onChange={(e) => updateEntryCell(index, 'payments', e.target.value)}
                          placeholder="0.00"
                          className="w-full text-right bg-white border border-rose-200/80 rounded p-1 text-xs font-mono font-bold text-rose-900 focus:ring-1 focus:ring-rose-500"
                        />
                      )}
                    </td>

                    {/* Mode (Bank vs Cash) */}
                    <td className="py-2 px-1 border-r border-slate-300 text-center text-xs">
                      {isOpening ? (
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1 py-0.5 rounded">
                          Opening
                        </span>
                      ) : (
                        <select
                          value={row.paymentMode}
                          onChange={(e) => updateEntryCell(index, 'paymentMode', e.target.value)}
                          className={`w-full text-[11px] font-bold rounded p-1 border ${
                            row.paymentMode === 'bank'
                              ? 'bg-sky-50 text-sky-900 border-sky-300'
                              : row.paymentMode === 'cash'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-slate-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="bank">बैंक (Bank)</option>
                          <option value="cash">नगद (Cash)</option>
                          <option value="contra_deposit">नगद दाखिला</option>
                          <option value="contra_withdrawal">बैंक झिकिएको</option>
                        </select>
                      )}
                    </td>

                    {/* Bank Balance (Running) */}
                    <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-black text-slate-900 bg-sky-50/20">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400">Rs.</span>
                        <span>{formatNPR(row.bankBalance || 0)}</span>
                      </div>
                    </td>

                    {/* Cash Balance (Running) */}
                    <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-black text-slate-900 bg-amber-50/20">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400">Rs.</span>
                        <span>{formatNPR(row.cashBalance || 0)}</span>
                      </div>
                    </td>

                    {/* Remarks */}
                    <td className="py-2 px-2 border-r border-slate-300 text-slate-700 text-xs">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => updateEntryCell(index, 'remarks', e.target.value)}
                        placeholder="कैफियत"
                        className="w-full text-slate-700 bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded p-0.5 text-xs"
                      />
                    </td>

                    {/* Actions (Add extra transaction on same day or clear) */}
                    <td className="py-2 px-1 text-center no-print">
                      {!isOpening && (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => addExtraEntryForDay(index, row.day, row.date)}
                            className="p-1 rounded text-sky-600 hover:bg-sky-100 transition cursor-pointer"
                            title="यो दिन अर्को कारोवार थप्नुहोस् (Add extra entry on this day)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntry(index)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="खाली गर्नुहोस् / मेटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Row matching official format */}
            <tfoot>
              <tr className="bg-white text-slate-950 font-bold border-t-2 border-slate-500 text-xs sm:text-sm font-sans">
                {/* Date */}
                <td className="py-3 px-2 border-r border-slate-300 text-center font-mono font-bold">
                  {activeProcessedMonth.nepaliMonth} End
                </td>

                {/* Voucher No */}
                <td className="py-3 px-2 border-r border-slate-300 text-center font-mono">
                  -
                </td>

                {/* Particulars: Total (TOTAL) */}
                <td colSpan={3} className="py-3 px-4 border-r border-slate-300 font-black tracking-wide text-center uppercase bg-slate-50">
                  Total (कुल महिनाको जोड)
                </td>

                {/* L.F. */}
                <td className="py-3 px-1 border-r border-slate-300 text-center">
                  -
                </td>

                {/* Total Receipts */}
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono font-black text-emerald-800">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[11px] text-slate-500">Rs.</span>
                    <span>{formatNPR(activeMonthSummary.totalReceipts)}</span>
                  </div>
                </td>

                {/* Total Payments */}
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono font-black text-rose-800">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[11px] text-slate-500">Rs.</span>
                    <span>{formatNPR(activeMonthSummary.totalPayments)}</span>
                  </div>
                </td>

                {/* Mode */}
                <td className="py-3 px-1 border-r border-slate-300 text-center">
                  -
                </td>

                {/* Closing Bank Balance */}
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono font-black text-sky-950 bg-sky-100/60">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[11px] text-slate-500">Rs.</span>
                    <span>{formatNPR(activeMonthSummary.closingBank)}</span>
                  </div>
                </td>

                {/* Closing Cash Balance */}
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono font-black text-amber-950 bg-amber-100/60">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[11px] text-slate-500">Rs.</span>
                    <span>{formatNPR(activeMonthSummary.closingCash)}</span>
                  </div>
                </td>

                {/* Remarks: End of day balance */}
                <td className="py-3 px-2 text-slate-800 font-semibold text-xs border-r border-slate-300">
                  End of month balance
                </td>

                <td className="py-3 px-1 no-print bg-slate-50"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Verification & Signatures Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900">लेखा मिलान सूत्र (Reconciliation Formula): </span>
                <span className="font-mono">
                  सुरुवाती कुल मौज्दात (Rs. {formatNPR(activeMonthSummary.openingBank + activeMonthSummary.openingCash)}) + कुल आम्दानी (Rs. {formatNPR(activeMonthSummary.totalReceipts)}) - कुल खर्च (Rs. {formatNPR(activeMonthSummary.totalPayments)}) = अन्तिम कुल मौज्दात (Rs. {formatNPR(activeMonthSummary.closingBank + activeMonthSummary.closingCash)})
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              ✓ हिसाब मिलेको छ (Daybook Balanced)
            </span>
          </div>

          {/* Printable Signature Lines */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end text-xs font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-slate-400">
                [तयार गर्नेको दस्तखत]
              </div>
              <p className="font-bold text-slate-900">लेखापाल / क्यासियर</p>
              <p className="text-[11px] text-slate-500">Prepared By</p>
            </div>

            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-slate-400">
                [प्रमाणित गर्नेको दस्तखत]
              </div>
              <p className="font-bold text-slate-900">
                {data.client?.proprietorName || 'सञ्चालक / प्रबन्धक'}
              </p>
              <p className="text-[11px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
