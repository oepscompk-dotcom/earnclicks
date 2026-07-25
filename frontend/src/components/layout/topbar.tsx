'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useTheme } from '@/components/ui/theme-provider';
import { LogoImage } from '@/components/ui/logo-image';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

interface TopbarProps {
  title?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
  unreadNotifications?: number;
  onMenuToggle?: () => void;
}

export function Topbar({ title, user, unreadNotifications: initialUnread = 0, onMenuToggle }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unread, setUnread] = useState(initialUnread);
  const { logout } = useAuth();
  const { logos } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get<any>('/admin/notifications').then((res) => {
        const data = res.data?.data || res.data || [];
        const count = Array.isArray(data) ? data.filter((n: any) => !n.read_at).length : 0;
        setUnread(count);
      }).catch(() => {});
    }
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    window.location.href = '/login';
  };

  const role = user?.role || 'user';
  const profileHref = role === 'admin' ? '/admin/settings' : role === 'advertiser' ? '/advertiser/profile' : '/dashboard/profile';
  const notifHref = role === 'admin' ? '/admin/notifications' : '/dashboard/notifications';

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-4 lg:px-6">
      <button
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="flex lg:hidden items-center gap-2">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <span className="text-white font-bold text-xs">EC</span>
        </div>
        <span className="font-heading font-bold text-sm gradient-primary-text">{logos.site_name || 'EarnClicks'}</span>
      </div>

      {title && (
        <div className="hidden lg:block">
          <h1 className="font-heading text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      )}

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, campaigns, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) router.push(`/admin/users?search=${searchQuery}`); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-600">System Online</span>
        </div>

        <button
          className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <button
          className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => router.push(notifHref)}
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-500" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
              ) : initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-gray-400 capitalize">{role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/10 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href={profileHref}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Settings
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { toggleTheme(); setShowDropdown(false); }}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-gray-400" /> : <Moon className="h-4 w-4 text-gray-400" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              <div className="border-t border-gray-50 pt-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
