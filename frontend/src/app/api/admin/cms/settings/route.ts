import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const result = await query(`SELECT key, value FROM settings`);
    const settings: Record<string, string> = {};
    result.forEach((row: any) => {
      settings[row.key] = row.value;
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const strValue = String(value);
      const existing = await query(`SELECT id FROM settings WHERE key = ?`, [key]);
      if (existing.length > 0) {
        await execute(`UPDATE settings SET value = ? WHERE key = ?`, [strValue, key]);
      } else {
        await execute(`INSERT INTO settings (key, value, group_name) VALUES (?, ?, 'general')`, [key, strValue]);
      }
    }
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
