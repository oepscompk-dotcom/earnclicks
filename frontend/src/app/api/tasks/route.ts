import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();

    const authHeader = req.headers.get('authorization');
    let userId: number | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      const payload = verifyToken(authHeader.slice(7));
      if (payload) userId = payload.userId;
    }

    const tasks = await query(`
      SELECT t.*, c.name as campaign_name, c.platform, c.reward_per_task
      FROM tasks t
      JOIN campaigns c ON t.campaign_id = c.id
      WHERE t.status = 'active' AND c.status = 'approved'
      ORDER BY t.created_at DESC
      LIMIT 50
    `);

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}
