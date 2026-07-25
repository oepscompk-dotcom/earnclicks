'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowDownToLine } from 'lucide-react';

export default function DepositPage() {
  const [formData, setFormData] = useState({ amount: '', network: 'trc20', tx_hash: '', wallet_address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.post<{ message: string }>('/wallet/deposit', {
        amount: parseFloat(formData.amount),
        network: formData.network,
        tx_hash: formData.tx_hash,
        wallet_address: formData.wallet_address,
      });
      setSuccess(res.message || 'Deposit submitted. Awaiting confirmation.');
      setFormData({ amount: '', network: 'trc20', tx_hash: '', wallet_address: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Deposit USDT</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowDownToLine className="h-5 w-5" />Make a Deposit</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDT)</Label>
              <Input id="amount" type="number" step="0.01" min="1" placeholder="100.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
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
              <Label htmlFor="wallet_address">Your Wallet Address</Label>
              <Input id="wallet_address" placeholder="Enter your USDT wallet address" value={formData.wallet_address} onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx_hash">Transaction Hash</Label>
              <Input id="tx_hash" placeholder="Paste the transaction hash after sending" value={formData.tx_hash} onChange={(e) => setFormData({ ...formData, tx_hash: e.target.value })} required />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Deposit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
