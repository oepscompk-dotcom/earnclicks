import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_balance: 0,
    main: 0,
    bonus: 0,
    pending: 0,
    total_deposited: 0,
    total_withdrawn: 0,
  });
}
