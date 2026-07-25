'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Users, CheckCircle, Star, Ban, Activity, Search, ChevronLeft, ChevronRight, Download, Eye, Edit3, Wallet, Users2, UserX, Trash2, MoreHorizontal, Calendar } from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'suspended' | 'banned';
  role: string;
  email_verified_at: string | null;
  created_at: string;
  profile?: {
    country?: string;
    vip_level?: number;
    level?: string;
    phone?: string;
  };
  wallets?: { type: string; balance: number }[];
  kyc_status?: 'verified' | 'pending' | 'none';
  referral_earnings?: number;
  tasks_completed?: number;
  is_online?: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  suspended: 'bg-yellow-100 text-yellow-700',
  banned: 'bg-red-100 text-red-700',
};

const vipColors: Record<string, string> = {
  bronze: 'bg-amber-100 text-amber-700',
  silver: 'bg-slate-100 text-slate-600',
  gold: 'bg-yellow-100 text-yellow-700',
  diamond: 'bg-cyan-100 text-cyan-600',
  platinum: 'bg-indigo-100 text-indigo-600',
  elite: 'bg-purple-100 text-purple-700',
  legend: 'bg-orange-100 text-orange-700',
};

const kycColors: Record<string, string> = {
  verified: 'bg-blue-100 text-blue-700',
  pending: 'bg-green-100 text-green-700',
  none: 'bg-gray-100 text-gray-500',
};

const countries = ['United States', 'Philippines', 'India', 'Nigeria', 'Egypt', 'Brazil', 'Ukraine', 'Indonesia', 'Bangladesh', 'Pakistan'];
const pageSizeOptions = [10, 20, 50, 100];

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover hover:shadow-xl hover:shadow-blue-900/5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [vipFilter, setVipFilter] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get<any>('/admin/users');
        setUsers(res.data?.data || res.data || res || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const stats = useMemo(() => ({
    total: users.length,
    verified: users.filter(u => u.email_verified_at).length,
    vip: users.filter(u => u.profile?.level && u.profile.level !== 'bronze').length,
    suspended: users.filter(u => u.status === 'suspended' || u.status === 'banned').length,
    online: users.filter(u => u.is_online).length,
  }), [users]);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && u.status !== statusFilter) return false;
      if (countryFilter && u.profile?.country !== countryFilter) return false;
      if (vipFilter && u.profile?.level !== vipFilter) return false;
      if (kycFilter) {
        const kyc = u.kyc_status || 'none';
        if (kyc !== kycFilter) return false;
      }
      if (dateFrom && new Date(u.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(u.created_at) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [users, search, statusFilter, countryFilter, vipFilter, kycFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Country', 'Status', 'VIP Level', 'KYC Status', 'Wallet Balance', 'Referral Earnings', 'Tasks Completed', 'Joined'].join(','),
      ...filtered.map(u =>
        [
          u.id,
          `"${u.name}"`,
          `"${u.email}"`,
          `"${u.phone || ''}"`,
          `"${u.profile?.country || ''}"`,
          u.status,
          u.profile?.level || '',
          u.kyc_status || 'none',
          (u.wallets?.find(w => w.type === 'main')?.balance || 0).toFixed(2),
          (u.referral_earnings || 0).toFixed(2),
          u.tasks_completed || 0,
          new Date(u.created_at).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getWalletBalance = (u: AdminUser) => {
    const main = u.wallets?.find(w => w.type === 'main');
    return main ? `$${main.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00';
  };

  const statCards = [
    { title: 'Total Users', value: stats.total.toLocaleString(), icon: <Users className="h-5 w-5" />, color: '#2D4F97' },
    { title: 'Verified', value: stats.verified.toLocaleString(), icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { title: 'VIP Members', value: stats.vip.toLocaleString(), icon: <Star className="h-5 w-5" />, color: '#F59E0B' },
    { title: 'Suspended / Banned', value: stats.suspended.toLocaleString(), icon: <Ban className="h-5 w-5" />, color: '#EF4444' },
    { title: 'Online Now', value: stats.online.toLocaleString(), icon: <Activity className="h-5 w-5" />, color: '#1E8A8D' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all platform users, roles, and account statuses.</p>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <select value={countryFilter} onChange={e => { setCountryFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <select value={vipFilter} onChange={e => { setVipFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All VIP Levels</option>
            {['bronze', 'silver', 'gold', 'diamond', 'platinum', 'elite', 'legend'].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
          <select value={kycFilter} onChange={e => { setKycFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All KYC</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="none">None</option>
          </select>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">{filtered.length} user{filtered.length !== 1 ? 's' : ''} found</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Loading users...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No users found</p>
            <p className="text-xs text-gray-300 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="px-4 lg:px-6 py-4">User</th>
                    <th className="px-4 py-4 hidden md:table-cell">ID</th>
                    <th className="px-4 py-4 hidden lg:table-cell">Email</th>
                    <th className="px-4 py-4 hidden xl:table-cell">Phone</th>
                    <th className="px-4 py-4 hidden xl:table-cell">Country</th>
                    <th className="px-4 py-4">Wallet</th>
                    <th className="px-4 py-4 hidden lg:table-cell">Referral</th>
                    <th className="px-4 py-4 hidden md:table-cell">Tasks</th>
                    <th className="px-4 py-4 hidden lg:table-cell">VIP</th>
                    <th className="px-4 py-4">KYC</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 lg:px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                            <p className="text-xs text-gray-400 md:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-sm text-gray-500 font-mono">#{u.id}</span></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><p className="text-sm text-gray-600">{u.email}</p></td>
                      <td className="px-4 py-3.5 hidden xl:table-cell"><span className="text-sm text-gray-500">{u.phone || u.profile?.phone || '—'}</span></td>
                      <td className="px-4 py-3.5 hidden xl:table-cell"><span className="text-sm text-gray-500">{u.profile?.country || '—'}</span></td>
                      <td className="px-4 py-3.5"><span className="text-sm font-semibold text-gray-900">{getWalletBalance(u)}</span></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><span className="text-sm text-gray-600">${(u.referral_earnings || 0).toLocaleString()}</span></td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-sm text-gray-600">{u.tasks_completed || 0}</span></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        {u.profile?.level ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${vipColors[u.profile.level] || 'bg-gray-100 text-gray-700'}`}>
                            {u.profile.level.charAt(0).toUpperCase() + u.profile.level.slice(1)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${kycColors[u.kyc_status || 'none']}`}>
                          {u.kyc_status ? u.kyc_status.charAt(0).toUpperCase() + u.kyc_status.slice(1) : 'None'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[u.status] || 'bg-gray-100 text-gray-700'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right relative">
                        <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                        {openMenu === u.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-1.5">
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4 text-gray-400" /> View Profile
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Edit3 className="h-4 w-4 text-gray-400" /> Edit
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Wallet className="h-4 w-4 text-gray-400" /> Wallet
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Users2 className="h-4 w-4 text-gray-400" /> Referrals
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors">
                                <UserX className="h-4 w-4" /> Suspend
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Ban className="h-4 w-4" /> Ban
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rows per page:</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  {pageSizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <span className="ml-2">{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(1)} disabled={safePage <= 1} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (safePage <= 4) {
                    pageNum = i + 1;
                  } else if (safePage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = safePage - 3 + i;
                  }
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${safePage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setPage(totalPages)} disabled={safePage >= totalPages} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
