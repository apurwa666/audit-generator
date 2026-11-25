import React, { useState, useEffect } from 'react';
import {
  NEPAL_PROVINCES,
  NepalProvince,
  NepalDistrict,
  getWardsForMunicipality,
  DISTRICT_MAX_WARDS,
} from '../data/nepalLocations';
import { MapPin, Check, ChevronDown, Lock } from 'lucide-react';

interface NepalAddressSelectorProps {
  label: string;
  nepaliLabel: string;
  currentAddress: string;
  onAddressChange: (newAddress: string) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  required?: boolean;
}

export const NepalAddressSelector: React.FC<NepalAddressSelectorProps> = ({
  label,
  nepaliLabel,
  currentAddress,
  onAddressChange,
  fontSize,
  required = false,
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('bagmati');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('kathmandu');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>(
    'Kathmandu Metropolitan City (काठमाडौँ महानगरपालिका)'
  );
  const [wardNo, setWardNo] = useState<string>('1');
  const [tole, setTole] = useState<string>('');
  const [customMunicipality, setCustomMunicipality] = useState<string>('');

  // Find active province and district
  const activeProvince =
    NEPAL_PROVINCES.find((p) => p.id === selectedProvinceId) || NEPAL_PROVINCES[0];
  const activeDistrict =
    activeProvince.districts.find((d) => d.id === selectedDistrictId) ||
    activeProvince.districts[0];

  // Calculate maximum wards dynamically according to selected district and municipality
  const currentMaxWards = getWardsForMunicipality(
    selectedDistrictId,
    selectedMunicipality === 'custom' ? customMunicipality : selectedMunicipality
  );

  // Initialize from currentAddress prop if present on mount
  useEffect(() => {
    if (!currentAddress || currentAddress.trim() === '') return;

    // 1. Try to find matching province
    let matchedProv = NEPAL_PROVINCES.find(
      (p) =>
        currentAddress.toLowerCase().includes(p.nameEn.toLowerCase()) ||
        currentAddress.includes(p.nameNp)
    );
    if (!matchedProv) matchedProv = activeProvince;

    // 2. Try to find matching district within province or across all provinces
    let matchedDist: NepalDistrict | undefined;
    if (matchedProv) {
      matchedDist = matchedProv.districts.find(
        (d) =>
          currentAddress.toLowerCase().includes(d.nameEn.toLowerCase()) ||
          currentAddress.includes(d.nameNp)
      );
    }
    if (!matchedDist) {
      for (const p of NEPAL_PROVINCES) {
        const found = p.districts.find(
          (d) =>
            currentAddress.toLowerCase().includes(d.nameEn.toLowerCase()) ||
            currentAddress.includes(d.nameNp)
        );
        if (found) {
          matchedProv = p;
          matchedDist = found;
          break;
        }
      }
    }
    if (!matchedDist) matchedDist = activeDistrict;

    // 3. Try to find matching municipality
    let matchedMuni = matchedDist.municipalities[0] || '';
    for (const m of matchedDist.municipalities) {
      const cleanM = m.split('(')[0].trim().toLowerCase();
      if (currentAddress.toLowerCase().includes(cleanM)) {
        matchedMuni = m;
        break;
      }
    }

    // 4. Try to parse ward number
    const wardMatch = currentAddress.match(/(?:-|\bward\s*|\bवडा\s*|वडा नं\.\s*)(\d{1,2})/i);
    const maxW = getWardsForMunicipality(matchedDist.id, matchedMuni);
    let matchedWard = '1';
    if (wardMatch && wardMatch[1]) {
      const parsedNum = parseInt(wardMatch[1], 10);
      if (parsedNum >= 1 && parsedNum <= maxW) {
        matchedWard = parsedNum.toString();
      } else if (parsedNum > maxW) {
        matchedWard = maxW.toString();
      }
    }

    // 5. Try to parse tole if separated by comma
    const parts = currentAddress.split(',').map((s) => s.trim());
    if (parts.length > 2) {
      // First part might be tole if it doesn't contain municipality keywords
      const first = parts[0];
      if (
        !first.includes('Municipality') &&
        !first.includes('नगरपालिका') &&
        !first.includes('गाउँपालिका') &&
        !first.includes('Metropolitan')
      ) {
        setTole(first);
      }
    }

    if (matchedProv) setSelectedProvinceId(matchedProv.id);
    if (matchedDist) setSelectedDistrictId(matchedDist.id);
    setSelectedMunicipality(matchedMuni);
    setWardNo(matchedWard);
  }, []); // Run on initial mount

  // Assemble full address whenever user makes a selection
  const updateFormattedAddress = (
    pId = selectedProvinceId,
    dId = selectedDistrictId,
    muni = selectedMunicipality,
    customMuni = customMunicipality,
    ward = wardNo,
    t = tole
  ) => {
    const prov = NEPAL_PROVINCES.find((p) => p.id === pId) || activeProvince;
    const dist = prov.districts.find((d) => d.id === dId) || activeDistrict;

    const muniName = muni === 'custom' ? customMuni.trim() : muni;
    // Extract base municipality name if bilingual: e.g. "Tarakeshwor Municipality"
    let cleanMuni = muniName;
    if (muniName.includes('(')) {
      cleanMuni = muniName.split('(')[0].trim();
    }

    const parts: string[] = [];
    if (t.trim()) {
      parts.push(t.trim());
    }
    if (cleanMuni) {
      parts.push(ward ? `${cleanMuni}-${ward}` : cleanMuni);
    }
    if (dist) {
      parts.push(dist.nameEn);
    }
    if (prov) {
      parts.push(prov.nameEn);
    }

    const formatted = parts.join(', ');
    if (formatted) {
      onAddressChange(formatted);
    }
  };

  // When province changes, update district to first one in list, update municipality & adjust wards
  const handleProvinceChange = (pId: string) => {
    setSelectedProvinceId(pId);
    const prov = NEPAL_PROVINCES.find((p) => p.id === pId);
    if (prov && prov.districts.length > 0) {
      const newDist = prov.districts[0];
      const newDistId = newDist.id;
      const newMuni = newDist.municipalities[0] || '';
      setSelectedDistrictId(newDistId);
      setSelectedMunicipality(newMuni);
      setCustomMunicipality('');

      const newMaxWards = getWardsForMunicipality(newDistId, newMuni);
      const currentNum = parseInt(wardNo, 10) || 1;
      const validWard = currentNum > newMaxWards ? '1' : wardNo;
      setWardNo(validWard);

      updateFormattedAddress(pId, newDistId, newMuni, '', validWard, tole);
    }
  };

  // When district changes, update municipality & adjust wards
  const handleDistrictChange = (dId: string) => {
    setSelectedDistrictId(dId);
    const dist = activeProvince.districts.find((d) => d.id === dId);
    const newMuni = dist && dist.municipalities.length > 0 ? dist.municipalities[0] : '';
    setSelectedMunicipality(newMuni);
    setCustomMunicipality('');

    const newMaxWards = getWardsForMunicipality(dId, newMuni);
    const currentNum = parseInt(wardNo, 10) || 1;
    const validWard = currentNum > newMaxWards ? '1' : wardNo;
    setWardNo(validWard);

    updateFormattedAddress(selectedProvinceId, dId, newMuni, '', validWard, tole);
  };

  // When municipality changes, adjust wards according to that specific municipality
  const handleMunicipalityChange = (muni: string) => {
    setSelectedMunicipality(muni);
    const effectiveMuni = muni === 'custom' ? customMunicipality : muni;
    const newMaxWards = getWardsForMunicipality(selectedDistrictId, effectiveMuni);
    const currentNum = parseInt(wardNo, 10) || 1;
    const validWard = currentNum > newMaxWards ? '1' : wardNo;
    setWardNo(validWard);

    updateFormattedAddress(
      selectedProvinceId,
      selectedDistrictId,
      muni,
      customMunicipality,
      validWard,
      tole
    );
  };

  // When custom municipality name is entered
  const handleCustomMunicipalityChange = (customName: string) => {
    setCustomMunicipality(customName);
    const newMaxWards = getWardsForMunicipality(selectedDistrictId, customName);
    const currentNum = parseInt(wardNo, 10) || 1;
    const validWard = currentNum > newMaxWards ? '1' : wardNo;
    setWardNo(validWard);

    updateFormattedAddress(
      selectedProvinceId,
      selectedDistrictId,
      'custom',
      customName,
      validWard,
      tole
    );
  };

  // When ward number changes
  const handleWardChange = (newWard: string) => {
    setWardNo(newWard);
    updateFormattedAddress(
      selectedProvinceId,
      selectedDistrictId,
      selectedMunicipality,
      customMunicipality,
      newWard,
      tole
    );
  };

  // When tole changes
  const handleToleChange = (newTole: string) => {
    setTole(newTole);
    updateFormattedAddress(
      selectedProvinceId,
      selectedDistrictId,
      selectedMunicipality,
      customMunicipality,
      wardNo,
      newTole
    );
  };

  const labelClass =
    fontSize === 'xlarge'
      ? 'text-lg font-bold'
      : fontSize === 'large'
      ? 'text-base font-bold'
      : 'text-sm font-bold';

  const selectClass =
    fontSize === 'xlarge'
      ? 'text-lg p-3.5'
      : fontSize === 'large'
      ? 'text-base p-3'
      : 'text-sm sm:text-base p-2.5';

  return (
    <div className="bg-slate-50/90 border border-slate-300 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
        <label className={`text-slate-900 flex items-center gap-2 ${labelClass}`}>
          <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            {label} ({nepaliLabel}) {required && <span className="text-rose-600 font-bold">*</span>}
          </span>
        </label>

        <span className="text-xs sm:text-sm bg-emerald-50 text-emerald-900 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>जिल्ला र पालिका अनुसार स्वचालित वडा (Dynamic Wards by District)</span>
        </span>
      </div>

      <div className="space-y-5">
        {/* Cascading Dropdowns Grid - Maximum 2 Fields Per Row for Spaciousness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Province / State */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-bold mb-2">
              १. प्रदेश (Province / State) *
            </label>
            <select
              value={selectedProvinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs ${selectClass}`}
            >
              {NEPAL_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nameNp} ({prov.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* 2. District */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-bold mb-2">
              २. जिल्ला (District) *
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs ${selectClass}`}
            >
              {activeProvince.districts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.nameNp} ({dist.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Municipality / Local Body */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-bold mb-2">
              ३. पालिका (Municipality) *
            </label>
            <select
              value={selectedMunicipality}
              onChange={(e) => handleMunicipalityChange(e.target.value)}
              className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs ${selectClass}`}
            >
              <option value="">-- छनौट गर्नुहोस् (Select) --</option>
              {activeDistrict.municipalities.map((muni, idx) => (
                <option key={idx} value={muni}>
                  {muni}
                </option>
              ))}
              <option value="custom">अन्य / उल्लेख गर्नुहोस् (Other / Custom)...</option>
            </select>
          </div>

          {/* 4. Ward No - Dynamically generated according to District & Municipality */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <label className="text-slate-700 text-xs sm:text-sm font-bold">
                ४. वडा नं. (Ward No.) *
              </label>
              <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                कुल {currentMaxWards} वडा (१ देखि {currentMaxWards})
              </span>
            </div>
            <select
              value={wardNo}
              onChange={(e) => handleWardChange(e.target.value)}
              className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs ${selectClass}`}
            >
              {Array.from({ length: currentMaxWards }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w.toString()}>
                  वडा नं. {w} (Ward {w})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              छनौट गरिएको पालिका र जिल्ला अनुसार कुल {currentMaxWards} वडाहरू मात्र उपलब्ध छन्।
            </p>
          </div>
        </div>

        {/* If user selected custom municipality */}
        {selectedMunicipality === 'custom' && (
          <div className="pt-2">
            <label className="block text-slate-700 text-xs sm:text-sm font-bold mb-2">
              पालिकाको नाम लेख्नुहोस् (Specify Municipality Name)
            </label>
            <input
              type="text"
              value={customMunicipality}
              onChange={(e) => handleCustomMunicipalityChange(e.target.value)}
              placeholder="गाउँपालिका वा नगरपालिकाको नाम (Municipality)"
              className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${selectClass}`}
            />
          </div>
        )}

        {/* 5. Tole / Street / Locality */}
        <div>
          <label className="block text-slate-700 text-xs sm:text-sm font-bold mb-2">
            ५. टोल / सडक / ठाउँको नाम (Tole / Street / Area - ऐच्छिक Optional)
          </label>
          <input
            type="text"
            value={tole}
            onChange={(e) => handleToleChange(e.target.value)}
            placeholder="टोल, सडक वा चोकको नाम (Tole / Street Name)"
            className={`w-full bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs ${selectClass}`}
          />
        </div>

        {/* Auto-filled Official Address Display (Locked & Read-only) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>स्वतः तयार भएको आधिकारिक ठेगाना (Auto-generated Official Address):</span>
            </label>
            <span className="text-xs bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-md font-bold font-mono">
              परिवर्तन गर्न नमिल्ने (LOCKED / READ-ONLY)
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={currentAddress || 'ठेगाना छनौट गर्नुहोस् (Please select from dropdowns above)'}
              readOnly
              disabled
              className="w-full bg-slate-100 border border-slate-300 rounded-xl text-slate-900 font-bold px-4 py-3 text-sm sm:text-base cursor-not-allowed select-none font-mono shadow-inner"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            * माथिका प्रदेश, जिल्ला, पालिका र वडा छान्दा यो ठेगाना स्वतः भरिन्छ। यो फिल्ड सुरक्षित (Read-only) गरिएको छ।
          </p>
        </div>
      </div>
    </div>
  );
};
