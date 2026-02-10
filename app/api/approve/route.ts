import { NextRequest, NextResponse } from 'next/server';
import { updateApprovalStatus } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    await updateApprovalStatus(token, ip);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}
