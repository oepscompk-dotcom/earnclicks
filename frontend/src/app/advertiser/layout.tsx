'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdvertiserSidebar } from '@/components/layout/advertiser-sidebar';
import { Menu, X } from 'lucide-react';

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'advertiser')) {
      router.push('/advertiser-login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2D4F97] border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <div className={`${sidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:relative lg:flex lg:z-auto`}>
        <div
          className={`${sidebarOpen ? 'block' : 'hidden'} lg:hidden fixed inset-0 bg-black/50 z-40`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative z-50 lg:z-auto">
          <div className="lg:hidden absolute top-3 right-3 z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl bg-white shadow-md hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <AdvertiserSidebar onNavClick={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search campaigns, reports, settings..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4F97]/20 focus:border-[#2D4F97] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-600">System Online</span>
            </button>

            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              title="Toggle Theme"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <button
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => router.push('/advertiser/notifications')}
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD'
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'Advertiser'}</p>
                <p className="text-[11px] text-gray-400">Advertiser</p>
              </div>
            </div>
          </div>


        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>


    </div>
  );
}
