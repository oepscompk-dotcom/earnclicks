import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, query, execute } from '@/lib/db/init';

export async function GET() {
  try {
    await initDatabase();
    
    // Test 1: Check users table exists
    const tableCheck = await query(`SELECT 1 FROM users LIMIT 1`);
    
    // Test 2: Try INSERT
    const insertResult = await execute(
      `INSERT INTO users ("name", "email", "password", "role", "referral_code", "referred_by", "status", "created_at", "updated_at") 
       VALUES (?, ?, ?, 'user', ?, null, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING "id"`,
      ['Test User', 'test-insert@earnclicks.app', 'hashedpassword', 'REF123']
    );
    
    // Test 3: Verify SELECT
    const selectResult = await query(`SELECT * FROM users WHERE email = ?`, ['test-insert@earnclicks.app']);
    
    return NextResponse.json({
      status: 'ok',
      tableCheck: tableCheck.length,
      insertResult,
      selectResult,
      message: 'All tests passed'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    }, { status: 500 });
  }
}