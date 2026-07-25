'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', total_budget: '', task_url: '',
    reward_per_task: '', platform: 'instagram', task_type: 'like',
    instructions: '', start_date: '', end_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/campaigns', {
        ...formData,
        total_budget: parseFloat(formData.total_budget),
        reward_per_task: parseFloat(formData.reward_per_task),
      });
      router.push('/advertiser/campaigns');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/advertiser/campaigns"><Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button></Link>
      <h1 className="text-2xl font-bold">Create Campaign</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="Campaign name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Description</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Total Budget (USDT)</Label><Input type="number" step="0.01" min="1" value={formData.total_budget} onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Reward per Task (USDT)</Label><Input type="number" step="0.01" min="0.001" value={formData.reward_per_task} onChange={(e) => setFormData({ ...formData, reward_per_task: e.target.value })} required /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Platform</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}>
                  {['instagram', 'facebook', 'twitter', 'youtube', 'tiktok', 'telegram'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Task Type</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.task_type} onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}>
                  {['like', 'follow', 'subscribe', 'share', 'comment', 'watch_video', 'visit_website', 'join_group'].map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2"><Label>Task URL</Label><Input type="url" placeholder="https://..." value={formData.task_url} onChange={(e) => setFormData({ ...formData, task_url: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Instructions</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Detailed instructions for taskers..." value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} required /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required /></div>
            </div>
            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Campaign</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
