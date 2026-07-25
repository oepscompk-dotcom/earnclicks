'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toaster';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  Send,
  Trash2,
  Search,
  Megaphone,
  Info,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  MessageSquare,
  RotateCcw,
  X,
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  promotion: <Megaphone className="h-5 w-5" />,
  security: <Shield className="h-5 w-5" />,
  system: <Zap className="h-5 w-5" />,
  message: <MessageSquare className="h-5 w-5" />,
};

const typeStyles: Record<string, string> = {
  info: 'bg-blue-50 text-blue-600 border-blue-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  promotion: 'bg-purple-50 text-purple-600 border-purple-100',
  security: 'bg-red-50 text-red-600 border-red-100',
  system: 'bg-gray-50 text-gray-600 border-gray-200',
  message: 'bg-sky-50 text-sky-600 border-sky-100',
};

type FilterTab = 'all' | 'unread' | 'read';

const notificationTypes = ['info', 'warning', 'success', 'promotion', 'security', 'system', 'message'];

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [newType, setNewType] = useState('info');
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const toast = useToast();
  const { confirm } = useConfirm();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<any>('/admin/notifications');
      setNotifications(res.data?.data || res.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read_at).length, [notifications]);
  const readCount = useMemo(() => notifications.filter((n) => n.read_at).length, [notifications]);
  const todayCount = useMemo(() => notifications.filter((n) => isToday(n.created_at)).length, [notifications]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (filterTab === 'unread') list = list.filter((n) => !n.read_at);
    if (filterTab === 'read') list = list.filter((n) => n.read_at);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notifications, filterTab, search]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((n) => selected.has(n.id));

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((n) => n.id)));
    }
  };

  const markRead = async (id: number) => {
    try {
      await api.post(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/admin/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() }))
      );
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: number) => {
    const ok = await confirm({
      title: 'Delete notification',
      description: 'Are you sure you want to delete this notification? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const ok = await confirm({
      title: `Delete ${selected.size} notification${selected.size > 1 ? 's' : ''}?`,
      description: 'Are you sure? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    const ids = Array.from(selected);
    try {
      await Promise.all(ids.map((id) => api.delete(`/admin/notifications/${id}`)));
      setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
      setSelected(new Set());
      toast.success(`${ids.length} notification${ids.length > 1 ? 's' : ''} deleted`);
    } catch {
      toast.error('Failed to delete selected notifications');
    }
  };

  const sendNotification = async () => {
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.warning('Please fill in both title and message');
      return;
    }
    setSending(true);
    try {
      const res = await api.post<any>('/admin/notifications', {
        title: newTitle.trim(),
        message: newMessage.trim(),
        type: newType,
      });
      const created = res.data || res;
      if (created?.id) {
        setNotifications((prev) => [created, ...prev]);
      } else {
        await fetchNotifications();
      }
      toast.success('Notification sent successfully');
      setShowSendModal(false);
      setNewTitle('');
      setNewMessage('');
      setNewType('info');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const statCards = [
    { label: 'Total', value: notifications.length, icon: <Bell className="h-5 w-5" />, color: '#2D4F97' },
    { label: 'Unread', value: unreadCount, icon: <Bell className="h-5 w-5" />, color: '#F59E0B' },
    { label: 'Read', value: readCount, icon: <CheckCheck className="h-5 w-5" />, color: '#22C55E' },
    { label: 'Today', value: todayCount, icon: <Megaphone className="h-5 w-5" />, color: '#8B5CF6' },
  ];

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: readCount },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage system notifications, announcements, and alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          )}
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 gradient-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
            Send Notification
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}15`, color: s.color }}
              >
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
        <div className="p-4 lg:p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-xs font-medium transition-all',
                    filterTab === tab.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'ml-1.5 text-[10px]',
                      filterTab === tab.key ? 'text-white/70' : 'text-gray-400'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2">
              {selected.size > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete ({selected.size})
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                disabled={filtered.length === 0}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
              />
              <span className="text-xs text-gray-400">
                {selected.size > 0
                  ? `${selected.size} selected`
                  : `${filtered.length} notification${filtered.length !== 1 ? 's' : ''}`}
              </span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-sm text-gray-400 animate-pulse">Loading notifications...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No notifications found</p>
            <p className="text-xs text-gray-300 mt-1">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'px-6 py-4 flex items-start gap-4 hover:bg-blue-50/20 transition-colors',
                  !n.read_at && 'bg-blue-50/30'
                )}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selected.has(n.id)}
                    onChange={() => toggleSelect(n.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </div>
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl border flex items-center justify-center shrink-0',
                    typeStyles[n.type] || 'bg-gray-50 text-gray-500 border-gray-100'
                  )}
                >
                  {typeIcons[n.type] || <Info className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-sm',
                        n.read_at ? 'text-gray-700' : 'font-semibold text-gray-900'
                      )}
                    >
                      {n.title}
                    </p>
                    {!n.read_at && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{getRelativeTime(n.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.read_at && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!sending) setShowSendModal(false);
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slide-up">
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  Send Notification
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Create and send a new notification to users.
                </p>
              </div>
              <button
                onClick={() => {
                  if (!sending) setShowSendModal(false);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
                <div className="flex flex-wrap gap-2">
                  {notificationTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewType(t)}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all',
                        newType === t
                          ? typeStyles[t] || 'bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                      )}
                    >
                      <span className="shrink-0">{typeIcons[t]}</span>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Notification title"
                  disabled={sending}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={4}
                  disabled={sending}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end p-6 pt-0">
              <button
                onClick={() => {
                  if (!sending) setShowSendModal(false);
                }}
                disabled={sending}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={sendNotification}
                disabled={sending || !newTitle.trim() || !newMessage.trim()}
                className="flex items-center gap-2 gradient-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
