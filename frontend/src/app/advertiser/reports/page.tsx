'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Download, FileText, FileSpreadsheet, File, Calendar,
  TrendingUp, DollarSign, MousePointer, Eye, Target, PieChart, Clock, Users, Globe,
} from 'lucide-react';

const TABS = [
  'Campaign Report', 'Daily Report', 'Monthly Report', 'Platform Report',
  'Worker Report', 'Country Report', 'Budget Report', 'ROI Report',
] as const;

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Summer Sale', platform: 'YouTube', impressions: 125000, clicks: 8200, ctr: 6.56, conversions: 410, spend: 2340, cpa: 5.71, roas: 3.2 },
  { id: 2, name: 'Brand Awareness', platform: 'Instagram', impressions: 98000, clicks: 5400, ctr: 5.51, conversions: 215, spend: 1200, cpa: 5.58, roas: 2.8 },
  { id: 3, name: 'TikTok Challenge', platform: 'TikTok', impressions: 210000, clicks: 15300, ctr: 7.29, conversions: 680, spend: 5100, cpa: 7.50, roas: 4.1 },
  { id: 4, name: 'Facebook Growth', platform: 'Facebook', impressions: 76000, clicks: 3100, ctr: 4.08, conversions: 98, spend: 850, cpa: 8.67, roas: 1.9 },
  { id: 5, name: 'Telegram Boost', platform: 'Telegram', impressions: 45000, clicks: 2800, ctr: 6.22, conversions: 145, spend: 1500, cpa: 10.34, roas: 2.2 },
];

const MOCK_DAILY = [
  { date: 'Jul 20', spend: 420, tasks: 1240 },
  { date: 'Jul 21', spend: 560, tasks: 1560 },
  { date: 'Jul 22', spend: 380, tasks: 1120 },
  { date: 'Jul 23', spend: 720, tasks: 2100 },
  { date: 'Jul 24', spend: 610, tasks: 1780 },
  { date: 'Jul 25', spend: 890, tasks: 2450 },
  { date: 'Jul 26', spend: 540, tasks: 1630 },
];

const MOCK_MONTHLY = [
  { month: 'Feb', spend: 4200, tasks: 12500, impressions: 320000 },
  { month: 'Mar', spend: 5800, tasks: 18200, impressions: 445000 },
  { month: 'Apr', spend: 7200, tasks: 22100, impressions: 510000 },
  { month: 'May', spend: 6500, tasks: 19800, impressions: 478000 },
  { month: 'Jun', spend: 8100, tasks: 25400, impressions: 562000 },
  { month: 'Jul', spend: 9400, tasks: 29100, impressions: 615000 },
];

const MOCK_PLATFORMS = [
  { platform: 'YouTube', spend: 8340, impressions: 425000, clicks: 28900, conversions: 1590 },
  { platform: 'Instagram', spend: 5200, impressions: 318000, clicks: 19400, conversions: 1050 },
  { platform: 'TikTok', spend: 10100, impressions: 612000, clicks: 45200, conversions: 2450 },
  { platform: 'Facebook', spend: 4850, impressions: 276000, clicks: 15200, conversions: 820 },
  { platform: 'Telegram', spend: 3200, impressions: 189000, clicks: 12100, conversions: 610 },
];

const MOCK_WORKERS = [
  { worker: 'TopWorker_99', tasks: 2450, earnings: 1225, rating: 4.9 },
  { worker: 'TaskMaster_X', tasks: 2100, earnings: 1050, rating: 4.8 },
  { worker: 'QuickHands_7', tasks: 1890, earnings: 945, rating: 4.7 },
  { worker: 'ProClicker_42', tasks: 1650, earnings: 825, rating: 4.6 },
  { worker: 'EarnKing_01', tasks: 1420, earnings: 710, rating: 4.5 },
];

const MOCK_COUNTRIES = [
  { country: 'USA', spend: 12500, impressions: 520000, clicks: 32100, conversions: 1850 },
  { country: 'India', spend: 8900, impressions: 680000, clicks: 45200, conversions: 2100 },
  { country: 'UK', spend: 5600, impressions: 215000, clicks: 14100, conversions: 820 },
  { country: 'Brazil', spend: 4200, impressions: 310000, clicks: 19800, conversions: 950 },
  { country: 'Indonesia', spend: 3800, impressions: 425000, clicks: 28500, conversions: 1120 },
];

const MOCK_BUDGET = [
  { campaign: 'Summer Sale', budget: 5000, spent: 2340, remaining: 2660, utilization: 46.8 },
  { campaign: 'Brand Awareness', budget: 3000, spent: 1200, remaining: 1800, utilization: 40.0 },
  { campaign: 'TikTok Challenge', budget: 8000, spent: 5100, remaining: 2900, utilization: 63.8 },
  { campaign: 'Facebook Growth', budget: 2000, spent: 850, remaining: 1150, utilization: 42.5 },
  { campaign: 'Telegram Boost', budget: 1500, spent: 1500, remaining: 0, utilization: 100.0 },
];

const MOCK_ROI = [
  { month: 'Feb', roi: 1.8, spend: 4200, revenue: 7560 },
  { month: 'Mar', roi: 2.2, spend: 5800, revenue: 12760 },
  { month: 'Apr', roi: 2.5, spend: 7200, revenue: 18000 },
  { month: 'May', roi: 2.1, spend: 6500, revenue: 13650 },
  { month: 'Jun', roi: 2.8, spend: 8100, revenue: 22680 },
  { month: 'Jul', roi: 3.1, spend: 9400, revenue: 29140 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Campaign Report':
        return (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-4">Campaign</th>
                    <th className="px-4 py-4">Platform</th>
                    <th className="px-4 py-4 text-right">Impressions</th>
                    <th className="px-4 py-4 text-right">Clicks</th>
                    <th className="px-4 py-4 text-right">CTR</th>
                    <th className="px-4 py-4 text-right">Conversions</th>
                    <th className="px-4 py-4 text-right">Spend</th>
                    <th className="px-4 py-4 text-right">CPA</th>
                    <th className="px-4 py-4 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CAMPAIGNS.map((c, i) => (
                    <tr key={c.id} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_CAMPAIGNS.length - 1 && 'border-b-0')}>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{c.name}</p></td>
                      <td className="px-4 py-4"><span className="text-xs font-medium text-gray-500">{c.platform}</span></td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.impressions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.clicks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-[#1E8A8D]">{c.ctr}%</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.conversions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(c.spend)}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-[#F59E0B]">{formatCurrency(c.cpa)}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-[#18C79A]">{c.roas}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Daily Report':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Daily Spend & Tasks Completed</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={MOCK_DAILY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#2D4F97" strokeWidth={2} name="Spend ($)" dot={{ r: 3, fill: '#2D4F97' }} />
                  <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="#18C79A" strokeWidth={2} name="Tasks Completed" dot={{ r: 3, fill: '#18C79A' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Avg Daily Spend', value: formatCurrency(MOCK_DAILY.reduce((s, d) => s + d.spend, 0) / MOCK_DAILY.length), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]' },
                { label: 'Avg Daily Tasks', value: Math.round(MOCK_DAILY.reduce((s, d) => s + d.tasks, 0) / MOCK_DAILY.length).toLocaleString(), icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]' },
                { label: 'Peak Spend Day', value: formatCurrency(Math.max(...MOCK_DAILY.map(d => d.spend))), icon: <Clock className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]' },
                { label: 'Peak Tasks Day', value: Math.max(...MOCK_DAILY.map(d => d.tasks)).toLocaleString(), icon: <Target className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]' },
              ].map((m, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                    <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', m.gradient)}>{m.icon}</div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Monthly Report':
        return (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={MOCK_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="spend" fill="#2D4F97" radius={[4, 4, 0, 0]} name="Spend ($)" />
                <Bar dataKey="tasks" fill="#18C79A" radius={[4, 4, 0, 0]} name="Tasks Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'Platform Report':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Comparison</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={MOCK_PLATFORMS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="platform" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="impressions" fill="#2D4F97" radius={[4, 4, 0, 0]} name="Impressions" />
                  <Bar dataKey="clicks" fill="#1E8A8D" radius={[4, 4, 0, 0]} name="Clicks" />
                  <Bar dataKey="conversions" fill="#18C79A" radius={[4, 4, 0, 0]} name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                      <th className="px-5 py-4">Platform</th>
                      <th className="px-4 py-4 text-right">Spend</th>
                      <th className="px-4 py-4 text-right">Impressions</th>
                      <th className="px-4 py-4 text-right">Clicks</th>
                      <th className="px-4 py-4 text-right">Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PLATFORMS.map((p, i) => (
                      <tr key={p.platform} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_PLATFORMS.length - 1 && 'border-b-0')}>
                        <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{p.platform}</p></td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(p.spend)}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.impressions.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.clicks.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Worker Report':
        return (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-4">Worker</th>
                    <th className="px-4 py-4 text-right">Tasks Completed</th>
                    <th className="px-4 py-4 text-right">Earnings</th>
                    <th className="px-4 py-4 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_WORKERS.map((w, i) => (
                    <tr key={w.worker} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_WORKERS.length - 1 && 'border-b-0')}>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{w.worker}</p></td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{w.tasks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(w.earnings)}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#18C79A]">
                          {w.rating} <span className="text-yellow-400">★</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Country Report':
        return (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-4">Country</th>
                    <th className="px-4 py-4 text-right">Spend</th>
                    <th className="px-4 py-4 text-right">Impressions</th>
                    <th className="px-4 py-4 text-right">Clicks</th>
                    <th className="px-4 py-4 text-right">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COUNTRIES.map((c, i) => (
                    <tr key={c.country} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_COUNTRIES.length - 1 && 'border-b-0')}>
                      <td className="px-5 py-4"><div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-gray-400" /><p className="text-sm font-semibold text-gray-900">{c.country}</p></div></td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(c.spend)}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.impressions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.clicks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{c.conversions.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Budget Report':
        return (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-4">Campaign</th>
                    <th className="px-4 py-4 text-right">Budget</th>
                    <th className="px-4 py-4 text-right">Spent</th>
                    <th className="px-4 py-4 text-right">Remaining</th>
                    <th className="px-4 py-4 text-right">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BUDGET.map((b, i) => (
                    <tr key={b.campaign} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_BUDGET.length - 1 && 'border-b-0')}>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{b.campaign}</p></td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(b.budget)}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(b.spent)}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(b.remaining)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${b.utilization}%`, background: b.utilization >= 100 ? '#EF4444' : b.utilization > 80 ? '#F59E0B' : '#18C79A' }} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{b.utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'ROI Report':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Spend', value: formatCurrency(MOCK_ROI.reduce((s, r) => s + r.spend, 0)), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]' },
                { label: 'Total Revenue', value: formatCurrency(MOCK_ROI.reduce((s, r) => s + r.revenue, 0)), icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]' },
                { label: 'Avg ROI', value: `${(MOCK_ROI.reduce((s, r) => s + r.roi, 0) / MOCK_ROI.length).toFixed(2)}x`, icon: <PieChart className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]' },
                { label: 'Best Month', value: MOCK_ROI.reduce((best, r) => r.roi > (best?.roi || 0) ? r : best).month, icon: <Target className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]' },
              ].map((m, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                    <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', m.gradient)}>{m.icon}</div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">ROI Trend</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={MOCK_ROI}>
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18C79A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#18C79A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D4F97" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2D4F97" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                  <Area type="monotone" dataKey="roi" stroke="#18C79A" fill="url(#roiGradient)" strokeWidth={2} name="ROI (x)" />
                  <Area type="monotone" dataKey="revenue" stroke="#2D4F97" fill="url(#revGradient)" strokeWidth={2} name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Performance Reports</h1>
          <p className="text-sm text-gray-400 mt-1">Analyze campaign performance across dimensions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-500 shadow-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span>Jul 1 – Jul 26, 2026</span>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-xl text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <FileText className="h-3.5 w-3.5" /> PDF
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-xl text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-xl text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <File className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab
                  ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}
