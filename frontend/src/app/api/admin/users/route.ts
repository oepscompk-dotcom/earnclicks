import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const search = req.nextUrl.searchParams.get('search');
    let sql = `SELECT u.*, p.country, p.city, p.level, p.xp_points FROM users u LEFT JOIN profiles p ON u.id = p.user_id`;
    const params: any[] = [];
    if (search) { sql += ` WHERE u.name LIKE ? OR u.email LIKE ?`; params.push(`%${search}%`, `%${search}%`); }
    sql += ' ORDER BY u.created_at DESC';
    const data = await query(sql, params);
    data.forEach((item: any) => {
      delete item.password;
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
