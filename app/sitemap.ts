import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mycvonline.web.app';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/decouvrir`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ];

  try {
    // Fetch all public CVs
    const usersSnapshot = await adminDb.collection('users').get();
    
    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.cvData && data.cvData.isPublic && data.profile && data.profile.slug) {
        routes.push({
          url: `${baseUrl}/cv/${data.profile.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  } catch (error) {
    console.error('Error fetching CVs for sitemap:', error);
  }

  return routes;
}
