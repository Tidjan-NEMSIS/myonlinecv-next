import { NextResponse } from 'next/server';
import { getAiConfig, withKeyRotation, ENV_GROQ_API_KEY, ENV_GEMINI_API_KEY, AiConfig } from '@/lib/ai-providers';

/**
 * POST /api/ai/chat
 *
 * Modes:
 *  - extract : Takes userText + fieldKey + cvData, returns structured JSON for that field
 *  - suggest : Takes fieldKey + fieldLabel + cvData, returns a suggested answer string
 *  - chat    : Free-form Axel conversation (fallback)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, userText, fieldKey, fieldLabel, fieldQuestion, cvData, messages } = body;

    const config = await getAiConfig();

    if (mode === 'extract') {
      // ── Extract structured data from user's natural-language answer ──
      if (!userText || !fieldKey) {
        return NextResponse.json({ error: 'Missing userText or fieldKey' }, { status: 400 });
      }
      const result = await extractFieldData(fieldKey, fieldLabel, fieldQuestion, userText, cvData, config);
      return NextResponse.json(result);
    }

    if (mode === 'suggest') {
      // ── Generate an AI suggestion for a given field ──
      if (!fieldKey) {
        return NextResponse.json({ error: 'Missing fieldKey' }, { status: 400 });
      }
      const suggestion = await suggestFieldValue(fieldKey, fieldLabel, fieldQuestion, cvData, config);
      return NextResponse.json({ suggestion });
    }

    // ── Default: free-form chat ──
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing messages array' }, { status: 400 });
    }

    const systemPrompt = `Tu es Axel, un assistant IA spécialisé dans la rédaction de CV de haute qualité.
Tu aides l'utilisateur à améliorer son CV section par section. Sois concis, professionnel et encourageant.
Voici les données actuelles de son CV : ${JSON.stringify(cvData || {})}`;

    const reply = await callLlm(
      [{ role: 'system', content: systemPrompt }, ...messages],
      0.7,
      false,
      config
    );

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════
// EXTRACTION — structured JSON from user text
// ═══════════════════════════════════════════

async function extractFieldData(
  fieldKey: string,
  fieldLabel: string,
  fieldQuestion: string,
  userText: string,
  cvData: any,
  config: AiConfig
) {
  const prompts: Record<string, string> = {
    'personal.fullname': personal('nom complet'),
    'personal.title': personal('titre professionnel'),
    'personal.subtitle': personal('sous-titre'),
    'personal.location': personal('localisation'),
    'personal.phone': personal('numéro de téléphone'),
    'personal.email': personal('adresse email'),
    profile: `L'utilisateur décrit son profil professionnel en langage naturel. Sa réponse: "${userText}".
Reformule-le en un profil professionnel formel et percutant pour un CV (2-4 phrases, ton professionnel).
Renvoie UNIQUEMENT un JSON: {"value": "le texte du profil reformulé"}.`,
    expertise: tagsPrompt('domaines d\'expertise'),
    bailleurs: tagsPrompt('bailleurs/références'),
    experiences: `L'utilisateur décrit une expérience professionnelle. Sa réponse: "${userText}".
Extrais les informations et renvoie UNIQUEMENT un JSON:
{
  "date": "Période (ex: 2020 - 2023)",
  "location": "Lieu/Ville",
  "role": "Titre du poste",
  "org": "Entreprise ou Organisation",
  "tasks": ["Tâche 1", "Tâche 2", "Tâche 3"]
}
Si une info est manquante, mets une chaîne vide. Essaie de déterminer les tâches à partir de la description.`,
    education: `L'utilisateur décrit une formation/diplôme. Sa réponse: "${userText}".
Extrais les informations et renvoie UNIQUEMENT un JSON:
{
  "degree": "Nom du diplôme",
  "school": "École ou Université",
  "details": "Détails ou mention éventuelle"
}
Si une info est manquante, mets une chaîne vide.`,
    itSkills: `L'utilisateur liste ses compétences informatiques. Sa réponse: "${userText}".
Extrais chaque compétence et évalue un niveau de maîtrise (0-100).
Renvoie UNIQUEMENT un JSON: {"skills": [{"name": "Excel", "level": 85}, {"name": "Word", "level": 80}]}.
Base le niveau sur des heuristiques standard (outils bureautiques courants: 70-85, programmation: 60-90 selon la complexité).`,
    languages: `L'utilisateur liste les langues qu'il parle. Sa réponse: "${userText}".
Extrais chaque langue avec son niveau textuel et un score (0-100).
Renvoie UNIQUEMENT un JSON: {"languages": [{"name": "Français", "label": "Maternel", "level": 100}, {"name": "Anglais", "label": "Courant", "level": 85}]}.
Barème: Maternel=100, Bilingue=95, Courant=85, Avancé=75, Intermédiaire=60, Débutant=30, Notions=20.`
  };

  function personal(label: string) {
    return `L'utilisateur répond à la question: "${label}". Sa réponse brute: "${userText}".
Extrais la donnée pertinente pour un CV. Si l'utilisateur te demande de formuler, de corriger ou si la phrase est familière, reformule-la de manière très professionnelle, concise et percutante.
Renvoie UNIQUEMENT un JSON: {"value": "la valeur finale extraite ou reformulée"}.
Par exemple si on demande le sous-titre et qu'il répond "je suis caissier (formule bien stp)", renvoie {"value": "Expert(e) en Gestion de Caisse"}.
Si la réponse est directe et correcte (ex: "Jean Dupont"), renvoie-la telle quelle.`;
  }

  function tagsPrompt(label: string) {
    return `L'utilisateur liste ses ${label}.
Sa réponse: "${userText}".
Extrais les éléments individuels et renvoie UNIQUEMENT un JSON: {"items": ["élément 1", "élément 2", ...]}.
Nettoie les doublons et formate proprement chaque élément.`;
  }

  const prompt = prompts[fieldKey];
  if (!prompt) {
    // Fallback: simple value extraction
    return { value: userText };
  }

  const validationRule = `ANALYSE PRÉALABLE: Si la réponse de l'utilisateur est absurde ou totalement hors sujet par rapport au champ attendu ("${fieldLabel}"), renvoie UNIQUEMENT ce JSON: {"invalid": true, "suggestion": "Message amical expliquant pourquoi c'est incorrect et demandant de réessayer."}\nDans le cas contraire, extrais les données selon les règles suivantes:`;

  const fullPrompt = validationRule + '\n\n' + prompt + '\n\nRenvoie UNIQUEMENT le JSON valide, sans balises markdown, sans texte avant/après.';

  const messages = [
    { role: 'system' as const, content: 'Tu es un assistant d\'extraction de données pour CV. Réponds UNIQUEMENT en JSON valide, sans balises markdown.' },
    { role: 'user' as const, content: fullPrompt }
  ];

  const raw = await callLlm(messages, 0.1, true, config);

  try {
    return JSON.parse(cleanJson(raw));
  } catch {
    return { value: userText };
  }
}

// ═══════════════════════════════════════════
// SUGGEST — generate a field suggestion
// ═══════════════════════════════════════════

async function suggestFieldValue(
  fieldKey: string,
  fieldLabel: string,
  fieldQuestion: string,
  cvData: any,
  config: AiConfig
) {
  const prompt = `L'utilisateur est en train de créer son CV. Voici ses données actuelles :
${JSON.stringify(cvData, null, 2)}

L'utilisateur a besoin d'une suggestion pour le champ : "${fieldLabel}".
La question posée était : "${fieldQuestion}".

Génère une réponse courte, naturelle et pertinente que l'utilisateur pourrait utiliser. Formule-la comme si l'utilisateur parlait (à la première personne). Ne dis rien d'autre que la suggestion.`;

  const messages = [
    { role: 'system' as const, content: 'Tu es un assistant de rédaction de CV. Fournis des suggestions concises et professionnelles.' },
    { role: 'user' as const, content: prompt }
  ];

  return await callLlm(messages, 0.7, false, config);
}

// ═══════════════════════════════════════════
// LLM CALLER — Groq primary, Gemini fallback
// ═══════════════════════════════════════════

async function callLlm(
  messages: { role: string; content: string }[],
  temperature: number,
  jsonMode: boolean,
  config: AiConfig
): Promise<string> {
  const provider = config.provider || 'groq';

  try {
    if (provider === 'gemini') {
      return await callGeminiWithRotation(messages, temperature, config);
    } else {
      return await callGroqWithRotation(messages, temperature, jsonMode, config);
    }
  } catch (primaryError: any) {
    console.warn(`Primary provider ${provider} failed, trying fallback...`, primaryError.message);
    if (provider === 'gemini') {
      return await callGroqWithRotation(messages, temperature, jsonMode, config);
    } else {
      return await callGeminiWithRotation(messages, temperature, config);
    }
  }
}

async function callGroqWithRotation(
  messages: { role: string; content: string }[],
  temperature: number,
  jsonMode: boolean,
  config: AiConfig
): Promise<string> {
  const model = config.groqModel || 'gpt-oss-20b';
  return withKeyRotation(config.groqKeys, ENV_GROQ_API_KEY, async (key) => {
    const bodyObj: any = {
      model,
      messages,
      temperature,
    };
    if (jsonMode) {
      bodyObj.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj)
    });

    if (!response.ok) throw new Error(`Groq HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  });
}

async function callGeminiWithRotation(
  messages: { role: string; content: string }[],
  temperature: number,
  config: AiConfig
): Promise<string> {
  const model = config.geminiModel || 'gemini-2.5-flash';
  return withKeyRotation(config.geminiKeys, ENV_GEMINI_API_KEY, async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    // Convert messages to Gemini format
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    // Prepend system instructions as a user/model pair
    const systemMsg = messages.find(m => m.role === 'system');
    if (systemMsg) {
      contents.unshift(
        { role: 'user', parts: [{ text: systemMsg.content }] },
        { role: 'model', parts: [{ text: 'Compris.' }] }
      );
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature } })
    });

    if (!response.ok) throw new Error(`Gemini HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  });
}

// ═══════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════

function cleanJson(raw: string): string {
  return raw.replace(/```json/g, '').replace(/```/g, '').trim();
}
