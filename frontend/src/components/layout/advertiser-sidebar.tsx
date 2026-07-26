'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import { useState } from 'react';
import {
  LayoutDashboard, Megaphone, ListChecks, ClipboardList, FileText, Clock, PlayCircle, PauseCircle, CheckCircle2, Box, Users2, Globe, Target, TrendingUp, BarChart3, LineChart, Repeat, Star, Bell, MessageSquare, FolderOpen, Building2, Settings, LogOut, Wallet, ArrowDownCircle, RefreshCw, CreditCard, Receipt, Gift, Zap, Flame, Newspaper, Award, Shield, ChevronDown, Search, Menu,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/advertiser', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Campaigns',
    items: [
      { label: 'Create Campaign', href: '/advertiser/campaigns/create', icon: <Megaphone className="h-[18px] w-[18px]" /> },
      { label: 'Campaign Manager', href: '/advertiser/campaigns', icon: <ClipboardList className="h-[18px] w-[18px]" /> },
      { label: 'Draft Campaigns', href: '/advertiser/drafts', icon: <FileText className="h-[18px] w-[18px]" /> },
      { label: 'Pending Approval', href: '/advertiser/pending', icon: <Clock className="h-[18px] w-[18px]" /> },
      { label: 'Active Campaigns', href: '/advertiser/active', icon: <PlayCircle className="h-[18px] w-[18px]" /> },
      { label: 'Paused Campaigns', href: '/advertiser/paused', icon: <PauseCircle className="h-[18px] w-[18px]" /> },
      { label: 'Completed Campaigns', href: '/advertiser/completed', icon: <CheckCircle2 className="h-[18px] w-[18px]" /> },
      { label: 'Campaign Templates', href: '/advertiser/templates', icon: <Box className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Audience',
    items: [
      { label: 'Audience Manager', href: '/advertiser/audience', icon: <Users2 className="h-[18px] w-[18px]" /> },
      { label: 'Geo Targeting', href: '/advertiser/targeting', icon: <Globe className="h-[18px] w-[18px]" /> },
      { label: 'Worker Targeting', href: '/advertiser/worker-targeting', icon: <Target className="h-[18px] w-[18px]" /> },
      { label: 'Audience Insights', href: '/advertiser/audience-insights', icon: <TrendingUp className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Wallet', href: '/advertiser/wallet', icon: <Wallet className="h-[18px] w-[18px]" /> },
      { label: 'Deposit Funds', href: '/advertiser/deposit', icon: <ArrowDownCircle className="h-[18px] w-[18px]" /> },
      { label: 'Refund Requests', href: '/advertiser/refunds', icon: <RefreshCw className="h-[18px] w-[18px]" /> },
      { label: 'Transactions', href: '/advertiser/transactions', icon: <CreditCard className="h-[18px] w-[18px]" /> },
      { label: 'Billing & Invoices', href: '/advertiser/billing', icon: <Receipt className="h-[18px] w-[18px]" /> },
      { label: 'Coupons & Promo', href: '/advertiser/coupons', icon: <Gift className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Dashboard Analytics', href: '/advertiser/analytics', icon: <BarChart3 className="h-[18px] w-[18px]" /> },
      { label: 'Performance Reports', href: '/advertiser/reports', icon: <LineChart className="h-[18px] w-[18px]" /> },
      { label: 'Conversion Tracking', href: '/advertiser/conversions', icon: <Repeat className="h-[18px] w-[18px]" /> },
      { label: 'Country Reports', href: '/advertiser/country-reports', icon: <Globe className="h-[18px] w-[18px]" /> },
      { label: 'Platform Reports', href: '/advertiser/platform-reports', icon: <BarChart3 className="h-[18px] w-[18px]" /> },
      { label: 'Featured Performance', href: '/advertiser/featured', icon: <Star className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Campaign Boost', href: '/advertiser/boost', icon: <Zap className="h-[18px] w-[18px]" /> },
      { label: 'Featured Campaigns', href: '/advertiser/featured-campaigns', icon: <Flame className="h-[18px] w-[18px]" /> },
      { label: 'Announcements', href: '/advertiser/announcements', icon: <Newspaper className="h-[18px] w-[18px]" /> },
      { label: 'Loyalty Rewards', href: '/advertiser/loyalty', icon: <Award className="h-[18px] w-[18px]" /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', href: '/advertiser/notifications', icon: <Bell className="h-[18px] w-[18px]" /> },
      { label: 'Support Center', href: '/advertiser/support', icon: <MessageSquare className="h-[18px] w-[18px]" /> },
      { label: 'Media Library', href: '/advertiser/media', icon: <FolderOpen className="h-[18px] w-[18px]" /> },
      { label: 'Business Profile', href: '/advertiser/business', icon: <Building2 className="h-[18px] w-[18px]" /> },
      { label: 'Security Center', href: '/advertiser/security', icon: <Shield className="h-[18px] w-[18px]" /> },
      { label: 'Settings', href: '/advertiser/settings', icon: <Settings className="h-[18px] w-[18px]" /> },
    ],
  },
];

export function AdvertiserSidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { logos } = useSiteSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const sections: Record<string, boolean> = {};
    navSections.forEach((s) => {
      sections[s.title] = s.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));
    });
    return sections;
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => pathname === href || (href !== '/advertiser' && pathname.startsWith(href + '/'));

  const handleLogout = async () => {
    try { await logout(); } catch {}
    window.location.href = '/advertiser-login';
  };

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-100 w-[260px] shrink-0">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between h-16 shrink-0">
        <Link href="/advertiser" className="flex items-center gap-2.5">
          {logos.header_logo ? (
            <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-7 w-auto" defaultLogo={null} />
          ) : (
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">EC</span>
            </div>
          )}
          <div>
            <span className="font-heading font-bold text-sm tracking-tight gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
            <p className="text-[10px] text-gray-400 -mt-0.5">Advertiser Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 px-3 space-y-1">
        {navSections.map((section) => {
          const isExpanded = expandedSections[section.title] ?? true;
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-2 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    isExpanded ? 'rotate-0' : '-rotate-90'
                  )}
                />
              </button>
              {isExpanded && (
                <div className="space-y-0.5 mt-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavClick}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                          active
                            ? 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white shadow-md shadow-blue-500/20'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <span className={cn('shrink-0', active ? 'text-white' : 'text-gray-400')}>{item.icon}</span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shrink-0">{item.badge}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
            ) : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-tight truncate">{user?.name || 'Advertiser'}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
