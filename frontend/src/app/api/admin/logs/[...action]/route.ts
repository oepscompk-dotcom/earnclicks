import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string[] }> }) {
  try {
    await initDatabase();
    const { action } = await params;
    if (action[0] === 'clear') {
      await execute(`DELETE FROM activity_logs`);
      return NextResponse.json({ message: 'Logs cleared' });
    }
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ message: 'Action failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ action: string[] }> }) {
  try {
    await initDatabase();
    const { action } = await params;
    await execute(`DELETE FROM activity_logs WHERE id = ?`, [action[0]]);
    return NextResponse.json({ message: 'Log deleted' });
  } catch {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
