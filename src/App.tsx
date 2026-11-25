import React, { useState, useMemo, useEffect } from 'react';
import { AuditData, AuditTab } from './types/audit';
import { calculateAuditReport, checkAuditDataCompleteness } from './utils/auditCalculations';
import { exportAuditToExcel } from './utils/excelExporter';
import { SAMPLE_D2_NS_STEEL, SAMPLE_D3_SAJHA_NIRMAN, BLANK_AUDIT_TEMPLATE } from './data/sampleAudits';
import { getCurrentUser, logoutUser, AppUser } from './utils/authService';

import { AuditDashboard } from './components/AuditDashboard';
import { Header } from './components/Header';
import { TabsNavigation } from './components/TabsNavigation';
import { FirmClientProfile } from './components/FirmClientProfile';
import { TradingCogsSection } from './components/TradingCogsSection';
import { DailyTransactionDaybook } from './components/DailyTransactionDaybook';
import { ExpensesSection } from './components/ExpensesSection';
import { FixedAssetsSection } from './components/FixedAssetsSection';
import { BalanceSheetInputs } from './components/BalanceSheetInputs';
import { VatReconciliationSection } from './components/VatReconciliationSection';
import { TaxComputationSection } from './components/TaxComputationSection';
import { AuditReportPreview } from './components/AuditReportPreview';
import { LoginScreen } from './components/LoginScreen';
import { AdminPage } from './components/AdminPage';

import {
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

const STORAGE_KEY = 'nepal_audit_app_current_data_v2';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getCurrentUser());
  const [showAdminPage, setShowAdminPage] = useState<boolean>(false);
  const [showDashboard, setShowDashboard] = useState<boolean>(true);

  // Font size setting (default: large for senior auditing practitioners)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [activeTab, setActiveTab] = useState<AuditTab>('profile');

  // Default to clean empty template as required by user; load saved only if custom-entered
  const [data, setData] = useState<AuditData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was the old hardcoded sample, ignore so user starts with clean empty fields
        if (parsed && parsed.client?.entityName && parsed.client.entityName !== 'N.S. Steel Furniture Center') {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse saved audit data', err);
    }
    return BLANK_AUDIT_TEMPLATE;
  });

  // Handle browser Back button when moving from dashboard to workspace
useEffect(() => {
  if (!currentUser || showDashboard || showAdminPage) return;

  // Add a browser history entry for the audit workspace
  window.history.pushState(
    { page: 'audit-workspace' },
    '',
    window.location.href
  );

  const handlePopState = () => {
    setShowDashboard(true);
    setShowAdminPage(false);
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [currentUser, showDashboard, showAdminPage]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }, [data]);

  // Instant reactive financial calculation engine
  const report = useMemo(() => calculateAuditReport(data), [data]);

  // Strict completeness check across mandatory audit entity & auditor fields
  const completenessStatus = useMemo(() => checkAuditDataCompleteness(data), [data]);
  const isDataComplete = completenessStatus.isComplete;

  // Handlers
 const handleLogout = () => {
  logoutUser();
  setCurrentUser(null);
  setShowAdminPage(false);
  setShowDashboard(true);
};

  const handleTemplateTypeChange = (type: 'D2' | 'D3') => {
    setData((prev) => ({
      ...prev,
      auditTemplateType: type,
      client: {
        ...prev.client,
        accountingStandard:
          type === 'D2'
            ? 'Nepal Accounting Standards (NAS)'
            : 'NAS for MEs (साना संस्थाको लागि नेपाल लेखामान)',
      },
    }));
  };

  const handleAuditorChange = (auditor: AuditData['auditor']) => {
    setData((prev) => ({ ...prev, auditor }));
  };

  const handleClientChange = (client: AuditData['client']) => {
    setData((prev) => ({ ...prev, client }));
  };

  const handleTradingChange = (trading: AuditData['trading']) => {
    setData((prev) => ({ ...prev, trading }));
  };

  const handleAdminExpensesChange = (adminExpenses: AuditData['adminExpenses']) => {
    setData((prev) => ({ ...prev, adminExpenses }));
  };

  const handleOtherIncomeChange = (otherIncome: AuditData['otherIncome']) => {
    setData((prev) => ({ ...prev, otherIncome }));
  };

  const handleFinanceChange = (finance: AuditData['finance']) => {
    setData((prev) => ({ ...prev, finance }));
  };

  const handleFixedAssetsChange = (fixedAssets: AuditData['fixedAssets']) => {
    setData((prev) => ({ ...prev, fixedAssets }));
  };

  const handleCapitalChange = (capital: AuditData['capital']) => {
    setData((prev) => ({ ...prev, capital }));
  };

  const handleReservesChange = (reserves: AuditData['reserves']) => {
    setData((prev) => ({ ...prev, reserves }));
  };

  const handleCurrentAssetsChange = (currentAssets: AuditData['currentAssets']) => {
    setData((prev) => ({ ...prev, currentAssets }));
  };

  const handleCurrentLiabilitiesChange = (currentLiabilities: AuditData['currentLiabilities']) => {
    setData((prev) => ({ ...prev, currentLiabilities }));
  };

  const handleNonCurrentLiabilitiesChange = (nonCurrentLiabilities: AuditData['nonCurrentLiabilities']) => {
    setData((prev) => ({ ...prev, nonCurrentLiabilities }));
  };

  const handleVatChange = (vatReconciliation: AuditData['vatReconciliation']) => {
    setData((prev) => ({ ...prev, vatReconciliation }));
  };

  const handleDaybookChange = (daybook: AuditData['daybook']) => {
    setData((prev) => ({ ...prev, daybook }));
  };

  const handleTaxSettingsChange = (taxSettings: AuditData['taxSettings']) => {
    setData((prev) => ({ ...prev, taxSettings }));
  };

  // Sample Loaders
  const loadD2Sample = () => {
    if (window.confirm('Load D2 Audit Sample (NS Steel Furniture Center)? Unsaved changes will be replaced.')) {
      setData(SAMPLE_D2_NS_STEEL);
    }
  };

  const loadD3Sample = () => {
    if (window.confirm('Load D3 Audit Sample (M/S SAJHA NIRMAN SAMAGRI SUPPLIERS)? Unsaved changes will be replaced.')) {
      setData(SAMPLE_D3_SAJHA_NIRMAN);
    }
  };

  const loadBlankTemplate = () => {
    if (window.confirm('Clear all entries and start a Blank Audit Template (नयाँ खाली फारम)?')) {
      setData(BLANK_AUDIT_TEMPLATE);
    }
  };

  const handleExportExcel = () => {
    if (!isDataComplete) {
      alert(
        'कृपया पहिले सबै आवश्यक विवरणहरू (फर्मको नाम, प्रोप्राइटर, प्यान नम्बर, लेखापरीक्षक) प्रविष्टि गर्नुहोस्। (Please enter required fields before downloading Excel).'
      );
      return;
    }
    exportAuditToExcel(data, report);
  };

  // Tab Order for Wizard Navigation
  const tabSequence: AuditTab[] = [
    'profile',
    'trading',
    'daybook',
    'expenses',
    'fixedAssets',
    'balanceSheet',
    'vat',
    'tax',
    'report',
  ];

  const currentTabIndex = tabSequence.indexOf(activeTab);
  const prevTab = currentTabIndex > 0 ? tabSequence[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabSequence.length - 1 ? tabSequence[currentTabIndex + 1] : null;

  // 1. If not logged in, show senior-friendly Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setShowDashboard(true);
          setShowAdminPage(false);
        }}
        fontSize={fontSize}
      />
    );
  }

  // 2. If Admin page requested
  if (showAdminPage) {
  return (
    <AdminPage
      currentUser={currentUser}
      onBackToAudit={() => {
        setShowAdminPage(false);
        setShowDashboard(true);
      }}
      onLogout={handleLogout}
      currentAuditData={data}
      onLoadAuditRecord={(loaded) => setData(loaded)}
    />
  );
}

// 3. Show dashboard after login
if (showDashboard) {
  return (
    <AuditDashboard
      currentUser={currentUser}
      data={data}
      report={report}
      missingFields={completenessStatus.missingFields}
      onOpenAudit={() => {
        setActiveTab('profile');
        setShowDashboard(false);
      }}
      onOpenAdmin={() => setShowAdminPage(true)}
      onLogout={handleLogout}
    />
  );
}


  // 4. Main Audit Application
  return (
    <div
      className={`audit-app-shell min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans ${
        fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdmin={() => setShowAdminPage(true)}
        data={data}
        report={report}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onTemplateTypeChange={handleTemplateTypeChange}
        onExportExcel={handleExportExcel}
        onPrintPreview={() => setActiveTab('report')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDataComplete={isDataComplete}
      />

      {/* Client Audit Info Ribbon (Clean, spacious status bar) */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          {/* Left: Audited Entity Info with generous spacing */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-slate-400 font-medium">लेखापरीक्षण भइरहेको फर्म:</span>
              <strong className="text-white font-black text-sm sm:text-base tracking-wide uppercase">
                {data.client.entityName || 'ग्राहक फर्मको नाम प्रविष्टि गर्नुहोस्'}
              </strong>
              {data.client.panNo && (
                <span className="font-mono bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded font-bold border border-slate-700">
                  PAN: {data.client.panNo}
                </span>
              )}
              {data.client.address && (
                <span className="text-slate-400 text-xs hidden md:inline">
                  • {data.client.address}
                </span>
              )}
            </div>
          </div>

          {/* Right: Fiscal Year, Template Format & Clean Reset Option */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 text-xs">आर्थिक वर्ष:</span>
              <span className="font-mono text-emerald-300 font-black text-xs sm:text-sm">
                {data.client.currentFiscalYear}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 text-xs">लेखा ढाँचा:</span>
              <span className={`px-2.5 py-0.5 rounded font-black text-xs ${
                (data.auditTemplateType || 'D2') === 'D2'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'bg-amber-900/80 text-amber-200 border border-amber-700'
              }`}>
                {(data.auditTemplateType || 'D2') === 'D2' ? 'D2 (Trading NAS)' : 'D3 (Suppliers NAS)'}
              </span>
            </div>

            <button
              onClick={loadBlankTemplate}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:border-rose-700 text-slate-300 hover:text-rose-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="नयाँ खाली फारम (Reset / Blank Audit)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>खाली फारम (Reset)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <TabsNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontSize={fontSize}
        isDataComplete={isDataComplete}
      />

      {/* Main Content Workspace */}
      <main className="audit-workspace flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">
        {activeTab === 'profile' && (
          <FirmClientProfile
            auditor={data.auditor}
            client={data.client}
            onAuditorChange={handleAuditorChange}
            onClientChange={handleClientChange}
            fontSize={fontSize}
            auditTemplateType={data.auditTemplateType || 'D2'}
            onTemplateTypeChange={handleTemplateTypeChange}
          />
        )}

        {activeTab === 'trading' && (
          <TradingCogsSection
            data={data}
            report={report}
            onChange={handleTradingChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'daybook' && (
          <DailyTransactionDaybook
            data={data}
            onChange={handleDaybookChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesSection
            data={data}
            report={report}
            onAdminExpensesChange={handleAdminExpensesChange}
            onOtherIncomeChange={handleOtherIncomeChange}
            onFinanceChange={handleFinanceChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'fixedAssets' && (
          <FixedAssetsSection
            data={data}
            report={report}
            onChange={handleFixedAssetsChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'balanceSheet' && (
          <BalanceSheetInputs
            data={data}
            report={report}
            onCapitalChange={handleCapitalChange}
            onReservesChange={handleReservesChange}
            onCurrentAssetsChange={handleCurrentAssetsChange}
            onCurrentLiabilitiesChange={handleCurrentLiabilitiesChange}
            onNonCurrentLiabilitiesChange={handleNonCurrentLiabilitiesChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'vat' && (
          <VatReconciliationSection
            data={data}
            report={report}
            onChange={handleVatChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'tax' && (
          <TaxComputationSection
            data={data}
            report={report}
            onTaxSettingsChange={handleTaxSettingsChange}
            onFinanceChange={handleFinanceChange}
            fontSize={fontSize}
          />
        )}

        {activeTab === 'report' && (
          <AuditReportPreview
            data={data}
            report={report}
            onBackToEdit={() => setActiveTab('profile')}
            onExportExcel={handleExportExcel}
            onTemplateTypeChange={handleTemplateTypeChange}
          />
        )}

        {/* Step Navigation Buttons at Bottom of Editor (Hidden when in Report or Printing) */}
        {activeTab !== 'report' && (
          <div className="mt-8 pt-6 border-t border-slate-300 flex flex-wrap items-center justify-between gap-4 no-print">
            <div>
              {prevTab && (
                <button
                  onClick={() => setActiveTab(prevTab)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>अघिल्लो खण्ड (Previous Section)</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isDataComplete ? (
                <>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-sm font-bold transition shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>एक्सेल डाउनलोड (Export Entries to Excel)</span>
                  </button>

                  {nextTab ? (
                    <button
                      onClick={() => setActiveTab(nextTab)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition shadow-sm cursor-pointer"
                    >
                      <span>अर्को खण्ड (Next Section)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('report')}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>अन्तिम प्रतिवेदन हेर्नुहोस् (View Final Report PDF)</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
                    <span>सबै आवश्यक विवरण भरिएपछि मात्र रिपोर्ट र एक्सेल डाउनलोड खुल्नेछ</span>
                  </div>

                  {nextTab && (
                    <button
                      onClick={() => setActiveTab(nextTab)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm transition shadow-sm cursor-pointer"
                    >
                      <span>अर्को खण्ड (Next Section)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div>
            नेपाल अडिट प्रतिवेदन प्रणाली • <strong>नेपाल चार्टर्ड एकाउन्टेन्ट्स संस्था (ICAN)</strong> र <strong>नेपाल लेखामान (NAS / NAS for MEs)</strong> अनुरुप
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span>आयकर ऐन, २०५८</span> • <span>मूल्य अभिवृद्धि कर ऐन, २०५२</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
