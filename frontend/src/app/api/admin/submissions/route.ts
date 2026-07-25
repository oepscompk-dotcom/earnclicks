import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const data = await query(`SELECT s.*, u.name as user_name, u.email as user_email, t.title as task_title FROM task_submissions s JOIN users u ON s.user_id = u.id JOIN tasks t ON s.task_id = t.id ORDER BY s.created_at DESC`);
    data.forEach((item: any) => {
      item.user = { name: item.user_name, email: item.user_email };
      delete item.user_name; delete item.user_email;
    });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
