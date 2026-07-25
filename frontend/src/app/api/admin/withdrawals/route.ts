import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT w.*, u.name as user_name, u.email as user_email FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC`);
    const data: any[] = [];
    if (result.length) {
      const cols = result[0].columns;
      result[0].values.forEach((row: any) => {
        const item: any = {};
        cols.forEach((c: string, i: number) => { item[c] = row[i]; });
        item.user = { name: item.user_name, email: item.user_email };
        delete item.user_name; delete item.user_email;
        data.push(item);
      });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
