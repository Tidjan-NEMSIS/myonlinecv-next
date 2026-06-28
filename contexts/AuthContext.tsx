'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  UserCredential,
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, pass: string, name: string, slug: string) => Promise<void>;
  signOut: () => Promise<void>;
  userRole: 'admin' | 'superadmin' | null;
  userProfile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => { return {} as UserCredential; },
  signUpWithEmail: async () => {},
  signOut: async () => {},
  userRole: null,
  userProfile: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'superadmin' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user document to check role
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role || 'admin');
            setUserProfile(data.profile || null);
          } else {
            // Create base doc for new user
            const newProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || '',
              slug: '',
              isPremium: false,
              createdAt: Date.now()
            };
            await setDoc(doc(db, 'users', currentUser.uid), {
              profile: newProfile,
              role: 'admin'
            }, { merge: true });
            setUserRole('admin');
            setUserProfile(newProfile as unknown as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('admin');
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, slug: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    // Note: The doc creation logic is handled in the onAuthStateChanged listener,
    // but for the slug, we need to save it to the profile.
    // So let's create the doc directly here to ensure the slug is saved.
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      profile: {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        slug: slug,
        createdAt: Date.now()
      },
      role: 'admin'
    }, { merge: true });
    
    // Also save the slug mapping
    await setDoc(doc(db, 'slugs', slug), {
      uid: userCredential.user.uid
    });
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, userRole, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
