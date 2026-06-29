'use client';

import React, { useState, useRef, useEffect, useCallback, PointerEvent } from 'react';
import { useCvData } from '@/hooks/useCvData';
import Image from 'next/image';
import type { CvData, Experience, Education, Skill, Language } from '@/lib/types';

// ═══════════════════════════════════════════
// FIELD DEFINITIONS — same structure as the original chatbot.js
// ═══════════════════════════════════════════
interface CvField {
  key: string;
  label: string;
  question: string;
  panelId: string;
  noSuggest?: boolean;
}

const CV_FIELDS: CvField[] = [
  { key: 'personal.fullname', label: 'Nom complet', question: '👋 Pour commencer, quel est votre **nom complet** ?', panelId: 'personal', noSuggest: true },
  { key: 'personal.photo', label: 'Photo de profil', question: 'Souhaitez-vous ajouter une **photo de profil** ? (Cliquez sur le bouton + pour importer une image, ou tapez "passer")', panelId: 'personal', noSuggest: true },
  { key: 'personal.title', label: 'Titre professionnel', question: 'Quel est votre **titre professionnel** ? (Ex: Consultant Senior, Développeur Web...)', panelId: 'personal' },
  { key: 'personal.subtitle', label: 'Sous-titre (bannière)', question: 'Souhaitez-vous ajouter un **sous-titre** pour la bannière de votre CV ? (Ex: "Expert en gestion de projets internationaux")', panelId: 'personal' },
  { key: 'personal.location', label: 'Localisation', question: 'Où êtes-vous **situé(e)** ? (Ville, Pays)', panelId: 'personal', noSuggest: true },
  { key: 'personal.phone', label: 'Téléphone', question: 'Quel est votre **numéro de téléphone** ?', panelId: 'personal', noSuggest: true },
  { key: 'personal.email', label: 'Email', question: 'Quelle est votre **adresse email** de contact ?', panelId: 'personal', noSuggest: true },
  { key: 'profile', label: 'Profil professionnel', question: 'Rédigez un court **résumé de votre profil professionnel** (2 à 4 phrases décrivant votre parcours et vos objectifs).', panelId: 'profile' },
  { key: 'expertise', label: "Domaines d'expertise", question: "Quels sont vos **domaines d'expertise** ? (Listez-les séparés par des virgules, ex: Gestion de projet, Suivi-évaluation, Analyse de données)", panelId: 'expertise' },
  { key: 'experiences', label: 'Expériences professionnelles', question: "Décrivez votre **expérience professionnelle la plus récente** :\n\n📌 Dites-moi le **poste**, l'**entreprise/organisation**, la **période** (ex: 2020-2023), le **lieu**, et les **principales tâches** réalisées.\n\n_Vous pourrez en ajouter d'autres ensuite._", panelId: 'experiences' },
  { key: 'education', label: 'Formation', question: "Parlons de votre **formation**. Quel est votre **diplôme le plus élevé** ?\n\n📌 Indiquez le **diplôme**, l'**école/université**, et les **détails** éventuels (mention, spécialisation...)", panelId: 'education' },
  { key: 'itSkills', label: 'Compétences informatiques', question: "Quels **outils informatiques ou logiciels** maîtrisez-vous ? (Ex: Excel, Word, SPSS, Python...)\n\nDites-les séparés par des virgules et j'évaluerai le niveau.", panelId: 'skills' },
  { key: 'languages', label: 'Langues', question: 'Quelles **langues** parlez-vous et à quel niveau ? (Ex: Français - Maternel, Anglais - Courant, Espagnol - Intermédiaire)', panelId: 'languages' },
  { key: 'bailleurs', label: 'Bailleurs / Références', question: 'Avez-vous des **bailleurs ou partenaires de référence** à mentionner ? (Ex: Banque Mondiale, UNICEF, Union Européenne)\n\nSi non, dites "passer".', panelId: 'bailleurs' }
];

// ═══════════════════════════════════════════
// MESSAGE TYPE
// ═══════════════════════════════════════════
type MsgRole = 'user' | 'assistant' | 'summary' | 'suggestion';

interface ChatMessage {
  role: MsgRole;
  content: string;
  fieldLabel?: string; // for summary bubbles
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function isAffirmative(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return ['oui', 'yes', 'o', 'y', 'ouais', 'ok', 'bien sûr', 'absolument', 'affirmatif', 'yep', 'yeah', 'da'].includes(lower);
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// ═══════════════════════════════════════════
// DETECT MISSING FIELDS
// ═══════════════════════════════════════════
function detectMissingFields(cvData: CvData): number[] {
  const missing: number[] = [];

  CV_FIELDS.forEach((field, idx) => {
    if (field.key === 'personal.photo') {
      if (!cvData.photoBase64 || cvData.photoBase64.trim() === '') missing.push(idx);
    } else if (field.key.startsWith('personal.')) {
      const subKey = field.key.split('.')[1] as keyof CvData['personal'];
      const val = cvData.personal?.[subKey];
      if (!val || (typeof val === 'string' && val.trim() === '')) missing.push(idx);
    } else if (field.key === 'profile') {
      if (!cvData.profile || cvData.profile.trim() === '') missing.push(idx);
    } else if (field.key === 'expertise') {
      if (!cvData.expertise || cvData.expertise.length === 0) missing.push(idx);
    } else if (field.key === 'experiences') {
      if (!cvData.experiences || cvData.experiences.length === 0) missing.push(idx);
    } else if (field.key === 'education') {
      if (!cvData.education || cvData.education.length === 0) missing.push(idx);
    } else if (field.key === 'itSkills') {
      if (!cvData.itSkills || cvData.itSkills.length === 0) missing.push(idx);
    } else if (field.key === 'languages') {
      if (!cvData.languages || cvData.languages.length === 0) missing.push(idx);
    } else if (field.key === 'bailleurs') {
      if (!cvData.bailleurs || cvData.bailleurs.length === 0) missing.push(idx);
    }
  });

  return missing;
}

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════
export default function AxelChatbot({
  externalIsOpen,
  setExternalIsOpen,
  onNavigatePanel,
}: {
  externalIsOpen?: boolean;
  setExternalIsOpen?: (isOpen: boolean) => void;
  onNavigatePanel?: (panelId: string) => void;
} = {}) {
  // ── State ──
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = setExternalIsOpen || setInternalIsOpen;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  // Co-remplissage state
  const [missingFields, setMissingFields] = useState<number[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [waitingMoreExp, setWaitingMoreExp] = useState(false);
  const [waitingMoreEdu, setWaitingMoreEdu] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cvData, saveSection, setCvData } = useCvData();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (hasStarted && missingFields.length > 0 && CV_FIELDS[missingFields[0]].key === 'personal.photo') {
      // Photo logic
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const updatedCv = { ...cvData, photoBase64: base64 };
        setCvData(updatedCv);
        await saveSection(updatedCv, false);
        
        addBotMsg('✅ Photo importée avec succès !');
        const updatedMissing = missingFields.slice(1);
        setMissingFields(updatedMissing);
        setTimeout(() => askNextQuestion(updatedMissing), 1000);
      };
      reader.readAsDataURL(file);
    } else {
      // Auto-fill logic
      addBotMsg("⏳ Analyse de votre document en cours... (Fonctionnalité d'autoremplissage en développement)");
      // TODO: Connect to backend for PDF parsing and extraction
    }
  };

  // ── Auto-scroll ──
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ── Start conversation when opened ──
  useEffect(() => {
    if (isOpen && !hasStarted) {
      startConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ═══════════════════════════════════════
  // START CONVERSATION
  // ═══════════════════════════════════════
  function startConversation() {
    const missing = detectMissingFields(cvData);
    setMissingFields(missing);
    setWaitingMoreExp(false);
    setWaitingMoreEdu(false);
    setHasStarted(true);

    if (missing.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '🎉 Votre CV est déjà bien rempli ! Tous les champs principaux sont complétés. Vous pouvez modifier les informations directement dans les formulaires à gauche.'
      }]);
      return;
    }

    const totalMissing = missing.length;
    setMessages([{
      role: 'assistant',
      content: `👋 Bonjour ! Je suis **Axel**, votre assistant IA. J'ai détecté **${totalMissing} section${totalMissing > 1 ? 's' : ''}** à compléter dans votre CV. Commençons !`
    }]);

    // Ask first question after a short delay
    setTimeout(() => {
      const fieldIdx = missing[0];
      const field = CV_FIELDS[fieldIdx];
      setCurrentFieldIndex(fieldIdx);
      if (onNavigatePanel) onNavigatePanel(field.panelId);
      addBotMsg(field.question);
    }, 800);
  }

  // ═══════════════════════════════════════
  // ASK NEXT QUESTION
  // ═══════════════════════════════════════
  function askNextQuestion(remainingFields: number[]) {
    if (remainingFields.length === 0) {
      addBotMsg('✅ **Formidable !** Votre CV est maintenant complet ! Toutes les informations ont été enregistrées.');
      // Auto-save everything
      saveSection(cvData, false);
      return;
    }

    const fieldIdx = remainingFields[0];
    const field = CV_FIELDS[fieldIdx];
    setCurrentFieldIndex(fieldIdx);
    if (onNavigatePanel) onNavigatePanel(field.panelId);
    addBotMsg(field.question);
  }

  // ═══════════════════════════════════════
  // HANDLE SEND
  // ═══════════════════════════════════════
  const handleSend = async (overrideText?: string) => {
    const text = typeof overrideText === 'string' ? overrideText.trim() : input.trim();
    if (!text || isTyping) return;

    if (typeof overrideText !== 'string') {
      setInput('');
      inputRef.current?.focus();
    }

    addUserMsg(text);

    // ── Skip / Passer ──
    if (text.toLowerCase() === 'passer' || text.toLowerCase() === 'skip') {
      const updated = missingFields.slice(1);
      setMissingFields(updated);
      setWaitingMoreExp(false);
      setWaitingMoreEdu(false);
      addBotMsg('⏩ D\'accord, on passe à la suite !');
      setTimeout(() => askNextQuestion(updated), 600);
      return;
    }

    // ── "Add more" flow for experiences ──
    if (waitingMoreExp) {
      if (isAffirmative(text)) {
        setWaitingMoreExp(false);
        addBotMsg('📝 Décrivez votre expérience suivante :\n\n📌 **Poste**, **Entreprise**, **Période**, **Lieu** et **Tâches principales**.');
        return;
      } else {
        setWaitingMoreExp(false);
        const updated = missingFields.slice(1);
        setMissingFields(updated);
        addBotMsg('👍 Parfait, continuons !');
        setTimeout(() => askNextQuestion(updated), 600);
        return;
      }
    }

    // ── "Add more" flow for education ──
    if (waitingMoreEdu) {
      if (isAffirmative(text)) {
        setWaitingMoreEdu(false);
        addBotMsg('🎓 Décrivez votre formation suivante :\n\n📌 **Diplôme**, **École/Université**, **Détails** (mention, spécialité...)');
        return;
      } else {
        setWaitingMoreEdu(false);
        const updated = missingFields.slice(1);
        setMissingFields(updated);
        addBotMsg('👍 Parfait, on continue !');
        setTimeout(() => askNextQuestion(updated), 600);
        return;
      }
    }

    // ── Free-form chat if no missing fields ──
    if (missingFields.length === 0 && !waitingMoreExp && !waitingMoreEdu) {
      setIsTyping(true);
      try {
        const result = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'chat',
            // Pass all previous messages plus the new one
            messages: [...messages, { role: 'user', content: text }],
            cvData
          })
        });

        if (!result.ok) throw new Error('API error');
        const data = await result.json();
        addBotMsg(data.reply);
      } catch (err) {
        console.error('Chatbot error:', err);
        addBotMsg('⚠️ Désolé, j\'ai rencontré une erreur de connexion.');
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // ── Process the answer via AI extraction ──
    const fieldIdx = currentFieldIndex;
    const field = CV_FIELDS[fieldIdx];

    setIsTyping(true);

    try {
      const result = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'extract',
          userText: text,
          fieldKey: field.key,
          fieldLabel: field.label,
          fieldQuestion: field.question,
          cvData
        })
      });

      if (!result.ok) throw new Error('API error');
      const extracted = await result.json();

      if (extracted.invalid) {
        addBotMsg(extracted.suggestion || '⚠️ Votre réponse semble inappropriée pour ce champ. Pouvez-vous reformuler ?');
        setIsTyping(false);
        return; // Wait for another response to the same field
      }

      // Apply the extracted data to cvData
      const updatedCv = applyExtractedData(field.key, extracted, cvData);
      setCvData(updatedCv);
      await saveSection(updatedCv, false);

      setIsTyping(false);

      // For experiences & education, ask if they want more
      if (field.key === 'experiences') {
        setWaitingMoreExp(true);
        addSummaryMsg(field.label, text);
        addBotMsg('✅ Expérience ajoutée ! Souhaitez-vous en **ajouter une autre** ? (Oui / Non)');
        return;
      }
      if (field.key === 'education') {
        setWaitingMoreEdu(true);
        addSummaryMsg(field.label, text);
        addBotMsg('✅ Formation ajoutée ! Souhaitez-vous en **ajouter une autre** ? (Oui / Non)');
        return;
      }

      // Move to next
      const updated = missingFields.slice(1);
      setMissingFields(updated);
      addSummaryMsg(field.label, text);
      setTimeout(() => askNextQuestion(updated), 1200);

    } catch (err) {
      console.error('Chatbot error:', err);
      setIsTyping(false);
      addBotMsg('⚠️ Désolé, j\'ai eu un souci pour interpréter votre réponse. Pourriez-vous reformuler ?');
    }
  };

  // ═══════════════════════════════════════
  // AI SUGGEST
  // ═══════════════════════════════════════
  const handleSuggest = async () => {
    const field = CV_FIELDS[currentFieldIndex];
    setIsSuggesting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'suggest',
          fieldKey: field.key,
          fieldLabel: field.label,
          fieldQuestion: field.question,
          cvData
        })
      });

      if (!res.ok) throw new Error('Suggestion failed');
      const data = await res.json();
      const suggestionText = data.suggestion?.trim() || '';
      if (suggestionText) {
        setMessages(prev => [...prev, { role: 'suggestion', content: suggestionText }]);
        setInput('');
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  // ═══════════════════════════════════════
  // APPLY EXTRACTED DATA
  // ═══════════════════════════════════════
  function applyExtractedData(fieldKey: string, extracted: any, current: CvData): CvData {
    const updated = { ...current };

    if (fieldKey.startsWith('personal.')) {
      const subKey = fieldKey.split('.')[1] as keyof CvData['personal'];
      updated.personal = { ...updated.personal, [subKey]: extracted.value || '' };
    } else if (fieldKey === 'profile') {
      updated.profile = extracted.value || '';
    } else if (fieldKey === 'expertise') {
      const items: string[] = extracted.items || [];
      updated.expertise = [...(updated.expertise || []), ...items];
    } else if (fieldKey === 'bailleurs') {
      const items: string[] = extracted.items || [];
      updated.bailleurs = [...(updated.bailleurs || []), ...items];
    } else if (fieldKey === 'experiences') {
      const exp: Experience = {
        role: extracted.role || '',
        org: extracted.org || '',
        date: extracted.date || '',
        location: extracted.location || '',
        tasks: extracted.tasks || []
      };
      updated.experiences = [...(updated.experiences || []), exp];
    } else if (fieldKey === 'education') {
      const edu: Education = {
        degree: extracted.degree || '',
        school: extracted.school || '',
        details: extracted.details || ''
      };
      updated.education = [...(updated.education || []), edu];
    } else if (fieldKey === 'itSkills') {
      const skills: Skill[] = (extracted.skills || []).map((s: any) => ({
        id: crypto.randomUUID(),
        name: s.name || '',
        level: s.level || 70
      }));
      updated.itSkills = [...(updated.itSkills || []), ...skills];
    } else if (fieldKey === 'languages') {
      const langs: Language[] = (extracted.languages || []).map((l: any) => ({
        id: crypto.randomUUID(),
        name: l.name || '',
        level: l.label || l.level?.toString() || ''
      }));
      updated.languages = [...(updated.languages || []), ...langs];
    }

    return updated;
  }

  // ═══════════════════════════════════════
  // MESSAGE HELPERS
  // ═══════════════════════════════════════
  function addBotMsg(content: string) {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  }

  function addUserMsg(content: string) {
    setMessages(prev => [...prev, { role: 'user', content }]);
  }

  function addSummaryMsg(label: string, raw: string) {
    setMessages(prev => [...prev, {
      role: 'summary',
      content: raw.length > 150 ? raw.substring(0, 150) + '...' : raw,
      fieldLabel: label
    }]);
  }

  // ═══════════════════════════════════════
  // RESTART
  // ═══════════════════════════════════════
  function handleRestart() {
    setMessages([]);
    setHasStarted(false);
    setMissingFields([]);
    setWaitingMoreExp(false);
    setWaitingMoreEdu(false);
    setTimeout(() => {
      setHasStarted(false);
      startConversation();
    }, 100);
  }

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  const currentField = CV_FIELDS[currentFieldIndex];
  const showSuggestBtn = !waitingMoreExp && !waitingMoreEdu && missingFields.length > 0;
  const progressPct = CV_FIELDS.length > 0
    ? Math.round(((CV_FIELDS.length - missingFields.length) / CV_FIELDS.length) * 100)
    : 100;

  // ── DRAG HANDLERS ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: dragStartRef.current.initialX + dx,
      y: dragStartRef.current.initialY + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110]">
      {/* ── CHAT WINDOW ── */}
      <div
        className={`fixed md:absolute inset-0 md:inset-auto md:bottom-20 md:right-0 w-full md:w-[420px] h-[100dvh] md:h-[560px] md:max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-2xl rounded-none md:rounded-3xl shadow-2xl border border-white/60 transition-all origin-bottom-right flex flex-col overflow-hidden z-[111] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'
        } ${isDragging ? 'duration-0' : 'duration-500'}`}
        style={typeof window !== 'undefined' && window.innerWidth > 768 ? { transform: isOpen ? `translate(${position.x}px, ${position.y}px) scale(1)` : `translate(${position.x}px, ${position.y}px) scale(0)` } : { transform: isOpen ? 'scale(1)' : 'scale(0)' }}
      >
        {/* ── HEADER (DRAGGABLE) ── */}
        <div 
          className="h-16 bg-gradient-to-r from-[var(--primary)] to-[#1a3a5c] flex items-center justify-between px-5 shrink-0 md:cursor-move select-none"
          onPointerDown={(e) => {
            if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
            handlePointerDown(e);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20">
              <div className="relative w-8 h-8 mix-blend-multiply">
                <Image src="/assets/images/Axel_chatbot.png" alt="Axel" fill className="object-contain" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Axel IA</h3>
              <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Co-remplissage
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRestart} className="text-white/50 hover:text-white transition-colors" title="Recommencer">
              <i className="fas fa-redo text-xs"></i>
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="px-5 py-2 bg-gray-50/80 border-b border-gray-100">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
            <span>Progression du CV</span>
            <span className="font-semibold text-[var(--primary)]">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/30">
          {messages.map((msg, i) => {
            // Summary bubble
            if (msg.role === 'summary') {
              return (
                <div key={i} className="mx-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                    <i className="fas fa-check-circle"></i>
                    Enregistré : {msg.fieldLabel}
                  </div>
                  <div className="text-emerald-600">{msg.content}</div>
                </div>
              );
            }

            // Suggestion bubble
            if (msg.role === 'suggestion') {
              return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm bg-blue-50 border border-blue-100">
                    <div className="text-blue-800 font-medium mb-2 text-xs flex items-center gap-1.5">
                      <i className="fas fa-magic"></i> Suggestion de l&apos;IA :
                    </div>
                    <div className="text-gray-700 italic mb-3">&quot;{msg.content}&quot;</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSend(msg.content)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                      >
                        <i className="fas fa-check mr-1"></i> Valider
                      </button>
                      <button
                        onClick={handleSuggest}
                        disabled={isSuggesting}
                        className="flex-1 py-1.5 px-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSuggesting ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-redo mr-1"></i>}
                        Mieux
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // User / Assistant
            return (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--primary)] font-medium rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                />
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── SUGGEST BUTTON ── */}
        {showSuggestBtn && (
          <div className="px-4 py-2 border-t border-gray-100 bg-white/80">
            <button
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[var(--primary)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 rounded-xl py-2 transition-colors disabled:opacity-50"
            >
              {isSuggesting ? (
                <><i className="fas fa-spinner fa-spin"></i> Analyse en cours...</>
              ) : (
                <><i className="fas fa-wand-magic-sparkles"></i> Laisse l&apos;IA suggérer cette réponse</>
              )}
            </button>
          </div>
        )}

        {/* ── INPUT AREA ── */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-1 border border-gray-200 focus-within:border-[var(--accent)] focus-within:bg-white transition-all">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept={hasStarted && missingFields.length > 0 && CV_FIELDS[missingFields[0]].key === 'personal.photo' ? 'image/*' : '.pdf,.doc,.docx'} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 shrink-0 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors mb-0.5"
              title="Ajouter un document ou une photo"
            >
              <i className="fas fa-plus"></i>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={waitingMoreExp || waitingMoreEdu ? 'Oui / Non...' : 'Votre réponse...'}
              className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none resize-none px-3 py-3 text-sm text-gray-700 custom-scrollbar"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center disabled:opacity-50 hover:bg-[#1a3a5c] transition-colors mb-0.5 mr-0.5"
            >
              <i className="fas fa-paper-plane text-sm -ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'bg-white text-[var(--primary)] scale-90'
            : 'bg-white text-[var(--accent)] hover:scale-110 hover:shadow-[0_8px_25px_rgba(26,58,92,0.4)] animate-bounce-slow border-2 border-[var(--primary)]'
        }`}
      >
        {isOpen ? (
          <i className="fas fa-times text-2xl"></i>
        ) : (
          <div className="w-12 h-12 relative mix-blend-multiply">
            <Image src="/assets/images/Axel_chatbot.png" alt="Axel" fill className="object-contain" />
          </div>
        )}
      </button>
    </div>
  );
}
