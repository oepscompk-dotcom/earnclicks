import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { signToken, hashPassword, generateReferralCode } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const body = await req.json();

    const { name, email, password, role = 'user', referral_code } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 422 });
    }

    const existing = db.exec(`SELECT id FROM users WHERE email = ?`, { bind: [email.toLowerCase()] });
    if (existing.length > 0 && existing[0].values.length > 0) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 422 });
    }

    const refCode = generateReferralCode();
    const hashed = hashPassword(password);

    db.run(
      `INSERT INTO users (name, email, password, role, referral_code, referred_by) VALUES (?, ?, ?, ?, ?, ?)`,
      { bind: [name, email.toLowerCase(), hashed, role, refCode, null] }
    );
    saveDb();

    const userRow = db.exec(`SELECT * FROM users WHERE email = ?`, { bind: [email.toLowerCase()] });
    if (!userRow.length) {
      return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
    }

    const cols = userRow[0].columns;
    const vals = userRow[0].values[0];
    const user: any = {};
    cols.forEach((col: string, i: number) => { user[col] = vals[i]; });

    db.run(`INSERT INTO wallets (user_id, type, balance, currency) VALUES (?, 'main', 0, 'USDT')`, { bind: [user.id] });
    db.run(`INSERT INTO profiles (user_id) VALUES (?)`, { bind: [user.id] });
    saveDb();

    delete user.password;

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      message: 'Registration successful',
      user,
      token,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 500 });
  }
}
