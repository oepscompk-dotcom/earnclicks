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
    if (action[0] === 'read-all') {
      db.run(`UPDATE notifications SET is_read = 1 WHERE target_role = 'admin'`);
      saveDb();
      return NextResponse.json({ message: 'All notifications marked as read' });
    }
    db.run(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [action[0]]);
    saveDb();
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch {
    return NextResponse.json({ message: 'Action failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ action: string[] }> }) {
  try {
    await initDatabase();
    const db = getDb();
    const { action } = await params;
    db.run(`DELETE FROM notifications WHERE id = ?`, [action[0]]);
    saveDb();
    return NextResponse.json({ message: 'Notification deleted' });
  } catch {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
