import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const result = db.exec(`SELECT * FROM notifications WHERE user_id = ${payload.userId} OR (target_role = 'user' AND user_id IS NULL) ORDER BY created_at DESC LIMIT 50`);
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
