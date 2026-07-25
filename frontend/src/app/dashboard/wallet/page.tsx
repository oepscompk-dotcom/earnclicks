'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';

interface WalletData {
  total_balance: number;
  main: number;
  referral: number;
  bonus: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          api.get<any>('/wallet'),
          api.get<{ transactions: Transaction[] }>('/wallet/transactions'),
        ]);
        setWallet({
          total_balance: walletRes.total || 0,
          main: walletRes.breakdown?.main || 0,
          referral: walletRes.breakdown?.referral || 0,
          bonus: walletRes.breakdown?.bonus || 0,
        });
        setTransactions(txRes.transactions || []);
      } catch {
        setWallet({ total_balance: 0, main: 0, referral: 0, bonus: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Wallet</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Balance</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">${wallet?.total_balance?.toFixed(2) || '0.00'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Main Wallet</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold">${wallet?.main?.toFixed(2) || '0.00'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Referral Wallet</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold">${wallet?.referral?.toFixed(2) || '0.00'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Bonus Wallet</CardTitle></CardHeader>
          <CardContent><div className="text-xl font-bold">${wallet?.bonus?.toFixed(2) || '0.00'}</div></CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/deposit"><Button><ArrowDownToLine className="mr-2 h-4 w-4" />Deposit</Button></Link>
        <Link href="/dashboard/withdraw"><Button variant="outline"><ArrowUpFromLine className="mr-2 h-4 w-4" />Withdraw</Button></Link>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 20).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)} USDT
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
