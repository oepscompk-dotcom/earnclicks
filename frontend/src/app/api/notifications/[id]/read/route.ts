import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, execute } from '@/lib/db/init';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDatabase();
    const { id } = await params;
    await execute(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch {
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}
