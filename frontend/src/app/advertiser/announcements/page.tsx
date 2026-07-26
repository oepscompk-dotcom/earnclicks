'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, Megaphone, Calendar, ChevronRight, Filter,
  Plus, AlertTriangle, Info, Gift, Sparkles, X
} from 'lucide-react';

const categories = ['All', 'Platform Updates', 'Tips & Tricks', 'Promotions'] as const;
type Category = typeof categories[number];

const announcements = [
  {
    id: 1, title: 'New Analytics Dashboard Launch', date: '2026-07-24',
    content: 'We are excited to announce the launch of our completely redesigned analytics dashboard. Experience real-time data visualization, custom report builder, and advanced filtering options. The new dashboard provides deeper insights into your campaign performance with actionable recommendations.',
    category: 'Platform Updates', read: false, featured: true,
  },
  {
    id: 2, title: 'Weekend Bonus: 2x Reward Points', date: '2026-07-22',
    content: 'Earn double reward points on all campaigns this weekend! From July 26-28, every task completed will earn 2x the standard reward points. This is a limited-time offer to help you maximize your advertising budget.',
    category: 'Promotions', read: false, featured: false,
  },
  {
    id: 3, title: 'Optimizing Your Campaign Targeting', date: '2026-07-20',
    content: 'Learn how to make the most of our advanced targeting options. This guide covers audience segmentation, geo-targeting best practices, and tips for reaching the right workers at the right time to maximize your conversion rates.',
    category: 'Tips & Tricks', read: true, featured: false,
  },
  {
    id: 4, title: 'New Payout Method: USDT (TRC-20)', date: '2026-07-18',
    content: 'We have added USDT (TRC-20) as a new payout method for advertisers. Enjoy faster transaction times and lower fees when funding your campaigns or withdrawing your balance. TRC-20 transactions are processed within minutes.',
    category: 'Platform Updates', read: true, featured: false,
  },
  {
    id: 5, title: 'Summer Sale: 15% Off Featured Campaigns', date: '2026-07-15',
    content: 'Take advantage of our summer sale! Get 15% off featured campaign fees for all new campaigns created this month. Use code SUMMER15 at checkout. Offer valid until July 31, 2026.',
    category: 'Promotions', read: true, featured: false,
  },
  {
    id: 6, title: 'Improving Worker Engagement Rates', date: '2026-07-12',
    content: 'Discover proven strategies to boost worker engagement in your campaigns. From optimizing task descriptions to setting appropriate reward amounts, we cover everything you need to know to attract and retain top-quality workers.',
    category: 'Tips & Tricks', read: true, featured: false,
  },
  {
    id: 7, title: 'Platform Maintenance Notice', date: '2026-07-10',
    content: 'Scheduled maintenance will occur on July 28, 2026 from 02:00-05:00 UTC. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience and recommend planning your campaigns accordingly.',
    category: 'Platform Updates', read: true, featured: false,
  },
  {
    id: 8, title: 'New Referral Program Launch', date: '2026-07-08',
    content: 'Introducing our new referral program! Invite other advertisers to join EarnClicks and earn 10% of their first deposit. There is no limit to how many advertisers you can refer. Start earning today!',
    category: 'Promotions', read: true, featured: false,
  },
];

const categoryColors: Record<string, string> = {
  'Platform Updates': 'bg-blue-50 text-blue-600 border-blue-200',
  'Tips & Tricks': 'bg-green-50 text-green-600 border-green-200',
  'Promotions': 'bg-purple-50 text-purple-600 border-purple-200',
};

const categoryIcons: Record<string, typeof Bell> = {
  'Platform Updates': Megaphone,
  'Tips & Tricks': Info,
  'Promotions': Gift,
};

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeCategory === 'All'
    ? announcements
    : announcements.filter(a => a.category === activeCategory);

  const featured = announcements.find(a => a.featured);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Latest updates, tips, and promotions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 opacity-50 cursor-not-allowed" disabled title="Admin only">
            <Plus className="h-4 w-4" /> Create Announcement
            <Badge variant="outline" className="text-[9px] ml-1">Admin</Badge>
          </Button>
        </div>
      </div>

      {featured && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2D4F97] via-[#1E8A8D] to-[#18C79A] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px]">Latest</Badge>
                <span className="text-xs text-white/70">{featured.date}</span>
              </div>
              <h2 className="text-lg font-bold mb-1">{featured.title}</h2>
              <p className="text-sm text-white/80 line-clamp-2">{featured.content}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const Icon = cat === 'All' ? Filter : categoryIcons[cat] || Bell;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all',
                activeCategory === cat
                  ? 'bg-[#2D4F97] text-white border-[#2D4F97]'
                  : 'bg-white/80 backdrop-blur-xl border-gray-200 text-gray-600 hover:border-[#2D4F97]/30'
              )}>
              <Icon className="h-3.5 w-3.5" /> {cat}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map(a => {
          const Icon = categoryIcons[a.category] || Bell;
          const unreadDot = !a.read;
          return (
            <Card key={a.id}
              className={cn(
                'bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl hover:shadow-sm transition-all cursor-pointer',
                unreadDot && 'border-l-[#2D4F97] border-l-4'
              )}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', categoryColors[a.category].split(' ')[0])}>
                    <Icon className={cn('h-4 w-4', categoryColors[a.category].split(' ')[1])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn('text-[10px] border', categoryColors[a.category])}>{a.category}</Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {a.date}
                      </span>
                      {unreadDot && <span className="w-1.5 h-1.5 rounded-full bg-[#2D4F97]" />}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{a.content}</p>
                    <button className="flex items-center gap-1 text-xs font-medium text-[#2D4F97] mt-2 hover:underline">
                      Read more <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-lg bg-white rounded-2xl" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Create Announcement</CardTitle>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="h-4 w-4" /></button>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Only administrators can create announcements. Contact support if you need to publish one.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
