'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Copy, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReferralData {
  total_referrals: number;
  direct_referrals: number;
  total_commission: number;
  referral_link: string;
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<any>('/referrals');
        setData(res.stats || res);
      } catch {
        setData({ total_referrals: 0, direct_referrals: 0, total_commission: 0, referral_link: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyLink = () => {
    if (data?.referral_link) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${data.referral_link}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Referral Program</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><Users className="h-4 w-4" />Total Referrals</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.total_referrals || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><Users className="h-4 w-4" />Direct Referrals</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.direct_referrals || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><DollarSign className="h-4 w-4" />Total Commission</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">${data?.total_commission?.toFixed(2) || '0.00'}</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5" />Your Referral Link</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Share this link with friends. Earn 10% from Level 1, 5% from Level 2, and 2% from Level 3 referrals.</p>
          <div className="flex gap-2">
            <input readOnly className="flex-1 rounded-md border border-input bg-muted px-3 py-2 text-sm" value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${data?.referral_link || ''}`} />
            <Button onClick={copyLink}>{copied ? 'Copied!' : 'Copy'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
