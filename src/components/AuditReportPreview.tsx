import React from 'react';
import { AuditData, CalculatedReport } from '../types/audit';
import { calculateFixedAssetAmounts, formatNPR, checkAuditDataCompleteness, getFixedAssetAdditions } from '../utils/auditCalculations';
import { Printer, Download, ArrowLeft, CheckCircle2, FileText, Stamp, AlertTriangle, Lock } from 'lucide-react';

interface AuditReportPreviewProps {
  data: AuditData;
  report: CalculatedReport;
  onBackToEdit: () => void;
  onExportExcel: () => void;
  onTemplateTypeChange?: (type: 'D2' | 'D3') => void;
}

export const AuditReportPreview: React.FC<AuditReportPreviewProps> = ({
  data,
  report,
  onBackToEdit,
  onExportExcel,
  onTemplateTypeChange,
}) => {
  const completeness = checkAuditDataCompleteness(data);
  const isDataComplete = completeness.isComplete;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    onExportExcel();
  };

  const currentFormat = data.auditTemplateType || 'D2';
  const currentFY = data.client.currentFiscalYear;
  const prevFY = data.client.previousFiscalYear;
  const asAtDate = data.client.reportingPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Missing Data Warning Alert (if incomplete) */}
      {!isDataComplete && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-5 text-amber-900 shadow-sm no-print">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 mt-1">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h4 className="font-bold text-base">
                  आवश्यक विवरण प्रविष्टि बाँकी छ (Complete Required Entries First)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  अडिट प्रतिवेदन पूर्ण र आधिकारिक बनाउनका लागि तथा PDF/एक्सेल डाउनलोड गर्न निम्न विवरणहरू अनिवार्य रुपमा भरिनुपर्छ:
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {completeness.missingFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-200/90 text-amber-950 text-xs font-semibold rounded-md border border-amber-300"
                    >
                      • {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onBackToEdit}
              className="px-5 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              चरण १ मा विवरण भर्न जानुहोस् ➡️
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Bar (hidden when printing) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 no-print sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>इन्ट्रि फारममा फर्कनुहोस् (Back to Editor)</span>
          </button>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span>आधिकारिक नेपाल अडिट प्रतिवेदन (Official Nepal Audit Report)</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                currentFormat === 'D2' ? 'bg-emerald-800 text-emerald-200' : 'bg-amber-800 text-amber-200'
              }`}>
                ढाँचा {currentFormat} ({currentFormat === 'D2' ? 'व्यापारिक / NAS' : 'निर्माण सप्लायर्स / NAS for MEs'})
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              गाता, पेश पत्र, अनुक्रमणिका, विस्तृत लेखापरीक्षक प्रतिवेदन, वासलात तथा अनुसूचीहरू
            </p>
          </div>
        </div>

        {/* Template Switcher & Actions */}
        <div className="flex items-center flex-wrap gap-3">
          {onTemplateTypeChange && (
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 px-1 text-[11px]">ढाँचा:</span>
              <button
                type="button"
                onClick={() => onTemplateTypeChange('D2')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  currentFormat === 'D2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                D2
              </button>
              <button
                type="button"
                onClick={() => onTemplateTypeChange('D3')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  currentFormat === 'D3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                D3
              </button>
            </div>
          )}

          {isDataComplete ? (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer"
                title="Download full audit report & entries as Excel (.xlsx)"
              >
                <Download className="w-4 h-4" />
                <span>Excel फाइल डाउनलोड (.xlsx)</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>अन्तिम रिपोर्ट प्रिन्ट / PDF सेभ गर्नुहोस्</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-950/90 border border-amber-700 text-amber-300 text-xs font-semibold">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>विवरण अपूर्ण (Export & PDF locked until entries are filled)</span>
            </div>
          )}
        </div>
      </div>

      {/* THE PRINTABLE AUDIT REPORT DOCUMENT */}
      <div className="bg-white text-slate-900 shadow-xl border border-slate-300 mx-auto max-w-[850px] p-8 md:p-12 font-serif text-[13px] leading-relaxed">
        
        {/* ================= PAGE 1: OFFICIAL COVER PAGE (शीर्ष गाता पृष्ठ) ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div className="h-full border-4 border-double border-slate-900 p-8 md:p-12 flex flex-col justify-between min-h-[980px]">
            {/* Top Seal / Emblem Header */}
            <div className="text-center pt-4">
              <div className="inline-block border-2 border-slate-900 rounded-full px-6 py-1.5 font-bold tracking-widest uppercase text-xs text-slate-900 mb-6">
                नेपाल सरकार • आन्तरिक राजस्व विभाग प्रयोजनार्थ
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-slate-950 font-serif">
                AUDIT REPORT
              </h1>
              <p className="text-base font-semibold text-slate-700 uppercase tracking-widest mt-1">
                (लेखापरीक्षण प्रतिवेदन)
              </p>
              <div className="w-24 h-1 bg-slate-900 mx-auto my-4" />
              <p className="text-xs uppercase tracking-widest text-slate-600 font-medium">
                On the Audit of Financial Statements of
              </p>
            </div>

            {/* Client Entity Main Display Box */}
            <div className="text-center my-6 py-6 px-4 bg-slate-50 border-2 border-slate-800 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-slate-950 font-serif tracking-tight">
                {data.client.entityName || '[ENTERPRISE / FIRM NAME]'}
              </h2>
              <p className="text-sm font-semibold text-slate-800 mt-2">
                {data.client.address || '[Firm Registered Address]'}
              </p>
              <div className="mt-4 inline-flex items-center gap-4 text-xs font-mono font-bold bg-white px-4 py-2 border border-slate-400 rounded-lg shadow-2xs">
                <span>स्थायी लेखा नं. (PAN): <strong>{data.client.panNo || 'N/A'}</strong></span>
                {data.client.regdNo && (
                  <>
                    <span>•</span>
                    <span>दर्ता नं. (Regd): <strong>{data.client.regdNo}</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Fiscal Year & Standard */}
            <div className="text-center space-y-2">
              <div className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm tracking-wide">
                FOR THE FISCAL YEAR : {currentFY}
              </div>
              <p className="text-xs text-slate-700 font-medium">
                आर्थिक वर्ष: <strong>{currentFY}</strong> (कर निर्धारण वर्ष: <strong>{currentFY ? `20${parseInt(currentFY.slice(0, 2)) + 1}/${parseInt(currentFY.slice(5)) + 1}` : '2082/083'}</strong>)
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Prepared in accordance with {data.client.accountingStandard}
              </p>
            </div>

            {/* Bottom Auditor Seal Box or Management / Proprietor Submission Box (if D2 without auditor) */}
            {data.auditor.firmName || currentFormat === 'D3' ? (
              <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-600 tracking-wider">AUDITOR (लेखापरीक्षक):</p>
                  <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mt-1">
                    {data.auditor.firmName || '[Auditor Firm Name]'}
                  </h3>
                  <p className="text-xs text-slate-800 font-semibold">{data.auditor.membershipClass}</p>
                  <p className="text-xs text-slate-700">ICAN Regd. No: {data.auditor.icanRegdNo} • COP No: {data.auditor.copNo}</p>
                  <p className="text-xs text-slate-700">PAN No: {data.auditor.panNo}</p>
                  <p className="text-xs text-slate-600">{data.auditor.address}</p>
                </div>

                <div className="border-2 border-slate-800 rounded-full w-28 h-28 flex flex-col items-center justify-center text-center p-1 text-[9px] font-sans font-bold text-slate-800 rotate-[-5deg]">
                  <div className="text-[7px] uppercase tracking-tighter">ICAN REGISTERED</div>
                  <div className="text-[11px] font-extrabold my-0.5">{data.auditor.icanRegdNo || 'RA5613'}</div>
                  <div className="text-[7px] uppercase tracking-tighter">AUDITOR</div>
                  <div className="text-[6px] text-slate-500 mt-0.5">NEPAL</div>
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-600 tracking-wider">व्यवस्थापन तथा प्रोप्राइटर (MANAGEMENT / PROPRIETOR):</p>
                  <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mt-1">
                    {data.client.entityName}
                  </h3>
                  <p className="text-xs text-slate-800 font-semibold">{data.client.proprietorName} (Proprietor)</p>
                  <p className="text-xs text-slate-700">स्थायी लेखा नम्बर (PAN): {data.client.panNo}</p>
                  <p className="text-xs text-slate-600">{data.client.address}</p>
                </div>

                <div className="border-2 border-slate-800 rounded-xl p-3 text-center min-w-36">
                  <div className="text-[11px] font-extrabold text-slate-900 uppercase">ढाँचा D-2</div>
                  <div className="text-[10px] text-slate-600 font-semibold">व्यवस्थापन प्रतिवेदन</div>
                  <div className="text-[9px] text-emerald-800 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    आन्तरिक राजस्व विभाग
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 2: TRANSMITTAL LETTER & TABLE OF CONTENTS ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div>
            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
                  {data.auditor.firmName}
                </h1>
                <p className="text-xs text-slate-700">ICAN Regd. No. {data.auditor.icanRegdNo} • COP No: {data.auditor.copNo}</p>
                <p className="text-xs text-slate-600">{data.auditor.address} • PAN: {data.auditor.panNo}</p>
              </div>
              <div className="text-right text-xs">
                <p><strong>Date (मिति):</strong> {data.auditor.reportDate || '2082-04-10'}</p>
                <p><strong>Place (स्थान):</strong> {data.auditor.reportPlace || 'Kathmandu, Nepal'}</p>
              </div>
            </div>

            {/* Letter of Transmittal to Proprietor */}
            <div className="mb-6 text-xs leading-relaxed text-slate-900 space-y-2.5">
              <div>
                <p className="font-semibold">To,</p>
                <p className="font-bold text-sm text-slate-950 uppercase">The Proprietor / सञ्चालक,</p>
                <p className="font-bold text-slate-900 uppercase">{data.client.entityName}</p>
                <p className="text-slate-700">{data.client.address}</p>
                <p className="text-slate-700 font-mono">PAN: {data.client.panNo}</p>
              </div>

              <div className="pt-1">
                <p className="font-bold underline uppercase tracking-wide">
                  Subject: Submission of the Independent Auditor's Report for the Fiscal Year {currentFY}
                </p>
                <p className="italic text-slate-600">(विषय: आर्थिक वर्ष {currentFY} को लेखापरीक्षण प्रतिवेदन पेश गरिएको सम्बन्धमा।)</p>
              </div>

              <p className="text-justify pt-1">
                Dear Sir / Madam,
              </p>
              <p className="text-justify">
                In accordance with the terms of our engagement, we have completed the statutory audit of the accompanying financial statements of <strong>{data.client.entityName}</strong> for the fiscal year <strong>{currentFY}</strong>, which comprise the Statement of Financial Position (Balance Sheet) as at <strong>{asAtDate}</strong>, the Statement of Profit or Loss (Profit & Loss Account), the Statement of Cash Flows, Statement of Changes in Equity, together with the Accounting Policies and Schedules 1 through 7 for the period then ended.
              </p>
              <p className="text-justify">
                We have pleasure in submitting herewith one set of the audited financial statements together with our Independent Auditor's Report thereon for your kind perusal and onward transmission to the Inland Revenue Department (IRD) and other regulatory bodies.
              </p>
              <p className="text-justify">
                We take this opportunity to place on record our sincere appreciation to the proprietor, management, and staff of {data.client.entityName} for their kind cooperation and courtesy extended to our audit team during the course of the audit.
              </p>
              <p>
                Thanking you,<br />
                Yours faithfully,
              </p>

              <div className="pt-2 flex justify-between items-end">
                <div>
                  <div className="w-40 border-b border-slate-900 mb-1 pb-4 italic text-[11px] text-slate-400">
                    [Auditor Signature]
                  </div>
                  <p className="font-bold text-xs">{data.auditor.auditorName}</p>
                  <p className="text-[11px] text-slate-700">{data.auditor.membershipClass}</p>
                  <p className="text-[11px] text-slate-600">For: {data.auditor.firmName}</p>
                </div>
              </div>
            </div>

            {/* Table of Contents / Index */}
            <div className="mt-6 pt-4 border-t-2 border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-center underline underline-offset-4 mb-3 text-slate-950">
                TABLE OF CONTENTS / अनुक्रमणिका
              </h3>
              <table className="w-full border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                    <th className="py-1.5 px-3 text-center border-r border-slate-800 w-12">क्र.सं.</th>
                    <th className="py-1.5 px-3 text-left border-r border-slate-800">विवरण (Particulars of Statement / Schedule)</th>
                    <th className="py-1.5 px-3 text-center border-r border-slate-800 w-28">मापदण्ड (Standard)</th>
                    <th className="py-1.5 px-3 text-center w-20">पृष्ठ नं.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">१</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">गाता तथा पेश पत्र (Cover Page & Transmittal Letter)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">General</td>
                    <td className="py-1 px-3 text-center font-mono">1 - 2</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">२</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">स्वतन्त्र लेखापरीक्षकको प्रतिवेदन (Independent Auditor's Report)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">NSA 700</td>
                    <td className="py-1 px-3 text-center font-mono">3 - 4</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">३</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">वासलात / वित्तीय अवस्थाको विवरण (Statement of Financial Position - Balance Sheet)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">{currentFormat === 'D3' ? 'NAS for MEs' : 'NAS'}</td>
                    <td className="py-1 px-3 text-center font-mono">5</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">४</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">व्यापार हिसाब (Trading Account / Statement of Cost of Sales)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">Direct Costing</td>
                    <td className="py-1 px-3 text-center font-mono">6</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">५</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">नाफा नोक्सान हिसाब (Statement of Profit or Loss / P&L Account)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">{currentFormat === 'D3' ? 'NAS for MEs' : 'NAS'}</td>
                    <td className="py-1 px-3 text-center font-mono">7</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">६</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">नगद प्रवाह विवरण (Statement of Cash Flows)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">Direct Method</td>
                    <td className="py-1 px-3 text-center font-mono">8</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">७</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">स्वामित्व पूँजीमा परिवर्तन सम्बन्धी विवरण (Statement of Changes in Equity)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">{currentFormat === 'D3' ? 'NAS for MEs' : 'NAS'}</td>
                    <td className="py-1 px-3 text-center font-mono">9</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">८</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">स्थिर सम्पत्ति तथा ह्रासकट्टी विवरण (Schedule 4: Fixed Assets Schedule)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">Income Tax Act</td>
                    <td className="py-1 px-3 text-center font-mono">10</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">९</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">वित्तीय विवरणका सम्बन्धित विस्तृत अनुसूचीहरू १ देखि १२ (Detailed Schedules 1 to 12)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">Disclosures</td>
                    <td className="py-1 px-3 text-center font-mono">11 - 12</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">१०</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">आयकर ऐन, २०५८ बमोजिम कर योग्य आय तथा कर दायित्व गणना विवरण (Tax Computation)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">Income Tax Act</td>
                    <td className="py-1 px-3 text-center font-mono">13</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">११</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">महत्वपूर्ण लेखा नीतिहरू तथा व्याख्यात्मक टिप्पणीहरू (Accounting Policies & Notes)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">{currentFormat === 'D3' ? 'NAS for MEs' : 'NAS'}</td>
                    <td className="py-1 px-3 text-center font-mono">14 - 15</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-center border-r border-slate-800 font-mono">१२</td>
                    <td className="py-1 px-3 border-r border-slate-800 font-semibold">मासिक मूल्य अभिवृद्धि कर मिलान तालिका (12-Month VAT Reconciliation)</td>
                    <td className="py-1 px-3 text-center border-r border-slate-800 text-slate-600">VAT Act 2052</td>
                    <td className="py-1 px-3 text-center font-mono">16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 3: INDEPENDENT AUDITOR'S REPORT (PART 1) ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            {/* Auditor Letterhead Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-sans uppercase">
                  {data.auditor.firmName || 'Narayan Sedhai Associates'}
                </h1>
                <p className="text-xs text-slate-700 font-sans mt-0.5">
                  ICAN Regd. No. {data.auditor.icanRegdNo || 'RA5613'} • COP No: {data.auditor.copNo || '858 "C"'}
                </p>
                <p className="text-xs text-slate-700 font-sans">
                  PAN No. {data.auditor.panNo || '300732063'} • {data.auditor.membershipClass || 'Registered Auditor'}
                </p>
                <p className="text-xs text-slate-600 font-sans">{data.auditor.address || 'Kathmandu, Nepal'}</p>
              </div>

              {/* Official Seal / ICAN Registered Stamp */}
              <div className="border-2 border-slate-800 rounded-full w-24 h-24 flex flex-col items-center justify-center text-center p-1 text-[9px] font-sans font-bold text-slate-800 rotate-[-8deg] opacity-85">
                <div className="text-[7px] uppercase tracking-tighter">ICAN REGISTERED</div>
                <div className="text-[10px] font-extrabold my-0.5">{data.auditor.icanRegdNo}</div>
                <div className="text-[7px] uppercase tracking-tighter">AUDITOR</div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-4">
              <h2 className="text-lg font-bold tracking-wider uppercase underline underline-offset-4 font-sans text-slate-950">
                INDEPENDENT AUDITOR'S REPORT
              </h2>
              <p className="text-xs font-sans text-slate-600 mt-1">
                To the Proprietor of <strong>{data.client.entityName}</strong>
              </p>
            </div>

            {/* Opinion Paragraph */}
            <div className="space-y-3.5 text-justify text-xs leading-relaxed">
              <div>
                <h3 className="font-bold font-sans text-slate-950 text-sm mb-1 uppercase tracking-wide">
                  Opinion (लेखापरीक्षण राय)
                </h3>
                <p>
                  We have audited the accompanying financial statements of <strong>{data.client.entityName}</strong> (PAN: {data.client.panNo}), which comprise the Statement of Financial Position as at <strong>{asAtDate}</strong>, the Statement of Profit or Loss, the Statement of Cash Flows, Statement of Changes in Equity, related schedules and explanatory notes for the year then ended.
                </p>
                <p className="mt-2 font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
                  {data.auditorReportOptions.customOpinionText ||
                    (currentFormat === 'D3'
                      ? `In our opinion, the accompanying financial statements present fairly, in all material respects, the financial position of ${data.client.entityName} as at ${asAtDate}, and of its financial performance and its cash flows for the year then ended in accordance with Nepal Accounting Standard for Micro Entities (NAS for MEs).`
                      : `In our opinion, the accompanying financial statements give a true and fair view of the financial position of ${data.client.entityName} as at ${asAtDate}, and of its financial performance and its cash flows for the year then ended in accordance with Nepal Accounting Standards (NAS).`)}
                </p>
              </div>

              <div>
                <h3 className="font-bold font-sans text-slate-950 text-sm mb-1 uppercase tracking-wide">
                  Basis for Opinion (रायको आधार)
                </h3>
                <p>
                  We conducted our audit in accordance with <strong>Nepal Standards on Auditing (NSAs)</strong>. Our responsibilities under those standards are further described in the <em>Auditor's Responsibilities for the Audit of the Financial Statements</em> section of our report. We are independent of the entity in accordance with the <strong>Code of Ethics for Professional Accountants</strong> issued by the Institute of Chartered Accountants of Nepal (ICAN), and we have fulfilled our other ethical responsibilities in accordance with these requirements. We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our audit opinion.
                </p>
              </div>

              {/* Emphasis of Matter (Crucial for D3 Audits - Section 14 Interest limitation) */}
              {currentFormat === 'D3' && (
                <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg">
                  <h3 className="font-bold font-sans text-amber-950 text-sm mb-1 uppercase tracking-wide">
                    Emphasis of Matter (ब्याज तथा दफा १४ सम्बन्धी विशेष ध्यानाकर्षण)
                  </h3>
                  <p className="text-amber-950">
                    We draw attention to Note 6 of the financial statements, which explains that loan interest amounting to रु. {formatNPR(data.finance.disallowedInterestSec14 || 1734759.91)} has been disallowed for current year tax assessment under Section 14(2) of the Income Tax Act, 2058, and has been carried forward in accordance with the provisions of the Act. Our opinion is not modified in respect of this matter.
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-bold font-sans text-slate-950 text-sm mb-1 uppercase tracking-wide">
                  Responsibilities of Management for the Financial Statements (व्यवस्थापनको जिम्मेवारी)
                </h3>
                <p>
                  Management is responsible for the preparation and fair presentation of the financial statements in accordance with <strong>{data.client.accountingStandard}</strong>, and for such internal control as management determines is necessary to enable the preparation of financial statements that are free from material misstatement, whether due to fraud or error. In preparing the financial statements, management is responsible for assessing the entity's ability to continue as a going concern, disclosing, as applicable, matters related to going concern and using the going concern basis of accounting.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-500">
            <span>{data.client.entityName} • F.Y. {currentFY}</span>
            <span>Page 3 of Audit Report</span>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 4: INDEPENDENT AUDITOR'S REPORT (PART 2) ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            {/* Header Mini Letterhead */}
            <div className="border-b border-slate-400 pb-2 mb-6 flex justify-between items-center text-xs font-sans">
              <span className="font-bold uppercase text-slate-950">{data.auditor.firmName}</span>
              <span className="text-slate-600">INDEPENDENT AUDITOR'S REPORT (CONTD.)</span>
            </div>

            <div className="space-y-4 text-justify text-xs leading-relaxed">
              <div>
                <h3 className="font-bold font-sans text-slate-950 text-sm mb-1 uppercase tracking-wide">
                  Auditor's Responsibilities for the Audit of the Financial Statements (लेखापरीक्षकको उत्तरदायित्व)
                </h3>
                <p>
                  Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's report that includes our opinion. Reasonable assurance is a high level of assurance, but is not a guarantee that an audit conducted in accordance with NSAs will always detect a material misstatement when it exists. Misstatements can arise from fraud or error and are considered material if, individually or in the aggregate, they could reasonably be expected to influence the economic decisions of users taken on the basis of these financial statements.
                </p>
                <p className="mt-2">
                  As part of an audit in accordance with NSAs, we exercise professional judgment and maintain professional skepticism throughout the audit. We also:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-800">
                  <li>Identify and assess the risks of material misstatement of the financial statements, whether due to fraud or error, design and perform audit procedures responsive to those risks, and obtain audit evidence that is sufficient and appropriate.</li>
                  <li>Obtain an understanding of internal control relevant to the audit in order to design audit procedures that are appropriate in the circumstances.</li>
                  <li>Evaluate the appropriateness of accounting policies used and the reasonableness of accounting estimates and related disclosures made by management.</li>
                  <li>Conclude on the appropriateness of management's use of the going concern basis of accounting.</li>
                </ul>
              </div>

              {/* Legal and Regulatory Requirements */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <h3 className="font-bold font-sans text-slate-950 text-sm mb-1.5 uppercase tracking-wide">
                  Report on Other Legal and Regulatory Requirements (अन्य कानूनी तथा नियमनकारी व्यवस्थाहरु)
                </h3>
                <p className="mb-2">
                  As required by the prevailing laws of Nepal, including the <strong>Income Tax Act, 2058</strong>, the <strong>Value Added Tax Act, 2052</strong>, and relevant guidelines of ICAN, we report that:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-800">
                  <li>We have obtained all the information and explanations which, to the best of our knowledge and belief, were necessary for the purpose of our audit.</li>
                  <li>In our opinion, proper books of accounts as required by law have been kept by the firm so far as appears from our examination of those books.</li>
                  <li>The Statement of Financial Position, Statement of Profit or Loss, Statement of Cash Flows, and Statement of Changes in Equity dealt with by this report are in agreement with the books of account.</li>
                  <li>In our opinion and to the best of our information and according to explanations given to us, the operations of the firm were conducted within its jurisdiction and we have not come across cases where the firm has acted contrary to legal provisions relating to accounts or committed any misappropriation or caused loss or damage to the enterprise.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Date, Place, UDIN and Signature Footer */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 flex justify-between items-end font-sans">
            <div>
              <p className="text-xs">
                <strong>Date (मिति):</strong> {data.auditor.reportDate || '2082-04-10'}
              </p>
              <p className="text-xs">
                <strong>Place (स्थान):</strong> {data.auditor.reportPlace || 'Kathmandu, Nepal'}
              </p>
              <div className="mt-3 p-2 bg-slate-100 rounded border border-slate-300 font-mono text-xs font-bold text-slate-900">
                UDIN Number: {data.auditor.udinNumber || '260424RA05613ePvas'}
              </div>
            </div>

            <div className="text-center">
              <div className="w-52 border-b-2 border-slate-900 mb-2 pb-8 italic text-xs text-slate-400">
                [Authorized Auditor Signature & Seal]
              </div>
              <p className="font-bold text-sm text-slate-950">{data.auditor.auditorName}</p>
              <p className="text-xs text-slate-800 font-semibold">{data.auditor.membershipClass}</p>
              <p className="text-xs text-slate-700">ICAN Regd. No: {data.auditor.icanRegdNo} • COP: {data.auditor.copNo}</p>
              <p className="text-xs text-slate-700 font-medium">For: {data.auditor.firmName}</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 2: STATEMENT OF FINANCIAL POSITION (BALANCE SHEET) ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                Statement of Financial Position (Balance Sheet / वासलात)
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">As at {asAtDate}</p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-slate-800 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                  <th className="py-2 px-2 text-center border-r border-slate-800 w-20">Schedule</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">F.Y. {currentFY} (रु.)</th>
                  <th className="py-2 px-3 text-right w-36">F.Y. {prevFY} (रु.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                {/* Capital & Liabilities */}
                <tr className="bg-slate-50 font-sans font-bold text-slate-950">
                  <td colSpan={4} className="py-1.5 px-3 border-r border-slate-800">
                    Capital & Liabilities (पूँजी तथा दायित्व)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Proprietor's Fund (स्वामित्व पूँजी)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">1</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.capital.openingCapital)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.capital.previousYearCapital)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Additional Investment (थप लगानी)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.capital.additionalInvestment)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.capital.previousYearAdditional)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Reserve and Surplus (जगेडा तथा कोष)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">2</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.closingReservesAndSurplusCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.closingReservesAndSurplusPrevious)}</td>
                </tr>
                {data.nonCurrentLiabilities.longTermBankLoans > 0 && (
                  <tr>
                    <td className="py-1 px-3 border-r border-slate-800 font-sans">Long Term Loans & Borrowings</td>
                    <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                    <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.nonCurrentLiabilities.longTermBankLoans)}</td>
                    <td className="py-1 px-3 text-right">{formatNPR(data.nonCurrentLiabilities.previousYearLongTermBankLoans)}</td>
                  </tr>
                )}
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">
                    Total Capital & Long-Term Liabilities
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">
                    {formatNPR(report.totalLiabilitiesAndEquityCurrent)}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold">
                    {formatNPR(report.totalLiabilitiesAndEquityPrevious)}
                  </td>
                </tr>

                {/* Assets */}
                <tr className="bg-slate-50 font-sans font-bold text-slate-950">
                  <td colSpan={4} className="py-1.5 px-3 border-r border-slate-800">
                    Assets (सम्पत्ति)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">
                    Fixed Assets Net Block (स्थिर सम्पत्ति खुद मौज्दात)
                  </td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">3</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalFixedAssetsNetBlockCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.totalFixedAssetsNetBlockPrevious)}</td>
                </tr>

                {/* Current Assets */}
                <tr className="font-sans font-semibold text-slate-800">
                  <td colSpan={4} className="py-1 px-3 bg-slate-50 border-r border-slate-800 text-[11px]">
                    Current Assets, Advance & Deposits (चालु सम्पत्ति तथा पेश्की)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Cash/Bank Balance (नगद/बैंक मौज्दात)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">4</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.currentAssets.cashAndBank)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Inventory (अन्तिम मौज्दात)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.trading.closingStock)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.trading.previousYearClosingStock)}</td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Debtors & Receivables (असामीहरु)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">5</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.currentAssets.sundryDebtors)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearSundryDebtors)}</td>
                </tr>
                {data.currentAssets.vatReceivable > 0 && (
                  <tr>
                    <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">VAT Receivable (लिनुपर्ने भ्याट)</td>
                    <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                    <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.currentAssets.vatReceivable)}</td>
                    <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearVatReceivable)}</td>
                  </tr>
                )}
                {data.currentAssets.advanceIncomeTax > 0 && (
                  <tr>
                    <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Advance Income Tax (अग्रिम आयकर)</td>
                    <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                    <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(data.currentAssets.advanceIncomeTax)}</td>
                    <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearAdvanceIncomeTax)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Total Current Assets (A)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalCurrentAssetsCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.totalCurrentAssetsPrevious)}</td>
                </tr>

                {/* Current Liabilities */}
                <tr className="font-sans font-semibold text-slate-800">
                  <td colSpan={4} className="py-1 px-3 bg-slate-50 border-r border-slate-800 text-[11px]">
                    Current Liabilities & Provisions (चालु दायित्व तथा व्यवस्थाहरु)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Accounts Payable & Provisions</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans">6</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalCurrentLiabilitiesCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.totalCurrentLiabilitiesPrevious)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Total Current Liabilities (B)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalCurrentLiabilitiesCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.totalCurrentLiabilitiesPrevious)}</td>
                </tr>

                {/* Net Current Assets */}
                <tr className="bg-slate-100 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Net Current Assets (A - B)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.netCurrentAssetsCurrent)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.netCurrentAssetsPrevious)}</td>
                </tr>

                {/* Total Assets */}
                <tr className="bg-slate-200 font-bold text-slate-950 border-t-2 border-b-2 border-slate-900 text-sm">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">
                    TOTAL ASSETS (Net Block + Net Current Assets)
                  </td>
                  <td className="py-2 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-bold">
                    {formatNPR(report.totalAssetsCurrent)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold">
                    {formatNPR(report.totalAssetsPrevious)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[11px] font-sans text-slate-600 mt-2">
              Schedule 1 to 6 are attached to and form an integral part of this Financial Statement.
            </p>
          </div>

          {/* Standard Two-party Signatures */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature & Stamp]
              </div>
              <p className="font-bold text-xs uppercase">{data.client.proprietorName}</p>
              <p className="text-[11px] text-slate-600">Proprietor / सञ्चालक</p>
              <p className="text-[10px] text-slate-500">{data.client.entityName}</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500 mb-6 italic">As per our report of even date</p>
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature & ICAN Seal]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[11px] text-slate-600">Registered Auditor (ICAN: {data.auditor.icanRegdNo})</p>
              <p className="text-[10px] text-slate-500">(For: {data.auditor.firmName})</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 4: TRADING ACCOUNT ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm text-slate-700">{data.client.address}</p>
              <p className="text-xs text-slate-600 font-mono">PAN: {data.client.panNo}</p>
              <h3 className="text-base font-bold underline underline-offset-4 mt-2 uppercase">
                Trading Account / Statement of Cost of Sales (व्यापार हिसाब)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">For the year ended {asAtDate} (F.Y. {currentFY})</p>
            </div>

            <table className="w-full border-collapse border border-slate-800 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                  <th className="py-2 px-2 text-center border-r border-slate-800 w-20">Schedule</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">F.Y. {currentFY} (रु.)</th>
                  <th className="py-2 px-3 text-right w-36">F.Y. {prevFY} (रु.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Opening Stock of Goods (सुरु मौज्दात)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.trading.openingStock)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(data.trading.previousYearOpeningStock)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Add: Purchases during the year (वर्षभरिको खरिद)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.trading.purchases)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(data.trading.previousYearPurchases)}</td>
                </tr>
                {data.trading.localTransportation > 0 && (
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Add: Local Transportation & Freight Inwards (ढुवानी खर्च)</td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.trading.localTransportation)}</td>
                    <td className="py-1.5 px-3 text-right">{formatNPR(data.trading.previousYearLocalTransportation)}</td>
                  </tr>
                )}
                {data.trading.directWages > 0 && (
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Add: Direct Wages & Production Labor (प्रत्यक्ष ज्याला)</td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.trading.directWages)}</td>
                    <td className="py-1.5 px-3 text-right">{formatNPR(data.trading.previousYearDirectWages)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Total Cost of Goods Available for Sale</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.costOfGoodsAvailableCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.costOfGoodsAvailablePrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans text-rose-700">Less: Closing Stock of Goods (अन्तिम मौज्दात)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">6</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(data.trading.closingStock)})</td>
                  <td className="py-1.5 px-3 text-right text-rose-700">({formatNPR(data.trading.previousYearClosingStock)})</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Cost of Goods Sold / COGS (बिक्री भएको मालको कुल लागत)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.cogsCurrent)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.cogsPrevious)}</td>
                </tr>
                <tr className="h-2">
                  <td colSpan={4} className="border-r border-slate-800 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans font-semibold">Sales Revenue from Operations (बिक्री आम्दानी)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">9</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.totalIncomeCurrent)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.totalIncomePrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans text-slate-700">Less: Cost of Goods Sold / COGS (बिक्री लागत)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">10</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">({formatNPR(report.cogsCurrent)})</td>
                  <td className="py-1.5 px-3 text-right">({formatNPR(report.cogsPrevious)})</td>
                </tr>
                <tr className="bg-slate-200 font-bold text-slate-950 border-t-2 border-b-2 border-slate-900 text-sm">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">
                    GROSS PROFIT TRANSFERRED TO PROFIT & LOSS ACCOUNT (कुल नाफा)
                  </td>
                  <td className="py-2 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-extrabold text-slate-950">
                    {formatNPR(report.grossProfitCurrent)}
                  </td>
                  <td className="py-2 px-3 text-right font-extrabold">
                    {formatNPR(report.grossProfitPrevious)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 flex justify-between items-center">
              <span><strong>Gross Profit Margin (कुल नाफा दर):</strong> {report.grossProfitMarginPercent.toFixed(2)}% of Turnover</span>
              <span><strong>Standard:</strong> {data.client.accountingStandard}</span>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature & Stamp]
              </div>
              <p className="font-bold text-xs uppercase">{data.client.proprietorName}</p>
              <p className="text-[11px] text-slate-600">Proprietor / सञ्चालक</p>
              <p className="text-[10px] text-slate-500">{data.client.entityName}</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500 mb-6 italic">As per our report of even date</p>
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature & ICAN Seal]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[11px] text-slate-600">Registered Auditor (ICAN: {data.auditor.icanRegdNo})</p>
              <p className="text-[10px] text-slate-500">(For: {data.auditor.firmName})</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 5: PROFIT & LOSS ACCOUNT ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <p className="text-xs text-slate-600 font-mono">PAN: {data.client.panNo}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                Statement of Profit or Loss / P&L Account (नाफा नोक्सान हिसाब)
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">For the year ended {asAtDate}</p>
            </div>

            <table className="w-full border-collapse border border-slate-800 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                  <th className="py-2 px-2 text-center border-r border-slate-800 w-20">Schedule</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">F.Y. {currentFY} (रु.)</th>
                  <th className="py-2 px-3 text-right w-36">F.Y. {prevFY} (रु.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans font-semibold">
                    Gross Profit transferred from Trading Account (व्यापार हिसाबबाट आएको कुल नाफा)
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.grossProfitCurrent)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.grossProfitPrevious)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Total Income (कुल आम्दानी)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalIncomeCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.totalIncomePrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Cost of Sales / COGS (बिक्री लागत)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">6</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.cogsCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.cogsPrevious)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans text-sm">GROSS PROFIT (कुल नाफा)</td>
                  <td className="py-2 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-bold text-sm text-slate-950">
                    {formatNPR(report.grossProfitCurrent)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-sm">
                    {formatNPR(report.grossProfitPrevious)}
                  </td>
                </tr>

                {/* Other income */}
                {(data.otherIncome.bankInterest > 0 || data.otherIncome.miscellaneousIncome > 0) && (
                  <tr>
                    <td className="py-1 px-3 border-r border-slate-800 font-sans">Add: Other Income (अन्य आम्दानी)</td>
                    <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                    <td className="py-1 px-3 text-right border-r border-slate-800">
                      {formatNPR(data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}
                    </td>
                    <td className="py-1 px-3 text-right">
                      {formatNPR(data.otherIncome.previousYearBankInterest + data.otherIncome.previousYearMiscellaneousIncome)}
                    </td>
                  </tr>
                )}

                {/* Expenses */}
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Administrative Expenses (प्रशासनिक खर्चहरु)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">7</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalAdminExpensesCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.totalAdminExpensesPrevious)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Operating Profit (सञ्चालन नाफा)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.operatingProfitCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.operatingProfitPrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Depreciation (ह्रासकट्टी)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans">3</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalDepreciationCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.totalDepreciationPrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Interest & Financial Charges (ऋणको ब्याज तथा शुल्क)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalInterestAndChargesCurrent)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(report.totalInterestAndChargesPrevious)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Profit / (Loss) Before Tax (कर अघिको नाफा)</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.profitBeforeTaxCurrent)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.profitBeforeTaxPrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Less: Provision for Income Tax (आयकर व्यवस्था)</td>
                  <td className="py-1 px-2 text-center border-r border-slate-800 font-sans"></td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.calculatedTaxLiabilityCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.calculatedTaxLiabilityPrevious)}</td>
                </tr>
                <tr className="bg-slate-200 font-bold text-slate-950 border-t-2 border-b-2 border-slate-900 text-sm">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">
                    NET PROFIT / (LOSS) TRANSFERRED TO BALANCE SHEET
                  </td>
                  <td className="py-2 px-2 text-center border-r border-slate-800"></td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-bold">
                    {formatNPR(report.netProfitAfterTaxCurrent)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold">
                    {formatNPR(report.netProfitAfterTaxPrevious)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[11px] font-sans text-slate-600 mt-2">
              Schedules 6 and 7 are attached to and form an integral part of this Profit and Loss Account.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature & Stamp]
              </div>
              <p className="font-bold text-xs uppercase">{data.client.proprietorName}</p>
              <p className="text-[11px] text-slate-600">Proprietor</p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500 mb-6 italic">As per our report of even date</p>
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature & ICAN Seal]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[11px] text-slate-600">Registered Auditor</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 4: CASH FLOW STATEMENT ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                Cash Flow Statement (नगद प्रवाह विवरण)
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">For the year ended {asAtDate}</p>
            </div>

            <table className="w-full border-collapse border border-slate-800 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">F.Y. {currentFY} (रु.)</th>
                  <th className="py-2 px-3 text-right w-36">F.Y. {prevFY} (रु.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                <tr className="bg-slate-50 font-sans font-bold">
                  <td colSpan={3} className="py-1.5 px-3 border-r border-slate-800">
                    Cash Flow From Operating Activities (सञ्चालन क्रियाकलापबाट नगद प्रवाह)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Net Profit before Tax (कर अघिको खुद नाफा)</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.profitBeforeTaxCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.profitBeforeTaxPrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Add: Depreciation (ह्रासकट्टी समायोजन)</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalDepreciationCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.totalDepreciationPrevious)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1 px-3 border-r border-slate-800 font-sans">Cashflow Before Change in Working Capital</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.profitBeforeTaxCurrent + report.totalDepreciationCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(report.profitBeforeTaxPrevious + report.totalDepreciationPrevious)}</td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">(Increase)/Decrease in Current Assets</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalCurrentAssetsPrevious - report.totalCurrentAssetsCurrent)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(0)}</td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Increase/(Decrease) in Current Liabilities</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.totalCurrentLiabilitiesCurrent - report.totalCurrentLiabilitiesPrevious)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(0)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Net Cash Flow From Operating Activities (A)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.cashFlow.cashFromOperations)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.profitBeforeTaxPrevious)}</td>
                </tr>

                <tr className="bg-slate-50 font-sans font-bold">
                  <td colSpan={3} className="py-1.5 px-3 border-r border-slate-800">
                    Cash Flow from Investment Activities (लगानी क्रियाकलापबाट नगद प्रवाह)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Purchase of Fixed Assets</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.cashFlow.cashFromInvesting)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(0)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Net Cash Flow from Investment Activities (B)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.cashFlow.cashFromInvesting)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(0)}</td>
                </tr>

                <tr className="bg-slate-50 font-sans font-bold">
                  <td colSpan={3} className="py-1.5 px-3 border-r border-slate-800">
                    Cash Flow from Financial Activities (वित्तीय क्रियाकलापबाट नगद प्रवाह)
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pl-6 pr-3 border-r border-slate-800 font-sans">Proprietor's Capital / Loan Changes</td>
                  <td className="py-1 px-3 text-right border-r border-slate-800">{formatNPR(report.cashFlow.cashFromFinancing)}</td>
                  <td className="py-1 px-3 text-right">{formatNPR(data.capital.previousYearAdditional)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-b border-slate-800">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Net Cash Flow from Financial Activities (C)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.cashFlow.cashFromFinancing)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(data.capital.previousYearAdditional)}</td>
                </tr>

                <tr className="bg-slate-200 font-bold border-t-2 border-b-2 border-slate-800 text-slate-950">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Total Net Cash Flow (A + B + C)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(report.cashFlow.netChangeInCash)}</td>
                  <td className="py-1.5 px-3 text-right font-bold">{formatNPR(data.currentAssets.cashAndBank - data.currentAssets.previousYearCashAndBank)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Add: Opening Cash and Bank Balance (सुरुको मौज्दात)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                  <td className="py-1.5 px-3 text-right">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                </tr>
                <tr className="bg-slate-300 font-bold text-slate-950 border-t-2 border-b-2 border-slate-900 text-sm">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">CLOSING CASH & BANK BALANCE (अन्तिम मौज्दात)</td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-bold">{formatNPR(data.currentAssets.cashAndBank)}</td>
                  <td className="py-2 px-3 text-right font-bold">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 8: STATEMENT OF CHANGES IN EQUITY ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold underline underline-offset-4 mt-2 uppercase">
                Statement of Changes in Equity (स्वामित्व पूँजीमा परिवर्तन सम्बन्धी विवरण)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                For the period ended on {asAtDate} (F.Y. {currentFY})
              </p>
            </div>

            {/* Current Year Table */}
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900 mb-2">
                १. चालु आर्थिक वर्ष {currentFY} को पूँजी परिवर्तन विवरण (Current Year {currentFY})
              </h4>
              <table className="w-full border-collapse border border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                    <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                    <th className="py-2 px-3 text-right border-r border-slate-800 w-36">Proprietor Capital (पूँजी)</th>
                    <th className="py-2 px-3 text-right border-r border-slate-800 w-36">Retained Earnings (सञ्चित नाफा)</th>
                    <th className="py-2 px-3 text-right w-36">Total Equity (कुल पूँजी रु.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-800 font-sans">
                      Balance as at 1st Shrawan {currentFY?.split('/')[0]} (सुरु मौज्दात)
                    </td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.capital.openingCapital)}</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.reserves.openingSurplus)}</td>
                    <td className="py-1.5 px-3 text-right font-semibold">
                      {formatNPR(data.capital.openingCapital + data.reserves.openingSurplus)}
                    </td>
                  </tr>

                  {data.capital.additionalInvestment > 0 && (
                    <tr>
                      <td className="py-1.5 px-3 border-r border-slate-800 font-sans">
                        Add: Fresh Capital Introduced during the year (थप पूँजी लगानी)
                      </td>
                      <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.capital.additionalInvestment)}</td>
                      <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(0)}</td>
                      <td className="py-1.5 px-3 text-right">{formatNPR(data.capital.additionalInvestment)}</td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-800 font-sans">
                      Add: Net Profit / (Loss) for the year transferred from P&L (चालु वर्षको खुद नाफा)
                    </td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(0)}</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.netProfitAfterTaxCurrent)}</td>
                    <td className="py-1.5 px-3 text-right font-semibold">{formatNPR(report.netProfitAfterTaxCurrent)}</td>
                  </tr>

                  {data.capital.withdrawalsDrawings > 0 && (
                    <tr>
                      <td className="py-1.5 px-3 border-r border-slate-800 font-sans">
                        Less: Proprietor Drawings / Withdrawals (व्यक्तिगत निकासी)
                      </td>
                      <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">
                        ({formatNPR(data.capital.withdrawalsDrawings)})
                      </td>
                      <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(0)}</td>
                      <td className="py-1.5 px-3 text-right text-rose-700 font-semibold">
                        ({formatNPR(data.capital.withdrawalsDrawings)})
                      </td>
                    </tr>
                  )}

                  <tr className="bg-slate-200 font-bold border-t-2 border-b-2 border-slate-900 text-slate-950">
                    <td className="py-2 px-3 border-r border-slate-800 font-sans">
                      Balance as at {asAtDate} (अन्तिम पूँजी मौज्दात)
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-800">
                      {formatNPR(data.capital.openingCapital + data.capital.additionalInvestment - data.capital.withdrawalsDrawings)}
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-800">
                      {formatNPR(data.reserves.openingSurplus + report.netProfitAfterTaxCurrent)}
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold">
                      {formatNPR(report.totalProprietorFundCurrent)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Previous Year Comparison Table */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 mb-2">
                २. अघिल्लो आर्थिक वर्ष {prevFY} को तुलनात्मक विवरण (Previous Year {prevFY})
              </h4>
              <table className="w-full border-collapse border border-slate-600 text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-600 font-bold">
                    <th className="py-1.5 px-3 text-left border-r border-slate-600">Particulars (विवरण)</th>
                    <th className="py-1.5 px-3 text-right border-r border-slate-600 w-36">Capital (पूँजी)</th>
                    <th className="py-1.5 px-3 text-right border-r border-slate-600 w-36">Retained Earnings (सञ्चित नाफा)</th>
                    <th className="py-1.5 px-3 text-right w-36">Total Equity (रु.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  <tr>
                    <td className="py-1 px-3 border-r border-slate-600 font-sans">Beginning Balance</td>
                    <td className="py-1 px-3 text-right border-r border-slate-600">{formatNPR(data.capital.previousYearCapital)}</td>
                    <td className="py-1 px-3 text-right border-r border-slate-600">{formatNPR(data.reserves.previousYearOpeningSurplus)}</td>
                    <td className="py-1 px-3 text-right">{formatNPR(data.capital.previousYearCapital + data.reserves.previousYearOpeningSurplus)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 border-r border-slate-600 font-sans">Net Profit for the Year</td>
                    <td className="py-1 px-3 text-right border-r border-slate-600">{formatNPR(0)}</td>
                    <td className="py-1 px-3 text-right border-r border-slate-600">{formatNPR(report.netProfitAfterTaxPrevious)}</td>
                    <td className="py-1 px-3 text-right">{formatNPR(report.netProfitAfterTaxPrevious)}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold border-t border-b border-slate-700">
                    <td className="py-1.5 px-3 border-r border-slate-600 font-sans">Ending Equity Balance</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-600">{formatNPR(data.capital.previousYearCapital)}</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-600">
                      {formatNPR(data.reserves.previousYearOpeningSurplus + report.netProfitAfterTaxPrevious)}
                    </td>
                    <td className="py-1.5 px-3 text-right font-bold">{formatNPR(report.totalProprietorFundPrevious)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-normal">
              <strong>नोट (Note):</strong> प्रस्तुत पूँजी परिवर्तन विवरण नेपाल लेखामान (NAS / NAS for MEs) अनुसार तयार गरिएको छ र यस विवरणको अन्तिम मौज्दात वासलात (Balance Sheet) को पूँजी तथा कोष (Proprietor's Capital & Fund) सँग पूर्ण मेल खान्छ।
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
              <p className="text-[10px] text-slate-600">सञ्चालक / Proprietor</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[10px] text-slate-600">लेखापरीक्षक (ICAN: {data.auditor.icanRegdNo})</p>
            </div>
          </div>
        </section>

        <div className="page-break" />
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                Schedule 3: Fixed Assets Schedule (स्थिर सम्पत्ति तथा ह्रासकट्टी विवरण)
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">
                Under Income Tax Act, 2058 (आयकर ऐन, २०५८ अनुसार) as at {asAtDate}
              </p>
            </div>

            <table className="w-full border-collapse border border-slate-800 text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-2 text-left border-r border-slate-800">Particulars (सम्पत्ति विवरण)</th>
                  <th className="py-2 px-2 text-right border-r border-slate-800">Opening Balance</th>
                  <th className="py-2 px-2 text-right border-r border-slate-800">Additions</th>
                  <th className="py-2 px-2 text-right border-r border-slate-800">Disposal</th>
                  <th className="py-2 px-2 text-right border-r border-slate-800">For Depreciation</th>
                  <th className="py-2 px-1 text-center border-r border-slate-800 w-12">Rate %</th>
                  <th className="py-2 px-2 text-right border-r border-slate-800">Depreciation</th>
                  <th className="py-2 px-2 text-right">Net Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                {data.fixedAssets.map((asset) => {
                  const figures = calculateFixedAssetAmounts(asset);
                  const adds = figures.additions;
                  const forDepr = figures.depreciationBase;
                  const depr = figures.depreciation;
                  const net = figures.netBookValue;

                  return (
                    <tr key={asset.id}>
                      <td className="py-1.5 px-2 border-r border-slate-800 font-sans">
                        <div className="font-bold text-slate-900">{asset.name}</div>
                        <div className="text-[10px] text-slate-500">{asset.nepaliName}</div>
                      </td>
                      <td className="py-1.5 px-2 text-right border-r border-slate-800">{formatNPR(asset.openingBalance)}</td>
                      <td className="py-1.5 px-2 text-right border-r border-slate-800">{formatNPR(adds)}</td>
                      <td className="py-1.5 px-2 text-right border-r border-slate-800">{formatNPR(asset.disposalsDuringYear)}</td>
                      <td className="py-1.5 px-2 text-right border-r border-slate-800 font-semibold">{formatNPR(forDepr)}</td>
                      <td className="py-1.5 px-1 text-center border-r border-slate-800">{asset.ratePercent}%</td>
                      <td className="py-1.5 px-2 text-right border-r border-slate-800 font-semibold text-slate-950">{formatNPR(depr)}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-slate-950">{formatNPR(net)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-200 font-bold border-t-2 border-b-2 border-slate-900 text-slate-950">
                  <td className="py-2 px-2 border-r border-slate-800 font-sans">TOTAL FIXED ASSETS (कुल)</td>
                  <td className="py-2 px-2 text-right border-r border-slate-800">
                    {formatNPR(data.fixedAssets.reduce((s, a) => s + (a.openingBalance || 0), 0))}
                  </td>
                  <td className="py-2 px-2 text-right border-r border-slate-800">
                    {formatNPR(data.fixedAssets.reduce((s, a) => s + getFixedAssetAdditions(a), 0))}
                  </td>
                  <td className="py-2 px-2 text-right border-r border-slate-800">
                    {formatNPR(data.fixedAssets.reduce((s, a) => s + (a.disposalsDuringYear || 0), 0))}
                  </td>
                  <td className="py-2 px-2 text-right border-r border-slate-800">
                    {formatNPR(
                      data.fixedAssets.reduce(
                        (s, a) => s + calculateFixedAssetAmounts(a).depreciationBase,
                        0
                      )
                    )}
                  </td>
                  <td className="py-2 px-1 text-center border-r border-slate-800">-</td>
                  <td className="py-2 px-2 text-right border-r border-slate-800">
                    {formatNPR(report.totalDepreciationCurrent)}
                  </td>
                  <td className="py-2 px-2 text-right font-bold">
                    {formatNPR(report.totalFixedAssetsNetBlockCurrent)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 6: SCHEDULES 1 TO 7 DETAILED ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                Schedules forming part of the Financial Statements
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">As at {asAtDate}</p>
            </div>

            <div className="space-y-6 text-xs font-sans">
              {/* Schedule 1: Proprietor's Capital */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 1: Proprietor's Capital (स्वामित्व पूँजी)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Opening Proprietor's Capital</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.capital.openingCapital)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.capital.previousYearCapital)}</td>
                    </tr>
                    {data.capital.additionalInvestment > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Additional Investment</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.capital.additionalInvestment)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.capital.previousYearAdditional)}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Proprietor's Capital</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.totalProprietorFundCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.totalProprietorFundPrevious)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 2: Reserve and Surplus */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 2: Reserve and Surplus (जगेडा तथा कोष)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Opening Surplus</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.reserves.openingSurplus)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.reserves.previousYearOpeningSurplus)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Add: Current Year Profit / (Loss)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.netProfitAfterTaxCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.netProfitAfterTaxPrevious)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Reserve and Surplus</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.closingReservesAndSurplusCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.closingReservesAndSurplusPrevious)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 4: Cash and Bank Balance */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 4: Cash and Bank Balance (नगद तथा बैंक मौज्दात)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Cash in Hand / Bank Balance</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.currentAssets.cashAndBank)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Cash and Bank Balance</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentAssets.cashAndBank)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearCashAndBank)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 5: Sundry Debtors & Receivables */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 5: Sundry Debtors and Receivables (असामी तथा अन्य पाउनुपर्ने)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Sundry Debtors (ग्राहकहरु)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.currentAssets.sundryDebtors)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.currentAssets.previousYearSundryDebtors)}</td>
                    </tr>
                    {data.currentAssets.vatReceivable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">VAT Receivable</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentAssets.vatReceivable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearVatReceivable)}</td>
                      </tr>
                    )}
                    {data.currentAssets.advanceIncomeTax > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Advance Income Tax</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentAssets.advanceIncomeTax)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearAdvanceIncomeTax)}</td>
                      </tr>
                    )}
                    {data.currentAssets.loansAndAdvances > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Loans, Advances & Security Deposits</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentAssets.loansAndAdvances)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentAssets.previousYearLoansAndAdvances)}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Debtors & Receivables</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">
                        {formatNPR(data.currentAssets.sundryDebtors + data.currentAssets.vatReceivable + data.currentAssets.advanceIncomeTax + data.currentAssets.loansAndAdvances)}
                      </td>
                      <td className="py-1 px-3 text-right">
                        {formatNPR(data.currentAssets.previousYearSundryDebtors + data.currentAssets.previousYearVatReceivable + data.currentAssets.previousYearAdvanceIncomeTax + data.currentAssets.previousYearLoansAndAdvances)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 6: Sundry Creditors & Other Payable */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 6: Sundry Creditors, Payables & Provisions (साहुहरु तथा अन्य दायित्वहरू)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Sundry Creditors (आपूर्तिकर्ता साहुहरु)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.currentLiabilities.sundryCreditors)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.currentLiabilities.previousYearSundryCreditors)}</td>
                    </tr>
                    {data.currentLiabilities.bankOverdraft > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Bank Overdraft / Short-Term Loan</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.bankOverdraft)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearBankOverdraft)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.auditFeePayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Audit Fee Payable</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.auditFeePayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearAuditFeePayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.tdsOnAuditFeePayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">TDS on Audit Fee Payable (1.5%)</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.tdsOnAuditFeePayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearTdsOnAuditFeePayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.tdsOnHouseRentPayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">TDS on House Rent Payable (10%)</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.tdsOnHouseRentPayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearTdsOnHouseRentPayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.tdsOnTransportationPayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">TDS on Transportation Payable</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.tdsOnTransportationPayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearTdsOnTransportationPayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.salaryTdsPayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Salary TDS Payable</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.salaryTdsPayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearSalaryTdsPayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.interestPayable > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Interest Payable on Loan</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.interestPayable)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearInterestPayable)}</td>
                      </tr>
                    )}
                    {data.currentLiabilities.otherPayables > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Other Payables / Proprietor Account</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.currentLiabilities.otherPayables)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.currentLiabilities.previousYearOtherPayables)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Provision for Income Tax (आयकर व्यवस्था)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.calculatedTaxLiabilityCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.calculatedTaxLiabilityPrevious)}</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Current Liabilities & Provisions</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.totalCurrentLiabilitiesCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.totalCurrentLiabilitiesPrevious)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 7 (Direct Expenses): Trading Account */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 7: Direct Expenses (खरिद तथा प्रत्यक्ष खर्च विवरण)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Opening Stock (सुरु मौज्दात)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(data.trading.openingStock)}</td>
                      <td className="py-1 px-3 text-right w-36">{formatNPR(data.trading.previousYearOpeningStock)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Add: Purchases during the year (कुल खरिद)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.trading.purchases)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(data.trading.previousYearPurchases)}</td>
                    </tr>
                    {data.trading.localTransportation > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Add: Local Transportation & Freight</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.trading.localTransportation)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.trading.previousYearLocalTransportation)}</td>
                      </tr>
                    )}
                    {data.trading.directWages > 0 && (
                      <tr>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">Add: Direct Wages & Production Labor</td>
                        <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(data.trading.directWages)}</td>
                        <td className="py-1 px-3 text-right">{formatNPR(data.trading.previousYearDirectWages)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Less: Closing Stock (अन्तिम मौज्दात)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">({formatNPR(data.trading.closingStock)})</td>
                      <td className="py-1 px-3 text-right">({formatNPR(data.trading.previousYearClosingStock)})</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Cost of Sales (COGS)</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.cogsCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.cogsPrevious)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Schedule 8: Administrative Expenses */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-700 pb-1 mb-1">
                  Schedule 8: Administrative Expenses (प्रशासनिक खर्चहरु)
                </h4>
                <table className="w-full border border-slate-700 font-mono">
                  <tbody>
                    {data.adminExpenses.map((ae) => (
                      <tr key={ae.id}>
                        <td className="py-1 px-3 border-r border-slate-700 font-sans">
                          {ae.particular} ({ae.nepaliLabel})
                        </td>
                        <td className="py-1 px-3 text-right border-r border-slate-700 w-36">{formatNPR(ae.currentYear)}</td>
                        <td className="py-1 px-3 text-right w-36">{formatNPR(ae.previousYear)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-1 px-3 border-r border-slate-700 font-sans">Total Administrative Expenses</td>
                      <td className="py-1 px-3 text-right border-r border-slate-700">{formatNPR(report.totalAdminExpensesCurrent)}</td>
                      <td className="py-1 px-3 text-right">{formatNPR(report.totalAdminExpensesPrevious)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 10: STATEMENT OF INCOME TAX COMPUTATION ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm text-slate-700">{data.client.address}</p>
              <p className="text-xs text-slate-600 font-mono">PAN: {data.client.panNo}</p>
              <h3 className="text-base font-bold underline underline-offset-4 mt-2 uppercase">
                Statement of Income Tax Computation (आयकर गणना विवरण)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Income Year {currentFY} (Assessment Year {parseInt(currentFY?.slice(0, 2) || '80') + 1}/{parseInt(currentFY?.slice(5) || '81') + 1}) • Income Tax Act, 2058
              </p>
            </div>

            <table className="w-full border-collapse border border-slate-800 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 font-bold">
                  <th className="py-2 px-3 text-left border-r border-slate-800">Particulars (विवरण)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">As per P&L (रु.)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-800 w-36">Tax Purpose (रु.)</th>
                  <th className="py-2 px-3 text-left w-48">Section / Provisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Turnover from Operations (बिक्री आम्दानी)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalIncomeCurrent)}</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalIncomeCurrent)}</td>
                  <td className="py-1.5 px-3 text-left font-sans text-slate-600">Sec 7(2)(Kha)</td>
                </tr>
                {(data.otherIncome.bankInterest > 0 || data.otherIncome.miscellaneousIncome > 0) && (
                  <tr>
                    <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Other Incomes (ब्याज तथा अन्य आम्दानी)</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}</td>
                    <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}</td>
                    <td className="py-1.5 px-3 text-left font-sans text-slate-600">Sec 7(2)(Ga)</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Gross Assessable Inflow (कुल आम्दानी)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800">{formatNPR(report.totalIncomeCurrent + data.otherIncome.bankInterest + data.otherIncome.miscellaneousIncome)}</td>
                  <td className="py-1.5 px-3 text-left font-sans"></td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Cost of Goods Sold (बिक्री भएको मालको लागत)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.cogsCurrent)})</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.cogsCurrent)})</td>
                  <td className="py-1.5 px-3 text-left font-sans text-slate-600">Sec 15 Deduction</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Allowable Depreciation (ह्रासकट्टी कट्टी)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.totalDepreciationCurrent)})</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.totalDepreciationCurrent)})</td>
                  <td className="py-1.5 px-3 text-left font-sans text-slate-600">Sec 19 & Sched 2</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: General Administrative Expenses (प्रशासनिक खर्च)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.totalAdminExpensesCurrent)})</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(report.totalAdminExpensesCurrent)})</td>
                  <td className="py-1.5 px-3 text-left font-sans text-slate-600">Sec 13 Deduction</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 border-r border-slate-800 font-sans">Less: Interest on Loan / Financial Costs (ऋणको ब्याज)</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(data.finance.interestOnLoan)})</td>
                  <td className="py-1.5 px-3 text-right border-r border-slate-800 text-rose-700">({formatNPR(Math.max(0, data.finance.interestOnLoan - (data.finance.disallowedInterestSec14 || 0)))})</td>
                  <td className="py-1.5 px-3 text-left font-sans text-slate-600">
                    {data.finance.disallowedInterestSec14 > 0 ? `Sec 14 Disallowed: रु. ${formatNPR(data.finance.disallowedInterestSec14)}` : 'Sec 14 Admissible'}
                  </td>
                </tr>
                <tr className="bg-slate-200 font-bold text-slate-950 border-t-2 border-b-2 border-slate-900 text-sm">
                  <td className="py-2 px-3 border-r border-slate-800 font-sans">
                    TAXABLE INCOME FROM BUSINESS (करयोग्य व्यवसाय आय)
                  </td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-bold">
                    {formatNPR(report.profitBeforeTaxCurrent)}
                  </td>
                  <td className="py-2 px-3 text-right border-r border-slate-800 font-extrabold text-slate-950">
                    {formatNPR(Math.max(0, report.profitBeforeTaxCurrent + (data.finance.disallowedInterestSec14 || 0) - (data.taxSettings.donationSec12 || 0)))}
                  </td>
                  <td className="py-2 px-3 text-left font-sans font-semibold">Assessable Profit</td>
                </tr>
              </tbody>
            </table>

            {/* Tax Computation Breakdown Box */}
            <div className="mt-6 border border-slate-800 rounded p-4 bg-slate-50">
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900 border-b border-slate-700 pb-1 mb-3">
                कर दायित्व हिसाब (Tax Liability Computation)
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-600">Assessment Scheme / Type:</p>
                  <p className="font-bold font-mono">
                    {data.taxSettings.taxRateType === 'proprietorship_slab'
                      ? `Proprietorship Slab (${data.taxSettings.maritalStatus === 'couple' ? 'Couple/दम्पती' : 'Individual/व्यक्तिगत'})`
                      : 'Corporate Flat Rate (25%)'}
                  </p>
                  <p className="text-slate-600 mt-2">Gross Assessed Tax Liability (कुल आयकर दायित्व):</p>
                  <p className="font-bold font-mono text-base text-slate-900">
                    रु. {formatNPR(report.calculatedTaxLiabilityCurrent)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Less: Advance Income Tax Paid / TDS (कट्टी भएको अग्रिम कर):</p>
                  <p className="font-bold font-mono text-rose-700">
                    (रु. {formatNPR(report.advanceTaxPaidCurrent)})
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-300">
                    <p className="text-slate-700 font-semibold">
                      {report.netTaxPayableOrRefundableCurrent >= 0
                        ? 'Net Tax Payable to IRD (आन्तरिक राजस्व कार्यालयमा बुझाउनुपर्ने बाँकी कर):'
                        : 'Refundable / Carry Forward to Next Year (फिर्ता पाउने / आगामी वर्षमा सार्ने):'}
                    </p>
                    <p className={`font-extrabold font-mono text-base ${report.netTaxPayableOrRefundableCurrent >= 0 ? 'text-emerald-700' : 'text-blue-700'}`}>
                      रु. {formatNPR(Math.abs(report.netTaxPayableOrRefundableCurrent))}
                    </p>
                  </div>
                </div>
              </div>
              {data.finance.disallowedInterestSec14 > 0 && (
                <div className="mt-3 p-2 bg-amber-100/70 border border-amber-300 rounded text-[11px] text-amber-900">
                  <strong>दफा १४(२) बमोजिम कैफियत:</strong> ऋणको ब्याज रु. {formatNPR(data.finance.disallowedInterestSec14)} आयकर ऐन, २०५८ को दफा १४(२) को सीमा भित्र नपरेकोले चालु वर्षमा अस्वीकृत गरी आगामी वर्षहरूमा आयकर ऐन बमोजिम मिलान गर्न सारिएको छ।
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature & Stamp]
              </div>
              <p className="font-bold text-xs uppercase">{data.client.proprietorName}</p>
              <p className="text-[11px] text-slate-600">Proprietor / सञ्चालक</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-6 italic">As per our report of even date</p>
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature & ICAN Seal]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[11px] text-slate-600">Registered Auditor (ICAN: {data.auditor.icanRegdNo})</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 6.5: SIGNIFICANT ACCOUNTING POLICIES & NOTES ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0 font-sans">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold underline underline-offset-4 mt-2 uppercase">
                {currentFormat === 'D3'
                  ? 'Significant Accounting Policies & Explanatory Notes (NAS for MEs Disclosures)'
                  : 'Significant Accounting Policies & Notes to the Financial Statements (NAS)'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">F.Y. {currentFY} (Ended on {asAtDate})</p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-800 text-justify">
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  १. संस्थाको पृष्ठभूमि तथा कानूनी स्थिति (1. Reporting Entity & Status)
                </h4>
                <p>
                  <strong>{data.client.entityName}</strong> नेपालको प्रचलित कानून अनुसार दर्ता भएको {data.client.businessType} हो। यसको स्थायी लेखा नम्बर <strong>{data.client.panNo}</strong> रहेको छ र यो संस्था {data.client.address} मा अवस्थित रही मुख्यतया {currentFormat === 'D3' ? 'निर्माण सामग्री खरिद-बिक्री तथा सप्लायर्स' : 'व्यापारिक तथा उत्पादन'} कारोबार सञ्चालन गर्दै आएको छ।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  २. वित्तीय विवरण तयार गर्ने आधार (2. Basis of Preparation & Compliance)
                </h4>
                <p>
                  यस संस्थाका वित्तीय विवरणहरू नेपाल चार्टर्ड एकाउन्टेन्ट्स संस्था (ICAN) द्वारा जारी गरिएको{' '}
                  <strong>{data.client.accountingStandard}</strong> अनुसार ऐतिहासिक लागत पद्धति (Historical Cost Convention) र प्रोदभावी आधार (Accrual Basis of Accounting) मा तयार गरिएका छन्।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  ३. स्थिर सम्पत्ति तथा ह्रासकट्टी (3. Property, Plant & Equipment & Depreciation)
                </h4>
                <p>
                  स्थिर सम्पत्तिहरूलाई खरिद लागत मूल्यबाट घट्दो मौज्दात विधि (Diminishing Balance Method) अनुसार ह्रासकट्टी कट्टा गरी खुद मौज्दातमा देखाइएको छ। ह्रासकट्टी आयकर ऐन, २०५८ को अनुसूची २ मा तोकिएका दरहरू बमोजिम (ब्लक अनुसार) गणना गरिएको छ।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  ४. मौज्दातको मूल्याङ्कन (4. Inventories Valuation)
                </h4>
                <p>
                  अन्तिम मौज्दातको मूल्याङ्कन लागत मूल्य वा खुद बिक्री योग्य मूल्य (Lower of Cost and Net Realizable Value) मध्ये जुन कम हुन्छ सोही आधारमा पहिलो आउने पहिले जाने (FIFO Method) सिद्धान्त बमोजिम व्यवस्थापनद्वारा गरिएको छ।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  ५. आम्दानी तथा राजस्वको लेखाङ्कन (5. Revenue Recognition)
                </h4>
                <p>
                  बिक्री आम्दानी ग्राहकलाई सामान हस्तान्तरण भई जोखिम र प्रतिफल सरेपछि प्रोदभावी आधारमा मूल्य अभिवृद्धि कर (VAT) बाहेकको रकममा लेखाङ्कन गरिएको छ।
                </p>
              </div>

              {currentFormat === 'D3' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <h4 className="font-bold text-amber-950 text-sm mb-1">
                    ६. आयकर ऐनको दफा १४ अनुसार अस्वीकृत ब्याज (6. Section 14 Disallowed Interest Note)
                  </h4>
                  <p className="text-amber-900">
                    आयकर ऐन, २०५८ को दफा १४ को उपदफा (२) बमोजिम ब्याज खर्चको सीमा सम्बन्धमा परीक्षण गरिएको छ। नियन्त्रित व्यक्ति वा संस्थाबाट लिइएको ऋणमा तोकिएको सीमा भन्दा बढी भएको ब्याज कर प्रयोजनका लागि आगामी वर्षहरूमा सार्न सकिने गरी मिलान गरिएको छ।
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">
                  {currentFormat === 'D3' ? '७' : '६'}. आयकर तथा कर दायित्व व्यवस्था (Taxation & Provisions)
                </h4>
                <p>
                  चालु वर्षको करयोग्य आयमा नेपाल सरकारको आयकर ऐन, २०५८ तथा प्रचलित आर्थिक ऐनका स्ल्याब तथा दर अनुसार आयकर व्यवस्था गरिएको छ र स्रोतमा कट्टा भएको कर (TDS) तथा अग्रिम करलाई समायोजन गरिएको छ।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
              <p className="text-[10px] text-slate-600">सञ्चालक / Proprietor</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[10px] text-slate-600">लेखापरीक्षक (ICAN: {data.auditor.icanRegdNo})</p>
            </div>
          </div>
        </section>

        <div className="page-break" />

        {/* ================= PAGE 7: VAT RECONCILIATION STATEMENT ================= */}
        <section className="min-h-[1050px] flex flex-col justify-between mb-12 border-b border-dashed border-slate-300 pb-12 print:border-0 print:mb-0 print:pb-0">
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold font-sans uppercase tracking-tight text-slate-950">
                {data.client.entityName}
              </h2>
              <p className="text-sm font-sans text-slate-700">{data.client.address}</p>
              <h3 className="text-base font-bold font-sans underline underline-offset-4 mt-2 uppercase">
                VAT Reconciliation (मूल्य अभिवृद्धि कर मिलान तालिका)
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">FY {currentFY}</p>
            </div>

            {/* 10-Column VAT Table matching IRD Format */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-800 text-[9px] font-sans">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
                    <th rowSpan={2} className="py-2 px-1 border-r border-slate-800 w-28">Month</th>
                    <th colSpan={4} className="py-1 px-1 border-r border-slate-800 bg-slate-200">Sales</th>
                    <th colSpan={4} className="py-1 px-1 border-r border-slate-800 bg-slate-200">Purchase</th>
                    <th rowSpan={2} className="py-2 px-1 border-r border-slate-800 text-right w-20">Payable</th>
                    <th rowSpan={2} className="py-2 px-1 text-right w-16">Paid</th>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-800 font-bold text-right text-[8.5px]">
                    <th className="py-1 px-1 border-r border-slate-800">Taxable Value</th>
                    <th className="py-1 px-1 border-r border-slate-800">VAT</th>
                    <th className="py-1 px-1 border-r border-slate-800">Discounted Sales</th>
                    <th className="py-1 px-1 border-r border-slate-800">Thap Ghat Sales VAT</th>
                    <th className="py-1 px-1 border-r border-slate-800">Taxable Value</th>
                    <th className="py-1 px-1 border-r border-slate-800">VAT</th>
                    <th className="py-1 px-1 border-r border-slate-800">Discounted Purchase</th>
                    <th className="py-1 px-1 border-r border-slate-800">Thap Ghat Purchase VAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono text-[8.5px]">
                  {data.vatReconciliation.map((m) => {
                    const discountSales = m.discountedSales !== undefined ? m.discountedSales : (m.vatFreeSales || 0);
                    const discountPur = m.discountedPurchase !== undefined ? m.discountedPurchase : (m.vatFreePurchase || 0);
                    const calcNet = ((m.salesVat || 0) + (m.thapGhatSalesVat || 0)) - ((m.purchaseVat || 0) + (m.thapGhatPurchaseVat || 0));
                    const payVal = m.payable !== undefined ? m.payable : calcNet;

                    return (
                      <tr key={m.monthName}>
                        <td className="py-1 px-1 border-r border-slate-800 font-sans font-medium">
                          {m.monthName} ({m.nepaliMonth || ''})
                        </td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(m.taxableSales)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(m.salesVat)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(discountSales)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">
                          {m.thapGhatSalesVat ? formatNPR(m.thapGhatSalesVat) : '-'}
                        </td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(m.taxablePurchase)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(m.purchaseVat)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">{formatNPR(discountPur)}</td>
                        <td className="py-1 px-1 text-right border-r border-slate-800">
                          {m.thapGhatPurchaseVat ? formatNPR(m.thapGhatPurchaseVat) : '-'}
                        </td>
                        <td className="py-1 px-1 text-right border-r border-slate-800 font-semibold">
                          {payVal < 0 ? `(${formatNPR(Math.abs(payVal))})` : (payVal > 0 ? formatNPR(payVal) : '-')}
                        </td>
                        <td className="py-1 px-1 text-right">
                          {m.vatPaidToBank ? formatNPR(m.vatPaidToBank) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-200 font-bold border-t-2 border-b-2 border-slate-900 text-slate-950 text-[9px]">
                    <td className="py-1.5 px-1 border-r border-slate-800 font-sans">Total (कुल)</td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">{formatNPR(report.totalTaxableSalesVatRec)}</td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">{formatNPR(report.totalSalesVatRec)}</td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">
                      {formatNPR(report.totalDiscountedSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedSales || m.vatFreeSales || 0), 0))}
                    </td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">
                      {formatNPR(report.totalThapGhatSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.thapGhatSalesVat || 0), 0)) || '-'}
                    </td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">{formatNPR(report.totalTaxablePurchaseVatRec)}</td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">{formatNPR(report.totalPurchaseVatRec)}</td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">
                      {formatNPR(report.totalDiscountedPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedPurchase || m.vatFreePurchase || 0), 0))}
                    </td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800">
                      {formatNPR(report.totalThapGhatPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.thapGhatPurchaseVat || 0), 0)) || '-'}
                    </td>
                    <td className="py-1.5 px-1 text-right border-r border-slate-800 font-bold">
                      {(() => {
                        const totPay = data.vatReconciliation.reduce((s, m) => s + (m.payable || 0), 0);
                        return totPay < 0 ? `(${formatNPR(Math.abs(totPay))})` : (totPay > 0 ? formatNPR(totPay) : '-');
                      })()}
                    </td>
                    <td className="py-1.5 px-1 text-right font-bold">
                      {formatNPR(data.vatReconciliation.reduce((s, m) => s + (m.vatPaidToBank || 0), 0)) || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Cards Matching Image */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Box 1: Sales During the Year */}
              <div className="border border-slate-800 rounded p-3 text-[10px] font-sans">
                <div className="font-bold border-b border-slate-400 pb-1 mb-2 uppercase">
                  Sales During the Year
                </div>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans">Taxable Sales:</span>
                    <span className="font-semibold">{formatNPR(report.totalTaxableSalesVatRec)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">VAT Free Sales:</span>
                    <span className="font-semibold">
                      {formatNPR(report.totalDiscountedSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedSales || m.vatFreeSales || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                    <span className="font-sans">Total Sales:</span>
                    <span>
                      {formatNPR(
                        report.totalTaxableSalesVatRec +
                        (report.totalDiscountedSalesVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedSales || m.vatFreeSales || 0), 0))
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Purchases During the Year */}
              <div className="border border-slate-800 rounded p-3 text-[10px] font-sans">
                <div className="font-bold border-b border-slate-400 pb-1 mb-2 uppercase">
                  Purchases During the Year
                </div>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans">Taxable Purchase:</span>
                    <span className="font-semibold">{formatNPR(report.totalTaxablePurchaseVatRec)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">VAT Free Purchase:</span>
                    <span className="font-semibold">
                      {formatNPR(report.totalDiscountedPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedPurchase || m.vatFreePurchase || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                    <span className="font-sans">Total Purchase:</span>
                    <span>
                      {formatNPR(
                        report.totalTaxablePurchaseVatRec +
                        (report.totalDiscountedPurchaseVatRec ?? data.vatReconciliation.reduce((s, m) => s + (m.discountedPurchase || m.vatFreePurchase || 0), 0))
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end font-sans">
            <div className="text-center">
              <div className="w-44 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Proprietor Signature]
              </div>
              <p className="font-bold text-xs">{data.client.proprietorName}</p>
              <p className="text-[10px] text-slate-600">सञ्चालक / Proprietor</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-2 pb-6 italic text-xs text-slate-400">
                [Auditor Signature]
              </div>
              <p className="font-bold text-xs">{data.auditor.auditorName}</p>
              <p className="text-[10px] text-slate-600">लेखापरीक्षक (ICAN: {data.auditor.icanRegdNo})</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
