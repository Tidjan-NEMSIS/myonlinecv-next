# Migration MyOnlineCV → Next.js 15 (App Router + TypeScript)

## Contexte

Le projet actuel **MyOnlineCV (SamaCv)** est une application web serverless en HTML/CSS/JS vanilla hébergée sur Firebase Hosting. Elle utilise Firestore, Firebase Auth, Cloudflare R2 pour les photos, et des API IA (Groq/Gemini) côté client. Le but est de migrer vers **Next.js 15** avec **App Router** et **TypeScript** dans un nouveau dossier `c:\Users\ETUDE\CV\MyOnlineCV-next`, sans toucher au projet existant.

---

## Analyse du projet existant

### Pages identifiées (6 pages HTML)

| Page | Fichier HTML | JS associé | CSS | Rôle |
|---|---|---|---|---|
| Landing | `index.html` | inline `<script>` | `global.css`, `landing.css` | Vitrine marketing |
| Auth | `auth.html` | `auth.js` | `global.css`, `auth.css`, `auth-password.css` | Login / Signup + Google Auth |
| Admin Dashboard | `admin.html` | `admin.js`, `ai-service.js`, `chatbot.js`, `sharing.js`, `theme.js` | `global.css`, `admin.css`, `admin-ai.css` | Édition CV, IA, chatbot, partage |
| CV Public | `cv.html` | `cv.js`, `theme.js` | `global.css`, `cv.css`, `cv-modal.css` | Rendu public du CV par slug |
| Découvrir | `decouvrir.html` | `decouvrir.js` | `global.css`, `decouvrir.css` | Galerie de CVs publics |

### Fonctionnalités identifiées (12)

1. **Auth Firebase** — Email/Password + Google (popup + redirect fallback)
2. **Dashboard Admin** — Sidebar + panels (personal, profile, experiences, education, skills, languages, bailleurs, theme, sharing, translation, superadmin clients)
3. **Édition CV** — Formulaires dynamiques, tags, arrays CRUD
4. **Chatbot IA "Axel"** — Co-remplissage conversationnel avec suggestions IA
5. **Auto-fill IA** — Upload PDF/image → extraction Gemini/Groq Vision
6. **Traduction IA** — CV traduit dynamiquement (6 langues) stocké sous `cvData.translations[code]`
7. **Export HD** — Image PNG via `html2canvas` (scale 2x)
8. **Photo Upload** — Cloudflare R2 via Worker (`samacv-photo-upload.tidjansow12.workers.dev`)
9. **Détourage photo** — API `remove.bg`
10. **QR Code** — Génération via `qr-code-styling` + téléchargement
11. **Partage LinkedIn** — Génération de post IA + partage LinkedIn
12. **Gestion Clients Superadmin** — CRUD clients hors-ligne, édition via `?edit=clientUid`

### Dépendances externes identifiées

| Dépendance | Source actuelle | Migration Next.js |
|---|---|---|
| Firebase SDK v11.8.1 | CDN ESM | `npm: firebase` |
| FontAwesome 6.5 | CDN | `npm: @fortawesome/fontawesome-free` ou CDN |
| html2canvas | CDN (implicite) | `npm: html2canvas` |
| pdf.js 2.16.105 | CDN | `npm: pdfjs-dist` |
| qr-code-styling | CDN (implicite) | `npm: qr-code-styling` |
| Google Analytics | CDN gtag | `npm: @next/third-parties` ou script inline |

### Firebase — Collections Firestore

| Collection | Structure | Accès |
|---|---|---|
| `users/{uid}` | `{ profile, cvData, role? }` | Read: public / Write: owner ou superadmin |
| `slugs/{slug}` | `{ uid, createdAt }` | Read: public / Write: owner ou superadmin |
| `settings/global` | `{ provider, geminiModel, groqModel, geminiKeys[], groqKeys[], removeBgKey }` | Read: authenticated / Write: superadmin |

---

## User Review Required

> [!IMPORTANT]
> **Sécurisation des clés API IA** — Actuellement, les clés Groq et Gemini sont exposées côté client via Firestore (`settings/global`). La migration vers Next.js permet de les déplacer côté serveur via les **API Routes** (`/api/chat`, `/api/translate`, `/api/cv-extract`). Les clés seront dans des **variables d'environnement** `.env.local`. Cela implique que les appels IA passeront par le serveur Next.js au lieu d'être directs depuis le navigateur.

> [!WARNING]
> **Clé Groq hardcodée dans le code source** — La clé `gsk_B7q7YizvDRGfNwpwTH5AWGdyb3FY...` est écrite en dur dans [ai-service.js](file:///c:/Users/ETUDE/CV/SamaCv/js/ai-service.js#L17). Elle sera déplacée dans `.env.local` lors de la migration.

> [!IMPORTANT]
> **Upload photo Cloudflare R2** — Le Worker URL (`samacv-photo-upload.tidjansow12.workers.dev`) et le secret (`samacv-upload-2026-secret`) sont exposés côté client dans [admin.js](file:///c:/Users/ETUDE/CV/SamaCv/js/admin.js#L288-L289). On peut proxifier l'upload via une API Route Next.js pour masquer le secret.

> [!IMPORTANT]
> **Export PDF** — Tu mentionnes vouloir "corriger définitivement le problème de page blanche" pour le PDF. La mémoire du projet indique que l'export PDF a été **retiré** au profit de l'Image HD (`html2canvas`). Souhaites-tu :
> - **(A)** Garder uniquement l'export Image HD (solution actuelle validée) ?
> - **(B)** Rétablir l'export PDF côté serveur (via Puppeteer/Playwright dans une API Route) en plus de l'Image HD ?

---

## Open Questions

> [!IMPORTANT]
> 1. **Hébergement Next.js** — Firebase Hosting supporte les sites statiques. Pour Next.js avec SSR + API Routes, il faudra soit :
>    - **Vercel** (recommandé, déploiement natif Next.js)
>    - **Firebase App Hosting** (support Next.js via Cloud Run)
>    - **Autre** (Cloudflare Pages, etc.)
>    → Quelle plateforme préfères-tu ?
>
> 2. **État management** — Pour la migration, je propose d'utiliser **React Context + hooks personnalisés** (pas de Redux/Zustand) puisque l'état est relativement simple. OK pour toi ?
>
> 3. **Styles** — Souhaites-tu :
>    - **(A)** Migrer fidèlement les CSS existants (CSS Modules) ?
>    - **(B)** Réécrire avec Tailwind CSS v4 pour une meilleure maintenabilité ?
>    - **(C)** Autre (Styled Components, etc.) ?
>
> 4. **Firebase Config exposée** — La config Firebase (apiKey, projectId, etc.) est publique par nature (elle est faite pour être côté client). Les Firestore Rules assurent la sécurité. On garde ce modèle tel quel ? ✅

---

## Proposed Changes

### Phase 1 — Initialisation & Infrastructure

#### [NEW] `c:\Users\ETUDE\CV\MyOnlineCV-next\` (Dossier racine Next.js)

Création du projet via `npx -y create-next-app@latest ./` avec :
- **App Router** (`/app`)
- **TypeScript** activé
- **ESLint** activé
- **src/ directory** : non (structure plate)
- **Import alias** : `@/`

Structure cible :
```
MyOnlineCV-next/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   ├── page.tsx                # Landing page (/)
│   ├── auth/
│   │   └── page.tsx            # Auth page (/auth)
│   ├── admin/
│   │   └── [slug]/
│   │       └── page.tsx        # Admin dashboard (/admin/:slug)
│   ├── cv/
│   │   └── [slug]/
│   │       └── page.tsx        # CV public (/cv/:slug)
│   ├── decouvrir/
│   │   └── page.tsx            # Discover page (/decouvrir)
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts        # Chatbot IA (Axel) — POST
│   │   ├── translate/
│   │   │   └── route.ts        # Traduction IA — POST
│   │   ├── cv-extract/
│   │   │   └── route.ts        # Auto-fill IA (Vision) — POST
│   │   ├── remove-bg/
│   │   │   └── route.ts        # Détourage photo — POST
│   │   ├── upload-photo/
│   │   │   └── route.ts        # Proxy upload Cloudflare R2 — PUT
│   │   └── linkedin-post/
│   │       └── route.ts        # Génération post LinkedIn — POST
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── GoogleAuthButton.tsx
│   ├── admin/
│   │   ├── PersonalPanel.tsx
│   │   ├── ExperiencesPanel.tsx
│   │   ├── EducationPanel.tsx
│   │   ├── SkillsPanel.tsx
│   │   ├── LanguagesPanel.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── SharingPanel.tsx
│   │   ├── TranslationPanel.tsx
│   │   ├── SuperAdminPanel.tsx
│   │   ├── DashboardStats.tsx
│   │   └── AiDropdownMenu.tsx
│   ├── chatbot/
│   │   ├── ChatPanel.tsx
│   │   ├── ChatMessage.tsx
│   │   └── SuggestionButton.tsx
│   ├── cv/
│   │   ├── CvRoot.tsx
│   │   ├── CvBanner.tsx
│   │   ├── CvSidebar.tsx
│   │   ├── CvTimeline.tsx
│   │   ├── CvEducation.tsx
│   │   ├── CvSkillBars.tsx
│   │   ├── CvLanguages.tsx
│   │   ├── CvTags.tsx
│   │   ├── CvExportBar.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── PhotoModal.tsx
│   └── ui/
│       ├── Toast.tsx
│       ├── TagsInput.tsx
│       ├── DynamicList.tsx
│       └── QrCodeDisplay.tsx
├── hooks/
│   ├── useAuth.ts              # Auth state + listener
│   ├── useCvData.ts            # CV data CRUD + Firestore sync
│   ├── useAiChat.ts            # Chatbot interactions via /api/chat
│   ├── useTranslation.ts       # Translation via /api/translate
│   └── useTheme.ts             # Theme state + CSS vars
├── lib/
│   ├── firebase.ts             # Firebase init (client SDK)
│   ├── firebase-admin.ts       # Firebase Admin SDK (server-side)
│   ├── firestore.ts            # Firestore helpers (getDoc, setDoc, etc.)
│   ├── ai-providers.ts         # Server-side AI calls (Groq/Gemini)
│   ├── themes.ts               # Theme definitions (16 thèmes)
│   ├── cv-defaults.ts          # Default CV data structure
│   └── types.ts                # TypeScript interfaces
├── contexts/
│   ├── AuthContext.tsx          # Auth provider
│   └── ToastContext.tsx         # Toast notification provider
├── public/
│   └── assets/
│       └── images/             # Copie des assets existants
├── .env.local                  # Clés API (GROQ, GEMINI, R2, REMOVE_BG)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

### Phase 2 — Firebase & Auth

#### [NEW] `lib/firebase.ts`
- Init Firebase client SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`)
- Export `app`, `auth`, `db`

#### [NEW] `lib/types.ts`
- Interfaces TypeScript : `CvData`, `PersonalInfo`, `Experience`, `Education`, `Skill`, `Language`, `Theme`, `UserProfile`, `SlugDoc`, `AiConfig`

#### [NEW] `contexts/AuthContext.tsx`
- `AuthProvider` wrappant `onAuthStateChanged`
- Export `useAuth()` → `{ user, loading, signIn, signUp, signOut, signInWithGoogle }`
- Gestion du `signInWithPopup` avec fallback `signInWithRedirect`

#### [NEW] `hooks/useAuth.ts`
- Hook consumer du contexte

#### [NEW] `app/auth/page.tsx`
- Migration du formulaire login/signup avec tabs
- Validation slug en temps réel
- Toggle password visibility
- Redirection vers `/admin/{slug}` après login

---

### Phase 3 — Admin Dashboard

#### [NEW] `hooks/useCvData.ts`
- `useCvData(uid)` → `{ cvData, setCvData, saveSection, saveAll, loading }`
- Synchro Firestore avec `getDoc`/`setDoc` (merge)
- Gestion du mode édition superadmin (`?edit=clientUid`)

#### [NEW] `app/admin/[slug]/page.tsx`
- Layout admin : sidebar + topbar + panel switching via state React
- `'use client'` directive (SPA-like pour l'admin)
- Guard auth : redirect si non connecté

#### [NEW] `components/admin/*.tsx` (13 composants)
- Chaque panel = un composant React contrôlé
- Remplacement de `innerHTML` dynamique par du JSX
- State local pour les formulaires, sync via `useCvData`

#### [NEW] `components/chatbot/*.tsx`
- `ChatPanel` : panneau de chat avec messages, input, suggestions
- Communication avec `/api/chat` au lieu d'appels IA directs
- Upload fichier dans le chat via `/api/cv-extract`

---

### Phase 4 — CV Public

#### [NEW] `app/cv/[slug]/page.tsx`
- **Server Component** pour le SEO : fetch Firestore côté serveur pour les `metadata` (title, description)
- **Client Component** enfant pour le rendu interactif (animations, language selector, export)

#### [NEW] `components/cv/*.tsx` (11 composants)
- Rendu fidèle du CV : banner, sidebar, timeline, education grid, skill bars, language dots
- Animations skill bars avec `useEffect`
- Sélecteur de langue (traductions dynamiques)
- Export Image HD via `html2canvas`
- Modal photo plein écran

---

### Phase 5 — API Routes (Sécurisation côté serveur)

#### [NEW] `app/api/chat/route.ts`
```
POST /api/chat
Body: { prompt: string, cvData: object, fieldKey: string }
→ Appel Groq/Gemini côté serveur
→ Response: { value: string } ou { items: [...] } selon le type
```

#### [NEW] `app/api/translate/route.ts`
```
POST /api/translate
Body: { cvDataPayload: object, targetLanguage: string }
→ Appel Groq/Gemini text-only côté serveur
→ Response: { translatedData: object }
```

#### [NEW] `app/api/cv-extract/route.ts`
```
POST /api/cv-extract
Body: { base64: string, mimeType: string }
→ Appel Groq/Gemini Vision côté serveur
→ Response: { extractedData: CvData }
```

#### [NEW] `app/api/remove-bg/route.ts`
```
POST /api/remove-bg
Body: { imageBase64: string }
→ Appel remove.bg côté serveur (clé masquée)
→ Response: { resultBase64: string }
```

#### [NEW] `app/api/upload-photo/route.ts`
```
PUT /api/upload-photo
Body: FormData (file)
→ Proxy vers Cloudflare R2 Worker (secret masqué)
→ Response: { url: string }
```

#### [NEW] `app/api/linkedin-post/route.ts`
```
POST /api/linkedin-post
Body: { cvData: object, publicLink: string }
→ Génération du post via IA
→ Response: { postText: string }
```

---

### Phase 6 — Landing, Discover, Extras

#### [NEW] `app/page.tsx` (Landing)
- Server Component avec scroll animations via client wrapper
- SEO metadata optimisé
- Reprise fidèle du design landing

#### [NEW] `app/decouvrir/page.tsx`
- Fetch Firestore côté serveur (SSR) pour les CVs publics
- Cards avec thèmes individuels

---

### Phase 7 — Export & Polish

#### [MODIFY] Export Image HD
- `html2canvas` côté client (même approche actuelle)
- Option PDF serveur via Puppeteer si validé (Question B)

#### [NEW] `.env.local`
```env
# Firebase (client - public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCNu3jcId3Xscq6KXntioOGhJJxEo2SunE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=samacv-a94fe.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=samacv-a94fe
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=samacv-a94fe.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=170772109161
NEXT_PUBLIC_FIREBASE_APP_ID=1:170772109161:web:979f54c991f1445189cff8

# AI Keys (server-only — NOT prefixed with NEXT_PUBLIC_)
GROQ_API_KEY=gsk_B7q7YizvDRGfNwpwTH5AWGdyb3FY...
GEMINI_API_KEY=<clé Gemini si disponible>

# Cloudflare R2
R2_WORKER_URL=https://samacv-photo-upload.tidjansow12.workers.dev
R2_UPLOAD_SECRET=samacv-upload-2026-secret

# Remove.bg
REMOVE_BG_API_KEY=<clé remove.bg>
```

---

## Verification Plan

### Automated Tests
```bash
npm run build          # Vérifie la compilation TypeScript
npm run lint           # Vérifie le code ESLint
```

### Manual Verification
- [ ] **Auth** : Créer un compte, se connecter, Google Auth
- [ ] **Admin** : Remplir chaque section du CV, sauvegarder, vérifier Firestore
- [ ] **Chatbot Axel** : Conversation complète, suggestions IA, upload fichier
- [ ] **Auto-fill IA** : Upload PDF/image, extraction
- [ ] **Traduction** : Traduire en anglais, vérifier le sélecteur sur le CV public
- [ ] **CV Public** : Vérifier le rendu visuel, animations, responsive
- [ ] **Export HD** : Télécharger l'image, vérifier la qualité
- [ ] **Photo** : Upload, détourage, affichage
- [ ] **QR Code** : Génération, téléchargement
- [ ] **LinkedIn** : Génération de post IA
- [ ] **Superadmin** : Créer/éditer/supprimer un client
- [ ] **Mobile** : Test responsive sur toutes les pages
