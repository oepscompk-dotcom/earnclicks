'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Users, Eye, MessageCircle, Share2, Clock, MousePointer, DollarSign,
  BarChart3, Activity, UserPlus, Target,
} from 'lucide-react';

const PIE_COLORS = ['#2D4F97', '#1E8A8D', '#18C79A', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const METRICS = [
  { label: 'Total Reach', value: '1,245,890', icon: <Eye className="h-4 w-4" />, change: '+12.5%', positive: true },
  { label: 'Total Engagement', value: '324,567', icon: <Activity className="h-4 w-4" />, change: '+18.3%', positive: true },
  { label: 'Followers Gained', value: '12,450', icon: <UserPlus className="h-4 w-4" />, change: '+8.7%', positive: true },
  { label: 'Subscribers', value: '45,230', icon: <Users className="h-4 w-4" />, change: '+15.2%', positive: true },
  { label: 'Comments', value: '28,900', icon: <MessageCircle className="h-4 w-4" />, change: '+22.1%', positive: true },
  { label: 'Shares', value: '15,670', icon: <Share2 className="h-4 w-4" />, change: '+9.4%', positive: true },
  { label: 'Watch Time (hrs)', value: '8,450', icon: <Clock className="h-4 w-4" />, change: '+14.8%', positive: true },
  { label: 'Traffic', value: '892,340', icon: <BarChart3 className="h-4 w-4" />, change: '+11.2%', positive: true },
  { label: 'CTR', value: '4.82%', icon: <MousePointer className="h-4 w-4" />, change: '+0.6%', positive: true },
  { label: 'Cost Per Result', value: formatCurrency(0.42), icon: <DollarSign className="h-4 w-4" />, change: '-5.3%', positive: false },
];

const MOCK_PERFORMANCE = [
  { month: 'Feb', 'Campaign A': 45000, 'Campaign B': 32000, 'Campaign C': 28000 },
  { month: 'Mar', 'Campaign A': 52000, 'Campaign B': 38000, 'Campaign C': 31000 },
  { month: 'Apr', 'Campaign A': 48000, 'Campaign B': 42000, 'Campaign C': 35000 },
  { month: 'May', 'Campaign A': 61000, 'Campaign B': 39000, 'Campaign C': 40000 },
  { month: 'Jun', 'Campaign A': 58000, 'Campaign B': 45000, 'Campaign C': 43000 },
  { month: 'Jul', 'Campaign A': 72000, 'Campaign B': 51000, 'Campaign C': 47000 },
];

const MOCK_REACH = [
  { date: 'Jul 20', reach: 185000, impressions: 320000 },
  { date: 'Jul 21', reach: 210000, impressions: 385000 },
  { date: 'Jul 22', reach: 168000, impressions: 298000 },
  { date: 'Jul 23', reach: 245000, impressions: 445000 },
  { date: 'Jul 24', reach: 198000, impressions: 362000 },
  { date: 'Jul 25', reach: 278000, impressions: 510000 },
  { date: 'Jul 26', reach: 225000, impressions: 418000 },
];

const MOCK_ENGAGEMENT = [
  { name: 'Likes', value: 142000 },
  { name: 'Comments', value: 28900 },
  { name: 'Shares', value: 15670 },
  { name: 'Saves', value: 12450 },
  { name: 'Clicks', value: 89200 },
];

const MOCK_GROWTH = [
  { month: 'Feb', followers: 1200, subscribers: 450 },
  { month: 'Mar', followers: 1800, subscribers: 680 },
  { month: 'Apr', followers: 2100, subscribers: 720 },
  { month: 'May', followers: 2800, subscribers: 950 },
  { month: 'Jun', followers: 2400, subscribers: 880 },
  { month: 'Jul', followers: 3200, subscribers: 1100 },
];

const MOCK_COMMENTS_SHARES = [
  { date: 'Jul 20', comments: 3200, shares: 1800 },
  { date: 'Jul 21', comments: 4100, shares: 2200 },
  { date: 'Jul 22', comments: 2800, shares: 1500 },
  { date: 'Jul 23', comments: 5200, shares: 3100 },
  { date: 'Jul 24', comments: 3900, shares: 2400 },
  { date: 'Jul 25', comments: 4800, shares: 2800 },
  { date: 'Jul 26', comments: 3600, shares: 2100 },
];

const MOCK_WATCH_TIME = [
  { date: 'Jul 20', watchTime: 1120, avgViewDuration: 145 },
  { date: 'Jul 21', watchTime: 1380, avgViewDuration: 162 },
  { date: 'Jul 22', watchTime: 980, avgViewDuration: 134 },
  { date: 'Jul 23', watchTime: 1650, avgViewDuration: 178 },
  { date: 'Jul 24', watchTime: 1250, avgViewDuration: 151 },
  { date: 'Jul 25', watchTime: 1520, avgViewDuration: 169 },
  { date: 'Jul 26', watchTime: 1180, avgViewDuration: 142 },
];

const MOCK_TRAFFIC = [
  { name: 'Organic', value: 35 },
  { name: 'Paid', value: 25 },
  { name: 'Social', value: 20 },
  { name: 'Referral', value: 12 },
  { name: 'Direct', value: 8 },
];

const MOCK_CTR = [
  { date: 'Jul 20', ctr: 4.2 },
  { date: 'Jul 21', ctr: 4.8 },
  { date: 'Jul 22', ctr: 4.1 },
  { date: 'Jul 23', ctr: 5.2 },
  { date: 'Jul 24', ctr: 4.6 },
  { date: 'Jul 25', ctr: 5.0 },
  { date: 'Jul 26', ctr: 4.5 },
];

const MOCK_CPR = [
  { campaign: 'Summer Sale', cpr: 0.38 },
  { campaign: 'Brand Awareness', cpr: 0.45 },
  { campaign: 'TikTok Challenge', cpr: 0.32 },
  { campaign: 'Facebook Growth', cpr: 0.52 },
  { campaign: 'Telegram Boost', cpr: 0.41 },
];

const MOCK_PLATFORMS_COMPARE = [
  { platform: 'YouTube', reach: 425000, engagement: 98500, followers: 5200, subscribers: 12500, ctr: 5.2 },
  { platform: 'Instagram', reach: 318000, engagement: 87600, followers: 4800, subscribers: 0, ctr: 4.8 },
  { platform: 'TikTok', reach: 612000, engagement: 145000, followers: 8900, subscribers: 0, ctr: 6.1 },
  { platform: 'Facebook', reach: 276000, engagement: 52400, followers: 2100, subscribers: 0, ctr: 3.9 },
  { platform: 'Telegram', reach: 189000, engagement: 31200, followers: 1500, subscribers: 800, ctr: 4.3 },
];

const ChartCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm', className)}>
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Comprehensive view of your campaign analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {METRICS.map((m, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">{m.label}</p>
              <span className="w-7 h-7 rounded-lg bg-[#2D4F97]/10 flex items-center justify-center text-[#2D4F97] shrink-0">{m.icon}</span>
            </div>
            <p className="text-base lg:text-lg font-bold text-gray-900 truncate">{m.value}</p>
            <p className={cn('text-[11px] font-medium mt-0.5', m.positive ? 'text-[#18C79A]' : 'text-red-500')}>
              {m.change}
            </p>
          </div>
        ))}
      </div>

      <ChartCard title="Performance Comparison">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={MOCK_PERFORMANCE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line type="monotone" dataKey="Campaign A" stroke="#2D4F97" strokeWidth={2} dot={{ r: 3, fill: '#2D4F97' }} />
            <Line type="monotone" dataKey="Campaign B" stroke="#1E8A8D" strokeWidth={2} dot={{ r: 3, fill: '#1E8A8D' }} />
            <Line type="monotone" dataKey="Campaign C" stroke="#18C79A" strokeWidth={2} dot={{ r: 3, fill: '#18C79A' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Reach Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MOCK_REACH}>
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D4F97" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2D4F97" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18C79A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#18C79A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Area type="monotone" dataKey="reach" stroke="#2D4F97" fill="url(#reachGrad)" strokeWidth={2} name="Reach" />
              <Area type="monotone" dataKey="impressions" stroke="#18C79A" fill="url(#impGrad)" strokeWidth={2} name="Impressions" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Engagement Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={MOCK_ENGAGEMENT} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {MOCK_ENGAGEMENT.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Followers & Subscribers Growth">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="followers" fill="#2D4F97" radius={[4, 4, 0, 0]} name="Followers" />
              <Bar dataKey="subscribers" fill="#18C79A" radius={[4, 4, 0, 0]} name="Subscribers" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Comments & Shares">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_COMMENTS_SHARES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="comments" fill="#1E8A8D" radius={[4, 4, 0, 0]} name="Comments" />
              <Bar dataKey="shares" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Watch Time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MOCK_WATCH_TIME}>
              <defs>
                <linearGradient id="wtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E8A8D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E8A8D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Area type="monotone" dataKey="watchTime" stroke="#1E8A8D" fill="url(#wtGrad)" strokeWidth={2} name="Watch Time (hrs)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={MOCK_TRAFFIC} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {MOCK_TRAFFIC.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CTR Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MOCK_CTR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[3, 6]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="ctr" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} name="CTR %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cost Per Result">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_CPR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="campaign" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="cpr" fill="#EF4444" radius={[4, 4, 0, 0]} name="Cost Per Result" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Platform Comparison">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-4">Platform</th>
                <th className="px-4 py-4 text-right">Reach</th>
                <th className="px-4 py-4 text-right">Engagement</th>
                <th className="px-4 py-4 text-right">Followers</th>
                <th className="px-4 py-4 text-right">Subscribers</th>
                <th className="px-4 py-4 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PLATFORMS_COMPARE.map((p, i) => (
                <tr key={p.platform} className={cn('border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors', i === MOCK_PLATFORMS_COMPARE.length - 1 && 'border-b-0')}>
                  <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{p.platform}</p></td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.reach.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.engagement.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.followers.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{p.subscribers.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-[#1E8A8D]">{p.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
