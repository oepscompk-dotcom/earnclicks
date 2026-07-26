'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3, Copy, Archive, Plus,
  DollarSign, CheckCircle, TrendingUp, Users,
  Video, Camera, Music, MessageCircle, Twitter, Send, Headphones, Globe,
  ThumbsUp, UserPlus, Eye, MessageSquare, Share2, Heart,
} from 'lucide-react';

interface CompletedCampaign {
  id: number;
  name: string;
  platform: string;
  task_type: string;
  status: string;
  total_budget: number;
  spent: number;
  reward_per_task: number;
  completed_tasks: number;
  total_tasks: number;
  created_at: string;
  end_date?: string;
  final_metrics?: {
    likes?: number;
    follows?: number;
    views?: number;
    comments?: number;
    shares?: number;
    clicks?: number;
  };
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <Video className="h-4 w-4" />,
  instagram: <Camera className="h-4 w-4" />,
  tiktok: <Music className="h-4 w-4" />,
  facebook: <MessageCircle className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  telegram: <Send className="h-4 w-4" />,
  discord: <Headphones className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#FF0000',
  instagram: '#E4405F',
  tiktok: '#000000',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  telegram: '#26A5E4',
  discord: '#5865F2',
  website: '#2D4F97',
};

const METRIC_ICONS: Record<string, React.ReactNode> = {
  likes: <ThumbsUp className="h-3.5 w-3.5" />,
  follows: <UserPlus className="h-3.5 w-3.5" />,
  views: <Eye className="h-3.5 w-3.5" />,
  comments: <MessageSquare className="h-3.5 w-3.5" />,
  shares: <Share2 className="h-3.5 w-3.5" />,
  clicks: <Eye className="h-3.5 w-3.5" />,
};

const MOCK_COMPLETED: CompletedCampaign[] = [
  { id: 501, name: 'YouTube Channel Subs', platform: 'youtube', task_type: 'subscribe', status: 'completed', total_budget: 6000, spent: 6000, reward_per_task: 0.80, completed_tasks: 7500, total_tasks: 7500, created_at: '2026-01-10T08:00:00Z', end_date: '2026-04-10T08:00:00Z', final_metrics: { likes: 3200, follows: 7500, views: 45000 } },
  { id: 502, name: 'Telegram Channel Boost', platform: 'telegram', task_type: 'join_channel', status: 'completed', total_budget: 1500, spent: 1500, reward_per_task: 0.25, completed_tasks: 6000, total_tasks: 6000, created_at: '2026-03-05T07:00:00Z', end_date: '2026-06-05T07:00:00Z', final_metrics: { follows: 6000, clicks: 12000 } },
  { id: 503, name: 'IG Follower Campaign', platform: 'instagram', task_type: 'subscribe', status: 'completed', total_budget: 4000, spent: 4000, reward_per_task: 0.75, completed_tasks: 5333, total_tasks: 5333, created_at: '2026-02-15T10:00:00Z', end_date: '2026-05-15T10:00:00Z', final_metrics: { likes: 8900, follows: 5333, comments: 1200 } },
  { id: 504, name: 'Facebook Page Likes', platform: 'facebook', task_type: 'join_group', status: 'completed', total_budget: 2000, spent: 2000, reward_per_task: 0.40, completed_tasks: 5000, total_tasks: 5000, created_at: '2026-02-01T09:00:00Z', end_date: '2026-05-01T09:00:00Z', final_metrics: { likes: 5000, shares: 1800 } },
  { id: 505, name: 'Twitter/X Follower Drive', platform: 'twitter', task_type: 'retweet', status: 'completed', total_budget: 3500, spent: 3500, reward_per_task: 0.60, completed_tasks: 5833, total_tasks: 5833, created_at: '2026-01-20T14:00:00Z', end_date: '2026-04-20T14:00:00Z', final_metrics: { follows: 5833, shares: 4200, comments: 950 } },
  { id: 506, name: 'TikTok Viral Campaign', platform: 'tiktok', task_type: 'custom_action', status: 'completed', total_budget: 10000, spent: 10000, reward_per_task: 0.30, completed_tasks: 33333, total_tasks: 33333, created_at: '2026-01-05T12:00:00Z', end_date: '2026-04-05T12:00:00Z', final_metrics: { likes: 15000, follows: 8500, views: 250000, shares: 6200 } },
  { id: 507, name: 'Discord Server Growth', platform: 'discord', task_type: 'join_discord', status: 'completed', total_budget: 2500, spent: 2500, reward_per_task: 0.35, completed_tasks: 7142, total_tasks: 7142, created_at: '2026-03-01T16:00:00Z', end_date: '2026-06-01T16:00:00Z', final_metrics: { follows: 7142, comments: 3400 } },
  { id: 508, name: 'Website Traffic Campaign Q1', platform: 'website', task_type: 'visit_link', status: 'completed', total_budget: 12000, spent: 12000, reward_per_task: 0.05, completed_tasks: 240000, total_tasks: 240000, created_at: '2026-01-01T08:00:00Z', end_date: '2026-04-01T08:00:00Z', final_metrics: { clicks: 240000, views: 480000 } },
  { id: 509, name: 'YouTube Tutorial Promo', platform: 'youtube', task_type: 'like_comment', status: 'completed', total_budget: 4500, spent: 4500, reward_per_task: 0.50, completed_tasks: 9000, total_tasks: 9000, created_at: '2026-02-20T08:00:00Z', end_date: '2026-05-20T08:00:00Z', final_metrics: { likes: 9000, comments: 2100, views: 85000 } },
  { id: 510, name: 'Instagram Story Views', platform: 'instagram', task_type: 'custom_action', status: 'completed', total_budget: 3000, spent: 3000, reward_per_task: 0.45, completed_tasks: 6666, total_tasks: 6666, created_at: '2026-03-15T10:00:00Z', end_date: '2026-06-15T10:00:00Z', final_metrics: { views: 180000, likes: 4200, follows: 3200 } },
];

export default function CompletedCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CompletedCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const all = res.campaigns || [];
        setCampaigns(all.filter((c: CompletedCampaign) => c.status === 'completed'));
      } catch {
        setCampaigns(MOCK_COMPLETED);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  const summary = useMemo(() => {
    const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
    const totalTasks = campaigns.reduce((s, c) => s + (c.completed_tasks || 0), 0);
    const campaignsWithCompletion = campaigns.filter((c) => c.total_tasks > 0);
    const avgCompletion = campaignsWithCompletion.length
      ? campaignsWithCompletion.reduce((s, c) => s + Math.min((c.completed_tasks / c.total_tasks) * 100, 100), 0) / campaignsWithCompletion.length
      : 0;
    return {
      totalCompleted: campaigns.length,
      totalSpent,
      avgCompletion: avgCompletion.toFixed(1),
      totalTasksDone: totalTasks,
    };
  }, [campaigns]);

  const completionPercent = (completed: number, total: number) =>
    total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  const budgetUtilization = (spent: number, budget: number) =>
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const handleDuplicate = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/duplicate`);
    } catch { /* handled silently */ }
  };

  const handleArchive = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/archive`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400">Loading completed campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Completed Campaigns</h1>
          <p className="text-sm text-gray-400 mt-1">Review results and insights from finished campaigns</p>
        </div>
        <Link href="/advertiser/campaigns/create">
          <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Similar Campaign
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Completed', value: summary.totalCompleted, icon: <CheckCircle className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]' },
          { label: 'Total Spent', value: formatCurrency(summary.totalSpent), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]' },
          { label: 'Avg Completion', value: `${summary.avgCompletion}%`, icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]' },
          { label: 'Tasks Done', value: summary.totalTasksDone.toLocaleString(), icon: <Users className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]' },
        ].map((m, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', m.gradient)}>
                  {m.icon}
                </div>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const completion = completionPercent(campaign.completed_tasks, campaign.total_tasks);
          const utilization = budgetUtilization(campaign.spent, campaign.total_budget);
          const platColor = getPlatformColor(campaign.platform);
          const metrics = campaign.final_metrics || {};

          return (
            <Card
              key={campaign.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2D4F97]/20 transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0" style={{ color: platColor }}>
                      {getPlatformIcon(campaign.platform)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">{campaign.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <CheckCircle className="h-3 w-3" />
                    Done
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Budget vs Spent</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.spent)}</p>
                    <p className="text-[10px] text-gray-400">of {formatCurrency(campaign.total_budget)}</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-[#18C79A]" style={{ width: `${utilization}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Completion</p>
                    <p className="text-sm font-bold text-[#2D4F97]">{completion}%</p>
                    <p className="text-[10px] text-gray-400">{campaign.completed_tasks?.toLocaleString()} / {campaign.total_tasks?.toLocaleString()} tasks</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-[#2D4F97]" style={{ width: `${completion}%` }} />
                    </div>
                  </div>
                </div>

                {Object.keys(metrics).length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Final Metrics</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(metrics).map(([key, val]) => (
                        <span key={key} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-100 text-xs text-gray-700 font-medium">
                          {METRIC_ICONS[key] || <BarChart3 className="h-3.5 w-3.5" />}
                          {typeof val === 'number' ? val.toLocaleString() : val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/advertiser/reports?campaign=${campaign.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs border-gray-200 hover:border-[#2D4F97]/30 hover:text-[#2D4F97]">
                      <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> View Report
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDuplicate(campaign.id)}
                    className="flex-1 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" /> Duplicate
                  </button>
                  <button
                    onClick={() => handleArchive(campaign.id)}
                    className="w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
