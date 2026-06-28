import { adminAuth } from '@/lib/firebase-admin';

/**
 * Extrait et vérifie le token d'authentification Firebase de la requête.
 * @param req La requête (NextRequest ou Request)
 * @returns {uid} L'ID de l'utilisateur authentifié.
 * @throws Error si le token est manquant ou invalide.
 */
export async function verifyAuth(req: Request): Promise<{ uid: string }> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid Authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    console.error('Erreur lors de la vérification du token Firebase:', error);
    throw new Error('Unauthorized: Invalid token');
  }
}
