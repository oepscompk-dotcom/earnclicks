import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const data = await query(`SELECT * FROM notifications WHERE target_role = 'admin' OR target_role IS NULL ORDER BY created_at DESC LIMIT 50`);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
