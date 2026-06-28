'use client';

import React, { useEffect, useState } from 'react';
import { Skill } from '@/lib/types';

interface Props {
  skills: Skill[];
}

export default function CvSkillBars({ skills }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={skill.id || index} className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">{skill.name}</span>
            <span className="text-xs font-medium text-gray-500">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? `${skill.level}%` : '0%' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
