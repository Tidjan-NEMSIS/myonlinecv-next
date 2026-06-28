'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getAllUsers } from '@/lib/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SuperAdminPanel() {
  const { userRole } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'clients'>('analytics');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'superadmin') {
      loadUsers();
    }
  }, [userRole]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      showToast('Erreur lors de la récupération des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'superadmin') {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="fas fa-lock text-4xl mb-4 text-gray-300"></i>
        <h2 className="text-xl font-semibold mb-2">Accès Restreint</h2>
        <p>Vous n'avez pas les droits nécessaires pour accéder à ce panneau.</p>
      </div>
    );
  }

  const handleEditClient = (uid: string, slug?: string) => {
    window.location.href = `/admin/${slug || 'superadmin-view'}?edit=${uid}`;
  };

  const handleDeleteClient = async (uid: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce compte utilisateur ? Cette action supprimera son CV public et ses données de profil de façon permanente.")) {
      try {
        const { deleteUserDocument } = await import('@/lib/firestore');
        await deleteUserDocument(uid);
        setUsers(users.filter(u => u.uid !== uid));
        showToast('Utilisateur supprimé avec succès', 'success');
      } catch (error) {
        console.error("Erreur suppression:", error);
        showToast('Erreur lors de la suppression', 'error');
      }
    }
  };

  // Analytics Computations
  const totalUsers = users.length;
  const totalViews = users.reduce((sum, u) => sum + (u.cvData?.views || 0), 0);
  
  const registrationMap = users.reduce((acc, u) => {
    const ts = u.profile?.createdAt;
    const dateObj = ts ? new Date(ts) : new Date();
    const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const registrationData = Object.entries(registrationMap)
    .map(([date, count]) => ({ date, inscrits: count }))
    .sort((a, b) => a.date.localeCompare(b.date)); // Simple string sort for demonstration

  const topCvs = [...users]
    .sort((a, b) => (b.cvData?.views || 0) - (a.cvData?.views || 0))
    .slice(0, 5)
    .map(u => ({
      name: u.profile?.name || u.profile?.email || 'Inconnu',
      vues: u.cvData?.views || 0
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#1a3a5c]">Espace Super Admin</h2>
          <p className="text-sm text-gray-500">Supervisez l'application, les métriques et les comptes clients.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'bg-white shadow-sm text-[#1a3a5c]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-pie mr-2"></i> Analytiques
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'clients' ? 'bg-white shadow-sm text-[#1a3a5c]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('clients')}
          >
            <i className="fas fa-users mr-2"></i> Utilisateurs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner spinner-dark"></div>
        </div>
      ) : activeTab === 'analytics' ? (
        
        /* ANALYTICS TAB */
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Utilisateurs inscrits</p>
                <p className="text-3xl font-black text-blue-900">{totalUsers}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl shrink-0">
                <i className="fas fa-eye"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Vues totales des CVs</p>
                <p className="text-3xl font-black text-green-900">{totalViews}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Inscriptions par date</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
                    <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="inscrits" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Top 5 CVs les plus vus</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCvs} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#555' }} />
                    <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="vues" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

      ) : (

        /* CLIENTS TAB */
        <div className="animate-fade-in overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 rounded-tl-lg">Utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Lien Public</th>
                <th className="p-4">Vues</th>
                <th className="p-4">Inscription</th>
                <th className="p-4 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isPub = u.cvData?.isPublic;
                const dateObj = u.profile?.createdAt ? new Date(u.profile.createdAt) : null;
                const dateStr = dateObj ? dateObj.toLocaleDateString('fr-FR') : 'N/A';
                return (
                  <tr key={u.uid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {u.profile?.name || 'Sans Nom'}
                      {u.profile?.isPremium && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PRO</span>}
                    </td>
                    <td className="p-4">{u.profile?.email}</td>
                    <td className="p-4">
                      {u.profile?.slug ? (
                        <a href={`/cv/${u.profile.slug}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          /{u.profile.slug}
                        </a>
                      ) : <span className="text-gray-400">Pas de slug</span>}
                      {isPub ? <span className="ml-2 text-xs text-green-500"><i className="fas fa-globe"></i></span> : <span className="ml-2 text-xs text-red-400"><i className="fas fa-lock"></i></span>}
                    </td>
                    <td className="p-4 font-medium">{u.cvData?.views || 0}</td>
                    <td className="p-4 text-gray-500">{dateStr}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Modifier (Accès Admin)"
                          onClick={() => handleEditClient(u.uid, u.profile?.slug)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                          onClick={() => handleDeleteClient(u.uid)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
