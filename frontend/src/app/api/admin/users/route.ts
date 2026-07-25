import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const search = req.nextUrl.searchParams.get('search');
    let sql = `SELECT u.*, p.country, p.city, p.level, p.xp_points FROM users u LEFT JOIN profiles p ON u.id = p.user_id`;
    if (search) sql += ` WHERE u.name LIKE '%${search.replace(/'/g, "''")}%' OR u.email LIKE '%${search.replace(/'/g, "''")}%'`;
    sql += ' ORDER BY u.created_at DESC';
    const result = db.exec(sql);
    const data: any[] = [];
    if (result.length) {
      const cols = result[0].columns;
      result[0].values.forEach((row: any) => {
        const item: any = {};
        cols.forEach((c: string, i: number) => { item[c] = row[i]; });
        delete item.password;
        data.push(item);
      });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
