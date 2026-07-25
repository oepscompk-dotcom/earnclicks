import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT * FROM notifications WHERE target_role = 'admin' OR target_role IS NULL ORDER BY created_at DESC LIMIT 50`);
    const data: any[] = [];
    if (result.length) {
      const cols = result[0].columns;
      result[0].values.forEach((row: any) => {
        const item: any = {};
        cols.forEach((c: string, i: number) => { item[c] = row[i]; });
        data.push(item);
      });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
