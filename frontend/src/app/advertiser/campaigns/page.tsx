'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  status: string;
  total_budget: number;
  spent: number;
  completed_tasks: number;
  total_tasks: number;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get<any>('/campaigns');
        setCampaigns(res.campaigns || []);
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    paused: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <Link href="/advertiser/campaigns/create"><Button><Plus className="mr-2 h-4 w-4" />New Campaign</Button></Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : campaigns.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No campaigns yet. Create your first campaign!</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <Badge className={statusColors[c.status] || ''}>{c.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Budget: ${(c.total_budget ?? 0).toFixed(2)} | Spent: ${(c.spent ?? 0).toFixed(2)} | Tasks: {c.completed_tasks ?? 0}/{c.total_tasks ?? 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 bg-muted rounded-full h-2 mb-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(((c.spent ?? 0) / (c.total_budget ?? 1)) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{(((c.spent ?? 0) / (c.total_budget ?? 1)) * 100).toFixed(0)}% spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
