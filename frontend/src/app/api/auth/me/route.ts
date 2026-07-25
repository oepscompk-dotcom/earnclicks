import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function GET(req: NextRequest) {
  try {
    await initDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const users = await query(`SELECT * FROM users WHERE id = ?`, [payload.userId]);
    if (!users.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user: any = users[0];
    delete user.password;

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
  }
}
