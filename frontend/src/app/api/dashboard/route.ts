import { NextResponse } from 'next/server';
import { getDb, initDatabase } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const tasks = db.exec(`SELECT COUNT(*) as count FROM tasks WHERE status='active'`);
    const count = tasks?.[0]?.values?.[0]?.[0] || 0;
    return NextResponse.json({
      stats: { total_tasks: count, completed_tasks: 0, total_earnings: 0, balance: 0 },
      recent_tasks: [],
    });
  } catch {
    return NextResponse.json({ stats: {}, recent_tasks: [] });
  }
}
