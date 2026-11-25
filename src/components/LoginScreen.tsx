import React, { useState } from 'react';
import { AppUser, authenticateUser, registerNewUser, isValidNepalPan } from '../utils/authService';
import { ShieldCheck, Lock, Phone, UserPlus, LogIn, AlertCircle, Building2, Hash, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: AppUser) => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, fontSize = 'large' }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [panNo, setPanNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = authenticateUser(identifier, panNo, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'लगइन हुन सकेन (Login failed)');
      }
    } else {
      const res = registerNewUser(identifier, panNo, password, confirmPassword);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'दर्ता हुन सकेन (Registration failed)');
      }
    }
  };

  const handleQuickLogin = (idVal: string, panVal: string, passVal: string) => {
    setIdentifier(idVal);
    setPanNo(panVal);
    setPassword(passVal);
    setError(null);
    const res = authenticateUser(idVal, panVal, passVal);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  const isPanValid = isValidNepalPan(panNo, true);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Background Decorative glow */}
      <div className="w-full max-w-xl bg-slate-800/90 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 backdrop-blur-sm">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-700 text-white mb-4 shadow-lg ring-4 ring-emerald-500/20">
            <Building2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            नेपाल अडिट रिपोर्ट प्रणाली
          </h1>
          <p className="text-emerald-400 font-medium text-sm sm:text-base mt-1">
            Nepal Audit Report Generator & Practitioner Portal
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-semibold tracking-wide">
            ICAN Standards • Income Tax Act 2058 • VAT Act 2052
          </div>
        </div>

        {/* Friendly Notice for Seniors */}
        <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3.5 mb-6 text-emerald-200 text-sm leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>आदरणीय अडिटर / लेखाव्यवसायीज्यू:</strong> कृपया कार्य सुरु गर्न आफ्नो फोन वा नाम, प्यान नम्बर र पासवर्ड प्रविष्ट गर्नुहोस्। पासवर्ड सजिलो राख्न सक्नुहुन्छ (फोन नम्बर नै पासवर्ड राखे पनि हुन्छ)।
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/70 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-3 rounded-lg text-sm sm:text-base font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span>लगइन (Sign In)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-3 rounded-lg text-sm sm:text-base font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>नयाँ दर्ता (Register)</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/80 border-2 border-rose-500/80 text-rose-200 rounded-xl p-3 mb-5 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone / Username */}
          <div>
            <label className="block text-slate-200 text-sm sm:text-base font-bold mb-1.5">
              फोन नम्बर वा प्रयोगकर्ता नाम (Phone Number / Username): *
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="फोन नम्बर वा नाम (Phone / Username)"
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-600 focus:border-emerald-500 rounded-xl text-white text-base font-medium placeholder-slate-500 focus:outline-none transition shadow-inner"
                required
              />
            </div>
          </div>

          {/* PAN Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-200 text-sm sm:text-base font-bold">
                स्थायी लेखा नम्बर (PAN Number): *
              </label>
              {panNo.trim() && (
                isPanValid ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>मान्य प्यान (Valid)</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 font-semibold">
                    ९ अंकको हुनुपर्दछ
                  </span>
                )
              )}
            </div>
            <div className="relative">
              <Hash className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={panNo}
                onChange={(e) => setPanNo(e.target.value)}
                placeholder="९ अंकको प्यान नम्बर (9-Digit PAN)"
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-600 focus:border-emerald-500 rounded-xl text-white text-base font-mono font-medium placeholder-slate-500 focus:outline-none transition shadow-inner"
                required
              />
            </div>
            {mode === 'register' && (
              <p className="text-xs text-slate-400 mt-1">
                * दर्ता गर्न ९ अंकको आन्तरिक राजस्व विभाग (IRD) प्यान नम्बर मान्य हुनुपर्छ।
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-200 text-sm sm:text-base font-bold mb-1.5">
              पासवर्ड (Password): *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड (Password)"
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-600 focus:border-emerald-500 rounded-xl text-white text-base font-medium placeholder-slate-500 focus:outline-none transition shadow-inner"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              * जे सजिलो लाग्छ त्यही राख्नुहोस्, कुनै कठिन नियम छैन (No complex password rules).
            </p>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-slate-200 text-sm sm:text-base font-bold mb-1.5">
                पासवर्ड पुनः दोहोर्याउनुहोस् (Confirm Password): *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="पासवर्ड पुनः दोहोर्याउनुहोस् (Confirm Password)"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-600 focus:border-emerald-500 rounded-xl text-white text-base font-medium placeholder-slate-500 focus:outline-none transition shadow-inner"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>प्रणालीमा प्रवेश गर्नुहोस् (Log In)</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>नयाँ खाता दर्ता गर्नुहोस् (Register Account)</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Testing Login Card for User / QA & Admin */}
        <div className="mt-8 pt-6 border-t border-slate-700/80">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
            परीक्षणको लागि सिधै १-क्लिक लगइन (Instant Test Accounts):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('apurwa', 'apurwa', 'apurwa')}
              className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/50 hover:bg-emerald-950/40 text-left transition flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold group-hover:bg-emerald-700">
                QA
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-300 text-sm">Apurwa (QA / Free Access)</div>
                <div className="text-slate-400">ID: apurwa | PAN: apurwa</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin', 'admin321')}
              className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/50 hover:bg-amber-950/40 text-left transition flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-800/80 flex items-center justify-center text-amber-300 font-bold group-hover:bg-amber-700">
                🛡️
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-300 text-sm">Admin (प्रशासक)</div>
                <div className="text-slate-400">ID: admin | Pass: admin321</div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Footer disclaimer */}
      <div className="text-center text-slate-500 text-xs mt-6">
        नेपाल लेखापरीक्षण फारम प्रणाली • सुरक्षित र प्रमाणित • Senior-Friendly Simplified UI
      </div>
    </div>
  );
};
