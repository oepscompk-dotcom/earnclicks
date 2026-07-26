'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3, LineChart as LineChartIcon, TrendingUp, DollarSign,
  CheckCircle, Users, Play, Download, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const platforms = [
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', icon: '👍' },
  { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { id: 'telegram', label: 'Telegram', icon: '✈️' },
  { id: 'discord', label: 'Discord', icon: '💬' },
  { id: 'website', label: 'Website', icon: '🌐' },
];

const platformData: Record<string, {
  campaigns: number; tasks: number; completionRate: number; avgReward: number; totalSpend: number;
  engagement: number; impressions: number; clicks: number; ctr: number;
}> = {
  youtube: { campaigns: 24, tasks: 12500, completionRate: 87, avgReward: 0.85, totalSpend: 42500, engagement: 6.2, impressions: 2800000, clicks: 112000, ctr: 4.0 },
  instagram: { campaigns: 31, tasks: 18200, completionRate: 91, avgReward: 0.75, totalSpend: 38500, engagement: 8.5, impressions: 3500000, clicks: 185000, ctr: 5.3 },
  tiktok: { campaigns: 28, tasks: 15800, completionRate: 93, avgReward: 0.65, totalSpend: 32000, engagement: 12.1, impressions: 4200000, clicks: 252000, ctr: 6.0 },
  facebook: { campaigns: 19, tasks: 9800, completionRate: 82, avgReward: 0.90, totalSpend: 35000, engagement: 4.8, impressions: 2200000, clicks: 88000, ctr: 4.0 },
  twitter: { campaigns: 15, tasks: 7200, completionRate: 78, avgReward: 0.95, totalSpend: 22500, engagement: 3.5, impressions: 1500000, clicks: 45000, ctr: 3.0 },
  telegram: { campaigns: 12, tasks: 5500, completionRate: 95, avgReward: 0.55, totalSpend: 12500, engagement: 15.2, impressions: 800000, clicks: 56000, ctr: 7.0 },
  discord: { campaigns: 10, tasks: 4200, completionRate: 94, avgReward: 0.60, totalSpend: 10500, engagement: 14.8, impressions: 650000, clicks: 45500, ctr: 7.0 },
  website: { campaigns: 22, tasks: 14500, completionRate: 85, avgReward: 0.80, totalSpend: 48000, engagement: 5.5, impressions: 3100000, clicks: 124000, ctr: 4.0 },
};

const comparisonData = platforms.map(p => ({
  platform: p.label,
  Completion: platformData[p.id].completionRate,
  Engagement: platformData[p.id].engagement * 10,
  CTR: platformData[p.id].ctr * 10,
}));

const dailyPerformanceData = [
  { day: 'Mon', youtube: 3200, instagram: 4100, tiktok: 3800, facebook: 2800, twitter: 1800 },
  { day: 'Tue', youtube: 3500, instagram: 4300, tiktok: 4200, facebook: 2900, twitter: 1900 },
  { day: 'Wed', youtube: 3400, instagram: 4500, tiktok: 4100, facebook: 3100, twitter: 2000 },
  { day: 'Thu', youtube: 3800, instagram: 4800, tiktok: 4600, facebook: 3200, twitter: 2100 },
  { day: 'Fri', youtube: 4200, instagram: 5200, tiktok: 5100, facebook: 3500, twitter: 2400 },
  { day: 'Sat', youtube: 4800, instagram: 5800, tiktok: 5600, facebook: 3800, twitter: 2600 },
  { day: 'Sun', youtube: 4500, instagram: 5400, tiktok: 5200, facebook: 3600, twitter: 2300 },
];

const platformColors: Record<string, string> = {
  youtube: '#FF0000', instagram: '#E4405F', tiktok: '#000000', facebook: '#1877F2',
  twitter: '#1DA1F2', telegram: '#0088CC', discord: '#5865F2', website: '#2D4F97',
};

export default function PlatformReportsPage() {
  const [activePlatform, setActivePlatform] = useState('youtube');
  const current = platformData[activePlatform];
  const pf = platforms.find(p => p.id === activePlatform)!;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Performance metrics across all platforms</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export All</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {platforms.map(p => (
          <button key={p.id} onClick={() => setActivePlatform(p.id)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
              activePlatform === p.id
                ? 'bg-[#2D4F97] text-white border-[#2D4F97]'
                : 'bg-white/80 backdrop-blur-xl border-gray-200 text-gray-600 hover:border-[#2D4F97]/30'
            )}>
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Campaigns</p>
            <p className="text-xl font-bold text-gray-900">{current.campaigns}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
            <p className="text-xl font-bold text-gray-900">{current.tasks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
            <p className="text-xl font-bold text-green-600">{current.completionRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spend</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(current.totalSpend)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Avg Reward</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(current.avgReward)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Impressions</p>
            <p className="text-lg font-bold text-gray-900">{current.impressions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Clicks</p>
            <p className="text-lg font-bold text-gray-900">{current.clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">CTR</p>
            <p className="text-lg font-bold text-[#2D4F97]">{current.ctr}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#2D4F97]" />Platform Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completion" fill="#2D4F97" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Engagement" fill="#1E8A8D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CTR" fill="#18C79A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><LineChartIcon className="h-4 w-4 text-[#1E8A8D]" />Tasks Completed — Daily</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dailyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {['youtube', 'instagram', 'tiktok', 'facebook', 'twitter'].map(p => (
                  <Line key={p} type="monotone" dataKey={p} stroke={platformColors[p]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#18C79A]" />Platform Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Platform</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Campaigns</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Tasks</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Completion</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Avg Reward</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Spend</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">CTR</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map(p => {
                  const d = platformData[p.id];
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900"><span className="mr-2">{p.icon}</span>{p.label}</td>
                      <td className="px-4 py-3 text-gray-700">{d.campaigns}</td>
                      <td className="px-4 py-3 text-gray-700">{d.tasks.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-200">
                            <div className="h-full rounded-full bg-green-500" style={{ width: `${d.completionRate}%` }} />
                          </div>
                          <span className="text-xs text-gray-600">{d.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatCurrency(d.avgReward)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatCurrency(d.totalSpend)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.ctr >= 5 ? 'success' : d.ctr >= 4 ? 'warning' : 'default'} className="text-[10px]">{d.ctr}%</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
