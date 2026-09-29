import { NextResponse } from 'next/server';
import { getSentEmailLogs } from '@/lib/db';

export async function GET() {
  const logs = getSentEmailLogs();
  return NextResponse.json({ success: true, logs });
}
