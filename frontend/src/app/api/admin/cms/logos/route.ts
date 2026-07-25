import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    const db = getDb();
    const result = db.exec(`SELECT key, value FROM settings`);
    const settings: Record<string, string> = {};
    if (result.length) {
      result[0].values.forEach((row: any) => {
        settings[row[0] as string] = row[1] as string;
      });
    }

    return NextResponse.json({
      logos: {
        header_logo: null,
        header_logo_type: null,
        footer_logo: null,
        favicon: null,
        favicon_type: null,
        site_name: settings.site_name || 'EarnClicks',
        site_tagline: settings.site_tagline || '',
      },
    });
  } catch {
    return NextResponse.json({ logos: { site_name: 'EarnClicks', site_tagline: '' } });
  }
}
