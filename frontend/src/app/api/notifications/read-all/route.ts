import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await execute(`UPDATE notifications SET is_read = 1 WHERE user_id = ? OR (target_role = 'user' AND user_id IS NULL)`, [payload.userId]);
    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}
