import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CvData } from './types';

// In Next.js, env variables without NEXT_PUBLIC_ prefix are accessible only on the server
export const ENV_GROQ_API_KEY = process.env.GROQ_API_KEY || '';
export const ENV_GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const ENV_REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || '';

export interface AiConfig {
  provider?: 'groq' | 'gemini';
  groqModel?: string;
  geminiModel?: string;
  groqKeys?: string[];
  geminiKeys?: string[];
  removeBgKeys?: string[];
}

/**
 * Récupère la configuration IA depuis Firestore
 */
export async function getAiConfig(): Promise<AiConfig> {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      const config: AiConfig = { ...data };
      
      // Migration from old schema (singular keys) to new schema (plural arrays)
      if (!config.removeBgKeys && data.removeBgKey) {
        config.removeBgKeys = [data.removeBgKey];
      }
      if (!config.geminiKeys && data.geminiKey) {
        config.geminiKeys = [data.geminiKey];
      }
      if (!config.groqKeys && data.groqKey) {
        config.groqKeys = [data.groqKey];
      }
      return config;
    }
    return {};
  } catch (e) {
    console.error('Error fetching AI config from Firestore', e);
    return {};
  }
}

/**
 * Exécute un appel API en essayant séquentiellement plusieurs clés.
 * Si une clé échoue (ex: Quota 429), la fonction passe à la suivante.
 */
export async function withKeyRotation<T>(
  keys: string[] | undefined,
  fallbackEnvKey: string,
  apiCall: (key: string) => Promise<T>
): Promise<T> {
  // Construire la liste complète des clés uniques non vides
  const allKeys = [...(keys || [])].filter(k => k.trim() !== '');
  if (fallbackEnvKey && fallbackEnvKey.trim() !== '' && !allKeys.includes(fallbackEnvKey)) {
    allKeys.push(fallbackEnvKey);
  }

  if (allKeys.length === 0) {
    throw new Error('Aucune clé API configurée pour ce service.');
  }

  let lastError: any;
  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    try {
      return await apiCall(key);
    } catch (error: any) {
      lastError = error;
      const maskedKey = key.substring(0, 5) + '...';
      console.warn(`[KeyRotation] L'appel a échoué avec la clé ${maskedKey} (${i + 1}/${allKeys.length}). Erreur: ${error.message}`);
      // On continue vers la clé suivante
    }
  }
  throw lastError;
}

// ---------------------------------------------------------------------------
// Fonctions héritées (utilisées par /api/chat et /api/translate)
// ---------------------------------------------------------------------------

export async function generateChatbotResponse(prompt: string, cvData: CvData, fieldKey: string) {
  const config = await getAiConfig();
  const systemPrompt = `Tu es Axel, un assistant IA conçu pour aider l'utilisateur à remplir son CV.
Les données actuelles du CV sont : ${JSON.stringify(cvData)}
Le champ que tu dois aider à remplir est : ${fieldKey}.
Ton rôle est de poser des questions ou de formuler des suggestions directement.
Réponds de manière concise, professionnelle, mais chaleureuse.`;

  return withKeyRotation(config.groqKeys, ENV_GROQ_API_KEY, async (key) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.groqModel || 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText} - ${await response.text()}`);
    }

    const data = await response.json();
    return { value: data.choices[0].message.content };
  });
}

export async function translateCv(cvDataPayload: CvData, targetLanguage: string) {
  const config = await getAiConfig();
  const prompt = `Voici un objet JSON représentant un CV :
${JSON.stringify(cvDataPayload)}

Traduisez TOUTES les valeurs de texte (titres, descriptions, niveaux de langue, etc.) vers la langue dont le code est "${targetLanguage}".
Ne modifiez aucune des clés (keys) de l'objet JSON. Renvoie UNIQUEMENT le JSON traduit, aucun autre texte.`;

  return withKeyRotation(config.groqKeys, ENV_GROQ_API_KEY, async (key) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.groqModel || 'llama3-70b-8192',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.2, // Low temperature for consistent JSON output
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText} - ${await response.text()}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  });
}

// Function placeholder for Gemini Vision extraction
export async function extractCvFromImage(base64Image: string, mimeType: string) {
  throw new Error("Utilisez /api/ai/parse-cv directement pour bénéficier du multimodèle complet.");
}
