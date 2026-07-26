'use client';

import { useState } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Download, Plus, CreditCard, Building2, MapPin,
  CheckCircle, Clock, AlertTriangle, Trash2, DollarSign,
  Landmark, Calendar,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  date: string;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface SavedMethod {
  id: string;
  type: string;
  label: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'INV-2026-001', amount: 12500.00, date: '2026-07-01', due_date: '2026-07-15', status: 'paid', description: 'Campaign: Summer Sale 2025' },
  { id: '2', number: 'INV-2026-002', amount: 8450.75, date: '2026-07-05', due_date: '2026-07-20', status: 'paid', description: 'Campaign: Brand Awareness Q3' },
  { id: '3', number: 'INV-2026-003', amount: 3200.00, date: '2026-07-10', due_date: '2026-07-25', status: 'pending', description: 'Campaign: TikTok Viral Challenge' },
  { id: '4', number: 'INV-2026-004', amount: 15000.00, date: '2026-07-15', due_date: '2026-07-30', status: 'pending', description: 'Campaign: Product Launch YT' },
  { id: '5', number: 'INV-2026-005', amount: 2800.50, date: '2026-06-20', due_date: '2026-07-05', status: 'overdue', description: 'Campaign: Retargeting Q3' },
  { id: '6', number: 'INV-2026-006', amount: 6750.00, date: '2026-06-25', due_date: '2026-07-10', status: 'paid', description: 'Campaign: Influencer Collab' },
  { id: '7', number: 'INV-2026-007', amount: 4100.00, date: '2026-07-18', due_date: '2026-08-02', status: 'pending', description: 'Newsletter Sponsor' },
];

const MOCK_METHODS: SavedMethod[] = [
  { id: '1', type: 'visa', label: 'Visa', last4: '4242', expiry: '08/28', isDefault: true },
  { id: '2', type: 'mastercard', label: 'Mastercard', last4: '5555', expiry: '12/27', isDefault: false },
];

const invoiceStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive'; icon: any }> = {
  paid: { label: 'Paid', variant: 'success', icon: CheckCircle },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  overdue: { label: 'Overdue', variant: 'destructive', icon: AlertTriangle },
};

const summaries = [
  { label: 'Total Billed', value: 52801.25, icon: DollarSign, color: '#2D4F97' },
  { label: 'Pending Payments', value: 22300.00, icon: Clock, color: '#F59E0B' },
  { label: 'Paid Invoices', value: 27701.25, icon: CheckCircle, color: '#18C79A' },
  { label: 'Outstanding', value: 2800.50, icon: AlertTriangle, color: '#EF4444' },
];

export default function AdvertiserBillingPage() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [methods] = useState<SavedMethod[]>(MOCK_METHODS);

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const pendingTotal = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const paidTotal = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const overdueTotal = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const summaryValues = [totalBilled, pendingTotal, paidTotal, overdueTotal];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Billing & Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your invoices, payment methods, and billing information.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaries.map((item, i) => (
            <Card key={item.label} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}12` }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                </div>
                <p className="text-lg font-bold text-[#0F172A]">{formatCurrency(summaryValues[i])}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoices Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2D4F97]" /> Invoices
            </CardTitle>
            <span className="text-xs text-gray-400">{invoices.length} total</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Invoice #</th>
                    <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Amount</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Description</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Due Date</th>
                    <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv) => {
                    const is = invoiceStatusConfig[inv.status];
                    const StatusIcon = is.icon;
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-semibold text-[#2D4F97] font-mono">{inv.number}</td>
                        <td className="px-6 py-4 text-right text-xs font-bold text-[#0F172A]">{formatCurrency(inv.amount)}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate">{inv.description}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={is.variant} className="text-[10px] px-2 py-0.5 gap-1">
                            <StatusIcon className="w-3 h-3" /> {is.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#2D4F97] hover:bg-blue-50 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods + Billing Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Payment Methods */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1E8A8D]" /> Payment Methods
              </CardTitle>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D4F97]/10 text-[#2D4F97] text-xs font-medium hover:bg-[#2D4F97]/20 transition-colors">
                <Plus className="w-3 h-3" /> Add New
              </button>
            </CardHeader>
            <CardContent>
              {methods.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No saved payment methods.</p>
              ) : (
                <div className="space-y-3">
                  {methods.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] flex items-center justify-center text-white text-[10px] font-bold">
                          {m.label === 'Visa' ? 'VISA' : 'MC'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-[#0F172A]">{m.label} •••• {m.last4}</p>
                            {m.isDefault && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#18C79A]/10 text-[#18C79A] font-medium">Default</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Expires {m.expiry}</p>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Information */}
          <div className="space-y-4">

            {/* Tax Information */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2D4F97]" /> Tax Information
                </CardTitle>
                <button className="text-xs font-medium text-[#2D4F97] hover:text-[#1E8A8D] transition-colors">Edit</button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Company Name</span>
                    <span className="font-medium text-[#0F172A]">EarnClicks Ltd.</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Tax ID / VAT</span>
                    <span className="font-medium text-[#0F172A]">TAX-123456789</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Business Reg.</span>
                    <span className="font-medium text-[#0F172A]">BR-987654321</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#18C79A]" /> Billing Address
                </CardTitle>
                <button className="text-xs font-medium text-[#2D4F97] hover:text-[#1E8A8D] transition-colors">Edit</button>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-xs text-[#0F172A]">
                  <p className="font-medium">John Doe</p>
                  <p className="text-gray-500">123 Business Avenue, Suite 400</p>
                  <p className="text-gray-500">San Francisco, CA 94105</p>
                  <p className="text-gray-500">United States</p>
                  <p className="text-gray-500">Phone: +1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
