'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare } from 'lucide-react';

interface Ticket { id: number; subject: string; status: string; message: string; admin_note: string | null; created_at: string; }

export default function AdvertiserSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => { try { const res = await api.get<any>('/support'); setTickets(res.tickets || []); } catch { setTickets([]); } finally { setLoading(false); } };
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/support', formData);
      setShowForm(false);
      const res = await api.get<any>('/support');
      setTickets(res.tickets || []);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Support</h1><Button onClick={() => setShowForm(!showForm)}><MessageSquare className="mr-2 h-4 w-4" />New Ticket</Button></div>
      {showForm && (
        <Card><CardHeader><CardTitle>New Ticket</CardTitle></CardHeader><CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="space-y-2"><Label>Subject</Label><Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Message</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required /></div>
            <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit</Button>
          </form>
        </CardContent></Card>
      )}
      {tickets.length === 0 ? <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No tickets.</p></CardContent></Card> : (
        <div className="space-y-3">{tickets.map((t) => (
          <Card key={t.id}><CardContent className="py-4"><div className="flex items-center gap-2"><h3 className="font-semibold">{t.subject}</h3><Badge>{t.status}</Badge></div><p className="text-sm text-muted-foreground mt-1">{t.message}</p>{t.admin_note && <div className="mt-2 rounded bg-muted p-2 text-sm"><strong>Admin:</strong> {t.admin_note}</div>}</CardContent></Card>
        ))}</div>
      )}
    </div>
  );
}
