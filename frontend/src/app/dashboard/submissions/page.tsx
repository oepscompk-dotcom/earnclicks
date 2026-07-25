'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Submission {
  id: number;
  status: string;
  proof_url: string;
  reward_amount: number;
  created_at: string;
  verified_at: string | null;
  admin_note: string | null;
  task: { title: string; platform: string };
  campaign: { title: string };
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const params = filter ? `?status=${filter}` : '';
        const res = await api.get<any>(`/my-submissions${params}`);
        setSubmissions(res.submissions || []);
      } catch {
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [filter]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Submissions</h1>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
              {s || 'All'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : submissions.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No submissions yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{s.task.title}</h3>
                      <Badge className={statusColors[s.status] || ''}>{s.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.campaign.title} &middot; {s.task.platform}</p>
                    <p className="text-xs text-muted-foreground">Submitted {new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">${s.reward_amount.toFixed(2)}</span>
                </div>
                {s.admin_note && <p className="mt-2 text-sm text-red-600">Note: {s.admin_note}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
