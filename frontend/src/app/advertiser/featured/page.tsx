'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star, TrendingUp, Zap, BarChart3, Target, Clock,
  Rocket, Award, ArrowRight, CheckCircle, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const featuredCampaigns = [
  { id: 1, name: 'Brand Awareness Q3', platform: 'TikTok', budget: 25000, spent: 18750, ctr: 6.8, completionRate: 94, status: 'active', impressions: 850000, clicks: 57800 },
  { id: 2, name: 'Product Launch 2026', platform: 'Instagram', budget: 40000, spent: 22500, ctr: 7.2, completionRate: 96, status: 'active', impressions: 1200000, clicks: 86400 },
  { id: 3, name: 'Holiday Special', platform: 'YouTube', budget: 30000, spent: 12000, ctr: 5.9, completionRate: 91, status: 'active', impressions: 650000, clicks: 38350 },
];

const comparisonData = [
  { metric: 'CTR (%)', Featured: 6.8, 'Non-Featured': 3.2 },
  { metric: 'Completion Rate (%)', Featured: 93, 'Non-Featured': 78 },
  { metric: 'Engagement Rate (%)', Featured: 12.5, 'Non-Featured': 5.8 },
  { metric: 'Avg Speed (hrs)', Featured: 4.2, 'Non-Featured': 12.5 },
];

const benefitsData = [
  { stat: '2.1x', label: 'Average Reach', desc: 'Featured campaigns reach double the audience' },
  { stat: '3.2x', label: 'Completion Speed', desc: 'Tasks complete 3x faster than standard' },
  { stat: '2.8x', label: 'Worker Engagement', desc: 'Higher quality worker participation' },
  { stat: '85%', label: 'Cost Efficiency', desc: 'Better ROI compared to standard campaigns' },
];

export default function FeaturedPage() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Campaigns Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Track and analyze your featured campaign performance</p>
        </div>
        <Button className="bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:opacity-90 gap-2">
          <Rocket className="h-4 w-4" /> Feature a Campaign
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefitsData.map(b => (
          <Card key={b.label} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2D4F97] to-[#18C79A]">{b.stat}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{b.label}</p>
              <p className="text-[11px] text-gray-400 mt-1">{b.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#2D4F97]" />Featured vs Non-Featured</CardTitle>
              <div className="flex gap-1">
                {['7d', '30d', '90d'].map(t => (
                  <button key={t} onClick={() => setTimeframe(t)}
                    className={cn('px-2 py-1 rounded text-[10px] font-medium transition-all',
                      timeframe === t ? 'bg-[#2D4F97] text-white' : 'bg-gray-100 text-gray-500'
                    )}>{t}</button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Featured" fill="#2D4F97" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Non-Featured" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5 text-[#18C79A]" />Featured Campaign Benefits</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Target, label: 'Priority Placement', desc: 'Your campaigns appear at the top of worker feeds', color: 'text-[#2D4F97]' },
              { icon: TrendingUp, label: 'Boosted Visibility', desc: '2.1x more impressions than standard campaigns', color: 'text-[#1E8A8D]' },
              { icon: Zap, label: 'Faster Completions', desc: 'Workers prioritize featured tasks, completing 3x faster', color: 'text-[#18C79A]' },
              { icon: Star, label: 'Premium Workers', desc: 'Higher-rated workers are more likely to accept', color: 'text-yellow-500' },
              { icon: Clock, label: 'Priority Support', desc: 'Dedicated support with faster response times', color: 'text-purple-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', item.color.replace('text-', 'bg-').replace('500', '100'))}>
                  <item.icon className={cn('h-4 w-4', item.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" /> Currently Featured Campaigns
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredCampaigns.map(c => (
            <Card key={c.id} className="bg-white/80 backdrop-blur-xl border border-yellow-200/50 rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#2D4F97] via-[#1E8A8D] to-[#18C79A]" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Badge variant="success" className="text-[10px]">Featured</Badge>
                  </div>
                  <span className="text-xs text-gray-400">{c.platform}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{c.name}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-medium text-gray-700">{formatCurrency(c.budget)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Spent</span><span className="font-medium text-gray-700">{formatCurrency(c.spent)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">CTR</span><span className="font-medium text-green-600">{c.ctr}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Completion</span><span className="font-medium text-green-600">{c.completionRate}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Impressions</span><span className="font-medium text-gray-700">{c.impressions.toLocaleString()}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="w-full h-1.5 rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2D4F97] to-[#18C79A]" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{((c.spent / c.budget) * 100).toFixed(0)}% of budget used</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2D4F97]/10 via-[#1E8A8D]/5 to-[#18C79A]/10 border border-dashed border-[#2D4F97]/20 text-center">
        <Rocket className="h-8 w-8 text-[#2D4F97] mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Want to feature your campaign?</h3>
        <p className="text-sm text-gray-500 mb-4">Boost your campaign performance with featured placement</p>
        <Button className="bg-[#2D4F97] hover:bg-[#2D4F97]/90 gap-2">
          Feature a Campaign <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
