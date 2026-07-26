'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock, Hourglass, AlertTriangle, CheckCircle2,
  Video, Camera, Music, MessageCircle, Twitter, Send, Headphones, Globe,
  Eye, Search,
} from 'lucide-react';

interface PendingCampaign {
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
  submitted_at?: string;
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

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string; dot: string; icon: React.ReactNode }> = {
  under_review: { label: 'Under Review', bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6', icon: <Clock className="h-3 w-3" /> },
  changes_requested: { label: 'Changes Requested', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316', icon: <AlertTriangle className="h-3 w-3" /> },
  pending: { label: 'Pending', bg: '#FEFCE8', color: '#A16207', dot: '#EAB308', icon: <Hourglass className="h-3 w-3" /> },
};

const FILTER_TABS = ['All', 'Under Review', 'Changes Requested'] as const;

const MOCK_PENDING: PendingCampaign[] = [
  { id: 201, name: 'Summer Sale Video Promo', platform: 'youtube', task_type: 'like_comment', status: 'under_review', total_budget: 5000, spent: 0, reward_per_task: 0.50, completed_tasks: 0, total_tasks: 10000, created_at: '2026-07-24T08:00:00Z', submitted_at: '2026-07-25T10:00:00Z' },
  { id: 202, name: 'Brand Awareness IG Reels', platform: 'instagram', task_type: 'subscribe', status: 'changes_requested', total_budget: 3000, spent: 0, reward_per_task: 0.75, completed_tasks: 0, total_tasks: 4000, created_at: '2026-07-22T10:00:00Z', submitted_at: '2026-07-23T14:00:00Z' },
  { id: 203, name: 'TikTok Viral Dance Challenge', platform: 'tiktok', task_type: 'custom_action', status: 'pending', total_budget: 8000, spent: 0, reward_per_task: 0.30, completed_tasks: 0, total_tasks: 26666, created_at: '2026-07-20T12:00:00Z', submitted_at: '2026-07-21T09:00:00Z' },
  { id: 204, name: 'Facebook Group Expansion', platform: 'facebook', task_type: 'join_group', status: 'under_review', total_budget: 2000, spent: 0, reward_per_task: 0.40, completed_tasks: 0, total_tasks: 5000, created_at: '2026-07-25T09:00:00Z', submitted_at: '2026-07-26T08:00:00Z' },
  { id: 205, name: 'Telegram Crypto Community', platform: 'telegram', task_type: 'join_channel', status: 'pending', total_budget: 1500, spent: 0, reward_per_task: 0.25, completed_tasks: 0, total_tasks: 6000, created_at: '2026-07-19T07:00:00Z', submitted_at: '2026-07-20T11:00:00Z' },
  { id: 206, name: 'Twitter/X Product Launch', platform: 'twitter', task_type: 'retweet', status: 'changes_requested', total_budget: 4000, spent: 0, reward_per_task: 0.60, completed_tasks: 0, total_tasks: 6666, created_at: '2026-07-18T14:00:00Z', submitted_at: '2026-07-19T16:00:00Z' },
  { id: 207, name: 'Discord Server Promo', platform: 'discord', task_type: 'join_discord', status: 'under_review', total_budget: 2500, spent: 0, reward_per_task: 0.35, completed_tasks: 0, total_tasks: 7142, created_at: '2026-07-23T16:00:00Z', submitted_at: '2026-07-24T12:00:00Z' },
  { id: 208, name: 'Website Traffic Push', platform: 'website', task_type: 'visit_link', status: 'pending', total_budget: 10000, spent: 0, reward_per_task: 0.05, completed_tasks: 0, total_tasks: 200000, created_at: '2026-07-26T06:00:00Z', submitted_at: '2026-07-26T06:30:00Z' },
  { id: 209, name: 'Instagram Story Campaign', platform: 'instagram', task_type: 'like_comment', status: 'under_review', total_budget: 3500, spent: 0, reward_per_task: 0.45, completed_tasks: 0, total_tasks: 7777, created_at: '2026-07-21T11:00:00Z', submitted_at: '2026-07-22T15:00:00Z' },
  { id: 210, name: 'YouTube Subscriber Drive', platform: 'youtube', task_type: 'subscribe', status: 'changes_requested', total_budget: 6000, spent: 0, reward_per_task: 0.80, completed_tasks: 0, total_tasks: 7500, created_at: '2026-07-17T08:00:00Z', submitted_at: '2026-07-18T10:00:00Z' },
];

function getWaitTime(submittedAt: string): string {
  const diff = Date.now() - new Date(submittedAt).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Less than 1 hour';
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export default function PendingApprovalPage() {
  const [campaigns, setCampaigns] = useState<PendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const all = res.campaigns || [];
        setCampaigns(all.filter((c: PendingCampaign) => c.status === 'pending' || c.status === 'under_review' || c.status === 'changes_requested'));
      } catch {
        setCampaigns(MOCK_PENDING);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return campaigns;
    const statusMap: Record<string, string> = {
      'Under Review': 'under_review',
      'Changes Requested': 'changes_requested',
    };
    return campaigns.filter((c) => c.status === statusMap[activeFilter]);
  }, [campaigns, activeFilter]);

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_BADGE[status] || STATUS_BADGE.pending;
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.icon}
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400">Loading pending campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Pending Approval</h1>
        <p className="text-sm text-gray-400 mt-1">Campaigns awaiting review by our team</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeFilter === tab
                  ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-4">Campaign</th>
                <th className="px-4 py-4">Platform</th>
                <th className="px-4 py-4 text-right">Budget</th>
                <th className="px-4 py-4 text-right">Submitted</th>
                <th className="px-4 py-4 text-right">Wait Time</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-200" />
                      <p className="text-sm text-gray-400">No pending campaigns match this filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((campaign) => {
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
                        <p className="text-sm text-gray-700">{campaign.submitted_at ? formatDate(campaign.submitted_at) : '—'}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {campaign.submitted_at ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <Hourglass className="h-3.5 w-3.5 text-[#F59E0B]" />
                            {getWaitTime(campaign.submitted_at)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/advertiser/campaigns/${campaign.id}`}>
                          <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs border-gray-200 hover:border-[#2D4F97]/30 hover:text-[#2D4F97]">
                            <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-[#2D4F97]/5 to-[#1E8A8D]/5 border border-[#2D4F97]/10 rounded-2xl shadow-sm">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2D4F97]/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-[#2D4F97]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">About the Review Process</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our team reviews each campaign to ensure it meets our quality guidelines. Most campaigns are reviewed within 24 hours.
              If changes are requested, you'll receive specific feedback on what needs to be updated before resubmission.
              The review helps maintain a high-quality experience for both advertisers and workers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
