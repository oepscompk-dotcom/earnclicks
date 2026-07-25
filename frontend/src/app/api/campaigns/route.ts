import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT * FROM campaigns WHERE status = 'approved' ORDER BY created_at DESC`);
    const data: any[] = [];
    if (result.length) {
      const cols = result[0].columns;
      result[0].values.forEach((row: any) => {
        const item: any = {};
        cols.forEach((c: string, i: number) => { item[c] = row[i]; });
        data.push(item);
      });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    db.run(`INSERT INTO campaigns (user_id, name, description, platform, link, reward_per_task, total_tasks, budget, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`, [
      payload.userId, body.name, body.description || '', body.platform || '',
      body.link || '', body.reward_per_task || 0, body.total_tasks || 0, body.budget || 0
    ]);
    saveDb();
    return NextResponse.json({ message: 'Campaign created successfully', id: (db as any).exec(`SELECT last_insert_rowid() as id`)[0].values[0][0] });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}
