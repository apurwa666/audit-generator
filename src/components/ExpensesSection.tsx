import React from 'react';
import { AuditData, CalculatedReport, AdminExpenseItem } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { Receipt, Plus, Trash2, CheckCircle2, TrendingUp } from 'lucide-react';

interface ExpensesSectionProps {
  data: AuditData;
  report: CalculatedReport;
  onAdminExpensesChange: (items: AdminExpenseItem[]) => void;
  onOtherIncomeChange: (income: AuditData['otherIncome']) => void;
  onFinanceChange: (finance: AuditData['finance']) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  data,
  report,
  onAdminExpensesChange,
  onOtherIncomeChange,
  onFinanceChange,
  fontSize,
}) => {
  const updateExpense = (id: string, field: 'particular' | 'nepaliLabel' | 'currentYear' | 'previousYear', value: any) => {
    const updated = data.adminExpenses.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'currentYear' || field === 'previousYear' ? (parseFloat(value) || 0) : value,
        };
      }
      return item;
    });
    onAdminExpensesChange(updated);
  };

  const addExpenseRow = () => {
    const newId = `exp-${Date.now()}`;
    onAdminExpensesChange([
      ...data.adminExpenses,
      {
        id: newId,
        particular: 'New Expense',
        nepaliLabel: 'नयाँ खर्च विवरण',
        currentYear: 0,
        previousYear: 0,
      },
    ]);
  };

  const removeExpenseRow = (id: string) => {
    onAdminExpensesChange(data.adminExpenses.filter((item) => item.id !== id));
  };

  const labelSize =
    fontSize === 'xlarge'
      ? 'text-lg font-bold'
      : fontSize === 'large'
      ? 'text-base font-bold'
      : 'text-sm font-bold';

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-lg py-3 px-3.5'
      : fontSize === 'large'
      ? 'text-base py-2.5 px-3'
      : 'text-sm sm:text-base py-2 px-3';

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Other Income & Finance Charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Other Income */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-5 border-b border-slate-200 pb-3">
            Other Income (अन्य आम्दानी)
          </h3>
          <div className="space-y-5">
            <div>
              <label className={`block text-slate-800 mb-2 ${labelSize}`}>
                Bank Interest Income (बैंक ब्याज आम्दानी)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                <input
                  type="number"
                  value={data.otherIncome.bankInterest || ''}
                  onChange={(e) =>
                    onOtherIncomeChange({
                      ...data.otherIncome,
                      bankInterest: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-slate-800 mb-2 ${labelSize}`}>
                Miscellaneous Income (विविध आम्दानी)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                <input
                  type="number"
                  value={data.otherIncome.miscellaneousIncome || ''}
                  onChange={(e) =>
                    onOtherIncomeChange({
                      ...data.otherIncome,
                      miscellaneousIncome: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Finance / Interest Charges */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-5 border-b border-slate-200 pb-3">
            Interest & Bank Charges (ऋणको ब्याज तथा बैंक शुल्क)
          </h3>
          <div className="space-y-5">
            <div>
              <label className={`block text-slate-800 mb-2 ${labelSize}`}>
                Interest on Loan (ऋणको ब्याज खर्च) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                <input
                  type="number"
                  value={data.finance.interestOnLoan || ''}
                  onChange={(e) =>
                    onFinanceChange({
                      ...data.finance,
                      interestOnLoan: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-slate-800 mb-2 ${labelSize}`}>
                Bank Service Charges (बैंक सेवा शुल्क)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                <input
                  type="number"
                  value={data.finance.bankCharges || ''}
                  onChange={(e) =>
                    onFinanceChange({
                      ...data.finance,
                      bankCharges: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule 7: Administrative Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
              Schedule 7: Administrative Expenses (प्रशासनिक तथा सञ्चालन खर्चहरु)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Itemized operating expenses as per standard Nepal ICAN practice.
            </p>
          </div>
          <button
            onClick={addExpenseRow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-bold hover:bg-emerald-600 transition shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense Row (नयाँ खर्च थप्नुहोस्)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 text-xs sm:text-sm font-bold">
                <th className="py-4 px-4 w-12 text-center">S.N.</th>
                <th className="py-4 px-4">Particulars (खर्च शीर्षक - English)</th>
                <th className="py-4 px-4">Nepali Label (नेपाली विवरण)</th>
                <th className="py-4 px-4 w-48 text-right">F.Y. {data.client.currentFiscalYear} (रु.)</th>
                <th className="py-4 px-4 w-48 text-right">F.Y. {data.client.previousFiscalYear} (रु.)</th>
                <th className="py-4 px-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {data.adminExpenses.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500 text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={item.particular}
                      onChange={(e) => updateExpense(item.id, 'particular', e.target.value)}
                      className={`w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white px-3 py-2 rounded-lg text-slate-900 font-medium ${inputSize}`}
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={item.nepaliLabel}
                      onChange={(e) => updateExpense(item.id, 'nepaliLabel', e.target.value)}
                      className={`w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white px-3 py-2 rounded-lg text-slate-600 ${inputSize}`}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <input
                      type="number"
                      value={item.currentYear || ''}
                      onChange={(e) => updateExpense(item.id, 'currentYear', e.target.value)}
                      placeholder="0.00"
                      className={`w-full text-right bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3 py-2 font-mono font-semibold text-slate-900 shadow-2xs ${inputSize}`}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <input
                      type="number"
                      value={item.previousYear || ''}
                      onChange={(e) => updateExpense(item.id, 'previousYear', e.target.value)}
                      placeholder="0.00"
                      className={`w-full text-right bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3 py-2 font-mono text-slate-600 shadow-2xs ${inputSize}`}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => removeExpenseRow(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colSpan={3} className="py-4 px-4 text-right">
                  TOTAL ADMINISTRATIVE EXPENSES (कुल प्रशासनिक खर्च):
                </td>
                <td className="py-4 px-4 text-right font-mono text-emerald-800 text-base sm:text-lg">
                  रु. {formatNPR(report.totalAdminExpensesCurrent)}
                </td>
                <td className="py-4 px-4 text-right font-mono text-slate-600">
                  रु. {formatNPR(report.totalAdminExpensesPrevious)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Real-time Profit & Loss Summary Card */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>INSTANT PROFIT & LOSS ENGINE (स्वतः निकालिएको नाफा नोक्सान नतिजा):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Gross Profit (कुल नाफा)</span>
              <span className="text-xl font-bold font-mono text-slate-200">
                रु. {formatNPR(report.grossProfitCurrent)}
              </span>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Total Admin Expenses (प्रशासनिक खर्च)</span>
              <span className="text-xl font-bold font-mono text-rose-300">
                रु. {formatNPR(report.totalAdminExpensesCurrent)}
              </span>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Depreciation (ह्रासकट्टी)</span>
              <span className="text-xl font-bold font-mono text-amber-300">
                रु. {formatNPR(report.totalDepreciationCurrent)}
              </span>
            </div>

            <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-700">
              <span className="text-xs text-emerald-300 block mb-1 font-bold">
                PROFIT BEFORE TAX (कर अघिको नाफा)
              </span>
              <span className={`text-2xl font-bold font-mono ${report.profitBeforeTaxCurrent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                रु. {formatNPR(report.profitBeforeTaxCurrent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
