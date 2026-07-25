'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        const campaigns = res?.campaigns || [];
        setData({
          total: campaigns.length,
          approved: campaigns.filter((c: any) => c.status === 'approved').length,
          pending: campaigns.filter((c: any) => c.status === 'pending').length,
          rejected: campaigns.filter((c: any) => c.status === 'rejected').length,
          totalBudget: campaigns.reduce((s: number, c: any) => s + (c.budget || 0), 0),
          totalSpent: campaigns.reduce((s: number, c: any) => s + (c.spent || 0), 0),
        });
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Approved</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{data?.approved || 0}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-yellow-600">{data?.pending || 0}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Rejected</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-red-600">{data?.rejected || 0}</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Campaign Overview</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between"><span>Total Budget:</span><span className="font-bold">${data?.totalBudget?.toFixed(2) || '0'}</span></div>
          <div className="flex justify-between"><span>Total Spent:</span><span className="font-bold">${data?.totalSpent?.toFixed(2) || '0'}</span></div>
          <div className="flex justify-between"><span>Remaining:</span><span className="font-bold">${((data?.totalBudget || 0) - (data?.totalSpent || 0)).toFixed(2)}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
