'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Send } from 'lucide-react';

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  message: string;
  admin_note: string | null;
  created_at: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get<any>('/support');
        setTickets(res.tickets || []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post<{ message: string }>('/support', formData);
      setSuccess(res.message || 'Ticket submitted.');
      setShowForm(false);
      setFormData({ subject: '', message: '', priority: 'medium' });
      const listRes = await api.get<any>('/support');
      setTickets(listRes.tickets || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const statusColors: Record<string, string> = { open: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800', pending: 'bg-yellow-100 text-yellow-800' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support</h1>
        <Button onClick={() => setShowForm(!showForm)}><MessageSquare className="mr-2 h-4 w-4" />{showForm ? 'Cancel' : 'New Ticket'}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Support Ticket</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief description" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Describe your issue..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
              </div>
              <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tickets.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No support tickets yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{t.subject}</h3>
                      <Badge className={statusColors[t.status] || ''}>{t.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {t.admin_note && <div className="mt-3 rounded-md bg-muted p-3 text-sm"><strong>Admin:</strong> {t.admin_note}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
