'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Play, Clock, Pause, CheckCircle, XCircle, List, Search, ChevronDown, Eye, Edit, Trash2, PlayCircle, ArrowUpDown } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  advertiser?: { name: string; email: string };
  platform: string;
  reward_per_task: number;
  total_budget: number;
  spent: number;
  submissions_count: number;
  countries: string | string[];
  status: string;
  created_at: string;
}

type SortKey = 'name' | 'reward_per_task' | 'total_budget' | 'submissions_count' | 'status' | 'created_at';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',    color: '#22C55E', bg: '#22C55E15' },
  pending:   { label: 'Pending',   color: '#F59E0B', bg: '#F59E0B15' },
  paused:    { label: 'Paused',    color: '#F97316', bg: '#F9731615' },
  completed: { label: 'Completed', color: '#2D4F97', bg: '#2D4F9715' },
  rejected:  { label: 'Rejected',  color: '#EF4444', bg: '#EF444415' },
};

const platformColors: Record<string, string> = {
  facebook:  '#1877F2',
  youtube:   '#FF0000',
  tiktok:    '#000000',
  instagram: '#E4405F',
  twitter:   '#1DA1F2',
  telegram:  '#26A5E4',
};

const platforms = Object.keys(platformColors);
const statuses = Object.keys(statusConfig);

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (platformFilter) params.set('platform', platformFilter);
        if (statusFilter) params.set('status', statusFilter);
        if (countryFilter) params.set('country', countryFilter);
        const res = await api.get<any>(`/admin/campaigns?${params}`);
        setCampaigns(res.data?.data || res.data || []);
      } catch { setCampaigns([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [search, platformFilter, statusFilter, countryFilter]);

  const handleAction = async (id: number, action: string, newStatus: string) => {
    try {
      await api.post(`/admin/campaigns/${id}/${action}`);
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    } catch {}
  };

  const sorted = useMemo(() => {
    const list = [...campaigns];
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === 'string' && typeof bVal === 'string'
        ? aVal.localeCompare(bVal)
        : Number(aVal) - Number(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [campaigns, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const statCards = [
    { label: 'Active',    value: campaigns.filter((c) => c.status === 'active').length,    icon: <Play className="h-5 w-5" />,        color: '#22C55E' },
    { label: 'Pending',   value: campaigns.filter((c) => c.status === 'pending').length,   icon: <Clock className="h-5 w-5" />,        color: '#F59E0B' },
    { label: 'Paused',    value: campaigns.filter((c) => c.status === 'paused').length,    icon: <Pause className="h-5 w-5" />,        color: '#F97316' },
    { label: 'Completed', value: campaigns.filter((c) => c.status === 'completed').length, icon: <CheckCircle className="h-5 w-5" />,   color: '#2D4F97' },
    { label: 'Rejected',  value: campaigns.filter((c) => c.status === 'rejected').length,  icon: <XCircle className="h-5 w-5" />,       color: '#EF4444' },
    { label: 'Total',     value: campaigns.length,                                         icon: <List className="h-5 w-5" />,          color: '#1E8A8D' },
  ];

  const totalBudget = campaigns.reduce((s, c) => s + (c.total_budget || 0), 0);
  const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const avgReward = campaigns.length ? campaigns.reduce((s, c) => s + (c.reward_per_task || 0), 0) / campaigns.length : 0;
  const completedCampaigns = campaigns.filter((c) => c.status === 'completed').length;
  const completionRate = campaigns.length ? Math.round((completedCampaigns / campaigns.length) * 100) : 0;

  const allCountries = Array.from(new Set(campaigns.flatMap((c) => {
    const val = c.countries;
    return Array.isArray(val) ? val : val ? val.split(',').map((s: string) => s.trim()) : [];
  }))).sort();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-sm text-gray-500 mt-1">Review, approve, and manage all advertiser campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Budget', value: `$${(totalBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#2D4F97' },
          { label: 'Total Spent', value: `$${(totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#1E8A8D' },
          { label: 'Avg Reward', value: `$${avgReward.toFixed(2)}`, color: '#18C97A' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-lg font-bold text-gray-900" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by campaign name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{statusConfig[s].label}</option>
              ))}
            </select>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Countries</option>
              {allCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-xs text-gray-400 whitespace-nowrap">{campaigns.length} campaigns</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <List className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No campaigns found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-gray-600">
                      Campaign <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 hidden lg:table-cell">Advertiser</th>
                  <th className="px-4 py-4">Platform</th>
                  <th className="px-4 py-4">
                    <button onClick={() => toggleSort('reward_per_task')} className="flex items-center gap-1 hover:text-gray-600">
                      Reward <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 hidden lg:table-cell">
                    <button onClick={() => toggleSort('total_budget')} className="flex items-center gap-1 hover:text-gray-600">
                      Budget <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 hidden xl:table-cell">
                    <button onClick={() => toggleSort('submissions_count')} className="flex items-center gap-1 hover:text-gray-600">
                      Workers <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 hidden xl:table-cell">Progress</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Country</th>
                  <th className="px-4 py-4">
                    <button onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-gray-600">
                      Status <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => {
                  const cfg = statusConfig[c.status] || { label: c.status, color: '#6B7280', bg: '#6B728015' };
                  const platColor = platformColors[c.platform?.toLowerCase()] || '#6B7280';
                  const countries = Array.isArray(c.countries)
                    ? c.countries.join(', ')
                    : c.countries || '—';
                  const progress = c.total_budget && c.total_budget > 0
                    ? Math.min(Math.round(((c.spent || 0) / c.total_budget) * 100), 100)
                    : 0;

                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400 lg:hidden">{c.advertiser?.name || '—'}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-900">{c.advertiser?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{c.advertiser?.email || ''}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: `${platColor}15`, color: platColor }}
                        >
                          {c.platform || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-green-600">${(c.reward_per_task || 0).toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm font-semibold text-gray-900">${(c.total_budget || 0).toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <p className="text-sm text-gray-700">{c.submissions_count || 0}</p>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${progress}%`, background: `linear-gradient(90deg, #2D4F97, #18C97A)` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 w-8 text-right">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{countries}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(c.id, 'approve', 'active')}
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAction(c.id, 'reject', 'rejected')}
                                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {c.status === 'active' && (
                            <button
                              onClick={() => handleAction(c.id, 'pause', 'paused')}
                              className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                              title="Pause"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                          {c.status === 'paused' && (
                            <button
                              onClick={() => handleAction(c.id, 'resume', 'active')}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                              title="Resume"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
