import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const data = await query(`SELECT * FROM campaigns WHERE status = 'approved' ORDER BY created_at DESC`);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await execute(`INSERT INTO campaigns (user_id, name, description, platform, link, reward_per_task, total_tasks, budget, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`, [
      payload.userId, body.name, body.description || '', body.platform || '',
      body.link || '', body.reward_per_task || 0, body.total_tasks || 0, body.budget || 0
    ]);
    const idResult = await query(`SELECT last_insert_rowid() as id`);
    return NextResponse.json({ message: 'Campaign created successfully', id: idResult[0].id });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}
