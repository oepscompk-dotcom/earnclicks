'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => { if (!loading && (!user || user.role !== 'advertiser')) router.push('/login'); }, [user, loading, router]);
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!user) return null;
  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}><Sidebar role="advertiser" user={user} /></div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}