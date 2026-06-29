import React from 'react';
import { getCvBySlug } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import CvRoot from '@/components/cv/CvRoot';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Génération dynamique des métadonnées pour le SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCvBySlug(resolvedParams.slug);
  
  if (!data || !data.cvData.isPublic) {
    return {
      title: 'CV Non Trouvé | MyOnlineCV',
    };
  }

  const { personal } = data.cvData;
  const title = `CV de ${personal.fullname || 'Utilisateur'}${personal.title ? ` - ${personal.title}` : ''}`;
  const description = personal.about || `Découvrez le profil professionnel de ${personal.fullname || 'cet utilisateur'}.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://mycvonline.web.app/cv/${resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://mycvonline.web.app/cv/${resolvedParams.slug}`,
      siteName: 'MyOnlineCV',
      images: data.cvData.photoBase64 ? [
        {
          url: data.cvData.photoBase64,
          width: 800,
          height: 800,
          alt: `Photo de ${personal.fullname}`,
        }
      ] : [],
      locale: 'fr_FR',
      type: 'profile',
    },
    twitter: {
      card: data.cvData.photoBase64 ? 'summary_large_image' : 'summary',
      title,
      description,
      images: data.cvData.photoBase64 ? [data.cvData.photoBase64] : [],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function PublicCvPage({ params }: Props) {
  const resolvedParams = await params;
  const data = await getCvBySlug(resolvedParams.slug);

  if (!data || !data.cvData.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <CvRoot cvData={data.cvData} profile={data.profile} />
    </div>
  );
}
