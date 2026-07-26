'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Play, FileEdit, Copy, Trash2, Pause,
  Video, Camera, Music, MessageCircle, Twitter, Send, Headphones, Globe,
  Clock, Search,
} from 'lucide-react';

interface PausedCampaign {
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
  paused_at?: string;
  pause_reason?: string;
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

const MOCK_PAUSED: PausedCampaign[] = [
  { id: 401, name: 'Facebook Group Growth', platform: 'facebook', task_type: 'join_group', status: 'paused', total_budget: 2000, spent: 850, reward_per_task: 0.40, completed_tasks: 2125, total_tasks: 5000, created_at: '2026-04-10T09:00:00Z', paused_at: '2026-07-01T10:00:00Z', pause_reason: 'Budget reallocation' },
  { id: 402, name: 'Instagram Influencer Campaign', platform: 'instagram', task_type: 'subscribe', status: 'paused', total_budget: 3500, spent: 1200, reward_per_task: 0.75, completed_tasks: 1600, total_tasks: 4666, created_at: '2026-05-15T08:00:00Z', paused_at: '2026-07-10T14:00:00Z', pause_reason: 'Under performance review' },
  { id: 403, name: 'YouTube Pre-roll Ads', platform: 'youtube', task_type: 'like_comment', status: 'paused', total_budget: 6000, spent: 2800, reward_per_task: 0.50, completed_tasks: 5600, total_tasks: 12000, created_at: '2026-04-20T11:00:00Z', paused_at: '2026-06-28T09:00:00Z', pause_reason: 'Creative assets update' },
  { id: 404, name: 'Twitter/X Brand Campaign', platform: 'twitter', task_type: 'retweet', status: 'paused', total_budget: 2500, spent: 1100, reward_per_task: 0.60, completed_tasks: 1833, total_tasks: 4166, created_at: '2026-06-01T14:00:00Z', paused_at: '2026-07-15T16:00:00Z' },
  { id: 405, name: 'Telegram Community Ads', platform: 'telegram', task_type: 'join_channel', status: 'paused', total_budget: 1800, spent: 600, reward_per_task: 0.25, completed_tasks: 2400, total_tasks: 7200, created_at: '2026-05-25T07:00:00Z', paused_at: '2026-07-05T12:00:00Z', pause_reason: 'Strategy revision' },
  { id: 406, name: 'Discord Server Expansion', platform: 'discord', task_type: 'join_discord', status: 'paused', total_budget: 3000, spent: 1400, reward_per_task: 0.35, completed_tasks: 4000, total_tasks: 8571, created_at: '2026-05-10T16:00:00Z', paused_at: '2026-07-08T11:00:00Z' },
  { id: 407, name: 'TikTok Product Showcase', platform: 'tiktok', task_type: 'custom_action', status: 'paused', total_budget: 5000, spent: 2100, reward_per_task: 0.30, completed_tasks: 7000, total_tasks: 16666, created_at: '2026-06-05T12:00:00Z', paused_at: '2026-07-12T15:00:00Z', pause_reason: 'Budget reallocation' },
  { id: 408, name: 'Website Lead Gen Campaign', platform: 'website', task_type: 'visit_link', status: 'paused', total_budget: 8000, spent: 3500, reward_per_task: 0.05, completed_tasks: 70000, total_tasks: 160000, created_at: '2026-05-01T08:00:00Z', paused_at: '2026-07-02T10:00:00Z', pause_reason: 'Under performance review' },
  { id: 409, name: 'Facebook Retargeting Ads', platform: 'facebook', task_type: 'custom_action', status: 'paused', total_budget: 4000, spent: 1800, reward_per_task: 0.55, completed_tasks: 3272, total_tasks: 7272, created_at: '2026-06-15T09:00:00Z', paused_at: '2026-07-18T13:00:00Z' },
  { id: 410, name: 'Instagram Shop Promo', platform: 'instagram', task_type: 'like_comment', status: 'paused', total_budget: 2800, spent: 900, reward_per_task: 0.45, completed_tasks: 2000, total_tasks: 6222, created_at: '2026-06-25T10:00:00Z', paused_at: '2026-07-20T08:00:00Z', pause_reason: 'Creative assets update' },
];

export default function PausedCampaignsPage() {
  const [campaigns, setCampaigns] = useState<PausedCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaused = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const all = res.campaigns || [];
        setCampaigns(all.filter((c: PausedCampaign) => c.status === 'paused'));
      } catch {
        setCampaigns(MOCK_PAUSED);
      } finally {
        setLoading(false);
      }
    };
    fetchPaused();
  }, []);

  const progressPercent = (spent: number, budget: number) =>
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const handleResume = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/resume`);
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

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/campaigns/${id}`);
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
          <p className="mt-4 text-sm text-gray-400">Loading paused campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Paused Campaigns</h1>
        <p className="text-sm text-gray-400 mt-1">Campaigns that have been temporarily stopped</p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardContent className="py-20 text-center">
            <Pause className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No paused campaigns</h3>
            <p className="text-sm text-gray-400">All your campaigns are currently running smoothly.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-4">Campaign</th>
                  <th className="px-4 py-4">Platform</th>
                  <th className="px-4 py-4 text-right">Budget</th>
                  <th className="px-4 py-4 text-right">Spent</th>
                  <th className="px-4 py-4 text-right hidden lg:table-cell">Paused</th>
                  <th className="px-4 py-4 hidden xl:table-cell">Reason</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const progress = progressPercent(campaign.spent, campaign.total_budget);
                  const platColor = getPlatformColor(campaign.platform);
                  return (
                    <tr key={campaign.id} className="border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0" style={{ color: platColor }}>
                            {getPlatformIcon(campaign.platform)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{campaign.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{campaign.task_type?.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: `${platColor}10`, color: platColor }}>
                          {getPlatformIcon(campaign.platform)}
                          {campaign.platform?.charAt(0).toUpperCase() + campaign.platform?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.total_budget || 0)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(campaign.spent || 0)}</p>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#F59E0B' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-amber-400" />
                          {campaign.paused_at ? formatDate(campaign.paused_at) : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <span className="text-sm text-gray-500 italic">
                          {campaign.pause_reason || 'No reason provided'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResume(campaign.id)}
                            className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white text-xs font-medium hover:from-[#1E3A7A] hover:to-[#166A6D] shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Play className="h-3 w-3" /> Resume
                          </button>
                          <Link href={`/advertiser/campaigns/${campaign.id}/edit`}>
                            <button className="w-8 h-8 rounded-xl border border-gray-200 text-gray-400 hover:text-[#2D4F97] hover:border-[#2D4F97]/30 hover:bg-blue-50 transition-colors flex items-center justify-center">
                              <FileEdit className="h-3.5 w-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(campaign.id)}
                            className="w-8 h-8 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="w-8 h-8 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
