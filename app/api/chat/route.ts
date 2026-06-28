import { NextResponse } from 'next/server';
import { generateChatbotResponse } from '@/lib/ai-providers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, cvData, fieldKey } = body;

    if (!prompt || !cvData || !fieldKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await generateChatbotResponse(prompt, cvData, fieldKey);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
