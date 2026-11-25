import React from 'react';
import { AuditData, CalculatedReport } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { Calculator, CheckCircle2, ShieldAlert, Sparkles, Scale } from 'lucide-react';

interface TaxComputationSectionProps {
  data: AuditData;
  report: CalculatedReport;
  onTaxSettingsChange: (settings: AuditData['taxSettings']) => void;
  onFinanceChange: (finance: AuditData['finance']) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const TaxComputationSection: React.FC<TaxComputationSectionProps> = ({
  data,
  report,
  onTaxSettingsChange,
  onFinanceChange,
  fontSize,
}) => {
  const settings = data.taxSettings;

  const updateSetting = (field: keyof AuditData['taxSettings'], value: any) => {
    onTaxSettingsChange({
      ...settings,
      [field]: value,
    });
  };

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

  const taxableBusinessIncome = Math.max(
    0,
    report.profitBeforeTaxCurrent +
      (data.finance.disallowedInterestSec14 || 0) -
      (settings.donationSec12 || 0)
  );

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Calculator className="w-6 h-6 text-emerald-700" />
          <span>Schedule 8: Computation of Tax (आयकर गणना - आयकर ऐन, २०५८ बमोजिम)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax Method Selection - Field 1 */}
          <div>
            <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
              Tax Assessment Method (कर निर्धारण विधि)
            </label>
            <select
              value={settings.taxRateType}
              onChange={(e) => updateSetting('taxRateType', e.target.value as any)}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
            >
              <option value="proprietorship_slab">
                Proprietorship Individual/Couple Slabs (एकलौटी फर्म कर स्ल्याब)
              </option>
              <option value="corporate_25">
                Corporate Flat Rate - 25% (सामान्य कम्पनी दर २५%)
              </option>
              <option value="corporate_20">
                Entity / Concessional Rate - 20% (सहुलियत दर २०%)
              </option>
              <option value="manual">
                Manual Tax Provision (म्यानुअल कर रकम प्रविष्टि)
              </option>
            </select>
          </div>

          {/* Marital Status (for Slab) - Field 2 */}
          {settings.taxRateType === 'proprietorship_slab' && (
            <div>
              <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                Marital Status / Slab Type (दम्पती वा एकल स्थिति)
              </label>
              <select
                value={settings.maritalStatus}
                onChange={(e) => updateSetting('maritalStatus', e.target.value as any)}
                className={`w-full bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 ${inputSize}`}
              >
                <option value="couple">Couple / दम्पती (Exemption up to रु. ६,००,०००)</option>
                <option value="individual">Individual / एकल (Exemption up to रु. ५,००,०००)</option>
              </select>
            </div>
          )}

          {/* Manual Input if manual - Field 2 */}
          {settings.taxRateType === 'manual' && (
            <div>
              <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                Manual Provision for Tax (म्यानुअल आयकर व्यवस्था)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
                <input
                  type="number"
                  value={settings.manualTaxProvision || ''}
                  onChange={(e) => updateSetting('manualTaxProvision', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 ${inputSize}`}
                />
              </div>
            </div>
          )}

          {/* Section 14 Disallowed Interest - Field 1 in Row 2 */}
          <div>
            <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
              Disallowed Interest U/S 14 (अस्वीकृत ब्याज - दफा १४)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">रु.</span>
              <input
                type="number"
                value={data.finance.disallowedInterestSec14 || ''}
                onChange={(e) =>
                  onFinanceChange({
                    ...data.finance,
                    disallowedInterestSec14: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                className={`w-full pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 ${inputSize}`}
              />
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Excess interest on loan disallowed as per Nepal Income Tax Act Sec 14
            </span>
          </div>
        </div>
      </div>

      {/* Computation Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900 text-lg">
            Tax Assessment Statement for F.Y. {data.client.currentFiscalYear} (आयकर गणना विवरण)
          </h3>
        </div>

        <div className="p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs font-bold">
                <th className="py-3 px-4">Particulars (विवरण)</th>
                <th className="py-3 px-4 text-right w-44">P & L A/C Amount (रु.)</th>
                <th className="py-3 px-4 text-right w-44">For Income Tax Amount (रु.)</th>
                <th className="py-3 px-4 w-40">Remarks (कैफियत)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm font-mono">
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  Sales / Turnover (बिक्री आम्दानी U/S 7.2 Kha)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">{formatNPR(report.totalIncomeCurrent)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatNPR(report.totalIncomeCurrent)}</td>
                <td className="py-2.5 px-4 font-sans text-xs text-slate-500">Note 3.13</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  Other Income (अन्य आम्दानी)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">
                  {formatNPR(data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}
                </td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                  {formatNPR(data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}
                </td>
                <td className="py-2.5 px-4 font-sans text-xs text-slate-500">Note 3.14</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="py-2.5 px-4 font-sans text-slate-900">GROSS INCOME (कुल आम्दानी)</td>
                <td className="py-2.5 px-4 text-right text-emerald-800">
                  {formatNPR(report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}
                </td>
                <td className="py-2.5 px-4 text-right text-emerald-800">
                  {formatNPR(report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}
                </td>
                <td></td>
              </tr>

              {/* Deductions */}
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  Cost of Goods Sold (बिक्री भएको मालको लागत U/S 15)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">{formatNPR(report.cogsCurrent)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatNPR(report.cogsCurrent)}</td>
                <td className="py-2.5 px-4 font-sans text-xs text-slate-500">Note 3.4</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  Depreciation (ह्रासकट्टी U/S 19)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">{formatNPR(report.totalDepreciationCurrent)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatNPR(report.totalDepreciationCurrent)}</td>
                <td className="py-2.5 px-4 font-sans text-xs text-slate-500">Schedule 3</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  General Administrative Expenses (प्रशासनिक खर्च U/S 13)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">{formatNPR(report.totalAdminExpensesCurrent)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatNPR(report.totalAdminExpensesCurrent)}</td>
                <td className="py-2.5 px-4 font-sans text-xs text-slate-500">Schedule 7</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                  Interest on Loan (ऋणको ब्याज U/S 14)
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">{formatNPR(data.finance.interestOnLoan)}</td>
                <td className="py-2.5 px-4 text-right font-bold text-amber-900">
                  {formatNPR(Math.max(0, data.finance.interestOnLoan - (data.finance.disallowedInterestSec14 || 0)))}
                </td>
                <td className="py-2.5 px-4 font-sans text-xs text-amber-700">
                  {data.finance.disallowedInterestSec14 > 0 ? `Disallowed: रु. ${formatNPR(data.finance.disallowedInterestSec14)}` : 'Admissible'}
                </td>
              </tr>

              <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <td className="py-3 px-4 font-sans text-slate-900">
                  TAXABLE INCOME FROM BUSINESS (करयोग्य व्यवसाय आय)
                </td>
                <td className="py-3 px-4 text-right text-slate-900">
                  {formatNPR(report.profitBeforeTaxCurrent)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 font-bold text-base">
                  {formatNPR(taxableBusinessIncome)}
                </td>
                <td className="py-3 px-4 font-sans text-xs text-emerald-800 font-semibold">
                  (A) Taxable Base
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Slab Breakdown Box */}
        <div className="bg-slate-900 text-white p-6 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>FINAL TAX COMPUTATION & NET TAX PAYABLE (अन्तिम आयकर दायित्व र तिर्नुपर्ने बाँकी):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">
                Total Tax Liability (कुल कर दायित्व)
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                रु. {formatNPR(report.calculatedTaxLiabilityCurrent)}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Method: {settings.taxRateType === 'proprietorship_slab' ? `Proprietorship Slab (${settings.maritalStatus})` : settings.taxRateType}
              </span>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">
                Less: Advance Tax Paid / TDS (कट्टी भएको अग्रिम कर)
              </span>
              <div className="text-2xl font-bold font-mono text-teal-300">
                रु. {formatNPR(report.advanceTaxPaidCurrent)}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                From Schedule 5 / Advance Tax
              </span>
            </div>

            <div className="md:col-span-2 bg-emerald-950 p-5 rounded-xl border border-emerald-700">
              <span className="text-xs text-emerald-300 block mb-1 font-bold">
                {report.netTaxPayableOrRefundableCurrent >= 0
                  ? 'NET TAX PAYABLE TO IRD (दाखिला गर्नुपर्ने खुद कर)'
                  : 'NET TAX REFUNDABLE (फिर्ता हुनुपर्ने कर)'}
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                रु. {formatNPR(Math.abs(report.netTaxPayableOrRefundableCurrent))}
              </div>
              <span className="text-xs text-emerald-300/80 mt-1.5 block">
                {report.netTaxPayableOrRefundableCurrent >= 0
                  ? 'Payable before 31st Ashadh / दाखिल गर्नुपर्ने अन्तिम मिति असार मसान्त'
                  : 'Adjustable in next fiscal year / आगामी आर्थिक वर्षमा मिलान गर्न सकिने'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
