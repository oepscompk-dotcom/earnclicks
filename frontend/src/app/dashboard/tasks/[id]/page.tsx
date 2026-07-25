'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  platform: string;
  task_type: string;
  reward: number;
  description: string;
  instructions: string;
  url: string;
  campaign: { title: string; description: string; advertiser: { name: string } };
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get<any>(`/tasks/${params.id}`);
        setTask(res.task);
      } catch {
        setError('Task not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/tasks/submit', {
        task_id: task!.id,
        proof_url: proofUrl,
        proof_type: 'link',
      });
      setSuccess('Task submitted successfully! Awaiting review.');
      setTimeout(() => router.push('/dashboard/submissions'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive"><AlertDescription>{error || 'Task not found'}</AlertDescription></Alert>
        <Link href="/dashboard/tasks"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Back to Tasks</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/dashboard/tasks">
        <Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Tasks</Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{task.campaign.title} by {task.campaign.advertiser.name}</p>
            </div>
            <span className="text-2xl font-bold text-primary">${task.reward.toFixed(2)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{task.instructions}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Link</h3>
            <a href={task.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              {task.url} <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {success ? (
            <Alert><AlertDescription>{success}</AlertDescription></Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
              <h3 className="font-semibold">Submit Proof</h3>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label htmlFor="proof">Proof URL (link to your post/comment)</Label>
                <Input
                  id="proof"
                  placeholder="https://..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Task
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
