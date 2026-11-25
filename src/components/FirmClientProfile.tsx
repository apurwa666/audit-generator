import React, { useState } from 'react';
import { AuditorProfile, ClientProfile } from '../types/audit';
import {
  Building2,
  Award,
  FileSpreadsheet,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { NepalAddressSelector } from './NepalAddressSelector';

export const COMPANY_TYPE_OPTIONS = [
  {
    id: 'type1',
    label: '१. प्राकृतिक व्यक्ति तथा एकल फार्म (Individual & Sole Proprietorship)',
    shortTitle: 'प्राकृतिक व्यक्ति तथा एकल फार्म',
    points: [
      'करको दर: १% देखि ३९% सम्म (प्रोग्रेसिभ स्ल्याब/प्रगतिशील कर)',
      'रु ५० लाखसम्मको कारोबारमा प्रिजम्प्टिभ ट्याक्स (रु २,५०० - रु ७,५००) को विकल्प',
    ],
  },
  {
    id: 'type2',
    label: '२. सामान्य प्राइभेट लिमिटेड कम्पनी (Private Limited Company)',
    shortTitle: 'सामान्य प्राइभेट लिमिटेड कम्पनी',
    points: [
      'कर्पोरेट कर: २५% (फल्याट दर)',
      'अन्य साधारण व्यापार तथा सेवा प्रदायक प्राइभेट लिमिटेड कम्पनीहरूका लागि लागू हुने सामान्य व्यवस्था',
    ],
  },
  {
    id: 'type3',
    label: '३. पब्लिक लिमिटेड कम्पनी तथा वित्तीय संस्थाहरू (Public Limited & Financial Institutions)',
    shortTitle: 'पब्लिक लिमिटेड कम्पनी तथा वित्तीय संस्थाहरू',
    points: [
      'सामान्य पब्लिक कम्पनी: २५%',
      'बैंक, वित्तीय संस्था, बीमा र टेलिकम कम्पनीहरू: ३०%',
    ],
  },
  {
    id: 'type4',
    label: '४. विशेष/उत्पादनमूलक उद्योग र आईटी निर्यात (Special Industries & Exports)',
    shortTitle: 'विशेष/उत्पादनमूलक उद्योग र आईटी निर्यात',
    points: [
      'उत्पादनमूलक, कृषि, पर्यटन र आईटी उद्योग: २०% (सहुलियत दर)',
      'विदेशी मुद्रा आर्जन गर्ने आईटी निर्यात कम्पनीहरू: प्रभावकारी दर लगभग ५% (७५% छुटपछि)',
    ],
  },
  {
    id: 'type5',
    label: '५. सहकारी संस्थाहरू (Cooperatives)',
    shortTitle: 'सहकारी संस्थाहरू',
    points: [
      'ग्रामीण क्षेत्र: ०% (पूर्ण छुट), नगरपालिका क्षेत्र: ५%',
      'उप-महानगरपालिका क्षेत्र: १०%, महानगरपालिका क्षेत्र: १५% देखि २०%',
    ],
  },
  {
    id: 'type6',
    label: '६. गैर-आवासीय तथा विदेशी संस्थाहरू (Non-Resident Entities & Foreign PE)',
    shortTitle: 'गैर-आवासीय तथा विदेशी संस्थाहरू',
    points: [
      'नेपालबाट आर्जित आयमा: २५% (फ्ल्याट दर)',
      'विदेशी शाखाको नाफा फिर्ता (Repatriation): ५% थप कर',
    ],
  },
];

interface FirmClientProfileProps {
  auditor: AuditorProfile;
  client: ClientProfile;
  onAuditorChange: (auditor: AuditorProfile) => void;
  onClientChange: (client: ClientProfile) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  auditTemplateType?: 'D2' | 'D3';
  onTemplateTypeChange?: (type: 'D2' | 'D3') => void;
}

export const FirmClientProfile: React.FC<FirmClientProfileProps> = ({
  auditor,
  client,
  onAuditorChange,
  onClientChange,
  fontSize,
  auditTemplateType = 'D2',
  onTemplateTypeChange,
}) => {
  // In D2, auditor info is optional and vanishes by default unless toggled or already populated
  const [showAuditorInD2, setShowAuditorInD2] = useState<boolean>(() => {
    return Boolean(
      auditor.firmName?.trim() ||
      auditor.auditorName?.trim() ||
      auditor.copNo?.trim() ||
      auditor.icanRegdNo?.trim()
    );
  });
  const [showCompanyDetails, setShowCompanyDetails] = useState<boolean>(false);

  const updateAuditor = (field: keyof AuditorProfile, value: any) => {
    onAuditorChange({ ...auditor, [field]: value });
  };

  const updateClient = (field: keyof ClientProfile, value: any) => {
    onClientChange({ ...client, [field]: value });
  };

  const labelSize =
    fontSize === 'xlarge'
      ? 'text-lg font-bold'
      : fontSize === 'large'
      ? 'text-base font-bold'
      : 'text-sm font-bold';

  const inputSize =
    fontSize === 'xlarge'
      ? 'text-lg px-4.5 py-3.5'
      : fontSize === 'large'
      ? 'text-base px-4 py-3'
      : 'text-sm sm:text-base px-3.5 py-2.5';

  const selectFormat = (format: 'D2' | 'D3') => {
    if (onTemplateTypeChange) {
      onTemplateTypeChange(format);
    }
    if (format === 'D2') {
      updateClient('accountingStandard', 'Nepal Accounting Standards (NAS)');
    } else {
      updateClient('accountingStandard', 'NAS for MEs (साना संस्थाको लागि नेपाल लेखामान)');
    }
  };

  const isD3 = auditTemplateType === 'D3';
  const isAuditorVisible = isD3 || showAuditorInD2;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Format Selection Card (Just D2 and D3 buttons, not fused with company type) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                ढाँचा चयन गर्नुहोस् (Select Format: D2 / D3)
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                प्रतिवेदनको लागि ढाँचा D2 वा D3 छान्नुहोस्
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300">
            चयन गरिएको: ढाँचा {auditTemplateType}
          </span>
        </div>

        {/* Just D2 and D3 Selection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
          {/* Button D2 */}
          <button
            type="button"
            onClick={() => selectFormat('D2')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition text-left relative flex items-center justify-between ${
              auditTemplateType === 'D2'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-13 h-13 rounded-xl flex items-center justify-center font-black text-2xl ${
                  auditTemplateType === 'D2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                D2
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    ढाँचा D2 (Format D2)
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                    लेखापरीक्षक ऐच्छिक (Optional)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  आन्तरिक राजस्व विभाग ढाँचा D-2 (Format D2)
                </p>
              </div>
            </div>
            {auditTemplateType === 'D2' && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-3 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Button D3 */}
          <button
            type="button"
            onClick={() => selectFormat('D3')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition text-left relative flex items-center justify-between ${
              auditTemplateType === 'D3'
                ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-13 h-13 rounded-xl flex items-center justify-center font-black text-2xl ${
                  auditTemplateType === 'D3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                D3
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    ढाँचा D3 (Format D3)
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-300">
                    लेखापरीक्षक अनिवार्य (Mandatory)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  आन्तरिक राजस्व विभाग ढाँचा D-3 (Format D3)
                </p>
              </div>
            </div>
            {auditTemplateType === 'D3' && (
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 ml-3 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Auditor Section Prompt when vanished in D2 */}
      {!isAuditorVisible && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 mt-0.5">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    लेखापरीक्षकको विवरण (Auditor Information)
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    ढाँचा D2 मा ऐच्छिक (Optional)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  ढाँचा D2 प्रतिवेदनको लागि लेखापरीक्षकको विवरण अनिवार्य छैन। यदि विवरण समावेश गर्न चाहनुहुन्छ भने तलको बटन थिच्नुहोस्।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAuditorInD2(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-center flex items-center gap-2"
            >
              <span>+ लेखापरीक्षक विवरण थप्नुहोस् (ऐच्छिक)</span>
            </button>
          </div>
        </div>
      )}

      {/* Auditor Firm Section (Mandatory in D3, Optional toggle in D2) */}
      {isAuditorVisible && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200 flex-wrap gap-3">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    लेखापरीक्षक तथा फर्मको विवरण (Auditor Firm Information)
                  </h2>
                  {isD3 ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                      ढाँचा D3 मा अनिवार्य (Mandatory)
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                      ढाँचा D2 मा ऐच्छिक (Optional)
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {isD3
                    ? 'ढाँचा D3 प्रतिवेदनको लागि लेखापरीक्षकको विवरण अनिवार्य छ'
                    : 'ढाँचा D2 मा यो विवरण ऐच्छिक छ। आवश्यक नभए लुकाउन सकिन्छ।'}
                </p>
              </div>
            </div>

            {/* In D2, user can collapse/hide the auditor section */}
            {!isD3 && (
              <button
                type="button"
                onClick={() => setShowAuditorInD2(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-300"
              >
                - विवरण लुकाउनुहोस् (Hide Auditor Info)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {/* Firm Name - Full Width (1 Field) */}
            <div className="md:col-span-2">
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                लेखापरीक्षक फर्मको नाम (Auditor / Firm Name) {isD3 ? <span className="text-rose-600">*</span> : <span className="text-slate-500 text-xs font-normal">(ऐच्छिक)</span>}
              </label>
              <input
                type="text"
                value={auditor.firmName}
                onChange={(e) => updateAuditor('firmName', e.target.value)}
                placeholder="लेखापरीक्षक फर्मको नाम (Auditor Firm Name)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* Registered Auditor Name - Field 1 */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                लेखापरीक्षकको नाम (Auditor's Full Name) {isD3 ? <span className="text-rose-600">*</span> : <span className="text-slate-500 text-xs font-normal">(ऐच्छिक)</span>}
              </label>
              <input
                type="text"
                value={auditor.auditorName}
                onChange={(e) => updateAuditor('auditorName', e.target.value)}
                placeholder="लेखापरीक्षकको नाम (Auditor Full Name)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* ICAN Regd No - Field 2 */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                आईक्यान दर्ता नम्बर (ICAN Regd. No.) {isD3 ? <span className="text-rose-600">*</span> : <span className="text-slate-500 text-xs font-normal">(ऐच्छिक)</span>}
              </label>
              <input
                type="text"
                value={auditor.icanRegdNo}
                onChange={(e) => updateAuditor('icanRegdNo', e.target.value)}
                placeholder="आईक्यान दर्ता नम्बर (ICAN Regd. No.)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* COP No - Field 1 */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                व्यवसायको प्रमाणपत्र (COP No. - Certificate of Practice) {isD3 ? <span className="text-rose-600">*</span> : <span className="text-slate-500 text-xs font-normal">(ऐच्छिक)</span>}
              </label>
              <input
                type="text"
                value={auditor.copNo}
                onChange={(e) => updateAuditor('copNo', e.target.value)}
                placeholder="व्यवसायको प्रमाणपत्र नं. (COP No.)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* Membership Class - Field 2 */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                लेखापरीक्षक श्रेणी (Auditor Class)
              </label>
              <select
                value={auditor.membershipClass}
                onChange={(e) => updateAuditor('membershipClass', e.target.value as any)}
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              >
                <option value="Registered Auditor">Registered Auditor (दर्तावाला लेखापरीक्षक)</option>
                <option value="Class D">Class 'D' Registered Auditor</option>
                <option value="Class C">Class 'C' Registered Auditor</option>
                <option value="Class B">Class 'B' Registered Auditor</option>
                <option value="Class A">Class 'A' Registered Auditor</option>
                <option value="FCA">FCA (Fellow Chartered Accountant)</option>
                <option value="ACA">ACA (Associate Chartered Accountant)</option>
              </select>
            </div>

            {/* Auditor PAN - Field 1 */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                लेखापरीक्षकको स्थायी लेखा नम्बर (Auditor PAN No.)
              </label>
              <input
                type="text"
                value={auditor.panNo}
                onChange={(e) => updateAuditor('panNo', e.target.value)}
                placeholder="९ अंकको प्यान नं. (9-Digit PAN)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* UDIN Number - Field 2 */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200">
              <label className={`block text-amber-950 mb-1.5 font-bold ${labelSize}`}>
                युडिन नम्बर (UDIN Number) {isD3 ? <span className="text-amber-800 text-xs font-semibold">(ICAN Mandated)</span> : <span className="text-amber-800 text-xs font-normal">(ऐच्छिक)</span>}
              </label>
              <input
                type="text"
                value={auditor.udinNumber}
                onChange={(e) => updateAuditor('udinNumber', e.target.value)}
                placeholder="युडिन नम्बर (ICAN UDIN)"
                className={`w-full bg-white border border-amber-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-amber-500 shadow-2xs ${inputSize}`}
              />
              <span className="text-[11px] text-amber-800 mt-1 block font-medium">
                नेपाल चार्टर्ड एकाउन्टेन्ट्स संस्थाको युडिन प्रणाली
              </span>
            </div>

            {/* Report Date & Place - 2 Fields Row */}
            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                प्रतिवेदन मिति (Report Date)
              </label>
              <input
                type="text"
                value={auditor.reportDate}
                onChange={(e) => updateAuditor('reportDate', e.target.value)}
                placeholder="YYYY-MM-DD"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            <div>
              <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
                लेखापरीक्षण भएको स्थान (Place of Audit)
              </label>
              <input
                type="text"
                value={auditor.reportPlace}
                onChange={(e) => updateAuditor('reportPlace', e.target.value)}
                placeholder="स्थान वा जिल्ला (Place of Audit)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs ${inputSize}`}
              />
            </div>

            {/* Firm Address with Cascade Dropdowns - Full Width (1 Field) */}
            <div className="md:col-span-2">
              <NepalAddressSelector
                label="लेखापरीक्षक फर्मको ठेगाना (Auditor Firm Address)"
                nepaliLabel="प्रदेश, जिल्ला, पालिका र वडा छनौट गर्नुहोस्"
                currentAddress={auditor.address}
                onAddressChange={(newAddr) => updateAuditor('address', newAddr)}
                fontSize={fontSize}
                required={isD3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Client Entity Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-3.5 pb-5 mb-6 border-b border-slate-200">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              लेखापरीक्षण हुने संस्था/फर्मको विवरण (Client Entity Information)
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              फर्मको आधिकारिक नाम, प्रोप्राइटर, प्यान नम्बर र आर्थिक वर्ष
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* Entity Name - Full Width (1 Field) */}
          <div className="md:col-span-2">
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              फर्म वा संस्थाको नाम (Firm / Enterprise Name) *
            </label>
            <input
              type="text"
              value={client.entityName}
              onChange={(e) => updateClient('entityName', e.target.value)}
              placeholder="फर्म वा संस्थाको नाम (Firm / Enterprise Name)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Proprietor Name - Field 1 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              प्रोप्राइटर / सञ्चालकको नाम (Proprietor's Name) *
            </label>
            <input
              type="text"
              value={client.proprietorName}
              onChange={(e) => updateClient('proprietorName', e.target.value)}
              placeholder="प्रोप्राइटर / सञ्चालकको नाम (Proprietor's Name)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Business Type - Field 2 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              व्यवसाय / कम्पनीको प्रकार (Company Structure / Category)
            </label>
            {(() => {
              const selectedCompanyOption =
                COMPANY_TYPE_OPTIONS.find((opt) => opt.label === client.businessType) ||
                COMPANY_TYPE_OPTIONS.find(
                  (opt) =>
                    opt.label.toLowerCase().includes(client.businessType?.toLowerCase() || '') ||
                    (client.businessType &&
                      opt.shortTitle.toLowerCase().includes(client.businessType.toLowerCase()))
                ) ||
                COMPANY_TYPE_OPTIONS[0];

              return (
                <div>
                  <select
                    value={selectedCompanyOption.label}
                    onChange={(e) => updateClient('businessType', e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
                  >
                    {COMPANY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Small button under it: "view details" */}
                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition cursor-pointer shadow-2xs"
                    >
                      <Info className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        {showCompanyDetails
                          ? 'विवरण लुकाउनुहोस् (Hide Details)'
                          : 'विवरण हेर्नुहोस् (View Details)'}
                      </span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-medium">
                      * छनौट गरिएको निकायको कर तथा नीतिगत व्यवस्थाहरू
                    </span>
                  </div>

                  {/* Showing only the 2 points of the selected option */}
                  {showCompanyDetails && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-indigo-50/90 border border-indigo-200 text-xs sm:text-sm text-slate-800 space-y-2 shadow-2xs">
                      <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0" />
                        <span>{selectedCompanyOption.shortTitle} — मुख्य व्यवस्थाहरू:</span>
                      </div>
                      <ul className="space-y-1.5 pl-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span className="font-medium text-slate-800">
                            {selectedCompanyOption.points[0]}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span className="font-medium text-slate-800">
                            {selectedCompanyOption.points[1]}
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Client PAN - Field 1 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              स्थायी लेखा नम्बर / भ्याट नं. (Entity PAN / VAT No.) *
            </label>
            <input
              type="text"
              value={client.panNo}
              onChange={(e) => updateClient('panNo', e.target.value)}
              placeholder="९ अंकको प्यान / भ्याट नं. (9-Digit PAN / VAT)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Registration No & Date - Field 2 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              फर्म दर्ता नम्बर तथा मिति (Firm Regd. No. & Date)
            </label>
            <input
              type="text"
              value={client.regdNo}
              onChange={(e) => updateClient('regdNo', e.target.value)}
              placeholder="दर्ता नम्बर तथा मिति (Regd. No. & Date)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Client Address with Cascade Dropdowns - Full Width (1 Field) */}
          <div className="md:col-span-2">
            <NepalAddressSelector
              label="संस्था / फर्मको ठेगाना (Client Enterprise Address)"
              nepaliLabel="प्रदेश, जिल्ला, पालिका र वडा छनौट गर्नुहोस्"
              currentAddress={client.address}
              onAddressChange={(newAddr) => updateClient('address', newAddr)}
              fontSize={fontSize}
              required
            />
          </div>

          {/* Current Fiscal Year - Field 1 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              चालु आर्थिक वर्ष (Current Fiscal Year) *
            </label>
            <input
              type="text"
              value={client.currentFiscalYear}
              onChange={(e) => updateClient('currentFiscalYear', e.target.value)}
              placeholder="आर्थिक वर्ष (Fiscal Year, उदा: 2080/081)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Previous Fiscal Year - Field 2 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              अघिल्लो आर्थिक वर्ष (Previous Fiscal Year) *
            </label>
            <input
              type="text"
              value={client.previousFiscalYear}
              onChange={(e) => updateClient('previousFiscalYear', e.target.value)}
              placeholder="अघिल्लो आर्थिक वर्ष (Fiscal Year, उदा: 2079/080)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Reporting Period End - Field 1 */}
          <div>
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              अडिट अवधि / वासलात मिति (As on Date / Period End)
            </label>
            <input
              type="text"
              value={client.reportingPeriodEnd}
              onChange={(e) => updateClient('reportingPeriodEnd', e.target.value)}
              placeholder="अन्तिम मिति (Period End Date, उदा: 2081 Asar 31)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            />
          </div>

          {/* Blank or helper info if needed, or Reporting Standards full width */}
          <div className="hidden md:block" />

          {/* Accounting Standards - Full Width (1 Field) */}
          <div className="md:col-span-2">
            <label className={`block text-slate-800 mb-2 sm:mb-2.5 ${labelSize}`}>
              लागू लेखा मापदण्ड (Applicable Financial Reporting Framework)
            </label>
            <select
              value={client.accountingStandard}
              onChange={(e) => updateClient('accountingStandard', e.target.value as any)}
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-2xs ${inputSize}`}
            >
              <option value="Nepal Accounting Standards (NAS)">
                Nepal Accounting Standards (NAS) - नेपाल लेखामान (ढाँचा D2 को लागि उपयुक्त)
              </option>
              <option value="NAS for MEs (साना संस्थाको लागि नेपाल लेखामान)">
                Nepal Accounting Standard for Micro Entities (NAS for MEs) - साना संस्थाको लागि लेखामान (ढाँचा D3 को लागि उपयुक्त)
              </option>
              <option value="NFRS for SMEs">
                Nepal Financial Reporting Standards for SMEs (NFRS for SMEs)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
