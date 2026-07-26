'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownToLine, ArrowUpFromLine, Gift, RotateCcw, TrendingUp,
  Search, Download, ChevronLeft, ChevronRight, Filter,
  Clock, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
  status: string;
}

const ALL_TYPES = ['All', 'Deposits', 'Campaign Spending', 'Refunds', 'Bonuses'];

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 25 }, (_, i) => {
  const types = ['deposit', 'spend', 'bonus', 'refund', 'withdrawal'];
  const descriptions: Record<string, string[]> = {
    deposit: ['USDT TRC20 Deposit', 'USDT BEP20 Deposit', 'USDT ERC20 Deposit', 'Bitcoin Deposit', 'Binance Pay Deposit'],
    spend: ['Campaign: Summer Sale 2025', 'Campaign: Brand Awareness Q3', 'Campaign: TikTok Viral Challenge', 'Campaign: Product Launch YT', 'Campaign: Retargeting Q3'],
    bonus: ['Loyalty Bonus - July', 'Welcome Bonus', 'Referral Bonus', 'Seasonal Promotion Bonus'],
    refund: ['Campaign Refund - TikTok Viral', 'Campaign Refund - Retargeting Q3', 'Overpayment Refund'],
    withdrawal: ['USDT TRC20 Withdrawal', 'BTC Withdrawal'],
  };
  const type = types[Math.floor(Math.random() * types.length)];
  const descs = descriptions[type] ?? ['General transaction'];
  const amount = type === 'deposit' || type === 'bonus' || type === 'refund'
    ? Math.round(Math.random() * 8000 + 200)
    : -(Math.round(Math.random() * 3000 + 100));
  const statuses = ['completed', 'completed', 'completed', 'pending', 'completed', 'completed', 'failed'];
  return {
    id: i + 1,
    type,
    amount,
    balance_after: 50000 + Math.round(Math.random() * 20000),
    description: descs[Math.floor(Math.random() * descs.length)],
    created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  deposit: { label: 'Deposit', color: '#18C79A', bg: 'bg-green-50', icon: ArrowDownToLine },
  spend: { label: 'Spend', color: '#2D4F97', bg: 'bg-blue-50', icon: TrendingUp },
  bonus: { label: 'Bonus', color: '#1E8A8D', bg: 'bg-teal-50', icon: Gift },
  refund: { label: 'Refund', color: '#F59E0B', bg: 'bg-amber-50', icon: RotateCcw },
  withdrawal: { label: 'Withdrawal', color: '#EF4444', bg: 'bg-red-50', icon: ArrowUpFromLine },
};

const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'default' }> = {
  completed: { label: 'Completed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed: { label: 'Failed', variant: 'destructive' },
};

const ITEMS_PER_PAGE = 10;

export default function AdvertiserTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await api.get<any>('/wallet/transactions');
        if (!cancelled) setTransactions(res.transactions ?? res);
      } catch {
        if (!cancelled) setTransactions(MOCK_TRANSACTIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let items = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

    if (activeFilter !== 'All') {
      const typeMap: Record<string, string[]> = {
        Deposits: ['deposit'],
        'Campaign Spending': ['spend'],
        Refunds: ['refund'],
        Bonuses: ['bonus'],
      };
      const allowed = typeMap[activeFilter] ?? [];
      items = items.filter((tx) => allowed.includes(tx.type));
    }

    if (dateFrom) items = items.filter((tx) => new Date(tx.created_at) >= new Date(dateFrom));
    if (dateTo) items = items.filter((tx) => new Date(tx.created_at) <= new Date(dateTo + 'T23:59:59Z'));

    return items;
  }, [transactions, activeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [activeFilter, dateFrom, dateTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#2D4F97] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const txs = paginated;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Transaction History</h1>
            <p className="text-sm text-gray-500 mt-1">View and filter all your wallet transactions.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                      activeFilter === f
                        ? 'bg-[#2D4F97] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                />
                <span className="text-xs text-gray-400">—</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {txs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium">No transactions found</p>
                <p className="text-xs mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">ID</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Type</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Amount</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Balance After</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Description</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Date</th>
                      <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {txs.map((tx) => {
                      const tType = typeConfig[tx.type] ?? { label: tx.type, color: '#6B7280', bg: 'bg-gray-50', icon: AlertCircle };
                      const tStatus = statusBadge[tx.status] ?? { label: tx.status, variant: 'default' as const };
                      const TypeIcon = tType.icon;
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-gray-400">#{tx.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className={cn('p-1.5 rounded-lg', tType.bg)}>
                                <TypeIcon className="w-3.5 h-3.5" style={{ color: tType.color }} />
                              </div>
                              <span className="text-xs font-semibold text-[#0F172A]">{tType.label}</span>
                            </div>
                          </td>
                          <td className={cn('px-6 py-4 text-right text-xs font-bold', tx.amount >= 0 ? 'text-green-600' : 'text-red-500')}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)} USDT
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-mono text-gray-500">{tx.balance_after.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 max-w-[220px] truncate">{tx.description}</td>
                          <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{formatDateTime(tx.created_at)}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={tStatus.variant} className="text-[10px] px-2.5 py-0.5">{tStatus.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                    p === page ? 'bg-[#2D4F97] text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50',
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
