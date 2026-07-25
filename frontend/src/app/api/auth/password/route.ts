import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth-jwt';

export async function PUT(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const userResult = db.exec(`SELECT password FROM users WHERE id = ${payload.userId}`);
    if (!userResult.length || !userResult[0].values.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const currentHash = userResult[0].values[0][0] as string;
    const valid = await verifyPassword(body.current_password || '', currentHash);
    if (!valid) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }
    const newHash = await hashPassword(body.new_password || '');
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [newHash, payload.userId]);
    saveDb();
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update password' }, { status: 500 });
  }
}
