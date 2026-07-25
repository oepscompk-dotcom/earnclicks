import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';
import { signToken, verifyPassword } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 422 });
    }

    const result = db.exec(`SELECT * FROM users WHERE email = ?`, { bind: [email.toLowerCase()] });
    if (!result.length || !result[0].values.length) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const cols = result[0].columns;
    const vals = result[0].values[0];
    const user: any = {};
    cols.forEach((col: string, i: number) => { user[col] = vals[i]; });

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ message: 'Account is suspended or banned' }, { status: 403 });
    }

    delete user.password;

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ message: 'Login successful', user, token });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 });
  }
}
