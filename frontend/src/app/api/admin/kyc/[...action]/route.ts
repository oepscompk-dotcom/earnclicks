import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string[] }> }) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { action } = await params;
    const [id, operation] = action;
    if (operation === 'approve') {
      db.run(`UPDATE kyc SET status = 'verified' WHERE id = ?`, [id]);
    } else if (operation === 'reject') {
      db.run(`UPDATE kyc SET status = 'rejected' WHERE id = ?`, [id]);
    } else if (operation === 'request-update') {
      db.run(`UPDATE kyc SET status = 'pending' WHERE id = ?`, [id]);
    }
    saveDb();
    return NextResponse.json({ message: `KYC ${operation} successful` });
  } catch {
    return NextResponse.json({ message: 'Action failed' }, { status: 500 });
  }
}
