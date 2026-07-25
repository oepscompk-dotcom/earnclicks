import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const status = req.nextUrl.searchParams.get('status');
    const search = req.nextUrl.searchParams.get('search');
    let sql = `SELECT k.*, u.name as user_name, u.email as user_email FROM kyc k JOIN users u ON k.user_id = u.id`;
    const clauses: string[] = [];
    const params: any[] = [];
    if (status) { clauses.push(`k.status = ?`); params.push(status); }
    if (search) { clauses.push(`(u.name LIKE ? OR k.country LIKE ?)`); params.push(`%${search}%`, `%${search}%`); }
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    sql += ' ORDER BY k.created_at DESC';
    const data = await query(sql, params);
    data.forEach((item: any) => {
      item.user = { name: item.user_name, email: item.user_email };
      delete item.user_name; delete item.user_email;
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
