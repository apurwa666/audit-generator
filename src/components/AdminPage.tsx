import React, { useState } from 'react';
import { AppUser, getStoredUsers, saveUsers, adminAddUser, deleteStoredUser } from '../utils/authService';
import { AuditData } from '../types/audit';
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Building,
  KeyRound,
  FileCheck,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface AdminPageProps {
  currentUser: AppUser;
  onBackToAudit: () => void;
  onLogout: () => void;
  currentAuditData: AuditData;
  onLoadAuditRecord?: (data: AuditData) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onBackToAudit,
  onLogout,
  currentAuditData,
  onLoadAuditRecord,
}) => {
  const [users, setUsers] = useState<AppUser[]>(() => getStoredUsers());
  const [newUsername, setNewUsername] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [msg, setMsg] = useState<string | null>(null);

  const refreshUserList = () => {
    setUsers(getStoredUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const res = adminAddUser(newUsername, newPan, newPassword, newRole);
    if (res.success) {
      setMsg(`प्रयोगकर्ता "${newUsername}" सफलतापूर्वक थपियो (User added successfully).`);
      setNewUsername('');
      setNewPan('');
      setNewPassword('');
      refreshUserList();
    } else {
      setMsg(res.message || 'Error creating user');
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`के तपाईं प्रयोगकर्ता "${name}" हटाउन निश्चित हुनुहुन्छ? (Delete user ${name}?)`)) {
      deleteStoredUser(id);
      refreshUserList();
      setMsg(`प्रयोगकर्ता "${name}" हटाइयो (User removed).`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
              🛡️
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                प्रशासक कन्ट्रोल प्यानल (Admin Dashboard)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Chief Auditor
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Authorized Session: <strong>{currentUser.identifier}</strong> (Level: Full System Admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToAudit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>मुख्य अडिट फारममा जानुहोस् (Return to Audit Workspace)</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-600 text-slate-300 hover:text-white font-medium text-sm transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>लगआउट (Sign Out)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl w-full mx-auto p-6 space-y-8 flex-1">
        {/* Status Notification */}
        {msg && (
          <div className="bg-emerald-950/80 border-2 border-emerald-500/80 text-emerald-200 rounded-xl p-4 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{msg}</span>
            </div>
            <button onClick={() => setMsg(null)} className="text-emerald-400 hover:text-white font-bold">
              ✕
            </button>
          </div>
        )}

        {/* System Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                दर्ता भएका प्रयोगकर्ता (Registered Users)
              </span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">{users.length}</div>
            <p className="text-xs text-slate-400 mt-1">1 Administrator, {users.length - 1} Registered Practitioners</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                हालको अडिट क्लाइन्ट (Active Audit Client)
              </span>
              <Building className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mt-2 truncate">
              {currentAuditData.client.entityName || 'No Client Selected'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              PAN: {currentAuditData.client.panNo || 'N/A'} • F.Y. {currentAuditData.client.currentFiscalYear}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                लागू अडिट मापदण्ड (Standards Compliance)
              </span>
              <FileCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-lg font-bold text-sky-300 mt-2 truncate">
              {currentAuditData.client.accountingStandard}
            </div>
            <p className="text-xs text-slate-400 mt-1">ICAN Auditing Guidelines & Nepal Tax Code</p>
          </div>
        </div>

        {/* Section 1: User Management */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>प्रयोगकर्ता व्यवस्थापन (Practitioners & QA Users)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                प्रणालीमा लगइन गर्न सक्ने सबै अडिटर र QA प्रयोगकर्ताहरूको सूची
              </p>
            </div>

            <button
              onClick={refreshUserList}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>सूची ताजा गर्नुहोस् (Refresh)</span>
            </button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs font-bold border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">फोन / युजरनेम (Identifier)</th>
                  <th className="py-3 px-4">प्यान नम्बर (PAN)</th>
                  <th className="py-3 px-4">भूमिका (Role)</th>
                  <th className="py-3 px-4">पासवर्ड (Password)</th>
                  <th className="py-3 px-4">दर्ता मिति (Registered Date)</th>
                  <th className="py-3 px-4 text-right">कार्य (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-700/30">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                        {u.identifier.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.identifier}</span>
                      {u.identifier === 'admin' && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                          Admin
                        </span>
                      )}
                      {u.identifier === 'apurwa' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                          QA Tester
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-400 font-bold">
                      {u.panNo || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-900/60 text-amber-200 border border-amber-700'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {u.role === 'admin' ? 'प्रशासक (Admin)' : 'लेखापरीक्षक (Practitioner)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{u.passwordHash}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{u.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      {u.identifier !== 'admin' && u.identifier !== 'apurwa' ? (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.identifier)}
                          className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाउनुहोस् (Delete)</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">सुरक्षित खाता (System Protected)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Form */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>नयाँ प्रयोगकर्ता थप्नुहोस् (Create New Practitioner User):</span>
            </h3>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  प्रयोगकर्ता नाम वा फोन (Phone / Username) *
                </label>
                <input
                  type="text"
                  placeholder="फोन वा नाम (Phone / Username)"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  ९ अंकको प्यान (9-Digit PAN) *
                </label>
                <input
                  type="text"
                  placeholder="९ अंकको प्यान (9-Digit PAN)"
                  value={newPan}
                  onChange={(e) => setNewPan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  पासवर्ड (Password) *
                </label>
                <input
                  type="text"
                  placeholder="पासवर्ड (Password)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                  भूमिका (User Role)
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="user">लेखापरीक्षक प्रयोगकर्ता (Auditor User)</option>
                  <option value="admin">प्रशासक (Administrator)</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>खाता दर्ता गर्नुहोस् (Create Practitioner User Account)</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Section 2: Audit Template Architecture (D2 vs D3) */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>नेपाल अडिट ढाँचा विवरण (Audit Report Template Architecture: D2 vs D3)</span>
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            प्रयोगकर्ताको आवश्यकता अनुसार दुई फरक ढाँचा (D2 र D3) मा अडिट रिपोर्ट तयार गरिन्छ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-500/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  ढाँचा D2 (Format D2)
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  NAS Standard
                </span>
              </div>
              <h3 className="font-bold text-base text-white">एकलौटी व्यापारिक / उत्पादन फर्म (Sole Proprietorship)</h3>
              <p className="text-xs text-slate-400 mt-1">
                उदाहरण: एन.एस. स्टिल फर्निचर सेन्टर (N.S. Steel Furniture Center)
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Schedule 1: Proprietor's Capital Account (Opening + Additions + Profit - Drawings)</li>
                <li>• Standard Nepal Accounting Standards (NAS) format</li>
                <li>• Single Proprietor equity movement disclosure</li>
                <li>• Direct trading & production expense schedules</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-500/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  ढाँचा D3 (Format D3)
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                  NAS for MEs Standard
                </span>
              </div>
              <h3 className="font-bold text-base text-white">निर्माण सामग्री / सप्लायर्स फर्म (Contracting & Suppliers)</h3>
              <p className="text-xs text-slate-400 mt-1">
                उदाहरण: मे. साझा निर्माण सामग्री सप्लायर्स (Sajha Nirman Samagri Suppliers)
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                <li>• Note 3: NAS for MEs (साना संस्थाको लागि लेखामान) Disclosures</li>
                <li>• Extended Current Liabilities (Bank Overdraft, Audit Fee TDS, Transportation TDS)</li>
                <li>• Comprehensive Reserve & Surplus account (Schedule 2)</li>
                <li>• Section 14 Disallowed Interest Note for Tax assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-500 text-xs py-4 px-6 border-t border-slate-800 text-center">
        Nepal Audit Software • Admin Portal • ICAN Compliance System
      </footer>
    </div>
  );
};
