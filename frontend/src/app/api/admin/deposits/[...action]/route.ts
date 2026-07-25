import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string[] }> }) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { action } = await params;
    const [id, operation] = action;
    const status = operation === 'approve' ? 'completed' : 'rejected';
    await execute(`UPDATE deposits SET status = ? WHERE id = ?`, [status, id]);
    return NextResponse.json({ message: `Deposit ${operation} successful` });
  } catch {
    return NextResponse.json({ message: 'Action failed' }, { status: 500 });
  }
}
