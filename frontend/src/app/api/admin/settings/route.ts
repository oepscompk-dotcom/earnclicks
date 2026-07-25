import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const result = await query(`SELECT key, value, group_name FROM settings`);
    const settings: Record<string, any> = {};
    result.forEach((row: any) => {
      const group = row.group_name || 'general';
      if (!settings[group]) settings[group] = {};
      settings[group][row.key] = row.value;
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { section, ...fields } = body;
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        const existing = await query(`SELECT id FROM settings WHERE key = ?`, [key]);
        if (existing.length > 0) {
          await execute(`UPDATE settings SET value = ? WHERE key = ?`, [value, key]);
        } else {
          await execute(`INSERT INTO settings (key, value, group_name) VALUES (?, ?, ?)`, [key, value, section || 'general']);
        }
      }
    }
    return NextResponse.json({ message: 'Settings saved' });
  } catch {
    return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 });
  }
}
