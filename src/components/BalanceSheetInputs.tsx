import React from 'react';
import { AuditData, CalculatedReport } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, Lock } from 'lucide-react';

interface BalanceSheetInputsProps {
  data: AuditData;
  report: CalculatedReport;
  onCapitalChange: (capital: AuditData['capital']) => void;
  onReservesChange: (reserves: AuditData['reserves']) => void;
  onCurrentAssetsChange: (assets: AuditData['currentAssets']) => void;
  onCurrentLiabilitiesChange: (liabilities: AuditData['currentLiabilities']) => void;
  onNonCurrentLiabilitiesChange: (liabilities: AuditData['nonCurrentLiabilities']) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const BalanceSheetInputs: React.FC<BalanceSheetInputsProps> = ({
  data,
  report,
  onCapitalChange,
  onReservesChange,
  onCurrentAssetsChange,
  onCurrentLiabilitiesChange,
  onNonCurrentLiabilitiesChange,
  fontSize,
}) => {
  const labelSize =
    fontSize === 'xlarge'
      ? 'text-base font-bold'
      : fontSize === 'large'
      ? 'text-sm font-semibold'
      : 'text-xs font-semibold';

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-lg p-2.5'
      : fontSize === 'large'
      ? 'text-base p-2'
      : 'text-sm p-1.5';

  return (
    <div className="space-y-6">
      {/* Live Balance Checker Status Header */}
      <div
        className={`p-5 rounded-xl border transition-all ${
          report.isBalancedCurrent
            ? 'bg-emerald-900 text-white border-emerald-700 shadow-md'
            : 'bg-amber-950 text-white border-amber-800 shadow-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {report.isBalancedCurrent ? (
              <div className="p-3 bg-emerald-600 rounded-full text-white">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 bg-amber-600 rounded-full text-white">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="text-xl font-bold flex items-center gap-2">
                {report.isBalancedCurrent ? (
                  <span>Balance Sheet is Fully Balanced! (वासलात मिलेको छ ✅)</span>
                ) : (
                  <span>Balance Sheet Discrepancy (वासलातमा अन्तर छ)</span>
                )}
              </div>
              <p className="text-sm opacity-90 mt-0.5">
                {report.isBalancedCurrent
                  ? 'Total Capital & Liabilities match Total Assets perfectly.'
                  : `Difference of रु. ${formatNPR(report.balanceDifferenceCurrent)}. Check Current Assets vs Liabilities or Cash balance.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-300 block">
                Total Capital & Liabilities (पूँजी र दायित्व)
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-300">
                रु. {formatNPR(report.totalLiabilitiesAndEquityCurrent)}
              </span>
            </div>
            <div className="text-xl font-bold text-slate-400">=</div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-300 block">
                Total Assets (कुल सम्पत्ति)
              </span>
              <span className="text-2xl font-bold font-mono text-teal-300">
                रु. {formatNPR(report.totalAssetsCurrent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of BS Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: CAPITAL & LIABILITIES */}
        <div className="space-y-6">
          {/* 1. Schedule 1: Proprietor's Capital */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Schedule 1: Proprietor's Capital (स्वामित्व पूँजी)
              </h3>
              <span className="text-xs text-slate-500 font-mono">F.Y. {data.client.currentFiscalYear}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Opening Capital (सुरुको पूँजी) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.capital.openingCapital || ''}
                    onChange={(e) =>
                      onCapitalChange({
                        ...data.capital,
                        openingCapital: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Additional Investment (थप लगानी)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.capital.additionalInvestment || ''}
                    onChange={(e) =>
                      onCapitalChange({
                        ...data.capital,
                        additionalInvestment: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Proprietor's Drawings / Withdrawals (निजी खर्च / स्वामित्व निकासी)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.capital.withdrawalsDrawings || ''}
                    onChange={(e) =>
                      onCapitalChange({
                        ...data.capital,
                        withdrawalsDrawings: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">Total Proprietor's Fund:</span>
                <span className="font-mono font-bold text-slate-900">
                  रु. {formatNPR(report.totalProprietorFundCurrent)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Schedule 2: Reserves & Surplus */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Schedule 2: Reserves & Surplus (जगेडा तथा कोष)
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                Auto-calculated
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Opening Surplus / Retained Earnings (अघिल्लो वर्षसम्मको सञ्चित नाफा) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.reserves.openingSurplus || ''}
                    onChange={(e) =>
                      onReservesChange({
                        ...data.reserves,
                        openingSurplus: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-sm space-y-1.5">
                <div className="flex justify-between text-emerald-950">
                  <span>Current Year Net Profit (चालु वर्षको खुद नाफा - From P&L):</span>
                  <span className="font-mono font-bold">रु. {formatNPR(report.netProfitAfterTaxCurrent)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 font-bold border-t border-emerald-200 pt-1.5">
                  <span>Closing Reserves & Surplus (कुल अन्तिम जगेडा):</span>
                  <span className="font-mono">रु. {formatNPR(report.closingReservesAndSurplusCurrent)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Non-Current Liabilities */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-3 mb-4">
              Non-Current Liabilities (दीर्घकालीन दायित्व तथा ऋण)
            </h3>
            <div>
              <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                Long Term Bank Loans (दीर्घकालीन बैंक ऋण)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                <input
                  type="number"
                  value={data.nonCurrentLiabilities.longTermBankLoans || ''}
                  onChange={(e) =>
                    onNonCurrentLiabilitiesChange({
                      ...data.nonCurrentLiabilities,
                      longTermBankLoans: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                />
              </div>
            </div>
          </div>

          {/* 4. Schedule 6: Current Liabilities */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Current Liabilities & Payables (चालु दायित्व तथा साहुहरु)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Schedule 6</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Sundry Creditors (साहुहरु / आपूर्तिकर्ता) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.sundryCreditors || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        sundryCreditors: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Bank Overdraft / Short-Term Loan (ओभरड्राफ्ट)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.bankOverdraft || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        bankOverdraft: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Audit Fee Payable (लेखापरीक्षण शुल्क)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.auditFeePayable || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        auditFeePayable: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  TDS on Audit Fee (लेखापरीक्षण TDS दायित्व)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.tdsOnAuditFeePayable || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        tdsOnAuditFeePayable: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Interest Payable (तिर्न बाँकी ब्याज)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.interestPayable || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        interestPayable: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Other Payables / Proprietor A/C (अन्य दायित्व)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentLiabilities.otherPayables || ''}
                    onChange={(e) =>
                      onCurrentLiabilitiesChange({
                        ...data.currentLiabilities,
                        otherPayables: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 bg-slate-100 p-3 rounded-lg flex items-center justify-between text-sm font-bold text-slate-800">
              <span>Total Current Liabilities (कुल चालु दायित्व):</span>
              <span className="font-mono text-base text-rose-800">
                रु. {formatNPR(report.totalCurrentLiabilitiesCurrent)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ASSETS */}
        <div className="space-y-6">
          {/* 1. Fixed Assets Summary (from Schedule 3) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Fixed Assets Net Block (स्थिर सम्पत्ति खुद मौज्दात)
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                Schedule 3
              </span>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-800 font-semibold block">
                  Net Block after Depreciation (ह्रासकट्टी पछिको खुद मूल्य)
                </span>
                <span className="text-2xl font-bold font-mono text-blue-950">
                  रु. {formatNPR(report.totalFixedAssetsNetBlockCurrent)}
                </span>
              </div>
              <span className="text-xs text-blue-700 bg-white px-3 py-1 rounded-md border border-blue-200">
                Auto-calculated from Fixed Assets Tab
              </span>
            </div>
          </div>

          {/* 2. Current Assets (Schedules 4, 5, etc.) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Current Assets, Advances & Deposits (चालु सम्पत्ति तथा पेश्की)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Schedules 4 & 5</span>
            </div>

            <div className="space-y-4">
              {/* Cash and Bank */}
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Cash & Bank Balance (नगद तथा बैंक मौज्दात - Schedule 4) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.currentAssets.cashAndBank || ''}
                    onChange={(e) =>
                      onCurrentAssetsChange({
                        ...data.currentAssets,
                        cashAndBank: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              {/* Closing Inventory (auto from Trading) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Closing Inventory / Stock (अन्तिम मौज्दात):
                  </span>
                  <span className="text-xs text-slate-500">Auto-linked from Trading Account</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-base">
                  रु. {formatNPR(data.trading.closingStock)}
                </span>
              </div>

              {/* Sundry Debtors */}
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Sundry Debtors & Receivables (असामीहरु / ग्राहकबाट उठ्नुपर्ने - Schedule 5) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={data.currentAssets.sundryDebtors || ''}
                    onChange={(e) =>
                      onCurrentAssetsChange({
                        ...data.currentAssets,
                        sundryDebtors: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              {/* VAT Receivable */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-slate-700 ${labelSize}`}>
                    VAT Receivable (मूल्य अभिवृद्धि कर फिर्ता/लिनुपर्ने)
                  </label>
                  <label className="text-xs text-emerald-800 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.currentAssets.useVatRegisterReceivable}
                      onChange={(e) =>
                        onCurrentAssetsChange({
                          ...data.currentAssets,
                          useVatRegisterReceivable: e.target.checked,
                        })
                      }
                      className="rounded text-emerald-600 w-3 h-3"
                    />
                    <span>Sync from VAT Table</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={
                      data.currentAssets.useVatRegisterReceivable && report.netVatPayableOrReceivableVatRec < 0
                        ? Math.abs(report.netVatPayableOrReceivableVatRec)
                        : (data.currentAssets.vatReceivable || '')
                    }
                    disabled={data.currentAssets.useVatRegisterReceivable}
                    readOnly={data.currentAssets.useVatRegisterReceivable}
                    onChange={(e) =>
                      onCurrentAssetsChange({
                        ...data.currentAssets,
                        vatReceivable: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize} ${
                      data.currentAssets.useVatRegisterReceivable ? 'bg-slate-100 text-slate-800 cursor-not-allowed select-none' : ''
                    }`}
                  />
                  {data.currentAssets.useVatRegisterReceivable && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      <Lock className="w-3 h-3 text-emerald-700" />
                      Locked
                    </span>
                  )}
                </div>
              </div>

              {/* Advance Income Tax */}
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Advance Income Tax / TDS Receivable (अग्रिम आयकर तथा TDS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentAssets.advanceIncomeTax || ''}
                    onChange={(e) =>
                      onCurrentAssetsChange({
                        ...data.currentAssets,
                        advanceIncomeTax: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              {/* Loans and Advances */}
              <div>
                <label className={`block text-slate-700 mb-1 ${labelSize}`}>
                  Loans & Advances / Deposit (धरौटी तथा अन्य पेश्की)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                  <input
                    type="number"
                    value={data.currentAssets.loansAndAdvances || ''}
                    onChange={(e) =>
                      onCurrentAssetsChange({
                        ...data.currentAssets,
                        loansAndAdvances: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
                  />
                </div>
              </div>

              {/* Total Current Assets & Net Current Assets */}
              <div className="bg-slate-100 p-3.5 rounded-lg space-y-2 border border-slate-200">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Total Current Assets (A):</span>
                  <span className="font-mono text-teal-800">
                    रु. {formatNPR(report.totalCurrentAssetsCurrent)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-700 border-t border-slate-200 pt-1.5">
                  <span>Net Current Assets (चालु सम्पत्ति - चालु दायित्व) (A - B):</span>
                  <span className="font-mono text-emerald-800 text-base">
                    रु. {formatNPR(report.netCurrentAssetsCurrent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
