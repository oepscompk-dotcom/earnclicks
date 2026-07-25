'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Clock, CheckCircle, XCircle, Bot, Eye, Search as SearchIcon } from 'lucide-react';

interface Submission {
  id: number;
  user?: { name: string; email: string };
  campaign?: { name: string; platform: string };
  task?: { platform: string };
  proof_url?: string;
  reward_amount: number;
  status: string;
  created_at: string;
  ai_score?: number;
}

const statusColors: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  ai_approved:  'bg-blue-100 text-blue-700',
  manual_review: 'bg-purple-100 text-purple-700',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:       { label: 'Pending Review', color: '#F59E0B' },
  approved:      { label: 'Approved',       color: '#22C55E' },
  rejected:      { label: 'Rejected',       color: '#EF4444' },
  ai_approved:   { label: 'AI Approved',    color: '#2D4F97' },
  manual_review: { label: 'Manual Review',  color: '#8B5CF6' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function aiScoreBadge(score: number) {
  const color = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  const bg = score >= 80 ? '#22C55E15' : score >= 50 ? '#F59E0B15' : '#EF444415';
  return { color, bg };
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams();
        if (filter) params.set('status', filter);
        if (search) params.set('search', search);
        const res = await api.get<any>(`/admin/submissions?${params}`);
        setSubmissions(res.data?.data || res.data || []);
      } catch { setSubmissions([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [filter, search]);

  const handleAction = async (id: number, action: string, newStatus: string) => {
    try {
      await api.post(`/admin/submissions/${id}/${action}`);
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
    } catch {}
  };

  const statCards = [
    { label: 'Pending Review', value: submissions.filter((s) => s.status === 'pending').length,       icon: <Clock className="h-5 w-5" />,       color: '#F59E0B' },
    { label: 'Approved',       value: submissions.filter((s) => s.status === 'approved').length,       icon: <CheckCircle className="h-5 w-5" />,  color: '#22C55E' },
    { label: 'Rejected',       value: submissions.filter((s) => s.status === 'rejected').length,       icon: <XCircle className="h-5 w-5" />,       color: '#EF4444' },
    { label: 'AI Approved',    value: submissions.filter((s) => s.status === 'ai_approved').length,    icon: <Bot className="h-5 w-5" />,           color: '#2D4F97' },
    { label: 'Manual Review',  value: submissions.filter((s) => s.status === 'manual_review').length,  icon: <Eye className="h-5 w-5" />,           color: '#8B5CF6' },
  ];

  const pendingCount = submissions.filter((s) => s.status === 'pending' || s.status === 'manual_review').length;

  const filtered = filter
    ? submissions.filter((s) => s.status === filter)
    : submissions;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Task Submissions</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve task submissions from workers.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by worker or campaign..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: '', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'approved', label: 'Approved' },
                { key: 'rejected', label: 'Rejected' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === t.key
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {pendingCount > 0 && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-1.5 rounded-lg">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">Worker</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Campaign</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Platform</th>
                  <th className="px-4 py-4 hidden xl:table-cell">Proof</th>
                  <th className="px-4 py-4">Time</th>
                  <th className="px-4 py-4">Reward</th>
                  <th className="px-4 py-4 hidden xl:table-cell">AI Score</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const statusStr = s.status || 'pending';
                  const statusClass = statusColors[statusStr] || 'bg-gray-100 text-gray-700';
                  const score = s.ai_score ?? null;
                  const badge = score !== null ? aiScoreBadge(score) : null;
                  const user = s.user || { name: '—', email: '' };
                  const campaignName = s.campaign?.name || s.task?.platform || '—';
                  const platform = s.campaign?.platform || s.task?.platform || '—';
                  const initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-900 font-medium">{campaignName}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-600">{platform}</p>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        {s.proof_url ? (
                          <a
                            href={s.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors"
                          >
                            <img
                              src={s.proof_url}
                              alt="Proof"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>';
                              }}
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 whitespace-nowrap">{timeAgo(s.created_at)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-green-600">${(s.reward_amount || 0).toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        {score !== null ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold"
                            style={{ background: badge!.bg, color: badge!.color }}
                          >
                            {score}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass}`}>
                          {statusConfig[statusStr]?.label || statusStr}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(s.status === 'pending' || s.status === 'manual_review') && (
                            <>
                              <button
                                onClick={() => handleAction(s.id, 'approve', 'approved')}
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAction(s.id, 'reject', 'rejected')}
                                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {s.proof_url && (
                            <a
                              href={s.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                              title="View Screenshot"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
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
