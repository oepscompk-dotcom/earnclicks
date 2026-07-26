'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tag, Plus, Percent, Calendar, Users, Copy,
  Trash2, X, Check, Clock, AlertTriangle,
} from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  minDeposit: number;
  validUntil: string;
  usageLimit: number;
  used: number;
  status: 'active' | 'expired' | 'disabled';
}

interface PromoHistory {
  id: number;
  date: string;
  code: string;
  discount: string;
  usedBy: string;
}

const MOCK_COUPONS: Coupon[] = [
  { id: 1, code: 'WELCOME20', discount: 20, minDeposit: 100, validUntil: '2026-12-31', usageLimit: 500, used: 234, status: 'active' },
  { id: 2, code: 'SUMMER25', discount: 25, minDeposit: 200, validUntil: '2026-09-30', usageLimit: 200, used: 87, status: 'active' },
  { id: 3, code: 'VIP50', discount: 50, minDeposit: 500, validUntil: '2026-08-15', usageLimit: 50, used: 50, status: 'expired' },
  { id: 4, code: 'LAUNCH10', discount: 10, minDeposit: 50, validUntil: '2026-06-30', usageLimit: 1000, used: 1000, status: 'disabled' },
];

const MOCK_HISTORY: PromoHistory[] = [
  { id: 1, date: '2026-07-26', code: 'WELCOME20', discount: '20%', usedBy: 'user@example.com' },
  { id: 2, date: '2026-07-25', code: 'SUMMER25', discount: '25%', usedBy: 'advertiser2@example.com' },
  { id: 3, date: '2026-07-24', code: 'WELCOME20', discount: '20%', usedBy: 'newuser@example.com' },
  { id: 4, date: '2026-07-23', code: 'VIP50', discount: '50%', usedBy: 'vip@example.com' },
  { id: 5, date: '2026-07-22', code: 'LAUNCH10', discount: '10%', usedBy: 'user@example.com' },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [showGenerate, setShowGenerate] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    minDeposit: '',
    validUntil: '',
    usageLimit: '',
  });

  const generateCode = () => {
    return 'PROMO' + Math.random().toString(36).slice(2, 8).toUpperCase();
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: coupons.length + 1,
      code: couponForm.code || generateCode(),
      discount: Number(couponForm.discount) || 10,
      minDeposit: Number(couponForm.minDeposit) || 0,
      validUntil: couponForm.validUntil || '2026-12-31',
      usageLimit: Number(couponForm.usageLimit) || 100,
      used: 0,
      status: 'active',
    };
    setCoupons([newCoupon, ...coupons]);
    setCouponForm({ code: '', discount: '', minDeposit: '', validUntil: '', usageLimit: '' });
    setShowGenerate(false);
  };

  const deleteCoupon = (id: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: '#059669', bg: '#D1FAE5' },
    expired: { label: 'Expired', color: '#B45309', bg: '#FEF3C7' },
    disabled: { label: 'Disabled', color: '#4B5563', bg: '#F3F4F6' },
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Coupons & Promo Codes</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage promotional discount codes</p>
        </div>
        <Button
          onClick={() => setShowGenerate(!showGenerate)}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Coupon
        </Button>
      </div>

      {showGenerate && (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generate New Coupon</CardTitle>
              <button onClick={() => setShowGenerate(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                      placeholder="Custom code or auto-generate"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setCouponForm({ ...couponForm, code: generateCode() })}
                      className="rounded-xl shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                    placeholder="e.g. 20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Deposit (USDT)</Label>
                  <Input
                    type="number"
                    value={couponForm.minDeposit}
                    onChange={(e) => setCouponForm({ ...couponForm, minDeposit: e.target.value })}
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <Button type="submit" className="bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white rounded-xl">
                <Tag className="h-4 w-4 mr-2" /> Create Coupon
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {coupons.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="py-16 text-center">
            <Tag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No coupon codes yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Code</th>
                  <th className="px-4 py-4">Discount</th>
                  <th className="px-4 py-4">Min Deposit</th>
                  <th className="px-4 py-4">Valid Until</th>
                  <th className="px-4 py-4">Usage Limit</th>
                  <th className="px-4 py-4">Used</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const cfg = STATUS_CONFIG[c.status];
                  const usagePercent = c.usageLimit > 0 ? Math.round((c.used / c.usageLimit) * 100) : 0;
                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-bold text-[#2D4F97] bg-[#2D4F97]/10 px-2.5 py-1 rounded-lg">{c.code}</code>
                          <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                          <Percent className="h-3 w-3 text-gray-400" /> {c.discount}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{c.minDeposit} USDT</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" /> {c.validUntil}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{c.usageLimit}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-medium">{c.used}</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${usagePercent}%`, background: usagePercent > 80 ? '#EF4444' : '#2D4F97' }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5"
                          style={{ background: cfg.bg, color: cfg.color, borderColor: 'transparent' }}
                        >
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCoupon(c.id)}
                          className="text-red-500 hover:bg-red-50 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#1E8A8D]" />
            Promo Usage History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-4 py-4">Code</th>
                  <th className="px-4 py-4">Discount</th>
                  <th className="px-4 py-4">Used By</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">{h.date}</td>
                    <td className="px-4 py-4">
                      <code className="text-xs font-mono font-medium text-[#2D4F97] bg-[#2D4F97]/10 px-2 py-0.5 rounded">{h.code}</code>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{h.discount}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{h.usedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
