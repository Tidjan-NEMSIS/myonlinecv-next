import { NextResponse } from 'next/server';
import { extractCvFromImage } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { base64, mimeType } = body;

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const extractedData = await extractCvFromImage(base64, mimeType);
    return NextResponse.json({ extractedData });

  } catch (error: any) {
    console.error('API /api/cv-extract error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
