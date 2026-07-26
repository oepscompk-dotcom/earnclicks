'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wallet, CheckCircle, XCircle, Clock, Search, Filter, Loader2 } from 'lucide-react';

const mockRefunds = [
  { id: 1, campaign: 'Instagram Growth Q3', amount: 150, reason: 'Campaign Underperforming', status: 'pending', requested: '2026-07-20', resolution: null },
  { id: 2, campaign: 'YouTube Video Boost', amount: 300, reason: 'Duplicate Charges', status: 'approved', requested: '2026-07-18', resolution: '2026-07-21' },
  { id: 3, campaign: 'TikTok Viral Push', amount: 75, reason: 'Campaign Cancelled', status: 'rejected', requested: '2026-07-15', resolution: '2026-07-17' },
  { id: 4, campaign: 'Facebook Page Likes', amount: 200, reason: 'Invalid Targeting', status: 'approved', requested: '2026-07-10', resolution: '2026-07-12' },
  { id: 5, campaign: 'Telegram Group Invites', amount: 50, reason: 'Technical Issues', status: 'pending', requested: '2026-07-22', resolution: null },
];

const statusConfig: Record<string, { icon: React.ReactNode; class: string; label: string }> = {
  pending: { icon: <Clock className="h-3.5 w-3.5" />, class: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  approved: { icon: <CheckCircle className="h-3.5 w-3.5" />, class: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Approved' },
  rejected: { icon: <XCircle className="h-3.5 w-3.5" />, class: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
};

export default function RefundsPage() {
  const [refunds] = useState(mockRefunds);
  const [filter, setFilter] = useState('all');
  const [showRequest, setShowRequest] = useState(false);
  const [formData, setFormData] = useState({ campaign: '', amount: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = filter === 'all' ? refunds : refunds.filter((r) => r.status === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setShowRequest(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const totalPending = refunds.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
  const totalApproved = refunds.filter((r) => r.status === 'approved').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
          <p className="text-sm text-gray-500">Manage your refund and dispute requests</p>
        </div>
        <Button onClick={() => setShowRequest(!showRequest)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Request Refund
        </Button>
      </div>

      {submitted && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">Refund request submitted successfully. We will review it within 48 hours.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Refunds</p>
                <p className="text-xl font-bold text-gray-900">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved Refunds</p>
                <p className="text-xl font-bold text-gray-900">${totalApproved.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Requested</p>
                <p className="text-xl font-bold text-gray-900">${refunds.reduce((s, r) => s + r.amount, 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showRequest && (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-[#2D4F97]" />
              New Refund Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                  value={formData.campaign}
                  onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                  required
                >
                  <option value="">Select campaign...</option>
                  <option value="Instagram Growth Q3">Instagram Growth Q3</option>
                  <option value="YouTube Video Boost">YouTube Video Boost</option>
                  <option value="TikTok Viral Push">TikTok Viral Push</option>
                  <option value="Facebook Page Likes">Facebook Page Likes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97]"
                  placeholder="Explain why you are requesting a refund..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Refund Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg">Refund History</CardTitle>
            <div className="flex items-center gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    filter === f
                      ? 'bg-[#2D4F97] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No refund requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Campaign</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Reason</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Requested</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-3">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const cfg = statusConfig[r.status];
                    return (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 text-sm font-medium text-gray-900">{r.campaign}</td>
                        <td className="py-3 px-3 text-sm font-semibold text-gray-900">${r.amount.toFixed(2)}</td>
                        <td className="py-3 px-3 text-sm text-gray-600">{r.reason}</td>
                        <td className="py-3 px-3 text-sm text-gray-500">{new Date(r.requested).toLocaleDateString()}</td>
                        <td className="py-3 px-3">
                          <Badge className={cn('flex items-center gap-1 w-fit', cfg.class)}>
                            {cfg.icon}
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-500">
                          {r.resolution ? new Date(r.resolution).toLocaleDateString() : '-'}
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
