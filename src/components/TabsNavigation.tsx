import React from 'react';
import { AuditTab } from '../types/audit';
import {
  Building,
  ShoppingCart,
  BookOpen,
  Receipt,
  Layers,
  Scale,
  FileSpreadsheet,
  Calculator,
  FileCheck,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface TabsNavigationProps {
  activeTab: AuditTab;
  setActiveTab: (tab: AuditTab) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  isDataComplete?: boolean;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  setActiveTab,
  fontSize,
  isDataComplete = false,
}) => {
  const steps: {
    id: AuditTab;
    stepNumber: string;
    stepNepaliNum: string;
    english: string;
    nepali: string;
    icon: any;
    isFinal?: boolean;
  }[] = [
    {
      id: 'profile',
      stepNumber: '1',
      stepNepaliNum: '१',
      english: 'Firm & Client',
      nepali: 'फर्म र ग्राहक',
      icon: Building,
    },
    {
      id: 'trading',
      stepNumber: '2',
      stepNepaliNum: '२',
      english: 'Trading & COGS',
      nepali: 'खरिद-बिक्री मौज्दात',
      icon: ShoppingCart,
    },
    {
      id: 'daybook',
      stepNumber: '3',
      stepNepaliNum: '३',
      english: 'Daily Daybook',
      nepali: 'दैनिक कारोबार खाता',
      icon: BookOpen,
    },
    {
      id: 'expenses',
      stepNumber: '4',
      stepNepaliNum: '४',
      english: 'P&L Expenses',
      nepali: 'प्रशासनिक खर्च',
      icon: Receipt,
    },
    {
      id: 'fixedAssets',
      stepNumber: '5',
      stepNepaliNum: '५',
      english: 'Fixed Assets',
      nepali: 'स्थिर सम्पत्ति ह्रास',
      icon: Layers,
    },
    {
      id: 'balanceSheet',
      stepNumber: '6',
      stepNepaliNum: '६',
      english: 'Balance Sheet',
      nepali: 'वासलात तथा पूँजी',
      icon: Scale,
    },
    {
      id: 'vat',
      stepNumber: '7',
      stepNepaliNum: '७',
      english: 'VAT Rec',
      nepali: '१२ महिनाको भ्याट',
      icon: FileSpreadsheet,
    },
    {
      id: 'tax',
      stepNumber: '8',
      stepNepaliNum: '८',
      english: 'Tax Calc',
      nepali: 'आयकर हिसाब',
      icon: Calculator,
    },
    {
      id: 'report',
      stepNumber: '9',
      stepNepaliNum: '९',
      english: 'Final Report PDF',
      nepali: 'अन्तिम अडिट प्रतिवेदन',
      icon: FileCheck,
      isFinal: true,
    },
  ];

  const tabTextClass =
    fontSize === 'xlarge'
      ? 'text-lg font-black'
      : fontSize === 'large'
      ? 'text-base font-extrabold'
      : 'text-sm font-bold';

  return (
    <nav className="audit-step-navigation bg-white border-b border-slate-200 no-print">
      <div className="audit-step-grid max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`audit-step-button flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? step.isFinal
                    ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm font-bold ring-2 ring-amber-400/50'
                    : 'bg-emerald-700 border-emerald-800 text-white shadow-sm ring-2 ring-emerald-500/40'
                  : step.isFinal
                  ? 'border-amber-300 bg-amber-50/80 text-amber-950 hover:bg-amber-100 font-medium'
                  : 'border-slate-300 bg-slate-50/70 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              {/* Step Number Circle Badge */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                  isActive
                    ? step.isFinal
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-emerald-800 shadow-xs'
                    : step.isFinal
                    ? 'bg-amber-200 text-amber-950'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {step.stepNepaliNum}
              </div>

              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className={tabTextClass}>{step.english}</span>
                  {step.isFinal && !isDataComplete && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-extrabold">
                      अन्तिम
                    </span>
                  )}
                </div>
                <span
                  className={`block text-xs sm:text-[13px] mt-0.5 ${
                    isActive
                      ? step.isFinal
                        ? 'text-slate-950 font-bold'
                        : 'text-emerald-100 font-medium'
                      : 'text-slate-600 font-medium'
                  }`}
                >
                  ({step.nepali})
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
