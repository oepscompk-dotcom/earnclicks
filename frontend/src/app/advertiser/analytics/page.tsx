'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, campaignsRes] = await Promise.all([
          api.get<any>('/wallet'),
          api.get<any>('/campaigns'),
        ]);
        const campaigns = campaignsRes?.campaigns || [];
        const totalTasks = campaigns.reduce((s: number, c: any) => s + (c.total_tasks || 0), 0);
        const completedTasks = campaigns.reduce((s: number, c: any) => s + (c.completed_tasks || 0), 0);
        setData({
          totalSpent: campaigns.reduce((s: number, c: any) => s + (c.spent || 0), 0),
          totalCampaigns: campaigns.length,
          completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
          activeCampaigns: campaigns.filter((c: any) => c.status === 'approved').length,
        });
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><DollarSign className="h-4 w-4" />Total Spent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${data?.totalSpent?.toFixed(2) || '0'}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><BarChart3 className="h-4 w-4" />Campaigns</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data?.totalCampaigns || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><TrendingUp className="h-4 w-4" />Completion Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data?.completionRate || 0}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><Users className="h-4 w-4" />Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data?.activeCampaigns || 0}</div></CardContent></Card>
      </div>
    </div>
  );
}
