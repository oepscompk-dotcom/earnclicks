'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
  Video, Camera, Music, MessageCircle, Twitter, Send, Headphones, Globe,
  Eye, Copy, Play, Pause, Edit, Trash2, MoreHorizontal,
  TrendingUp, DollarSign, Users, CheckCircle,
  ArrowUpDown, Filter, List,
} from 'lucide-react';

interface Campaign {
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
  instructions?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  running:   { label: 'Running',   color: '#059669', bg: '#D1FAE5', dot: '#10B981' },
  active:    { label: 'Running',   color: '#059669', bg: '#D1FAE5', dot: '#10B981' },
  approved:  { label: 'Running',   color: '#059669', bg: '#D1FAE5', dot: '#10B981' },
  pending:   { label: 'Pending',   color: '#B45309', bg: '#FEF3C7', dot: '#F59E0B' },
  paused:    { label: 'Paused',    color: '#C2410C', bg: '#FFEDD5', dot: '#F97316' },
  completed: { label: 'Completed', color: '#1D4ED8', bg: '#DBEAFE', dot: '#3B82F6' },
  rejected:  { label: 'Rejected',  color: '#B91C1C', bg: '#FEE2E2', dot: '#EF4444' },
  draft:     { label: 'Draft',     color: '#4B5563', bg: '#F3F4F6', dot: '#9CA3AF' },
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube:   <Video className="h-4 w-4" />,
  instagram: <Camera className="h-4 w-4" />,
  tiktok:    <Music className="h-4 w-4" />,
  facebook:  <MessageCircle className="h-4 w-4" />,
  twitter:   <Twitter className="h-4 w-4" />,
  telegram:  <Send className="h-4 w-4" />,
  discord:   <Headphones className="h-4 w-4" />,
  website:   <Globe className="h-4 w-4" />,
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

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Summer Sale Video Promo', platform: 'youtube', task_type: 'like_comment', status: 'running', total_budget: 5000, spent: 2340, reward_per_task: 0.50, completed_tasks: 4680, total_tasks: 10000, created_at: '2026-06-15T08:00:00Z', end_date: '2026-08-15T08:00:00Z' },
  { id: 2, name: 'Brand Awareness IG Reels', platform: 'instagram', task_type: 'subscribe', status: 'pending', total_budget: 3000, spent: 0, reward_per_task: 0.75, completed_tasks: 0, total_tasks: 4000, created_at: '2026-07-20T10:00:00Z', end_date: '2026-09-20T10:00:00Z' },
  { id: 3, name: 'TikTok Viral Challenge', platform: 'tiktok', task_type: 'custom_action', status: 'running', total_budget: 8000, spent: 5100, reward_per_task: 0.30, completed_tasks: 17000, total_tasks: 26666, created_at: '2026-05-01T12:00:00Z', end_date: '2026-08-01T12:00:00Z' },
  { id: 4, name: 'Facebook Group Growth', platform: 'facebook', task_type: 'join_group', status: 'paused', total_budget: 2000, spent: 850, reward_per_task: 0.40, completed_tasks: 2125, total_tasks: 5000, created_at: '2026-04-10T09:00:00Z', end_date: '2026-07-10T09:00:00Z' },
  { id: 5, name: 'Telegram Channel Boost', platform: 'telegram', task_type: 'join_channel', status: 'completed', total_budget: 1500, spent: 1500, reward_per_task: 0.25, completed_tasks: 6000, total_tasks: 6000, created_at: '2026-03-05T07:00:00Z', end_date: '2026-06-05T07:00:00Z' },
  { id: 6, name: 'Product Launch Twitter/X', platform: 'twitter', task_type: 'retweet', status: 'rejected', total_budget: 4000, spent: 0, reward_per_task: 0.60, completed_tasks: 0, total_tasks: 6666, created_at: '2026-07-25T14:00:00Z', end_date: '2026-10-25T14:00:00Z' },
  { id: 7, name: 'Discord Community Building', platform: 'discord', task_type: 'join_discord', status: 'draft', total_budget: 2500, spent: 0, reward_per_task: 0.35, completed_tasks: 0, total_tasks: 7142, created_at: '2026-07-28T16:00:00Z', end_date: '2026-10-28T16:00:00Z' },
  { id: 8, name: 'Website Traffic Campaign', platform: 'website', task_type: 'visit_link', status: 'running', total_budget: 10000, spent: 6200, reward_per_task: 0.05, completed_tasks: 124000, total_tasks: 200000, created_at: '2026-06-01T08:00:00Z', end_date: '2026-09-01T08:00:00Z' },
  { id: 9, name: 'Instagram Story Ads', platform: 'instagram', task_type: 'like_comment', status: 'pending', total_budget: 3500, spent: 1200, reward_per_task: 0.45, completed_tasks: 2666, total_tasks: 7777, created_at: '2026-07-15T11:00:00Z', end_date: '2026-09-15T11:00:00Z' },
  { id: 10, name: 'YouTube Channel Subs', platform: 'youtube', task_type: 'subscribe', status: 'completed', total_budget: 6000, spent: 6000, reward_per_task: 0.80, completed_tasks: 7500, total_tasks: 7500, created_at: '2026-01-10T08:00:00Z', end_date: '2026-04-10T08:00:00Z' },
];

const STATUS_TABS = ['all', 'running', 'pending', 'paused', 'completed', 'rejected', 'draft'] as const;
const ITEMS_PER_PAGE = 8;

export default function CampaignManagerPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        setCampaigns(res.campaigns || []);
      } catch {
        setCampaigns(MOCK_CAMPAIGNS);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const handleClick = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => {
      if (activeTab !== 'all') {
        const normalized = activeTab === 'running'
          ? ['running', 'active', 'approved']
          : [activeTab];
        if (!normalized.includes(c.status)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q);
      }
      return true;
    });

    list.sort((a, b) => {
      let aVal: any = a[sortKey as keyof Campaign];
      let bVal: any = b[sortKey as keyof Campaign];
      if (sortKey === 'name' || sortKey === 'platform' || sortKey === 'status') {
        return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      }
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [campaigns, activeTab, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const metrics = useMemo(() => {
    const totalBudget = campaigns.reduce((s, c) => s + (c.total_budget || 0), 0);
    const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
    const totalWorkers = campaigns.reduce((s, c) => s + (c.completed_tasks || 0), 0);
    const activeWithCompletion = campaigns.filter((c) => c.total_tasks > 0);
    const avgCompletion = activeWithCompletion.length
      ? activeWithCompletion.reduce((s, c) => s + Math.min((c.completed_tasks / c.total_tasks) * 100, 100), 0) / activeWithCompletion.length
      : 0;
    return { totalBudget, totalSpent, totalWorkers, avgCompletion };
  }, [campaigns]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: campaigns.length };
    STATUS_TABS.filter((t) => t !== 'all').forEach((t) => {
      if (t === 'running') {
        counts[t] = campaigns.filter((c) => ['running', 'active', 'approved'].includes(c.status)).length;
      } else {
        counts[t] = campaigns.filter((c) => c.status === t).length;
      }
    });
    return counts;
  }, [campaigns]);

  const getStatusConfig = (status: string) =>
    STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' };

  const getPlatformIcon = (platform: string) =>
    PLATFORM_ICONS[platform?.toLowerCase()] || <Globe className="h-4 w-4" />;

  const getPlatformColor = (platform: string) =>
    PLATFORM_COLORS[platform?.toLowerCase()] || '#6B7280';

  const progressPercent = (spent: number, budget: number) =>
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

  const completionPercent = (completed: number, total: number) =>
    total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ colKey }: { colKey: string }) => (
    <ArrowUpDown className={`h-3 w-3 ml-0.5 transition-opacity ${sortKey === colKey ? 'opacity-100' : 'opacity-30'}`} />
  );

  const handleAction = async (action: string, campaign: Campaign) => {
    setOpenDropdownId(null);
    switch (action) {
      case 'view':
        router.push(`/advertiser/campaigns/${campaign.id}`);
        break;
      case 'edit':
        router.push(`/advertiser/campaigns/${campaign.id}/edit`);
        break;
      case 'duplicate':
        try {
          await api.post(`/campaigns/${campaign.id}/duplicate`);
          const res = await api.get<any>('/campaigns');
          setCampaigns(res.campaigns || []);
        } catch { /* handled silently */ }
        break;
      case 'pause':
        try {
          await api.post(`/campaigns/${campaign.id}/pause`);
          setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: 'paused' } : c));
        } catch { /* handled silently */ }
        break;
      case 'resume':
        try {
          await api.post(`/campaigns/${campaign.id}/resume`);
          setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: 'running' } : c));
        } catch { /* handled silently */ }
        break;
      case 'delete':
        try {
          await api.delete(`/campaigns/${campaign.id}`);
          setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
        } catch { /* handled silently */ }
        break;
    }
  };

  const SortButton = ({ label, colKey }: { label: string; colKey: string }) => (
    <button onClick={() => toggleSort(colKey)} className="inline-flex items-center hover:text-gray-600 transition-colors">
      {label} <SortIcon colKey={colKey} />
    </button>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = getStatusConfig(status);
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-[#2D4F97] border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Campaign Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Manage all your advertising campaigns</p>
        </div>
        <Link href="/advertiser/campaigns/create">
          <Button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] hover:from-[#1E3A7A] hover:to-[#166A6D] text-white shadow-lg shadow-[#2D4F97]/20 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={cn(
                'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab
                  ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span
                className={cn(
                  'ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold',
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {tabCounts[tab] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Budget', value: formatCurrency(metrics.totalBudget), icon: <DollarSign className="h-4 w-4" />, gradient: 'from-[#2D4F97] to-[#3B6BC8]' },
          { label: 'Total Spent', value: formatCurrency(metrics.totalSpent), icon: <TrendingUp className="h-4 w-4" />, gradient: 'from-[#1E8A8D] to-[#26B5B8]' },
          { label: 'Total Workers', value: metrics.totalWorkers.toLocaleString(), icon: <Users className="h-4 w-4" />, gradient: 'from-[#18C79A] to-[#20E8B0]' },
          { label: 'Avg Completion', value: `${metrics.avgCompletion.toFixed(1)}%`, icon: <CheckCircle className="h-4 w-4" />, gradient: 'from-[#F59E0B] to-[#FBBF24]' },
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

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 ml-auto">
          <List className="h-3.5 w-3.5" />
          <span>{filtered.length} campaign{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-4"><SortButton label="Campaign" colKey="name" /></th>
                <th className="px-4 py-4"><SortButton label="Platform" colKey="platform" /></th>
                <th className="px-4 py-4 text-right"><SortButton label="Budget" colKey="total_budget" /></th>
                <th className="px-4 py-4 text-right"><SortButton label="Spent" colKey="spent" /></th>
                <th className="px-4 py-4 text-right hidden lg:table-cell">Remaining</th>
                <th className="px-4 py-4 text-right"><SortButton label="Workers" colKey="completed_tasks" /></th>
                <th className="px-4 py-4 text-right hidden lg:table-cell"><SortButton label="Completion" colKey="total_tasks" /></th>
                <th className="px-4 py-4 text-right hidden xl:table-cell">Conversion</th>
                <th className="px-4 py-4"><SortButton label="Status" colKey="status" /></th>
                <th className="px-4 py-4 text-right w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-200" />
                      <p className="text-sm text-gray-400">No campaigns match your filters</p>
                      <button onClick={() => { setSearch(''); setActiveTab('all'); }} className="text-xs text-[#2D4F97] hover:underline mt-1">Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((campaign) => {
                  const progress = progressPercent(campaign.spent, campaign.total_budget);
                  const completion = completionPercent(campaign.completed_tasks, campaign.total_tasks);
                  const conversion = campaign.completed_tasks > 0 && campaign.total_tasks > 0
                    ? Math.min(Math.round((campaign.completed_tasks / campaign.total_tasks) * 100), 100)
                    : 0;
                  const remaining = (campaign.total_budget || 0) - (campaign.spent || 0);
                  const platColor = getPlatformColor(campaign.platform);
                  const cfg = getStatusConfig(campaign.status);
                  const isPausable = ['running', 'active', 'approved'].includes(campaign.status);

                  return (
                    <tr
                      key={campaign.id}
                      onClick={() => router.push(`/advertiser/campaigns/${campaign.id}`)}
                      className="border-b border-gray-50 hover:bg-[#2D4F97]/[0.02] transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#2D4F97]/20 group-hover:shadow-sm transition-all">
                            <span
                              className="inline-flex items-center justify-center"
                              style={{ color: platColor }}
                            >
                              {getPlatformIcon(campaign.platform)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{campaign.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{campaign.task_type?.replace(/_/g, ' ') || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: `${platColor}10`, color: platColor }}
                        >
                          {getPlatformIcon(campaign.platform)}
                          {campaign.platform?.charAt(0).toUpperCase() + campaign.platform?.slice(1) || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(campaign.total_budget || 0)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(campaign.spent || 0)}</p>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${progress}%`, background: progress > 80 ? '#EF4444' : progress > 50 ? '#F59E0B' : 'linear-gradient(90deg, #2D4F97, #18C79A)' }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <p className={cn('text-sm font-medium', remaining > 0 ? 'text-gray-900' : 'text-gray-400')}>
                          {formatCurrency(Math.max(remaining, 0))}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-medium text-gray-900">{campaign.completed_tasks?.toLocaleString() || 0}</p>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium text-gray-900">{completion}%</span>
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${completion}%`, background: completion >= 100 ? '#10B981' : '#2D4F97' }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right hidden xl:table-cell">
                        <p className="text-sm font-medium text-[#1E8A8D]">{conversion}%</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={campaign.status} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === campaign.id ? null : campaign.id); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openDropdownId === campaign.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/40 z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button onClick={() => handleAction('view', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <Eye className="h-3.5 w-3.5" /> View Details
                              </button>
                              <button onClick={() => handleAction('duplicate', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <Copy className="h-3.5 w-3.5" /> Duplicate
                              </button>
                              {isPausable ? (
                                <button onClick={() => handleAction('pause', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                  <Pause className="h-3.5 w-3.5" /> Pause
                                </button>
                              ) : campaign.status === 'paused' ? (
                                <button onClick={() => handleAction('resume', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                  <Play className="h-3.5 w-3.5" /> Resume
                                </button>
                              ) : null}
                              <button onClick={() => handleAction('edit', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button onClick={() => handleAction('delete', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
            <CardContent className="py-16 text-center">
              <Search className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No campaigns match your filters</p>
              <button onClick={() => { setSearch(''); setActiveTab('all'); }} className="text-xs text-[#2D4F97] hover:underline mt-1">Clear filters</button>
            </CardContent>
          </Card>
        ) : (
          paginated.map((campaign) => {
            const progress = progressPercent(campaign.spent, campaign.total_budget);
            const completion = completionPercent(campaign.completed_tasks, campaign.total_tasks);
            const remaining = (campaign.total_budget || 0) - (campaign.spent || 0);
            const platColor = getPlatformColor(campaign.platform);
            const isPausable = ['running', 'active', 'approved'].includes(campaign.status);

            return (
              <Card
                key={campaign.id}
                onClick={() => router.push(`/advertiser/campaigns/${campaign.id}`)}
                className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2D4F97]/20 transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0" style={{ color: platColor }}>
                        {getPlatformIcon(campaign.platform)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{campaign.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{campaign.platform?.charAt(0).toUpperCase() + campaign.platform?.slice(1)} — {campaign.task_type?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(campaign.total_budget || 0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Spent</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(campaign.spent || 0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Remaining</p>
                      <p className="font-medium text-gray-700">{formatCurrency(Math.max(remaining, 0))}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Workers</p>
                      <p className="font-medium text-gray-700">{campaign.completed_tasks?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Budget spent</span>
                        <span className="font-medium text-gray-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: progress > 80 ? '#EF4444' : progress > 50 ? '#F59E0B' : 'linear-gradient(90deg, #2D4F97, #18C79A)' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Completion</span>
                        <span className="font-medium text-gray-600">{completion}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${completion}%`, background: completion >= 100 ? '#10B981' : '#2D4F97' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400">Created {formatDate(campaign.created_at)}</p>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === campaign.id ? null : campaign.id); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openDropdownId === campaign.id && (
                        <div className="absolute right-4 bottom-12 w-44 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/40 z-50 py-1">
                          <button onClick={() => handleAction('view', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          <button onClick={() => handleAction('duplicate', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <Copy className="h-3.5 w-3.5" /> Duplicate
                          </button>
                          {isPausable ? (
                            <button onClick={() => handleAction('pause', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                              <Pause className="h-3.5 w-3.5" /> Pause
                            </button>
                          ) : campaign.status === 'paused' ? (
                            <button onClick={() => handleAction('resume', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                              <Play className="h-3.5 w-3.5" /> Resume
                            </button>
                          ) : null}
                          <button onClick={() => handleAction('edit', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => handleAction('delete', campaign)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400">
            Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (safePage <= 3) {
                pageNum = i + 1;
              } else if (safePage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = safePage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                    pageNum === safePage ? 'bg-[#2D4F97] text-white' : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
