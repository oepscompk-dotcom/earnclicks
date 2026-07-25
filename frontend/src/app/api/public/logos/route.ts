import { NextResponse } from 'next/server';
import { initDatabase, query } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const result = await query(`SELECT key, value FROM settings`);
    const settings: Record<string, string> = {};
    result.forEach((row: any) => { settings[row.key] = row.value; });

    return NextResponse.json({
      logos: {
        header_logo: null,
        footer_logo: null,
        favicon: null,
        site_name: settings.site_name || 'EarnClicks',
        site_tagline: settings.site_tagline || '',
      },
    });
  } catch {
    return NextResponse.json({ logos: { site_name: 'EarnClicks', site_tagline: '' } });
  }
}
