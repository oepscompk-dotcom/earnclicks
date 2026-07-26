'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, Target, Activity, Bell, Calendar, ArrowDownCircle, ChevronRight } from 'lucide-react';

interface Stats {
  balance: number;
  todaySpend: number;
  todayReach: number;
  healthScore: number;
  notifications: { id: number; title: string; created_at: string }[];
  endingCampaigns: { id: number; name: string; end_date: string }[];
}

export function QuickStats() {
  const [stats, setStats] = useState<Stats>({
    balance: 0, todaySpend: 0, todayReach: 0, healthScore: 85,
    notifications: [], endingCampaigns: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [walletRes, campaignsRes, notifRes] = await Promise.all([
          api.get<any>('/wallet').catch(() => ({ total_balance: 0 })),
          api.get<any>('/campaigns').catch(() => ({ campaigns: [] })),
          api.get<any>('/notifications').catch(() => ({ notifications: [] })),
        ]);
        const campaigns = campaignsRes?.campaigns || [];
        const totalTasks = campaigns.reduce((s: number, c: any) => s + (c.total_tasks || 0), 0);
        const completedTasks = campaigns.reduce((s: number, c: any) => s + (c.completed_tasks || 0), 0);
        const today = new Date().toISOString().split('T')[0];
        const ending = campaigns
          .filter((c: any) => c.status === 'approved' && c.end_date)
          .sort((a: any, b: any) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
          .slice(0, 3);
        setStats({
          balance: walletRes?.total_balance || 0,
          todaySpend: campaigns.reduce((s: number, c: any) => s + (c.spent || 0), 0) * 0.05,
          todayReach: completedTasks * 100,
          healthScore: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 85,
          notifications: (notifRes?.notifications || []).slice(0, 4),
          endingCampaigns: ending,
        });
      } catch {
        setStats((prev) => prev);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getHealthBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-[280px] shrink-0 h-screen overflow-y-auto border-l border-gray-100 bg-white p-4 space-y-4 custom-scrollbar">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Overview</h3>

      <div className="space-y-3">
        <div className="rounded-xl bg-gradient-to-br from-[#2D4F97] to-[#1E8A8D] p-4 text-white">
          <p className="text-[11px] font-medium text-white/70">Wallet Balance</p>
          <p className="text-2xl font-bold mt-1">${stats.balance.toFixed(2)}</p>
          <p className="text-[11px] text-white/60 mt-0.5">USDT Available</p>
          <Link
            href="/advertiser/deposit"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors"
          >
            <ArrowDownCircle className="h-3.5 w-3.5" />
            Deposit Funds
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase">Today Spend</span>
            </div>
            <p className="text-sm font-bold text-gray-900">${stats.todaySpend.toFixed(2)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase">Reach</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.todayReach.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase">Health Score</span>
            </div>
            <span className={cn('text-sm font-bold', getHealthColor(stats.healthScore))}>{stats.healthScore}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200">
            <div
              className={cn('h-1.5 rounded-full transition-all duration-500', getHealthBarColor(stats.healthScore))}
              style={{ width: `${stats.healthScore}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Notifications</h4>
          <Link href="/advertiser/notifications" className="text-[10px] text-[#2D4F97] font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-1">
          {stats.notifications.length === 0 ? (
            <p className="text-xs text-gray-400 py-2 text-center">No recent notifications</p>
          ) : (
            stats.notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">{n.title}</p>
                  <p className="text-[10px] text-gray-400">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ending Soon</h4>
          <Link href="/advertiser/campaigns" className="text-[10px] text-[#2D4F97] font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-1">
          {stats.endingCampaigns.length === 0 ? (
            <p className="text-xs text-gray-400 py-2 text-center">No campaigns ending soon</p>
          ) : (
            stats.endingCampaigns.map((c) => (
              <div key={c.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">{c.name}</p>
                  <p className="text-[10px] text-amber-600">Ends {new Date(c.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
