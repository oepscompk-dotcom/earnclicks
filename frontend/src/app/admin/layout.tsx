'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  admin: 'Dashboard',
  users: 'Users',
  advertisers: 'Advertisers',
  campaigns: 'Campaigns',
  tasks: 'Submissions',
  deposits: 'Deposits',
  withdrawals: 'Withdrawals',
  kyc: 'KYC Verification',
  cms: 'CMS & Branding',
  reports: 'Reports',
  support: 'Support',
  settings: 'Settings',
  logs: 'Activity Logs',
  notifications: 'Notifications',
  dashboard: 'Dashboard',
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-1">
      <Link href="/admin" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>
      {segments.slice(1).map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          <span className={i === segments.length - 2 ? 'text-gray-700 font-medium' : ''}>
            {routeNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)}
          </span>
        </span>
      ))}
    </nav>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100 h-16">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gray-200 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="h-4.5 w-4.5 rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-3.5 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse lg:hidden" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1" />
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/superadmin/login');
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return <LoadingSkeleton />;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
        <Sidebar role="admin" user={user} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
