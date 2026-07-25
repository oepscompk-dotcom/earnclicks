'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  platform: string;
  task_type: string;
  reward: number;
  description: string;
  instructions: string;
  url: string;
  campaign: { title: string; advertiser: { name: string } };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = platform ? `?platform=${platform}` : '';
        const res = await api.get<any>(`/tasks${params}`);
        setTasks(res.tasks || []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [platform]);

  const platformColors: Record<string, string> = {
    instagram: 'bg-pink-100 text-pink-800',
    facebook: 'bg-blue-100 text-blue-800',
    twitter: 'bg-sky-100 text-sky-800',
    youtube: 'bg-red-100 text-red-800',
    tiktok: 'bg-gray-100 text-gray-800',
    telegram: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available Tasks</h1>
        <div className="flex gap-2">
          {['', 'instagram', 'facebook', 'twitter', 'youtube', 'tiktok', 'telegram'].map((p) => (
            <Button
              key={p}
              variant={platform === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPlatform(p)}
            >
              {p || 'All'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tasks available right now. Check back later!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge className={platformColors[task.platform] || 'bg-gray-100 text-gray-800'}>
                    {task.platform}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{task.campaign.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${task.reward.toFixed(2)}</span>
                  <Badge variant="outline">{task.task_type}</Badge>
                </div>
                <Link href={`/dashboard/tasks/${task.id}`} className="block">
                  <Button className="w-full" size="sm">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
