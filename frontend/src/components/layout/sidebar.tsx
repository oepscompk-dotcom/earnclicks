'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { LogoImage } from '@/components/ui/logo-image';
import {
  LayoutDashboard,
  ListChecks,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  Bell,
  HelpCircle,
  User,
  Shield,
  Settings,
  LogOut,
  DollarSign,
  BarChart3,
  FileText,
  ClipboardList,
  CreditCard,
  Activity,
  BookOpen,
  MessageSquare,
  Globe,
  Megaphone,
  Zap,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const userNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: 'Available Tasks', href: '/dashboard/tasks', icon: <ListChecks className="h-[18px] w-[18px]" /> },
  { label: 'My Submissions', href: '/dashboard/submissions', icon: <FileText className="h-[18px] w-[18px]" /> },
  { label: 'Wallet', href: '/dashboard/wallet', icon: <Wallet className="h-[18px] w-[18px]" /> },
  { label: 'Deposit', href: '/dashboard/deposit', icon: <ArrowDownCircle className="h-[18px] w-[18px]" /> },
  { label: 'Withdraw', href: '/dashboard/withdraw', icon: <ArrowUpCircle className="h-[18px] w-[18px]" /> },
  { label: 'Referrals', href: '/dashboard/referral', icon: <Users className="h-[18px] w-[18px]" /> },
  { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="h-[18px] w-[18px]" /> },
  { label: 'Support', href: '/dashboard/support', icon: <HelpCircle className="h-[18px] w-[18px]" /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User className="h-[18px] w-[18px]" /> },
  { label: 'KYC', href: '/dashboard/kyc', icon: <Shield className="h-[18px] w-[18px]" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-[18px] w-[18px]" /> },
];

const advertiserNav: NavItem[] = [
  { label: 'Dashboard', href: '/advertiser', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: 'Create Campaign', href: '/advertiser/campaigns/create', icon: <ListChecks className="h-[18px] w-[18px]" /> },
  { label: 'My Campaigns', href: '/advertiser/campaigns', icon: <ClipboardList className="h-[18px] w-[18px]" /> },
  { label: 'Wallet', href: '/advertiser/wallet', icon: <Wallet className="h-[18px] w-[18px]" /> },
  { label: 'Deposit', href: '/advertiser/deposit', icon: <ArrowDownCircle className="h-[18px] w-[18px]" /> },
  { label: 'Reports', href: '/advertiser/reports', icon: <BarChart3 className="h-[18px] w-[18px]" /> },
  { label: 'Analytics', href: '/advertiser/analytics', icon: <Activity className="h-[18px] w-[18px]" /> },
  { label: 'Support', href: '/advertiser/support', icon: <HelpCircle className="h-[18px] w-[18px]" /> },
  { label: 'Profile', href: '/advertiser/profile', icon: <User className="h-[18px] w-[18px]" /> },
  { label: 'Settings', href: '/advertiser/settings', icon: <Settings className="h-[18px] w-[18px]" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-[18px] w-[18px]" /> },
  { label: 'Advertisers', href: '/admin/advertisers', icon: <Megaphone className="h-[18px] w-[18px]" /> },
  { label: 'Campaigns', href: '/admin/campaigns', icon: <ClipboardList className="h-[18px] w-[18px]" /> },
  { label: 'Submissions', href: '/admin/tasks', icon: <ListChecks className="h-[18px] w-[18px]" /> },
  { label: 'Deposits', href: '/admin/deposits', icon: <ArrowDownCircle className="h-[18px] w-[18px]" /> },
  { label: 'Withdrawals', href: '/admin/withdrawals', icon: <ArrowUpCircle className="h-[18px] w-[18px]" /> },
  { label: 'KYC', href: '/admin/kyc', icon: <Shield className="h-[18px] w-[18px]" /> },
  { label: 'CMS & Branding', href: '/admin/cms', icon: <Globe className="h-[18px] w-[18px]" /> },
  { label: 'Reports', href: '/admin/reports', icon: <BarChart3 className="h-[18px] w-[18px]" /> },
  { label: 'Support', href: '/admin/support', icon: <MessageSquare className="h-[18px] w-[18px]" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-[18px] w-[18px]" /> },
  { label: 'Logs', href: '/admin/logs', icon: <BookOpen className="h-[18px] w-[18px]" /> },
];

interface SidebarProps {
  role: 'user' | 'advertiser' | 'admin';
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export function Sidebar({ role, user }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { logos } = useSiteSettings();
  const navItems = role === 'admin' ? adminNav : role === 'advertiser' ? advertiserNav : userNav;

  const handleLogout = async () => {
    try { await logout(); } catch {}
    window.location.href = role === 'admin' ? '/superadmin/login' : role === 'advertiser' ? '/advertiser-login' : '/tasker-login';
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 h-screen border-r border-gray-100 bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center h-16 shrink-0">
        <Link href={role === 'admin' ? '/admin' : role === 'advertiser' ? '/advertiser' : '/dashboard'} className="flex items-center gap-2.5">
          {logos.header_logo ? (
            <LogoImage src={logos.header_logo} type={logos.header_logo_type || 'png'} alt="EarnClicks" className="h-7 w-auto" defaultLogo={null} />
          ) : (
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">EC</span>
            </div>
          )}
          <div>
            <span className="font-heading font-bold text-sm tracking-tight gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
            <p className="text-[10px] text-gray-400 -mt-0.5 capitalize">{role} Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-[#2D4F97] to-[#1E8A8D] text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className={cn('shrink-0', isActive ? 'text-white' : 'text-gray-400')}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 shrink-0">
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
