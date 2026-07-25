import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const result = db.exec(`SELECT * FROM users WHERE id = ?`, { bind: [payload.userId] });
    if (!result.length || !result[0].values.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const cols = result[0].columns;
    const vals = result[0].values[0];
    const user: any = {};
    cols.forEach((col: string, i: number) => { user[col] = vals[i]; });
    delete user.password;

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
  }
}
