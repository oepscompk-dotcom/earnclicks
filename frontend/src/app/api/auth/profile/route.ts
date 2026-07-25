import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb, saveDb } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function PUT(req: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (body.name || body.phone || body.city || body.state || body.country || body.address || body.avatar) {
      const sets: string[] = [];
      const vals: any[] = [];
      if (body.name) { sets.push('name = ?'); vals.push(body.name); }
      if (body.phone) { sets.push('phone = ?'); vals.push(body.phone); }
      if (body.city) { sets.push('city = ?'); vals.push(body.city); }
      if (body.state) { sets.push('state = ?'); vals.push(body.state); }
      if (body.country) { sets.push('country = ?'); vals.push(body.country); }
      if (body.address) { sets.push('address = ?'); vals.push(body.address); }
      if (body.avatar) { sets.push('avatar = ?'); vals.push(body.avatar); }
      vals.push(payload.userId);
      db.run(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals);
      saveDb();
    }

    if (body.bio || body.gender || body.dob || body.language || body.timezone) {
      const sets: string[] = [];
      const vals: any[] = [];
      if (body.bio) { sets.push('bio = ?'); vals.push(body.bio); }
      if (body.gender) { sets.push('gender = ?'); vals.push(body.gender); }
      if (body.dob) { sets.push('dob = ?'); vals.push(body.dob); }
      if (body.language) { sets.push('language = ?'); vals.push(body.language); }
      if (body.timezone) { sets.push('timezone = ?'); vals.push(body.timezone); }
      vals.push(payload.userId);
      db.run(`UPDATE profiles SET ${sets.join(', ')} WHERE user_id = ?`, vals);
      saveDb();
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
