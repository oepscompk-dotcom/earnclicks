'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { Users, DollarSign, BarChart3, CheckCircle, Clock, Megaphone, TrendingUp, Activity, Rocket, Shield, Wallet, Server, Zap, UserPlus, Bell, RefreshCw, ChevronRight, Settings, Smartphone, Globe, Download, Target, Award, ArrowUpCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  paused: 'bg-orange-100 text-orange-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700',
  banned: 'bg-gray-100 text-gray-700',
};

function StatCard({ title, value, growth, icon, color }: { title: string; value: string; growth?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
          {growth && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>{growth}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<any>('/admin/dashboard');
        setStats(res);
      } catch { setStats(null); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );

  const today = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const statCards = [
    { title: 'Total Users', value: (stats?.total_users || 0).toLocaleString(), growth: '+12% this month', icon: <Users className="h-5 w-5" />, color: '#2D4F97' },
    { title: 'Advertisers', value: (stats?.total_advertisers || 0).toLocaleString(), growth: '+8% this month', icon: <Megaphone className="h-5 w-5" />, color: '#1E8A8D' },
    { title: 'Active Campaigns', value: (stats?.total_campaigns || 0).toLocaleString(), growth: '+5% this month', icon: <Rocket className="h-5 w-5" />, color: '#18C97A' },
    { title: 'Completed Tasks', value: (stats?.completed_tasks || '0'), growth: '+25% this month', icon: <CheckCircle className="h-5 w-5" />, color: '#22C55E' },
    { title: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toLocaleString()}`, growth: '+18% this month', icon: <DollarSign className="h-5 w-5" />, color: '#F59E0B' },
    { title: 'Pending Reviews', value: (stats?.pending_submissions || 0).toLocaleString(), growth: stats?.pending_submissions > 0 ? 'Needs attention' : 'All clear', icon: <Clock className="h-5 w-5" />, color: '#EF4444' },
  ];

  const pendingItems = [
    { label: 'Deposits', value: stats?.pending_deposits || 0, icon: <Wallet className="h-4 w-4" />, color: '#F59E0B', href: '/admin/deposits' },
    { label: 'Withdrawals', value: stats?.pending_withdrawals || 0, icon: <ArrowUpCircle className="h-4 w-4" />, color: '#EF4444', href: '/admin/withdrawals' },
    { label: 'KYC Verifications', value: stats?.pending_kyc || 0, icon: <Shield className="h-4 w-4" />, color: '#2D4F97', href: '/admin/kyc' },
    { label: 'Campaigns', value: stats?.pending_campaigns || 0, icon: <Rocket className="h-4 w-4" />, color: '#1E8A8D', href: '/admin/campaigns' },
  ];

  const recentActivity = stats?.recent_activity || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, #0F172A, #1a2744)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass rounded-xl px-4 py-2 text-center border border-white/5">
              <p className="text-xs text-gray-500">{today}</p>
              <p className="text-sm font-semibold text-white">{currentTime}</p>
            </div>
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 border border-white/5">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">All Systems</span>
              <span className="text-xs font-semibold text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Pending Items Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pendingItems.map((item, i) => (
          <a key={i} href={item.href} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </div>
          </a>
        ))}
      </div>

      {/* Charts + Activity Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Platform earnings over time</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['Day', 'Week', 'Month', 'Year'].map((t) => (
                <button key={t} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${t === 'Month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-48 lg:h-64 relative">
            <div className="absolute inset-0 flex items-end gap-2">
              {[35, 42, 28, 55, 48, 62, 45, 58, 72, 65, 80, 75, 90, 82, 68, 85, 78, 92, 88, 95, 82, 70, 88, 75, 65, 80, 72, 85, 78, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full rounded-lg transition-all duration-300 group-hover:opacity-80" style={{
                    height: `${h}%`,
                    background: i === 29 ? 'linear-gradient(180deg, #18C97A, #1E8A8D)' : i > 25 ? 'linear-gradient(180deg, #2D4F97, #1E8A8D)' : 'linear-gradient(180deg, rgba(45,79,151,0.3), rgba(30,138,141,0.2))',
                  }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">${(stats?.total_revenue || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-lg font-semibold text-green-600">+$124,500</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Growth</p>
              <p className="text-lg font-semibold text-green-600">+18.5%</p>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-gray-900">Live Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time platform feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-1 overflow-hidden" style={{ maxHeight: '320px' }}>
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 12).map((item: any, i: number) => {
                const icons = [UserPlus, Wallet, CheckCircle, Megaphone, Shield, Clock];
                const Icon = icons[i % icons.length];
                const dotColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500'];
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${dotColors[i % dotColors.length]} bg-opacity-10`} style={{ background: `${dotColors[i % dotColors.length].replace('bg-', '#').replace('blue-500', '#2D4F97').replace('green-500', '#22C55E').replace('yellow-500', '#F59E0B').replace('purple-500', '#8B5CF6').replace('emerald-500', '#10B981').replace('orange-500', '#F97316')}15` }}>
                      <Icon className="h-4 w-4" style={{ color: dotColors[i % dotColors.length].replace('bg-', '#').replace('blue-500', '#2D4F97').replace('green-500', '#22C55E').replace('yellow-500', '#F59E0B').replace('purple-500', '#8B5CF6').replace('emerald-500', '#10B981').replace('orange-500', '#F97316') }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{item.description || item.message || `Activity #${i + 1}`}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just now'}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Activity className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Distribution + Quick Stats Row */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Platform Stats */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-gray-900 mb-4">Platform Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Workers', value: stats?.total_users || 0, pct: 78, color: '#2D4F97' },
              { label: 'Advertisers', value: stats?.total_advertisers || 0, pct: 15, color: '#1E8A8D' },
              { label: 'Admins', value: 3, pct: 1, color: '#18C97A' },
              { label: 'Moderators', value: 12, pct: 6, color: '#F59E0B' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
                    <span className="text-xs text-gray-400">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion by Platform */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-gray-900 mb-4">Task Completion by Platform</h3>
          <div className="space-y-4">
            {[
              { label: 'Facebook', value: 28, color: '#1877F2' },
              { label: 'Instagram', value: 22, color: '#E4405F' },
              { label: 'TikTok', value: 20, color: '#000000' },
              { label: 'YouTube', value: 18, color: '#FF0000' },
              { label: 'Telegram', value: 12, color: '#26A5E4' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { icon: <Users className="h-4 w-4" />, label: 'Online Now', value: '1,284', color: '#22C55E' },
          { icon: <Wallet className="h-4 w-4" />, label: 'Wallet Balance', value: '$2.4M', color: '#2D4F97' },
          { icon: <Shield className="h-4 w-4" />, label: 'KYC Pending', value: String(stats?.pending_kyc || 0), color: '#F59E0B' },
          { icon: <Clock className="h-4 w-4" />, label: 'Pending W/D', value: String(stats?.pending_withdrawals || 0), color: '#EF4444' },
          { icon: <Award className="h-4 w-4" />, label: 'VIP Members', value: '3,420', color: '#8B5CF6' },
          { icon: <Target className="h-4 w-4" />, label: 'Avg. Completion', value: '94%', color: '#18C97A' },
          { icon: <Smartphone className="h-4 w-4" />, label: 'Mobile Users', value: '68%', color: '#1E8A8D' },
          { icon: <Globe className="h-4 w-4" />, label: 'Countries', value: '150+', color: '#2D4F97' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 text-center hover:shadow-md transition-all">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-1.5" style={{ background: `${item.color}15`, color: item.color }}>
              {item.icon}
            </div>
            <p className="text-xs text-gray-400 truncate">{item.label}</p>
            <p className="font-bold text-sm text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Top Leaderboards + System Health */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Workers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-gray-900">Top Workers</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', country: 'PH', tasks: 12450, earnings: '$12,450', avatar: 'SJ' },
              { name: 'Ahmed Hassan', country: 'EG', tasks: 10890, earnings: '$10,890', avatar: 'AH' },
              { name: 'Carlos Garcia', country: 'BR', tasks: 9670, earnings: '$9,670', avatar: 'CG' },
              { name: 'Aisha Bello', country: 'NG', tasks: 8540, earnings: '$8,540', avatar: 'AB' },
              { name: 'Dmitry Volkov', country: 'UA', tasks: 7890, earnings: '$7,890', avatar: 'DV' },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{w.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{w.name}</p>
                  <p className="text-xs text-gray-400">{w.country} &middot; {w.tasks.toLocaleString()} tasks</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{w.earnings}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-gray-900">System Health</h3>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Server Status', value: '99.9%', status: 'operational', color: '#22C55E' },
              { label: 'Database', value: '2.3ms', status: 'operational', color: '#22C55E' },
              { label: 'Redis Cache', value: '0.8ms', status: 'operational', color: '#22C55E' },
              { label: 'Queue Worker', value: 'Active', status: 'operational', color: '#22C55E' },
              { label: 'Storage', value: '45% Used', status: 'warning', color: '#F59E0B' },
              { label: 'API Response', value: '124ms', status: 'operational', color: '#22C55E' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm text-gray-600">{s.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'CPU', value: '23%', color: '#22C55E' },
                { label: 'RAM', value: '4.2 GB', color: '#2D4F97' },
                { label: 'Disk', value: '45%', color: '#F59E0B' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: m.value, background: m.color }} />
                  </div>
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <p className="text-xs font-semibold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-gray-900">Quick Actions</h3>
          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { icon: <UserPlus className="h-4 w-4" />, label: 'Add Admin', color: '#2D4F97' },
            { icon: <Shield className="h-4 w-4" />, label: 'Moderator', color: '#1E8A8D' },
            { icon: <Megaphone className="h-4 w-4" />, label: 'Announce', color: '#F59E0B' },
            { icon: <CheckCircle className="h-4 w-4" />, label: 'Approve KYC', color: '#22C55E' },
            { icon: <Download className="h-4 w-4" />, label: 'Export', color: '#8B5CF6' },
            { icon: <Server className="h-4 w-4" />, label: 'Backup', color: '#0F172A' },
            { icon: <Zap className="h-4 w-4" />, label: 'Clear Cache', color: '#F97316' },
            { icon: <Settings className="h-4 w-4" />, label: 'Maintenance', color: '#EF4444' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300 card-hover group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${action.color}15`, color: action.color }}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <p>EarnClicks Admin Panel &copy; {new Date().getFullYear()}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Version 1.0</span>
          <span className="text-gray-300">|</span>
          <span>Laravel 12</span>
          <span className="text-gray-300">|</span>
          <span>Next.js</span>
          <span className="text-gray-300">|</span>
          <span>PHP 8.4</span>
        </div>
      </div>
    </div>
  );
}
