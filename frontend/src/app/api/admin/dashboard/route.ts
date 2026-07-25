import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();

    const totalUsers = await query(`SELECT COUNT(*) as count FROM users`);
    const totalTasks = await query(`SELECT COUNT(*) as count FROM tasks`);
    const totalCampaigns = await query(`SELECT COUNT(*) as count FROM campaigns`);
    const totalDeposits = await query(`SELECT COUNT(*) as count FROM deposits WHERE status='completed'`);
    const pendingKyc = await query(`SELECT COUNT(*) as count FROM kyc WHERE status='pending'`);
    const totalWithdrawals = await query(`SELECT COUNT(*) as count FROM withdrawals WHERE status='pending'`);

    const getCount = (result: any) => result?.[0]?.count || 0;

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
