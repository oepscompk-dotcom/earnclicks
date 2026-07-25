import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';
import { signToken, hashPassword, generateReferralCode } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();

    const { name, email, password, role = 'user', referral_code } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 422 });
    }

    const existing = await query(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase()]);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 422 });
    }

    const refCode = generateReferralCode();
    const hashed = hashPassword(password);

    await execute(
      `INSERT INTO users (name, email, password, role, referral_code, referred_by) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase(), hashed, role, refCode, null]
    );

    const userRow = await query(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase()]);
    if (!userRow.length) {
      return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
    }

    const user: any = userRow[0];

    await execute(`INSERT INTO wallets (user_id, type, balance, currency) VALUES (?, 'main', 0, 'USDT')`, [user.id]);
    await execute(`INSERT INTO profiles (user_id) VALUES (?)`, [user.id]);

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
