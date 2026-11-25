import React from 'react';
import { AuditData, CalculatedReport, VatMonthRecord } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { FileSpreadsheet, Sparkles, CheckCircle2, Calculator, ShoppingBag, ShoppingCart } from 'lucide-react';

interface VatReconciliationSectionProps {
  data: AuditData;
  report: CalculatedReport;
  onChange: (records: VatMonthRecord[]) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const VatReconciliationSection: React.FC<VatReconciliationSectionProps> = ({
  data,
  report,
  onChange,
  fontSize,
}) => {
  const records = data.vatReconciliation;

  const updateRecord = (index: number, field: keyof VatMonthRecord, value: any) => {
    const updated = [...records];
    const numVal = parseFloat(value) || 0;

    updated[index] = {
      ...updated[index],
      [field]: numVal,
    };

    // Auto calculate 13% VAT if taxable sales or taxable purchases change
    if (field === 'taxableSales') {
      updated[index].salesVat = Math.round(numVal * 0.13 * 100) / 100;
      // Sync alias
      updated[index].vatFreeSales = updated[index].discountedSales || 0;
    }
    if (field === 'discountedSales') {
      updated[index].vatFreeSales = numVal;
    }
    if (field === 'taxablePurchase') {
      updated[index].purchaseVat = Math.round(numVal * 0.13 * 100) / 100;
      updated[index].vatFreePurchase = updated[index].discountedPurchase || 0;
    }
    if (field === 'discountedPurchase') {
      updated[index].vatFreePurchase = numVal;
    }

    onChange(updated);
  };

  const autoComputeAll13PercentVat = () => {
    const updated = records.map((r) => {
      const salesVat = Math.round((r.taxableSales || 0) * 0.13 * 100) / 100;
      const purchaseVat = Math.round((r.taxablePurchase || 0) * 0.13 * 100) / 100;
      const net = (salesVat + (r.thapGhatSalesVat || 0)) - (purchaseVat + (r.thapGhatPurchaseVat || 0));
      return {
        ...r,
        salesVat,
        purchaseVat,
        payable: r.payable !== undefined && r.payable !== 0 ? r.payable : net,
        vatFreeSales: r.discountedSales || r.vatFreeSales || 0,
        vatFreePurchase: r.discountedPurchase || r.vatFreePurchase || 0,
      };
    });
    onChange(updated);
  };

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-base p-1.5'
      : fontSize === 'large'
      ? 'text-sm p-1'
      : 'text-xs p-1';

  // Format amount with accounting brackets for negative (credit) numbers e.g. (120,284.00)
  const formatAccountingNPR = (val?: number) => {
    if (val === undefined || val === null || isNaN(val) || val === 0) return '-';
    if (val < 0) {
      return `(${formatNPR(Math.abs(val))})`;
    }
    return formatNPR(val);
  };

  // Calculate annual totals
  const totalTaxableSales = report.totalTaxableSalesVatRec || 0;
  const totalDiscountedSales =
    report.totalDiscountedSalesVatRec ?? records.reduce((s, m) => s + (m.discountedSales || m.vatFreeSales || 0), 0);
  const totalSalesOverall = totalTaxableSales + totalDiscountedSales;

  const totalSalesVat = report.totalSalesVatRec || 0;
  const totalThapGhatSalesVat =
    report.totalThapGhatSalesVatRec ?? records.reduce((s, m) => s + (m.thapGhatSalesVat || 0), 0);

  const totalTaxablePurchase = report.totalTaxablePurchaseVatRec || 0;
  const totalDiscountedPurchase =
    report.totalDiscountedPurchaseVatRec ?? records.reduce((s, m) => s + (m.discountedPurchase || m.vatFreePurchase || 0), 0);
  const totalPurchaseOverall = totalTaxablePurchase + totalDiscountedPurchase;

  const totalPurchaseVat = report.totalPurchaseVatRec || 0;
  const totalThapGhatPurchaseVat =
    report.totalThapGhatPurchaseVatRec ?? records.reduce((s, m) => s + (m.thapGhatPurchaseVat || 0), 0);

  const totalPayable = records.reduce((s, m) => s + (m.payable || 0), 0);
  const totalPaid = records.reduce((s, m) => s + (m.vatPaidToBank || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                VAT Reconciliation Statement (मासिक मूल्य अभिवृद्धि कर मिलान तालिका)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                आन्तरिक राजस्व विभाग (IRD) भ्याट रिटर्न ढाँचा अनुसार १२ महिनाको बिक्री, खरिद र कर मिलान विवरण — F.Y. {data.client.currentFiscalYear}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={autoComputeAll13PercentVat}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>१३% भ्याट तथा मिलान स्वतः हिसाब गर्नुहोस् (Auto-calculate 13% VAT)</span>
        </button>
      </div>

      {/* Main 10-Column VAT Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-base font-bold font-sans tracking-wide uppercase">
              {data.client.entityName ? data.client.entityName.toUpperCase() : 'ग्राहक कम्पनी / फर्मको नाम (Audited Entity Name)'}
            </div>
            <div className="text-xs text-slate-400 font-sans">
              {data.client.address || 'नेपाल'} • VAT RECONCILIATION • FY {data.client.currentFiscalYear}
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-md border border-slate-700">
            IRD 10-Column Format
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              {/* Row 1: Group Headers */}
              <tr className="bg-slate-800 text-white text-xs font-bold uppercase tracking-wider">
                <th rowSpan={2} className="py-3 px-3 w-40 border-r border-slate-700 bg-slate-900 text-center">
                  Month
                </th>
                <th colSpan={4} className="py-2.5 px-3 text-center border-r border-slate-700 bg-emerald-950/80">
                  Sales
                </th>
                <th colSpan={4} className="py-2.5 px-3 text-center border-r border-slate-700 bg-indigo-950/80">
                  Purchase
                </th>
                <th rowSpan={2} className="py-3 px-3 text-right w-32 border-r border-slate-700 bg-amber-950/70">
                  Payable
                </th>
                <th rowSpan={2} className="py-3 px-3 text-right w-28 bg-slate-900">
                  Paid
                </th>
              </tr>

              {/* Row 2: Sub-headers */}
              <tr className="bg-slate-700 text-slate-200 text-xs font-bold">
                {/* Sales Columns */}
                <th className="py-2 px-2.5 text-right w-32 border-r border-slate-600 bg-emerald-900/30">Taxable Value</th>
                <th className="py-2 px-2 text-right w-28 border-r border-slate-600 bg-emerald-900/40 text-emerald-300">VAT</th>
                <th className="py-2 px-2.5 text-right w-32 border-r border-slate-600 bg-emerald-900/30">Discounted Sales</th>
                <th className="py-2 px-2 text-right w-28 border-r border-slate-700 bg-emerald-900/30">Thap Ghat Sales VAT</th>

                {/* Purchase Columns */}
                <th className="py-2 px-2.5 text-right w-32 border-r border-slate-600 bg-indigo-900/30">Taxable Value</th>
                <th className="py-2 px-2 text-right w-28 border-r border-slate-600 bg-indigo-900/40 text-indigo-300">VAT</th>
                <th className="py-2 px-2.5 text-right w-32 border-r border-slate-600 bg-indigo-900/30">Discounted Purchase</th>
                <th className="py-2 px-2 text-right w-28 border-r border-slate-700 bg-indigo-900/30">Thap Ghat Purchase VAT</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-mono">
              {records.map((m, index) => {
                // Net calculated payable for hint / default
                const calculatedNet =
                  ((m.salesVat || 0) + (m.thapGhatSalesVat || 0)) -
                  ((m.purchaseVat || 0) + (m.thapGhatPurchaseVat || 0));

                return (
                  <tr
                    key={m.monthName}
                    className={index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-50'}
                  >
                    {/* Month */}
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                      <div className="flex items-center justify-between">
                        <span>{m.monthName}</span>
                        <span className="text-[11px] text-slate-500 font-normal ml-1">
                          ({m.nepaliMonth || `महिना ${index + 1}`})
                        </span>
                      </div>
                    </td>

                    {/* Sales: Taxable Value */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.taxableSales || ''}
                        onChange={(e) => updateRecord(index, 'taxableSales', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-emerald-500 text-slate-900 font-semibold ${inputSize}`}
                      />
                    </td>

                    {/* Sales: VAT (13% Auto) */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200 bg-emerald-50/30">
                      <input
                        type="number"
                        value={m.salesVat || ''}
                        onChange={(e) => updateRecord(index, 'salesVat', e.target.value)}
                        placeholder="0.00"
                        title="१३% स्वतः हिसाब हुने (Auto 13% or editable)"
                        className={`w-full text-right bg-emerald-50/50 border border-slate-200 rounded text-emerald-950 font-bold focus:border-emerald-500 ${inputSize}`}
                      />
                    </td>

                    {/* Sales: Discounted Sales */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.discountedSales !== undefined ? (m.discountedSales || '') : (m.vatFreeSales || '')}
                        onChange={(e) => updateRecord(index, 'discountedSales', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-emerald-500 text-slate-900 ${inputSize}`}
                      />
                    </td>

                    {/* Sales: Thap Ghat Sales VAT */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.thapGhatSalesVat || ''}
                        onChange={(e) => updateRecord(index, 'thapGhatSalesVat', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-emerald-500 text-slate-900 ${inputSize}`}
                      />
                    </td>

                    {/* Purchase: Taxable Value */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.taxablePurchase || ''}
                        onChange={(e) => updateRecord(index, 'taxablePurchase', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-indigo-500 text-slate-900 font-semibold ${inputSize}`}
                      />
                    </td>

                    {/* Purchase: VAT (13% Auto) */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200 bg-indigo-50/30">
                      <input
                        type="number"
                        value={m.purchaseVat || ''}
                        onChange={(e) => updateRecord(index, 'purchaseVat', e.target.value)}
                        placeholder="0.00"
                        title="१३% स्वतः हिसाब हुने (Auto 13% or editable)"
                        className={`w-full text-right bg-indigo-50/50 border border-slate-200 rounded text-indigo-950 font-bold focus:border-indigo-500 ${inputSize}`}
                      />
                    </td>

                    {/* Purchase: Discounted Purchase */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.discountedPurchase !== undefined ? (m.discountedPurchase || '') : (m.vatFreePurchase || '')}
                        onChange={(e) => updateRecord(index, 'discountedPurchase', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-indigo-500 text-slate-900 ${inputSize}`}
                      />
                    </td>

                    {/* Purchase: Thap Ghat Purchase VAT */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200">
                      <input
                        type="number"
                        value={m.thapGhatPurchaseVat || ''}
                        onChange={(e) => updateRecord(index, 'thapGhatPurchaseVat', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-indigo-500 text-slate-900 ${inputSize}`}
                      />
                    </td>

                    {/* Payable (Editable, formatted in brackets if credit) */}
                    <td className="py-1 px-1.5 text-right border-r border-slate-200 bg-amber-50/20">
                      <input
                        type="number"
                        value={m.payable !== undefined ? m.payable : (calculatedNet || '')}
                        onChange={(e) => updateRecord(index, 'payable', e.target.value)}
                        placeholder="0.00"
                        title={m.payable && m.payable < 0 ? `Credit: (${formatNPR(Math.abs(m.payable))})` : 'Payable'}
                        className={`w-full text-right bg-amber-50/40 border border-slate-200 rounded font-bold ${
                          (m.payable ?? calculatedNet) < 0 ? 'text-amber-800' : 'text-slate-900'
                        } focus:border-amber-500 ${inputSize}`}
                      />
                    </td>

                    {/* Paid */}
                    <td className="py-1 px-1.5 text-right">
                      <input
                        type="number"
                        value={m.vatPaidToBank || ''}
                        onChange={(e) => updateRecord(index, 'vatPaidToBank', e.target.value)}
                        placeholder="0.00"
                        className={`w-full text-right bg-white border border-slate-200 rounded focus:border-emerald-500 text-slate-900 ${inputSize}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Row matching the image */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800 text-xs sm:text-sm font-mono">
                <td className="py-3 px-3 font-sans font-bold text-center border-r border-slate-700 bg-slate-950">
                  Total (कुल)
                </td>

                {/* Sales Totals */}
                <td className="py-3 px-2 text-right border-r border-slate-700 text-emerald-300">
                  {formatNPR(totalTaxableSales)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-emerald-400">
                  {formatNPR(totalSalesVat)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-emerald-200">
                  {formatNPR(totalDiscountedSales)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-slate-300">
                  {formatAccountingNPR(totalThapGhatSalesVat)}
                </td>

                {/* Purchase Totals */}
                <td className="py-3 px-2 text-right border-r border-slate-700 text-indigo-300">
                  {formatNPR(totalTaxablePurchase)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-indigo-400">
                  {formatNPR(totalPurchaseVat)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-indigo-200">
                  {formatNPR(totalDiscountedPurchase)}
                </td>
                <td className="py-3 px-2 text-right border-r border-slate-700 text-slate-300">
                  {formatAccountingNPR(totalThapGhatPurchaseVat)}
                </td>

                {/* Payable & Paid Totals */}
                <td className="py-3 px-2 text-right border-r border-slate-700 text-amber-300 font-bold">
                  {formatAccountingNPR(totalPayable)}
                </td>
                <td className="py-3 px-2 text-right text-slate-300">
                  {formatAccountingNPR(totalPaid)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Two Summary Cards Matching the Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Sales During the Year */}
        <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Sales During the Year (वर्षभरिको बिक्री)
              </h3>
              <p className="text-xs text-slate-500">आन्तरिक राजस्व विभाग भ्याट विवरण अनुसार</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-sans text-slate-700 font-medium">Taxable Sales (करयोग्य बिक्री):</span>
              <span className="font-bold text-slate-900">रु. {formatNPR(totalTaxableSales)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-sans text-slate-700 font-medium">VAT Free / Discounted Sales (छुट बिक्री):</span>
              <span className="font-bold text-slate-900">रु. {formatNPR(totalDiscountedSales)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950">
              <span className="font-sans font-bold">Total Sales (कुल बिक्री):</span>
              <span className="font-black text-lg sm:text-xl text-emerald-900">
                रु. {formatNPR(totalSalesOverall)}
              </span>
            </div>
          </div>
        </div>

        {/* Box 2: Purchases During the Year */}
        <div className="bg-white rounded-2xl border-2 border-indigo-600/30 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-200">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Purchases During the Year (वर्षभरिको खरिद)
              </h3>
              <p className="text-xs text-slate-500">आन्तरिक राजस्व विभाग भ्याट विवरण अनुसार</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-sans text-slate-700 font-medium">Taxable Purchase (करयोग्य खरिद):</span>
              <span className="font-bold text-slate-900">रु. {formatNPR(totalTaxablePurchase)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-sans text-slate-700 font-medium">VAT Free / Discounted Purchase (छुट खरिद):</span>
              <span className="font-bold text-slate-900">रु. {formatNPR(totalDiscountedPurchase)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-950">
              <span className="font-sans font-bold">Total Purchase (कुल खरिद):</span>
              <span className="font-black text-lg sm:text-xl text-indigo-900">
                रु. {formatNPR(totalPurchaseOverall)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
