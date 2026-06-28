import { NextResponse } from 'next/server';
import { getAiConfig, withKeyRotation, ENV_GROQ_API_KEY, ENV_GEMINI_API_KEY, AiConfig } from '@/lib/ai-providers';

export async function POST(request: Request) {
  try {
    const { base64Data, mimeType, prompt } = await request.json();

    if (!base64Data || !mimeType || !prompt) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Fetch AI config centrally
    const aiConfig = await getAiConfig();

    if (!aiConfig) {
      return NextResponse.json({ error: 'AI config missing in Firestore' }, { status: 500 });
    }

    const provider = aiConfig.provider || 'groq';
    let result = null;

    // 2. Try Provider with fallback
    try {
      if (provider === 'gemini') {
        result = await callGeminiWithRotation(base64Data, mimeType, prompt, aiConfig);
      } else {
        result = await callGroqWithRotation(base64Data, prompt, aiConfig);
      }
    } catch (primaryError: any) {
      console.warn(`Primary provider ${provider} failed, trying fallback...`, primaryError.message);
      // Fallback to the other provider if the primary one completely fails
      if (provider === 'gemini') {
        result = await callGroqWithRotation(base64Data, prompt, aiConfig);
      } else {
        result = await callGeminiWithRotation(base64Data, mimeType, prompt, aiConfig);
      }
    }

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('AI parsing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function callGeminiWithRotation(base64Data: string, mimeType: string, prompt: string, config: AiConfig) {
  const model = config.geminiModel || 'gemini-2.5-flash';
  
  return withKeyRotation(config.geminiKeys, ENV_GEMINI_API_KEY, async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Data } }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      })
    });

    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  });
}

async function callGroqWithRotation(base64Data: string, prompt: string, config: AiConfig) {
  const model = config.groqModel || 'llama-3.2-90b-vision-preview'; // Vision-capable
  
  return withKeyRotation(config.groqKeys, ENV_GROQ_API_KEY, async (key) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/png;base64,${base64Data}` } }
            ]
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  });
}
