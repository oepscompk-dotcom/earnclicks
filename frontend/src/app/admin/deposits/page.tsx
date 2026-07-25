'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getInitials, truncate, formatCurrency, formatDate } from '@/lib/utils';
import { ArrowDownLeft, Clock, CheckCircle, XCircle, Search, Download, MoreHorizontal, Eye, Check, Ban } from 'lucide-react';

interface DepositUser {
  name: string;
  email: string;
}

interface Deposit {
  id: number;
  user: DepositUser;
  amount: number;
  network: 'trc20' | 'bep20' | 'erc20';
  tx_hash: string;
  status: string;
  confirmations: number;
  created_at: string;
}

interface DepositStats {
  today: number;
  pending: number;
  successful: number;
  failed: number;
  todayAmount: number;
  pendingAmount: number;
  successfulAmount: number;
  failedAmount: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const networkColors: Record<string, string> = {
  trc20: 'bg-blue-100 text-blue-700 border-blue-200',
  bep20: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  erc20: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (networkFilter) params.set('network', networkFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<any>(`/admin/deposits?${params}`);
      setDeposits(res.data?.data || res.data || []);
    } catch {
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [search, networkFilter, statusFilter]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const approve = async (id: number) => {
    try {
      await api.post(`/admin/deposits/${id}/approve`);
      setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'completed' } : d)));
    } catch {}
    setOpenMenu(null);
  };

  const reject = async (id: number) => {
    try {
      await api.post(`/admin/deposits/${id}/reject`);
      setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d)));
    } catch {}
    setOpenMenu(null);
  };

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const stats: DepositStats = deposits.reduce(
    (acc, d) => {
      const amt = Number(d.amount);
      if (isToday(d.created_at)) {
        acc.today++;
        acc.todayAmount += amt;
      }
      if (d.status === 'pending') {
        acc.pending++;
        acc.pendingAmount += amt;
      }
      if (d.status === 'completed') {
        acc.successful++;
        acc.successfulAmount += amt;
      }
      if (d.status === 'rejected' || d.status === 'failed') {
        acc.failed++;
        acc.failedAmount += amt;
      }
      return acc;
    },
    { today: 0, pending: 0, successful: 0, failed: 0, todayAmount: 0, pendingAmount: 0, successfulAmount: 0, failedAmount: 0 }
  );

  const statCards = [
    { label: "Today's Deposits", value: stats.today, amount: stats.todayAmount, icon: <ArrowDownLeft className="h-5 w-5" />, color: '#2D4F97' },
    { label: 'Pending', value: stats.pending, amount: stats.pendingAmount, icon: <Clock className="h-5 w-5" />, color: '#F59E0B' },
    { label: 'Successful', value: stats.successful, amount: stats.successfulAmount, icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { label: 'Failed', value: stats.failed, amount: stats.failedAmount, icon: <XCircle className="h-5 w-5" />, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Deposits</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user deposits and wallet top-ups.</p>
        </div>
        <button className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-green-600 font-medium">${(s.amount || 0).toFixed(2)}</p>
              </div>
            </div>
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
                placeholder="Search by user or tx hash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Networks</option>
              <option value="trc20">TRC20</option>
              <option value="bep20">BEP20</option>
              <option value="erc20">ERC20</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="failed">Failed</option>
            </select>
            <span className="text-xs text-gray-400">{deposits.length} deposits</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : deposits.length === 0 ? (
          <div className="text-center py-16">
            <ArrowDownLeft className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No deposits found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">User</th>
                  <th className="px-4 py-4">Network</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Tx Hash</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Confirmations</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(d.user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{d.user.name}</p>
                          <p className="text-xs text-gray-400">{d.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${networkColors[d.network] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {d.network.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-green-600">+${Number(d.amount).toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        {truncate(d.tx_hash, 16)}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{d.confirmations ?? '-'}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(d.created_at)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      {d.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approve(d.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(d.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                      {openMenu === d.id && d.status !== 'pending' && (
                        <div className="absolute right-0 top-12 z-50 w-44 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2">
                          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
