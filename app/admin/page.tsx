'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminIndexRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    const checkAndRedirect = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        let slug = data?.profile?.slug;

        // If user logged in via Google and doesn't have a slug yet, auto-generate one
        if (!slug) {
          const baseSlug = (user.displayName || user.email?.split('@')[0] || 'user')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');
          
          slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

          // Update user profile with new slug
          await setDoc(doc(db, 'users', user.uid), {
            profile: { slug }
          }, { merge: true });

          // Claim the slug in slugs collection
          await setDoc(doc(db, 'slugs', slug), {
            uid: user.uid
          });
        }

        router.push(`/admin/${slug}`);
      } catch (error) {
        console.error('Error fetching user data for redirect:', error);
        // Fallback safely
        router.push('/');
      }
    };

    checkAndRedirect();
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Préparation de votre espace...</p>
      </div>
    </div>
  );
}
