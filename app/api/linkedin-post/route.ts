import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvData, context } = body;

    if (!cvData) {
      return NextResponse.json({ error: 'Missing cvData' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    // Sanitize cvData to avoid context length exceeded errors (remove large base64 images, etc.)
    const sanitizedCvData = { ...cvData };
    delete sanitizedCvData.photoBase64;
    
    const prompt = `Agis comme un expert en personal branding sur LinkedIn. 
Génère un post LinkedIn professionnel et percutant pour partager le CV de cette personne. 
Voici les données de son CV: ${JSON.stringify(sanitizedCvData)}
${context ? `Contexte supplémentaire ou demande spécifique: ${context}` : ''}

Consignes:
- Utilise des émojis de manière appropriée sans en abuser.
- Le ton doit être enthousiaste et professionnel.
- Mets en valeur les compétences principales et l'expérience clé.
- Ajoute des hashtags pertinents à la fin.
- Ne réponds QUE par le texte du post, rien d'autre.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ postText: data.choices[0].message.content });

  } catch (error: any) {
    console.error('API /api/linkedin-post error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
