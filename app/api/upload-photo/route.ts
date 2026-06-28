import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/api-auth';

export async function POST(request: Request) {
  try {
    const authData = await verifyAuth(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uid = formData.get('uid') as string | null || authData.uid;

    if (!file || !uid) {
      return NextResponse.json(
        { error: 'Missing file or user ID' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const workerUrl = process.env.R2_WORKER_URL;
    const uploadSecret = process.env.R2_UPLOAD_SECRET;

    if (!workerUrl) {
      console.warn('R2_WORKER_URL not configured. Simulating upload with Base64 fallback.');
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const key = `profiles/${uid}-${Date.now()}.${fileExt}`;

    // Upload directly to the Cloudflare Worker expecting PUT
    const response = await fetch(`${workerUrl}/${key}`, {
      method: 'PUT',
      headers: {
        'x-upload-secret': uploadSecret || '',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: await file.arrayBuffer(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Worker upload error:', errorText);
      throw new Error(`Worker returned ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error('Error uploading to R2 via worker:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
