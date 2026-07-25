import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const status = req.nextUrl.searchParams.get('status');
    const search = req.nextUrl.searchParams.get('search');
    let sql = `SELECT k.*, u.name as user_name, u.email as user_email FROM kyc k JOIN users u ON k.user_id = u.id`;
    const clauses: string[] = [];
    if (status) clauses.push(`k.status = '${status.replace(/'/g, "''")}'`);
    if (search) clauses.push(`(u.name LIKE '%${search.replace(/'/g, "''")}%' OR k.country LIKE '%${search.replace(/'/g, "''")}%')`);
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    sql += ' ORDER BY k.created_at DESC';
    const result = db.exec(sql);
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
