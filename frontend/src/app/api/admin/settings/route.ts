import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT key, value, group_name FROM settings`);
    const settings: Record<string, any> = {};
    if (result.length) {
      result[0].values.forEach((row: any) => {
        const group = row[2] || 'general';
        if (!settings[group]) settings[group] = {};
        settings[group][row[0] as string] = row[1];
      });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const body = await req.json();
    const { section, ...fields } = body;
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        const existing = db.exec(`SELECT id FROM settings WHERE key = '${key.replace(/'/g, "''")}'`);
        if (existing.length && existing[0].values.length > 0) {
          db.run(`UPDATE settings SET value = '${(value as string).replace(/'/g, "''")}' WHERE key = '${key.replace(/'/g, "''")}'`);
        } else {
          db.run(`INSERT INTO settings (key, value, group_name) VALUES ('${key.replace(/'/g, "''")}', '${(value as string).replace(/'/g, "''")}', '${(section || 'general').replace(/'/g, "''")}')`);
        }
      }
    }
    const { saveDb } = await import('@/lib/db/init');
    saveDb();
    return NextResponse.json({ message: 'Settings saved' });
  } catch {
    return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 });
  }
}
