import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db/init';

export async function GET() {
  try {
    const db = await initDatabase();
    return NextResponse.json({ status: 'ok', neonConnected: !!db, message: 'Neon connected successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message, stack: error.stack }, { status: 500 });
  }
}
