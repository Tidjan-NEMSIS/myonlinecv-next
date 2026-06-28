'use client';

import React, { useState, useEffect } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { Skill } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export default function SkillsPanel() {
  const { cvData, saveSection, loading } = useCvData();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (cvData?.skills) {
      setSkills(cvData.skills);
    }
  }, [cvData]);

  const handleAddSkill = () => {
    setSkills([...skills, { id: uuidv4(), name: '', level: 50 }]);
  };

  const handleUpdateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(
      skills.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    saveSection({ skills });
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Compétences Techniques</h2>
          <p className="text-sm text-gray-500">Ajoutez vos compétences et leur niveau de maîtrise.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fas fa-save mr-2"></i> Enregistrer
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.id} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
              onClick={() => handleDeleteSkill(skill.id)}
              title="Supprimer"
            >
              <i className="fas fa-trash-alt"></i>
            </button>

            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compétence
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ex: React, Node.js, Python..."
                  value={skill.name}
                  onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau ({skill.level}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={skill.level}
                  onChange={(e) => handleUpdateSkill(skill.id, 'level', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            Aucune compétence ajoutée.
          </div>
        )}

        <button
          className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          onClick={handleAddSkill}
        >
          <i className="fas fa-plus mr-2"></i> Ajouter une compétence
        </button>
      </div>
    </div>
  );
}
