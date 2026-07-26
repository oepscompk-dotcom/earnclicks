'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdvertiserDashboardRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/advertiser'); }, [router]);
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D4F97] border-t-transparent" />
    </div>
  );
}
