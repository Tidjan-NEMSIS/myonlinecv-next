import { NextResponse } from 'next/server';
import { translateCv } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvDataPayload, targetLanguage } = body;

    if (!cvDataPayload || !targetLanguage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const translatedData = await translateCv(cvDataPayload, targetLanguage);
    return NextResponse.json({ translatedData });

  } catch (error: any) {
    console.error('API /api/translate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
