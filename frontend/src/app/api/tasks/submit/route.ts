import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await execute(`INSERT INTO task_submissions (user_id, task_id, proof_text, proof_url, status, created_at)
      VALUES (?, ?, ?, ?, 'pending', datetime('now'))`, [
      payload.userId, body.task_id, body.proof_text || '', body.proof_url || ''
    ]);
    return NextResponse.json({ message: 'Task submitted for review' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Submission failed' }, { status: 500 });
  }
}
