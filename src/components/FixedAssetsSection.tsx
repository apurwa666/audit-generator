import React from 'react';
import { AuditData, CalculatedReport, FixedAssetItem } from '../types/audit';
import { calculateFixedAssetAmounts, formatNPR, getFixedAssetAdditions } from '../utils/auditCalculations';
import { Layers, Plus, Trash2, CheckCircle2, Info } from 'lucide-react';

interface FixedAssetsSectionProps {
  data: AuditData;
  report: CalculatedReport;
  onChange: (assets: FixedAssetItem[]) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const FixedAssetsSection: React.FC<FixedAssetsSectionProps> = ({
  data,
  report,
  onChange,
  fontSize,
}) => {
  const assets = data.fixedAssets;

  const updateAsset = (id: string, field: keyof FixedAssetItem, value: any) => {
    const updated = assets.map((asset) => {
      if (asset.id === id) {
        let updatedAsset = { ...asset, [field]: value };

        // If block changed, automatically adjust standard Income Tax Act rate
        if (field === 'block') {
          if (value.includes('Block A')) updatedAsset.ratePercent = 5;
          else if (value.includes('Block B')) updatedAsset.ratePercent = 25;
          else if (value.includes('Block C')) updatedAsset.ratePercent = 20;
          else if (value.includes('Block D')) updatedAsset.ratePercent = 15;
          else if (value.includes('Block E')) updatedAsset.ratePercent = 20;
        }

        return updatedAsset;
      }
      return asset;
    });
    onChange(updated);
  };

  const addAssetRow = (presetType?: 'furniture' | 'computer' | 'vehicle' | 'machinery' | 'building') => {
    let name = 'New Asset';
    let nepaliName = 'नयाँ सम्पत्ति';
    let block: FixedAssetItem['block'] = 'Block B (25% - Furniture, Computers)';
    let rate = 25;

    if (presetType === 'furniture') {
      name = 'Furniture & Fixtures';
      nepaliName = 'फर्निचर तथा फिक्स्चर्स';
      block = 'Block B (25% - Furniture, Computers)';
      rate = 25;
    } else if (presetType === 'computer') {
      name = 'Computer and Printer';
      nepaliName = 'कम्प्युटर तथा प्रिन्टर';
      block = 'Block B (25% - Furniture, Computers)';
      rate = 25;
    } else if (presetType === 'vehicle') {
      name = 'Motor Vehicle';
      nepaliName = 'सवारी साधन / गाडी';
      block = 'Block C (20% - Vehicles)';
      rate = 20;
    } else if (presetType === 'machinery') {
      name = 'Plant & Machinery';
      nepaliName = 'यन्त्र तथा उपकरण';
      block = 'Block D (15% - Machinery, Equipments)';
      rate = 15;
    } else if (presetType === 'building') {
      name = 'Building';
      nepaliName = 'भवन / संरचना';
      block = 'Block A (5% - Building)';
      rate = 5;
    }

    const newAsset: FixedAssetItem = {
      id: `fa-${Date.now()}`,
      name,
      nepaliName,
      block,
      ratePercent: rate,
      openingBalance: 0,
      additionsFirstHalf: 0,
      additionsSecondHalf: 0,
      additionsThirdHalf: 0,
      totalAdditions: 0,
      disposalsDuringYear: 0,
      previousYearNetValue: 0,
    };
    onChange([...assets, newAsset]);
  };

  const removeAsset = (id: string) => {
    onChange(assets.filter((a) => a.id !== id));
  };

  const labelSize =
    fontSize === 'xlarge'
      ? 'text-base font-bold'
      : fontSize === 'large'
      ? 'text-sm font-semibold'
      : 'text-xs font-semibold';

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-lg p-2'
      : fontSize === 'large'
      ? 'text-base p-1.5'
      : 'text-sm p-1';

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-blue-900">
          <span className="font-bold block">
            Schedule 3: Fixed Assets Schedule under Nepal Income Tax Act, 2058 (आयकर ऐन, २०५८ बमोजिम स्थिर सम्पत्ति तथा ह्रासकट्टी)
          </span>
          All depreciation rates, depreciation amounts, and closing Net Blocks are computed automatically by the system.
          Depreciation calculated here flows directly into the Profit & Loss Account and Cash Flow Statement.
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-lg">
              Fixed Assets & Depreciation Schedule (स्थिर सम्पत्ति तथा ह्रासकट्टी तालिका)
            </h3>
          </div>

          {/* Quick Add Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Add Common (छिटो थप्नुहोस्):</span>
            <button
              onClick={() => addAssetRow('furniture')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 transition"
            >
              + Furniture (फर्निचर)
            </button>
            <button
              onClick={() => addAssetRow('computer')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 transition"
            >
              + Computer (कम्प्युटर)
            </button>
            <button
              onClick={() => addAssetRow('vehicle')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 transition"
            >
              + Vehicle (सवारी साधन)
            </button>
            <button
              onClick={() => addAssetRow('machinery')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 transition"
            >
              + Machinery (उपकरण)
            </button>
            <button
              onClick={() => addAssetRow()}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Custom (अन्य)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs font-bold">
                <th className="py-3 px-3 w-10 text-center">S.N.</th>
                <th className="py-3 px-3">Asset Description (सम्पत्तिको नाम)</th>
                <th className="py-3 px-3 w-40">Block / Category (वर्ग)</th>
                <th className="py-3 px-3 text-right w-36">Opening WDV (सुरु मौज्दात)</th>
                <th className="py-3 px-3 text-right w-32">Additions (थप)</th>
                <th className="py-3 px-3 text-right w-28">Disposal (कट्टी)</th>
                <th className="py-3 px-3 text-right w-36 bg-slate-200/50">For Depr. (कुल आधार)</th>
                <th className="py-3 px-3 text-center w-16">Rate %</th>
                <th className="py-3 px-3 text-right w-36 bg-amber-50">Depreciation (ह्रासकट्टी)</th>
                <th className="py-3 px-3 text-right w-36 bg-emerald-50">Net Block (अन्तिम बाँकी)</th>
                <th className="py-3 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {assets.map((asset, index) => {
                const figures = calculateFixedAssetAmounts(asset);
                const totalAdds = figures.additions;
                const forDepr = figures.depreciationBase;
                const deprAmount = figures.depreciation;
                const netValue = figures.netBookValue;

                return (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Asset Name & Nepali Name */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={asset.name}
                        onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                        placeholder="Asset Name (English)"
                        className="w-full font-bold text-slate-900 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded px-1 text-sm"
                      />
                      <input
                        type="text"
                        value={asset.nepaliName}
                        onChange={(e) => updateAsset(asset.id, 'nepaliName', e.target.value)}
                        placeholder="नेपाली नाम"
                        className="w-full text-slate-500 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded px-1 text-xs mt-0.5"
                      />
                    </td>

                    {/* Block selection */}
                    <td className="py-2.5 px-3">
                      <select
                        value={asset.block}
                        onChange={(e) => updateAsset(asset.id, 'block', e.target.value as any)}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-1.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Block A (5% - Building)">Block A (5% - Building)</option>
                        <option value="Block B (25% - Furniture, Computers)">Block B (25% - Furniture, Computers)</option>
                        <option value="Block C (20% - Vehicles)">Block C (20% - Vehicles)</option>
                        <option value="Block D (15% - Machinery, Equipments)">Block D (15% - Machinery, Equipments)</option>
                        <option value="Block E (Intangibles)">Block E (Intangibles)</option>
                      </select>
                    </td>

                    {/* Opening Balance */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        value={asset.openingBalance || ''}
                        onChange={(e) => updateAsset(asset.id, 'openingBalance', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`w-full text-right bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-500 rounded font-mono font-semibold text-slate-900 ${inputSize}`}
                      />
                    </td>

                    {/* Additions */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        value={asset.totalAdditions || (asset.additionsFirstHalf + asset.additionsSecondHalf + asset.additionsThirdHalf) || ''}
                        onChange={(e) => updateAsset(asset.id, 'totalAdditions', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`w-full text-right bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-500 rounded font-mono text-slate-800 ${inputSize}`}
                      />
                    </td>

                    {/* Disposals */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        value={asset.disposalsDuringYear || ''}
                        onChange={(e) => updateAsset(asset.id, 'disposalsDuringYear', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`w-full text-right bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-500 rounded font-mono text-slate-800 ${inputSize}`}
                      />
                    </td>

                    {/* Total for Depr (AUTO) */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 bg-slate-100/60">
                      रु. {formatNPR(forDepr)}
                    </td>

                    {/* Rate % */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                      {asset.ratePercent}%
                    </td>

                    {/* Depreciation Amount (AUTO) */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-900 bg-amber-50/70">
                      रु. {formatNPR(deprAmount)}
                    </td>

                    {/* Net Value / Closing (AUTO) */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900 bg-emerald-50/70">
                      रु. {formatNPR(netValue)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => removeAsset(asset.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals Row */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <td colSpan={3} className="py-3 px-3 text-right font-bold text-sm">
                  TOTAL FIXED ASSETS (कुल स्थिर सम्पत्ति):
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-800">
                  रु. {formatNPR(assets.reduce((s, a) => s + (a.openingBalance || 0), 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-800">
                  रु. {formatNPR(assets.reduce((s, a) => s + getFixedAssetAdditions(a), 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-800">
                  रु. {formatNPR(assets.reduce((s, a) => s + (a.disposalsDuringYear || 0), 0))}
                </td>
                <td className="py-3 px-3 text-right font-mono bg-slate-200/50">
                  रु. {formatNPR(
                    assets.reduce(
                      (s, a) =>
                        s + calculateFixedAssetAmounts(a).depreciationBase,
                      0
                    )
                  )}
                </td>
                <td className="py-3 px-3 text-center">-</td>
                <td className="py-3 px-3 text-right font-mono text-amber-900 bg-amber-100/70 font-bold text-base">
                  रु. {formatNPR(report.totalDepreciationCurrent)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-900 bg-emerald-100/70 font-bold text-base">
                  रु. {formatNPR(report.totalFixedAssetsNetBlockCurrent)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Summary Notice */}
        <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Net Fixed Assets Block (खुद स्थिर सम्पत्ति):{' '}
              <strong className="text-emerald-400 font-mono text-base">
                रु. {formatNPR(report.totalFixedAssetsNetBlockCurrent)}
              </strong>{' '}
              (Automatically transferred to Balance Sheet)
            </span>
          </div>
          <div>
            Total Depreciation for Year:{' '}
            <strong className="text-amber-400 font-mono text-base">
              रु. {formatNPR(report.totalDepreciationCurrent)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
