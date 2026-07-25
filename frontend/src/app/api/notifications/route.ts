import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const result = await query(`SELECT * FROM notifications WHERE user_id = ? OR (target_role = 'user' AND user_id IS NULL) ORDER BY created_at DESC LIMIT 50`, [payload.userId]);
    const data: any[] = result;
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
