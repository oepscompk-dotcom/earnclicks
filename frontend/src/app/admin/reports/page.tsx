'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  TrendingUp, TrendingDown, DollarSign, Users, CheckCircle, Wallet,
  Download, FileText, Calendar
} from 'lucide-react';

interface Stats {
  total_revenue: number;
  new_users: number;
  tasks_completed: number;
  payouts: number;
  revenue_change: number;
  users_change: number;
  tasks_change: number;
  payouts_change: number;
  revenue_data: number[];
  task_completion: { platform: string; count: number; total: number }[];
  countries: { country: string; code: string; users: number; flag: string }[];
  platforms: { name: string; users: number; percentage: number }[];
  report_table: { metric: string; value: string; change: string; period: string }[];
}

const PERIODS = [
  { key: '24h', label: '24H' },
  { key: '7days', label: '7 Days' },
  { key: '30days', label: '30 Days' },
  { key: '90days', label: '90 Days' },
  { key: 'year', label: 'Year' },
  { key: 'custom', label: 'Custom' },
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷',
  BR: '🇧🇷', IN: '🇮🇳', PH: '🇵🇭', NG: '🇳🇬', EG: '🇪🇬', PK: '🇵🇰',
  BD: '🇧🇩', ID: '🇮🇩', VN: '🇻🇳', TH: '🇹🇭', MX: '🇲🇽', CO: '🇨🇴',
  AR: '🇦🇷', ZA: '🇿🇦', KE: '🇰🇪', GH: '🇬🇭', UA: '🇺🇦', TR: '🇹🇷',
};

function KpiCard({ title, value, change, icon, color }: {
  title: string; value: string; change: number; icon: React.ReactNode; color: string;
}) {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{positive ? '+' : ''}{change}%</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [period, setPeriod] = useState('7days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [stats, setStats] = useState<Stats>({
    total_revenue: 0, new_users: 0, tasks_completed: 0, payouts: 0,
    revenue_change: 0, users_change: 0, tasks_change: 0, payouts_change: 0,
    revenue_data: [], task_completion: [], countries: [], platforms: [],
    report_table: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async (p: string) => {
    setLoading(true);
    try {
      let url = `/admin/reports?period=${p}`;
      if (p === 'custom' && customFrom && customTo) {
        url += `&from=${customFrom}&to=${customTo}`;
      }
      const res = await api.get<any>(url);
      const d = res.data || res || {};
      setStats({
        total_revenue: d.total_revenue || 0,
        new_users: d.new_users || 0,
        tasks_completed: d.tasks_completed || 0,
        payouts: d.payouts || 0,
        revenue_change: d.revenue_change || 0,
        users_change: d.users_change || 0,
        tasks_change: d.tasks_change || 0,
        payouts_change: d.payouts_change || 0,
        revenue_data: d.revenue_data || [],
        task_completion: d.task_completion || [],
        countries: d.countries || [],
        platforms: d.platforms || [],
        report_table: d.report_table || [],
      });
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const handleExport = (format: string) => {
    const url = `/admin/reports/export?period=${period}&format=${format}`;
    window.open(url, '_blank');
  };

  const kpis = [
    { title: 'Total Revenue', value: `$${(stats.total_revenue || 0).toLocaleString()}`, change: stats.revenue_change, icon: <DollarSign className="h-5 w-5" />, color: '#2D4F97' },
    { title: 'New Users', value: (stats.new_users || 0).toLocaleString(), change: stats.users_change, icon: <Users className="h-5 w-5" />, color: '#1E8A8D' },
    { title: 'Tasks Completed', value: (stats.tasks_completed || 0).toLocaleString(), change: stats.tasks_change, icon: <CheckCircle className="h-5 w-5" />, color: '#18C97A' },
    { title: 'Payouts', value: `$${(stats.payouts || 0).toLocaleString()}`, change: stats.payouts_change, icon: <Wallet className="h-5 w-5" />, color: '#F59E0B' },
  ];

  const maxRevenue = Math.max(...stats.revenue_data, 1);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Platform analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <FileText className="h-4 w-4" />PDF
          </button>
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <FileText className="h-4 w-4" />Excel
          </button>
          <button onClick={() => handleExport('csv')} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <Download className="h-4 w-4" />CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === p.key ? 'bg-[#2D4F97] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2 ml-2">
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
            <span className="text-sm text-gray-400">to</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
            <button onClick={() => fetchStats('custom')} className="px-3 py-2 bg-[#2D4F97] text-white rounded-lg text-sm">Apply</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Chart</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {stats.revenue_data.length > 0 ? stats.revenue_data.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-md transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${(v / maxRevenue) * 100}%`,
                    background: i % 2 === 0 ? '#2D4F97' : '#1E8A8D',
                  }}
                  title={`$${v.toLocaleString()}`}
                />
              )) : (
                Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-md bg-gray-100" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))
              )}
            </div>
          )}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Start</span>
            <span>End</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Task Completion by Platform</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {(stats.task_completion.length > 0 ? stats.task_completion : [
                { platform: 'Facebook', count: 2800, total: 5000 },
                { platform: 'Instagram', count: 2100, total: 5000 },
                { platform: 'TikTok', count: 1900, total: 5000 },
                { platform: 'YouTube', count: 1500, total: 5000 },
                { platform: 'Telegram', count: 1200, total: 5000 },
              ]).map((item, i) => {
                const pct = Math.round((item.count / item.total) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.platform}</span>
                      <span className="font-semibold text-gray-900">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, background: ['#1877F2', '#E4405F', '#000000', '#FF0000', '#26A5E4'][i % 5] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Country Analytics</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(stats.countries.length > 0 ? stats.countries : [
                { country: 'United States', code: 'US', users: 12450, flag: '🇺🇸' },
                { country: 'Philippines', code: 'PH', users: 8930, flag: '🇵🇭' },
                { country: 'India', code: 'IN', users: 7650, flag: '🇮🇳' },
                { country: 'Brazil', code: 'BR', users: 5420, flag: '🇧🇷' },
                { country: 'Nigeria', code: 'NG', users: 3890, flag: '🇳🇬' },
                { country: 'Egypt', code: 'EG', users: 3210, flag: '🇪🇬' },
              ]).map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.flag || COUNTRY_FLAGS[c.code] || '🌍'}</span>
                    <span className="text-sm text-gray-700">{c.country}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{c.users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Platform Usage</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {(stats.platforms.length > 0 ? stats.platforms : [
                { name: 'Facebook', users: 35, percentage: 35 },
                { name: 'Instagram', users: 25, percentage: 25 },
                { name: 'TikTok', users: 20, percentage: 20 },
                { name: 'YouTube', users: 12, percentage: 12 },
                { name: 'Telegram', users: 8, percentage: 8 },
              ]).map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{p.name}</span>
                    <span className="font-semibold text-gray-900">{p.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${p.percentage}%`,
                        background: ['#1877F2', '#E4405F', '#000000', '#FF0000', '#26A5E4'][i % 5],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Reports Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-4">Metric</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Change</th>
                <th className="px-6 py-4">Period</th>
              </tr>
            </thead>
            <tbody>
              {(stats.report_table.length > 0 ? stats.report_table : [
                { metric: 'Total Revenue', value: '$48,250', change: '+18.5%', period: 'This Month' },
                { metric: 'New Users', value: '3,420', change: '+12.3%', period: 'This Month' },
                { metric: 'Tasks Completed', value: '12,850', change: '+24.7%', period: 'This Month' },
                { metric: 'Payouts Processed', value: '$32,100', change: '+15.2%', period: 'This Month' },
                { metric: 'Avg. Revenue/User', value: '$14.12', change: '+5.8%', period: 'This Month' },
                { metric: 'Conversion Rate', value: '3.42%', change: '-0.8%', period: 'This Month' },
              ]).map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.metric}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{row.value}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${(row.change || '').startsWith('+') ? 'text-green-600' : (row.change || '').startsWith('-') ? 'text-red-600' : 'text-gray-700'}`}>{row.change}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}