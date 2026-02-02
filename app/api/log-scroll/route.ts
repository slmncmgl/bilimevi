import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Şimdilik console'a yaz (production'da Google Sheets'e yazacak)
    console.log('📊 Scroll Event:', {
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
```

**Commit changes**

---

## ✅ Tamamlandı!

Şimdi Vercel otomatik deploy yapacak. **2-3 dakika** bekleyin.

Sonra şu URL'ye gidin:
```
https://sozlesme-test-xxx.vercel.app
