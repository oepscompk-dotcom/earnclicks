import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    const db = getDb();
    const { id } = await params;
    db.run(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
    saveDb();
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}
