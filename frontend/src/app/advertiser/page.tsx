'use client';

import { useState, useEffect, useMemo } from 'react';
import { ClientOnly } from '@/components/ui/client-only';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency, cn } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import {
  Wallet, TrendingUp, Target, Users, CheckCircle, Clock,
  MousePointerClick, Percent, RefreshCw, UserPlus, ThumbsUp,
  DollarSign, PlayCircle, PauseCircle, XCircle, Ban,
  ArrowUpRight, ArrowDownRight, Eye, PlusCircle, FileText,
  HeadphonesIcon, Globe, Monitor, ExternalLink, Activity,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Zap,
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';

/* ─── Types ─── */
interface WalletData {
  total_balance: number;
  main: number;
  bonus: number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  conversions: number;
  impressions: number;
  platform: string;
  tasks_total: number;
  tasks_completed: number;
}

interface DashboardStats {
  today_spend: number;
  active_campaigns: number;
  total_reach: number;
  completed_tasks: number;
  pending_reviews: number;
  total_clicks: number;
  ctr: number;
  total_conversions: number;
  followers_gained: number;
  likes_subscribers: number;
  today_roi: number;
}

/* ─── Mock Data ─── */
const MOCK_WALLET: WalletData = { total_balance: 45280.50, main: 42500.00, bonus: 2780.50 };

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Sale 2025', status: 'running', budget: 15000, spent: 8200, reach: 245000, clicks: 12300, conversions: 890, impressions: 520000, platform: 'facebook', tasks_total: 50, tasks_completed: 32 },
  { id: '2', name: 'Brand Awareness Q3', status: 'running', budget: 25000, spent: 9800, reach: 412000, clicks: 21800, conversions: 1560, impressions: 890000, platform: 'instagram', tasks_total: 80, tasks_completed: 45 },
  { id: '3', name: 'Product Launch YT', status: 'pending', budget: 30000, spent: 0, reach: 0, clicks: 0, conversions: 0, impressions: 0, platform: 'youtube', tasks_total: 60, tasks_completed: 0 },
  { id: '4', name: 'TikTok Viral Challenge', status: 'running', budget: 8000, spent: 4500, reach: 589000, clicks: 32100, conversions: 2100, impressions: 1200000, platform: 'tiktok', tasks_total: 40, tasks_completed: 22 },
  { id: '5', name: 'Telegram Promo', status: 'paused', budget: 5000, spent: 2100, reach: 78000, clicks: 3400, conversions: 210, impressions: 156000, platform: 'telegram', tasks_total: 25, tasks_completed: 12 },
  { id: '6', name: 'Influencer Collab', status: 'completed', budget: 12000, spent: 12000, reach: 320000, clicks: 15600, conversions: 980, impressions: 680000, platform: 'youtube', tasks_total: 35, tasks_completed: 35 },
  { id: '7', name: 'Retargeting Q3', status: 'rejected', budget: 9000, spent: 0, reach: 0, clicks: 0, conversions: 0, impressions: 0, platform: 'facebook', tasks_total: 20, tasks_completed: 0 },
  { id: '8', name: 'Newsletter Sponsor', status: 'cancelled', budget: 4000, spent: 1200, reach: 45000, clicks: 1800, conversions: 95, impressions: 90000, platform: 'telegram', tasks_total: 15, tasks_completed: 8 },
];

const MOCK_STATS: DashboardStats = {
  today_spend: 12450.75,
  active_campaigns: 4,
  total_reach: 1587000,
  completed_tasks: 347,
  pending_reviews: 23,
  total_clicks: 87100,
  ctr: 3.42,
  total_conversions: 5835,
  followers_gained: 12450,
  likes_subscribers: 28700,
  today_roi: 18.6,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_COLORS = ['#2D4F97', '#1E8A8D', '#18C79A', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const MOCK_REVENUE: { day: string; revenue: number; spend: number }[] = DAYS.map((d, i) => ({
  day: d, revenue: 3200 + Math.random() * 4800, spend: 1800 + Math.random() * 3200,
}));

const MOCK_CAMPAIGN_PERF = MOCK_CAMPAIGNS.filter(c => c.status === 'running' || c.status === 'completed').slice(0, 6).map(c => ({
  name: c.name.length > 15 ? c.name.slice(0, 12) + '...' : c.name,
  clicks: c.clicks,
  conversions: c.conversions,
  spend: c.spent,
}));

const MOCK_PLATFORMS = [
  { name: 'YouTube', value: 28 }, { name: 'Facebook', value: 24 },
  { name: 'Instagram', value: 22 }, { name: 'TikTok', value: 16 },
  { name: 'Telegram', value: 10 },
];

const MOCK_CONVERSION_RATE = DAYS.map((d, i) => ({
  day: d, rate: 2.1 + Math.sin(i * 0.8) * 1.2 + Math.random() * 0.6,
}));

const MOCK_ROI = DAYS.map((d, i) => ({
  day: d, roi: 12 + Math.sin(i * 0.6) * 8 + Math.random() * 4,
}));

const MOCK_GROWTH = DAYS.map((d, i) => ({
  day: d, followers: 120 + Math.floor(Math.random() * 600), engagement: 800 + Math.floor(Math.random() * 2000),
}));

const MOCK_COUNTRIES = [
  { country: 'United States', users: 45800, flag: '🇺🇸' },
  { country: 'India', users: 32100, flag: '🇮🇳' },
  { country: 'Indonesia', users: 19800, flag: '🇮🇩' },
  { country: 'Brazil', users: 16500, flag: '🇧🇷' },
  { country: 'Philippines', users: 14200, flag: '🇵🇭' },
  { country: 'Pakistan', users: 9800, flag: '🇵🇰' },
  { country: 'Bangladesh', users: 8200, flag: '🇧🇩' },
  { country: 'Nigeria', users: 7600, flag: '🇳🇬' },
];

const MOCK_TRAFFIC = [
  { name: 'Direct', value: 32 }, { name: 'Organic', value: 28 },
  { name: 'Social', value: 22 }, { name: 'Referral', value: 12 },
  { name: 'Email', value: 6 },
];

/* ─── Helpers ─── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; dot: string }> = {
  running:    { label: 'Running',   icon: PlayCircle,  color: '#2D4F97', bg: 'bg-blue-50', dot: 'bg-blue-600' },
  pending:    { label: 'Pending',   icon: Clock,       color: '#F59E0B', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  paused:     { label: 'Paused',    icon: PauseCircle, color: '#F97316', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  completed:  { label: 'Completed', icon: CheckCircle, color: '#18C79A', bg: 'bg-green-50', dot: 'bg-green-500' },
  rejected:   { label: 'Rejected',  icon: XCircle,     color: '#EF4444', bg: 'bg-red-50', dot: 'bg-red-500' },
  cancelled:  { label: 'Cancelled', icon: Ban,         color: '#6B7280', bg: 'bg-gray-50', dot: 'bg-gray-400' },
};

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, prefix, suffix, trend, trendUp, subtitle, className }: {
  icon: any; label: string; value: string; prefix?: string; suffix?: string;
  trend?: string; trendUp?: boolean; subtitle?: string; className?: string;
}) {
  return (
    <Card className={cn('bg-white/80 backdrop-blur-xl border border-gray-100 hover:shadow-lg transition-all duration-300', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#2D4F97]/10 to-[#18C79A]/10">
              <Icon className="w-4.5 h-4.5 text-[#2D4F97]" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold text-[#0F172A] mt-0.5">
                {prefix}{value}{suffix}
              </p>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
              trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50',
            )}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function AdvertiserDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [walletRes, campaignsRes, dashRes] = await Promise.allSettled([
          api.get<any>('/wallet'),
          api.get<any>('/campaigns'),
          api.get<any>('/dashboard'),
        ]);
        if (cancelled) return;
        if (walletRes.status === 'fulfilled') setWallet(walletRes.value);
        else setWallet(MOCK_WALLET);
        if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.campaigns ?? campaignsRes.value);
        else setCampaigns(MOCK_CAMPAIGNS);
        if (dashRes.status === 'fulfilled') setStats(dashRes.value.stats ?? dashRes.value);
        else setStats(MOCK_STATS);
      } catch {
        if (!cancelled) {
          setWallet(MOCK_WALLET);
          setCampaigns(MOCK_CAMPAIGNS);
          setStats(MOCK_STATS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const displayStats = stats ?? MOCK_STATS;
  const displayWallet = wallet ?? MOCK_WALLET;
  const displayCampaigns = campaigns.length > 0 ? campaigns : MOCK_CAMPAIGNS;
  const userName = user?.name ?? user?.email?.split('@')[0] ?? 'Advertiser';
  const runningCampaigns = displayCampaigns.filter(c => c.status === 'running');

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { running: 0, pending: 0, paused: 0, completed: 0, rejected: 0, cancelled: 0 };
    displayCampaigns.forEach(c => { if (c.status in counts) counts[c.status]++; });
    return counts;
  }, [displayCampaigns]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2D4F97] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Create Campaign', icon: PlusCircle, color: 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D]', href: '/advertiser/campaigns/new' },
    { label: 'Deposit Funds', icon: DollarSign, color: 'bg-gradient-to-r from-[#1E8A8D] to-[#18C79A]', href: '/advertiser/wallet' },
    { label: 'View Reports', icon: FileText, color: 'bg-gradient-to-r from-[#2D4F97] to-[#18C79A]', href: '/advertiser/reports' },
    { label: 'Contact Support', icon: HeadphonesIcon, color: 'bg-white/20 border border-white/30', href: '/support' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ─── Welcome Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getGreeting()}, {userName}!
                </h1>
                <p className="text-white/80 text-sm sm:text-base max-w-xl">
                  Welcome to your EarnClicks dashboard. Here&apos;s what&apos;s happening with your campaigns today.
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Balance: <strong className="text-white">{formatCurrency(displayWallet.total_balance)}</strong></span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>{runningCampaigns.length} Active Campaigns</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg',
                      action.color,
                    )}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
          <StatCard icon={Wallet} label="Wallet Balance" value={formatCurrency(displayWallet.total_balance)} subtitle={`Main: ${formatCurrency(displayWallet.main)}`} trend="+5.2%" trendUp className="xl:col-span-2" />
          <StatCard icon={TrendingUp} label="Today's Spend" value={formatCurrency(displayStats.today_spend)} trend="+12.3%" trendUp={false} className="xl:col-span-1" />
          <StatCard icon={Target} label="Active Campaigns" value={String(displayStats.active_campaigns)} subtitle={`${runningCampaigns.length} running`} className="xl:col-span-1" />
          <StatCard icon={Eye} label="Campaign Reach" value={(displayStats.total_reach / 1000).toFixed(0)} suffix="K" trend="+8.7%" trendUp className="xl:col-span-1" />
          <StatCard icon={CheckCircle} label="Completed Tasks" value={String(displayStats.completed_tasks)} trend="+23" trendUp className="xl:col-span-1" />
          <StatCard icon={Clock} label="Pending Reviews" value={String(displayStats.pending_reviews)} className="xl:col-span-1" />
          <StatCard icon={MousePointerClick} label="Clicks" value={(displayStats.total_clicks / 1000).toFixed(1)} suffix="K" trend="+15.4%" trendUp className="xl:col-span-1" />
          <StatCard icon={Percent} label="CTR" value={String(displayStats.ctr.toFixed(2))} suffix="%" trend="+0.8pp" trendUp className="xl:col-span-1" />
          <StatCard icon={RefreshCw} label="Conversions" value={String(displayStats.total_conversions)} trend="+9.2%" trendUp className="xl:col-span-1" />
          <StatCard icon={UserPlus} label="Followers Gained" value={(displayStats.followers_gained / 1000).toFixed(1)} suffix="K" trend="+18.5%" trendUp className="xl:col-span-1" />
          <StatCard icon={ThumbsUp} label="Likes/Subs" value={(displayStats.likes_subscribers / 1000).toFixed(1)} suffix="K" trend="+11.3%" trendUp className="xl:col-span-1" />
          <StatCard icon={Zap} label="Today's ROI" value={String(displayStats.today_roi.toFixed(1))} suffix="%" trend="+2.4pp" trendUp className="xl:col-span-1" />
        </div>

        {/* ─── Campaign Status Overview ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(Object.entries(statusConfig) as [string, typeof statusConfig['running']][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <Card key={key} className={cn('bg-white/80 backdrop-blur-xl border border-gray-100 hover:shadow-md transition-all', cfg.bg)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-xl', cfg.bg)}>
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{statusCounts[key] ?? 0}</p>
                    <p className="text-xs font-medium text-gray-500">{cfg.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ─── Charts Grid ─── */}
        <ClientOnly fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="lg:col-span-2 h-[280px] bg-gray-50/50 rounded-xl flex items-center justify-center text-sm text-gray-400">Loading charts...</div></div>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue / Spend */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2D4F97]" /> Revenue vs Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MOCK_REVENUE}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2D4F97" stopOpacity={0.3}/><stop offset="95%" stopColor="#2D4F97" stopOpacity={0}/></linearGradient>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#18C79A" stopOpacity={0.3}/><stop offset="95%" stopColor="#18C79A" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2D4F97" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                  <Area type="monotone" dataKey="spend" stroke="#18C79A" fill="url(#spendGrad)" strokeWidth={2} name="Spend" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1E8A8D]" /> Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={MOCK_CAMPAIGN_PERF}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="clicks" fill="#2D4F97" radius={[4, 4, 0, 0]} name="Clicks" />
                  <Bar dataKey="conversions" fill="#18C79A" radius={[4, 4, 0, 0]} name="Conversions" />
                  <Bar dataKey="spend" fill="#1E8A8D" radius={[4, 4, 0, 0]} name="Spend ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#18C79A]" /> Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={MOCK_PLATFORMS} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {MOCK_PLATFORMS.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-[#2D4F97]" /> Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={MOCK_CONVERSION_RATE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(v: number) => `${v.toFixed(1)}%`} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} formatter={(v: number) => `${v.toFixed(2)}%`} />
                  <Line type="monotone" dataKey="rate" stroke="#1E8A8D" strokeWidth={3} dot={{ fill: '#1E8A8D', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Conversion Rate" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ROI */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-[#18C79A]" /> ROI Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MOCK_ROI}>
                  <defs>
                    <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#18C79A" stopOpacity={0.3}/><stop offset="95%" stopColor="#18C79A" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} formatter={(v: number) => `${v.toFixed(1)}%`} />
                  <Area type="monotone" dataKey="roi" stroke="#18C79A" fill="url(#roiGrad)" strokeWidth={2} name="ROI" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Growth */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2D4F97]" /> Engagement Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={MOCK_GROWTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="followers" fill="#2D4F97" radius={[4, 4, 0, 0]} name="New Followers" />
                  <Bar dataKey="engagement" fill="#18C79A" radius={[4, 4, 0, 0]} name="Engagement" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        </ClientOnly>

        {/* ─── Audience Analytics + Live Campaigns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Countries */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#2D4F97]" /> Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {MOCK_COUNTRIES.map((c, i) => (
                  <div key={c.country} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{c.flag}</span>
                      <span className="text-sm font-medium text-[#0F172A]">{c.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0F172A]">{(c.users / 1000).toFixed(1)}K</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#2D4F97] to-[#18C79A] rounded-full" style={{ width: `${((i + 1) * 12)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#1E8A8D]" /> Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientOnly fallback={<div className="h-[280px] flex items-center justify-center text-sm text-gray-400">Loading chart...</div>}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={MOCK_TRAFFIC} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {MOCK_TRAFFIC.map((_, i) => (
                      <Cell key={i} fill={['#2D4F97', '#1E8A8D', '#18C79A', '#F59E0B', '#8B5CF6'][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              </ClientOnly>
            </CardContent>
          </Card>

          {/* Live Campaign Overview */}
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#18C79A]" /> Live Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runningCampaigns.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No active campaigns</p>
                ) : (
                  runningCampaigns.slice(0, 4).map((c) => {
                    const budgetPct = c.budget > 0 ? Math.min((c.spent / c.budget) * 100, 100) : 0;
                    const tasksPct = c.tasks_total > 0 ? Math.min((c.tasks_completed / c.tasks_total) * 100, 100) : 0;
                    return (
                      <div key={c.id} className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#0F172A] truncate max-w-[160px]">{c.name}</p>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Live</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Budget: {formatCurrency(c.spent)} / {formatCurrency(c.budget)}</span>
                            <span>{budgetPct.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] rounded-full transition-all duration-500" style={{ width: `${budgetPct}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Tasks: {c.tasks_completed} / {c.tasks_total}</span>
                            <span>{tasksPct.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#18C79A] to-[#1E8A8D] rounded-full transition-all duration-500" style={{ width: `${tasksPct}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 pt-0.5">
                          <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" />{c.clicks.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(c.impressions / 1000).toFixed(0)}K</span>
                          <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />{c.conversions}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                {runningCampaigns.length > 4 && (
                  <p className="text-xs text-center text-[#2D4F97] font-medium cursor-pointer hover:underline">
                    +{runningCampaigns.length - 4} more campaigns
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Recent Activity / Quick Actions ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { label: 'View All Campaigns', icon: Target, desc: 'Manage & monitor all campaigns', href: '/advertiser/campaigns', color: '#2D4F97' },
            { label: 'Create New Campaign', icon: PlusCircle, desc: 'Launch a new advertising campaign', href: '/advertiser/campaigns/new', color: '#1E8A8D' },
            { label: 'Deposit Funds', icon: DollarSign, desc: 'Add funds to your wallet', href: '/advertiser/wallet', color: '#18C79A' },
            { label: 'View Reports', icon: FileText, desc: 'Detailed analytics & reports', href: '/advertiser/reports', color: '#2D4F97' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a key={action.label} href={action.href}>
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${action.color}10` }}>
                      <Icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2D4F97] transition-colors">{action.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 ml-auto mt-1 group-hover:text-[#2D4F97] transition-colors" />
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}
