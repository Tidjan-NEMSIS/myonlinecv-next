import React from 'react';
import { Education } from '@/lib/types';

interface Props {
  education: Education[];
}

export default function CvEducation({ education }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {education.map((edu, index) => (
        <div key={edu.id || index} className="bg-[#f8fafc] border border-gray-100 p-5 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-color)] group-hover:w-2 transition-all"></div>
          
          <h4 className="text-lg font-bold text-gray-800 mb-1">{edu.degree}</h4>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 text-sm">
            <span className="font-semibold text-[var(--primary-color)]">
              <i className="fas fa-university mr-1"></i> {edu.school}
            </span>
          </div>
          
          {edu.details && (
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {edu.details}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
