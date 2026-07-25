'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  MessageSquare, Clock, UserCheck, CheckCircle, XCircle,
  Reply, Eye, X, UserPlus, BookOpen, HelpCircle, Loader2
} from 'lucide-react';

interface TicketUser {
  name: string;
  email: string;
  avatar?: string;
}

interface Ticket {
  id: number;
  user: TicketUser;
  subject: string;
  category: string;
  priority: string;
  assigned_to: { name: string } | null;
  status: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  waiting_on_user: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const FILTER_TABS = [
  { key: '', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = filter ? `?status=${filter}` : '';
        const res = await api.get<any>(`/admin/support/tickets${params}`);
        setTickets(res.data?.data || res.data || res || []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [filter]);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const statsCards = [
    { label: 'Open Tickets', status: 'open', icon: <MessageSquare className="h-5 w-5" />, color: '#2D4F97' },
    { label: 'In Progress', status: 'in_progress', icon: <Clock className="h-5 w-5" />, color: '#F59E0B' },
    { label: 'Waiting on User', status: 'waiting_on_user', icon: <UserCheck className="h-5 w-5" />, color: '#8B5CF6' },
    { label: 'Resolved', status: 'resolved', icon: <CheckCircle className="h-5 w-5" />, color: '#18C97A' },
    { label: 'Closed', status: 'closed', icon: <XCircle className="h-5 w-5" />, color: '#6B7280' },
  ];

  const stats = statsCards.map(s => ({
    ...s,
    value: tickets.filter(t => s.status === 'open' ? t.status === 'open' : t.status === s.status).length,
  }));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage user support requests and inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#2D4F97] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#2D4F97]/90 transition-colors">
            <UserPlus className="h-4 w-4" />Create Ticket
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <BookOpen className="h-4 w-4" />Knowledge Base
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <HelpCircle className="h-4 w-4" />FAQ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === t.key ? 'bg-[#2D4F97] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-[#2D4F97] animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No tickets found</p>
            <p className="text-sm text-gray-300 mt-1">Try a different filter or create a new ticket</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 lg:px-6 py-4">User</th>
                  <th className="px-4 py-4">Subject</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Category</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Assigned To</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Last Updated</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #2D4F97, #1E8A8D)' }}>
                          {getInitials(t.user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t.user.name}</p>
                          <p className="text-xs text-gray-400">{t.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900 font-medium truncate max-w-[200px]">{t.subject}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 capitalize">{t.category || 'general'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${PRIORITY_COLORS[t.priority] || 'bg-gray-100 text-gray-600'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{t.assigned_to?.name || 'Unassigned'}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{new Date(t.updated_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-700'}`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Reply">
                          <Reply className="h-4 w-4" />
                        </button>
                        {t.status !== 'closed' && t.status !== 'resolved' && (
                          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Close">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Assign">
                          <UserPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}