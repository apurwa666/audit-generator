import React from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { AppUser } from '../utils/authService';
import { AuditData, CalculatedReport } from '../types/audit';

interface AuditDashboardProps {
  currentUser: AppUser;
  data: AuditData;
  report: CalculatedReport;
  missingFields: string[];
  onOpenAudit: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value || 0));

export const AuditDashboard: React.FC<AuditDashboardProps> = ({
  currentUser,
  data,
  report,
  missingFields,
  onOpenAudit,
  onOpenAdmin,
  onLogout,
}) => {
  const clientName = data.client.entityName?.trim() || 'New audit workspace';
  const fiscalYear = data.client.currentFiscalYear?.trim() || 'Financial year not set';
  const profileReady = missingFields.length === 0;
  const hasClient = Boolean(data.client.entityName?.trim());
  const balanceStatus = report.isBalancedCurrent;

  return (
    <div className="min-h-screen bg-[#f6f7f5] text-[#18352d]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-[#e5e8e3] bg-[#efF0eb] lg:flex">
        <div className="flex h-17 items-center border-b border-[#e3e6df] px-7">
          <div className="text-[25px] font-semibold tracking-tight text-[#236d55]">Lekha<span className="text-[#18352d]">.</span></div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-[#287b60] px-4 py-3 text-sm font-semibold text-white shadow-sm">
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <button onClick={onOpenAudit} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#38534a] transition hover:bg-white">
            <BriefcaseBusiness size={18} /> Current audit
          </button>
          <button onClick={onOpenAudit} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#38534a] transition hover:bg-white">
            <FileText size={18} /> Financial report
          </button>
          {currentUser.role === 'admin' && (
            <button onClick={onOpenAdmin} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#38534a] transition hover:bg-white">
              <Settings size={18} /> Administration
            </button>
          )}
        </nav>
        <div className="border-t border-[#e3e6df] p-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8e9df] text-xs font-bold text-[#236d55]">
              {(currentUser.name || currentUser.identifier).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{currentUser.name || currentUser.identifier}</div>
              <div className="text-xs text-[#7b8982]">Audit firm workspace</div>
            </div>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#66766e] hover:bg-white hover:text-[#18352d]">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-56">
        <header className="sticky top-0 z-10 flex h-17 items-center justify-between border-b border-[#e5e8e3] bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="text-sm text-[#77847d]">Firm workspace <span className="px-2 text-[#c0c8c2]">/</span> <span className="font-medium text-[#24473a]">Dashboard</span></div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#66766e] sm:inline">{currentUser.name || currentUser.identifier}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4eee7] text-xs font-bold text-[#287b60]">{(currentUser.name || currentUser.identifier).slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <main className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-[#7b8982]">Your firm at a glance</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#17382d] sm:text-[34px]">Welcome back, {currentUser.name?.split(' ')[0] || currentUser.identifier}</h1>
              <p className="mt-2 text-sm text-[#7b8982]">Continue your audit work from where you left off.</p>
            </div>
            <button onClick={onOpenAudit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#287b60] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#21694f]">
              <Plus size={17} /> Open audit workspace
            </button>
          </div>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={<BriefcaseBusiness size={18} />} label="Current client" value={hasClient ? '1' : '0'} detail={hasClient ? 'Audit workspace in progress' : 'No client details entered yet'} />
            <MetricCard icon={<ClipboardCheck size={18} />} label="Profile details" value={profileReady ? 'Ready' : `${missingFields.length} left`} detail={profileReady ? 'Required details are present' : 'Complete required client details'} />
            <MetricCard icon={<ShieldCheck size={18} />} label="Balance sheet" value={balanceStatus ? 'Balanced' : 'Needs review'} detail={balanceStatus ? 'Current calculation balances' : 'Check the current difference'} />
            <MetricCard icon={<CalendarDays size={18} />} label="Financial year" value={data.client.currentFiscalYear || '—'} detail="Current audit period" />
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
            <section className="rounded-2xl border border-[#e3e8e2] bg-white p-5 shadow-[0_2px_8px_rgba(25,55,42,0.035)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#18382e]">Current audit workspace</h2>
                  <p className="mt-1 text-sm text-[#829087]">Your existing financial report and entry forms.</p>
                </div>
                <span className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-semibold text-[#287b60]">{data.auditTemplateType || 'D2'} format</span>
              </div>
              <div className="rounded-xl border border-[#e7ebe6] bg-[#fbfcfa] p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[#8b9890]">Client / entity</div>
                    <h3 className="text-xl font-semibold text-[#19392e]">{clientName}</h3>
                    <p className="mt-2 text-sm text-[#78867e]">{data.client.address || 'Client address not entered'}{data.client.panNo ? ` · PAN ${data.client.panNo}` : ''}</p>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs text-[#8b9890]">Financial year</div>
                    <div className="mt-1 font-semibold text-[#25483b]">{fiscalYear}</div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 border-t border-[#e8ece7] pt-4 sm:grid-cols-2">
                  <div><div className="text-xs text-[#89958e]">Accounting framework</div><div className="mt-1 text-sm font-medium text-[#385348]">{data.client.accountingStandard || 'Not selected'}</div></div>
                  <div><div className="text-xs text-[#89958e]">Client PAN</div><div className="mt-1 text-sm font-medium text-[#385348]">{data.client.panNo || 'Not entered'}</div></div>
                </div>
                <button onClick={onOpenAudit} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#cbded1] bg-white px-4 py-2.5 text-sm font-semibold text-[#287b60] transition hover:bg-[#f2f8f3]">
                  Continue audit <ArrowRight size={16} />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8a968f]">
                <span>Data is saved in this browser as you work.</span>
                <span>Report figures are calculated from the current audit entries.</span>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e3e8e2] bg-white p-5 shadow-[0_2px_8px_rgba(25,55,42,0.035)] sm:p-6">
              <h2 className="text-lg font-semibold text-[#18382e]">Quick access</h2>
              <p className="mt-1 text-sm text-[#829087]">Jump directly to a section of the audit.</p>
              <div className="mt-4 space-y-2">
                <QuickLink icon={<Users size={17} />} title="Client and auditor details" description="Firm profile, client information and format" onClick={onOpenAudit} />
                <QuickLink icon={<FileText size={17} />} title="Financial entries" description="Trading, expenses and fixed assets" onClick={onOpenAudit} />
                <QuickLink icon={<ClipboardCheck size={17} />} title="Financial statements" description="Balance sheet, tax and report preview" onClick={onOpenAudit} />
              </div>
              <div className={`mt-5 rounded-xl p-4 ${profileReady ? 'bg-[#eff8f1]' : 'bg-[#fff8e9]'}`}>
                <div className="flex items-start gap-2.5">
                  {profileReady ? <CheckCircle2 className="mt-0.5 text-[#28815f]" size={18} /> : <CircleAlert className="mt-0.5 text-[#b47a20]" size={18} />}
                  <div>
                    <div className="text-sm font-semibold text-[#29483b]">{profileReady ? 'Required profile details are complete' : 'A few details are still needed'}</div>
                    <p className="mt-1 text-xs leading-5 text-[#77877d]">{profileReady ? 'You can continue entering financial information and review the report.' : missingFields.slice(0, 3).join(' · ')}{missingFields.length > 3 ? ` · +${missingFields.length - 3} more` : ''}</p>
                    {!profileReady && <button onClick={onOpenAudit} className="mt-2 text-xs font-semibold text-[#287b60] hover:underline">Complete client details →</button>}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#e4e9e3] pt-5 text-xs text-[#89958e]">
            <span>Nepal Audit Report Software</span>
            <span>Financial year: {data.client.currentFiscalYear || 'Not set'} · {data.auditTemplateType || 'D2'} template</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; detail: string }> = ({ icon, label, value, detail }) => (
  <div className="rounded-2xl border border-[#e3e8e2] bg-white p-5 shadow-[0_2px_8px_rgba(25,55,42,0.035)]">
    <div className="mb-4 flex items-center justify-between text-[#7d8c83]"><span className="text-sm">{label}</span><span className="rounded-lg bg-[#eff5f0] p-2 text-[#287b60]">{icon}</span></div>
    <div className="text-2xl font-semibold tracking-tight text-[#19392e]">{value}</div>
    <div className="mt-1 text-xs text-[#89958e]">{detail}</div>
  </div>
);

const QuickLink: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-[#e4ebe4] hover:bg-[#f8faf7]">
    <span className="rounded-lg bg-[#eff5f0] p-2.5 text-[#287b60]">{icon}</span>
    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#29483b]">{title}</span><span className="mt-0.5 block text-xs text-[#89958e]">{description}</span></span>
    <ArrowRight size={16} className="text-[#9aa69e]" />
  </button>
);
