'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function AdvertiserDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, campaignsRes] = await Promise.all([
          api.get<any>('/wallet'),
          api.get<any>('/campaigns'),
        ]);
        const campaigns = campaignsRes?.campaigns || [];
        setStats({
          balance: walletRes?.total_balance || 0,
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c: any) => c.status === 'approved').length,
          pendingCampaigns: campaigns.filter((c: any) => c.status === 'pending').length,
          totalSpent: campaigns.reduce((sum: number, c: any) => sum + (c.spent || 0), 0),
        });
      } catch {
        setStats({ balance: 0, totalCampaigns: 0, activeCampaigns: 0, pendingCampaigns: 0, totalSpent: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Advertiser Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Link href="/advertiser/campaigns/create">
          <Button><Plus className="mr-2 h-4 w-4" />Create Campaign</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">${stats.balance.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.totalCampaigns}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/advertiser/campaigns">
          <Card className="hover:border-primary transition-colors cursor-pointer"><CardHeader><CardTitle>My Campaigns</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">View and manage your campaigns.</p></CardContent>
          </Card>
        </Link>
        <Link href="/advertiser/wallet">
          <Card className="hover:border-primary transition-colors cursor-pointer"><CardHeader><CardTitle>Wallet</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Deposit funds and manage your balance.</p></CardContent>
          </Card>
        </Link>
        <Link href="/advertiser/analytics">
          <Card className="hover:border-primary transition-colors cursor-pointer"><CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">View campaign performance analytics.</p></CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
