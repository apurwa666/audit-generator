import React from 'react';
import {
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  User,
  Shield,
  LogOut,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { AuditData, CalculatedReport, AuditTab } from '../types/audit';
import { formatNPR } from '../utils/auditCalculations';
import { AppUser } from '../utils/authService';

interface HeaderProps {
  currentUser: AppUser;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  data: AuditData;
  report: CalculatedReport;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onTemplateTypeChange: (type: 'D2' | 'D3') => void;
  onExportExcel: () => void;
  onPrintPreview: () => void;
  activeTab: AuditTab;
  setActiveTab: (tab: AuditTab) => void;
  isDataComplete: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenAdmin,
  data,
  report,
  fontSize,
  setFontSize,
  onTemplateTypeChange,
  onExportExcel,
  onPrintPreview,
  activeTab,
  setActiveTab,
  isDataComplete,
}) => {
  const currentFormat = data.auditTemplateType || 'D2';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Client Identification */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            लेखा
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                नेपाल अडिट रिपोर्ट सफ्टवेयर
              </h1>
              <span className="text-xs sm:text-sm px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                ICAN Compliance
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 flex items-center gap-2 mt-1">
              <span className="font-bold text-slate-900">
                {data.client.entityName ? data.client.entityName : 'नयाँ क्लाइन्ट (New Client Entry)'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-medium text-slate-800">PAN: {data.client.panNo || 'प्रविष्टि गर्न बाँकी'}</span>
              <span className="text-slate-400">•</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-900 text-xs sm:text-sm">
                ढाँचा {currentFormat}
              </span>
            </p>
          </div>
        </div>

        {/* User Badge, Admin Link, Font Sizer & Logout on the right */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 ml-auto justify-end">
          {/* Senior-Friendly Font Size Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-300" title="अक्षरको साइज मिलाउनुहोस्">
            <span className="text-xs sm:text-sm font-bold px-2 text-slate-700">अक्षर:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              सामान्य
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer ${
                fontSize === 'large' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              ठूलो
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-extrabold rounded-md transition-colors cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              XL
            </button>
          </div>

          {/* User Session Info */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs sm:text-sm text-slate-800">
            {currentUser.role === 'admin' ? (
              <Shield className="w-4 h-4 text-amber-600" />
            ) : (
              <User className="w-4 h-4 text-emerald-600" />
            )}
            <span className="font-bold">{currentUser.identifier}</span>
            <span className="text-slate-500">({currentUser.role === 'admin' ? 'Admin' : 'Auditor'})</span>
          </div>

          {/* Admin Page Link if Admin */}
          {currentUser.role === 'admin' && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
              title="Open Admin Management Panel"
            >
              <Shield className="w-4 h-4" />
              <span>प्रशासक</span>
            </button>
          )}

          {/* Vertical Divider */}
          <div className="hidden sm:block h-6 w-px bg-slate-300 mx-0.5" />

          {/* Logout Button docked on the far right */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-300 hover:border-rose-400 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs ml-auto"
            title="Sign out of the system"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>लगआउट</span>
          </button>
        </div>
      </div>

      {/* Summary Status Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base">
        <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm md:text-base">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">बिक्री आम्दानी (Sales):</span>
            <span className="font-bold font-mono text-emerald-400 text-sm sm:text-base md:text-lg">रु. {formatNPR(report.totalIncomeCurrent)}</span>
          </div>
          <div className="hidden sm:inline text-slate-600">|</div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">खुद नाफा (Net Profit):</span>
            <span className={`font-bold font-mono text-sm sm:text-base md:text-lg ${report.netProfitAfterTaxCurrent >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              रु. {formatNPR(report.netProfitAfterTaxCurrent)}
            </span>
          </div>
          <div className="hidden sm:inline text-slate-600">|</div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">ढाँचा:</span>
            <div className="inline-flex rounded-md bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => onTemplateTypeChange('D2')}
                className={`px-3 py-1 text-xs sm:text-sm rounded font-bold transition cursor-pointer ${
                  currentFormat === 'D2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                D2
              </button>
              <button
                type="button"
                onClick={() => onTemplateTypeChange('D3')}
                className={`px-3 py-1 text-xs sm:text-sm rounded font-bold transition cursor-pointer ${
                  currentFormat === 'D3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                D3
              </button>
            </div>
          </div>
        </div>

        {/* Balance Sheet Verification Indicator & Export Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {report.isBalancedCurrent ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>वासलात मिलेको छ (BS Balanced)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs sm:text-sm font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>वासलात फरक: रु. {formatNPR(report.balanceDifferenceCurrent)}</span>
            </div>
          )}

          {isDataComplete ? (
            <>
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
                title="Download complete audit report & entries as Excel (.xlsx)"
              >
                <Download className="w-4 h-4" />
                <span>एक्सेल फाइल (Excel)</span>
              </button>

              <button
                onClick={onPrintPreview}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs ${
                  activeTab === 'report'
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title="Preview Complete Audit Report and Print to PDF"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {activeTab === 'report'
                    ? 'इन्ट्रि फारममा फर्कनुहोस् (Back to Editor)'
                    : 'अन्तिम रिपोर्ट तथा PDF प्रिन्ट (View Final Report)'}
                </span>
              </button>
            </>
          ) : (
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-950/90 border border-amber-800 text-amber-300 text-xs sm:text-sm font-bold cursor-pointer hover:bg-amber-900 transition"
              title="Click to complete required entries in Step 1"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>विवरण प्रविष्टि बाँकी (Fill required entries to unlock Export)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
