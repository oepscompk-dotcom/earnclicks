'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Megaphone, CheckCircle, Clock, Ban, Search, ChevronLeft, ChevronRight, Download, Eye, Edit3, UserX, Trash2, MoreHorizontal, DollarSign, Target, TrendingUp } from 'lucide-react';

interface AdminAdvertiser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'banned';
  email_verified_at: string | null;
  created_at: string;
  profile?: {
    country?: string;
    company?: string;
    phone?: string;
  };
  wallets?: { type: string; balance: number }[];
  active_campaigns?: number;
  total_spent?: number;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  banned: 'bg-gray-100 text-gray-700',
};

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

export default function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<AdminAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchAdvertisers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<any>('/admin/advertisers');
        setAdvertisers(res.data?.data || res.data || res || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load advertisers');
        setAdvertisers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvertisers();
  }, []);

  const stats = useMemo(() => ({
    total: advertisers.length,
    verified: advertisers.filter(a => a.email_verified_at).length,
    pending: advertisers.filter(a => a.status === 'pending').length,
    blocked: advertisers.filter(a => a.status === 'suspended' || a.status === 'banned').length,
  }), [advertisers]);

  const quickStats = useMemo(() => {
    const totalBudget = advertisers.reduce((sum, a) => sum + (a.wallets?.find(w => w.type === 'main')?.balance || 0), 0);
    const totalSpent = advertisers.reduce((sum, a) => sum + (a.total_spent || 0), 0);
    const avgBudget = advertisers.length > 0 ? totalBudget / advertisers.length : 0;
    return { totalBudget, totalSpent, avgBudget };
  }, [advertisers]);

  const filtered = useMemo(() => {
    return advertisers.filter(a => {
      if (search) {
        const q = search.toLowerCase();
        const company = a.profile?.company || '';
        if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q) && !company.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [advertisers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handleExport = () => {
    const csv = [
      ['ID', 'Company', 'Email', 'Wallet Balance', 'Active Campaigns', 'Total Spent', 'Status', 'Joined'].join(','),
      ...filtered.map(a =>
        [
          a.id,
          `"${a.profile?.company || a.name}"`,
          `"${a.email}"`,
          (a.wallets?.find(w => w.type === 'main')?.balance || 0).toFixed(2),
          a.active_campaigns || 0,
          (a.total_spent || 0).toFixed(2),
          a.status,
          new Date(a.created_at).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advertisers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getWalletBalance = (a: AdminAdvertiser) => {
    const main = a.wallets?.find(w => w.type === 'main');
    return main ? `$${main.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00';
  };

  const statCards = [
    { title: 'Total Advertisers', value: stats.total.toLocaleString(), icon: <Megaphone className="h-5 w-5" />, color: '#2D4F97' },
    { title: 'Verified', value: stats.verified.toLocaleString(), icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { title: 'Pending', value: stats.pending.toLocaleString(), icon: <Clock className="h-5 w-5" />, color: '#F59E0B' },
    { title: 'Blocked', value: stats.blocked.toLocaleString(), icon: <Ban className="h-5 w-5" />, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Advertiser Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage advertisers, review accounts, and monitor campaign activity.</p>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#2D4F9715', color: '#2D4F97' }}>
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Campaign Budget</p>
              <p className="text-lg font-bold text-gray-900">${quickStats.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#1E8A8D15', color: '#1E8A8D' }}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Spending</p>
              <p className="text-lg font-bold text-gray-900">${quickStats.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#18C97A15', color: '#18C97A' }}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Avg Campaign Budget</p>
              <p className="text-lg font-bold text-gray-900">${quickStats.avgBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, or company..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <span className="text-xs text-gray-400">{filtered.length} advertiser{filtered.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Loading advertisers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Megaphone className="h-12 w-12 text-red-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Failed to load advertisers</p>
            <p className="text-xs text-gray-400 mt-1">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 inline-flex items-center gap-2 bg-blue-500 text-white rounded-xl px-4 py-2 text-sm hover:bg-blue-600 transition-colors">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No advertisers found</p>
            <p className="text-xs text-gray-300 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    <th className="px-4 lg:px-6 py-4">Advertiser</th>
                    <th className="px-4 py-4 hidden lg:table-cell">Email</th>
                    <th className="px-4 py-4">Wallet</th>
                    <th className="px-4 py-4 hidden md:table-cell">Active Campaigns</th>
                    <th className="px-4 py-4 hidden lg:table-cell">Total Spent</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 lg:px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(a.profile?.company || a.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{a.profile?.company || a.name}</p>
                            <p className="text-xs text-gray-400 lg:hidden">{a.email}</p>
                            {a.profile?.company && <p className="text-xs text-gray-400 hidden lg:block">{a.name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><p className="text-sm text-gray-600">{a.email}</p></td>
                      <td className="px-4 py-3.5"><span className="text-sm font-semibold text-gray-900">{getWalletBalance(a)}</span></td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-sm text-gray-600">{a.active_campaigns || 0}</span></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><span className="text-sm font-medium text-gray-900">${(a.total_spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right relative">
                        <button onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                        {openMenu === a.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-1.5">
                              {a.status === 'pending' && (
                                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors">
                                  <CheckCircle className="h-4 w-4" /> Approve
                                </button>
                              )}
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4 text-gray-400" /> View Profile
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <Edit3 className="h-4 w-4 text-gray-400" /> Edit
                              </button>
                              {a.status !== 'suspended' && a.status !== 'banned' && (
                                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors">
                                  <UserX className="h-4 w-4" /> Suspend
                                </button>
                              )}
                              <div className="border-t border-gray-100 my-1" />
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
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${safePage === pageNum ? 'bg-teal-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
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
