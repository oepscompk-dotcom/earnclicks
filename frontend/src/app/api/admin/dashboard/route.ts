import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();

    const totalUsers = db.exec(`SELECT COUNT(*) as count FROM users`);
    const totalTasks = db.exec(`SELECT COUNT(*) as count FROM tasks`);
    const totalCampaigns = db.exec(`SELECT COUNT(*) as count FROM campaigns`);
    const totalDeposits = db.exec(`SELECT COUNT(*) as count FROM deposits WHERE status='completed'`);
    const pendingKyc = db.exec(`SELECT COUNT(*) as count FROM kyc WHERE status='pending'`);
    const totalWithdrawals = db.exec(`SELECT COUNT(*) as count FROM withdrawals WHERE status='pending'`);

    const getCount = (result: any) => result?.[0]?.values?.[0]?.[0] || 0;

    return NextResponse.json({
      stats: {
        total_users: getCount(totalUsers),
        total_tasks: getCount(totalTasks),
        total_campaigns: getCount(totalCampaigns),
        total_deposits: getCount(totalDeposits),
        pending_kyc: getCount(pendingKyc),
        pending_withdrawals: getCount(totalWithdrawals),
        total_earnings: 0,
        active_users: 0,
      },
      users: [],
      recent_users: [],
      recent_deposits: [],
    });
  } catch {
    return NextResponse.json({ stats: {}, users: [], recent_users: [], recent_deposits: [] });
  }
}
