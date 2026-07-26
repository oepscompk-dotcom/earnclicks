'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, Repeat, CreditCard,
  TrendingUp, PiggyBank, RotateCcw, DollarSign, Gift,
  ChevronRight, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle,
  PieChart,
} from 'lucide-react';

interface WalletData {
  total_balance: number;
  main: number;
  bonus: number;
  pending_refund: number;
  total_deposited: number;
  total_spent: number;
  platform_credits: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
  status: string;
}

const MOCK_WALLET: WalletData = {
  total_balance: 45280.50,
  main: 35200.00,
  bonus: 5800.50,
  pending_refund: 1280.00,
  total_deposited: 125000.00,
  total_spent: 79719.50,
  platform_credits: 3000.00,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'deposit', amount: 5000, balance_after: 45280.50, description: 'USDT TRC20 Deposit', created_at: '2026-07-25T10:30:00Z', status: 'completed' },
  { id: 2, type: 'spend', amount: -1250.75, balance_after: 40280.50, description: 'Campaign: Summer Sale 2025', created_at: '2026-07-25T09:15:00Z', status: 'completed' },
  { id: 3, type: 'bonus', amount: 500, balance_after: 41531.25, description: 'Loyalty Bonus - July', created_at: '2026-07-24T00:00:00Z', status: 'completed' },
  { id: 4, type: 'refund', amount: 280, balance_after: 41031.25, description: 'Campaign Refund - TikTok Viral', created_at: '2026-07-23T14:20:00Z', status: 'completed' },
  { id: 5, type: 'spend', amount: -980, balance_after: 40751.25, description: 'Campaign: Brand Awareness Q3', created_at: '2026-07-23T08:00:00Z', status: 'completed' },
  { id: 6, type: 'deposit', amount: 10000, balance_after: 41731.25, description: 'USDT BEP20 Deposit', created_at: '2026-07-22T16:45:00Z', status: 'completed' },
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  deposit: { label: 'Deposit', color: '#18C79A', bg: 'bg-green-50' },
  spend: { label: 'Spend', color: '#2D4F97', bg: 'bg-blue-50' },
  bonus: { label: 'Bonus', color: '#1E8A8D', bg: 'bg-teal-50' },
  refund: { label: 'Refund', color: '#F59E0B', bg: 'bg-amber-50' },
  withdrawal: { label: 'Withdrawal', color: '#EF4444', bg: 'bg-red-50' },
};

const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'default' }> = {
  completed: { label: 'Completed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  failed: { label: 'Failed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'default' },
};

export default function AdvertiserWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [w, t] = await Promise.allSettled([
          api.get<any>('/wallet'),
          api.get<any>('/wallet/transactions'),
        ]);
        if (cancelled) return;
        if (w.status === 'fulfilled') setWallet(w.value);
        else setWallet(MOCK_WALLET);
        if (t.status === 'fulfilled') setTransactions(t.value.transactions ?? t.value);
        else setTransactions(MOCK_TRANSACTIONS);
      } catch {
        if (!cancelled) {
          setWallet(MOCK_WALLET);
          setTransactions(MOCK_TRANSACTIONS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#2D4F97] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dw = wallet ?? MOCK_WALLET;
  const txs = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

  const allocation = [
    { label: 'Main Wallet', value: dw.main, color: '#2D4F97' },
    { label: 'Bonus', value: dw.bonus, color: '#1E8A8D' },
    { label: 'Pending Refund', value: dw.pending_refund, color: '#18C79A' },
    { label: 'Platform Credits', value: dw.platform_credits, color: '#F59E0B' },
  ];
  const totalAlloc = allocation.reduce((s, a) => s + a.value, 0);
  let cumulative = 0;

  return (
    <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your funds, deposits, and view transaction history.</p>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <Card className="bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] text-white border-0">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Balance</p>
              <p className="text-xl font-bold">{formatCurrency(dw.total_balance)}</p>
              <p className="text-[10px] text-white/50">All wallets combined</p>
            </CardContent>
          </Card>
          {[
            { label: 'Main Wallet', value: dw.main, icon: Wallet, color: '#2D4F97' },
            { label: 'Bonus Balance', value: dw.bonus, icon: Gift, color: '#1E8A8D' },
            { label: 'Pending Refund', value: dw.pending_refund, icon: RotateCcw, color: '#18C79A' },
            { label: 'Total Deposited', value: dw.total_deposited, icon: ArrowDownToLine, color: '#2D4F97' },
            { label: 'Total Spent', value: dw.total_spent, icon: TrendingUp, color: '#1E8A8D' },
            { label: 'Platform Credits', value: dw.platform_credits, icon: CreditCard, color: '#F59E0B' },
          ].map((item) => (
            <Card key={item.label} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}12` }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                </div>
                <p className="text-lg font-bold text-[#0F172A]">{formatCurrency(item.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breakdown Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circular Progress Chart */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#2D4F97]" /> Wallet Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {allocation.map((item) => {
                      const pct = totalAlloc > 0 ? (item.value / totalAlloc) * 100 : 0;
                      const offset = cumulative;
                      cumulative += pct;
                      const circumference = 2 * Math.PI * 50;
                      const dash = (pct / 100) * circumference;
                      const dashOffset = -(offset / 100) * circumference;
                      return (
                        <circle
                          key={item.label}
                          cx="60" cy="60" r="50"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="10"
                          strokeDasharray={`${dash} ${circumference - dash}`}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      );
                    })}
                    <circle cx="60" cy="60" r="38" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[#0F172A]">{formatCurrency(dw.total_balance)}</p>
                    <p className="text-[10px] text-gray-400">Total Balance</p>
                  </div>
                </div>
                <div className="w-full space-y-2 mt-4">
                  {allocation.map((item) => {
                    const pct = totalAlloc > 0 ? ((item.value / totalAlloc) * 100).toFixed(1) : '0';
                    return (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-medium text-[#0F172A]">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/advertiser/deposit"
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-[#2D4F97]/5 to-[#1E8A8D]/5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-3.5 rounded-full bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white shadow-md group-hover:shadow-lg transition-shadow">
                    <ArrowDownToLine className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2D4F97] transition-colors">Deposit</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Add funds to your wallet</p>
                  </div>
                </Link>
                <Link
                  href="/advertiser/withdraw"
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-[#1E8A8D]/5 to-[#18C79A]/5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-3.5 rounded-full bg-gradient-to-r from-[#1E8A8D] to-[#18C79A] text-white shadow-md group-hover:shadow-lg transition-shadow">
                    <ArrowUpFromLine className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1E8A8D] transition-colors">Withdraw</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Withdraw your earnings</p>
                  </div>
                </Link>
                <Link
                  href="/advertiser/transactions"
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-[#18C79A]/5 to-[#2D4F97]/5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-3.5 rounded-full bg-gradient-to-r from-[#18C79A] to-[#2D4F97] text-white shadow-md group-hover:shadow-lg transition-shadow">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#18C79A] transition-colors">Transactions</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">View full history</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A]">Recent Transactions</CardTitle>
            <Link
              href="/advertiser/transactions"
              className="text-xs font-medium text-[#2D4F97] hover:text-[#1E8A8D] flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {txs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">ID</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Type</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Amount</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Balance After</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Description</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                      <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {txs.slice(0, 10).map((tx) => {
                      const tType = typeConfig[tx.type] ?? { label: tx.type, color: '#6B7280', bg: 'bg-gray-50' };
                      const tStatus = statusBadge[tx.status] ?? { label: tx.status, variant: 'default' };
                      const TypeIcon = tx.amount >= 0 ? ArrowDownToLine : ArrowUpFromLine;
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3.5 text-xs font-mono text-gray-400">#{tx.id}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className={cn('p-1 rounded-lg', tType.bg)}>
                                <TypeIcon className="w-3.5 h-3.5" style={{ color: tType.color }} />
                              </div>
                              <span className="text-xs font-medium text-[#0F172A]">{tType.label}</span>
                            </div>
                          </td>
                          <td className={cn('px-6 py-3.5 text-right text-xs font-bold', tx.amount >= 0 ? 'text-green-600' : 'text-red-500')}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)} USDT
                          </td>
                          <td className="px-6 py-3.5 text-right text-xs font-medium text-gray-600">{tx.balance_after.toFixed(2)}</td>
                          <td className="px-6 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">{tx.description}</td>
                          <td className="px-6 py-3.5 text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="px-6 py-3.5 text-center">
                            <Badge variant={tStatus.variant} className="text-[10px] px-2 py-0.5">{tStatus.label}</Badge>
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

    </div>
  );
}
