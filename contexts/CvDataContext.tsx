'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { getCvData, updateCvData } from '@/lib/firestore';
import { CvData } from '@/lib/types';
import { defaultCvData } from '@/lib/cv-defaults';

interface CvDataContextType {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
  saveSection: (sectionData: Partial<CvData>, showNotification?: boolean) => Promise<void>;
  loading: boolean;
  reload: () => Promise<void>;
}

const CvDataContext = createContext<CvDataContextType | undefined>(undefined);

export const CvDataProvider: React.FC<{ children: React.ReactNode, targetUid?: string }> = ({ children, targetUid }) => {
  const { user, userRole } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const editUid = searchParams.get('edit');
  const [cvData, setCvData] = useState<CvData>(defaultCvData);
  const [loading, setLoading] = useState(true);

  const uid = targetUid || (userRole === 'superadmin' ? editUid : null) || user?.uid;

  const loadData = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getCvData(uid);
      if (data) {
        setCvData(data);
      }
    } catch (error) {
      console.error('Error loading CV data', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, [uid, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveSection = async (sectionData: Partial<CvData>, showNotification = true) => {
    if (!uid) return;
    try {
      await updateCvData(uid, sectionData);
      setCvData(prev => ({ ...prev, ...sectionData }));
      if (showNotification) {
        showToast('Sauvegardé avec succès !', 'success');
      }
    } catch (error) {
      console.error('Error saving CV section', error);
      if (showNotification) {
        showToast('Erreur lors de la sauvegarde', 'error');
      }
    }
  };

  return (
    <CvDataContext.Provider value={{ cvData, setCvData, saveSection, loading, reload: loadData }}>
      {children}
    </CvDataContext.Provider>
  );
};

export const useCvDataContext = () => {
  const context = useContext(CvDataContext);
  if (context === undefined) {
    throw new Error('useCvDataContext must be used within a CvDataProvider');
  }
  return context;
};
