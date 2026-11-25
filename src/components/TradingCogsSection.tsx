import React from 'react';
import { AuditData, CalculatedReport } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { ShoppingCart, CheckCircle2, TrendingUp, Sparkles, RefreshCw, Lock } from 'lucide-react';

interface TradingCogsSectionProps {
  data: AuditData;
  report: CalculatedReport;
  onChange: (tradingData: AuditData['trading']) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const TradingCogsSection: React.FC<TradingCogsSectionProps> = ({
  data,
  report,
  onChange,
  fontSize,
}) => {
  const trading = data.trading;

  const updateField = (field: keyof AuditData['trading'], value: any) => {
    onChange({
      ...trading,
      [field]: typeof value === 'number' ? (isNaN(value) ? 0 : value) : value,
    });
  };

  const labelSize =
    fontSize === 'xlarge'
      ? 'text-lg font-bold'
      : fontSize === 'large'
      ? 'text-base font-bold'
      : 'text-sm font-bold';

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-lg py-3.5 px-4'
      : fontSize === 'large'
      ? 'text-base py-3 px-3.5'
      : 'text-sm sm:text-base py-2.5 px-3.5';

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Top Banner / Explanatory Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-950 text-base sm:text-lg">
              Automated Trading Account & Cost of Goods Sold (स्वतः गणना हुने व्यापार हिसाब तथा बिक्री लागत)
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              Enter your basic stock, purchases, and direct expenses. The software automatically calculates Cost of Goods Available, COGS, and Gross Profit.
            </p>
          </div>
        </div>

        {/* VAT Register Sync Toggle */}
        <label className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-emerald-300 shadow-2xs cursor-pointer hover:bg-emerald-50/50 transition">
          <input
            type="checkbox"
            checked={trading.useVatRegisterTotals}
            onChange={(e) => updateField('useVatRegisterTotals', e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-slate-900 block">Auto-Sync with VAT Table</span>
            <span className="text-slate-500">(भ्याट मिलानबाट Sales/Purchase स्वतः तान्नुहोस्)</span>
          </div>
        </label>
      </div>

      {/* Main Trading Inputs Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
              Schedule 6: Direct Expenses & Sales (खरिद, प्रत्यक्ष खर्च तथा बिक्री विवरण)
            </h3>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 font-semibold">All figures in Nepalese Rupees (रु.)</span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* 1. SALES REVENUE */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  1. Sales Revenue (बिक्री आम्दानी)
                </span>
                {trading.useVatRegisterTotals && (
                  <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    स्वतः भरिएको / सुरक्षित (Auto-filled from VAT - Locked)
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label className={`text-slate-800 ${labelSize}`}>
                    Current Year Sales (चालु वर्षको बिक्री - F.Y. {data.client.currentFiscalYear}) *
                  </label>
                  {trading.useVatRegisterTotals && (
                    <span className="text-xs bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
                      Locked (परिवर्तन गर्न नमिल्ने)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                  <input
                    type="number"
                    value={trading.useVatRegisterTotals ? report.totalTaxableSalesVatRec : (trading.sales || '')}
                    onChange={(e) => updateField('sales', parseFloat(e.target.value) || 0)}
                    disabled={trading.useVatRegisterTotals}
                    readOnly={trading.useVatRegisterTotals}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize} ${
                      trading.useVatRegisterTotals ? 'bg-slate-100 text-slate-800 cursor-not-allowed select-none' : ''
                    }`}
                  />
                </div>
                {trading.useVatRegisterTotals && (
                  <span className="text-xs text-emerald-800 mt-1.5 block font-medium">
                    भ्याट विवरणबाट १२ महिनाको बिक्री स्वतः भरिएको छ: रु. {formatNPR(report.totalTaxableSalesVatRec)} (सुरक्षित)
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                  Previous Year Sales (अघिल्लो वर्षको बिक्री - F.Y. {data.client.previousFiscalYear})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={trading.previousYearSales || ''}
                    onChange={(e) => updateField('previousYearSales', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>
            </div>

            {/* 2. OPENING STOCK */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  2. Opening Stock (सुरु मौज्दात)
                </span>
                <span className="text-xs text-slate-500 font-medium">From Previous Year Balance Sheet</span>
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-800 mb-1.5 ${labelSize}`}>
                  Current Year Opening Stock (चालु वर्षको सुरु मौज्दात) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                  <input
                    type="number"
                    value={trading.openingStock || ''}
                    onChange={(e) => updateField('openingStock', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                  Previous Year Opening Stock (अघिल्लो वर्षको सुरु मौज्दात)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={trading.previousYearOpeningStock || ''}
                    onChange={(e) => updateField('previousYearOpeningStock', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>
            </div>

            {/* 3. PURCHASES */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  3. Purchases (वर्षभरिको खरिद)
                </span>
                {trading.useVatRegisterTotals && (
                  <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    स्वतः भरिएको / सुरक्षित (Auto-filled from VAT - Locked)
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label className={`text-slate-800 ${labelSize}`}>
                    Current Year Purchases (चालु वर्षको कुल खरिद) *
                  </label>
                  {trading.useVatRegisterTotals && (
                    <span className="text-xs bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
                      Locked (परिवर्तन गर्न नमिल्ने)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                  <input
                    type="number"
                    value={trading.useVatRegisterTotals ? report.totalTaxablePurchaseVatRec : (trading.purchases || '')}
                    onChange={(e) => updateField('purchases', parseFloat(e.target.value) || 0)}
                    disabled={trading.useVatRegisterTotals}
                    readOnly={trading.useVatRegisterTotals}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize} ${
                      trading.useVatRegisterTotals ? 'bg-slate-100 text-slate-800 cursor-not-allowed select-none' : ''
                    }`}
                  />
                </div>
                {trading.useVatRegisterTotals && (
                  <span className="text-xs text-emerald-800 mt-1.5 block font-medium">
                    भ्याट विवरणबाट १२ महिनाको खरिद स्वतः भरिएको छ: रु. {formatNPR(report.totalTaxablePurchaseVatRec)} (सुरक्षित)
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                  Previous Year Purchases (अघिल्लो वर्षको खरिद)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                  <input
                    type="number"
                    value={trading.previousYearPurchases || ''}
                    onChange={(e) => updateField('previousYearPurchases', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>
            </div>

            {/* 4. DIRECT EXPENSES (Transportation / Freight / Wages) */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  4. Direct Expenses (स्थानीय ढुवानी तथा प्रत्यक्ष ज्याला)
                </span>
                <span className="text-xs text-slate-500 font-medium">Freight & Direct Wages</span>
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-800 mb-1.5 ${labelSize}`}>
                  Local Transportation / Freight (स्थानीय ढुवानी खर्च)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                  <input
                    type="number"
                    value={trading.localTransportation || ''}
                    onChange={(e) => updateField('localTransportation', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-slate-800 mb-1.5 ${labelSize}`}>
                  Direct Wages / Customs (प्रत्यक्ष ज्याला तथा भन्सार शुल्क)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                  <input
                    type="number"
                    value={trading.directWages || ''}
                    onChange={(e) => updateField('directWages', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                  />
                </div>
              </div>
            </div>

            {/* 5. CLOSING STOCK */}
            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-6 md:col-span-2">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3 flex-wrap gap-2">
                <div>
                  <span className="font-bold text-emerald-950 text-base sm:text-lg block">
                    5. Closing Stock / Inventory (अन्तिम मौज्दात) *
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-800 font-medium">
                    This figure will automatically reflect in the Balance Sheet under Current Assets!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-slate-800 mb-1.5 ${labelSize}`}>
                    Current Year Closing Stock (चालु वर्षको अन्तिम मौज्दात) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">रु.</span>
                    <input
                      type="number"
                      value={trading.closingStock || ''}
                      onChange={(e) => updateField('closingStock', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 bg-white border border-emerald-400 rounded-xl font-mono font-bold text-emerald-950 text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-slate-700 mb-1.5 ${labelSize}`}>
                    Previous Year Closing Stock (अघिल्लो वर्षको अन्तिम मौज्दात)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">रु.</span>
                    <input
                      type="number"
                      value={trading.previousYearClosingStock || ''}
                      onChange={(e) => updateField('previousYearClosingStock', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Automated Results Display */}
        <div className="bg-slate-900 text-white p-6 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>AUTOMATICALLY CALCULATED TRADING RESULTS (सफ्टवेयरले तुरुन्त निकालेको हिसाब):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cost of Goods Available - Card 1 */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">
                Cost of Goods Available (उपलब्ध मालको कुल लागत)
              </span>
              <div className="text-xl font-bold font-mono text-slate-200">
                रु. {formatNPR(report.costOfGoodsAvailableCurrent)}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Opening Stock + Purchases + Freight
              </span>
            </div>

            {/* Cost of Goods Sold (COGS) - Card 2 */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">
                Cost of Goods Sold / COGS (बिक्री भएको मालको लागत)
              </span>
              <div className="text-xl font-bold font-mono text-amber-300">
                रु. {formatNPR(report.cogsCurrent)}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Goods Available - Closing Stock
              </span>
            </div>

            {/* Gross Profit - Full Width (1 Card) */}
            <div className="md:col-span-2 bg-emerald-950/80 p-5 rounded-xl border border-emerald-700">
              <span className="text-xs text-emerald-300 block mb-1 font-bold">
                GROSS PROFIT (कुल नाफा)
              </span>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                रु. {formatNPR(report.grossProfitCurrent)}
              </div>
              <span className="text-xs text-emerald-300/80 mt-1.5 block">
                Gross Profit Margin: {report.grossProfitMarginPercent.toFixed(2)}% of Sales (बिक्रीको आधारमा कुल नाफा अनुपात)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
