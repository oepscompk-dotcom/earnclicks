import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT key, value FROM settings`);
    const settings: Record<string, string> = {};
    if (result.length) {
      result[0].values.forEach((row: any) => {
        settings[row[0] as string] = row[1] as string;
      });
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const strValue = String(value);
      const existing = db.exec(`SELECT id FROM settings WHERE key = '${key.replace(/'/g, "''")}'`);
      if (existing.length && existing[0].values.length > 0) {
        db.run(`UPDATE settings SET value = '${strValue.replace(/'/g, "''")}' WHERE key = '${key.replace(/'/g, "''")}'`);
      } else {
        db.run(`INSERT INTO settings (key, value, group_name) VALUES ('${key.replace(/'/g, "''")}', '${strValue.replace(/'/g, "''")}', 'general')`);
      }
    }
    saveDb();
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
