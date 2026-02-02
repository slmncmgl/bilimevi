import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Scroll Event:', {
      contractId: body.contractId,
      event: body.event,
      scrollPercentage: body.scrollPercentage,
      timeSpent: body.timeSpent,
      verificationText: body.verificationText,
      timestamp: body.timestamp
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Log error:', error);
    return NextResponse.json(
      { error: 'Log failed' },
      { status: 500 }
    );
  }
}
