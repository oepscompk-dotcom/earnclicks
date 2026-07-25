import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';
import { verifyToken } from '@/lib/auth-jwt';

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(authHeader.slice(7));
    if (!payload || payload.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

    const validTypes = ['header_logo', 'footer_logo', 'favicon', 'banner'];
    if (!validTypes.includes(type)) return NextResponse.json({ message: 'Invalid logo type' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    await execute(
      `INSERT INTO settings (key, value, group_name) VALUES (?, ?, 'logos')
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [type, dataUrl]
    );

    return NextResponse.json({ url: dataUrl, message: 'Upload successful' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Upload failed' }, { status: 500 });
  }
}