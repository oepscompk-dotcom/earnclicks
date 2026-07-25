import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    db.run(`INSERT INTO support_tickets (user_id, subject, message, status, created_at) VALUES (?, ?, ?, 'open', datetime('now'))`, [
      payload.userId, body.subject || 'No Subject', body.message || ''
    ]);
    saveDb();
    return NextResponse.json({ message: 'Support ticket created' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create ticket' }, { status: 500 });
  }
}
