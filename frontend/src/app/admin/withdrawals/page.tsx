'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getInitials, truncate, formatCurrency, formatDate } from '@/lib/utils';
import { Clock, ThumbsUp, XCircle, CheckCircle, DollarSign, Search, Download, ExternalLink, MoreHorizontal, Eye, Ban, Check } from 'lucide-react';

interface WithdrawalUser {
  name: string;
  email: string;
}

interface Withdrawal {
  id: number;
  user: WithdrawalUser;
  wallet_address: string;
  network: 'trc20' | 'bep20' | 'erc20';
  amount: number;
  fee: number;
  net_amount: number;
  tx_hash: string | null;
  status: string;
  created_at: string;
}

interface WithdrawalStats {
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  totalPaid: number;
  pendingAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
  completedAmount: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const networkColors: Record<string, string> = {
  trc20: 'bg-blue-100 text-blue-700 border-blue-200',
  bep20: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  erc20: 'bg-purple-100 text-purple-700 border-purple-200',
};

const networkExplorers: Record<string, string> = {
  trc20: 'https://tronscan.org/#/transaction/',
  bep20: 'https://bscscan.com/tx/',
  erc20: 'https://etherscan.io/tx/',
};

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (networkFilter) params.set('network', networkFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<any>(`/admin/withdrawals?${params}`);
      setWithdrawals(res.data?.data || res.data || []);
    } catch {
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, [search, networkFilter, statusFilter]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const approve = async (id: number) => {
    try {
      await api.post(`/admin/withdrawals/${id}/approve`);
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'approved' } : w)));
    } catch {}
    setOpenMenu(null);
  };

  const reject = async (id: number) => {
    try {
      await api.post(`/admin/withdrawals/${id}/reject`);
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w)));
    } catch {}
    setOpenMenu(null);
  };

  const complete = async (id: number) => {
    try {
      await api.post(`/admin/withdrawals/${id}/complete`);
      setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'completed' } : w)));
    } catch {}
    setOpenMenu(null);
  };

  const stats: WithdrawalStats = withdrawals.reduce(
    (acc, w) => {
      const amt = Number(w.amount);
      if (w.status === 'pending') {
        acc.pending++;
        acc.pendingAmount += amt;
      }
      if (w.status === 'approved') {
        acc.approved++;
        acc.approvedAmount += amt;
      }
      if (w.status === 'rejected') {
        acc.rejected++;
        acc.rejectedAmount += amt;
      }
      if (w.status === 'completed') {
        acc.completed++;
        acc.completedAmount += amt;
        acc.totalPaid += amt;
      }
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, completed: 0, totalPaid: 0, pendingAmount: 0, approvedAmount: 0, rejectedAmount: 0, completedAmount: 0 }
  );

  const statCards = [
    { label: 'Pending', value: stats.pending, amount: stats.pendingAmount, icon: <Clock className="h-5 w-5" />, color: '#F59E0B' },
    { label: 'Approved', value: stats.approved, amount: stats.approvedAmount, icon: <ThumbsUp className="h-5 w-5" />, color: '#2D4F97' },
    { label: 'Rejected', value: stats.rejected, amount: stats.rejectedAmount, icon: <XCircle className="h-5 w-5" />, color: '#EF4444' },
    { label: 'Completed', value: stats.completed, amount: stats.completedAmount, icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { label: 'Total Paid', value: '', amount: stats.totalPaid, icon: <DollarSign className="h-5 w-5" />, color: '#1E8A8D' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Withdrawals</h1>
          <p className="text-sm text-gray-500 mt-1">Process user withdrawal requests and payouts.</p>
        </div>
        <button className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{typeof s.value === 'number' ? s.value : ''}</p>
                <p className="text-xs text-red-600 font-medium">${(s.amount || 0).toFixed(2)}</p>
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
                placeholder="Search by user or wallet..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <span className="text-xs text-gray-400">{withdrawals.length} withdrawals</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No withdrawals found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">User</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Wallet</th>
                  <th className="px-4 py-4">Network</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Fee</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Net</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Tx Hash</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(w.user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{w.user.name}</p>
                          <p className="text-xs text-gray-400">{w.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        {truncate(w.wallet_address, 18)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${networkColors[w.network] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {w.network.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-red-600">-${Number(w.amount).toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">${Number(w.fee).toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-gray-700">${Number(w.net_amount).toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {w.tx_hash ? (
                        <a
                          href={`${networkExplorers[w.network] || ''}${w.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          {truncate(w.tx_hash, 12)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[w.status] || 'bg-gray-100 text-gray-700'}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approve(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => complete(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                          >
                            Complete
                          </button>
                        </div>
                      ) : w.status === 'approved' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => complete(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => reject(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOpenMenu(openMenu === w.id ? null : w.id)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                      {openMenu === w.id && w.status !== 'pending' && w.status !== 'approved' && (
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
