import { db } from './firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { CvData, UserProfile } from './types';
import { defaultCvData } from './cv-defaults';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    return userSnap.data().profile as UserProfile;
  }
  return null;
}

export async function getCvData(uid: string): Promise<CvData | null> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    const data = userSnap.data().cvData;
    if (data) {
      return { ...defaultCvData, ...data } as CvData; // Merge with defaults
    }
  }
  return null;
}

export async function updateCvData(uid: string, data: Partial<CvData>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { cvData: data }, { merge: true });
}

export async function deleteUserDocument(uid: string): Promise<void> {
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'users', uid));
}

export async function getCvBySlug(slug: string): Promise<{ uid: string; cvData: CvData; profile: UserProfile } | null> {
  const q = query(collection(db, 'users'), where('profile.slug', '==', slug));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      cvData: { ...defaultCvData, ...(data.cvData || {}) } as CvData,
      profile: data.profile as UserProfile
    };
  }
  return null;
}

export async function getAllUsers(): Promise<{ uid: string; cvData: CvData; profile: UserProfile }[]> {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      uid: doc.id,
      cvData: { ...defaultCvData, ...(data.cvData || {}) } as CvData,
      profile: data.profile as UserProfile
    });
  });
  return users;
}

export async function getPublicCVs(): Promise<{ uid: string; cvData: CvData; profile: UserProfile }[]> {
  const q = query(collection(db, 'users'), where('cvData.isPublic', '==', true));
  const querySnapshot = await getDocs(q);
  const users: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      uid: doc.id,
      cvData: { ...defaultCvData, ...(data.cvData || {}) } as CvData,
      profile: data.profile as UserProfile
    });
  });
  return users;
}
