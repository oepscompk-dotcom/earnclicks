'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, Copy, FileEdit, Eye, StopCircle,
  DollarSign, Users, CheckCircle, TrendingUp,
  Video, Camera, Music, MessageCircle, Twitter, Send, Headphones, Globe,
  AlertCircle,
} from 'lucide-react';

interface ActiveCampaign {
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

const MOCK_ACTIVE: ActiveCampaign[] = [
  { id: 301, name: 'Summer Sale Video Promo', platform: 'youtube', task_type: 'like_comment', status: 'approved', total_budget: 5000, spent: 2340, reward_per_task: 0.50, completed_tasks: 4680, total_tasks: 10000, created_at: '2026-06-15T08:00:00Z', end_date: '2026-08-15T08:00:00Z' },
  { id: 302, name: 'TikTok Viral Challenge', platform: 'tiktok', task_type: 'custom_action', status: 'approved', total_budget: 8000, spent: 5100, reward_per_task: 0.30, completed_tasks: 17000, total_tasks: 26666, created_at: '2026-05-01T12:00:00Z', end_date: '2026-08-01T12:00:00Z' },
  { id: 303, name: 'Website Traffic Campaign', platform: 'website', task_type: 'visit_link', status: 'approved', total_budget: 10000, spent: 6200, reward_per_task: 0.05, completed_tasks: 124000, total_tasks: 200000, created_at: '2026-06-01T08:00:00Z', end_date: '2026-09-01T08:00:00Z' },
  { id: 304, name: 'Instagram Reel Boost', platform: 'instagram', task_type: 'like_comment', status: 'approved', total_budget: 4500, spent: 1800, reward_per_task: 0.45, completed_tasks: 4000, total_tasks: 10000, created_at: '2026-07-01T10:00:00Z', end_date: '2026-09-01T10:00:00Z' },
  { id: 305, name: 'Facebook Page Growth', platform: 'facebook', task_type: 'join_group', status: 'running', total_budget: 3500, spent: 2100, reward_per_task: 0.40, completed_tasks: 5250, total_tasks: 8750, created_at: '2026-06-20T09:00:00Z', end_date: '2026-08-20T09:00:00Z' },
  { id: 306, name: 'Twitter/X Engagement Drive', platform: 'twitter', task_type: 'retweet', status: 'running', total_budget: 2800, spent: 1400, reward_per_task: 0.60, completed_tasks: 2333, total_tasks: 4666, created_at: '2026-07-10T14:00:00Z', end_date: '2026-09-10T14:00:00Z' },
  { id: 307, name: 'Telegram Channel Growth', platform: 'telegram', task_type: 'join_channel', status: 'approved', total_budget: 2000, spent: 1200, reward_per_task: 0.25, completed_tasks: 4800, total_tasks: 8000, created_at: '2026-07-05T11:00:00Z', end_date: '2026-09-05T11:00:00Z' },
  { id: 308, name: 'Discord Community Drive', platform: 'discord', task_type: 'join_discord', status: 'running', total_budget: 3000, spent: 900, reward_per_task: 0.35, completed_tasks: 2571, total_tasks: 8571, created_at: '2026-07-15T16:00:00Z', end_date: '2026-10-15T16:00:00Z' },
  { id: 309, name: 'YouTube Channel Subscriber Push', platform: 'youtube', task_type: 'subscribe', status: 'approved', total_budget: 7500, spent: 4800, reward_per_task: 0.80, completed_tasks: 6000, total_tasks: 9375, created_at: '2026-05-20T08:00:00Z', end_date: '2026-08-20T08:00:00Z' },
  { id: 310, name: 'Instagram Story Ads Campaign', platform: 'instagram', task_type: 'subscribe', status: 'running', total_budget: 6000, spent: 2400, reward_per_task: 0.75, completed_tasks: 3200, total_tasks: 8000, created_at: '2026-07-12T10:00:00Z', end_date: '2026-09-12T10:00:00Z' },
];

function getDaysRemaining(endDate?: string): number {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function ActiveCampaignsPage() {
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const all = res.campaigns || [];
        setCampaigns(all.filter((c: ActiveCampaign) => ['approved', 'running', 'active'].includes(c.status)));
      } catch {
        setCampaigns(MOCK_ACTIVE);
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
  }, []);

  useEffect(() => {
    const handleClick = () => setConfirmEnd(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const metrics = useMemo(() => {
    const totalBudget = campaigns.reduce((s, c) => s + (c.total_budget || 0), 0);
    const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
    const totalWorkers = campaigns.reduce((s, c) => s + (c.completed_tasks || 0), 0);
    const tasksToday = Math.round(totalWorkers * 0.08);
    return { totalActive: campaigns.length, totalBudget: totalBudget - totalSpent, totalWorkers, tasksToday };
  }, [campaigns]);

  const progressPercent = (spent: number, budget: number) =>
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

  const completionPercent = (completed: number, total: number) =>
    total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const handlePause = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/pause`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEnd = async (id: number) => {
    setConfirmEnd(null);
    try {
      await api.post(`/campaigns/${id}/end`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/duplicate`);
    } catch { /* handled silently */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400">Loading active campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Active Campaigns</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {metrics.totalActive} Live
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">Monitor and manage your currently running campaigns</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Active', value: metrics.totalActive, icon: <Play className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]' },
          { label: 'Running Budget', value: formatCurrency(metrics.totalBudget), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]' },
          { label: 'Total Workers', value: metrics.totalWorkers.toLocaleString(), icon: <Users className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]' },
          { label: 'Tasks Today', value: metrics.tasksToday.toLocaleString(), icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]' },
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
          const progress = progressPercent(campaign.spent, campaign.total_budget);
          const completion = completionPercent(campaign.completed_tasks, campaign.total_tasks);
          const daysRemaining = getDaysRemaining(campaign.end_date);
          const platColor = getPlatformColor(campaign.platform);

          return (
            <Card
              key={campaign.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2D4F97]/20 transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0" style={{ color: platColor }}>
                      {getPlatformIcon(campaign.platform)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">{campaign.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Budget spent</span>
                      <span className="font-semibold text-gray-700">{formatCurrency(campaign.spent)} / {formatCurrency(campaign.total_budget)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: progress > 80 ? '#EF4444' : progress > 50 ? '#F59E0B' : 'linear-gradient(90deg, #2D4F97, #18C79A)' }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{progress}% used</span>
                      <span>{formatCurrency(Math.max((campaign.total_budget || 0) - (campaign.spent || 0), 0))} remaining</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-sm font-bold text-[#2D4F97]">{completion}%</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Complete</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-sm font-bold text-[#1E8A8D]">{campaign.completed_tasks?.toLocaleString() || 0}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Workers</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className={cn('text-sm font-bold', daysRemaining <= 3 ? 'text-red-500' : 'text-[#18C79A]')}>{daysRemaining}d</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Remaining</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/advertiser/campaigns/${campaign.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs border-gray-200 hover:border-[#2D4F97]/30 hover:text-[#2D4F97]">
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                    </Button>
                  </Link>
                  <button
                    onClick={() => handlePause(campaign.id)}
                    className="flex-1 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </button>
                  <button
                    onClick={() => handleDuplicate(campaign.id)}
                    className="w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <Link href={`/advertiser/campaigns/${campaign.id}/edit`}>
                    <button className="w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:text-[#2D4F97] hover:border-[#2D4F97]/30 hover:bg-blue-50 transition-colors flex items-center justify-center">
                      <FileEdit className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>

                <div className="relative mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmEnd(confirmEnd === campaign.id ? null : campaign.id); }}
                    className="w-full h-9 rounded-xl border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <StopCircle className="h-3.5 w-3.5" /> End Campaign
                  </button>
                  {confirmEnd === campaign.id && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/40 z-50 p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">End this campaign?</p>
                          <p className="text-xs text-gray-400 mt-1">This will immediately stop all tasks. Unspent budget will be returned to your wallet.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setConfirmEnd(null)} variant="outline" size="sm" className="flex-1 h-9 rounded-xl text-xs">Cancel</Button>
                        <Button onClick={() => handleEnd(campaign.id)} size="sm" className="flex-1 h-9 rounded-xl text-xs bg-red-500 hover:bg-red-600 text-white border-0">End Campaign</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
