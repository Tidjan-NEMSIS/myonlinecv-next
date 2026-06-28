import { NextResponse } from 'next/server';
import { getAiConfig, withKeyRotation, ENV_REMOVE_BG_API_KEY } from '@/lib/ai-providers';
import { verifyAuth } from '@/lib/api-auth';

export async function POST(req: Request) {
  try {
    // Authenticate request
    await verifyAuth(req);

    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 });
    }

    const config = await getAiConfig();

    const isUrl = imageBase64.startsWith('http://') || imageBase64.startsWith('https://');
    const requestBody: any = { size: 'auto' };

    if (isUrl) {
      requestBody.image_url = imageBase64;
    } else {
      requestBody.image_file_b64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    }

    const resultBase64 = await withKeyRotation(config.removeBgKeys, ENV_REMOVE_BG_API_KEY, async (key) => {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': key,
          'Content-Type': 'application/json',
          'Accept': 'image/png'
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Remove.bg error: ${response.statusText} - ${errText}`);
      }

      const resultBuffer = await response.arrayBuffer();
      return `data:image/png;base64,${Buffer.from(resultBuffer).toString('base64')}`;
    });

    return NextResponse.json({ resultBase64 });

  } catch (error: any) {
    console.error('API /api/remove-bg error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
