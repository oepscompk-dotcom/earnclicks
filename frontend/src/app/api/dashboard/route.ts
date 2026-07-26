import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const tasks = await query(`SELECT COUNT(*) as count FROM tasks WHERE status='active'`);
    const active = tasks?.[0]?.count || 0;
    return NextResponse.json({
      stats: {
        today_spend: 0,
        active_campaigns: active,
        total_reach: 0,
        completed_tasks: 0,
        pending_reviews: 0,
        total_clicks: 0,
        ctr: 0,
        total_conversions: 0,
        followers_gained: 0,
        likes_subscribers: 0,
        today_roi: 0,
      },
    });
  } catch {
    return NextResponse.json({ stats: {
      today_spend: 0, active_campaigns: 0, total_reach: 0, completed_tasks: 0,
      pending_reviews: 0, total_clicks: 0, ctr: 0, total_conversions: 0,
      followers_gained: 0, likes_subscribers: 0, today_roi: 0,
    } });
  }
}
