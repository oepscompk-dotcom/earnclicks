'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, Check, AlertTriangle, Info, X, ChevronDown, ChevronUp,
  Megaphone, Settings, MailOpen,
} from 'lucide-react';

type FilterTab = 'all' | 'unread' | 'campaign' | 'system';

interface Notification {
  id: number;
  type: 'campaign' | 'system' | 'alert' | 'billing';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'campaign', title: 'Campaign Approved', message: 'Your "Summer Sale Video Promo" campaign has been approved and is now running.', read: false, created_at: '2026-07-26T10:30:00Z' },
  { id: 2, type: 'alert', title: 'Budget Alert', message: 'Campaign "TikTok Viral Challenge" has reached 80% of its budget.', read: false, created_at: '2026-07-26T09:15:00Z' },
  { id: 3, type: 'system', title: 'New Feature Available', message: 'Campaign Boost packages are now available. Increase your campaign reach!', read: false, created_at: '2026-07-25T14:00:00Z' },
  { id: 4, type: 'billing', title: 'Deposit Confirmed', message: 'Your deposit of 500 USDT has been confirmed and added to your wallet.', read: true, created_at: '2026-07-24T16:45:00Z' },
  { id: 5, type: 'campaign', title: 'Campaign Completed', message: '"Telegram Channel Boost" has completed all 6,000 tasks.', read: true, created_at: '2026-07-23T11:20:00Z' },
  { id: 6, type: 'alert', title: 'Low Balance Warning', message: 'Your wallet balance is below 100 USDT. Please deposit to keep campaigns running.', read: false, created_at: '2026-07-22T08:00:00Z' },
  { id: 7, type: 'system', title: 'Maintenance Scheduled', message: 'Platform maintenance on July 28th from 02:00-04:00 UTC.', read: true, created_at: '2026-07-21T12:00:00Z' },
  { id: 8, type: 'campaign', title: 'New Worker Activity', message: '500 new workers joined your "Brand Awareness IG Reels" campaign today.', read: false, created_at: '2026-07-20T18:30:00Z' },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  campaign: { icon: <Megaphone className="h-4 w-4" />, color: '#2D4F97', bg: '#EEF0F9' },
  system: { icon: <Info className="h-4 w-4" />, color: '#1E8A8D', bg: '#E8F4F4' },
  alert: { icon: <AlertTriangle className="h-4 w-4" />, color: '#D97706', bg: '#FEF3C7' },
  billing: { icon: <Bell className="h-4 w-4" />, color: '#18C79A', bg: '#E8FAF3' },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'campaign') return n.type === 'campaign';
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'campaign', label: 'Campaign Updates' },
    { key: 'system', label: 'System' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">Stay updated with your campaigns and account</p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            variant="outline"
            className="h-10 px-5 rounded-xl border-gray-200 text-gray-600 hover:text-[#2D4F97] hover:border-[#2D4F97]/30"
          >
            <MailOpen className="h-4 w-4 mr-2" />
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
              className={cn(
                'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-[#2D4F97] text-white shadow-md shadow-[#2D4F97]/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              {activeTab === 'unread' ? 'All notifications are read' :
               activeTab === 'campaign' ? 'No campaign updates yet' :
               activeTab === 'system' ? 'No system notifications' :
               'You have no notifications'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const isExpanded = expandedId === n.id;

            return (
              <Card
                key={n.id}
                className={cn(
                  'bg-white/80 backdrop-blur-xl border rounded-2xl shadow-sm transition-all duration-200 cursor-pointer',
                  n.read ? 'border-gray-100' : 'border-[#2D4F97]/20 bg-[#2D4F97]/[0.02]'
                )}
                onClick={() => {
                  if (!n.read) markRead(n.id);
                  setExpandedId(isExpanded ? null : n.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={cn('text-sm truncate', n.read ? 'text-gray-700' : 'text-gray-900 font-semibold')}>
                            {n.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[#2D4F97] shrink-0" />}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className={cn('text-xs mt-1', n.read ? 'text-gray-400' : 'text-gray-500')}>
                        {isExpanded ? n.message : n.message.length > 80 ? n.message.slice(0, 80) + '...' : n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 h-5 capitalize"
                          style={{ borderColor: cfg.color + '30', color: cfg.color, background: cfg.bg }}
                        >
                          {n.type}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-gray-300" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
