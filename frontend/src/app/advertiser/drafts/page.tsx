'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileEdit, Copy, Trash2, Send, Clock, CalendarDays,
  Video, Camera, Music, MessageCircle, Twitter, Send as SendIcon, Headphones, Globe,
  FileText, Plus,
} from 'lucide-react';

interface DraftCampaign {
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
  updated_at: string;
  end_date?: string;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <Video className="h-4 w-4" />,
  instagram: <Camera className="h-4 w-4" />,
  tiktok: <Music className="h-4 w-4" />,
  facebook: <MessageCircle className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  telegram: <SendIcon className="h-4 w-4" />,
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

const MOCK_DRAFTS: DraftCampaign[] = [
  { id: 101, name: 'Holiday Special YouTube Campaign', platform: 'youtube', task_type: 'like_comment', status: 'draft', total_budget: 6000, spent: 0, reward_per_task: 0.50, completed_tasks: 0, total_tasks: 12000, created_at: '2026-07-20T10:00:00Z', updated_at: '2026-07-25T14:30:00Z' },
  { id: 102, name: 'Instagram Product Launch', platform: 'instagram', task_type: 'subscribe', status: 'draft', total_budget: 4000, spent: 0, reward_per_task: 0.75, completed_tasks: 0, total_tasks: 5333, created_at: '2026-07-22T08:00:00Z', updated_at: '2026-07-26T09:15:00Z' },
  { id: 103, name: 'TikTok Brand Awareness', platform: 'tiktok', task_type: 'custom_action', status: 'draft', total_budget: 7500, spent: 0, reward_per_task: 0.30, completed_tasks: 0, total_tasks: 25000, created_at: '2026-07-18T12:00:00Z', updated_at: '2026-07-24T16:45:00Z' },
  { id: 104, name: 'Facebook Group Promo', platform: 'facebook', task_type: 'join_group', status: 'draft', total_budget: 2500, spent: 0, reward_per_task: 0.40, completed_tasks: 0, total_tasks: 6250, created_at: '2026-07-25T09:00:00Z', updated_at: '2026-07-26T11:00:00Z' },
  { id: 105, name: 'Telegram Crypto Signal Channel', platform: 'telegram', task_type: 'join_channel', status: 'draft', total_budget: 1800, spent: 0, reward_per_task: 0.25, completed_tasks: 0, total_tasks: 7200, created_at: '2026-07-23T14:00:00Z', updated_at: '2026-07-26T08:30:00Z' },
  { id: 106, name: 'Twitter/X Viral Thread', platform: 'twitter', task_type: 'retweet', status: 'draft', total_budget: 3500, spent: 0, reward_per_task: 0.60, completed_tasks: 0, total_tasks: 5833, created_at: '2026-07-21T11:00:00Z', updated_at: '2026-07-25T10:20:00Z' },
  { id: 107, name: 'Discord Server Boost', platform: 'discord', task_type: 'join_discord', status: 'draft', total_budget: 2200, spent: 0, reward_per_task: 0.35, completed_tasks: 0, total_tasks: 6285, created_at: '2026-07-19T16:00:00Z', updated_at: '2026-07-24T13:00:00Z' },
  { id: 108, name: 'Website SEO Traffic Test', platform: 'website', task_type: 'visit_link', status: 'draft', total_budget: 12000, spent: 0, reward_per_task: 0.05, completed_tasks: 0, total_tasks: 240000, created_at: '2026-07-26T06:00:00Z', updated_at: '2026-07-26T06:00:00Z' },
  { id: 109, name: 'YouTube Shorts Campaign', platform: 'youtube', task_type: 'subscribe', status: 'draft', total_budget: 5000, spent: 0, reward_per_task: 0.80, completed_tasks: 0, total_tasks: 6250, created_at: '2026-07-17T07:00:00Z', updated_at: '2026-07-23T15:30:00Z' },
  { id: 110, name: 'Instagram Reel Contest', platform: 'instagram', task_type: 'like_comment', status: 'draft', total_budget: 4500, spent: 0, reward_per_task: 0.45, completed_tasks: 0, total_tasks: 10000, created_at: '2026-07-24T10:00:00Z', updated_at: '2026-07-26T12:00:00Z' },
  { id: 111, name: 'Facebook Marketplace Ads', platform: 'facebook', task_type: 'custom_action', status: 'draft', total_budget: 3000, spent: 0, reward_per_task: 0.55, completed_tasks: 0, total_tasks: 5454, created_at: '2026-07-16T08:00:00Z', updated_at: '2026-07-22T09:45:00Z' },
];

export default function DraftCampaignsPage() {
  const [campaigns, setCampaigns] = useState<DraftCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const all = res.campaigns || [];
        setCampaigns(all.filter((c: DraftCampaign) => c.status === 'draft'));
      } catch {
        setCampaigns(MOCK_DRAFTS);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const handleDuplicate = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/duplicate`);
      const res = await api.get<any>('/campaigns');
      const all = res.campaigns || [];
      setCampaigns(all.filter((c: DraftCampaign) => c.status === 'draft'));
    } catch {
      const found = campaigns.find((c) => c.id === id);
      if (found) {
        const dup = { ...found, id: Date.now(), name: `${found.name} (Copy)`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        setCampaigns((prev) => [...prev, dup]);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await api.post(`/campaigns/${id}/submit`);
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
          <p className="mt-4 text-sm text-gray-400">Loading drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Draft Campaigns</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {campaigns.length} draft{campaigns.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Finish setting up your draft campaigns and publish them for review</p>
        </div>
        <Link href="/advertiser/campaigns/create">
          <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm">
          <CardContent className="py-20 text-center">
            <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No draft campaigns</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Draft campaigns let you save your work and come back later. Start creating a new campaign to see it here.
            </p>
            <Link href="/advertiser/campaigns/create">
              <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white shadow-lg shadow-[#2D4F97]/20">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
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
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{campaign.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{campaign.platform}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-gray-500 border-gray-200 bg-gray-50 text-[10px] px-2 py-0.5">Draft</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(campaign.total_budget || 0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Tasks</p>
                      <p className="font-semibold text-gray-900">{campaign.total_tasks?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>Created {formatDate(campaign.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>Last edited {formatDate(campaign.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/advertiser/campaigns/${campaign.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs border-gray-200 hover:border-[#2D4F97]/30 hover:text-[#2D4F97]">
                        <FileEdit className="h-3.5 w-3.5 mr-1.5" /> Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDuplicate(campaign.id)}
                      className="flex-1 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" /> Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handlePublish(campaign.id)}
                      className="flex-1 h-9 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white text-xs font-medium hover:from-[#1E3A7A] hover:to-[#166A6D] shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" /> Publish
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
