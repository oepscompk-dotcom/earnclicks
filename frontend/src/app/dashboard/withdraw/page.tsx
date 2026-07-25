'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowUpFromLine } from 'lucide-react';

export default function WithdrawPage() {
  const [formData, setFormData] = useState({ amount: '', network: 'trc20', wallet_address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fee = parseFloat(formData.amount || '0') * 0.02;
  const net = parseFloat(formData.amount || '0') - fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.post<{ message: string }>('/wallet/withdraw', {
        amount: parseFloat(formData.amount),
        network: formData.network,
        wallet_address: formData.wallet_address,
      });
      setSuccess(res.message || 'Withdrawal request submitted.');
      setFormData({ amount: '', network: 'trc20', wallet_address: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Withdraw USDT</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowUpFromLine className="h-5 w-5" />Request Withdrawal</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDT)</Label>
              <Input id="amount" type="number" step="0.01" min="10" placeholder="50.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <select id="network" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.network} onChange={(e) => setFormData({ ...formData, network: e.target.value })}>
                <option value="trc20">TRC20 (Tron)</option>
                <option value="bep20">BEP20 (BSC)</option>
                <option value="erc20">ERC20 (Ethereum)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet_address">Withdrawal Wallet Address</Label>
              <Input id="wallet_address" placeholder="Enter your USDT wallet address" value={formData.wallet_address} onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })} required />
            </div>
            {parseFloat(formData.amount || '0') > 0 && (
              <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                <p>Fee (2%): <span className="font-medium">${fee.toFixed(2)}</span></p>
                <p>You will receive: <span className="font-bold">${net.toFixed(2)} USDT</span></p>
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
