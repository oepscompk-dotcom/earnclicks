'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, cn, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowDownToLine, Copy, Check, ExternalLink, Wallet,
  Bitcoin, DollarSign, Landmark, QrCode,
  Clock, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  network: string;
  wallet_address: string;
  qr_code?: string;
}

interface DepositRecord {
  id: number;
  amount: number;
  currency: string;
  network: string;
  tx_hash: string;
  wallet_address: string;
  status: string;
  created_at: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'usdt-trc20', name: 'USDT TRC20', icon: '💰', network: 'TRC20', wallet_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
  { id: 'usdt-bep20', name: 'USDT BEP20', icon: '💰', network: 'BEP20', wallet_address: '0x55d398326f99059fF775485246999027B3197955' },
  { id: 'usdt-erc20', name: 'USDT ERC20', icon: '💰', network: 'ERC20', wallet_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { id: 'bitcoin', name: 'Bitcoin', icon: '₿', network: 'BTC', wallet_address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' },
  { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', network: 'ETH', wallet_address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' },
  { id: 'binance-pay', name: 'Binance Pay', icon: '🟡', network: 'Binance Pay', wallet_address: 'binancepay@earnclicks' },
  { id: 'perfect-money', name: 'Perfect Money', icon: '💳', network: 'Perfect Money', wallet_address: 'U12345678' },
  { id: 'payer', name: 'Payeer', icon: '💳', network: 'Payeer', wallet_address: 'P1234567890' },
];

const MOCK_DEPOSITS: DepositRecord[] = [
  { id: 1, amount: 5000, currency: 'USDT', network: 'TRC20', tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', wallet_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', status: 'completed', created_at: '2026-07-25T10:30:00Z' },
  { id: 2, amount: 10000, currency: 'USDT', network: 'BEP20', tx_hash: '0x9f8e7d6c5b4a3210fedcba9876543210fedcba98', wallet_address: '0x55d398326f99059fF775485246999027B3197955', status: 'completed', created_at: '2026-07-22T16:45:00Z' },
  { id: 3, amount: 2500, currency: 'USDT', network: 'ERC20', tx_hash: '0x1111222233334444555566667777888899990000', wallet_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', status: 'pending', created_at: '2026-07-20T08:15:00Z' },
  { id: 4, amount: 1500, currency: 'BTC', network: 'BTC', tx_hash: null as any, wallet_address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', status: 'failed', created_at: '2026-07-18T12:00:00Z' },
];

const depositStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'default'; icon: any }> = {
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  failed: { label: 'Failed', variant: 'destructive', icon: XCircle },
};

export default function AdvertiserDepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchDeposits() {
      try {
        const res = await api.get<any>('/wallet/deposits');
        if (!cancelled) setDeposits(res.deposits ?? res);
      } catch {
        if (!cancelled) setDeposits(MOCK_DEPOSITS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDeposits();
    return () => { cancelled = true; };
  }, []);

  const selected = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !amount || !txHash) return;
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await api.post<{ message: string }>('/wallet/deposit', {
        amount: parseFloat(amount),
        network: selected.network,
        tx_hash: txHash,
        wallet_address: selected.wallet_address,
      });
      setSuccess(res.message || 'Deposit submitted successfully!');
      setAmount('');
      setTxHash('');
      setSelectedMethod(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit deposit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dd = deposits.length > 0 ? deposits : MOCK_DEPOSITS;

  return (
    <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Deposit Funds</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a payment method and follow the instructions to add funds to your wallet.</p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => { setSelectedMethod(method.id); setError(''); setSuccess(''); }}
              className={cn(
                'relative text-left p-4 rounded-2xl border transition-all duration-200 hover:shadow-md',
                selectedMethod === method.id
                  ? 'border-[#2D4F97] bg-[#2D4F97]/5 shadow-md ring-2 ring-[#2D4F97]/20'
                  : 'bg-white/80 backdrop-blur-xl border-gray-100 hover:border-gray-200',
              )}
            >
              <div className="flex flex-col items-center gap-2.5">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-colors',
                  selectedMethod === method.id ? 'bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] text-white' : 'bg-gray-100 text-gray-600',
                )}>
                  {method.icon}
                </div>
                <p className="text-xs font-semibold text-[#0F172A] text-center leading-tight">{method.name}</p>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-medium',
                  selectedMethod === method.id ? 'bg-[#2D4F97] text-white' : 'bg-gray-100 text-gray-500',
                )}>
                  {method.network}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Method Form */}
        {selected && (
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white text-sm">
                  {selected.icon}
                </div>
                {selected.name} Deposit
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-xs text-green-700">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {success}
                </div>
              )}
              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> {error}
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code Placeholder */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                  <div className="w-40 h-40 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 mb-3">
                    <QrCode className="w-20 h-20 text-gray-300" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">Scan to pay with {selected.name}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount ({selected.network === 'BTC' ? 'BTC' : selected.network === 'ETH' ? 'ETH' : 'USDT'})</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                        {selected.network === 'BTC' ? '₿' : selected.network === 'ETH' ? 'Ξ' : '$'}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full h-11 pl-8 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0F172A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Network</label>
                    <div className="h-11 flex items-center px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-[#0F172A]">
                      {selected.network}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Wallet Address</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-11 flex items-center px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 truncate">
                        {selected.wallet_address}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selected.wallet_address)}
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Transaction Hash</label>
                    <input
                      type="text"
                      placeholder="Paste your TX hash here..."
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0F172A] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white text-sm font-semibold hover:shadow-lg hover:from-[#1E8A8D] hover:to-[#2D4F97] transition-all duration-300"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ArrowDownToLine className="w-4 h-4" /> Submit Deposit
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deposit History */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#0F172A]">Deposit History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#2D4F97] border-t-transparent rounded-full animate-spin" /></div>
            ) : dd.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No deposits yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">ID</th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Amount</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Network</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">TX Hash</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                      <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dd.map((dep) => {
                      const ds = depositStatusConfig[dep.status] ?? { label: dep.status, variant: 'default' as const, icon: AlertCircle };
                      const StatusIcon = ds.icon;
                      return (
                        <tr key={dep.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3.5 text-xs font-mono text-gray-400">#{dep.id}</td>
                          <td className="px-6 py-3.5 text-right text-xs font-bold text-[#0F172A]">{formatCurrency(dep.amount)}</td>
                          <td className="px-6 py-3.5">
                            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-600">{dep.network}</span>
                          </td>
                          <td className="px-6 py-3.5 text-xs font-mono text-gray-400 max-w-[120px] truncate">
                            {dep.tx_hash ?? '—'}
                          </td>
                          <td className="px-6 py-3.5 text-xs text-gray-400">{formatDateTime(dep.created_at)}</td>
                          <td className="px-6 py-3.5 text-center">
                            <Badge variant={ds.variant} className="text-[10px] px-2 py-0.5 gap-1">
                              <StatusIcon className="w-3 h-3" /> {ds.label}
                            </Badge>
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
