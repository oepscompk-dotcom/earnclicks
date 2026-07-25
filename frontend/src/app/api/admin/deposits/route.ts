import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const data = await query(`SELECT d.*, u.name as user_name, u.email as user_email FROM deposits d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC`);
    data.forEach((item: any) => {
      item.user = { name: item.user_name, email: item.user_email };
      delete item.user_name; delete item.user_email;
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
