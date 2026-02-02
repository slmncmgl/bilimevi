import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Basit contract ID oluştur
    const contractId = `contract-${Date.now()}`;

    // Dosyayı memory'de tut (production'da Google Drive'a yüklersiniz)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Global store (basit test için)
    if (typeof global !== 'undefined') {
      (global as any).contracts = (global as any).contracts || {};
      (global as any).contracts[contractId] = {
        fileName: file.name,
        fileData: buffer.toString('base64'),
        contentType: file.type,
        createdAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      contractId,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
